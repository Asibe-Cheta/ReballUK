-- ================================================
-- REBALL - Create Courses Table
-- Run this in Supabase SQL Editor
-- ================================================

-- Create courses table if it doesn't exist
CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  position TEXT,
  level TEXT,
  duration INTEGER NOT NULL DEFAULT 60,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  stripe_product_id TEXT,
  stripe_price_id TEXT,
  tags TEXT[] DEFAULT '{}',
  thumbnail_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_courses_position ON courses(position);
CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(level);
CREATE INDEX IF NOT EXISTS idx_courses_is_active ON courses(is_active);
CREATE INDEX IF NOT EXISTS idx_courses_stripe_product_id ON courses(stripe_product_id);

-- Verify table was created
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'courses' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

