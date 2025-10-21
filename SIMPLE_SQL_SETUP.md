# 🚀 REBALL Stripe Setup - Simple SQL Guide

## Run These Scripts in Order in Supabase SQL Editor

---

## **Script 1: Check What Exists** ✅

**File:** `0-check-and-create-tables.sql`

1. Open Supabase Dashboard
2. Go to **SQL Editor**
3. Copy the entire contents of `0-check-and-create-tables.sql`
4. Paste and click **Run**
5. **Check the output** - it will show you what tables exist

---

## **Script 2: Create Courses Table** ✅

**File:** `1-create-courses-table.sql`

1. Copy the entire contents of `1-create-courses-table.sql`
2. Paste into Supabase SQL Editor
3. Click **Run**
4. This creates the `courses` table with all Stripe fields

**Safe:** Uses `CREATE TABLE IF NOT EXISTS` - won't overwrite if table exists

---

## **Script 3: Add Stripe Fields** ✅

**File:** `stripe-schema-migration.sql`

1. Copy the entire contents of `stripe-schema-migration.sql`
2. Paste into Supabase SQL Editor
3. Click **Run**
4. This adds Stripe tracking fields to both `courses` and `bookings` tables

**Safe:** Uses `ADD COLUMN IF NOT EXISTS` - won't break existing data

---

## **Script 4: Seed All 14 Courses** ✅

**File:** `seed-courses.sql`

1. Copy the entire contents of `seed-courses.sql`
2. Paste into Supabase SQL Editor
3. Click **Run**
4. This inserts all 14 active courses with pricing

**Safe:** Uses `ON CONFLICT DO UPDATE` - won't create duplicates

---

## **Quick Verification**

Run this final check:

```sql
-- Should show 14 courses
SELECT COUNT(*) as total_courses FROM courses WHERE is_active = true;

-- Should show all courses with prices
SELECT id, title, price, level FROM courses ORDER BY position, level;
```

Expected result: **14 courses** with prices £199 (Essential) or £299 (Advanced)

---

## **After SQL Scripts Complete:**

1. ✅ Push code to GitHub (triggers Vercel deployment)
2. ✅ Add Stripe keys to Vercel environment variables
3. ✅ Tell me when ready, and I'll add purchase buttons to all pages!

---

## **Troubleshooting:**

**If Script 2 (seed-courses.sql) fails:**
- The courses table might not exist yet
- Run Script 2 (1-create-courses-table.sql) first
- Then run Script 4 (seed-courses.sql) again

**If you see "column already exists":**
- That's fine! It means the field was already there
- Continue to the next script

**If you see "relation does not exist":**
- Run Script 2 (1-create-courses-table.sql) to create the table
- Then continue with other scripts

