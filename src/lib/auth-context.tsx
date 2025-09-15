"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

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

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  verifyEmail: (token: string) => Promise<{ success: boolean; error?: string }>
  googleSignIn: () => Promise<{ success: boolean; error?: string }>
}

interface RegisterData {
  name: string
  email: string
  password: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check if user is logged in on mount and handle OAuth callbacks
  useEffect(() => {
    // Handle OAuth callback with access token in URL hash
    const handleOAuthCallback = () => {
      const hash = window.location.hash
      if (hash.includes('access_token=')) {
        // Extract token from hash
        const tokenMatch = hash.match(/access_token=([^&]+)/)
        if (tokenMatch) {
          const token = tokenMatch[1]
          // Store token and redirect to clean URL
          localStorage.setItem('supabase_access_token', token)
          window.location.hash = ''
          window.location.pathname = '/'
        }
      }
    }

    handleOAuthCallback()
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      // Check for Supabase token first
      const supabaseToken = localStorage.getItem('supabase_access_token')
      if (supabaseToken) {
        // Verify token with Supabase and get user info
        const response = await fetch("/api/auth/verify-supabase-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: supabaseToken }),
        })
        
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
          return
        } else {
          // Token is invalid, remove it
          localStorage.removeItem('supabase_access_token')
        }
      }

      // Fallback to regular auth check
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else if (response.status === 401) {
        // User is not authenticated, which is normal
        setUser(null)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        // Store the access token if provided
        if (data.access_token) {
          localStorage.setItem('supabase_access_token', data.access_token)
        }
        return { success: true }
      } else {
        return { success: false, error: data.error || "Login failed" }
      }
    } catch (error) {
      return { success: false, error: "Network error" }
    }
  }

  const register = async (data: RegisterData) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        return { success: true }
      } else {
        return { success: false, error: result.error || "Registration failed" }
      }
    } catch (error) {
      return { success: false, error: "Network error" }
    }
  }

  const logout = async () => {
    try {
      // Clear Supabase token
      localStorage.removeItem('supabase_access_token')
      
      // Call logout API if it exists
      try {
        await fetch("/api/auth/logout", { method: "POST" })
      } catch (apiError) {
        // API logout might not exist, that's okay
        console.log("API logout not available, continuing with local logout")
      }
      
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (response.ok) {
        return { success: true }
      } else {
        return { success: false, error: data.error || "Verification failed" }
      }
    } catch (error) {
      return { success: false, error: "Network error" }
    }
  }

  const googleSignIn = async () => {
    try {
      // Redirect to Supabase Google OAuth
      window.location.href = "/api/auth/google"
      return { success: true }
    } catch (error) {
      return { success: false, error: "Google sign-in failed" }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        verifyEmail,
        googleSignIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
