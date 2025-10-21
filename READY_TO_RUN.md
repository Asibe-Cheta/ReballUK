# ✅ READY TO RUN - Final Setup

## Your Database Analysis:

✅ Stripe columns **ALREADY EXIST** (stripe_product_id, stripe_price_id)
✅ Table structure confirmed
✅ Dual pricing model found: `price_121` and `price_group`

---

## 🚀 Run These 2 Scripts in Supabase SQL Editor:

### **1. Add Slug Column**
**File:** `2-add-slug-column.sql`

Paste and run this in Supabase SQL Editor.

---

### **2. Seed Courses**  
**File:** `4-seed-courses-final.sql`

Paste and run this in Supabase SQL Editor.

This creates **14 courses** with:
- **1v1 Pricing**: £199 (Essential) / £299 (Advanced)
- **Group Pricing**: £149 (Essential) / £249 (Advanced)

---

## 📝 After SQL Scripts:

Run these commands locally:

```bash
# Regenerate Prisma client with updated schema
npm run db:generate

# or
npx prisma generate
```

This updates TypeScript to know about the correct database field names.

---

## 🎯 Then:

1. ✅ Commit changes to GitHub
2. ✅ Add Stripe keys to Vercel
3. ✅ Tell me when ready
4. ✅ I'll add purchase buttons to all pages

---

## 💡 Key Discovery:

Your database supports **dual pricing**! This means:
- Users can purchase courses for 1v1 training (£199/£299)
- OR group training at a discount (£149/£249)

This is perfect for your business model! 🎉

