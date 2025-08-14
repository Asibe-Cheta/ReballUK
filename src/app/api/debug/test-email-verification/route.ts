import { NextRequest, NextResponse } from "next/server"
import { getFreshDbClient } from "@/lib/db"
import { generateVerificationToken, storeVerificationToken, generateVerificationUrl } from "@/lib/verification"
import { EmailService } from "@/lib/email"

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
    
    const freshDb = getFreshDbClient()
    
    // Find user by email
    const userResult = await freshDb.$queryRaw`
      SELECT id, name, email, "emailVerified"
      FROM users 
      WHERE email = ${email} 
      LIMIT 1
    `
    
    await freshDb.$disconnect()
    
    const user = Array.isArray(userResult) && userResult.length > 0 ? userResult[0] : null
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }
    
    // Generate verification token
    const verificationToken = generateVerificationToken()
    const verificationUrl = generateVerificationUrl(verificationToken.token)
    
    // Store verification token
    const tokenStored = await storeVerificationToken(user.id, verificationToken.token, verificationToken.expires)
    
    if (!tokenStored) {
      return NextResponse.json(
        { success: false, error: "Failed to store verification token" },
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
      message: "Test verification email sent successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified
      },
      verificationUrl: verificationUrl
    })
    
  } catch (error) {
    console.error("Test email verification error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to test email verification" },
      { status: 500 }
    )
  }
}
