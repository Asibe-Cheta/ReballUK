# ✅ Simple 2-Step SQL Setup

## **The Problem:**
Your `courses` table already exists (created by Prisma), but I don't know the exact column names yet.

---

## **Solution - Run These 2 Scripts:**

### **Step 1: Add Stripe Columns** ✅

**File:** `UNIVERSAL_SETUP.sql`

This script:
- ✅ Works with ANY existing database structure  
- ✅ Only adds the 4 Stripe columns needed
- ✅ Won't break if columns already exist
- ✅ Handles errors gracefully

**Action:**
1. Open Supabase → SQL Editor
2. Copy **ALL contents** of `UNIVERSAL_SETUP.sql`
3. Paste and click **Run**
4. You should see: "✅ Stripe columns setup complete!"

---

### **Step 2: Check What Columns Exist**

**Run this query:**

```sql
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'courses' 
ORDER BY ordinal_position;
```

**Send me the output**, and I'll create a custom seeding script that matches your exact database structure.

---

## **Alternative: Skip Database Seeding for Now**

If you want to **skip database seeding** and just add Stripe functionality:

1. ✅ Run `UNIVERSAL_SETUP.sql` (adds Stripe columns)
2. ✅ Push code to GitHub (deploys to Vercel)
3. ✅ Add Stripe keys to Vercel
4. ✅ I'll add purchase buttons that create courses on-the-fly

**The courses will be created automatically when users try to purchase them.**

---

## **What Do You Prefer?**

**Option A:** Send me the output from the diagnostic query above, and I'll create perfect SQL inserts

**Option B:** Just run `UNIVERSAL_SETUP.sql` and we'll handle courses dynamically

Either way works! Let me know which you prefer. 🚀

