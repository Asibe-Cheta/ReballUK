-- Comprehensive RLS Policy Fix for Profile Completion
-- Run this in your Supabase SQL Editor

-- First, let's see what policies currently exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'profiles' AND schemaname = 'public'
ORDER BY policyname;

-- Check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles' AND schemaname = 'public';

-- Drop ALL existing policies to start completely fresh
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;

-- Temporarily disable RLS to test
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create new policies with explicit role assignments
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add admin policies
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can manage all profiles" ON public.profiles
  FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role = 'ADMIN'
    )
  );

-- Grant permissions explicitly
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.profiles TO anon;

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'profiles' AND schemaname = 'public'
ORDER BY policyname;

-- Test query to see if we can select from profiles (this should work for authenticated users)
-- SELECT COUNT(*) FROM public.profiles;

-- Check if the user exists in both auth.users and public.users
-- Replace 'your-user-id-here' with the actual user ID from the error
-- SELECT 
--   au.id as auth_user_id,
--   au.email as auth_email,
--   pu.id as public_user_id,
--   pu.email as public_email,
--   pu.role as public_role
-- FROM auth.users au
-- LEFT JOIN public.users pu ON au.id = pu.id
-- WHERE au.email = 'harry@reball.uk';

-- Alternative approach: Create a more permissive policy for testing
-- DROP POLICY IF EXISTS "Allow authenticated users to manage profiles" ON public.profiles;
-- CREATE POLICY "Allow authenticated users to manage profiles" ON public.profiles
--   FOR ALL 
--   TO authenticated
--   USING (true)
--   WITH CHECK (true);

-- Final verification
SELECT 
  'RLS Status' as check_type,
  CASE WHEN rowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as status
FROM pg_tables 
WHERE tablename = 'profiles' AND schemaname = 'public'

UNION ALL

SELECT 
  'Policy Count' as check_type,
  COUNT(*)::text as status
FROM pg_policies 
WHERE tablename = 'profiles' AND schemaname = 'public';
