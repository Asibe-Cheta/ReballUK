import { z } from "zod"
import { PlayerPosition, TrainingLevel } from "@prisma/client"

// Onboarding step definitions
export type OnboardingStep = 
  | "personal"
  | "position" 
  | "experience"
  | "goals"
  | "confidence"
  | "preferences"
  | "review"

export interface FormStepProps {
  currentStep: OnboardingStep
  totalSteps: number
  onNext: () => void
  onPrev: () => void
  isValid: boolean
  isLoading?: boolean
}

// Age group options
export const AGE_GROUPS = [
  "under-16",
  "16-18", 
  "19-23",
  "24-30",
  "over-30"
] as const

export type AgeGroup = typeof AGE_GROUPS[number]

// Training preferences
export const TRAINING_DAYS = [
  "monday",
  "tuesday", 
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday"
] as const

export type TrainingDay = typeof TRAINING_DAYS[number]

export const TIME_SLOTS = [
  "early-morning", // 6-9 AM
  "morning",       // 9-12 PM
  "afternoon",     // 12-5 PM
  "evening",       // 5-8 PM
  "night"          // 8-10 PM
] as const

export type TimeSlot = typeof TIME_SLOTS[number]

// Training goals
export const TRAINING_GOALS = [
  "improve-finishing",
  "enhance-dribbling",
  "better-positioning",
  "increase-pace",
  "build-confidence",
  "tactical-awareness",
  "physical-fitness",
  "mental-strength",
  "teamwork-skills",
  "match-preparation"
] as const

export type TrainingGoal = typeof TRAINING_GOALS[number]

// 1v1 scenarios for confidence rating
export const CONFIDENCE_SCENARIOS = [
  "attacking-1v1",
  "defending-1v1", 
  "aerial-duels",
  "pace-battles",
  "skill-moves",
  "finishing-pressure",
  "physical-challenges",
  "decision-making"
] as const

export type ConfidenceScenario = typeof CONFIDENCE_SCENARIOS[number]

// Form validation schemas
export const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name too long"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name too long"),
  dateOfBirth: z.date().optional(),
  ageGroup: z.enum(AGE_GROUPS),
  phoneNumber: z.string().optional(),
  emergencyContact: z.string().max(100, "Emergency contact too long").optional(),
})

export const positionInfoSchema = z.object({
  position: z.nativeEnum(PlayerPosition).optional(),
  alternativePositions: z.array(z.nativeEnum(PlayerPosition)).optional(),
  preferredFoot: z.enum(["left", "right", "both"]),
  height: z.number().min(140).max(220).optional(), // cm
  weight: z.number().min(40).max(150).optional(),  // kg
})

export const experienceInfoSchema = z.object({
  trainingLevel: z.nativeEnum(TrainingLevel).optional(),
  yearsPlaying: z.number().min(0).max(30).optional(),
  currentClub: z.string().max(100, "Club name too long").optional(),
  previousExperience: z.string().max(500, "Description too long").optional(),
  coachingExperience: z.boolean().default(false),
})

export const goalsInfoSchema = z.object({
  primaryGoals: z.array(z.enum(TRAINING_GOALS)).min(1, "Please select at least one goal").max(5, "Please select at most 5 goals").optional(),
  specificAreas: z.string().max(500, "Description too long").optional(),
  shortTermGoals: z.string().max(300, "Description too long").optional(),
  longTermGoals: z.string().max(300, "Description too long").optional(),
})

export const confidenceInfoSchema = z.object({
  scenarios: z.record(
    z.enum(CONFIDENCE_SCENARIOS),
    z.number().min(1).max(10)
  ).optional(),
  overallConfidence: z.number().min(1).max(10),
  areasForImprovement: z.array(z.enum(CONFIDENCE_SCENARIOS)).optional(),
})

