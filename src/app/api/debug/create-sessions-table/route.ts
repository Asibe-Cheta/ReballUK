import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    console.log("=== CREATING SESSIONS TABLE ===")
    
    // Create sessions table
    await db.$executeRaw`
      CREATE TABLE IF NOT EXISTS "sessions" (
        "id" TEXT NOT NULL,
        "session_token" TEXT NOT NULL,
        "user_id" TEXT NOT NULL,
        "expires" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
      )
    `
    
    // Create unique index on session_token
    await db.$executeRaw`
      CREATE UNIQUE INDEX IF NOT EXISTS "sessions_session_token_key" ON "sessions"("session_token")
    `
    
    // Create index on user_id
    await db.$executeRaw`
      CREATE INDEX IF NOT EXISTS "sessions_user_id_idx" ON "sessions"("user_id")
    `
    
    // Verify table exists
    const tableExists = await db.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'sessions'
      )
    `
    
    console.log("Sessions table created successfully")
    
    return NextResponse.json({
      success: true,
      message: "Sessions table created successfully",
      tableExists: tableExists[0]?.exists
    })
    
  } catch (error) {
    console.error("Error creating sessions table:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
