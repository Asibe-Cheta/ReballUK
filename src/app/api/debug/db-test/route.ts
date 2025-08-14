import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Test basic database connection
    const { db } = await import("@/lib/db")
    
    console.log("Testing database connection...")
    
    // Simple query to test connection
    const result = await db.$queryRaw`SELECT 1 as test`
    
    console.log("Database connection successful:", result)
    
    return NextResponse.json({
      success: true,
      message: "Database connection working",
      result: result
    })

  } catch (error) {
    console.error("Database connection test failed:", error)
    return NextResponse.json({ 
      success: false,
      error: "Database connection failed",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
