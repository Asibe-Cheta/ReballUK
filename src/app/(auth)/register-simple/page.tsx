"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

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
    
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create an account</h1>
            <p className="text-gray-600">Let's get started. Fill in the details below to create your account.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
            
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Name"
                disabled={isLoading}
                required
                className="h-11"
              />
            </div>
            
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                disabled={isLoading}
                required
                className="h-11"
              />
            </div>
            
            {/* Position Field */}
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <select
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                disabled={isLoading}
                required
                className="w-full h-11 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Select your position</option>
                {PLAYER_POSITIONS.map((position) => (
                  <option key={position.value} value={position.value}>
                    {position.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                disabled={isLoading}
                required
                className="h-11"
              />
              <p className="text-sm text-gray-500">Minimum 8 characters.</p>
            </div>
            
            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm Password"
                disabled={isLoading}
                required
                className="h-11"
              />
            </div>
            
            {/* Terms and Privacy */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                  disabled={isLoading}
                />
                <Label htmlFor="terms" className="text-sm font-normal">
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-600 hover:underline underline-offset-4">
                    Terms & Conditions
                  </Link>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="privacy"
                  checked={agreeToPrivacy}
                  onCheckedChange={(checked) => setAgreeToPrivacy(checked as boolean)}
                  disabled={isLoading}
                />
                <Label htmlFor="privacy" className="text-sm font-normal">
                  I agree to the{" "}
                  <Link href="/privacy" className="text-blue-600 hover:underline underline-offset-4">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
            </div>
            
            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-11 bg-black hover:bg-gray-800 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Sign up"}
            </Button>
            
            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have account?{" "}
                <Link href="/login-simple" className="text-blue-600 hover:underline underline-offset-4">
                  Sign in
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
