import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    console.log("=== CHECKING USERS TABLE ===")
    
    // Get all users in the database
    const allUsers = await db.$queryRaw`
      SELECT id, name, email, "createdAt", "updatedAt" 
      FROM users 
      ORDER BY "createdAt" DESC 
      LIMIT 20
    `
    
    console.log("All users in database:", allUsers)
    
    // Get count of users
    const userCount = await db.$queryRaw`
      SELECT COUNT(*) as count FROM users
    `
    
    console.log("Total user count:", userCount)
    
    // Check for specific test emails
    const testEmails = [
      'johngray@gmail.com',
      'jaybee@gmail.com',
      'test@example.com',
      'johnddoe@gmail.com',
      'misterjohn@gmail.com'
    ]
    
    const emailChecks = {}
    
    for (const email of testEmails) {
      try {
        const result = await db.$queryRaw`
          SELECT id, email FROM users WHERE email = ${email}
        `
        emailChecks[email] = {
          exists: Array.isArray(result) && result.length > 0,
          data: result
        }
      } catch (error) {
        emailChecks[email] = {
          exists: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      allUsers,
      userCount,
      emailChecks,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error("Error checking users:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
