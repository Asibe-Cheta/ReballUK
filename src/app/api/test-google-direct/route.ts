import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google'
    
    // Test if we can make a direct request to Google's token endpoint
    const testUrl = `https://oauth2.googleapis.com/token`
    
    console.error('=== DIRECT GOOGLE TEST ===')
    console.error('Client ID:', clientId)
    console.error('Redirect URI:', redirectUri)
    console.error('Test URL:', testUrl)

    // Try to make a simple request to Google's OAuth endpoint
    try {
      const response = await fetch(`https://accounts.google.com/.well-known/openid_configuration`)
      const data = await response.json()
      
      console.error('Google OAuth discovery response:', response.status)
      console.error('Google OAuth discovery data:', data)
      
      return NextResponse.json({
        success: true,
        clientId,
        redirectUri,
        googleDiscoveryStatus: response.status,
        googleDiscoveryData: data,
        message: "Check Vercel logs for debug output"
      })
    } catch (fetchError) {
      console.error('Google discovery fetch error:', fetchError)
      return NextResponse.json({
        success: false,
        error: fetchError instanceof Error ? fetchError.message : 'Unknown error',
        clientId,
        redirectUri
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Test endpoint error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
