import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    // Check Google OAuth environment variables
    const googleClientId = process.env.GOOGLE_CLIENT_ID
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
    const nextAuthUrl = process.env.NEXTAUTH_URL
    const nextAuthSecret = process.env.NEXTAUTH_SECRET
    
    console.log("Google OAuth Environment Check:")
    console.log("GOOGLE_CLIENT_ID:", googleClientId ? "✅ SET" : "❌ MISSING")
    console.log("GOOGLE_CLIENT_SECRET:", googleClientSecret ? "✅ SET" : "❌ MISSING")
    console.log("NEXTAUTH_URL:", nextAuthUrl || "❌ MISSING")
    console.log("NEXTAUTH_SECRET:", nextAuthSecret ? "✅ SET" : "❌ MISSING")
    
    const expectedRedirectUri = `${nextAuthUrl}/api/auth/callback/google`
    
    return NextResponse.json({
      success: true,
      oauth: {
        googleClientId: googleClientId ? `${googleClientId.substring(0, 20)}...` : "MISSING",
        googleClientSecret: googleClientSecret ? "SET" : "MISSING",
        nextAuthUrl: nextAuthUrl || "MISSING",
        nextAuthSecret: nextAuthSecret ? "SET" : "MISSING",
        expectedRedirectUri,
        instructions: [
          "1. Make sure NEXTAUTH_URL matches your domain exactly",
          "2. Google Console redirect URI should be: " + expectedRedirectUri,
          "3. Check that Google OAuth consent screen is published",
          "4. Verify authorized JavaScript origins include your domain"
        ]
      },
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error("Google OAuth environment check failed:", error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
