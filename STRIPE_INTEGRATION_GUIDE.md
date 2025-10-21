# REBALL Stripe Integration - Complete Guide

## ✅ What Has Been Set Up

### 1. **Database Schema Enhanced**
```prisma
Course {
  stripeProductId String? // Links to Stripe Product
  stripePriceId   String? // Links to Stripe Price
  price           Decimal // Course price in GBP
}

Booking {
  stripePaymentIntentId String? // Payment tracking
  stripeSessionId       String? // Checkout session tracking
  paymentStatus         PaymentStatus // PENDING/PAID/FAILED/REFUNDED
}
```

### 2. **Stripe Infrastructure Created**

#### Files Created:
- ✅ `src/lib/stripe.ts` - Stripe SDK initialization & helper functions
- ✅ `src/types/stripe.ts` - TypeScript types for Stripe
- ✅ `src/hooks/use-stripe-checkout.ts` - React hook for checkout
- ✅ `src/components/ui/purchase-button.tsx` - Reusable purchase button
- ✅ `src/components/ui/course-pricing-card.tsx` - Course pricing display
- ✅ `src/app/api/stripe/create-checkout-session/route.ts` - Checkout API
- ✅ `src/app/api/stripe/webhook/route.ts` - Webhook handler
- ✅ Environment variables schema updated

### 3. **Payment Flow**

```
User Journey:
1. Browse courses → /programs
2. Select course → /programs/[course-id]
3. Click "Purchase" button
4. Redirected to Stripe Checkout (secure hosted page)
5. Enter payment details
6. On success → /dashboard?payment=success
7. On cancel → back to course page
8. Webhook updates database in background
```

---

## 📋 To Complete Integration

### Required from You:

#### 1. **Stripe API Keys** (Get from https://dashboard.stripe.com/apikeys)
```env
# Test Mode Keys (for development)
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE

# Production Keys (when going live)
# STRIPE_SECRET_KEY=sk_live_YOUR_KEY_HERE
# STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_KEY_HERE
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_KEY_HERE
```

#### 2. **Webhook Secret** (After setting up webhook)
```env
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
```

#### 3. **App URL**
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000  # or your production URL
```

#### 4. **Course Prices** (Optional - can use Product IDs or set directly)

**Option A: Set prices in database directly**
```sql
-- I can create a seeding script for this
```

**Option B: Provide Stripe Product IDs**
```
Essential Courses:
- Striker Essential: prod_xxxxx
- Winger Essential: prod_xxxxx
etc...
```

---

## 🎨 How to Add Purchase Button to Course Pages

### Example Integration in Course Detail Page:

```tsx
import CoursePricingCard from "@/components/ui/course-pricing-card"

export default function CourseDetailPage() {
  return (
    <div>
      {/* ... existing hero section ... */}
      
      {/* Course Overview Section */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              
              {/* Left: Course Description */}
              <div>
                <h2>Course Overview</h2>
                {/* ... course description ... */}
              </div>
              
              {/* Right: Pricing Card with Purchase Button */}
              <CoursePricingCard
                courseId="fb-1v1-attacking-essential"
                price={199}
                duration="4-6 weeks"
                level="Essential"
                position="Full-back"
                prerequisites="None"
                features={[
                  "8 comprehensive 1v1 scenarios",
                  "SISW video analysis",
                  "Post-training snacks & drinks",
                  "Course completion certificate",
                  "REBALL Wrapped highlight video"
                ]}
              />
              
            </div>
          </div>
        </div>
      </section>
      
      {/* ... rest of page ... */}
    </div>
  )
}
```

---

## 🔧 Course Seeding Script

I'll create a script to populate all courses in the database with proper pricing:

### Courses to Create:

#### Strikers (2 courses)
- Essential 1v1 Attacking Striker Finishing - £199
- Advanced 1v1 Attacking Striker Finishing - £299

#### Wingers (4 courses)
- Essential 1v1 Attacking Winger Crossing - £199
- Advanced 1v1 Attacking Winger Crossing - £299
- Essential 1v1 Attacking Winger Finishing - £199
- Advanced 1v1 Attacking Winger Finishing - £299

#### CAM (4 courses)
- Essential 1v1 Attacking CAM Crossing - £199
- Advanced 1v1 Attacking CAM Crossing - £299
- Essential 1v1 Attacking CAM Finishing - £199
- Advanced 1v1 Attacking CAM Finishing - £299

#### Full-backs (2 courses)
- Essential 1v1 Attacking Full-back - £199
- Advanced 1v1 Attacking Full-back - £299

#### Centre-backs (2 courses)
- Essential 1v1 Defending Centre-back - £199
- Advanced 1v1 Defending Centre-back - £299

**Total: 14 active courses**

---

## 💳 Payment Features Included

### ✅ Implemented:

1. **Secure Checkout** - Stripe-hosted checkout page
2. **Multiple Payment Methods** - Card, Apple Pay, Google Pay
3. **Webhook Processing** - Automatic order fulfillment
4. **Payment Status Tracking** - PENDING → PAID → COMPLETED
5. **Error Handling** - Failed payment notifications
6. **Refund Support** - Ready for refund processing
7. **Test Mode** - Full testing capability
8. **Mobile Responsive** - Works on all devices

### 🚀 Ready to Add:

1. **Purchase buttons** on all 14 course detail pages
2. **Pricing display** on course listing pages
3. **Payment history** in user dashboard
4. **Receipt generation** after successful payment
5. **Course access control** (only show videos to paid users)

---

## 📊 Dashboard Integration

### Current Dashboard Structure:
- Book Session (£25 group / £75 1v1)
- My Bookings
- Progress Tracking
- Video Analysis

### To Add:
- **My Courses** - List of purchased courses
- **Payment History** - All transactions
- **Access Control** - Lock course content until paid

---

## 🧪 Testing Checklist

Before going live, test:

- [ ] Course purchase flow
- [ ] Booking payment flow
- [ ] Successful payment webhook
- [ ] Failed payment handling
- [ ] Refund processing
- [ ] Redirect URLs
- [ ] Mobile checkout
- [ ] Email notifications (optional)

---

## 🚨 Important Notes

1. **Prices are in GBP (£)** - All course prices use British Pounds
2. **Stripe handles currency** - Automatic conversion if needed
3. **Webhook is critical** - Must be set up for payments to complete
4. **Test thoroughly** - Always test in test mode first
5. **Database sync** - Webhook keeps database in sync with Stripe

---

## 🆘 Troubleshooting

### Payment not completing?
- Check webhook is set up correctly
- Verify webhook secret in environment
- Check Stripe Dashboard logs

### Redirect not working?
- Verify `NEXT_PUBLIC_APP_URL` is correct
- Check success/cancel URLs in checkout session

### Prices not showing?
- Run `npm run db:push` to update schema
- Check course records have price values

---

## Next Actions Needed

**Please provide:**

1. ✅ Stripe Test API Keys (secret & publishable)
2. ✅ Whether you want to use Stripe Product IDs or database prices
3. ✅ Confirmation of pricing structure
4. ✅ Any specific product IDs if using Option B

**Then I will:**

1. ✅ Add purchase buttons to all course pages
2. ✅ Create course seeding script with prices
3. ✅ Add "My Courses" section to dashboard
4. ✅ Add payment success/failure pages
5. ✅ Add course access control

