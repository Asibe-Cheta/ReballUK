-- ================================================
-- REBALL - Diagnose Current Database Schema
-- Run this FIRST to see what exists
-- ================================================

-- Check all tables in public schema
SELECT 
  'Available Tables:' as info,
  table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- If courses table exists, show its structure
SELECT 
  'Courses Table Columns:' as info,
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'courses' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- If bookings table exists, show its structure
SELECT 
  'Bookings Table Columns:' as info,
  column_name, 
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'bookings' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if any courses exist
SELECT 
  'Existing Courses Count:' as info,
  COUNT(*) as count 
FROM courses;

-- Show sample course data if any exists
SELECT 
  'Sample Course Data:' as info,
  * 
FROM courses 
LIMIT 3;

