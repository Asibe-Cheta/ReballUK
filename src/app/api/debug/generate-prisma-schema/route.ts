import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    console.log("=== GENERATING PRISMA SCHEMA FROM DATABASE ===")
    
    // Reset connection first to avoid prepared statement conflicts
    await db.$disconnect()
    await new Promise(resolve => setTimeout(resolve, 100))
    await db.$connect()
    
    // Get all tables using a simple approach
    const tables = ['users', 'profiles', 'sessions', 'accounts', 'verificationtokens']
    
    const schemaAnalysis = {}
    
    for (const tableName of tables) {
      try {
        // Simple column check for each table
        const tableExists = await db.$queryRaw<Array<{ exists: boolean }>>`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = ${tableName}
          ) as exists
        `
        
        if (!tableExists[0]?.exists) {
          schemaAnalysis[tableName] = { error: 'Table does not exist' }
          continue
        }
        
        // Get columns for each table
        const columns = await db.$queryRaw<Array<{
          column_name: string
          data_type: string
          is_nullable: string
        }>>`
          SELECT 
            column_name,
            data_type,
            is_nullable
          FROM information_schema.columns 
          WHERE table_name = ${tableName}
          AND table_schema = 'public'
          ORDER BY ordinal_position
        `
        
        schemaAnalysis[tableName] = {
          columns: columns,
          exists: true
        }
      } catch (error) {
        schemaAnalysis[tableName] = { 
          error: error instanceof Error ? error.message : 'Unknown error',
          exists: false
        }
      }
    }
    
    const schemaAnalysis = {}
    

    
    console.log("Database schema analysis completed")
    
    return NextResponse.json({
      success: true,
      message: "Database schema analysis completed",
      schemaAnalysis,
      tables: tables
    })
    
  } catch (error) {
    console.error("Error analyzing database schema:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
