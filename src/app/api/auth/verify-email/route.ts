import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyTokenHash, markEmailAsVerified, clearVerificationToken } from "@/lib/verification"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Verification token is required" },
        { status: 400 }
      )
    }
    
    // Find user with this verification token
    const user = await db.user.findFirst({
      where: {
        verificationToken: {
          not: null
        },
        verificationExpires: {
          gt: new Date()
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        verificationToken: true,
        emailVerified: true
      }
    })
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired verification token" },
        { status: 400 }
      )
    }
    
    // Verify the token hash
    if (!user.verificationToken || !verifyTokenHash(token, user.verificationToken)) {
      return NextResponse.json(
        { success: false, error: "Invalid verification token" },
        { status: 400 }
      )
    }
    
    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { success: false, error: "Email is already verified" },
        { status: 400 }
      )
    }
    
    // Mark email as verified
    const verified = await markEmailAsVerified(user.id)
    
    if (!verified) {
      return NextResponse.json(
        { success: false, error: "Failed to verify email" },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: "Email verified successfully! You can now log in to your account.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    })
    
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to verify email" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      )
    }
    
    // Find user by email
    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true
      }
    })
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }
    
    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { success: false, error: "Email is already verified" },
        { status: 400 }
      )
    }
    
    // Generate new verification token and send email
    const { generateVerificationToken, storeVerificationToken, generateVerificationUrl } = await import('@/lib/verification')
    const { EmailService } = await import('@/lib/email')
    
    const verificationToken = generateVerificationToken()
    const verificationUrl = generateVerificationUrl(verificationToken.token)
    
    // Store new verification token
    const tokenStored = await storeVerificationToken(user.id, verificationToken.token, verificationToken.expires)
    
    if (!tokenStored) {
      return NextResponse.json(
        { success: false, error: "Failed to generate verification token" },
        { status: 500 }
      )
    }
    
    // Send verification email
    const emailSent = await EmailService.sendVerificationEmail({
      name: user.name || 'User',
      email: user.email,
      verificationToken: verificationToken.token,
      verificationUrl
    })
    
    if (!emailSent) {
      return NextResponse.json(
        { success: false, error: "Failed to send verification email" },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: "Verification email sent successfully"
    })
    
  } catch (error) {
    console.error("Resend verification email error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to send verification email" },
      { status: 500 }
    )
  }
}
