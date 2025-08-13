import { PrismaClient } from '@prisma/client'

// Global variable to store the Prisma client instance
declare global {
  var __prisma: PrismaClient | undefined
}

// Create a new Prisma client with proper configuration
const createPrismaClient = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    // Connection pooling configuration for Supabase
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

// Export the Prisma client instance
export const db = globalThis.__prisma ?? createPrismaClient()

// In development, store the instance globally to prevent multiple instances
if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = db
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await db.$disconnect()
})

// Handle uncaught exceptions
process.on('uncaughtException', async (error) => {
  console.error('Uncaught Exception:', error)
  await db.$disconnect()
  process.exit(1)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', async (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  await db.$disconnect()
  process.exit(1)
})

// Database utility functions
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error
      console.error(`Database operation failed (attempt ${attempt}/${maxRetries}):`, error)
      
      if (attempt < maxRetries) {
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * attempt))
        
        // Reset connection on error
        try {
          await db.$disconnect()
          await new Promise(resolve => setTimeout(resolve, 500))
          await db.$connect()
        } catch (connectionError) {
          console.error('Failed to reset connection:', connectionError)
        }
      }
    }
  }
  
  throw lastError!
}

// Validate database connection
export const validateDatabaseConnection = async (): Promise<boolean> => {
  try {
    await db.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('Database connection validation failed:', error)
    return false
  }
}

// Ensure database connection is active
export const ensureConnection = async (): Promise<void> => {
  try {
    await db.$connect()
  } catch (error) {
    console.error('Failed to ensure database connection:', error)
    throw error
  }
}

// Reset database connection (use sparingly)
export const resetDatabaseConnection = async (): Promise<void> => {
  try {
    await db.$disconnect()
    await new Promise(resolve => setTimeout(resolve, 1000))
    await db.$connect()
  } catch (error) {
    console.error('Failed to reset database connection:', error)
    throw error
  }
}
