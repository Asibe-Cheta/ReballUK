"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import type { OnboardingData } from "@/lib/onboarding"

export function useOnboarding(): OnboardingData & {
  checkOnboardingStatus: () => Promise<void>
  clearOnboardingData: () => void
} {
  const { user } = useAuth()
  const isAuthenticated = !!user
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    needsOnboarding: false,
    isComplete: true,
    profile: null,
    isLoading: true,
    error: null,
  })

  const checkOnboardingStatus = async () => {
    if (!isAuthenticated || !user?.id) {
      setOnboardingData(prev => ({
        ...prev,
        isLoading: false,
        needsOnboarding: false,
        isComplete: true,
      }))
      return
    }

    try {
      setOnboardingData(prev => ({ ...prev, isLoading: true, error: null }))

      const response = await fetch("/api/profile/onboarding")
      const result = await response.json()

      if (result.success) {
        setOnboardingData({
          needsOnboarding: result.data.needsOnboarding,
          isComplete: result.data.isOnboardingComplete && result.data.requiredFieldsComplete,
          profile: result.data.profile,
          isLoading: false,
          error: null,
        })
      } else {
        throw new Error(result.error || "Failed to check onboarding status")
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error)
      setOnboardingData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown error",
        // On error, assume onboarding is needed to be safe
        needsOnboarding: true,
        isComplete: false,
      }))
    }
  }

  const clearOnboardingData = () => {
    setOnboardingData({
      needsOnboarding: false,
      isComplete: true,
      profile: null,
      isLoading: false,
      error: null,
    })
  }

  // Check onboarding status when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      checkOnboardingStatus()
    } else {
      clearOnboardingData()
    }
  }, [isAuthenticated, user?.id])

  return {
    ...onboardingData,
    checkOnboardingStatus,
    clearOnboardingData,
  }
}

// Hook for checking if current user needs onboarding
export function useOnboardingGuard() {
  const { needsOnboarding, isLoading } = useOnboarding()
  
  return {
    needsOnboarding,
    isLoading,
    shouldRedirectToOnboarding: needsOnboarding && !isLoading,
  }
}
