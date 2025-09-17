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

-- ========================================
-- ADMIN FUNCTIONALITY SETUP
-- ========================================

-- Create users table if it doesn't exist (for admin role management)
-- First check if table exists and handle accordingly
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
        -- Create the table with role column
        CREATE TABLE public.users (
          id uuid NOT NULL,
          email text NOT NULL,
          name text,
          image text,
          role text DEFAULT 'USER',
          created_at timestamp with time zone DEFAULT now(),
          updated_at timestamp with time zone DEFAULT now(),
          CONSTRAINT users_pkey PRIMARY KEY (id),
          CONSTRAINT users_email_key UNIQUE (email),
          CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE
        ) TABLESPACE pg_default;
        RAISE NOTICE 'Created new users table with role column';
    ELSE
        RAISE NOTICE 'Users table already exists, will add role column if missing';
    END IF;
END $$;

-- Add role column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role') THEN
        ALTER TABLE public.users ADD COLUMN role text DEFAULT 'USER';
        RAISE NOTICE 'Added role column to users table';
    ELSE
        RAISE NOTICE 'Role column already exists in users table';
    END IF;
END $$;

-- Create indexes for users table
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- Enable RLS for users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;

CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role = 'ADMIN'
    )
  );

-- Grant permissions for users table
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.users TO service_role;

-- ========================================
-- BOOKINGS TABLE (for admin booking management)
-- ========================================

-- Create bookings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.bookings (
  id text NOT NULL DEFAULT extensions.cuid(),
  user_id uuid NOT NULL,
  course_id text NOT NULL,
  scheduled_for timestamp with time zone,
  status text DEFAULT 'PENDING',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT bookings_pkey PRIMARY KEY (id),
  CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Create indexes for bookings table
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_course_id ON public.bookings(course_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_for ON public.bookings(scheduled_for);

-- Enable RLS for bookings table
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for bookings table
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;

CREATE POLICY "Users can view own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all bookings" ON public.bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role = 'ADMIN'
    )
  );

-- Grant permissions for bookings table
GRANT ALL ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;

-- ========================================
-- COURSES TABLE (for booking management)
-- ========================================

-- Create courses table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.courses (
  id text NOT NULL DEFAULT extensions.cuid(),
  title text NOT NULL,
  description text,
  position text,
  level text,
  duration_minutes integer DEFAULT 60,
  max_participants integer DEFAULT 1,
  price decimal(10,2),
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT courses_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

-- Create indexes for courses table
CREATE INDEX IF NOT EXISTS idx_courses_position ON public.courses(position);
CREATE INDEX IF NOT EXISTS idx_courses_level ON public.courses(level);
CREATE INDEX IF NOT EXISTS idx_courses_is_active ON public.courses(is_active);

-- Enable RLS for courses table
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for courses table (public read access)
DROP POLICY IF EXISTS "Anyone can view active courses" ON public.courses;
DROP POLICY IF EXISTS "Admins can manage courses" ON public.courses;

CREATE POLICY "Anyone can view active courses" ON public.courses
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage courses" ON public.courses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role = 'ADMIN'
    )
  );

-- Grant permissions for courses table
GRANT ALL ON public.courses TO authenticated;
GRANT ALL ON public.courses TO service_role;
GRANT SELECT ON public.courses TO anon;

-- ========================================
-- ADMIN ROLE SETUP
-- ========================================

-- Function to automatically create user record when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, image, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'avatar_url',
    'USER'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user record
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ========================================
-- SAMPLE DATA (Optional - for testing)
-- ========================================

-- Insert sample courses (uncomment if needed for testing)
-- INSERT INTO public.courses (title, description, position, level, duration_minutes, max_participants, price) VALUES
-- ('1v1 Striker Training', 'Advanced striker training session', 'STRIKER', 'ADVANCED', 60, 1, 50.00),
-- ('1v1 Winger Training', 'Winger-specific training session', 'WINGER', 'INTERMEDIATE', 60, 1, 45.00),
-- ('1v1 Midfielder Training', 'Midfielder training session', 'MIDFIELDER', 'ADVANCED', 60, 1, 50.00);

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- After running this script, verify the tables were created correctly:
-- SELECT 'profiles' as table_name, COUNT(*) as row_count FROM public.profiles
-- UNION ALL
-- SELECT 'users' as table_name, COUNT(*) as row_count FROM public.users
-- UNION ALL
-- SELECT 'bookings' as table_name, COUNT(*) as row_count FROM public.bookings
-- UNION ALL
-- SELECT 'courses' as table_name, COUNT(*) as row_count FROM public.courses;

-- Check table structures:
-- SELECT table_name, column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_schema = 'public' 
-- AND table_name IN ('profiles', 'users', 'bookings', 'courses')
-- ORDER BY table_name, ordinal_position;
