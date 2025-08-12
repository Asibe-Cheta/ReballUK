import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    console.log("=== TESTING SESSION ===")
    
    // Test session retrieval
    const session = await auth()
    console.log("Session from auth():", session ? {
      user: session.user ? { id: session.user.id, name: session.user.name, email: session.user.email } : null,
      expires: session.expires
    } : null)
    
    // Test database connection using Prisma ORM
    const dbTest = await db.user.count()
    console.log("Database connection test:", { userCount: dbTest })
    
    // Test user table
    const userCount = await db.user.count()
    console.log("User count:", userCount)
    
    // Test sessions table
    const sessionCount = await db.session.count()
    console.log("Session count:", sessionCount)
    
    return NextResponse.json({
      success: true,
      session: session ? {
        user: session.user ? { id: session.user.id, name: session.user.name, email: session.user.email } : null,
        expires: session.expires
      } : null,
      dbTest,
      userCount,
      sessionCount
    })
    
  } catch (error) {
    console.error("Session test error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
