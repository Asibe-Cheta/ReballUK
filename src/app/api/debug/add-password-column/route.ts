import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    console.log("=== ADD PASSWORD COLUMN API START ===")
    
    // Check if password column already exists
    const checkColumn = await db.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name = 'password'
    `
    
    if (Array.isArray(checkColumn) && checkColumn.length > 0) {
      console.log("Password column already exists")
      return NextResponse.json({
        success: true,
        message: "Password column already exists",
        details: "Column 'password' is already present in users table"
      })
    }
    
    // Add password column
    console.log("Adding password column to users table...")
    await db.$executeRaw`
      ALTER TABLE users 
      ADD COLUMN password TEXT
    `
    
    console.log("Password column added successfully!")
    
    return NextResponse.json({
      success: true,
      message: "Password column added successfully",
      details: "Added 'password' column to users table"
    })
    
  } catch (error) {
    console.error("=== ADD PASSWORD COLUMN API ERROR ===")
    console.error("Error:", error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to add password column",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
