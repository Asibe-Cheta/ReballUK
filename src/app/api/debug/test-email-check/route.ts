import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    console.log("=== TESTING EMAIL CHECK ===")
    
    const body = await request.json()
    const { email } = body
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      )
    }
    
    console.log("Checking email:", email)
    
    // Test raw SQL query
    try {
      const rawResult = await db.$queryRaw`
        SELECT id, email, name, "createdAt" FROM users WHERE email = ${email} LIMIT 1
      `
      console.log("Raw SQL result:", rawResult)
      
      // Test if array and has results
      const existingUser = Array.isArray(rawResult) && rawResult.length > 0 ? rawResult[0] : null
      console.log("Existing user:", existingUser)
      
      // Also test Prisma ORM query for comparison
      let prismaResult = null
      try {
        prismaResult = await db.user.findUnique({
          where: { email },
          select: { id: true, email: true, name: true, createdAt: true }
        })
        console.log("Prisma ORM result:", prismaResult)
      } catch (prismaError) {
        console.error("Prisma ORM error:", prismaError)
      }
      
      // Get all users to see what's in the database
      const allUsers = await db.$queryRaw`
        SELECT id, email, name FROM users ORDER BY "createdAt" DESC LIMIT 10
      `
      console.log("All users (last 10):", allUsers)
      
      return NextResponse.json({
        success: true,
        testEmail: email,
        rawSqlResult: rawResult,
        existingUser: existingUser,
        prismaResult: prismaResult,
        allUsers: allUsers,
        emailExists: !!existingUser,
        timestamp: new Date().toISOString()
      })
      
    } catch (sqlError) {
      console.error("SQL Error:", sqlError)
      return NextResponse.json({
        success: false,
        error: "SQL query failed",
        details: sqlError instanceof Error ? sqlError.message : "Unknown SQL error",
        testEmail: email,
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error("=== EMAIL CHECK TEST ERROR ===")
    console.error("Error:", error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
