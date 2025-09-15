import { NextResponse } from "next/server"
import { getDbClient } from "@/lib/db-direct"
import { createId } from "@paralleldrive/cuid2"

export async function POST() {
  try {
    console.log("Testing registration components...")
    
    // Test CUID generation
    const testId = createId()
    console.log("Generated CUID:", testId)
    
    // Test database connection
    const db = await getDbClient()
    console.log("Database connection successful")
    
    // Test basic query
    const result = await db.query('SELECT NOW() as current_time')
    console.log("Database query successful:", result.rows[0])
    
    // Test User table exists
    const userTableCheck = await db.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'User'
      )
    `)
    console.log("User table exists:", userTableCheck.rows[0].exists)
    
    // Test Profile table exists
    const profileTableCheck = await db.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'Profile'
      )
    `)
    console.log("Profile table exists:", profileTableCheck.rows[0].exists)
    
    return NextResponse.json({
      success: true,
      message: "All registration components working",
      data: {
        cuid: testId,
        databaseConnected: true,
        userTableExists: userTableCheck.rows[0].exists,
        profileTableExists: profileTableCheck.rows[0].exists,
        currentTime: result.rows[0].current_time
      }
    })
    
  } catch (error) {
    console.error("Registration test error:", error)
    return NextResponse.json({
      success: false,
      error: "Registration test failed",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
