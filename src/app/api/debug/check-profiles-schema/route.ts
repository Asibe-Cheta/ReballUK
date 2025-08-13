import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    console.log("=== CHECKING PROFILES TABLE SCHEMA ===")
    
    // Get the actual columns in the profiles table
    const columns = await db.$queryRaw`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'profiles' 
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `
    
    // Get sample data to see what's actually there
    const sampleData = await db.$queryRaw`
      SELECT * FROM profiles LIMIT 1
    `
    
    console.log("Profiles table columns:", columns)
    console.log("Sample data:", sampleData)
    
    return NextResponse.json({
      success: true,
      columns,
      sampleData,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error("Error checking profiles schema:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
