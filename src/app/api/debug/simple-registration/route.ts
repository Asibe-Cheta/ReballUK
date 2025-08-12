import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { db } from "@/lib/db"
import { registerFormSchema } from "@/types/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Simple registration attempt:", body)
    
    // Validate input
    const validation = registerFormSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: "Validation failed",
        details: validation.error.errors
      }, { status: 400 })
    }
    
    const { name, email, password, position } = validation.data
    
    // Generate unique IDs
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const profileId = `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Hash password
    const hashedPassword = await hash(password, 12)
    
    // Use raw SQL to avoid Prisma connection issues
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
    
    console.log("User created, now creating profile...")
    
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
    
    return NextResponse.json({
      success: true,
      message: "User registered successfully with raw SQL",
      user: {
        id: userId,
        name,
        email,
        position
      }
    })
    
  } catch (error) {
    console.error("Simple registration error:", error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Registration failed",
      details: error instanceof Error ? error.stack : "Unknown error"
    }, { status: 500 })
  }
}
