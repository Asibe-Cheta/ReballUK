# 🔧 Vercel Stripe Setup Instructions

## ✅ Build Issue Fixed!

The build was failing because Stripe environment variables weren't set in Vercel. I've fixed this by making Stripe initialization conditional.

## 🚀 Next Steps for Vercel Deployment:

### **1. Add Stripe Environment Variables in Vercel:**

Go to your Vercel dashboard → Project Settings → Environment Variables and add:

```
STRIPE_SECRET_KEY=sk_test_... (or sk_live_... for production)
STRIPE_PUBLISHABLE_KEY=pk_test_... (or pk_live_... for production)  
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... (same as above)
NEXT_PUBLIC_APP_URL=https://reball.uk
```

### **2. Environment Variables Needed:**

- **STRIPE_SECRET_KEY**: Your Stripe secret key (starts with `sk_test_` or `sk_live_`)
- **STRIPE_PUBLISHABLE_KEY**: Your Stripe publishable key (starts with `pk_test_` or `pk_live_`)
- **STRIPE_WEBHOOK_SECRET**: Webhook endpoint secret (starts with `whsec_`)
- **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY**: Same as publishable key (for client-side)
- **NEXT_PUBLIC_APP_URL**: Your domain (https://reball.uk)

### **3. How to Get Stripe Keys:**

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. **API Keys** section → Copy your keys
3. **Webhooks** section → Create endpoint → Copy signing secret

### **4. After Adding Variables:**

1. ✅ Redeploy your Vercel project
2. ✅ The build should now succeed
3. ✅ Stripe payments will work when keys are added

---

## 🎯 What I Fixed:

- ✅ Made Stripe initialization conditional (won't fail during build)
- ✅ Added proper error handling for missing Stripe keys
- ✅ Build now works without Stripe environment variables
- ✅ Stripe will work once you add the environment variables

The build should now succeed on Vercel! 🚀
