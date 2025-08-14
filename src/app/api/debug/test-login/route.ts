import { NextRequest, NextResponse } from "next/server"
import { getFreshDbClient } from "@/lib/db"
import { compare } from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ 
        error: "Email and password are required" 
      }, { status: 400 })
    }

    const freshDb = getFreshDbClient()
    
    try {
      console.log("Testing login for email:", email)
      
      // Check if user exists
      const userResult = await freshDb.$queryRaw`
        SELECT id, name, email, password 
        FROM users 
        WHERE email = ${email} 
        LIMIT 1
      `
      
      const user = Array.isArray(userResult) && userResult.length > 0 ? userResult[0] : null

      if (!user) {
        return NextResponse.json({ 
          error: "User not found",
          email: email,
          userExists: false
        }, { status: 404 })
      }

      if (!user.password) {
        return NextResponse.json({ 
          error: "User has no password (OAuth account)",
          email: email,
          userExists: true,
          hasPassword: false
        }, { status: 400 })
      }

      // Test password
      const isValidPassword = await compare(password, user.password)

      return NextResponse.json({
        success: true,
        userExists: true,
        hasPassword: true,
        passwordValid: isValidPassword,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      })

    } finally {
      await freshDb.$disconnect()
    }

  } catch (error) {
    console.error("Debug login test error:", error)
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
