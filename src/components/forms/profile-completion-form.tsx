"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Heart, 
  Target, 
  Trophy, 
  Users, 
  FileText, 
  MessageCircle, 
  Cookie, 
  Coffee, 
  Share2,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Upload
} from 'lucide-react'
import { toast } from 'sonner'

interface ProfileData {
  // Stage 1: Personal Information
  playerName: string
  dateOfBirth: string
  guardianName: string
  contactEmail: string
  contactNumber: string
  postcode: string
  medicalConditions: string
  
  // Stage 2: Football Information
  position: string
  playingLevel: string
  currentTeam: string
  evidenceFiles: string[]
  
  // Stage 3: Training Information
  trainingReason: string
  hearAbout: string
  referralName: string
  
  // Stage 4: Preferences
  postTrainingSnacks: string
  postTrainingDrinks: string
  socialMediaConsent: boolean
  marketingConsent: boolean
}

const POSITIONS = [
  { value: 'STRIKER', label: 'Striker' },
  { value: 'WINGER', label: 'Winger' },
  { value: 'CAM', label: 'Central Attacking Midfielder' },
  { value: 'FULLBACK', label: 'Fullback' },
  { value: 'MIDFIELDER', label: 'Midfielder' },
  { value: 'DEFENDER', label: 'Defender' },
  { value: 'OTHER', label: 'Other' }
]

const PLAYING_LEVELS = [
  { value: 'BEGINNER', label: 'Beginner - Just starting out' },
  { value: 'RECREATIONAL', label: 'Recreational - Play for fun' },
  { value: 'AMATEUR', label: 'Amateur - Local leagues' },
  { value: 'SEMI_PROFESSIONAL', label: 'Semi-Professional - Regional level' },
  { value: 'PROFESSIONAL', label: 'Professional - Contracted player' },
  { value: 'ACADEMY', label: 'Academy - Youth development' }
]

const TRAINING_REASONS = [
  'Improve technical skills',
  'Increase game intelligence',
  'Build confidence',
  'Prepare for trials',
  'Return from injury',
  'Maintain fitness',
  'Learn new position',
  'Other'
]

const HEAR_ABOUT_OPTIONS = [
  'Social media (Instagram, TikTok, etc.)',
  'Google search',
  'Friend recommendation',
  'Coach recommendation',
  'Club recommendation',
  'Advertisement',
  'Website',
  'Other'
]

const SNACK_OPTIONS = [
  'Banana',
  'Energy bar',
  'Protein shake',
  'Nuts',
  'Fruit',
  'Yogurt',
  'Other',
  'None'
]

const DRINK_OPTIONS = [
  'Water',
  'Sports drink',
  'Protein shake',
  'Energy drink',
  'Coconut water',
  'Other'
]

