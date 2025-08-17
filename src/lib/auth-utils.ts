// Temporary auth utility to replace NextAuth
// This will be replaced with proper custom authentication

export interface User {
  id: string
  name: string
  email: string
  image?: string
  role?: string
  position?: string
  trainingLevel?: string
  completedOnboarding?: boolean
  createdAt: Date
}

export interface Session {
  user: User
  expires: string
}

// Temporary mock session for development
export async function getAuthSession(): Promise<Session | null> {
  // TODO: Replace with actual authentication logic
  return {
    user: {
      id: "temp-user-id",
      name: "Player",
      email: "player@reball.uk",
      role: "USER",
      position: "GENERAL",
      trainingLevel: "BEGINNER",
      completedOnboarding: false,
      createdAt: new Date(),
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
  }
}

// Temporary auth function to replace NextAuth auth()
export async function auth(): Promise<Session | null> {
  return getAuthSession()
}

// Helper function to get user ID from session
export async function getUserId(): Promise<string | null> {
  const session = await auth()
  return session?.user?.id || null
}

// Helper function to check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const session = await auth()
  return !!session?.user?.id
}
