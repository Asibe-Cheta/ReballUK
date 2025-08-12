import { z } from "zod"
import type { User, Profile, Progress, Booking, Certificate, Course, Video } from "@prisma/client"

// Prisma enum exports for use in components
export {
  PlayerPosition,
  TrainingLevel,
  BookingStatus,
  PaymentStatus,
} from "@prisma/client"

// Core profile types with relations
export type UserWithProfile = User & {
  profile?: Profile | null
}

export type ProfileWithUser = Profile & {
  user: User
}

export type UserWithRelations = User & {
  profile?: Profile | null
  bookings?: Booking[]
  progress?: Progress[]
  certificates?: Certificate[]
}

export type CourseWithRelations = Course & {
  videos?: Video[]
  _count?: {
    bookings: number
    progress: number
  }
}

export type ProgressWithRelations = Progress & {
  course: Course
  video?: Video | null
}

export type BookingWithRelations = Booking & {
  course: Course
  user: User
}

// Profile form validation schemas
export const profileUpdateSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name too long"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name too long"),
  dateOfBirth: z.date().optional().nullable(),
  position: z.nativeEnum({
    STRIKER: "STRIKER",
    WINGER: "WINGER", 
    CAM: "CAM",
    FULLBACK: "FULLBACK",
    GOALKEEPER: "GOALKEEPER",
    DEFENDER: "DEFENDER",
    MIDFIELDER: "MIDFIELDER",
    OTHER: "OTHER",
  }).optional().nullable(),
  trainingLevel: z.nativeEnum({
    BEGINNER: "BEGINNER",
    INTERMEDIATE: "INTERMEDIATE",
    ADVANCED: "ADVANCED",
    PROFESSIONAL: "PROFESSIONAL",
  }).optional().nullable(),
  confidenceRating: z.number().min(1).max(10).optional().nullable(),
  preferredFoot: z.enum(["left", "right", "both"]).optional().nullable(),
  height: z.number().min(100).max(250).optional().nullable(), // cm
  weight: z.number().min(30).max(200).optional().nullable(), // kg
  bio: z.string().max(500, "Bio too long").optional().nullable(),
  goals: z.string().max(1000, "Goals too long").optional().nullable(),
  phoneNumber: z.string().max(20, "Phone number too long").optional().nullable(),
  emergencyContact: z.string().max(100, "Emergency contact too long").optional().nullable(),
  medicalInfo: z.string().max(500, "Medical info too long").optional().nullable(),
})

export const onboardingSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  dateOfBirth: z.date().optional(),
  position: z.nativeEnum({
    STRIKER: "STRIKER",
    WINGER: "WINGER",
    CAM: "CAM", 
    FULLBACK: "FULLBACK",
    GOALKEEPER: "GOALKEEPER",
    DEFENDER: "DEFENDER",
    MIDFIELDER: "MIDFIELDER",
    OTHER: "OTHER",
  }),
  trainingLevel: z.nativeEnum({
    BEGINNER: "BEGINNER",
    INTERMEDIATE: "INTERMEDIATE", 
    ADVANCED: "ADVANCED",
    PROFESSIONAL: "PROFESSIONAL",
  }),
  confidenceRating: z.number().min(1).max(10),
  preferredFoot: z.enum(["left", "right", "both"]),
  goals: z.string().max(1000, "Goals too long").optional(),
})

// Course booking validation
export const courseBookingSchema = z.object({
  courseId: z.string().cuid(),
  scheduledFor: z.date().optional(),
  notes: z.string().max(500).optional(),
})

// Progress update validation
export const progressUpdateSchema = z.object({
  courseId: z.string().cuid(),
  videoId: z.string().cuid().optional(),
  completionPercentage: z.number().min(0).max(100),
  timeSpent: z.number().min(0), // seconds
  feedback: z.string().max(1000).optional(),
  rating: z.number().min(1).max(5).optional(),
})

// Type inference from schemas
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
export type OnboardingInput = z.infer<typeof onboardingSchema>
export type CourseBookingInput = z.infer<typeof courseBookingSchema>
export type ProgressUpdateInput = z.infer<typeof progressUpdateSchema>

