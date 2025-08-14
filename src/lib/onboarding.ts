import { db } from "@/lib/db"

// Onboarding utilities for server and client side
export const onboardingUtils = {
  // Check if user needs onboarding
  async checkOnboardingStatus(userId: string): Promise<{
    needsOnboarding: boolean
    isComplete: boolean
    profile: Record<string, unknown> | null
  }> {
    try {
      const profile = await db.profile.findUnique({
        where: { userId },
        select: {
          id: true,
          completedOnboarding: true,
          firstName: true,
          lastName: true,
          position: true,
          trainingLevel: true,
          confidenceRating: true,
        }
      })

      if (!profile) {
        return {
          needsOnboarding: true,
          isComplete: false,
          profile: null,
        }
      }

      const isComplete = !!(
        profile.completedOnboarding &&
        profile.firstName &&
        profile.lastName &&
        profile.position &&
        profile.trainingLevel
      )

      return {
        needsOnboarding: !isComplete,
        isComplete,
        profile,
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error)
      return {
        needsOnboarding: true,
        isComplete: false,
        profile: null,
      }
    }
  },

  // Get onboarding redirect URL
  getOnboardingRedirectUrl(requestUrl: string): string {
    const url = new URL("/welcome", requestUrl)
    return url.toString()
  },

  // Check if current path should skip onboarding check
  shouldSkipOnboardingCheck(pathname: string): boolean {
    const skipPaths = [
      "/welcome",
      "/login",
      "/register", 
      "/api",
      "/_next",
      "/favicon.ico",
      "/logout",
      "/about",
      "/contact",
      "/",
    ]

    return skipPaths.some(path => pathname.startsWith(path))
  },

  // Protected routes that require completed onboarding
  isProtectedRoute(pathname: string): boolean {
    const protectedPaths = [
      "/dashboard",
      "/profile",
      "/training",
      "/courses",
      "/progress",
      "/settings",
      "/booking",
    ]

    return protectedPaths.some(path => pathname.startsWith(path))
  },
}

// Client-side onboarding hook data
export interface OnboardingData {
  needsOnboarding: boolean
  isComplete: boolean
  profile: Record<string, unknown> | null
  isLoading: boolean
  error: string | null
}

// Default onboarding data
export const defaultOnboardingData: OnboardingData = {
  needsOnboarding: false,
  isComplete: true,
  profile: null,
  isLoading: true,
  error: null,
}
