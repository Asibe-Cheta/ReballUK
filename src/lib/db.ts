import { PrismaClient } from '@prisma/client'

declare global {
  var __prisma: PrismaClient | undefined
}

// Create a new Prisma client with proper connection management for Supabase
const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })
}

// Use a singleton pattern but with better connection management
export const db = globalThis.__prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = db
}

// Graceful shutdown handlers
process.on('beforeExit', async () => {
  await db.$disconnect()
})

process.on('uncaughtException', async (error) => {
  console.error('Uncaught Exception:', error)
  await db.$disconnect()
  process.exit(1)
})

process.on('unhandledRejection', async (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  await db.$disconnect()
  process.exit(1)
})

// Enhanced retry function with connection reset
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

      // If it's a prepared statement error, reset the connection
      if (error instanceof Error && error.message.includes('prepared statement')) {
        console.log(`Prepared statement error detected, resetting connection...`)
        try {
          await db.$disconnect()
          await new Promise(resolve => setTimeout(resolve, 500))
          await db.$connect()
          console.log(`Connection reset successful`)
        } catch (connectionError) {
          console.error('Failed to reset connection:', connectionError)
        }
      }

      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt))
      }
    }
  }
  
  throw lastError!
}

// Database utility functions
export const validateDatabaseConnection = async (): Promise<boolean> => {
  try {
    await db.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('Database connection validation failed:', error)
    return false
  }
}

export const ensureConnection = async (): Promise<void> => {
  try {
    await db.$connect()
  } catch (error) {
    console.error('Failed to ensure database connection:', error)
    throw error
  }
}

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
