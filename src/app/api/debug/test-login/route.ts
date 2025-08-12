import { NextRequest, NextResponse } from "next/server"
import { compare } from "bcryptjs"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body
    
    console.log("=== LOGIN DEBUG START ===")
    console.log("Attempting login for:", email)
    
    // Find user using raw SQL (same approach as registration)
    const users = await db.$queryRaw<Array<{
      id: string
      name: string
      email: string
      password: string
    }>>`
      SELECT id, name, email, password 
      FROM "users" 
      WHERE email = ${email} 
      LIMIT 1
    `
    
    const user = users[0]
    
    if (!user) {
      console.log("User not found")
      return NextResponse.json({
        success: false,
        error: "User not found"
      }, { status: 404 })
    }
    
    console.log("User found:", { id: user.id, name: user.name, hasPassword: !!user.password })
    
    if (!user.password) {
      console.log("User has no password (OAuth only)")
      return NextResponse.json({
        success: false,
        error: "This account was created with Google OAuth. Please sign in with Google."
      }, { status: 400 })
    }
    
    // Verify password
    const isValidPassword = await compare(password, user.password)
    console.log("Password valid:", isValidPassword)
    
    if (!isValidPassword) {
      return NextResponse.json({
        success: false,
        error: "Invalid password"
      }, { status: 401 })
    }
    
    console.log("=== LOGIN DEBUG SUCCESS ===")
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    })
    
  } catch (error) {
    console.error("=== LOGIN DEBUG ERROR ===")
    console.error("Error:", error)
    
    return NextResponse.json({
      success: false,
      error: "Login failed",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
