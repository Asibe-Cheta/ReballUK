import { NextRequest, NextResponse } from "next/server"
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ success: false, error: "Supabase configuration missing" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Test sending a password reset email (this will test SMTP)
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://www.reball.uk/reset-password'
    })

    if (error) {
      console.error("SMTP test error:", error)
      return NextResponse.json({
        success: false,
        error: error.message,
        details: {
          message: error.message,
          status: error.status,
          name: error.name
        }
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Password reset email sent successfully - SMTP is working!",
      data: data
    })

  } catch (error) {
    console.error("SMTP test error:", error)
    return NextResponse.json({
      success: false,
      error: "SMTP test failed",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
