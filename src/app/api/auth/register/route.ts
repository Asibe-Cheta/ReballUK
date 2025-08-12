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

    // Create user and profile using Prisma operations
    console.log("Starting user creation with Prisma...")
    
    // Generate unique IDs
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const profileId = `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    try {
      console.log("Creating user with Prisma...")
      
      // Create user and profile in a transaction
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
        
        console.log("User created successfully, now creating profile...")
        
        // Create profile
        const profile = await tx.profile.create({
          data: {
            id: profileId,
            userId: userId,
            firstName: name.split(' ')[0] || name,
            lastName: name.split(' ').slice(1).join(' ') || '',
            position,
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
      
    } catch (prismaError) {
      console.error("Prisma user creation failed:", prismaError)
      
      // Handle duplicate email error
      if (prismaError instanceof Error && prismaError.message.includes('Unique constraint')) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Email already registered",
            field: "email"
          },
          { status: 400 }
        )
      }
      
      throw prismaError
    }

    // Return success response (without password)
    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      user: {
        id: userId,
        name,
        email,
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
      
      // Handle prepared statement errors
      if (error.message.includes("prepared statement")) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Database connection issue. Please try again.",
            field: "general"
          },
          { status: 500 }
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
