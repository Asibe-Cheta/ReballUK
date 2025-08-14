"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import Link from "next/link"
import Image from "next/image"
import { signIn } from "next-auth/react"

export default function SimpleLoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        callbackUrl: "/dashboard",
        redirect: false
      })

      if (result?.error) {
        if (result.error === "EmailNotVerified") {
          toast.error("Email not verified", {
            description: "Please check your email and click the verification link before signing in"
          })
        } else {
          toast.error("Login failed", {
            description: "Invalid email or password"
          })
        }
      } else if (result?.url) {
        toast.success("Login successful!")
        window.location.href = result.url
      } else {
        toast.error("Login failed", {
          description: "An unexpected error occurred"
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Login failed", {
        description: "An error occurred during login"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    signIn("google", { 
      callbackUrl: "/dashboard",
      redirect: true 
    })
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Branding */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-8 h-8 bg-black rounded-sm mr-3 flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <span className="text-xl font-semibold text-gray-900">REBALL</span>
            </div>
            <div className="w-6 h-6 bg-black rounded-sm mx-auto mb-4 flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm"></div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
            <p className="text-gray-600">Enter your credentials to access your account.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                placeholder="Email"
                className="h-11"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
                placeholder="Password"
                className="h-11"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-black hover:bg-gray-800 text-white"
            >
              {isLoading ? "Signing In..." : "Sign in"}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Google OAuth */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 border-gray-300 hover:bg-gray-50"
              onClick={handleGoogleSignIn}
            >
              Continue with Google
            </Button>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link href="/register-simple" className="text-blue-600 hover:underline underline-offset-4">
                  Sign up
                </Link>
              </p>
            </div>
            
            {/* Verification Help */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Need to verify your email?{" "}
                <Link href="/verify-email" className="text-blue-600 hover:underline underline-offset-4">
                  Request verification email
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="hidden lg:flex flex-1 bg-gray-100 items-center justify-center">
        <div className="relative w-full h-full">
          <Image
            src="/images/register/login-img.jpg"
            alt="REBALL Training"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  )
}
