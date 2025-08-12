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
    
    // Check if user already exists using Prisma ORM
    console.log("Checking if user exists...")
    const existingUser = await db.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      console.log("User already exists")
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 409 } // Conflict status for duplicate
      )
    }
    
    // Hash password
    console.log("Hashing password...")
    const hashedPassword = await hash(password, 12)
    
    // Generate IDs
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const profileId = `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    console.log("Creating user with ID:", userId)
    
    // Create user and profile using Prisma ORM
    console.log("Creating user with Prisma ORM...")
    
    const result = await db.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          id: userId,
          name,
          email,
          password: hashedPassword,
          emailVerified: new Date(),
        }
      })
      
      console.log("User created, now creating profile...")
      
      // Create profile
      const profile = await tx.profile.create({
        data: {
          id: profileId,
          userId: userId,
          firstName: name.split(' ')[0] || name,
          lastName: name.split(' ').slice(1).join(' ') || '',
          position: position as any, // Type assertion for enum
          trainingLevel: 'BEGINNER',
          onboardingCompleted: false,
          preferredLanguage: 'en',
          timezone: 'UTC',
          isActive: true,
        }
      })
      
      return { user, profile }
    })
    
    console.log("Profile created successfully!")
    console.log("=== SIMPLE REGISTRATION API SUCCESS ===")
    
    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email
      }
    })
    
  } catch (error) {
    console.error("=== SIMPLE REGISTRATION API ERROR ===")
    console.error("Error:", error)
    console.error("Error message:", error instanceof Error ? error.message : "Unknown error")
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack")
    
    // Check for specific database errors
    let errorMessage = "Registration failed. Please try again."
    let statusCode = 500
    
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint") || error.message.includes("already exists")) {
        errorMessage = "Email already registered"
        statusCode = 409
      } else if (error.message.includes("prepared statement")) {
        errorMessage = "Database connection issue. Please try again."
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
