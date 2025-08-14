import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { getFreshDbClient } from "@/lib/db"
import { generateVerificationToken, storeVerificationToken, generateVerificationUrl } from "@/lib/verification"
import { EmailService } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { name, email, password, confirmPassword, position, agreeToTerms, agreeToPrivacy } = body
    
    // Basic validation
    if (!name || !email || !password || !confirmPassword || !position) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      )
    }
    
    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: "Passwords do not match" },
        { status: 400 }
      )
    }
    
    if (!agreeToTerms || !agreeToPrivacy) {
      return NextResponse.json(
        { success: false, error: "Please agree to Terms and Privacy Policy" },
        { status: 400 }
      )
    }
    
    // Use a fresh database client to avoid prepared statement conflicts
    const freshDb = getFreshDbClient()
    
    try {
      // Hash password
      const hashedPassword = await hash(password, 12)
      
      // Create user with raw SQL using fresh client (unverified)
      const userResult = await freshDb.$queryRaw`
        INSERT INTO users (id, name, email, password, "emailVerified", "createdAt", "updatedAt")
        VALUES (gen_random_uuid()::text, ${name}, ${email}, ${hashedPassword}, NULL, NOW(), NOW())
        RETURNING id, name, email
      `
      console.log("User INSERT successful, result:", userResult)
      
      if (!Array.isArray(userResult) || userResult.length === 0) {
        throw new Error("Failed to create user")
      }
      
      const user = userResult[0]
      console.log("User created:", user.email)
      
      // Create profile with raw SQL using fresh client - using only columns that exist
      // Based on the error, we know these columns exist: id, userId, firstName, lastName, position, trainingLevel, isActive, created_at, updated_at
      const profileResult = await freshDb.$queryRaw`
        INSERT INTO profiles (id, "userId", "firstName", "lastName", position, "trainingLevel", "isActive", "created_at", "updated_at")
        VALUES (
          gen_random_uuid()::text, 
          ${user.id}, 
          ${name.split(' ')[0] || name}, 
          ${name.split(' ').slice(1).join(' ') || ''}, 
          ${position}::text, 
          'BEGINNER', 
          true, 
          NOW(), 
          NOW()
        )
        RETURNING id, "userId"
      `
      
      if (!Array.isArray(profileResult) || profileResult.length === 0) {
        throw new Error("Failed to create profile")
      }
      
      console.log("Profile created successfully!")
      
      // Generate verification token and send email
      const verificationToken = generateVerificationToken()
      const verificationUrl = generateVerificationUrl(verificationToken.token)
      
      // Store verification token
      const tokenStored = await storeVerificationToken(user.id, verificationToken.token, verificationToken.expires)
      
      if (!tokenStored) {
        console.error("Failed to store verification token")
        // Continue anyway - user can request new verification email
      }
      
      // Send verification email
      const emailSent = await EmailService.sendVerificationEmail({
        name: user.name,
        email: user.email,
        verificationToken: verificationToken.token,
        verificationUrl
      })
      
      if (!emailSent) {
        console.error("Failed to send verification email")
        // Continue anyway - user can request new verification email
      }
      
      console.log("=== SIMPLE REGISTRATION API SUCCESS ===")
      
      // Clean up fresh database client
      await freshDb.$disconnect()
      
      return NextResponse.json({
        success: true,
        message: "Account created successfully! Please check your email to verify your account.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        requiresVerification: true
      })
      
    } catch (sqlError) {
      console.error("=== SQL OPERATION FAILED ===")
      console.error("SQL Error:", sqlError)
      console.error("SQL Error message:", sqlError instanceof Error ? sqlError.message : "Unknown error")
      console.error("SQL Error stack:", sqlError instanceof Error ? sqlError.stack : "No stack")
      
      // Check for specific SQL errors
      if (sqlError instanceof Error) {
        if (sqlError.message.includes('duplicate key') || 
            sqlError.message.includes('already exists') ||
            sqlError.message.includes('unique constraint') ||
            sqlError.message.includes('violates unique constraint')) {
          console.log("=== DUPLICATE EMAIL DETECTED DURING INSERT ===")
          console.log("Duplicate email:", email)
          return NextResponse.json(
            { success: false, error: "Email already registered" },
            { status: 409 }
          )
        }
        
        // Check for missing column errors
        if (sqlError.message.includes('column') && sqlError.message.includes('does not exist')) {
          console.error("Schema mismatch detected:", sqlError.message)
          return NextResponse.json(
            { success: false, error: "Database schema issue. Please contact support." },
            { status: 500 }
          )
        }
      }
      
      // Clean up fresh database client on error
      try {
        await freshDb.$disconnect()
      } catch (disconnectError) {
        console.error("Failed to disconnect fresh client:", disconnectError)
      }
      
      throw sqlError
    }
    
  } catch (error) {
    console.error("=== SIMPLE REGISTRATION API ERROR ===")
    console.error("Error:", error)
    console.error("Error message:", error instanceof Error ? error.message : "Unknown error")
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack")
    
    // Check for specific database errors
    let errorMessage = "Registration failed. Please try again."
    let statusCode = 500
    
    if (error instanceof Error) {
      if (error.message.includes('duplicate key') || error.message.includes('already exists')) {
        errorMessage = "Email already registered"
        statusCode = 409
      } else if (error.message.includes('prepared statement')) {
        errorMessage = "Database connection issue. Please try again."
        statusCode = 500
      } else if (error.message.includes('column') && error.message.includes('does not exist')) {
        errorMessage = "Database schema issue. Please contact support."
        statusCode = 500
      }
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: statusCode }
    )
  }
}
