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
    
    // Check if user already exists
    console.log("Checking if user exists...")
    const existingUser = await db.$executeRaw`
      SELECT id FROM "users" WHERE email = ${email} LIMIT 1
    `
    
    if (existingUser) {
      console.log("User already exists")
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 400 }
      )
    }
    
    // Hash password
    console.log("Hashing password...")
    const hashedPassword = await hash(password, 12)
    
    // Generate IDs
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const profileId = `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    console.log("Creating user with ID:", userId)
    
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
    console.log("=== SIMPLE REGISTRATION API SUCCESS ===")
    
    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      user: {
        id: userId,
        name,
        email
      }
    })
    
  } catch (error) {
    console.error("=== SIMPLE REGISTRATION API ERROR ===")
    console.error("Error:", error)
    console.error("Error message:", error instanceof Error ? error.message : "Unknown error")
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack")
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Registration failed. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
