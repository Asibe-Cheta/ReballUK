import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    console.log("=== FIXING DATABASE SCHEMA ===")
    
    // Reset database connection to avoid prepared statement conflicts
    await db.$disconnect()
    await new Promise(resolve => setTimeout(resolve, 200))
    await db.$connect()
    
    const results = []
    
    // Add missing columns to users table - one by one to avoid conflicts
    try {
      await db.$executeRaw`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "email_verified" TIMESTAMP(3)`
      results.push("Added email_verified to users table")
    } catch (error) {
      results.push(`email_verified: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    
    try {
      await db.$executeRaw`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) DEFAULT NOW()`
      results.push("Added created_at to users table")
    } catch (error) {
      results.push(`created_at: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    
    try {
      await db.$executeRaw`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) DEFAULT NOW()`
      results.push("Added updated_at to users table")
    } catch (error) {
      results.push(`updated_at: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    
    // Reset connection again before profiles table
    await db.$disconnect()
    await new Promise(resolve => setTimeout(resolve, 200))
    await db.$connect()
    
    // Add missing columns to profiles table - one by one
    const profileColumns = [
      'first_name TEXT',
      'last_name TEXT', 
      'date_of_birth TIMESTAMP(3)',
      'training_level TEXT',
      'confidence_rating INTEGER',
      'preferred_foot TEXT',
      'height INTEGER',
      'weight INTEGER',
      'bio TEXT',
      'goals TEXT',
      'phone_number TEXT',
      'emergency_contact TEXT',
      'medical_info TEXT',
      'is_active BOOLEAN DEFAULT TRUE',
      'completed_onboarding BOOLEAN DEFAULT FALSE',
      'created_at TIMESTAMP(3) DEFAULT NOW()',
      'updated_at TIMESTAMP(3) DEFAULT NOW()'
    ]
    
    for (const columnDef of profileColumns) {
      try {
        await db.$executeRaw`ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS ${db.$raw(columnDef)}`
        results.push(`Added ${columnDef.split(' ')[0]} to profiles table`)
      } catch (error) {
        results.push(`${columnDef.split(' ')[0]}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
    
    // Verify the columns exist
    const userColumns = await db.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name IN ('email_verified', 'created_at', 'updated_at')
    `
    
    const profileColumnsCheck = await db.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'profiles' 
      AND column_name IN ('first_name', 'last_name', 'training_level', 'completed_onboarding')
    `
    
    console.log("Database schema fix completed")
    
    return NextResponse.json({
      success: true,
      message: "Database schema fix completed",
      results: results,
      userColumns: userColumns,
      profileColumns: profileColumnsCheck
    })
    
  } catch (error) {
    console.error("Error fixing database schema:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
