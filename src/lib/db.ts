import { PrismaClient } from "@prisma/client"
import { env } from "@/lib/env-validation"

declare global {
  // eslint-disable-next-line no-var
  var __db__: PrismaClient | undefined
}

// Database connection configuration
const createPrismaClient = () => {
  return new PrismaClient({
    log: env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    errorFormat: "pretty",
    datasources: {
      db: {
        url: env.DATABASE_URL,
      },
    },
    // Serverless configuration to prevent connection issues
    __internal: {
      engine: {
        // Disable query engine auto-restart
        enableEngineDebugMode: false,
      },
    },
    // Connection pool settings for serverless
    connection: {
      pool: {
        min: 0,
        max: 1,
      },
    },
  })
}

// Singleton instance for connection pooling
export const db = globalThis.__db__ ?? createPrismaClient()

if (env.NODE_ENV !== "production") {
  globalThis.__db__ = db
}

// Ensure proper connection handling for serverless
export async function ensureConnection() {
  try {
    // Force a disconnect and reconnect to clear any prepared statements
    await db.$disconnect()
    
    // Wait a moment to ensure clean disconnection
    await new Promise(resolve => setTimeout(resolve, 100))
    
    await db.$connect()
    
    // Test the connection with a simple query
    await db.$queryRaw`SELECT 1`
    
    console.log("✅ Database connection reset successfully")
    return true
  } catch (error) {
    console.error("❌ Connection reset failed:", error)
    
    // Try to create a new client instance if connection fails
    try {
      if (globalThis.__db__) {
        await globalThis.__db__.$disconnect()
      }
      globalThis.__db__ = createPrismaClient()
      await globalThis.__db__.$connect()
      console.log("✅ New database client created successfully")
      return true
    } catch (retryError) {
      console.error("❌ Failed to create new database client:", retryError)
      return false
    }
  }
}

// Database connection validation
export async function validateDatabaseConnection(): Promise<{
  isConnected: boolean
  error?: string
  latency?: number
}> {
  try {
    const start = Date.now()
    await db.$queryRaw`SELECT 1`
    const latency = Date.now() - start
    
    console.log(`✅ Database connected successfully (${latency}ms)`)
    return {
      isConnected: true,
      latency,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown database error"
    console.error("❌ Database connection failed:", errorMessage)
    return {
      isConnected: false,
      error: errorMessage,
    }
  }
}

// Retry logic for database operations
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown error")
      
      if (attempt === maxRetries) {
        console.error(`❌ Operation failed after ${maxRetries} attempts:`, lastError.message)
        throw lastError
      }
      
      const delay = baseDelay * Math.pow(2, attempt - 1) // Exponential backoff
      console.warn(`⚠️ Attempt ${attempt} failed, retrying in ${delay}ms...`, lastError.message)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw lastError!
}

// Database health check
export async function healthCheck(): Promise<{
  database: boolean
  timestamp: string
  version?: string
  uptime?: string
}> {
  try {
    const start = Date.now()
    
    // Check basic connectivity
    await db.$queryRaw`SELECT 1`
    
    // Get database version
    const versionResult = await db.$queryRaw<{ version: string }[]>`SELECT version()`
    const version = versionResult[0]?.version
    
    // Calculate response time
    const responseTime = Date.now() - start
    
    return {
      database: true,
      timestamp: new Date().toISOString(),
      version: version || "Unknown",
      uptime: `${responseTime}ms`,
    }
  } catch (error) {
    console.error("Database health check failed:", error)
    return {
      database: false,
      timestamp: new Date().toISOString(),
    }
  }
}

// Graceful shutdown
export async function disconnectDatabase(): Promise<void> {
  try {
    await db.$disconnect()
    console.log("✅ Database disconnected successfully")
  } catch (error) {
    console.error("❌ Error disconnecting from database:", error)
  }
}

// Database utility functions for common operations
export const dbUtils = {
  // Check if a record exists
  async exists<T>(
    model: any,
    where: any
  ): Promise<boolean> {
    const count = await model.count({ where })
    return count > 0
  },

  // Get paginated results
  async paginate<T>(
    model: any,
    {
      page = 1,
      limit = 10,
      where = {},
      orderBy = {},
      include = {},
    }: {
      page?: number
      limit?: number
      where?: any
      orderBy?: any
      include?: any
    }
  ): Promise<{
    data: T[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
      hasNext: boolean
      hasPrev: boolean
    }
  }> {
    const skip = (page - 1) * limit
    
    const [data, total] = await Promise.all([
      model.findMany({
        where,
        orderBy,
        include,
        skip,
        take: limit,
      }),
      model.count({ where }),
    ])

    const totalPages = Math.ceil(total / limit)

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    }
  },

  // Upsert with better error handling
  async safeUpsert<T>(
    model: any,
    {
      where,
      update,
      create,
    }: {
      where: any
      update: any
      create: any
    }
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
      const data = await model.upsert({
        where,
        update,
        create,
      })
      return { success: true, data }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      console.error("Upsert operation failed:", errorMessage)
      return { success: false, error: errorMessage }
    }
  },

  // Soft delete (mark as inactive instead of deleting)
  async softDelete(
    model: any,
    where: any
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await model.update({
        where,
        data: { isActive: false },
      })
      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      console.error("Soft delete failed:", errorMessage)
      return { success: false, error: errorMessage }
    }
  },
}

// Export the client as default for compatibility
export default db
