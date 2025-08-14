import { NextRequest, NextResponse } from "next/server"

// Simple test endpoint to verify registration API is working
export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Registration API is available",
    features: {
      emailRegistration: true,
      googleOAuth: !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET,
      database: !!process.env.DATABASE_URL,
      nextAuth: !!process.env.NEXTAUTH_SECRET,
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Simple validation for testing
    if (!body.email || !body.password || !body.name) {
      return NextResponse.json({
        success: false,
        error: "Missing required fields: email, password, name"
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Test registration validation passed",
      data: {
        email: body.email,
        name: body.name,
        hasPassword: !!body.password,
        timestamp: new Date().toISOString()
      }
    })
  } catch {
    return NextResponse.json({
      success: false,
      error: "Invalid JSON data"
    }, { status: 400 })
  }
}
