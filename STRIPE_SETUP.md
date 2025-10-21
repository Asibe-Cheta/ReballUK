# REBALL Stripe Payment Integration Setup Guide

## Overview

This guide will help you set up Stripe payment integration for REBALL courses and training sessions.

---

## Prerequisites

- ✅ Stripe account (sign up at https://stripe.com)
- ✅ Stripe API keys (Publishable and Secret keys)
- ✅ Product IDs for each course (optional - can be created automatically)

---

## Step 1: Environment Variables

Add the following variables to your `.env` or `.env.local` file:

```env
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_... # Your Stripe secret key (starts with sk_test_ for test mode)
STRIPE_PUBLISHABLE_KEY=pk_test_... # Your Stripe publishable key (starts with pk_test_ for test mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... # Same as above, for client-side use
STRIPE_WEBHOOK_SECRET=whsec_... # Webhook signing secret (get this after creating webhook)

# App URL (required for redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000 # Change to your production URL when deploying
```

---

## Step 2: Database Migration

Run the Prisma migration to update the database schema with Stripe fields:

```bash
npm run db:push
```

This adds the following fields:
- **Course**: `stripeProductId`, `stripePriceId`
- **Booking**: `stripePaymentIntentId`, `stripeSessionId`

---

## Step 3: Set Up Stripe Webhook (Production)

### For Local Development (using Stripe CLI):

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward webhooks to local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
4. Copy the webhook signing secret (starts with `whsec_`) to your `.env` file

### For Production:

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. URL: `https://yourdomain.com/api/stripe/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Copy the webhook signing secret to your production environment variables

---

## Step 4: Configure Course Prices

You have two options for setting course prices:

### Option A: Set Prices in Database

Update courses in your database with prices:

```sql
-- Example: Set price for Essential Striker Course
UPDATE courses 
SET price = 199.00 
WHERE title = 'Essential 1v1 Attacking Striker Finishing Course';

-- Example: Set price for Advanced Striker Course
UPDATE courses 
SET price = 299.00 
WHERE title = 'Advanced 1v1 Attacking Striker Finishing Course';
```

### Option B: Use Stripe Product IDs (Optional)

If you want to use pre-created Stripe products:

```sql
UPDATE courses 
SET stripe_product_id = 'prod_xxxxx', 
    stripe_price_id = 'price_xxxxx',
    price = 199.00
WHERE title = 'Essential 1v1 Attacking Striker Finishing Course';
```

---

## Step 5: Recommended Pricing Structure

Here's a suggested pricing structure for your courses:

### Essential Courses (4-6 weeks)
- **Striker Essential**: £199
- **Winger Essential**: £199
- **CAM Essential**: £199
- **Full-back Essential**: £199
- **Centre-back Essential**: £199
- **CM Essential**: £199 (when available)
- **CDM Essential**: £199 (when available)

### Advanced Courses (6-8 weeks)
- **Striker Advanced**: £299
- **Winger Advanced**: £299
- **CAM Advanced**: £299
- **Full-back Advanced**: £299
- **Centre-back Advanced**: £299
- **CM Advanced**: £299 (when available)
- **CDM Advanced**: £299 (when available)

### Training Sessions (existing)
- **Group Session**: £25 per session
- **1v1 Session**: £75 per session

---

## Step 6: Test the Integration

### Test Mode (Recommended First):

1. Use test API keys (starting with `sk_test_` and `pk_test_`)
2. Use Stripe test cards:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - 3D Secure: `4000 0025 0000 3155`
3. Any future date for expiry, any 3 digits for CVC, any postal code

### Live Mode:

1. Switch to live API keys (starting with `sk_live_` and `pk_live_`)
2. Update webhook endpoint in Stripe Dashboard
3. Test with a real small transaction first

---

## How It Works

### For Course Purchase:

1. User clicks "Purchase Course" button on course detail page
2. System creates Stripe Checkout session via `/api/stripe/create-checkout-session`
3. User is redirected to Stripe-hosted checkout page
4. After payment:
   - Success → User redirected to `/dashboard?payment=success`
   - Cancel → User redirected back to course page
5. Stripe webhook notifies our system at `/api/stripe/webhook`
6. System creates a booking record with `paymentStatus: PAID`

### For Booking/Session Payment:

1. User books a session in `/bookings`
2. Booking created with `paymentStatus: PENDING`
3. User clicks "Pay Now" button
4. Same Stripe checkout flow as courses
5. Booking updated to `paymentStatus: PAID`

---

## File Structure Created

```
src/
├── lib/
│   ├── stripe.ts                    # Stripe configuration and helper functions
│   └── env.ts                       # Updated with Stripe env variables
├── hooks/
│   └── use-stripe-checkout.ts       # React hook for checkout
├── components/
│   └── ui/
│       ├── purchase-button.tsx      # Reusable purchase button
│       └── course-pricing-card.tsx  # Course pricing display component
├── app/
│   └── api/
│       └── stripe/
│           ├── create-checkout-session/
│           │   └── route.ts         # Create Stripe checkout
│           └── webhook/
│               └── route.ts         # Handle Stripe webhooks
└── types/
    └── stripe.ts                     # TypeScript types for Stripe
```

---

## Security Best Practices

✅ **Never expose secret keys** - Use environment variables
✅ **Verify webhook signatures** - Already implemented
✅ **Validate amounts server-side** - Prices fetched from database
✅ **Use HTTPS in production** - Required by Stripe
✅ **Log all transactions** - Implemented in webhook handler

---

## Next Steps

Once you provide your Stripe API keys and product IDs:

1. I'll add purchase buttons to all course detail pages
2. Add pricing information to course cards
3. Create a "My Purchases" section in the dashboard
4. Add payment history view
5. Create receipt/invoice generation

---

## Course Database Seeding Script

I can create a script to:
- Seed all courses into the database
- Set proper prices
- Link Stripe product IDs (if provided)
- Make courses active/inactive

Would you like me to create this script?

---

## Support

For Stripe-related questions:
- Stripe Documentation: https://stripe.com/docs
- Stripe Dashboard: https://dashboard.stripe.com
- Test your integration: https://stripe.com/docs/testing

