import { NextRequest, NextResponse } from "next/server"
import { resetDatabaseConnection } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    console.log("=== RESETTING DATABASE CONNECTION ===")
    
    const success = await resetDatabaseConnection()
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: "Database connection reset successfully"
      })
    } else {
      return NextResponse.json({
        success: false,
        error: "Failed to reset database connection"
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error("Database connection reset error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
