"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface PasswordChangeFormProps {
  className?: string
}

export function PasswordChangeForm({ className }: PasswordChangeFormProps) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required'
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters long'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password'
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      // Get the Supabase access token from localStorage
      const token = localStorage.getItem('supabase_access_token')
      if (!token) {
        toast.error('Authentication required. Please log in again.')
        window.location.href = '/login'
        return
      }

      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('Password changed successfully!')
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        toast.error(result.error || 'Failed to change password')
        if (result.details) {
          console.error('Password change error details:', result.details)
        }
      }
    } catch (error) {
      console.error('Password change error:', error)
      toast.error('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-xl text-gray-900 dark:text-white">
          <Lock className="w-5 h-5" />
          <span>Change Password</span>
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Update your account password for better security
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-gray-700 dark:text-gray-300">
              Current Password
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPasswords.current ? "text" : "password"}
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                className={`pr-10 ${errors.currentPassword ? 'border-red-500' : ''}`}
                placeholder="Enter your current password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPasswords.current ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.currentPassword}</span>
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-gray-700 dark:text-gray-300">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPasswords.new ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className={`pr-10 ${errors.newPassword ? 'border-red-500' : ''}`}
                placeholder="Enter your new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPasswords.new ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.newPassword}</span>
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">
              Confirm New Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className={`pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                placeholder="Confirm your new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPasswords.confirm ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.confirmPassword}</span>
              </p>
            )}
          </div>

          {/* Password Requirements */}
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-2">
              Password Requirements:
            </p>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>At least 6 characters long</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>Different from your current password</span>
              </li>
            </ul>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                Changing Password...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
