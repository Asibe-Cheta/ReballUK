import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { db, withRetry } from "@/lib/db"
import { PlayerPosition } from "@prisma/client"

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
    
    // Check if user already exists using withRetry
    console.log("Checking if user exists...")
    const existingUser = await withRetry(async () => {
      return await db.user.findUnique({
        where: { email }
      })
    })
    
    if (existingUser) {
      console.log("User already exists")
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 409 }
      )
    }
    
    // Hash password
    console.log("Hashing password...")
    const hashedPassword = await hash(password, 12)
    
    console.log("Creating user with Prisma ORM...")
    
    // Use withRetry for the entire transaction
    const result = await withRetry(async () => {
      return await db.$transaction(async (tx) => {
        // Create user with correct field names (camelCase for users table)
        const user = await tx.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
            emailVerified: new Date(),
            // createdAt and updatedAt will be handled by Prisma defaults
          }
        })
        
        console.log("User created, now creating profile...")
        
        // Create profile with correct field names (snake_case mapping for profiles table)
        const profile = await tx.profile.create({
          data: {
            userId: user.id,
            firstName: name.split(' ')[0] || name,
            lastName: name.split(' ').slice(1).join(' ') || '',
            position: position as PlayerPosition,
            trainingLevel: 'BEGINNER',
            completedOnboarding: false,
            isActive: true,
            // createdAt and updatedAt will be handled by Prisma defaults with correct mapping
          }
        })
        
        return { user, profile }
      })
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
      } else if (error.message.includes("column") && error.message.includes("does not exist")) {
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
