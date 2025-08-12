import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    console.log("Testing database connection...")
    
    // Test basic connection
    await db.$connect()
    console.log("Database connected successfully")
    
    // Test a simple query
    const userCount = await db.user.count()
    console.log("Current user count:", userCount)
    
    // Test if tables exist by checking schema
    const tableInfo = await db.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'profiles')
    `
    
    console.log("Database tables found:", tableInfo)
    
    return NextResponse.json({
      success: true,
      database: {
        connected: true,
        userCount,
        tables: tableInfo,
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
