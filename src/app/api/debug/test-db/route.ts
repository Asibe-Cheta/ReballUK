import { NextResponse } from "next/server"
import { Client } from 'pg'

export async function GET() {
  try {
    console.log('Testing database connection...')
    console.log('DATABASE_URL available:', !!process.env.DATABASE_URL)
    
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        success: false,
        error: "DATABASE_URL not found in environment variables"
      })
    }
    
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      connectionTimeoutMillis: 5000,
    })
    
    await client.connect()
    console.log('Database connected successfully')
    
    const result = await client.query('SELECT NOW() as current_time')
    await client.end()
    
    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      currentTime: result.rows[0].current_time
    })
    
  } catch (error) {
    console.error('Database connection test failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      details: error
    }, { status: 500 })
  }
}
