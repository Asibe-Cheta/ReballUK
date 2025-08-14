"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function useAuth() {
  const { data: session, status, update } = useSession()
  const router = useRouter()

  const user = session?.user
  const isLoading = status === "loading"
  const isAuthenticated = status === "authenticated"

  const login = async (provider?: string, callbackUrl?: string, credentials?: { email: string; password: string }) => {
    try {
      let result
      
      if (provider === "credentials" && credentials) {
        // Sign in with email/password
        result = await signIn("credentials", {
          email: credentials.email,
          password: credentials.password,
          callbackUrl: callbackUrl || "/dashboard",
          redirect: false 
        })
      } else {
        // Sign in with OAuth provider
        result = await signIn(provider, { 
          callbackUrl: callbackUrl || "/dashboard",
          redirect: false 
        })
      }
      
      if (result?.error) {
        let errorMessage = "Please check your credentials and try again."
        
        if (result.error === "CredentialsSignin") {
          errorMessage = "Invalid email or password. Please try again."
        } else if (result.error === "OAuthAccountNotLinked") {
          errorMessage = "An account with this email already exists. Please sign in with your original method."
        }
        
        toast.error("Authentication failed", {
          description: errorMessage,
        })
        return { success: false, error: result.error }
      }

      if (result?.url) {
        toast.success("Welcome to REBALL!", {
          description: "You have been successfully signed in.",
        })
        router.push(result.url)
        return { success: true }
      }

      return { success: false, error: "Unknown error occurred" }
    } catch (error) {
      console.error("Sign in error:", error)
      toast.error("Authentication failed", {
        description: "An unexpected error occurred. Please try again.",
      })
      return { success: false, error: "Sign in failed" }
    }
  }

  const logout = async () => {
    try {
      await signOut({ 
        callbackUrl: "/",
        redirect: false 
      })
      
      toast.success("Signed out successfully", {
        description: "You have been logged out of your REBALL account.",
      })
      
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Sign out error:", error)
      toast.error("Sign out failed", {
        description: "An error occurred while signing out.",
      })
    }
  }

  const updateSession = async (data: any) => {
    try {
      await update(data)
      return { success: true }
    } catch (error) {
      console.error("Session update error:", error)
      return { success: false, error: "Failed to update session" }
    }
  }

  const redirectToLogin = (callbackUrl?: string) => {
    const url = callbackUrl 
      ? `/login-simple?callbackUrl=${encodeURIComponent(callbackUrl)}`
      : "/login-simple"
    router.push(url)
  }

  const redirectToDashboard = () => {
    router.push("/dashboard")
  }

  return {
    // Session data
    user,
    session,
    isLoading,
    isAuthenticated,
    
    // Auth actions
    login,
    logout,
    updateSession,
    
    // Navigation helpers
    redirectToLogin,
    redirectToDashboard,
  }
}
