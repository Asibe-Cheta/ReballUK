import { hash, compare } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"
import { NextRequest } from "next/server"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-key")

export interface User {
  id: string
  name: string
  email: string
  image?: string
  role: string
  position?: string
  trainingLevel?: string
  completedOnboarding?: boolean
  emailVerified: boolean
  createdAt: Date
}

export interface Session {
  user: User
  expires: string
}

// Create JWT token
export async function createToken(payload: any): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET)
}

// Verify JWT token
export async function verifyToken(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
  } catch (error) {
    return null
  }
}

// Get user from token
export async function getUserFromToken(token: string): Promise<User | null> {
  const payload = await verifyToken(token)
  if (!payload?.userId) return null

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      emailVerified: true,
      createdAt: true,
      profile: {
        select: {
          position: true,
          trainingLevel: true,
          completedOnboarding: true,
        }
      }
    }
  })

  if (!user) return null

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
    position: user.profile?.position,
    trainingLevel: user.profile?.trainingLevel,
    completedOnboarding: user.profile?.completedOnboarding,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
  }
}

// Get current user from cookies
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value
  
  if (!token) return null
  
  return await getUserFromToken(token)
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 12)
}

// Compare password
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return await compare(password, hashedPassword)
}

// Create verification token
export async function createVerificationToken(userId: string): Promise<string> {
  // Create a JWT token with 24-hour expiration for email verification
  const token = await new SignJWT({ userId, type: "email-verification" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h") // 24 hours instead of 7 days
    .sign(JWT_SECRET)
  
  // Store verification token in database
  await prisma.verificationToken.create({
    data: {
      identifier: userId,
      token: token,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    }
  })
  
  return token
}

// Verify email token
export async function verifyEmailToken(token: string): Promise<boolean> {
  console.log("Verifying email token...")
  
  const payload = await verifyToken(token)
  console.log("JWT payload:", payload)
  
  if (!payload?.userId || payload?.type !== "email-verification") {
    console.log("Invalid payload or type:", { userId: payload?.userId, type: payload?.type })
    return false
  }

  // Check if token exists in database
  const verificationToken = await prisma.verificationToken.findFirst({
    where: {
      token: token,
      expires: { gt: new Date() }
    }
  })

  console.log("Database verification token:", verificationToken ? "Found" : "Not found")
  if (verificationToken) {
    console.log("Token expires at:", verificationToken.expires)
    console.log("Current time:", new Date())
  }

  if (!verificationToken) {
    console.log("Token not found in database or expired")
    return false
  }

  // Mark user as verified
  await prisma.user.update({
    where: { id: payload.userId },
    data: { emailVerified: true }
  })

  // Delete the verification token
  await prisma.verificationToken.delete({
    where: { token: verificationToken.token }
  })

  console.log("Email verification successful")
  return true
}

// Set auth cookie
export async function setAuthCookie(userId: string): Promise<string> {
  const token = await createToken({ userId })
  
  const cookieStore = await cookies()
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/"
  })
  
  return token
}

// Clear auth cookie
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete("auth-token")
}

// Get token from request
export async function getTokenFromRequest(request: NextRequest): Promise<string | null> {
  const token = request.cookies.get("auth-token")?.value
  return token || null
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate password strength
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long")
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter")
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter")
  }
  
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number")
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}
