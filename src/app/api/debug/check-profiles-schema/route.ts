import { NextResponse } from "next/server"
import { getFreshDbClient } from "@/lib/db"

export async function GET() {
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
    
    // Convert BigInt to number for JSON serialization
    const processedDataResult = Array.isArray(dataResult) && dataResult.length > 0 
      ? [{ count: Number(dataResult[0].count) }] 
      : dataResult
    
    return NextResponse.json({
      success: true,
      schema: schemaResult,
      dataCount: processedDataResult
    })
    
  } catch (error) {
    console.error("Schema check error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to check schema" },
      { status: 500 }
    )
  }
}
