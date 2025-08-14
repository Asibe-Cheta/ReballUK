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
      return null
    }

        // Use fresh database client to avoid prepared statement conflicts
        const freshDb = getFreshDbClient()
        
        try {
          // Find user by email using fresh client with raw SQL
          const userResult = await freshDb.$queryRaw`
            SELECT id, name, email, password, "emailVerified"
            FROM users 
            WHERE email = ${credentials.email} 
            LIMIT 1
          `
          
          const user = Array.isArray(userResult) && userResult.length > 0 ? userResult[0] : null

          if (!user || !user.password) {
            await freshDb.$disconnect()
            return null
          }

          // Verify password
          const isValidPassword = await compare(credentials.password, user.password)
          
          if (!isValidPassword) {
            await freshDb.$disconnect()
            return null
          }
          
          // Check if email is verified
          if (!user.emailVerified) {
            await freshDb.$disconnect()
            throw new Error("EmailNotVerified")
          }
          
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
      // With JWT strategy, we get user data from token
      if (token && session.user) {
        session.user.id = token.sub as string
        
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
          }
        } catch (error) {
          // Don't fail the session if profile lookup fails
        }
      }
      
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
      // Allow OAuth sign-ins
      if (account?.provider === "google") {
        return true
      }

      // For credentials
      if (account?.provider === "credentials") {
        return true
      }

      // Default allow
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
      } catch (error) {
        // Don't fail the user creation if profile creation fails
      }
    },
    async signIn({ user, account, profile, isNewUser }) {
      // Track sign-in analytics if needed
    },
    async signOut({ token }) {
      // Handle sign out if needed
    },
  },
  debug: process.env.NODE_ENV === "development",
  trustHost: true,
})
