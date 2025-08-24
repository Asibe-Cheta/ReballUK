import { NextResponse } from "next/server"

// GET /api/health - Simple health check
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      status: "healthy",
      message: "REBALL API is running"
    }, { status: 200 })
    
  } catch (error) {
    console.error("❌ Health check failed:", error)
    
    return NextResponse.json({
      success: false,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error",
      status: "unhealthy"
    }, { status: 503 })
  }
}
