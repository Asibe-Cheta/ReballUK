import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST() {
  try {
    console.log("Checking if we can use Prisma to push schema...")
    
    // First, let's see what tables currently exist
    const existingTables = await db.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    ` as Array<{table_name: string}>
    
    console.log("Existing tables:", existingTables)
    
    // Check if tables exist
    const hasUsers = existingTables.some(t => t.table_name === 'users')
    const hasProfiles = existingTables.some(t => t.table_name === 'profiles')
    
    let message = "Database analysis complete"
    let recommendations = []
    
    if (!hasUsers) {
      recommendations.push("Need to create 'users' table")
    }
    
    if (!hasProfiles) {
      recommendations.push("Need to create 'profiles' table")
    }
    
    if (hasUsers && hasProfiles) {
      // Tables exist, try to count
      try {
        const userCount = await db.user.count()
        const profileCount = await db.profile.count()
        message = "Tables exist and are accessible!"
        recommendations.push(`Users: ${userCount}, Profiles: ${profileCount}`)
      } catch (error) {
        recommendations.push(`Tables exist but Prisma can't access them: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
    
    return NextResponse.json({
      success: true,
      message,
      analysis: {
        existingTables: existingTables.map(t => t.table_name),
        hasUsers,
        hasProfiles,
        recommendations
      },
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error("Database analysis error:", error)
    
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
