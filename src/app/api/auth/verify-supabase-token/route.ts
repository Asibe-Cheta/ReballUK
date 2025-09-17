import { NextRequest, NextResponse } from "next/server"
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Token required" },
        { status: 400 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { success: false, error: "Supabase configuration missing" },
        { status: 500 }
      )
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Verify the token and get user info
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      )
    }

    // Get user profile from our database
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // Create user object in the format expected by the frontend
    const userData = {
      id: user.id,
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      email: user.email || '',
      image: user.user_metadata?.avatar_url || user.user_metadata?.picture,
      role: 'user',
      position: profile?.position || null,
      trainingLevel: profile?.playing_level || null,
      completedOnboarding: profile?.welcome_completed || false,
      profileCompleted: profile?.welcome_completed || false,
      emailVerified: user.email_confirmed_at ? true : false,
      createdAt: new Date(user.created_at)
    }

    return NextResponse.json({
      success: true,
      user: userData
    })

  } catch (error) {
    console.error('Supabase token verification error:', error)
    return NextResponse.json(
      { success: false, error: "Token verification failed" },
      { status: 500 }
    )
  }
}
