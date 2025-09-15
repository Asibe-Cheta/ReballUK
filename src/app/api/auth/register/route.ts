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
    
    // Add timeout to database query
    const existingUsersResult = await Promise.race([
      db.query(
        'SELECT id, email, "emailVerified" FROM "User" WHERE email = $1',
        [email.toLowerCase()]
      ),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database query timeout')), 10000)
      )
    ]) as any
    
    if (existingUsersResult.rows.length > 0) {
      const existingUser = existingUsersResult.rows[0]
      console.log("User already exists:", email, "ID:", existingUser.id, "Verified:", existingUser.emailVerified)
      return NextResponse.json(
        { success: false, error: "User with this email already exists" },
        { status: 409 }
      )
    }

    // Hash password
    console.log("Hashing password...")
    const hashedPassword = await hashPassword(password)

    // Create user using direct database connection
    console.log("Creating user in database...")
    const userId = createId()
    const now = new Date()
    
    const createUserResult = await Promise.race([
      db.query(
        `INSERT INTO "User" (id, name, email, password, role, "emailVerified", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id, name, email, "emailVerified"`,
        [userId, name.trim(), email.toLowerCase(), hashedPassword, 'USER', false, now, now]
      ),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database query timeout')), 10000)
      )
    ]) as any
    
    const user = createUserResult.rows[0]
    console.log("User created successfully:", user.id, "Email:", user.email, "Verified:", user.emailVerified)

    // Create basic profile record
    console.log("Creating basic profile...")
    try {
      const profileId = createId()
      await db.query(
        `INSERT INTO "Profile" (id, "userId", "completedOnboarding", "isActive", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [profileId, user.id, false, true, now, now]
      )
      console.log("Basic profile created successfully")
    } catch (profileError) {
      console.error("Failed to create profile:", profileError)
      // Don't fail registration if profile creation fails
    }

    // Create verification token
    console.log("Creating verification token...")
    const verificationToken = await createVerificationToken(user.id)

    // Send verification email
    try {
      console.log("Sending verification email...")
      await sendVerificationEmail(user.email, user.name, verificationToken)
      console.log("Verification email sent successfully")
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError)
      // Don't fail the registration if email fails
    }

    return NextResponse.json({
      success: true,
      message: "Registration successful. Please check your email to verify your account.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
      }
    })

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
