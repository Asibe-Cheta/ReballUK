import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const debugInfo = {
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NODE_ENV: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    }

    console.error('=== GOOGLE OAUTH DEBUG INFO ===')
    console.error('Environment variables:', debugInfo)

    return NextResponse.json({
      success: true,
      debug: debugInfo,
      message: "Check Vercel logs for debug output"
    })

  } catch (error) {
    console.error('Debug endpoint error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
