import { NextRequest, NextResponse } from "next/server"
import { db, ensureConnection } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    console.log("=== TESTING PREPARED STATEMENTS ===")
    
    // Reset connection first
    await ensureConnection()
    
    const body = await request.json()
    const { email } = body
    
    console.log("Testing with email:", email)
    
    // Test multiple queries to trigger prepared statement reuse
    const results = []
    
    for (let i = 0; i < 3; i++) {
      console.log(`Query ${i + 1}: Checking if user exists...`)
      
      const result = await db.$executeRaw`
        SELECT id FROM "users" WHERE email = ${email} LIMIT 1
      `
      
      results.push({
        query: i + 1,
        result: result,
        timestamp: new Date().toISOString()
      })
      
      // Small delay between queries
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    console.log("=== PREPARED STATEMENT TEST SUCCESS ===")
    
    return NextResponse.json({
      success: true,
      message: "Prepared statement test completed successfully",
      results,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error("=== PREPARED STATEMENT TEST FAILED ===")
    console.error("Error:", error)
    
    return NextResponse.json({
      success: false,
      error: "Prepared statement test failed",
      details: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
