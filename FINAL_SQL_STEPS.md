# ✅ FINAL SQL SETUP - 3 Simple Steps

## Your Database Structure Confirmed:

- ✅ `courses` table exists
- ✅ Has UUID `id` field
- ✅ Has `name`, `description`, `position`, `type` columns
- ✅ Has `price_121` and `price_group` (dual pricing!)
- ✅ **Stripe columns already added!** (`stripe_product_id`, `stripe_price_id`)

---

## 🚀 Run These 2 Scripts in Order:

### **Script 1: Add Slug Column**

**File:** `2-add-slug-column.sql`

This adds a `slug` column so URLs work correctly (e.g., `/programs/striker-1v1-attacking-essential`)

1. Open Supabase → SQL Editor
2. Copy entire contents of `2-add-slug-column.sql`
3. Paste and Run

---

### **Script 2: Seed All 14 Courses**

**File:** `4-seed-courses-final.sql`

This creates all 14 courses with:
- **1v1 Price**: £199 (Essential) / £299 (Advanced)
- **Group Price**: £149 (Essential) / £249 (Advanced)
- Slugs for URL routing
- Proper UUIDs

1. Copy entire contents of `4-seed-courses-final.sql`
2. Paste and Run
3. You should see: "✅ Total Active Courses: 14"

---

## 📊 Your Pricing Model:

I noticed your database has **dual pricing**:

### **1v1 Training** (Personalized):
- Essential Courses: **£199**
- Advanced Courses: **£299**

### **Group Training** (4 players max):
- Essential Courses: **£149** (25% discount)
- Advanced Courses: **£249** (17% discount)

This is brilliant! Users can choose their preferred training format.

---

## ✅ After Running These Scripts:

Your database will have:
- ✅ 14 active courses
- ✅ All with proper pricing (1v1 & group)
- ✅ Slugs for URL routing
- ✅ Stripe tracking fields
- ✅ Ready for payment integration

Then I'll update the code to:
1. Use `slug` for URL routing
2. Use `name` instead of `title`
3. Support dual pricing (1v1 vs group)
4. Add purchase buttons

---

## 🎯 Next: After SQL Scripts Complete

Tell me when you've run both scripts, and I'll:
1. Update all API code to use correct column names
2. Add purchase buttons to all 14 course pages
3. Show 1v1 vs Group pricing options
4. Deploy to Vercel

**Run the 2 scripts now, and we're almost done!** 🚀

