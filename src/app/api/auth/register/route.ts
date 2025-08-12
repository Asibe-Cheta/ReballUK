import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { z } from "zod"
import { db, withRetry, ensureConnection } from "@/lib/db"
import { registerFormSchema } from "@/types/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Registration request body:", JSON.stringify(body, null, 2))
    
    // Reset and test database connection first
    try {
      await ensureConnection()
      console.log("Database connection reset and verified")
    } catch (dbError) {
      console.error("Database connection failed:", dbError)
      return NextResponse.json(
        { 
          success: false, 
          error: "Database connection failed",
          details: process.env.NODE_ENV === 'development' ? dbError : 'Database unavailable'
        },
        { status: 500 }
      )
    }
    
    // Validate input data with safer parsing
    const validationResult = registerFormSchema.safeParse(body)
    
    if (!validationResult.success) {
      console.log("Validation failed:", validationResult.error.errors)
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid form data: " + validationResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
          details: validationResult.error.errors,
          receivedData: body
        },
        { status: 400 }
      )
    }
    
    const { name, email, password, position } = validationResult.data

    // Check if user already exists
    const existingUser = await withRetry(async () => {
      return await db.user.findUnique({
        where: { email }
      })
    })

    if (existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          error: "User already exists",
          field: "email"
        },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create user and profile using raw SQL (same approach as Simple Registration)
    console.log("Starting user creation with raw SQL...")
    
    // Generate unique IDs
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const profileId = `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    try {
      console.log("Creating user with raw SQL...")
      
      // Create user
      await db.$executeRaw`
        INSERT INTO "users" (
          "id", "name", "email", "password", "emailVerified", 
          "createdAt", "updatedAt"
        ) VALUES (
          ${userId}, ${name}, ${email}, ${hashedPassword}, NOW(),
          NOW(), NOW()
        )
      `
      
      console.log("User created successfully, now creating profile...")
      
      // Create profile
      await db.$executeRaw`
        INSERT INTO "profiles" (
          "id", "userId", "firstName", "lastName", "position", 
          "trainingLevel", "onboardingCompleted", "preferredLanguage", 
          "timezone", "isActive", "createdAt", "updatedAt"
        ) VALUES (
          ${profileId}, ${userId}, ${name.split(' ')[0] || name}, 
          ${name.split(' ').slice(1).join(' ') || ''}, ${position},
          'BEGINNER', false, 'en', 'UTC', true, NOW(), NOW()
        )
      `
      
      console.log("Profile created successfully!")
      
      const result = {
        user: {
          id: userId,
          name,
          email,
          emailVerified: new Date(),
        },
        profile: {
          id: profileId,
          userId,
          firstName: name.split(' ')[0] || name,
          lastName: name.split(' ').slice(1).join(' ') || '',
          position,
        }
      }
    } catch (sqlError) {
      console.error("Raw SQL user creation failed:", sqlError)
      
      // Handle duplicate email error
      if (sqlError instanceof Error && sqlError.message.includes('unique constraint')) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Email already registered",
            field: "email"
          },
          { status: 400 }
        )
      }
      
      throw sqlError
    }

    // Return success response (without password)
    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        position,
      }
    })

  } catch (error) {
    console.error("Registration error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      type: error?.constructor?.name,
      error: error
    })
    
    if (error instanceof z.ZodError) {
      console.log("Zod validation errors:", error.errors)
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid form data: " + error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
          details: error.errors,
          field: error.errors[0]?.path[0] // First error field
        },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      // Handle specific database errors
      if (error.message.includes("Unique constraint")) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Email already registered",
            field: "email"
          },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { 
        success: false, 
        error: "Registration failed. Please try again."
      },
      { status: 500 }
    )
  }
}
