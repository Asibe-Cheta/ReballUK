import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No authorization header found' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    
    // Create client with anon key for auth verification
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Try to get user with the token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError) {
      return NextResponse.json({
        success: false,
        error: 'Token verification failed',
        details: authError.message,
        code: authError.status
      })
    }

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'No user found for token'
      })
    }

    // Check if user exists in public.users
    const { data: publicUser, error: publicUserError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        metadata: user.user_metadata
      },
      publicUser: publicUser || null,
      publicUserError: publicUserError?.message || null,
      tokenLength: token.length,
      tokenPrefix: token.substring(0, 10) + '...'
    })

  } catch (error) {
    console.error('Token check error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    )
  }
}
