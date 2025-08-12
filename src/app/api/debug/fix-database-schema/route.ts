import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    console.log("=== FIXING DATABASE SCHEMA ===")
    
         // Add missing columns to users table
     await db.$executeRaw`
       ALTER TABLE "users" 
       ADD COLUMN IF NOT EXISTS "email_verified" TIMESTAMP(3),
       ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) DEFAULT NOW(),
       ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) DEFAULT NOW()
     `
    
    // Add missing columns to profiles table if they don't exist
    await db.$executeRaw`
      ALTER TABLE "profiles" 
      ADD COLUMN IF NOT EXISTS "first_name" TEXT,
      ADD COLUMN IF NOT EXISTS "last_name" TEXT,
      ADD COLUMN IF NOT EXISTS "date_of_birth" TIMESTAMP(3),
      ADD COLUMN IF NOT EXISTS "training_level" TEXT,
      ADD COLUMN IF NOT EXISTS "confidence_rating" INTEGER,
      ADD COLUMN IF NOT EXISTS "preferred_foot" TEXT,
      ADD COLUMN IF NOT EXISTS "height" INTEGER,
      ADD COLUMN IF NOT EXISTS "weight" INTEGER,
      ADD COLUMN IF NOT EXISTS "bio" TEXT,
      ADD COLUMN IF NOT EXISTS "goals" TEXT,
      ADD COLUMN IF NOT EXISTS "phone_number" TEXT,
      ADD COLUMN IF NOT EXISTS "emergency_contact" TEXT,
      ADD COLUMN IF NOT EXISTS "medical_info" TEXT,
      ADD COLUMN IF NOT EXISTS "is_active" BOOLEAN DEFAULT TRUE,
      ADD COLUMN IF NOT EXISTS "completed_onboarding" BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) DEFAULT NOW(),
      ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) DEFAULT NOW()
    `
    
    // Verify the columns exist
    const userColumns = await db.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name IN ('email_verified', 'created_at', 'updated_at')
    `
    
    const profileColumns = await db.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'profiles' 
      AND column_name IN ('first_name', 'last_name', 'training_level', 'completed_onboarding')
    `
    
    console.log("Database schema fixed successfully")
    
    return NextResponse.json({
      success: true,
      message: "Database schema fixed successfully",
      userColumns: userColumns,
      profileColumns: profileColumns
    })
    
  } catch (error) {
    console.error("Error fixing database schema:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
