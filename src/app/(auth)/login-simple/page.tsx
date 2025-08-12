"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import Link from "next/link"
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
      console.log("Attempting login with:", formData.email)
      
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        callbackUrl: "/dashboard",
        redirect: false
      })

      console.log("Sign in result:", result)

      if (result?.error) {
        toast.error("Login failed", {
          description: "Invalid email or password"
        })
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
    console.log("Starting Google OAuth...")
    signIn("google", { 
      callbackUrl: "/dashboard",
      redirect: true 
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <Card className="w-full max-w-md glass-strong">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
          <CardDescription className="text-gray-300">
            Sign in to your REBALL account
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                placeholder="your.email@example.com"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                placeholder="••••••••"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black hover:bg-gray-100 disabled:opacity-50"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>

            {/* Google OAuth */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-900 px-2 text-gray-400">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10"
              onClick={handleGoogleSignIn}
            >
              Continue with Google
            </Button>

            {/* Register Link */}
            <div className="text-center text-sm text-gray-400">
              Don&apos;t have an account?{" "}
              <Link href="/register-simple" className="text-blue-400 hover:underline">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
