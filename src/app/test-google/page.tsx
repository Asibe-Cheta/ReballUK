"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

export default function TestGooglePage() {
  const handleGoogleSignIn = () => {
    console.log("Starting Google OAuth...")
    signIn("google", { 
      callbackUrl: "/dashboard",
      redirect: true 
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-white">Google OAuth Test</h1>
        <Button onClick={handleGoogleSignIn} className="bg-blue-600 hover:bg-blue-700">
          Sign in with Google
        </Button>
        <p className="text-gray-400 text-sm">
          This will redirect to Google OAuth and then to the dashboard
        </p>
      </div>
    </div>
  )
}
