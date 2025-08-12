import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    console.log("Testing database connection...")
    
    // Test basic connection
    await db.$connect()
    console.log("Database connected successfully")
    
    // Get all tables in the database
    const allTables = await db.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `
    
    console.log("All tables in database:", allTables)
    
    // Test specific auth tables
    const authTables = await db.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%user%' OR table_name LIKE '%profile%' OR table_name LIKE '%auth%'
    `
    
    console.log("Auth tables found:", authTables)
    
    return NextResponse.json({
      success: true,
      database: {
        connected: true,
        allTables,
        authTables,
        message: "Database connected - check tables above",
        timestamp: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error("Database test error:", error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown database error',
      details: {
        type: error?.constructor?.name,
        message: error instanceof Error ? error.message : 'No message',
        timestamp: new Date().toISOString()
      }
    }, { status: 500 })
  }
}
