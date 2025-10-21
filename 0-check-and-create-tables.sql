-- ================================================
-- REBALL - Check Existing Schema and Create Tables
-- Run this FIRST in Supabase SQL Editor
-- ================================================

-- Step 1: Check if courses table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'courses'
) as courses_table_exists;

-- Step 2: Check existing columns in courses table (if it exists)
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'courses' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 3: Check if bookings table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'bookings'
) as bookings_table_exists;

-- Step 4: Check existing columns in bookings table (if it exists)
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'bookings' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 5: List all tables in public schema
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

