import { NextRequest, NextResponse } from "next/server"
import { validateDatabaseConnection, healthCheck } from "@/lib/db"
import { env } from "@/lib/env-validation"

// GET /api/health - Database health check
export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Performing health check...")
    
    // Validate environment variables
    const envCheck = {
      DATABASE_URL: !!env.DATABASE_URL,
      DIRECT_URL: !!env.DIRECT_URL,
      NEXTAUTH_SECRET: !!env.NEXTAUTH_SECRET,
      GOOGLE_CLIENT_ID: !!env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: !!env.GOOGLE_CLIENT_SECRET,
    }

    // Database connection check
    const dbConnection = await validateDatabaseConnection()
    
    // Full health check
    const healthData = await healthCheck()
    
    const status = dbConnection.isConnected ? 200 : 503
    
    return NextResponse.json({
      success: dbConnection.isConnected,
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: env.NODE_ENV,
        variables: envCheck,
      },
      database: {
        connected: dbConnection.isConnected,
        latency: dbConnection.latency,
        error: dbConnection.error,
        version: healthData.version,
      },
      services: {
        nextauth: envCheck.NEXTAUTH_SECRET && envCheck.GOOGLE_CLIENT_ID,
        prisma: dbConnection.isConnected,
      }
    }, { status })
    
  } catch (error) {
    console.error("❌ Health check failed:", error)
    
    return NextResponse.json({
      success: false,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error",
      database: {
        connected: false,
      }
    }, { status: 503 })
  }
}