export default function ProfileCompletionForm() {
  const [currentStage, setCurrentStage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData>({
    playerName: '',
    dateOfBirth: '',
    guardianName: '',
    contactEmail: '',
    contactNumber: '',
    postcode: '',
    medicalConditions: '',
    position: '',
    playingLevel: '',
    currentTeam: '',
    evidenceFiles: [],
    trainingReason: '',
    hearAbout: '',
    referralName: '',
    postTrainingSnacks: '',
    postTrainingDrinks: '',
    socialMediaConsent: false,
    marketingConsent: false
  })

  const totalStages = 4
  const progress = (currentStage / totalStages) * 100

  const validateStage = (stage: number): boolean => {
    switch (stage) {
      case 1:
        return !!(profileData.playerName && profileData.dateOfBirth && profileData.contactEmail && profileData.contactNumber && profileData.postcode)
      case 2:
        return !!(profileData.position && profileData.playingLevel && profileData.currentTeam)
      case 3:
        return !!(profileData.trainingReason && profileData.hearAbout)
      case 4:
        return !!(profileData.postTrainingSnacks && profileData.postTrainingDrinks)
      default:
        return false
    }
  }

  const handleNext = () => {
    if (validateStage(currentStage)) {
      setCurrentStage(prev => Math.min(prev + 1, totalStages))
    } else {
      toast.error('Please fill in all required fields before continuing')
    }
  }

  const handlePrevious = () => {
    setCurrentStage(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStage(4)) {
      toast.error('Please complete all required fields')
      return
    }

    setIsLoading(true)
    try {
      // Get the Supabase access token from localStorage
      const token = localStorage.getItem('supabase_access_token')
      if (!token) {
        toast.error('Authentication required. Please log in again.')
        window.location.href = '/login'
        return
      }

          const response = await fetch('/api/profile/complete-bypass', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('Profile completed successfully!')
        // Redirect to dashboard
        window.location.href = '/dashboard'
      } else {
        toast.error(result.error || 'Failed to complete profile')
      }
    } catch (error) {
      toast.error('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfileData = (field: keyof ProfileData, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  const renderStage1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Personal Information</h2>
        <p className="text-gray-600 dark:text-gray-400">Tell us about yourself</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="playerName" className="text-gray-700 dark:text-gray-300">
            Player's Name *
          </Label>
          <Input
            id="playerName"
            value={profileData.playerName}
            onChange={(e) => updateProfileData('playerName', e.target.value)}
            placeholder="Enter your full name"
            className="border-gray-300 dark:border-gray-600"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth" className="text-gray-700 dark:text-gray-300">
            Date of Birth *
          </Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={profileData.dateOfBirth}
            onChange={(e) => updateProfileData('dateOfBirth', e.target.value)}
            className="border-gray-300 dark:border-gray-600"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="guardianName" className="text-gray-700 dark:text-gray-300">
            Parent/Guardian Name (if under 16)
          </Label>
          <Input
            id="guardianName"
            value={profileData.guardianName}
            onChange={(e) => updateProfileData('guardianName', e.target.value)}
            placeholder="Enter guardian's name"
            className="border-gray-300 dark:border-gray-600"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactEmail" className="text-gray-700 dark:text-gray-300">
            Contact Email *
          </Label>
          <Input
            id="contactEmail"
            type="email"
            value={profileData.contactEmail}
            onChange={(e) => updateProfileData('contactEmail', e.target.value)}
            placeholder="Enter your email"
            className="border-gray-300 dark:border-gray-600"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactNumber" className="text-gray-700 dark:text-gray-300">
            Contact Number *
          </Label>
          <Input
            id="contactNumber"
            type="tel"
            value={profileData.contactNumber}
            onChange={(e) => updateProfileData('contactNumber', e.target.value)}
            placeholder="Enter your phone number"
            className="border-gray-300 dark:border-gray-600"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="postcode" className="text-gray-700 dark:text-gray-300">
            Postcode *
          </Label>
          <Input
            id="postcode"
            value={profileData.postcode}
            onChange={(e) => updateProfileData('postcode', e.target.value)}
            placeholder="Enter your postcode"
            className="border-gray-300 dark:border-gray-600"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="medicalConditions" className="text-gray-700 dark:text-gray-300">
          Medical Conditions
        </Label>
        <Textarea
          id="medicalConditions"
          value={profileData.medicalConditions}
          onChange={(e) => updateProfileData('medicalConditions', e.target.value)}
          placeholder="Please list any medical conditions or allergies we should be aware of"
          rows={3}
          className="border-gray-300 dark:border-gray-600"
        />
      </div>
    </div>
  )

  const renderStage2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Football Information</h2>
        <p className="text-gray-600 dark:text-gray-400">Tell us about your football background</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-gray-300">Position *</Label>
          <Select value={profileData.position} onValueChange={(value) => updateProfileData('position', value)}>
            <SelectTrigger className="border-gray-300 dark:border-gray-600">
              <SelectValue placeholder="Select your position" />
            </SelectTrigger>
            <SelectContent>
              {POSITIONS.map((position) => (
                <SelectItem key={position.value} value={position.value}>
                  {position.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-gray-300">Playing Level *</Label>
          <Select value={profileData.playingLevel} onValueChange={(value) => updateProfileData('playingLevel', value)}>
            <SelectTrigger className="border-gray-300 dark:border-gray-600">
              <SelectValue placeholder="Select your playing level" />
            </SelectTrigger>
            <SelectContent>
              {PLAYING_LEVELS.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="currentTeam" className="text-gray-700 dark:text-gray-300">
            Current Team *
          </Label>
          <Input
            id="currentTeam"
            value={profileData.currentTeam}
            onChange={(e) => updateProfileData('currentTeam', e.target.value)}
            placeholder="Enter your current team or club"
            className="border-gray-300 dark:border-gray-600"
          />
        </div>

        {profileData.playingLevel === 'PROFESSIONAL' && (
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300">
              Evidence of Professional Status *
            </Label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Upload evidence of your professional contract
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Acceptable: Contract, ID card, line-ups, statistics, social media posts, training/match photos
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                Upload Files
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderStage3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Training Information</h2>
        <p className="text-gray-600 dark:text-gray-400">Help us understand your training goals</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-gray-300">Why are you creating a REBALL account? *</Label>
          <Select value={profileData.trainingReason} onValueChange={(value) => updateProfileData('trainingReason', value)}>
            <SelectTrigger className="border-gray-300 dark:border-gray-600">
              <SelectValue placeholder="Select your main reason" />
            </SelectTrigger>
            <SelectContent>
              {TRAINING_REASONS.map((reason) => (
                <SelectItem key={reason} value={reason}>
                  {reason}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-gray-300">How did you hear about REBALL? *</Label>
          <Select value={profileData.hearAbout} onValueChange={(value) => updateProfileData('hearAbout', value)}>
            <SelectTrigger className="border-gray-300 dark:border-gray-600">
              <SelectValue placeholder="Select how you found us" />
            </SelectTrigger>
            <SelectContent>
              {HEAR_ABOUT_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="referralName" className="text-gray-700 dark:text-gray-300">
            Referral Name (if applicable)
          </Label>
          <Input
            id="referralName"
            value={profileData.referralName}
            onChange={(e) => updateProfileData('referralName', e.target.value)}
            placeholder="Enter the name of who referred you"
            className="border-gray-300 dark:border-gray-600"
          />
        </div>
      </div>
    </div>
  )

  const renderStage4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Preferences & Consent</h2>
        <p className="text-gray-600 dark:text-gray-400">Final details and permissions</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-gray-300">Post-Training Snacks *</Label>
          <Select value={profileData.postTrainingSnacks} onValueChange={(value) => updateProfileData('postTrainingSnacks', value)}>
            <SelectTrigger className="border-gray-300 dark:border-gray-600">
              <SelectValue placeholder="Select your preferred snack" />
            </SelectTrigger>
            <SelectContent>
              {SNACK_OPTIONS.map((snack) => (
                <SelectItem key={snack} value={snack}>
                  {snack}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-gray-300">Post-Training Drinks *</Label>
          <Select value={profileData.postTrainingDrinks} onValueChange={(value) => updateProfileData('postTrainingDrinks', value)}>
            <SelectTrigger className="border-gray-300 dark:border-gray-600">
              <SelectValue placeholder="Select your preferred drink" />
            </SelectTrigger>
            <SelectContent>
              {DRINK_OPTIONS.map((drink) => (
                <SelectItem key={drink} value={drink}>
                  {drink}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="socialMediaConsent"
              checked={profileData.socialMediaConsent}
              onCheckedChange={(checked) => updateProfileData('socialMediaConsent', checked)}
            />
            <Label htmlFor="socialMediaConsent" className="text-gray-700 dark:text-gray-300">
              I consent to REBALL posting my session highlight reels on social media
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="marketingConsent"
              checked={profileData.marketingConsent}
              onCheckedChange={(checked) => updateProfileData('marketingConsent', checked)}
            />
            <Label htmlFor="marketingConsent" className="text-gray-700 dark:text-gray-300">
              I consent to receiving marketing communications from REBALL
            </Label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderStage = () => {
    switch (currentStage) {
      case 1:
        return renderStage1()
      case 2:
        return renderStage2()
      case 3:
        return renderStage3()
      case 4:
        return renderStage4()
      default:
        return renderStage1()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Complete Your Profile</h1>
              <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                Step {currentStage} of {totalStages}
              </Badge>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Form Card */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-8">
              {renderStage()}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStage === 1}
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStage < totalStages ? (
              <Button
                onClick={handleNext}
                disabled={!validateStage(currentStage)}
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!validateStage(4) || isLoading}
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
              >
                {isLoading ? 'Completing...' : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete Profile
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
