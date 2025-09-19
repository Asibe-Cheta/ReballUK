import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      playerName,
      dateOfBirth,
      guardianName,
      contactEmail,
      contactNumber,
      postcode,
      medicalConditions,
      position,
      playingLevel,
      currentTeam,
      evidenceFiles,
      trainingReason,
      hearAbout,
      referralName,
      postTrainingSnacks,
      postTrainingDrinks,
      socialMediaConsent,
      marketingConsent
    } = body

    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]

    // Create client with anon key for auth verification
    const supabaseAuth = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Verify the token and get user
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Create client with service role key to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Ensure user exists in public.users table
    const { data: publicUser, error: publicUserError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (publicUserError && publicUserError.code === 'PGRST116') {
      // User doesn't exist in public.users, create them
      const { error: createUserError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          image: user.user_metadata?.avatar_url || user.user_metadata?.picture,
          role: 'USER'
        })

      if (createUserError) {
        console.error('Failed to create user in public.users:', createUserError)
        return NextResponse.json(
          { error: 'Failed to create user record', details: createUserError.message },
          { status: 500 }
        )
      }
    } else if (publicUserError) {
      console.error('Error checking public user:', publicUserError)
      return NextResponse.json(
        { error: 'Failed to check user record', details: publicUserError.message },
        { status: 500 }
      )
    }

    // Check if profile already exists
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (profileCheckError && profileCheckError.code !== 'PGRST116') {
      console.error('Profile check error:', profileCheckError)
      return NextResponse.json(
        { error: 'Failed to check existing profile', details: profileCheckError.message },
        { status: 500 }
      )
    }

    const profileData = {
      user_id: user.id,
      player_name: playerName,
      date_of_birth: dateOfBirth ? new Date(dateOfBirth).toISOString() : null,
      guardian_name: guardianName || null,
      contact_email: contactEmail,
      contact_number: contactNumber,
      postcode: postcode,
      medical_conditions: medicalConditions || null,
      position: position,
      playing_level: playingLevel,
      current_team: currentTeam,
      evidence_files: evidenceFiles || [],
      training_reason: trainingReason,
      hear_about: hearAbout,
      referral_name: referralName || null,
      post_training_snacks: postTrainingSnacks,
      post_training_drinks: postTrainingDrinks,
      social_media_consent: socialMediaConsent || false,
      marketing_consent: marketingConsent || false,
      welcome_completed: true,
      welcome_completed_date: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    let result
    if (existingProfile) {
      // Update existing profile
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) {
        console.error('Profile update error:', error)
        return NextResponse.json(
          { error: 'Failed to update profile', details: error.message, code: error.code },
          { status: 500 }
        )
      }
      result = data
    } else {
      // Create new profile
      const { data, error } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single()

      if (error) {
        console.error('Profile creation error:', error)
        return NextResponse.json(
          { error: 'Failed to create profile', details: error.message, code: error.code },
          { status: 500 }
        )
      }
      result = data
    }

    return NextResponse.json({
      success: true,
      profile: result
    })

  } catch (error) {
    console.error('Profile completion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
