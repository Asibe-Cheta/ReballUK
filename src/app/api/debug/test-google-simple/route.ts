import { NextResponse } from "next/server"

export async function GET() {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID
    const redirectUri = process.env.GOOGLE_REDIRECT_URI

    if (!clientId || !redirectUri) {
      return NextResponse.json({ 
        error: 'Missing Google OAuth environment variables',
        clientId: !!clientId,
        redirectUri: !!redirectUri
      }, { status: 500 })
    }

    // Test the simplest possible Google OAuth URL
    const simpleUrl = `https://accounts.google.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=email`

    console.log('Simple Google OAuth URL:', simpleUrl)

    return NextResponse.json({
      success: true,
      simpleUrl: simpleUrl,
      message: 'Generated simple Google OAuth URL. Test this URL directly in your browser.',
      env: {
        clientId: clientId.substring(0, 20) + '...',
        redirectUri: redirectUri
      }
    })

  } catch (error) {
    console.error('Simple Google OAuth test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to generate simple Google OAuth URL',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
