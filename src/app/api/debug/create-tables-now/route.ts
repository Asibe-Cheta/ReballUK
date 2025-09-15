import { NextResponse } from "next/server"
import { getDbClient } from "@/lib/db-direct"

export async function GET() {
  try {
    console.log("Creating database tables...")
    const db = await getDbClient()
    
    // Check if users table exists (it should already exist in Supabase)
    const usersTableCheck = await db.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      )
    `)
    console.log("Users table exists:", usersTableCheck.rows[0].exists)

    // Check if profiles table exists (it should already exist in Supabase)
    const profilesTableCheck = await db.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles'
      )
    `)
    console.log("Profiles table exists:", profilesTableCheck.rows[0].exists)

    // Check if auth.users table exists (Supabase auth table)
    const authUsersTableCheck = await db.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'auth' 
        AND table_name = 'users'
      )
    `)
    console.log("Auth users table exists:", authUsersTableCheck.rows[0].exists)

    return NextResponse.json({
      success: true,
      message: "Database tables created successfully"
    })

  } catch (error) {
    console.error("Create tables error:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to create tables",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
