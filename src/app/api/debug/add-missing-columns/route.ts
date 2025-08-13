import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    console.log("=== ADDING MISSING COLUMNS ===")
    
    // Use a simple approach that avoids prepared statement conflicts
    const results = []
    
    // Check if created_at exists in users table
    const checkCreatedAt = await db.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name = 'created_at'
    `
    
    if (checkCreatedAt.length === 0) {
      // Add created_at column
      await db.$executeRaw`ALTER TABLE users ADD COLUMN created_at TIMESTAMP(3) DEFAULT NOW()`
      results.push("Added created_at column to users table")
    } else {
      results.push("created_at column already exists in users table")
    }
    
    // Check if updated_at exists in users table
    const checkUpdatedAt = await db.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name = 'updated_at'
    `
    
    if (checkUpdatedAt.length === 0) {
      // Add updated_at column
      await db.$executeRaw`ALTER TABLE users ADD COLUMN updated_at TIMESTAMP(3) DEFAULT NOW()`
      results.push("Added updated_at column to users table")
    } else {
      results.push("updated_at column already exists in users table")
    }
    
    // Check if email_verified exists in users table
    const checkEmailVerified = await db.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name = 'email_verified'
    `
    
    if (checkEmailVerified.length === 0) {
      // Add email_verified column
      await db.$executeRaw`ALTER TABLE users ADD COLUMN email_verified TIMESTAMP(3)`
      results.push("Added email_verified column to users table")
    } else {
      results.push("email_verified column already exists in users table")
    }
    
    // Verify all columns now exist
    const allColumns = await db.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name IN ('email_verified', 'created_at', 'updated_at')
      ORDER BY column_name
    `
    
    console.log("Missing columns added successfully")
    
    return NextResponse.json({
      success: true,
      message: "Missing columns added successfully",
      results: results,
      existingColumns: allColumns
    })
    
  } catch (error) {
    console.error("Error adding missing columns:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
