import { NextRequest, NextResponse } from "next/server"
import { getDbClient } from "@/lib/db-direct"
import { comparePassword, setAuthCookie, getUserFromToken } from "@/lib/auth-utils"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Since the users table doesn't have password field, we need to use Supabase Auth
    // For now, let's return an error asking user to use Google OAuth
    return NextResponse.json(
      { success: false, error: "Please use Google sign-in for authentication" },
      { status: 401 }
    )

  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { success: false, error: "Login failed" },
      { status: 500 }
    )
  }
}
