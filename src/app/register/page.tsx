"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Mail, Lock, User, XCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useTheme } from "next-themes"
import { toast } from "sonner"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number
    feedback: string[]
  }>({ score: 0, feedback: [] })

  const router = useRouter()
  const { register: registerUser, googleSignIn } = useAuth()
  const { theme } = useTheme()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const password = watch("password")

  // Check password strength
  const checkPasswordStrength = (password: string) => {
    const feedback: string[] = []
    let score = 0

    if (password.length >= 8) {
      score += 1
    } else {
      feedback.push("At least 8 characters")
    }

    if (/[A-Z]/.test(password)) {
      score += 1
    } else {
      feedback.push("One uppercase letter")
    }

    if (/[a-z]/.test(password)) {
      score += 1
    } else {
      feedback.push("One lowercase letter")
    }

    if (/\d/.test(password)) {
      score += 1
    } else {
      feedback.push("One number")
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1
    } else {
      feedback.push("One special character")
    }

    setPasswordStrength({ score, feedback })
  }

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      const result = await registerUser(data)
      
      if (result.success) {
        toast.success("Registration successful!", {
          description: "Please check your email to verify your account.",
        })
        router.push("/login?message=check_email")
      } else {
        toast.error("Registration failed", {
          description: result.error,
        })
      }
    } catch (error) {
      toast.error("Registration failed", {
        description: "An unexpected error occurred.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    try {
      const result = await googleSignIn()
      if (!result.success) {
        toast.error("Google sign-in failed", {
          description: result.error,
        })
      }
    } catch (error) {
      toast.error("Google sign-in failed", {
        description: "An unexpected error occurred.",
      })
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-row relative bg-background dark:bg-background">
      {/* Desktop Background Image - Left Side */}
      <div className="fixed top-0 left-0 w-1/2 h-screen bg-cover bg-center bg-no-repeat z-10 hidden lg:block">
        <Image
          src="/images/register/login-img.jpg"
          alt="Football training"
          fill
          className="object-cover"
          priority
          sizes="50vw"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/40 flex items-center justify-center p-8">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">
              REBALL
            </h1>
            <p className="text-xl opacity-90 max-w-md">
              Join REBALL and start your football training journey
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Background Image - Top Banner */}
      <div className="lg:hidden absolute top-0 left-0 w-full h-48 bg-cover bg-center bg-no-repeat z-10">
        <Image
          src="/images/register/login-img.jpg"
          alt="Football training"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
        {/* Overlay for mobile */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/40 flex items-center justify-center p-4">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-2">
              REBALL
            </h1>
            <p className="text-sm opacity-90">
              Join REBALL and start your football training journey
            </p>
          </div>
        </div>
      </div>

      {/* Form Container - Right Side (Desktop) / Full Width (Mobile) */}
      <div className="w-full lg:w-1/2 min-h-screen bg-white dark:bg-black flex items-center justify-center p-8 relative z-20 lg:ml-auto">
        {/* Auth Card */}
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          {/* Logo - Centered */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-black dark:bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white dark:text-black text-2xl font-bold">R</span>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Create Account
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Join REBALL and start your football training journey
            </p>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl p-4 text-gray-700 dark:text-gray-200 cursor-pointer transition-all duration-300 text-base font-medium mb-6 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isGoogleLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-full border-t-gray-700 dark:border-t-gray-200 animate-spin"></div>
                Signing in...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center my-6 text-gray-500 dark:text-gray-400">
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
            <span className="px-4 text-sm">or continue with email</span>
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Name Field */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  {...register("name")}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl py-4 px-4 pl-12 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 text-base transition-all duration-300 outline-none focus:border-black dark:focus:border-white"
                />
              </div>
              {errors.name && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-2 flex items-center gap-1">
                  <XCircle className="w-4 h-4" />
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl py-4 px-4 pl-12 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 text-base transition-all duration-300 outline-none focus:border-black dark:focus:border-white"
                />
              </div>
              {errors.email && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-2 flex items-center gap-1">
                  <XCircle className="w-4 h-4" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  {...register("password", {
                    onChange: (e) => checkPasswordStrength(e.target.value)
                  })}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl py-4 px-4 pl-12 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 text-base transition-all duration-300 outline-none focus:border-black dark:focus:border-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-2 flex items-center gap-1">
                  <XCircle className="w-4 h-4" />
                  {errors.password.message}
                </p>
              )}

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-4">
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full ${
                          level <= passwordStrength.score
                            ? level <= 2
                              ? 'bg-red-500'
                              : level <= 3
                              ? 'bg-yellow-500'
                              : level <= 4
                              ? 'bg-blue-500'
                              : 'bg-green-500'
                            : 'bg-gray-200 dark:bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {passwordStrength.score === 0 && "Very weak"}
                    {passwordStrength.score === 1 && "Weak"}
                    {passwordStrength.score === 2 && "Fair"}
                    {passwordStrength.score === 3 && "Good"}
                    {passwordStrength.score === 4 && "Strong"}
                    {passwordStrength.score === 5 && "Very strong"}
                  </div>
                  {passwordStrength.feedback.length > 0 && (
                    <div className="mt-2">
                      {passwordStrength.feedback.map((feedback, index) => (
                        <p key={index} className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          {feedback}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  {...register("confirmPassword")}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl py-4 px-4 pl-12 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 text-base transition-all duration-300 outline-none focus:border-black dark:focus:border-white"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-2 flex items-center gap-1">
                  <XCircle className="w-4 h-4" />
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black hover:bg-gray-800 text-white border border-white hover:border-gray-300 py-4 px-4 rounded-xl cursor-pointer font-semibold text-base transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed mb-6"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Terms and Privacy */}
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              Privacy Policy
            </Link>
          </p>

          {/* Sign In Link */}
          <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Already have an account?{' '}
            <Link 
              href="/login"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
