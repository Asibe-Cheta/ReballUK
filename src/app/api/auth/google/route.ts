import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Since we're using Supabase Auth, redirect to Supabase's Google OAuth
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables')
      return NextResponse.redirect(new URL('/login?error=config_error', request.url))
    }

    // Redirect to Supabase's Google OAuth
    const supabaseAuthUrl = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent('https://www.reball.uk')}`
    
    console.log('Redirecting to Supabase Google OAuth:', supabaseAuthUrl)
    return NextResponse.redirect(supabaseAuthUrl)

  } catch (error) {
    console.error('Supabase Google OAuth error:', error)
    return NextResponse.redirect(new URL('/login?error=google_auth_failed', request.url))
  }
}