// Player statistics interface
export interface PlayerStats {
  totalCourses: number
  completedCourses: number
  totalWatchTime: number // in seconds
  averageRating: number
  certificatesEarned: number
  currentStreak: number // days
  lastActive: Date
  progressPercentage: number
  favoritePosition: string
  trainingLevel: string
}

// Dashboard data interface
export interface DashboardData {
  user: UserWithProfile
  stats: PlayerStats
  recentProgress: ProgressWithRelations[]
  upcomingBookings: BookingWithRelations[]
  recommendedCourses: CourseWithRelations[]
  certificates: Certificate[]
}

// User preferences interface
export interface UserPreferences {
  emailNotifications: boolean
  pushNotifications: boolean
  weeklyDigest: boolean
  trainingReminders: boolean
  language: string
  timezone: string
  autoplayVideos: boolean
  videoQuality: "auto" | "720p" | "1080p"
}

// Training analytics interface
export interface TrainingAnalytics {
  dailyProgress: {
    date: string
    minutesWatched: number
    coursesCompleted: number
  }[]
  weeklyStats: {
    week: string
    totalTime: number
    coursesStarted: number
    coursesCompleted: number
    averageRating: number
  }[]
  positionProgress: {
    position: string
    coursesCompleted: number
    averageRating: number
    totalTime: number
  }[]
  skillDevelopment: {
    skill: string
    level: number
    progress: number
  }[]
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Form state types
export interface FormState<T> {
  data: T
  errors: Record<string, string>
  isLoading: boolean
  isValid: boolean
}

// Player position display labels
export const PLAYER_POSITION_LABELS: Record<string, string> = {
  STRIKER: "Striker",
  WINGER: "Winger",
  CAM: "Central Attacking Midfielder",
  FULLBACK: "Full-back",
  GOALKEEPER: "Goalkeeper", 
  DEFENDER: "Defender",
  MIDFIELDER: "Midfielder",
  OTHER: "Other",
}

// Training level display labels
export const TRAINING_LEVEL_LABELS: Record<string, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced", 
  PROFESSIONAL: "Professional",
}

// Booking status display labels
export const BOOKING_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
}

// Payment status display labels
export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  COMPLETED: "Completed",
  FAILED: "Failed",
  REFUNDED: "Refunded",
}

// Utility functions for profile data
export const profileUtils = {
  // Get display name for user
  getDisplayName: (user: UserWithProfile): string => {
    if (user.profile?.firstName && user.profile?.lastName) {
      return `${user.profile.firstName} ${user.profile.lastName}`
    }
    if (user.name) {
      return user.name
    }
    return user.email?.split('@')[0] || 'User'
  },

  // Get user initials
  getInitials: (user: UserWithProfile): string => {
    if (user.profile?.firstName && user.profile?.lastName) {
      return `${user.profile.firstName[0]}${user.profile.lastName[0]}`.toUpperCase()
    }
    if (user.name) {
      const names = user.name.split(' ')
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
      }
      return user.name.substring(0, 2).toUpperCase()
    }
    return user.email?.substring(0, 2).toUpperCase() || 'U'
  },

  // Check if profile is complete
  isProfileComplete: (profile: Profile | null): boolean => {
    if (!profile) return false
    return !!(
      profile.firstName &&
      profile.lastName &&
      profile.position &&
      profile.trainingLevel &&
      profile.confidenceRating
    )
  },

  // Calculate profile completion percentage
  getProfileCompletionPercentage: (profile: Profile | null): number => {
    if (!profile) return 0
    
    const fields = [
      profile.firstName,
      profile.lastName,
      profile.dateOfBirth,
      profile.position,
      profile.trainingLevel,
      profile.confidenceRating,
      profile.preferredFoot,
      profile.height,
      profile.weight,
      profile.bio,
      profile.goals,
    ]
    
    const completedFields = fields.filter(field => field !== null && field !== undefined).length
    return Math.round((completedFields / fields.length) * 100)
  },

  // Format training time
  formatTrainingTime: (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  },

  // Calculate age from date of birth
  calculateAge: (dateOfBirth: Date): number => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  },
}
