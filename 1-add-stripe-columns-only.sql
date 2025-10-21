-- ================================================
-- REBALL - Add Stripe Columns Only
-- Run this after checking database structure
-- ================================================

-- Add Stripe columns to courses table (if table exists)
DO $$ 
BEGIN
  -- Check if courses table exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'courses') THEN
    -- Add stripe_product_id if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'stripe_product_id') THEN
      ALTER TABLE courses ADD COLUMN stripe_product_id TEXT;
      RAISE NOTICE 'Added stripe_product_id to courses';
    END IF;
    
    -- Add stripe_price_id if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'stripe_price_id') THEN
      ALTER TABLE courses ADD COLUMN stripe_price_id TEXT;
      RAISE NOTICE 'Added stripe_price_id to courses';
    END IF;
  ELSE
    RAISE NOTICE 'Courses table does not exist!';
  END IF;
END $$;

-- Add Stripe columns to bookings table (if table exists)
DO $$ 
BEGIN
  -- Check if bookings table exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'bookings') THEN
    -- Add stripe_payment_intent_id if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'stripe_payment_intent_id') THEN
      ALTER TABLE bookings ADD COLUMN stripe_payment_intent_id TEXT;
      RAISE NOTICE 'Added stripe_payment_intent_id to bookings';
    END IF;
    
    -- Add stripe_session_id if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'stripe_session_id') THEN
      ALTER TABLE bookings ADD COLUMN stripe_session_id TEXT;
      RAISE NOTICE 'Added stripe_session_id to bookings';
    END IF;
  ELSE
    RAISE NOTICE 'Bookings table does not exist!';
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_courses_stripe_product_id ON courses(stripe_product_id);
CREATE INDEX IF NOT EXISTS idx_bookings_stripe_session_id ON bookings(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_bookings_stripe_payment_intent_id ON bookings(stripe_payment_intent_id);

-- Verify changes
SELECT 'Stripe columns in courses:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'courses' AND column_name LIKE '%stripe%';

SELECT 'Stripe columns in bookings:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'bookings' AND column_name LIKE '%stripe%';

