import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { z } from "zod"
import { db, withRetry } from "@/lib/db"
import { registerFormSchema } from "@/types/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Registration request body:", JSON.stringify(body, null, 2))
    
    // Test database connection first
    try {
      await db.$connect()
      console.log("Database connection successful")
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

    // Create user and profile in transaction
    console.log("Starting user creation transaction...")
    const result = await withRetry(async () => {
      return await db.$transaction(async (tx) => {
        console.log("Creating user with data:", { name, email, position })
        
        // Create user
        const user = await tx.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
            emailVerified: new Date(), // Auto-verify for now
          }
        })
        
        console.log("User created successfully with ID:", user.id)

        // Create profile
        console.log("Creating profile for user:", user.id)
        const profile = await tx.profile.create({
          data: {
            userId: user.id,
            firstName: name.split(' ')[0] || name,
            lastName: name.split(' ').slice(1).join(' ') || '',
            position,
            trainingLevel: "BEGINNER", // Default level
            onboardingCompleted: false,
            preferredLanguage: "en",
            timezone: "UTC",
            isActive: true,
          }
        })
        
        console.log("Profile created successfully with ID:", profile.id)
        return { user, profile }
      })
    })

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
