import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ 
        error: "Email parameter is required" 
      }, { status: 400 })
    }

    console.log("Checking for user with email:", email)
    
    // Simple query to check if user exists
    const users = await db.$queryRaw`
      SELECT id, name, email, 
             CASE WHEN password IS NOT NULL THEN 'has_password' ELSE 'no_password' END as password_status
      FROM users 
      WHERE email = ${email} 
      LIMIT 1
    `
    
    const user = Array.isArray(users) && users.length > 0 ? users[0] : null

    return NextResponse.json({
      email: email,
      userExists: !!user,
      user: user ? {
        id: user.id,
        name: user.name,
        email: user.email,
        passwordStatus: user.password_status
      } : null
    })

  } catch (error) {
    console.error("Check user error:", error)
    return NextResponse.json({ 
      error: "Database error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
