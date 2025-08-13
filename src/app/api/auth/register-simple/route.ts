import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    console.log("=== SIMPLE REGISTRATION API START ===")
    
    const body = await request.json()
    console.log("Received body:", body)
    
    const { name, email, password, confirmPassword, position, agreeToTerms, agreeToPrivacy } = body
    
    // Basic validation
    if (!name || !email || !password || !confirmPassword || !position) {
      console.log("Missing required fields")
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      )
    }
    
    if (password !== confirmPassword) {
      console.log("Passwords don't match")
      return NextResponse.json(
        { success: false, error: "Passwords do not match" },
        { status: 400 }
      )
    }
    
    if (!agreeToTerms || !agreeToPrivacy) {
      console.log("Terms not agreed to")
      return NextResponse.json(
        { success: false, error: "Please agree to Terms and Privacy Policy" },
        { status: 400 }
      )
    }
    
    // Skip the email check for now to avoid prepared statement conflicts
    // We'll let the database handle duplicate detection during INSERT
    console.log("Skipping email existence check to avoid prepared statement conflicts")
    console.log("Registration will proceed and let database handle duplicate detection")
    
    // Hash password
    console.log("Hashing password...")
    const hashedPassword = await hash(password, 12)
    
    console.log("Creating user and profile with raw SQL...")
    
    // Use raw SQL for all operations to avoid prepared statement conflicts
    try {
      // Create user with raw SQL
      const userResult = await db.$queryRaw`
        INSERT INTO users (id, name, email, password, "emailVerified", "createdAt", "updatedAt")
        VALUES (gen_random_uuid()::text, ${name}, ${email}, ${hashedPassword}, NOW(), NOW(), NOW())
        RETURNING id, name, email
      `
      
      if (!Array.isArray(userResult) || userResult.length === 0) {
        throw new Error("Failed to create user")
      }
      
      const user = userResult[0]
      console.log("User created:", user.email)
      
      // Create profile with raw SQL - using only columns that exist
      // Based on the error, we know these columns exist: id, userId, firstName, lastName, position, trainingLevel, isActive, created_at, updated_at
      const profileResult = await db.$queryRaw`
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
      console.log("=== SIMPLE REGISTRATION API SUCCESS ===")
      
      return NextResponse.json({
        success: true,
        message: "Account created successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      })
      
    } catch (sqlError) {
      console.error("SQL operation failed:", sqlError)
      
      // Check for specific SQL errors
      if (sqlError instanceof Error) {
        if (sqlError.message.includes('duplicate key') || 
            sqlError.message.includes('already exists') ||
            sqlError.message.includes('unique constraint') ||
            sqlError.message.includes('violates unique constraint')) {
          console.log("Duplicate email detected during INSERT")
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
