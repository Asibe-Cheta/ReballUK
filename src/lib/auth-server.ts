import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db, getFreshDbClient } from "@/lib/db"
import { authConfig } from "@/lib/auth-config"
import { userProfileOperations } from "@/lib/db-utils"
import type { PlayerPosition } from "@/types/profile"
import CredentialsProvider from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { compare } from "bcryptjs"

// Extend the built-in session types
declare module "next-auth" {
  interface User {
    id: string
    name: string
    email: string
    image?: string
    position?: PlayerPosition
    trainingLevel?: string
    completedOnboarding?: boolean
    createdAt: Date
  }

  interface Session {
    user: {
      id: string
      name: string
      email: string
      image?: string
      position?: PlayerPosition
      trainingLevel?: string
      completedOnboarding?: boolean
    }
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  pages: {
    signIn: "/login-simple",
    signUp: "/register-simple",
    error: "/login-simple",
  },
  providers: [
    // Google OAuth
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code",
          },
        },
        allowDangerousEmailAccountLinking: true,
      })
    ] : []),
    // Credentials provider
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials")
          return null
        }

        // Use fresh database client to avoid prepared statement conflicts
        const freshDb = getFreshDbClient()
        
        try {
          console.log("Looking up user with email:", credentials.email)
          
          // Find user by email using fresh client with raw SQL
          const userResult = await freshDb.$queryRaw`
            SELECT id, name, email, password 
            FROM users 
            WHERE email = ${credentials.email} 
            LIMIT 1
          `
          
          const user = Array.isArray(userResult) && userResult.length > 0 ? userResult[0] : null

          if (!user || !user.password) {
            console.log("User not found or no password")
            await freshDb.$disconnect()
            return null
          }

          console.log("User found:", { id: user.id, name: user.name, hasPassword: !!user.password })

          // Verify password
          const isValidPassword = await compare(credentials.password, user.password)
          console.log("Password valid:", isValidPassword)
          
          if (!isValidPassword) {
            console.log("Invalid password")
            await freshDb.$disconnect()
            return null
          }

          console.log("Login successful for user:", user.email)
          
          // Clean up fresh client
          await freshDb.$disconnect()

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: null
          }
        } catch (error) {
          console.error("Credentials authorization error:", error)
          // Clean up fresh client on error
          try {
            await freshDb.$disconnect()
          } catch (disconnectError) {
            console.error("Failed to disconnect fresh client:", disconnectError)
          }
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, token }) {
      console.log("Session callback triggered:", { 
        hasToken: !!token, 
        hasSession: !!session,
        tokenSub: token?.sub,
        sessionUser: session?.user ? { name: session.user.name, email: session.user.email } : null
      })
      
      // With JWT strategy, we get user data from token
      if (token && session.user) {
        session.user.id = token.sub as string
        console.log("Set session user ID:", token.sub)
        
        try {
          // Get user profile to enhance session using fresh DB client
          const freshDb = getFreshDbClient()
          
          const userResult = await freshDb.$queryRaw`
            SELECT u.id, u.name, u.email, p.position, p."trainingLevel"
            FROM users u
            LEFT JOIN profiles p ON u.id = p."userId"
            WHERE u.id = ${token.sub}
            LIMIT 1
          `
          
          await freshDb.$disconnect()
          
          const userWithProfile = Array.isArray(userResult) && userResult.length > 0 ? userResult[0] : null
          
          console.log("User profile lookup result:", userWithProfile ? { 
            id: userWithProfile.id, 
            hasProfile: !!userWithProfile.position 
          } : null)
          
          if (userWithProfile) {
            session.user.position = userWithProfile.position
            session.user.trainingLevel = userWithProfile.trainingLevel
            session.user.completedOnboarding = false
            console.log("Enhanced session with profile data")
          }
        } catch (error) {
          console.error("Error getting user profile for session:", error)
          // Don't fail the session if profile lookup fails
        }
      }
      
      console.log("Final session:", session ? {
        user: session.user ? { id: session.user.id, name: session.user.name, email: session.user.email } : null
      } : null)
      
      return session
    },
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      const isOnAuth = nextUrl.pathname.startsWith('/login-simple') || nextUrl.pathname.startsWith('/register-simple')
      const isOnWelcome = nextUrl.pathname.startsWith('/welcome')
      
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      } else if (isOnAuth) {
        if (isLoggedIn) return Response.redirect(new URL('/dashboard', nextUrl))
        return true
      } else if (isOnWelcome) {
        // Welcome page requires authentication
        if (isLoggedIn) return true
        return false
      }
      return true
    },
    async signIn({ user, account, profile }) {
      console.log("SignIn callback triggered:", { 
        user: user ? { id: user.id, name: user.name, email: user.email } : null,
        account: account ? { provider: account.provider } : null,
        profile: profile ? { email: profile.email } : null
      })
      
      // Allow OAuth sign-ins
      if (account?.provider === "google") {
        console.log("Google OAuth sign-in allowed")
        return true
      }

      // For credentials
      if (account?.provider === "credentials") {
        console.log("Credentials sign-in allowed for user:", user.email)
        return true
      }

      // Default allow
      console.log("Default sign-in allowed")
      return true
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  events: {
    async createUser({ user }) {
      console.log("New user created:", user.email)
      
      // Create a basic profile for the new user
      try {
        await db.profile.create({
          data: {
            userId: user.id,
            // Profile will be completed during onboarding
            // completedOnboarding field was removed from schema
            isActive: true,
          }
        })
        console.log("Profile created for user:", user.email)
      } catch (error) {
        console.error("Error creating profile for user:", user.email, error)
        // Don't fail the user creation if profile creation fails
      }
    },
    async signIn({ user, account, profile, isNewUser }) {
      console.log("User signed in:", user.email, { isNewUser })
      
      // Track sign-in analytics
      if (account?.provider === "google") {
        console.log("Google OAuth sign-in successful")
      }
    },
    async signOut({ token }) {
      console.log("User signed out:", token?.email)
    },
  },
  debug: process.env.NODE_ENV === "development",
  trustHost: true,
})
