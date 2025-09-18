-- Create Admin User for REBALL
-- Run this in your Supabase SQL Editor

-- IMPORTANT: You must first create the user in Supabase Auth UI before running this script
-- Go to Authentication > Users in your Supabase dashboard and create:
-- Email: harry@reball.uk
-- Password: admin123 (or your preferred password)

-- Check if the user exists in auth.users first
DO $$
DECLARE
    user_id UUID;
BEGIN
    -- Get the user ID from auth.users
    SELECT id INTO user_id FROM auth.users WHERE email = 'harry@reball.uk' LIMIT 1;
    
    -- If user doesn't exist, show error message
    IF user_id IS NULL THEN
        RAISE EXCEPTION 'User harry@reball.uk does not exist in auth.users. Please create the user in Supabase Auth UI first (Authentication > Users).';
    END IF;
    
    -- Insert admin user into public.users table
    INSERT INTO public.users (id, email, role, created_at, updated_at)
    VALUES (user_id, 'harry@reball.uk', 'ADMIN', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
      role = 'ADMIN',
      updated_at = NOW();
      
    RAISE NOTICE 'Admin user created successfully with ID: %', user_id;
END $$;

-- Create admin profile (this will be handled in the same transaction)
DO $$
DECLARE
    user_id UUID;
BEGIN
    -- Get the user ID from auth.users
    SELECT id INTO user_id FROM auth.users WHERE email = 'harry@reball.uk' LIMIT 1;
    
    -- Create admin profile
    INSERT INTO public.profiles (
      user_id,
      player_name,
      date_of_birth,
      guardian_name,
      contact_email,
      contact_number,
      postcode,
      medical_conditions,
      position,
      playing_level,
      current_team,
      evidence_files,
      training_reason,
      hear_about,
      referral_name,
      post_training_snacks,
      post_training_drinks,
      social_media_consent,
      marketing_consent,
      welcome_completed,
      welcome_completed_date,
      created_at,
      updated_at
    )
    VALUES (
      user_id,
      'Harry Admin',
      '1990-01-01',
      NULL,
      'harry@reball.uk',
      '+44 (0) 20 1234 5678',
      'SW1A 1AA',
      NULL,
      'STRIKER',
      'PROFESSIONAL',
      'REBALL Admin',
      ARRAY[]::text[],
      'Admin account',
      'Website',
      NULL,
      'Energy bar',
      'Water',
      true,
      true,
      true,
      NOW(),
      NOW(),
      NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
      player_name = 'Harry Admin',
      contact_email = 'harry@reball.uk',
      contact_number = '+44 (0) 20 1234 5678',
      welcome_completed = true,
      welcome_completed_date = NOW(),
      updated_at = NOW();
      
    RAISE NOTICE 'Admin profile created successfully for user ID: %', user_id;
END $$;

-- Verify the admin user was created
SELECT 
  u.id,
  u.email,
  u.role,
  p.player_name,
  p.welcome_completed
FROM public.users u
LEFT JOIN public.profiles p ON u.id = p.user_id
WHERE u.email = 'harry@reball.uk';
