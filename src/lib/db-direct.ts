import { Client } from 'pg'

let client: Client | null = null

export async function getDbClient(): Promise<Client> {
  try {
    if (!client) {
      console.log('Creating new database connection...')
      client = new Client({
        connectionString: process.env.DATABASE_URL,
        connectionTimeoutMillis: 5000, // 5 seconds
        idleTimeoutMillis: 10000, // 10 seconds
      })
      await client.connect()
      console.log('Database connected successfully')
    }
    
    // Test the connection
    await client.query('SELECT 1')
    return client
    
  } catch (error) {
    console.log('Database connection failed, creating new connection...')
    
    // Close existing connection if it exists
    if (client) {
      try {
        await client.end()
      } catch (e) {
        // Ignore errors when closing
      }
      client = null
    }
    
    // Create new connection
    client = new Client({
      connectionString: process.env.DATABASE_URL,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 10000,
    })
    
    await client.connect()
    console.log('Database reconnected successfully')
    return client
  }
}

export async function closeDbClient(): Promise<void> {
  if (client) {
    await client.end()
    client = null
  }
}
