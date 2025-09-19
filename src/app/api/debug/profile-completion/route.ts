import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]

    // Verify the token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid token', details: authError },
        { status: 401 }
      )
    }

    // Check if user exists in auth.users
    const { data: authUser, error: authUserError } = await supabase.auth.admin.getUserById(user.id)
    
    // Check if user exists in public.users
    const { data: publicUser, error: publicUserError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    // Check if profile exists
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    return NextResponse.json({
      success: true,
      debug: {
        userId: user.id,
        userEmail: user.email,
        authUser: authUser ? 'exists' : 'not found',
        authUserError: authUserError?.message,
        publicUser: publicUser ? 'exists' : 'not found',
        publicUserError: publicUserError?.message,
        existingProfile: existingProfile ? 'exists' : 'not found',
        profileError: profileError?.message,
        userMetadata: user.user_metadata
      }
    })

  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json(
      { error: 'Debug failed', details: error },
      { status: 500 }
    )
  }
}
