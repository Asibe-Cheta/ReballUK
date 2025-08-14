import { NextRequest, NextResponse } from "next/server"
import { getFreshDbClient } from "@/lib/db"
import { compare } from "bcryptjs"

export async function POST(request: NextRequest) {
  const freshDb = getFreshDbClient()
  
  try {
    console.log("=== TESTING LOGIN DIRECTLY ===")
    
    const body = await request.json()
    const { email, password } = body
    
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password required" },
        { status: 400 }
      )
    }
    
    console.log("Testing login for email:", email)
    
    // Find user by email using fresh client with raw SQL
    const userResult = await freshDb.$queryRaw`
      SELECT id, name, email, password 
      FROM users 
      WHERE email = ${email} 
      LIMIT 1
    `
    
    console.log("User query result:", userResult)
    
    const user = Array.isArray(userResult) && userResult.length > 0 ? userResult[0] : null

    if (!user || !user.password) {
      console.log("User not found or no password")
      await freshDb.$disconnect()
      return NextResponse.json({
        success: false,
        error: "User not found or no password",
        userExists: !!user,
        hasPassword: user ? !!user.password : false
      })
    }

    console.log("User found:", { id: user.id, name: user.name, email: user.email, hasPassword: !!user.password })

    // Verify password
    const isValidPassword = await compare(password, user.password)
    console.log("Password valid:", isValidPassword)
    
    // Clean up fresh client
    await freshDb.$disconnect()
    
    return NextResponse.json({
      success: true,
      userFound: true,
      passwordValid: isValidPassword,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    })
    
  } catch (error) {
    console.error("Direct login test error:", error)
    
    // Clean up fresh client on error
    try {
      await freshDb.$disconnect()
    } catch (disconnectError) {
      console.error("Failed to disconnect fresh client:", disconnectError)
    }
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
