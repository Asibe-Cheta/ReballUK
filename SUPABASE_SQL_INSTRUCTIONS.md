# REBALL - Supabase SQL Setup Instructions

## 📋 Execute These SQL Scripts in Order

Go to: **Supabase Dashboard → SQL Editor**

---

## Step 1: Add Stripe Fields to Database

**File:** `stripe-schema-migration.sql`

Copy and paste the entire contents of this file into Supabase SQL Editor and run it.

This adds:
- ✅ `stripe_product_id` to courses table
- ✅ `stripe_price_id` to courses table
- ✅ `stripe_payment_intent_id` to bookings table
- ✅ `stripe_session_id` to bookings table
- ✅ Performance indexes

**Safe to run:** Uses `ADD COLUMN IF NOT EXISTS` - won't break existing data

---

## Step 2: Seed All 14 Courses

**File:** `seed-courses.sql`

Copy and paste the entire contents of this file into Supabase SQL Editor and run it.

This creates/updates:
- ✅ 2 Striker courses (Essential £199 / Advanced £299)
- ✅ 4 Winger courses (2 Crossing + 2 Finishing)
- ✅ 4 CAM courses (2 Crossing + 2 Finishing)
- ✅ 2 Full-back courses
- ✅ 2 Centre-back courses

**Safe to run:** Uses `ON CONFLICT ... DO UPDATE` - won't create duplicates

---

## Step 3: Verify Everything Worked

Run this query in SQL Editor:

```sql
-- Check Stripe fields were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'courses' AND column_name LIKE '%stripe%';

-- Check courses were seeded
SELECT id, title, position, level, price, is_active
FROM courses
WHERE is_active = true
ORDER BY position, level;
```

You should see:
- ✅ 4 Stripe-related columns
- ✅ 14 active courses with prices

---

## Step 4: Push Code to Vercel

After running the SQL scripts:

```bash
# Commit all changes
git add .
git commit -m "Add Stripe payment integration"
git push origin main
```

Vercel will auto-deploy with the new payment features.

---

## Step 5: Add Stripe Keys to Vercel

Go to: **Vercel Dashboard → reball → Settings → Environment Variables**

Add these variables:

```
Name: STRIPE_SECRET_KEY
Value: sk_test_... (your Stripe secret key)

Name: STRIPE_PUBLISHABLE_KEY  
Value: pk_test_... (your Stripe publishable key)

Name: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
Value: pk_test_... (same as above)

Name: NEXT_PUBLIC_APP_URL
Value: https://reball.uk

Name: STRIPE_WEBHOOK_SECRET
Value: whsec_... (get this after Step 6)
```

**Redeploy** after adding environment variables.

---

## Step 6: Set Up Stripe Webhook

Go to: **Stripe Dashboard → Developers → Webhooks**

1. Click "Add endpoint"
2. Endpoint URL: `https://reball.uk/api/stripe/webhook`
3. Select these events:
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
   - ✅ `charge.refunded`
4. Click "Add endpoint"
5. **Copy the Signing Secret** (starts with `whsec_`)
6. Add it to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`
7. **Redeploy Vercel** after adding the webhook secret

---

## ✅ That's It!

Once you complete these 6 steps:
- ✅ Database has Stripe fields
- ✅ All 14 courses are in database with pricing
- ✅ Stripe is configured
- ✅ Webhook is listening
- ✅ Payments will work!

---

## 🧪 Testing

Use Stripe test card: **4242 4242 4242 4242**
- Any future expiry date
- Any 3-digit CVC
- Any postal code

**When ready for production:**
- Switch to live Stripe keys (`sk_live_...` and `pk_live_...`)
- Update webhook endpoint in Stripe Dashboard
- Test with a small real transaction

---

## 📞 Next Steps

After running these SQL scripts, let me know and I'll:
1. ✅ Add purchase buttons to all 14 course detail pages
2. ✅ Add pricing to course listing cards
3. ✅ Create "My Courses" dashboard section
4. ✅ Add payment success page
5. ✅ Test the complete flow

