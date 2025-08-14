"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle, Mail, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

interface VerificationState {
  status: "loading" | "success" | "error" | "resend"
  message: string
  user?: {
    id: string
    name: string
    email: string
  }
}

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [state, setState] = useState<VerificationState>({
    status: "loading",
    message: "Verifying your email..."
  })
  const [resendEmail, setResendEmail] = useState("")
  const [isResending, setIsResending] = useState(false)

  useEffect(() => {
    if (token) {
      verifyEmail(token)
    } else {
      setState({
        status: "error",
        message: "No verification token provided"
      })
    }
  }, [token])

  const verifyEmail = async (verificationToken: string) => {
    try {
      const response = await fetch(`/api/auth/verify-email?token=${verificationToken}`)
      const data = await response.json()

      if (data.success) {
        setState({
          status: "success",
          message: data.message,
          user: data.user
        })
        toast.success("Email verified successfully!")
      } else {
        setState({
          status: "error",
          message: data.error || "Verification failed"
        })
        toast.error(data.error || "Verification failed")
      }
    } catch (error) {
      console.error("Verification error:", error)
      setState({
        status: "error",
        message: "Failed to verify email. Please try again."
      })
      toast.error("Failed to verify email")
    }
  }

  const handleResendEmail = async () => {
    if (!resendEmail) {
      toast.error("Please enter your email address")
      return
    }

    setIsResending(true)
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: resendEmail })
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Verification email sent successfully!")
        setState({
          status: "success",
          message: "Verification email sent! Please check your inbox and click the verification link."
        })
      } else {
        toast.error(data.error || "Failed to send verification email")
      }
    } catch (error) {
      console.error("Resend error:", error)
      toast.error("Failed to send verification email")
    } finally {
      setIsResending(false)
    }
  }

  const renderContent = () => {
    switch (state.status) {
      case "loading":
        return (
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-semibold mb-2">Verifying Your Email</h2>
            <p className="text-muted-foreground">{state.message}</p>
          </div>
        )

      case "success":
        return (
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-green-600">Email Verified Successfully!</h2>
            <p className="text-muted-foreground mb-6">{state.message}</p>
            
            {state.user && (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-6">
                <p className="text-sm text-green-700 dark:text-green-300">
                  Welcome, <strong>{state.user.name}</strong>! Your account is now ready.
                </p>
              </div>
            )}
            
            <Button onClick={() => router.push("/login-simple")} className="w-full">
              Continue to Login
            </Button>
          </div>
        )

      case "error":
        return (
          <div className="text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-red-600">Verification Failed</h2>
            <p className="text-muted-foreground mb-6">{state.message}</p>
            
            <Alert className="mb-6">
              <Mail className="h-4 w-4" />
              <AlertDescription>
                Don&apos;t see the verification email? Check your spam folder or request a new one.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <Button 
                variant="outline" 
                onClick={() => setState({ status: "resend", message: "Request new verification email" })}
                className="w-full"
              >
                Request New Verification Email
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => router.push("/login-simple")}
                className="w-full"
              >
                Back to Login
              </Button>
            </div>
          </div>
        )

      case "resend":
        return (
          <div className="text-center">
            <Mail className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Request Verification Email</h2>
            <p className="text-muted-foreground mb-6">
              Enter your email address and we&apos;ll send you a new verification link.
            </p>
            
            <div className="space-y-4">
              <div className="text-left">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <Button 
                onClick={handleResendEmail} 
                disabled={isResending}
                className="w-full"
              >
                {isResending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  "Send Verification Email"
                )}
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={() => router.push("/login-simple")}
                className="w-full"
              >
                Back to Login
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/login-simple")}
              className="absolute left-4 top-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <div className="mt-8">
              <h1 className="text-2xl font-bold">Email Verification</h1>
              <CardDescription>
                Verify your email address to access your REBALL account
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent>
            {renderContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
