import { NextRequest, NextResponse } from "next/server"
import { getFreshDbClient } from "@/lib/db"

export async function GET(request: NextRequest) {
  const freshDb = getFreshDbClient()
  
  try {
    console.log("=== CHECKING USERS TABLE ===")
    
    // Get all users in the database
    const allUsers = await freshDb.$queryRaw`
      SELECT id, name, email, "createdAt", "updatedAt" 
      FROM users 
      ORDER BY "createdAt" DESC 
      LIMIT 20
    `
    
    console.log("All users in database:", allUsers)
    
    // Get count of users
    const userCount = await freshDb.$queryRaw`
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
        const result = await freshDb.$queryRaw`
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
    
    // Clean up fresh client
    await freshDb.$disconnect()
    
    return NextResponse.json({
      success: true,
      allUsers,
      userCount,
      emailChecks,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    // Clean up fresh client on error
    try {
      await freshDb.$disconnect()
    } catch (disconnectError) {
      console.error("Failed to disconnect fresh client:", disconnectError)
    }
    console.error("Error checking users:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
