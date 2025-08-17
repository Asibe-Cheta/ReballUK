import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Check what tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `

    // Try to check if User table exists specifically
    let userTableExists = false
    try {
      await prisma.$queryRaw`SELECT 1 FROM "User" LIMIT 1`
      userTableExists = true
    } catch (error) {
      userTableExists = false
    }

    return NextResponse.json({
      success: true,
      tables: tables,
      userTableExists: userTableExists,
      tableCount: Array.isArray(tables) ? tables.length : 0
    })

  } catch (error) {
    console.error("Check tables error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to check tables", details: error },
      { status: 500 }
    )
  }
}
