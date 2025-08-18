"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

function VerifyEmailForm() {
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const router = useRouter()
  const searchParams = useSearchParams()
  const { verifyEmail } = useAuth()

  useEffect(() => {
    const token = searchParams.get('token')
    
    if (token) {
      verifyEmailToken(token)
    } else {
      setVerificationStatus('error')
      setErrorMessage('No verification token found')
    }
  }, [searchParams])

  const verifyEmailToken = async (token: string) => {
    setIsVerifying(true)
    try {
      const result = await verifyEmail(token)
      
      if (result.success) {
        setVerificationStatus('success')
        toast.success("Email verified successfully!", {
          description: "You can now sign in to your account.",
        })
      } else {
        setVerificationStatus('error')
        setErrorMessage(result.error || 'Verification failed')
        toast.error("Verification failed", {
          description: result.error,
        })
      }
    } catch (error) {
      setVerificationStatus('error')
      setErrorMessage('An unexpected error occurred')
      toast.error("Verification failed", {
        description: "An unexpected error occurred.",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const renderContent = () => {
    if (isVerifying) {
      return (
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
          <h2 className="text-xl font-semibold text-gray-900">Verifying your email...</h2>
          <p className="text-gray-600">Please wait while we verify your email address.</p>
        </div>
      )
    }

    if (verificationStatus === 'success') {
      return (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Email Verified!</h2>
          <p className="text-gray-600">
            Your email has been successfully verified. You can now sign in to your REBALL account.
          </p>
          <Button
            onClick={() => router.push('/login')}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            Sign In Now
          </Button>
        </div>
      )
    }

    if (verificationStatus === 'error') {
      return (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Verification Failed</h2>
          <p className="text-gray-600">
            {errorMessage || 'We couldn\'t verify your email address. The link may be expired or invalid.'}
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => router.push('/login')}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Go to Sign In
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/register')}
              className="w-full"
            >
              Create New Account
            </Button>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Email Verification</CardTitle>
            <CardDescription className="text-gray-600">
              Verifying your email address
            </CardDescription>
          </CardHeader>

          <CardContent>
            {renderContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailForm />
    </Suspense>
  )
}
