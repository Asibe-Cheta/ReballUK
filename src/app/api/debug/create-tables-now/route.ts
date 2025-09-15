import { NextResponse } from "next/server"
import { getDbClient } from "@/lib/db-direct"

export async function GET() {
  try {
    console.log("Creating database tables...")
    const db = await getDbClient()
    
    // Create User table
    await db.query(`
      CREATE TABLE IF NOT EXISTS "User" (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE NOT NULL,
        "emailVerified" BOOLEAN DEFAULT false,
        image TEXT,
        password TEXT,
        role TEXT DEFAULT 'USER',
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log("User table created/verified")

    // Create VerificationToken table
    await db.query(`
      CREATE TABLE IF NOT EXISTS "VerificationToken" (
        identifier TEXT NOT NULL,
        token TEXT PRIMARY KEY,
        expires TIMESTAMP NOT NULL
      )
    `)
    console.log("VerificationToken table created/verified")

    // Create Profile table
    await db.query(`
      CREATE TABLE IF NOT EXISTS "Profile" (
        id TEXT PRIMARY KEY,
        "userId" TEXT UNIQUE NOT NULL,
        "firstName" TEXT,
        "lastName" TEXT,
        position TEXT,
        "trainingLevel" TEXT,
        "dateOfBirth" DATE,
        "preferredFoot" TEXT,
        height INTEGER,
        weight INTEGER,
        bio TEXT,
        goals TEXT[],
        "confidenceRating" INTEGER,
        "completedOnboarding" BOOLEAN DEFAULT false,
        "isActive" BOOLEAN DEFAULT true,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
      )
    `)
    console.log("Profile table created/verified")

    return NextResponse.json({
      success: true,
      message: "Database tables created successfully"
    })

  } catch (error) {
    console.error("Create tables error:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to create tables",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
