"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

const PLAYER_POSITIONS = [
  { value: "STRIKER", label: "Striker" },
  { value: "WINGER", label: "Winger" },
  { value: "CAM", label: "CAM (Central Attacking Midfielder)" },
  { value: "FULLBACK", label: "Fullback" },
  { value: "GOALKEEPER", label: "Goalkeeper" },
  { value: "DEFENDER", label: "Defender" },
  { value: "MIDFIELDER", label: "Midfielder" },
  { value: "OTHER", label: "Other" },
]

export default function RegisterSimplePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    position: "",
  })
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [agreeToPrivacy, setAgreeToPrivacy] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.position) {
      setError("All fields are required")
      return false
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return false
    }
    
    if (!agreeToTerms || !agreeToPrivacy) {
      setError("Please agree to Terms and Privacy Policy")
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    setError("")
    setSuccess("")
    
    const requestData = {
      ...formData,
      agreeToTerms,
      agreeToPrivacy,
    }
    
    try {
      const response = await fetch("/api/auth/register-simple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        if (data.requiresVerification) {
          setSuccess("Account created successfully! Please check your email to verify your account before signing in.")
          // Reset form
          setFormData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            position: "",
          })
          setAgreeToTerms(false)
          setAgreeToPrivacy(false)
          
          // Redirect to login after 5 seconds to give user time to read the message
          setTimeout(() => {
            router.push("/login-simple")
          }, 5000)
        } else {
          setSuccess("Account created successfully! Redirecting to login...")
          // Reset form
          setFormData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            position: "",
          })
          setAgreeToTerms(false)
          setAgreeToPrivacy(false)
          
          // Redirect to login after 2 seconds
          setTimeout(() => {
            router.push("/login-simple")
          }, 2000)
        }
      } else {
        console.error("Registration failed:", data)
        setError(data.error || "Registration failed. Please try again.")
      }
    } catch (error) {
      console.error("Registration network error:", error)
      setError("Network error. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Join REBALL
          </CardTitle>
          <CardDescription>
            Start your football training journey today
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            
            {/* Success Message */}
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}
            
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                disabled={isLoading}
                required
              />
            </div>
            
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                disabled={isLoading}
                required
              />
            </div>
            
            {/* Position */}
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <select
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                disabled={isLoading}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select your position</option>
                {PLAYER_POSITIONS.map((position) => (
                  <option key={position.value} value={position.value}>
                    {position.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                disabled={isLoading}
                required
              />
            </div>
            
            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                disabled={isLoading}
                required
              />
            </div>
            
            {/* Terms and Privacy */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                  disabled={isLoading}
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    Terms of Service
                  </Link>
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="privacy"
                  checked={agreeToPrivacy}
                  onCheckedChange={(checked) => setAgreeToPrivacy(checked as boolean)}
                  disabled={isLoading}
                />
                <label htmlFor="privacy" className="text-sm text-gray-700">
                  I agree to the{" "}
                  <Link href="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>
            
            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
            
            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login-simple" className="text-blue-600 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
