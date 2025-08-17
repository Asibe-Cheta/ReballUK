import { NextRequest, NextResponse } from "next/server"
import { verifyEmailToken } from "@/lib/auth-utils"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Verification token is required" },
        { status: 400 }
      )
    }

    const isValid = await verifyEmailToken(token)

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired verification token" },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Email verified successfully"
    })

  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json(
      { success: false, error: "Email verification failed" },
      { status: 500 }
    )
  }
}
