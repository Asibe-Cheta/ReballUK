import { NextRequest, NextResponse } from "next/server"
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { email, password, captchaToken } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Create Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { success: false, error: "Supabase configuration missing" },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Sign in with Supabase Auth
    const signInOptions: any = {
      email: email.toLowerCase(),
      password
    }

    // Add captcha token if provided
    if (captchaToken) {
      signInOptions.options = {
        captchaToken: captchaToken
      }
    }

    const { data, error } = await supabase.auth.signInWithPassword(signInOptions)

    if (error) {
      console.error("Supabase login error:", error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 }
      )
    }

    if (!data.user) {
      return NextResponse.json(
        { success: false, error: "Login failed" },
        { status: 401 }
      )
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', data.user.id)
      .single()

    // Create user object in the format expected by the frontend
    const userData = {
      id: data.user.id,
      name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
      email: data.user.email || '',
      image: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture,
      role: 'user',
      position: profile?.position || null,
      trainingLevel: profile?.playing_level || null,
      completedOnboarding: profile?.welcome_completed || false,
      emailVerified: data.user.email_confirmed_at ? true : false,
      createdAt: new Date(data.user.created_at)
    }

    return NextResponse.json({
      success: true,
      user: userData,
      access_token: data.session?.access_token
    })

  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { success: false, error: "Login failed" },
      { status: 500 }
    )
  }
}
