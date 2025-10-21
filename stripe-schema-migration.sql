-- ================================================
-- REBALL Stripe Integration - Database Migration
-- Run this in Supabase SQL Editor
-- ================================================

-- Step 1: Add Stripe fields to courses table
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS stripe_product_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_price_id TEXT;

-- Step 2: Add Stripe fields to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;

-- Step 3: Add indexes for better performance (optional but recommended)
CREATE INDEX IF NOT EXISTS idx_courses_stripe_product_id ON courses(stripe_product_id);
CREATE INDEX IF NOT EXISTS idx_bookings_stripe_session_id ON bookings(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_bookings_stripe_payment_intent_id ON bookings(stripe_payment_intent_id);

-- Verify changes
SELECT 
  table_name, 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name IN ('courses', 'bookings') 
  AND column_name LIKE '%stripe%'
ORDER BY table_name, ordinal_position;

