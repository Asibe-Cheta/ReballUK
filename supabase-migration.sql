-- Supabase Migration Script for Profile Completion System
-- Run this in your Supabase SQL Editor

-- First, let's check if the profiles table exists and what columns it has
-- You can run this to see the current structure:
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'profiles' AND table_schema = 'public';

-- Drop existing profiles table if it exists (BE CAREFUL - this will delete all existing data)
-- DROP TABLE IF EXISTS public.profiles CASCADE;

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
  CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_position ON public.profiles(position);
CREATE INDEX IF NOT EXISTS idx_profiles_playing_level ON public.profiles(playing_level);
CREATE INDEX IF NOT EXISTS idx_profiles_welcome_completed ON public.profiles(welcome_completed);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see and modify their own profile
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

-- If you want to migrate existing data from an old profiles table, you can do something like:
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
