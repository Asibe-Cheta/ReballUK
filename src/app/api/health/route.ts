import { NextResponse } from "next/server"
import { validateDatabaseConnection, db } from "@/lib/db"
import { env } from "@/lib/env-validation"

// GET /api/health - Database health check
export async function GET() {
  try {
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
    
    // Simple database version check
    const versionResult = await db.$queryRaw`SELECT version() as version`
    const healthData = { version: Array.isArray(versionResult) && versionResult[0] ? (versionResult[0] as Record<string, unknown>).version : 'Unknown' }
    
    const status = dbConnection ? 200 : 503
    
    return NextResponse.json({
      success: dbConnection,
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: env.NODE_ENV,
        variables: envCheck,
      },
      database: {
        connected: dbConnection,
        version: healthData.version,
      },
      services: {
        nextauth: envCheck.NEXTAUTH_SECRET && envCheck.GOOGLE_CLIENT_ID,
        prisma: dbConnection,
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
