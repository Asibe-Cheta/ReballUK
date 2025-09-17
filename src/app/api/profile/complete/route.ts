import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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

    // Verify the token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

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
          { error: 'Failed to update profile' },
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
          { error: 'Failed to create profile' },
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
