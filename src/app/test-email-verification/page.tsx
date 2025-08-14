"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, CheckCircle, XCircle } from "lucide-react"

export default function TestEmailVerificationPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")

  const handleTestVerification = async () => {
    if (!email) {
      setError("Please enter an email address")
      return
    }

    setIsLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch("/api/debug/test-email-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (data.success) {
        setResult(data)
      } else {
        setError(data.error || "Failed to test email verification")
      }
    } catch (error) {
      console.error("Test error:", error)
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Verification System Test
            </CardTitle>
            <CardDescription>
              Test the email verification system by sending a verification email to an existing user.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email to test"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <Button 
              onClick={handleTestVerification} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Testing...
                </>
              ) : (
                "Test Email Verification"
              )}
            </Button>

            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {result && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p><strong>Success:</strong> {result.message}</p>
                    <p><strong>User:</strong> {result.user.name} ({result.user.email})</p>
                    <p><strong>Email Verified:</strong> {result.user.emailVerified ? "Yes" : "No"}</p>
                    {result.verificationUrl && (
                      <div>
                        <p><strong>Verification URL:</strong></p>
                        <p className="text-xs break-all bg-gray-100 p-2 rounded">
                          {result.verificationUrl}
                        </p>
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-semibold mb-2">How to Test:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Enter an existing user's email address</li>
                <li>Click "Test Email Verification"</li>
                <li>Check the user's email for the verification link</li>
                <li>Click the verification link to verify the email</li>
                <li>Try logging in with the verified account</li>
              </ol>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <h3 className="font-semibold mb-2">Note:</h3>
              <p className="text-sm">
                This test will send a real verification email. Make sure you have access to the email address you're testing with.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
