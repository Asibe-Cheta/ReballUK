import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google'
    
    const googleAuthUrl = `https://accounts.google.com/oauth/authorize?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=openid email profile&` +
      `access_type=offline`

    console.error('=== GOOGLE OAUTH URL TEST ===')
    console.error('Client ID:', clientId)
    console.error('Redirect URI:', redirectUri)
    console.error('Generated URL:', googleAuthUrl)

    return NextResponse.json({
      success: true,
      clientId,
      redirectUri,
      googleAuthUrl,
      message: "Check Vercel logs for debug output"
    })

  } catch (error) {
    console.error('Test endpoint error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
