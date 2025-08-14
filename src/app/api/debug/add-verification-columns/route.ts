import { NextResponse } from "next/server"
import { getFreshDbClient } from "@/lib/db"

export async function POST() {
  try {
    const freshDb = getFreshDbClient()
    
    // Add verification columns to users table
    await freshDb.$executeRaw`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS verification_token TEXT,
      ADD COLUMN IF NOT EXISTS verification_expires TIMESTAMP
    `
    
    await freshDb.$disconnect()
    
    return NextResponse.json({
      success: true,
      message: "Verification columns added successfully"
    })
    
  } catch (error) {
    console.error("Add verification columns error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to add verification columns" },
      { status: 500 }
    )
  }
}
