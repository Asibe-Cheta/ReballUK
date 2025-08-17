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

    // Find user by email using direct database connection
    const db = await getDbClient()
    const usersResult = await db.query(
      `SELECT u.id, u.name, u.email, u.password, u.role, u."emailVerified", u.image, u."createdAt",
              p.position, p."trainingLevel", p."completedOnboarding"
       FROM "User" u
       LEFT JOIN "Profile" p ON u.id = p."userId"
       WHERE u.email = $1`,
      [email.toLowerCase()]
    )
    
    const user = usersResult.rows.length > 0 ? usersResult.rows[0] : null

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Check if user has password (for OAuth users)
    if (!user.password) {
      return NextResponse.json(
        { success: false, error: "Please sign in with Google" },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return NextResponse.json(
        { success: false, error: "Please verify your email before logging in" },
        { status: 401 }
      )
    }

    // Set authentication cookie
    const token = await setAuthCookie(user.id)

    // Return user data (without password)
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
      position: user.position,
      trainingLevel: user.trainingLevel,
      completedOnboarding: user.completedOnboarding,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    }

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: userData
    })

  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { success: false, error: "Login failed" },
      { status: 500 }
    )
  }
}
