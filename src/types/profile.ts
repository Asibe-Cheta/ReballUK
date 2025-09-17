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
  videos?: Partial<Video>[]
  _count?: {
    bookings: number
    progress: number
  }
}

export type ProgressWithRelations = Progress & {
  course: Partial<Course>
  video?: Partial<Video> | null
}

export type BookingWithRelations = Booking & {
  course: Partial<Course>
  user: Partial<User>
}

// Profile form validation schemas
export const profileUpdateSchema = z.object({
  playerName: z.string().min(1, "Player name is required").max(100, "Player name too long"),
  dateOfBirth: z.date().optional().nullable(),
  position: z.nativeEnum({
    STRIKER: "STRIKER",
    WINGER: "WINGER", 
    CAM: "CAM",
    FULLBACK: "FULLBACK",
    MIDFIELDER: "MIDFIELDER",
    DEFENDER: "DEFENDER",
    GOALKEEPER: "GOALKEEPER",
    OTHER: "OTHER",
  }).optional().nullable(),
  playingLevel: z.nativeEnum({
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
})

export const onboardingSchema = z.object({
  playerName: z.string().min(1, "Player name is required").max(100),
  dateOfBirth: z.date().optional(),
  position: z.nativeEnum({
    STRIKER: "STRIKER",
    WINGER: "WINGER",
    CAM: "CAM",
    FULLBACK: "FULLBACK",
    MIDFIELDER: "MIDFIELDER",
    DEFENDER: "DEFENDER",
    GOALKEEPER: "GOALKEEPER",
    OTHER: "OTHER",
  }),
  playingLevel: z.nativeEnum({
    BEGINNER: "BEGINNER",
    INTERMEDIATE: "INTERMEDIATE", 
    ADVANCED: "ADVANCED",
    PROFESSIONAL: "PROFESSIONAL",
  }),
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
  playingLevel: string
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
    if (user.profile?.playerName) {
      return user.profile.playerName
    }
    if (user.name) {
      return user.name
    }
    return user.email?.split('@')[0] || 'User'
  },

  // Get user initials
  getInitials: (user: UserWithProfile): string => {
    if (user.profile?.playerName) {
      const names = user.profile.playerName.split(' ')
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
      }
      return user.profile.playerName[0].toUpperCase()
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
      profile.playerName &&
      profile.position &&
      profile.playingLevel &&
      profile.welcomeCompleted
    )
  },

  // Calculate profile completion percentage
  getProfileCompletionPercentage: (profile: Profile | null): number => {
    if (!profile) return 0
    
    const fields = [
      profile.playerName,
      profile.dateOfBirth,
      profile.position,
      profile.playingLevel,
      profile.contactEmail,
      profile.contactNumber,
      profile.postcode,
      profile.medicalConditions,
      profile.currentTeam,
      profile.trainingReason,
      profile.hearAbout,
      profile.postTrainingSnacks,
      profile.postTrainingDrinks,
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
