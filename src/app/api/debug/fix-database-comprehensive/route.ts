import { NextRequest, NextResponse } from "next/server"
import { db, withRetry } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    console.log("=== COMPREHENSIVE DATABASE FIX START ===")
    
    const results = []
    
    // Step 1: Test basic connection
    try {
      await withRetry(async () => {
        await db.$queryRaw`SELECT 1`
      })
      results.push("✅ Database connection test passed")
    } catch (error) {
      results.push(`❌ Database connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      return NextResponse.json({
        success: false,
        error: "Database connection failed",
        results
      }, { status: 500 })
    }
    
    // Step 2: Check and add missing columns to users table (camelCase)
    const userColumnsToAdd = [
      { name: 'createdAt', type: 'TIMESTAMP(3) DEFAULT NOW()' },
      { name: 'updatedAt', type: 'TIMESTAMP(3) DEFAULT NOW()' },
      { name: 'email_verified', type: 'TIMESTAMP(3)' },
      { name: 'password', type: 'TEXT' }
    ]
    
    for (const column of userColumnsToAdd) {
      try {
        // Check if column exists using a simple query
        const columnExists = await withRetry(async () => {
          const result = await db.$queryRaw`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'users' 
            AND column_name = ${column.name}
          `
          return Array.isArray(result) && result.length > 0
        })
        
        if (!columnExists) {
          // Add the column
          await withRetry(async () => {
            await db.$executeRaw`ALTER TABLE users ADD COLUMN ${db.$raw(column.name)} ${db.$raw(column.type)}`
          })
          results.push(`✅ Added ${column.name} column to users table`)
        } else {
          results.push(`ℹ️ ${column.name} column already exists in users table`)
        }
      } catch (error) {
        results.push(`❌ Failed to handle ${column.name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
    
    // Step 3: Check and add missing columns to profiles table (snake_case)
    const profileColumnsToAdd = [
      { name: 'first_name', type: 'TEXT' },
      { name: 'last_name', type: 'TEXT' },
      { name: 'date_of_birth', type: 'TIMESTAMP(3)' },
      { name: 'training_level', type: 'TEXT' },
      { name: 'confidence_rating', type: 'INTEGER' },
      { name: 'preferred_foot', type: 'TEXT' },
      { name: 'height', type: 'INTEGER' },
      { name: 'weight', type: 'INTEGER' },
      { name: 'bio', type: 'TEXT' },
      { name: 'goals', type: 'TEXT' },
      { name: 'phone_number', type: 'TEXT' },
      { name: 'emergency_contact', type: 'TEXT' },
      { name: 'medical_info', type: 'TEXT' },
      { name: 'is_active', type: 'BOOLEAN DEFAULT TRUE' },
      { name: 'completed_onboarding', type: 'BOOLEAN DEFAULT FALSE' },
      { name: 'created_at', type: 'TIMESTAMP(3) DEFAULT NOW()' },
      { name: 'updated_at', type: 'TIMESTAMP(3) DEFAULT NOW()' }
    ]
    
    for (const column of profileColumnsToAdd) {
      try {
        // Check if column exists
        const columnExists = await withRetry(async () => {
          const result = await db.$queryRaw`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'profiles' 
            AND column_name = ${column.name}
          `
          return Array.isArray(result) && result.length > 0
        })
        
        if (!columnExists) {
          // Add the column
          await withRetry(async () => {
            await db.$executeRaw`ALTER TABLE profiles ADD COLUMN ${db.$raw(column.name)} ${db.$raw(column.type)}`
          })
          results.push(`✅ Added ${column.name} column to profiles table`)
        } else {
          results.push(`ℹ️ ${column.name} column already exists in profiles table`)
        }
      } catch (error) {
        results.push(`❌ Failed to handle ${column.name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
    
    // Step 4: Verify all required tables exist
    const requiredTables = ['users', 'profiles', 'sessions', 'accounts', 'verificationtokens']
    const tableStatus = {}
    
    for (const table of requiredTables) {
      try {
        const tableExists = await withRetry(async () => {
          const result = await db.$queryRaw`
            SELECT EXISTS (
              SELECT FROM information_schema.tables 
              WHERE table_schema = 'public' 
              AND table_name = ${table}
            ) as exists
          `
          return Array.isArray(result) && result.length > 0 && result[0].exists
        })
        
        tableStatus[table] = tableExists
        results.push(`${tableExists ? '✅' : '❌'} Table ${table}: ${tableExists ? 'exists' : 'missing'}`)
      } catch (error) {
        tableStatus[table] = false
        results.push(`❌ Failed to check table ${table}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
    
    // Step 5: Test user creation with the fixed schema
    try {
      const testUser = await withRetry(async () => {
        return await db.user.create({
          data: {
            name: 'Test User',
            email: `test-${Date.now()}@example.com`,
            password: 'testpassword',
            emailVerified: new Date(),
            // createdAt and updatedAt will be handled by Prisma defaults
          }
        })
      })
      
      // Clean up test user
      await withRetry(async () => {
        await db.user.delete({
          where: { id: testUser.id }
        })
      })
      
      results.push("✅ User creation test passed")
    } catch (error) {
      results.push(`❌ User creation test failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    
    console.log("=== COMPREHENSIVE DATABASE FIX COMPLETED ===")
    
    return NextResponse.json({
      success: true,
      message: "Comprehensive database fix completed",
      results,
      tableStatus,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error("=== COMPREHENSIVE DATABASE FIX ERROR ===")
    console.error("Error:", error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
