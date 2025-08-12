import { z } from "zod"
import type { 
  User, 
  Profile, 
  Booking, 
  Progress, 
  Course, 
  Video, 
  Certificate,
  PlayerPosition,
  TrainingLevel,
  BookingStatus 
} from "@prisma/client"

// Dashboard data interfaces
export interface UserStats {
  // Core metrics
  totalSessions: number
  completedSessions: number
  totalWatchTime: number // in seconds
  averageRating: number // 1-5 stars
  certificatesEarned: number
  currentStreak: number // days
  lastActive: Date
  
  // Performance metrics
  improvementRate: number // percentage
  successRate: number // percentage
  confidenceGrowth: number // percentage change
  
  // Position-specific stats
  positionRank: number // relative to other users in same position
  positionProgress: number // percentage mastery of position skills
  
  // Time-based metrics
  thisWeekSessions: number
  thisMonthSessions: number
  weeklyGoal: number
  monthlyGoal: number
}

export interface SessionData {
  id: string
  date: Date
  type: "SISW" | "TAV" | "PRACTICE" | "ANALYSIS"
  title: string
  duration: number // in seconds
  rating?: number // 1-5 stars
  feedback?: string
  performanceScore?: number // calculated performance metric
  improvementAreas: string[]
  completionPercentage: number
  videoUrl?: string
  thumbnailUrl?: string
  course: {
    id: string
    title: string
    level: TrainingLevel
    position: PlayerPosition
  }
}

export interface ProgressPoint {
  date: string // ISO date string
  value: number
  metric: "success_rate" | "confidence" | "performance" | "skill_level"
  category?: string // specific skill or area
}

export interface ProgressData {
  overall: ProgressPoint[]
  bySkill: Record<string, ProgressPoint[]>
  byPosition: ProgressPoint[]
  confidence: ProgressPoint[]
  weeklyTrends: {
    week: string
    sessionsCompleted: number
    averageRating: number
    totalTime: number
    improvementScore: number
  }[]
}

export interface UpcomingBooking {
  id: string
  courseId: string
  course: {
    title: string
    level: TrainingLevel
    position: PlayerPosition
    duration: number
    thumbnailUrl?: string
  }
  scheduledFor: Date
  status: BookingStatus
  notes?: string
  isUrgent: boolean // less than 24 hours away
}

export interface TrainingRecommendation {
  id: string
  type: "SKILL_GAP" | "POSITION_SPECIFIC" | "CONFIDENCE_BUILDER" | "NEXT_LEVEL"
  title: string
  description: string
  reason: string // why this is recommended
  priority: "HIGH" | "MEDIUM" | "LOW"
  estimatedTime: number // in minutes
  courseId?: string
  course?: {
    title: string
    level: TrainingLevel
    thumbnailUrl?: string
  }
  skillAreas: string[]
  confidenceBoost: number // estimated improvement percentage
}

export interface RecentAchievement {
  id: string
  type: "CERTIFICATE" | "MILESTONE" | "STREAK" | "IMPROVEMENT"
  title: string
  description: string
  earnedAt: Date
  badgeUrl?: string
  value?: number // for numeric achievements
  isNew: boolean // earned in last 7 days
}

export interface DashboardData {
  user: User & {
    profile: Profile
  }
  stats: UserStats
  recentSessions: SessionData[]
  progressData: ProgressData
  upcomingBookings: UpcomingBooking[]
  recommendations: TrainingRecommendation[]
  achievements: RecentAchievement[]
  goalProgress: {
    weekly: {
      target: number
      current: number
      percentage: number
    }
    monthly: {
      target: number
      current: number
      percentage: number
    }
  }
}

// API response types
export interface DashboardStatsResponse {
  success: boolean
  data?: UserStats
  error?: string
}

export interface DashboardProgressResponse {
  success: boolean
  data?: ProgressData
  error?: string
}

export interface DashboardSessionsResponse {
  success: boolean
  data?: SessionData[]
  error?: string
}

export interface DashboardOverviewResponse {
  success: boolean
  data?: DashboardData
  error?: string
}

// Chart data types
export interface ChartDataPoint {
  date: string
  value: number
  label?: string
  category?: string
}

export interface ChartConfig {
  timeframe: "7d" | "30d" | "90d" | "1y"
  metric: "performance" | "confidence" | "success_rate" | "skill_level"
  showTrend: boolean
  smoothing: boolean
}

// Component prop types
export interface StatsCardProps {
  title: string
  value: string | number
  change?: number // percentage change
  icon: React.ReactNode
  description?: string
  trend?: "up" | "down" | "stable"
  isLoading?: boolean
  className?: string
}

export interface ProgressChartProps {
  data: ProgressPoint[]
  config: ChartConfig
  height?: number
  className?: string
  isLoading?: boolean
}

export interface RecentSessionsProps {
  sessions: SessionData[]
  isLoading?: boolean
  className?: string
}

export interface QuickActionsProps {
  onBookSession: () => void
  onViewAnalysis: () => void
  onStartTraining: () => void
  recommendations: TrainingRecommendation[]
  className?: string
}

// Validation schemas
export const dashboardStatsSchema = z.object({
  totalSessions: z.number().min(0),
  completedSessions: z.number().min(0),
  totalWatchTime: z.number().min(0),
  averageRating: z.number().min(0).max(5),
  certificatesEarned: z.number().min(0),
  currentStreak: z.number().min(0),
  lastActive: z.date(),
  improvementRate: z.number(),
  successRate: z.number().min(0).max(100),
  confidenceGrowth: z.number(),
  positionRank: z.number().min(1),
  positionProgress: z.number().min(0).max(100),
  thisWeekSessions: z.number().min(0),
  thisMonthSessions: z.number().min(0),
  weeklyGoal: z.number().min(0),
  monthlyGoal: z.number().min(0),
})

