import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST() {
  try {
    console.log("Attempting to create database tables...")
    
    const results = [];
    
    // Create users table
    try {
      await db.$executeRaw`
        CREATE TABLE IF NOT EXISTS "users" (
          "id" TEXT NOT NULL,
          "name" TEXT,
          "email" TEXT NOT NULL,
          "emailVerified" TIMESTAMP(3),
          "image" TEXT,
          "password" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "users_pkey" PRIMARY KEY ("id")
        )
      `
      results.push("Users table created successfully");
    } catch (error) {
      results.push(`Users table error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    // Create unique index for email
    try {
      await db.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email")`
      results.push("Users email index created");
    } catch (error) {
      results.push(`Users email index error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    // Create profiles table
    try {
      await db.$executeRaw`
        CREATE TABLE IF NOT EXISTS "profiles" (
          "id" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "firstName" TEXT,
          "lastName" TEXT,
          "position" TEXT,
          "trainingLevel" TEXT DEFAULT 'BEGINNER',
          "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
          "preferredLanguage" TEXT DEFAULT 'en',
          "timezone" TEXT DEFAULT 'UTC',
          "isActive" BOOLEAN NOT NULL DEFAULT true,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
        )
      `
      results.push("Profiles table created successfully");
    } catch (error) {
      results.push(`Profiles table error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    // Create unique index for userId
    try {
      await db.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "profiles_userId_key" ON "profiles"("userId")`
      results.push("Profiles userId index created");
    } catch (error) {
      results.push(`Profiles userId index error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    console.log("Table creation results:", results);
    
    // Test the tables
    let userCount = 0;
    let profileCount = 0;
    
    try {
      userCount = await db.user.count();
      profileCount = await db.profile.count();
      results.push(`Tables accessible - Users: ${userCount}, Profiles: ${profileCount}`);
    } catch (error) {
      results.push(`Table access test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    return NextResponse.json({
      success: true,
      message: "Database operation completed",
      results,
      tables: {
        users: { count: userCount },
        profiles: { count: profileCount }
      },
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error("Table creation error:", error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: {
        type: error?.constructor?.name,
        message: error instanceof Error ? error.message : 'No message',
        timestamp: new Date().toISOString()
      }
    }, { status: 500 })
  }
}
