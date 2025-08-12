import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    console.log("=== GENERATING PRISMA SCHEMA FROM DATABASE ===")
    
    // Get all tables
    const tables = await db.$queryRaw<Array<{ table_name: string }>>`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `
    
    const schemaAnalysis = {}
    
    for (const table of tables) {
      const tableName = table.table_name
      
      // Get columns for each table
      const columns = await db.$queryRaw<Array<{
        column_name: string
        data_type: string
        is_nullable: string
        column_default: string | null
        character_maximum_length: number | null
      }>>`
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default,
          character_maximum_length
        FROM information_schema.columns 
        WHERE table_name = ${tableName}
        AND table_schema = 'public'
        ORDER BY ordinal_position
      `
      
      // Get primary keys
      const primaryKeys = await db.$queryRaw<Array<{ column_name: string }>>`
        SELECT column_name
        FROM information_schema.key_column_usage
        WHERE table_name = ${tableName}
        AND table_schema = 'public'
        AND constraint_name LIKE '%_pkey'
      `
      
      // Get foreign keys
      const foreignKeys = await db.$queryRaw<Array<{
        column_name: string
        foreign_table_name: string
        foreign_column_name: string
      }>>`
        SELECT 
          kcu.column_name,
          ccu.table_name as foreign_table_name,
          ccu.column_name as foreign_column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu 
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage ccu 
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND tc.table_name = ${tableName}
        AND tc.table_schema = 'public'
      `
      
      // Get unique constraints
      const uniqueConstraints = await db.$queryRaw<Array<{ column_name: string }>>`
        SELECT column_name
        FROM information_schema.key_column_usage
        WHERE table_name = ${tableName}
        AND table_schema = 'public'
        AND constraint_name LIKE '%_key'
        AND constraint_name NOT LIKE '%_pkey'
      `
      
      schemaAnalysis[tableName] = {
        columns,
        primaryKeys: primaryKeys.map(pk => pk.column_name),
        foreignKeys,
        uniqueConstraints: uniqueConstraints.map(uc => uc.column_name)
      }
    }
    
    console.log("Database schema analysis completed")
    
    return NextResponse.json({
      success: true,
      message: "Database schema analysis completed",
      schemaAnalysis,
      tables: tables.map(t => t.table_name)
    })
    
  } catch (error) {
    console.error("Error analyzing database schema:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
