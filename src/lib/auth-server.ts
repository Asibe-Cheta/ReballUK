import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import { authConfig } from "@/lib/auth-config"
import { userProfileOperations } from "@/lib/db-utils"
import type { PlayerPosition } from "@/types/profile"

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
  ...authConfig,
  adapter: PrismaAdapter(db),
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    ...authConfig.callbacks,
    async session({ session, user }) {
      // With database strategy, we get user from database
      if (user && session.user) {
        session.user.id = user.id
        
        // Get user profile to enhance session
        const userWithProfile = await userProfileOperations.getUserProfile(user.id)
        if (userWithProfile?.profile) {
          session.user.position = userWithProfile.profile.position
          session.user.trainingLevel = userWithProfile.profile.trainingLevel
          session.user.completedOnboarding = userWithProfile.profile.completedOnboarding
        }
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // Allow OAuth sign-ins
      if (account?.provider === "google") {
        return true
      }

      // For credentials (if we add email/password later)
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
            completedOnboarding: false,
          }
        })
        console.log("Profile created for user:", user.email)
      } catch (error) {
        console.error("Error creating profile for user:", user.email, error)
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
