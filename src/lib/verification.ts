import { randomBytes, createHash } from 'crypto'
import { db } from '@/lib/db'

export interface VerificationToken {
  token: string
  expires: Date
}

/**
 * Generate a secure verification token
 */
export function generateVerificationToken(): VerificationToken {
  const token = randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
  
  return { token, expires }
}

/**
 * Hash a verification token for secure storage
 */
export function hashVerificationToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

/**
 * Verify a token against its hash
 */
export function verifyTokenHash(token: string, hash: string): boolean {
  const tokenHash = hashVerificationToken(token)
  return tokenHash === hash
}

/**
 * Store verification token for a user
 */
export async function storeVerificationToken(userId: string, token: string, expires: Date): Promise<boolean> {
  try {
    const tokenHash = hashVerificationToken(token)
    
    // Store verification token in the VerificationToken model
    await db.verificationToken.upsert({
      where: { 
        identifier_token: {
          identifier: userId,
          token: tokenHash
        }
      },
      update: {
        expires
      },
      create: {
        identifier: userId,
        token: tokenHash,
        expires
      }
    })
    
    return true
  } catch (error) {
    console.error('Failed to store verification token:', error)
    return false
  }
}

/**
 * Get and validate verification token for a user
 */
export async function getVerificationToken(userId: string): Promise<{ token: string; expires: Date } | null> {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: { identifier: userId }
    })
    
    if (!verificationToken) {
      return null
    }
    
    // Check if token has expired
    if (new Date() > verificationToken.expires) {
      return null
    }
    
    return {
      token: verificationToken.token,
      expires: verificationToken.expires
    }
  } catch (error) {
    console.error('Failed to get verification token:', error)
    return null
  }
}

/**
 * Clear verification token for a user
 */
export async function clearVerificationToken(userId: string): Promise<boolean> {
  try {
    await db.verificationToken.deleteMany({
      where: { identifier: userId }
    })
    
    return true
  } catch (error) {
    console.error('Failed to clear verification token:', error)
    return false
  }
}

/**
 * Mark user email as verified
 */
export async function markEmailAsVerified(userId: string): Promise<boolean> {
  try {
    await db.user.update({
      where: { id: userId },
      data: {
        emailVerified: true
      }
    })
    
    // Clear verification tokens
    await db.verificationToken.deleteMany({
      where: { identifier: userId }
    })
    
    return true
  } catch (error) {
    console.error('Failed to mark email as verified:', error)
    return false
  }
}

/**
 * Check if user email is verified
 */
export async function isEmailVerified(userId: string): Promise<boolean> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { emailVerified: true }
    })
    
    return !!user?.emailVerified
  } catch (error) {
    console.error('Failed to check email verification status:', error)
    return false
  }
}

/**
 * Generate verification URL
 */
export function generateVerificationUrl(token: string, baseUrl?: string): string {
  const url = baseUrl || process.env.NEXTAUTH_URL || 'http://localhost:3000'
  return `${url}/verify-email?token=${token}`
}