export const sessionDataSchema = z.object({
  id: z.string(),
  date: z.date(),
  type: z.enum(["SISW", "TAV", "PRACTICE", "ANALYSIS"]),
  title: z.string(),
  duration: z.number().min(0),
  rating: z.number().min(1).max(5).optional(),
  feedback: z.string().optional(),
  performanceScore: z.number().min(0).max(100).optional(),
  improvementAreas: z.array(z.string()),
  completionPercentage: z.number().min(0).max(100),
  videoUrl: z.string().optional(),
  thumbnailUrl: z.string().optional(),
})

// Utility functions
export const dashboardUtils = {
  // Calculate improvement rate based on historical data
  calculateImprovementRate: (progressData: ProgressPoint[]): number => {
    if (progressData.length < 2) return 0
    
    const recent = progressData.slice(-5) // Last 5 data points
    const older = progressData.slice(-10, -5) // Previous 5 data points
    
    if (older.length === 0) return 0
    
    const recentAvg = recent.reduce((sum, p) => sum + p.value, 0) / recent.length
    const olderAvg = older.reduce((sum, p) => sum + p.value, 0) / older.length
    
    return Math.round(((recentAvg - olderAvg) / olderAvg) * 100)
  },

  // Calculate success rate from session data
  calculateSuccessRate: (sessions: SessionData[]): number => {
    if (sessions.length === 0) return 0
    
    const successfulSessions = sessions.filter(s => 
      s.completionPercentage >= 80 && (s.rating || 0) >= 4
    ).length
    
    return Math.round((successfulSessions / sessions.length) * 100)
  },

  // Get trend direction from change percentage
  getTrendDirection: (change: number): "up" | "down" | "stable" => {
    if (change > 5) return "up"
    if (change < -5) return "down"
    return "stable"
  },

  // Format duration to human readable
  formatDuration: (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  },

  // Format relative time (e.g., "2 days ago")
  formatRelativeTime: (date: Date): string => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  },

  // Generate training recommendations based on user data
  generateRecommendations: (
    userStats: UserStats,
    profile: Profile,
    recentSessions: SessionData[]
  ): TrainingRecommendation[] => {
    const recommendations: TrainingRecommendation[] = []

    // Low confidence areas
    if (userStats.successRate < 70) {
      recommendations.push({
        id: "confidence-builder",
        type: "CONFIDENCE_BUILDER",
        title: "Confidence Building Session",
        description: "Focus on fundamental skills to build confidence",
        reason: "Your recent success rate could use improvement",
        priority: "HIGH",
        estimatedTime: 45,
        skillAreas: ["basic-control", "decision-making"],
        confidenceBoost: 15,
      })
    }

    // Position-specific recommendations
    if (profile.position) {
      recommendations.push({
        id: `${profile.position.toLowerCase()}-advanced`,
        type: "POSITION_SPECIFIC",
        title: `Advanced ${profile.position} Training`,
        description: `Specialized training for ${profile.position} position`,
        reason: "Continue developing your position-specific skills",
        priority: "MEDIUM",
        estimatedTime: 60,
        skillAreas: [`${profile.position.toLowerCase()}-skills`],
        confidenceBoost: 10,
      })
    }

    // Consistency recommendations
    if (userStats.currentStreak < 3) {
      recommendations.push({
        id: "consistency-builder",
        type: "SKILL_GAP",
        title: "Build Training Consistency",
        description: "Regular short sessions to build momentum",
        reason: "Consistent training leads to faster improvement",
        priority: "MEDIUM",
        estimatedTime: 30,
        skillAreas: ["consistency", "habit-building"],
        confidenceBoost: 8,
      })
    }

    return recommendations.slice(0, 3) // Return top 3 recommendations
  },

  // Format stats for display
  formatStatValue: (value: number, type: "percentage" | "time" | "count" | "rating"): string => {
    switch (type) {
      case "percentage":
        return `${Math.round(value)}%`
      case "time":
        return dashboardUtils.formatDuration(value)
      case "count":
        return value.toString()
      case "rating":
        return `${value.toFixed(1)}/5`
      default:
        return value.toString()
    }
  },

  // Get color for trend
  getTrendColor: (trend: "up" | "down" | "stable"): string => {
    switch (trend) {
      case "up":
        return "text-green-600 dark:text-green-400"
      case "down":
        return "text-red-600 dark:text-red-400"
      case "stable":
        return "text-gray-600 dark:text-gray-400"
    }
  },

  // Check if booking is urgent (within 24 hours)
  isBookingUrgent: (scheduledFor: Date): boolean => {
    const now = new Date()
    const diffMs = scheduledFor.getTime() - now.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)
    return diffHours <= 24 && diffHours > 0
  },

  // Group sessions by week for trending
  groupSessionsByWeek: (sessions: SessionData[]): Record<string, SessionData[]> => {
    const grouped: Record<string, SessionData[]> = {}
    
    sessions.forEach(session => {
      const date = new Date(session.date)
      const weekStart = new Date(date.setDate(date.getDate() - date.getDay()))
      const weekKey = weekStart.toISOString().split('T')[0]
      
      if (!grouped[weekKey]) {
        grouped[weekKey] = []
      }
      grouped[weekKey].push(session)
    })
    
    return grouped
  },
}
