-- Supabase Migration Script for Profile Completion System
-- Run this in your Supabase SQL Editor

-- IMPORTANT: This script will create a new profiles table structure
-- If you have existing data, you may need to migrate it manually

-- First, let's check if the profiles table exists and what columns it has
-- You can run this to see the current structure:
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'profiles' AND table_schema = 'public';

-- SAFETY CHECK: Uncomment the line below ONLY if you want to drop existing data
-- DROP TABLE IF EXISTS public.profiles CASCADE;

-- Check if profiles table exists and show current structure
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
        RAISE NOTICE 'Profiles table already exists. Checking structure...';
    ELSE
        RAISE NOTICE 'Creating new profiles table...';
    END IF;
END $$;

-- Create the new profiles table with all required fields
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  user_id uuid NOT NULL,
  player_name text,
  date_of_birth timestamp with time zone,
  guardian_name text,
  contact_email text,
  contact_number text,
  postcode text,
  medical_conditions text,
  position text,
  playing_level text,
  current_team text,
  evidence_files text[] DEFAULT '{}',
  training_reason text,
  hear_about text,
  referral_name text,
  post_training_snacks text,
  post_training_drinks text,
  social_media_consent boolean DEFAULT false,
  marketing_consent boolean DEFAULT false,
  welcome_completed boolean DEFAULT false,
  welcome_completed_date timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE,
  CONSTRAINT profiles_user_id_unique UNIQUE (user_id)
) TABLESPACE pg_default;

-- Add missing columns if table already exists (for existing installations)
DO $$
BEGIN
    -- Add new columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'player_name') THEN
        ALTER TABLE public.profiles ADD COLUMN player_name text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'date_of_birth') THEN
        ALTER TABLE public.profiles ADD COLUMN date_of_birth timestamp with time zone;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'guardian_name') THEN
        ALTER TABLE public.profiles ADD COLUMN guardian_name text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'contact_email') THEN
        ALTER TABLE public.profiles ADD COLUMN contact_email text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'contact_number') THEN
        ALTER TABLE public.profiles ADD COLUMN contact_number text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'postcode') THEN
        ALTER TABLE public.profiles ADD COLUMN postcode text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'medical_conditions') THEN
        ALTER TABLE public.profiles ADD COLUMN medical_conditions text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'playing_level') THEN
        ALTER TABLE public.profiles ADD COLUMN playing_level text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'current_team') THEN
        ALTER TABLE public.profiles ADD COLUMN current_team text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'evidence_files') THEN
        ALTER TABLE public.profiles ADD COLUMN evidence_files text[] DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'training_reason') THEN
        ALTER TABLE public.profiles ADD COLUMN training_reason text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'hear_about') THEN
        ALTER TABLE public.profiles ADD COLUMN hear_about text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'referral_name') THEN
        ALTER TABLE public.profiles ADD COLUMN referral_name text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'post_training_snacks') THEN
        ALTER TABLE public.profiles ADD COLUMN post_training_snacks text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'post_training_drinks') THEN
        ALTER TABLE public.profiles ADD COLUMN post_training_drinks text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'social_media_consent') THEN
        ALTER TABLE public.profiles ADD COLUMN social_media_consent boolean DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'marketing_consent') THEN
        ALTER TABLE public.profiles ADD COLUMN marketing_consent boolean DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'welcome_completed') THEN
        ALTER TABLE public.profiles ADD COLUMN welcome_completed boolean DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'welcome_completed_date') THEN
        ALTER TABLE public.profiles ADD COLUMN welcome_completed_date timestamp with time zone;
    END IF;
    
    RAISE NOTICE 'Column migration completed.';
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_position ON public.profiles(position);
CREATE INDEX IF NOT EXISTS idx_profiles_playing_level ON public.profiles(playing_level);
CREATE INDEX IF NOT EXISTS idx_profiles_welcome_completed ON public.profiles(welcome_completed);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (drop existing ones first to avoid conflicts)
-- Users can only see and modify their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Admins can see all profiles (if you have an admin role)
-- CREATE POLICY "Admins can view all profiles" ON public.profiles
--   FOR SELECT USING (
--     EXISTS (
--       SELECT 1 FROM public.users 
--       WHERE users.id = auth.uid() AND users.role = 'ADMIN'
--     )
--   );

-- Grant necessary permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

-- MIGRATION NOTES:
-- If you have existing profile data, you'll need to migrate it manually.
-- Here's an example migration script (adjust column names as needed):
--
-- INSERT INTO public.profiles (user_id, player_name, contact_email, position, playing_level, welcome_completed)
-- SELECT 
--   user_id,
--   COALESCE(first_name || ' ' || last_name, 'Unknown'),
--   contact_email,
--   position,
--   COALESCE(training_level, 'BEGINNER'),
--   COALESCE(completed_onboarding, false)
-- FROM old_profiles_table
-- WHERE user_id IS NOT NULL;

-- VERIFICATION:
-- After running this script, verify the table was created correctly:
-- SELECT * FROM public.profiles LIMIT 5;
