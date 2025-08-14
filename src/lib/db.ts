import { PrismaClient } from '@prisma/client'

declare global {
  var __prisma: PrismaClient | undefined
}

// Create a new Prisma client with aggressive connection management for Supabase
const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DIRECT_URL || process.env.DATABASE_URL,
      },
    },
  })
}

// For development, always create a fresh client to avoid prepared statement conflicts
let db: PrismaClient

if (process.env.NODE_ENV === 'production') {
  // In production, use singleton pattern
  db = globalThis.__prisma ?? createPrismaClient()
  if (!globalThis.__prisma) {
    globalThis.__prisma = db
  }
} else {
  // In development, create fresh client each time to avoid prepared statement conflicts
  if (!globalThis.__prisma) {
    globalThis.__prisma = createPrismaClient()
  }
  db = globalThis.__prisma
}

export { db }

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
        try {
          await db.$disconnect()
          await new Promise(resolve => setTimeout(resolve, 500))
          await db.$connect()
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
    
    // Clear the global prisma instance to force recreation
    if (process.env.NODE_ENV !== 'production') {
      globalThis.__prisma = undefined
      globalThis.__prisma = createPrismaClient()
    }
    
    await db.$connect()
  } catch (error) {
    console.error('Failed to reset database connection:', error)
    throw error
  }
}

// Create a fresh database client for critical operations
export const getFreshDbClient = (): PrismaClient => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DIRECT_URL || process.env.DATABASE_URL,
      },
    },
  })
}