export const preferencesInfoSchema = z.object({
  availableDays: z.array(z.enum(TRAINING_DAYS)).min(1, "Please select at least one day").optional(),
  preferredTimes: z.array(z.enum(TIME_SLOTS)).min(1, "Please select at least one time slot").optional(),
  sessionFrequency: z.enum(["once-week", "twice-week", "three-times-week", "daily"]),
  sessionDuration: z.enum(["30-min", "45-min", "60-min", "90-min"]),
  trainingIntensity: z.enum(["low", "moderate", "high", "very-high"]),
  groupTraining: z.boolean().default(false),
  oneOnOneTraining: z.boolean().default(true),
})

// Complete welcome form schema
export const welcomeFormSchema = z.object({
  personal: personalInfoSchema,
  position: positionInfoSchema,
  experience: experienceInfoSchema,
  goals: goalsInfoSchema,
  confidence: confidenceInfoSchema,
  preferences: preferencesInfoSchema,
})

// Type inference
export type PersonalInfo = z.infer<typeof personalInfoSchema>
export type PositionInfo = z.infer<typeof positionInfoSchema>
export type ExperienceInfo = z.infer<typeof experienceInfoSchema>
export type GoalsInfo = z.infer<typeof goalsInfoSchema>
export type ConfidenceInfo = z.infer<typeof confidenceInfoSchema>
export type PreferencesInfo = z.infer<typeof preferencesInfoSchema>
export type WelcomeFormData = z.infer<typeof welcomeFormSchema>

// Player profile interface (combination of form data)
export interface PlayerProfile extends PersonalInfo, PositionInfo, ExperienceInfo {
  id?: string
  userId: string
  goals: GoalsInfo
  confidence: ConfidenceInfo
  preferences: PreferencesInfo
  completedOnboarding: boolean
  createdAt?: Date
  updatedAt?: Date
}

// Training preferences interface
export interface TrainingPreferences {
  availableDays: TrainingDay[]
  preferredTimes: TimeSlot[]
  sessionFrequency: string
  sessionDuration: string
  trainingIntensity: string
  groupTraining: boolean
  oneOnOneTraining: boolean
}

// Form state management
export interface WelcomeFormState {
  currentStep: OnboardingStep
  formData: Partial<WelcomeFormData>
  errors: Record<string, string[]>
  isLoading: boolean
  isCompleted: boolean
}

// Step configuration
export interface StepConfig {
  id: OnboardingStep
  title: string
  description: string
  isOptional?: boolean
  estimatedTime?: string
}

// API response types
export interface ProfileCreationResponse {
  success: boolean
  profile?: PlayerProfile
  error?: string
  message?: string
}

// Display labels for form options
export const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
  "under-16": "Under 16",
  "16-18": "16-18 years",
  "19-23": "19-23 years", 
  "24-30": "24-30 years",
  "over-30": "Over 30"
}

export const TRAINING_DAY_LABELS: Record<TrainingDay, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday", 
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday"
}

export const TIME_SLOT_LABELS: Record<TimeSlot, string> = {
  "early-morning": "Early Morning (6-9 AM)",
  "morning": "Morning (9 AM-12 PM)",
  "afternoon": "Afternoon (12-5 PM)",
  "evening": "Evening (5-8 PM)",
  "night": "Night (8-10 PM)"
}

export const TRAINING_GOAL_LABELS: Record<TrainingGoal, string> = {
  "improve-finishing": "Improve Finishing",
  "enhance-dribbling": "Enhance Dribbling",
  "better-positioning": "Better Positioning",
  "increase-pace": "Increase Pace",
  "build-confidence": "Build Confidence", 
  "tactical-awareness": "Tactical Awareness",
  "physical-fitness": "Physical Fitness",
  "mental-strength": "Mental Strength",
  "teamwork-skills": "Teamwork Skills",
  "match-preparation": "Match Preparation"
}

export const CONFIDENCE_SCENARIO_LABELS: Record<ConfidenceScenario, string> = {
  "attacking-1v1": "Attacking 1v1 Situations",
  "defending-1v1": "Defending 1v1 Situations",
  "aerial-duels": "Aerial Duels",
  "pace-battles": "Pace Battles", 
  "skill-moves": "Skill Moves & Tricks",
  "finishing-pressure": "Finishing Under Pressure",
  "physical-challenges": "Physical Challenges",
  "decision-making": "Quick Decision Making"
}

