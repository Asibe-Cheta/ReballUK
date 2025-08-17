import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
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

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        profile: {
          select: {
            position: true,
            trainingLevel: true,
            completedOnboarding: true,
          }
        }
      }
    })

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
      position: user.profile?.position,
      trainingLevel: user.profile?.trainingLevel,
      completedOnboarding: user.profile?.completedOnboarding,
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
