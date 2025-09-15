import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Token required" },
        { status: 400 }
      )
    }

    const secretKey = process.env.HCAPTCHA_SECRET_KEY
    console.log("Debug captcha verification:", { 
      hasSecretKey: !!secretKey, 
      secretKeyLength: secretKey?.length,
      tokenLength: token.length,
      secretKeyPreview: secretKey ? `${secretKey.substring(0, 10)}...` : 'undefined'
    })

    if (!secretKey) {
      return NextResponse.json(
        { success: false, error: "HCAPTCHA_SECRET_KEY not configured" },
        { status: 500 }
      )
    }

    // Get client IP
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    '127.0.0.1'

    const captchaResponse = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
        remoteip: clientIP,
      }),
    })

    const result = await captchaResponse.json()
    
    return NextResponse.json({
      success: true,
      captchaResult: result,
      debug: {
        hasSecretKey: !!secretKey,
        secretKeyLength: secretKey?.length,
        tokenLength: token.length,
        clientIP,
        responseStatus: captchaResponse.status
      }
    })

  } catch (error) {
    console.error("Captcha debug error:", error)
    return NextResponse.json(
      { success: false, error: "Debug failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