// Onboarding step configuration
export const ONBOARDING_STEPS: StepConfig[] = [
  {
    id: "personal",
    title: "Personal Information", 
    description: "Tell us about yourself",
    estimatedTime: "2 min"
  },
  {
    id: "position",
    title: "Playing Position",
    description: "Your role on the field",
    estimatedTime: "2 min" 
  },
  {
    id: "experience",
    title: "Experience Level",
    description: "Your football background",
    estimatedTime: "3 min"
  },
  {
    id: "goals",
    title: "Training Goals", 
    description: "What you want to achieve",
    estimatedTime: "3 min"
  },
  {
    id: "confidence",
    title: "Confidence Assessment",
    description: "Rate your confidence in key areas",
    estimatedTime: "4 min"
  },
  {
    id: "preferences",
    title: "Training Preferences",
    description: "When and how you prefer to train", 
    estimatedTime: "3 min"
  },
  {
    id: "review",
    title: "Review & Complete",
    description: "Review your information",
    estimatedTime: "2 min"
  }
]

// Utility functions
export const welcomeUtils = {
  // Get step index
  getStepIndex: (step: OnboardingStep): number => {
    return ONBOARDING_STEPS.findIndex(s => s.id === step)
  },

  // Get next step
  getNextStep: (currentStep: OnboardingStep): OnboardingStep | null => {
    const currentIndex = welcomeUtils.getStepIndex(currentStep)
    if (currentIndex === -1 || currentIndex === ONBOARDING_STEPS.length - 1) {
      return null
    }
    return ONBOARDING_STEPS[currentIndex + 1].id
  },

  // Get previous step
  getPreviousStep: (currentStep: OnboardingStep): OnboardingStep | null => {
    const currentIndex = welcomeUtils.getStepIndex(currentStep)
    if (currentIndex <= 0) {
      return null
    }
    return ONBOARDING_STEPS[currentIndex - 1].id
  },

  // Calculate progress percentage
  getProgressPercentage: (currentStep: OnboardingStep): number => {
    const currentIndex = welcomeUtils.getStepIndex(currentStep)
    return Math.round(((currentIndex + 1) / ONBOARDING_STEPS.length) * 100)
  },

  // Format form data for API
  formatFormDataForAPI: (formData: WelcomeFormData): Partial<PlayerProfile> => {
    return {
      // Personal info
      firstName: formData.personal.firstName,
      lastName: formData.personal.lastName,
      dateOfBirth: formData.personal.dateOfBirth,
      phoneNumber: formData.personal.phoneNumber,
      emergencyContact: formData.personal.emergencyContact,
      
      // Position info
      position: formData.position.position,
      preferredFoot: formData.position.preferredFoot,
      height: formData.position.height,
      weight: formData.position.weight,
      
      // Experience info
      trainingLevel: formData.experience.trainingLevel,
      
      // Goals and preferences (stored as JSON or separate fields)
      goals: formData.goals,
      confidence: formData.confidence,
      preferences: formData.preferences,
      
      completedOnboarding: true,
    }
  },

  // Validate step data
  validateStep: (step: OnboardingStep, data: Record<string, unknown>): { isValid: boolean; errors: string[] } => {
    try {
      switch (step) {
        case "personal":
          personalInfoSchema.parse(data)
          break
        case "position":
          positionInfoSchema.parse(data)
          break
        case "experience":
          experienceInfoSchema.parse(data)
          break
        case "goals":
          goalsInfoSchema.parse(data)
          break
        case "confidence":
          confidenceInfoSchema.parse(data)
          break
        case "preferences":
          preferencesInfoSchema.parse(data)
          break
        default:
          return { isValid: true, errors: [] }
      }
      return { isValid: true, errors: [] }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          isValid: false,
          errors: error.issues.map(err => err.message)
        }
      }
      return { isValid: false, errors: ["Validation failed"] }
    }
  }
}
