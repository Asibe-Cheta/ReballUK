import { NextRequest, NextResponse } from "next/server"
import { getDbClient } from "@/lib/db-direct"
import { hashPassword, isValidEmail, validatePassword, createVerificationToken } from "@/lib/auth-utils"
import { sendVerificationEmail } from "@/lib/email"
import { createId } from "@paralleldrive/cuid2"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    console.log("Registration attempt:", { name, email, hasPassword: !!password })

    // Validate input
    if (!name || !email || !password) {
      console.log("Missing required fields:", { name: !!name, email: !!email, password: !!password })
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      )
    }

    // Validate email format
    if (!isValidEmail(email)) {
      console.log("Invalid email format:", email)
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Validate password strength
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      console.log("Password validation failed:", passwordValidation.errors)
      return NextResponse.json(
        { success: false, error: "Password validation failed", details: passwordValidation.errors },
        { status: 400 }
      )
    }

    // Check if user already exists using direct database connection
    console.log("Checking for existing user...")
    const db = await getDbClient()
    
    // Test database connection first
    try {
      await db.query('SELECT 1')
      console.log("Database connection verified")
    } catch (dbError) {
      console.error("Database connection test failed:", dbError)
      return NextResponse.json(
        { success: false, error: "Database connection failed" },
        { status: 503 }
      )
    }
    
    // Add timeout to database query
    const existingUsersResult = await Promise.race([
      db.query(
        'SELECT id, email FROM users WHERE email = $1',
        [email.toLowerCase()]
      ),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database query timeout')), 10000)
      )
    ]) as any
    
    if (existingUsersResult.rows.length > 0) {
      const existingUser = existingUsersResult.rows[0]
      console.log("User already exists:", email, "ID:", existingUser.id)
      return NextResponse.json(
        { success: false, error: "User with this email already exists" },
        { status: 409 }
      )
    }

    // Hash password
    console.log("Hashing password...")
    const hashedPassword = await hashPassword(password)

    // Since we're using Supabase Auth, we don't create users manually
    // The user will be created by Supabase Auth when they sign up
    // For now, let's return an error asking user to use Google OAuth
    return NextResponse.json(
      { success: false, error: "Please use Google sign-in for registration" },
      { status: 400 }
    )

          } catch (error) {
          console.error("Registration error details:", error)
          console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")
          
          // Check if it's a database connection error
          if (error instanceof Error && error.message.includes('ECONNREFUSED')) {
            return NextResponse.json(
              { success: false, error: "Database connection failed. Please try again in a moment." },
              { status: 503 }
            )
          }
          
          return NextResponse.json(
            { success: false, error: "Registration failed", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
          )
        }
}
