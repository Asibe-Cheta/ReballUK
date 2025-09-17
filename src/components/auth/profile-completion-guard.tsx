"use client"

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Lock, 
  ArrowRight, 
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'

interface ProfileCompletionGuardProps {
  children: React.ReactNode
  fallbackMessage?: string
  showAsModal?: boolean
}

export default function ProfileCompletionGuard({ 
  children, 
  fallbackMessage = "Please complete your profile to access this feature",
  showAsModal = false
}: ProfileCompletionGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [profileStatus, setProfileStatus] = useState<{
    isCompleted: boolean
    isLoading: boolean
  }>({
    isCompleted: false,
    isLoading: true
  })

  useEffect(() => {
    const checkProfileStatus = async () => {
      if (!user) return

      try {
        const token = localStorage.getItem('supabase_access_token')
        if (!token) return

        const response = await fetch('/api/profile/status', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setProfileStatus({
            isCompleted: data.isCompleted,
            isLoading: false
          })
        } else {
          setProfileStatus({
            isCompleted: false,
            isLoading: false
          })
        }
      } catch (error) {
        console.error('Error checking profile status:', error)
        setProfileStatus({
          isCompleted: false,
          isLoading: false
        })
      }
    }

    checkProfileStatus()
  }, [user])

  // Show loading state
  if (loading || profileStatus.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // If user is not logged in, redirect to login
  if (!user) {
    router.push('/login')
    return null
  }

  // If profile is completed, show the protected content
  if (profileStatus.isCompleted) {
    return <>{children}</>
  }

  // If profile is not completed, show the completion prompt
  if (showAsModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 max-w-md w-full">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <CardTitle className="text-xl text-gray-900 dark:text-white">
              Profile Incomplete
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {fallbackMessage}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Complete your profile to access:
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 mt-2 space-y-1">
                <li>• Training session bookings</li>
                <li>• Training materials</li>
                <li>• Progress tracking</li>
                <li>• Exclusive content</li>
              </ul>
            </div>
            <div className="flex space-x-3">
              <Button asChild className="flex-1 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200">
                <Link href="/profile/complete">
                  Complete Profile
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.back()}
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Full page view
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <CardTitle className="text-3xl text-gray-900 dark:text-white mb-2">
                Profile Required
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
                {fallbackMessage}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Complete your profile to unlock:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Training Sessions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Training Materials</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Progress Tracking</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Exclusive Content</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Button asChild size="lg" className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200">
                  <Link href="/profile/complete">
                    <User className="w-5 h-5 mr-2" />
                    Complete Your Profile
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  It only takes a few minutes to complete your profile
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
