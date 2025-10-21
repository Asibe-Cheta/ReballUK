-- ================================================
-- REBALL - Universal Stripe Setup
-- This script adapts to your existing database structure
-- Run this in Supabase SQL Editor
-- ================================================

-- PART 1: Add Stripe columns to courses (works with any existing structure)
-- ================================================
DO $$ 
BEGIN
  -- Add stripe_product_id
  BEGIN
    ALTER TABLE courses ADD COLUMN stripe_product_id TEXT;
    RAISE NOTICE 'Added stripe_product_id to courses';
  EXCEPTION
    WHEN duplicate_column THEN RAISE NOTICE 'stripe_product_id already exists';
    WHEN undefined_table THEN RAISE NOTICE 'courses table does not exist - will be created by Prisma';
  END;
  
  -- Add stripe_price_id
  BEGIN
    ALTER TABLE courses ADD COLUMN stripe_price_id TEXT;
    RAISE NOTICE 'Added stripe_price_id to courses';
  EXCEPTION
    WHEN duplicate_column THEN RAISE NOTICE 'stripe_price_id already exists';
    WHEN undefined_table THEN NULL;
  END;
END $$;

-- PART 2: Add Stripe columns to bookings (works with any existing structure)
-- ================================================
DO $$ 
BEGIN
  -- Add stripe_payment_intent_id
  BEGIN
    ALTER TABLE bookings ADD COLUMN stripe_payment_intent_id TEXT;
    RAISE NOTICE 'Added stripe_payment_intent_id to bookings';
  EXCEPTION
    WHEN duplicate_column THEN RAISE NOTICE 'stripe_payment_intent_id already exists';
    WHEN undefined_table THEN RAISE NOTICE 'bookings table does not exist - will be created by Prisma';
  END;
  
  -- Add stripe_session_id
  BEGIN
    ALTER TABLE bookings ADD COLUMN stripe_session_id TEXT;
    RAISE NOTICE 'Added stripe_session_id to bookings';
  EXCEPTION
    WHEN duplicate_column THEN RAISE NOTICE 'stripe_session_id already exists';
    WHEN undefined_table THEN NULL;
  END;
END $$;

-- PART 3: Create indexes for performance
-- ================================================
CREATE INDEX IF NOT EXISTS idx_courses_stripe_product_id ON courses(stripe_product_id);
CREATE INDEX IF NOT EXISTS idx_bookings_stripe_session_id ON bookings(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_bookings_stripe_payment_intent_id ON bookings(stripe_payment_intent_id);

-- PART 4: Verify what was added
-- ================================================
SELECT 'Stripe columns in courses:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'courses' AND column_name LIKE '%stripe%'
ORDER BY ordinal_position;

SELECT 'Stripe columns in bookings:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'bookings' AND column_name LIKE '%stripe%'
ORDER BY ordinal_position;

SELECT '✅ Stripe columns setup complete!' as status;

