import { NextRequest, NextResponse } from "next/server"
import { compare } from "bcryptjs"
import { Client } from "pg"

export async function POST(request: NextRequest) {
  console.log("=== TESTING LOGIN DIRECTLY WITH RAW POSTGRES ===")
  
  // Use raw PostgreSQL client to completely bypass Prisma
  const pgClient = new Client({
    connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
  })
  
  try {
    const body = await request.json()
    const { email, password } = body
    
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password required" },
        { status: 400 }
      )
    }
    
    console.log("Testing login for email:", email)
    console.log("Connecting to database with raw PostgreSQL client...")
    
    await pgClient.connect()
    console.log("Connected successfully")
    
    // Find user by email using raw PostgreSQL query
    console.log("Executing raw PostgreSQL query...")
    const userResult = await pgClient.query(
      'SELECT id, name, email, password FROM users WHERE email = $1 LIMIT 1',
      [email]
    )
    
    console.log("Raw query executed successfully")
    console.log("User query result rows:", userResult.rows.length)
    
    const user = userResult.rows.length > 0 ? userResult.rows[0] : null

    if (!user || !user.password) {
      console.log("User not found or no password")
      await pgClient.end()
      return NextResponse.json({
        success: false,
        error: "User not found or no password",
        userExists: !!user,
        hasPassword: user ? !!user.password : false,
        totalUsers: userResult.rows.length
      })
    }

    console.log("User found:", { 
      id: user.id, 
      name: user.name, 
      email: user.email, 
      hasPassword: !!user.password 
    })

    // Verify password
    console.log("Verifying password...")
    const isValidPassword = await compare(password, user.password)
    console.log("Password valid:", isValidPassword)
    
    // Clean up raw client
    console.log("Closing raw PostgreSQL connection...")
    await pgClient.end()
    console.log("Connection closed successfully")
    
    return NextResponse.json({
      success: true,
      userFound: true,
      passwordValid: isValidPassword,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      method: "raw-postgresql"
    })
    
  } catch (error) {
    console.error("Direct login test error:", error)
    console.error("Error type:", error instanceof Error ? error.constructor.name : typeof error)
    console.error("Error message:", error instanceof Error ? error.message : "Unknown error")
    
    // Clean up raw client on error
    try {
      console.log("Attempting to close PostgreSQL connection after error...")
      await pgClient.end()
      console.log("Connection closed after error")
    } catch (disconnectError) {
      console.error("Failed to close PostgreSQL connection:", disconnectError)
    }
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      timestamp: new Date().toISOString(),
      method: "raw-postgresql"
    }, { status: 500 })
  }
}
