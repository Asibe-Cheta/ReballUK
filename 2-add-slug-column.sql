-- ================================================
-- REBALL - Add Slug Column for URL-friendly course IDs
-- Run this BEFORE seeding courses
-- ================================================

-- Add slug column to courses table
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'slug') THEN
    ALTER TABLE courses ADD COLUMN slug TEXT UNIQUE;
    CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
    RAISE NOTICE 'Added slug column to courses';
  ELSE
    RAISE NOTICE 'Slug column already exists';
  END IF;
END $$;

-- Verify
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'courses' AND column_name = 'slug';

SELECT '✅ Slug column ready!' as status;

