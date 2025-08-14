import { NextRequest, NextResponse } from "next/server"
import { getFreshDbClient } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const freshDb = getFreshDbClient()
    
    // Check profiles table structure
    const schemaResult = await freshDb.$queryRaw`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'profiles' 
      ORDER BY ordinal_position
    `
    
    // Check if there's any data
    const dataResult = await freshDb.$queryRaw`
      SELECT COUNT(*) as count FROM profiles
    `
    
    await freshDb.$disconnect()
    
    return NextResponse.json({
      success: true,
      schema: schemaResult,
      dataCount: dataResult
    })
    
  } catch (error) {
    console.error("Schema check error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to check schema" },
      { status: 500 }
    )
  }
}
