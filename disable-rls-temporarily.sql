-- Temporarily disable RLS for profiles table to allow profile creation
-- Run this in your Supabase SQL Editor

-- Disable RLS temporarily
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles' AND schemaname = 'public';

-- Note: This will allow any authenticated user to create/update profiles
-- You can re-enable RLS later with: ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
