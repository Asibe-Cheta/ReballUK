import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-server"
import { db, withRetry } from "@/lib/db"
import { dashboardUtils } from "@/types/dashboard"
import type { 
  DashboardData, 
  DashboardOverviewResponse,
  UpcomingBooking,
  TrainingRecommendation,
  RecentAchievement
} from "@/types/dashboard"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Fetch comprehensive dashboard data
    const dashboardData = await withRetry(async () => {
              // First get user with profile using raw SQL (consistent with registration)
        const users = await db.$queryRaw<Array<{
          id: string
          name: string
          email: string
          profile_id: string | null
          profile_firstName: string | null
          profile_lastName: string | null
          profile_position: string | null
          profile_trainingLevel: string | null
        }>>`
          SELECT 
            u.id, u.name, u.email,
            p.id as profile_id,
            p."firstName" as profile_firstName,
            p."lastName" as profile_lastName,
            p.position as profile_position,
            p."trainingLevel" as profile_trainingLevel
          FROM "users" u
          LEFT JOIN "profiles" p ON u.id = p."userId"
          WHERE u.id = ${userId}
          LIMIT 1
        `

      const userWithProfile = users[0]

      if (!userWithProfile) {
        throw new Error("User not found")
      }

      // Transform the raw SQL result to match expected format
      const user = {
        id: userWithProfile.id,
        name: userWithProfile.name,
        email: userWithProfile.email,
        profile: userWithProfile.profile_id ? {
          id: userWithProfile.profile_id,
          firstName: userWithProfile.profile_firstName || '',
          lastName: userWithProfile.profile_lastName || '',
          position: userWithProfile.profile_position || 'GENERAL',
          trainingLevel: userWithProfile.profile_trainingLevel || 'BEGINNER',
          onboardingCompleted: false, // Default to false since we removed this field
        } : null
      }

      // For now, use empty arrays to avoid schema issues - we'll populate with real data later
      const upcomingBookingsData: any[] = []
      const certificatesData: any[] = []
      const recentProgressData: any[] = []

      // Transform upcoming bookings (empty for now)
      const upcomingBookings: UpcomingBooking[] = []

      // Generate basic stats with default values
      const stats = {
        totalSessions: 0,
        completedSessions: 0,
        totalWatchTime: 0,
        averageRating: 0,
        certificatesEarned: 0,
        currentStreak: 0,
        lastActive: new Date(),
        improvementRate: 0,
        successRate: 85, // Default success rate
        confidenceGrowth: 0,
        positionRank: 1,
        positionProgress: 0,
        thisWeekSessions: 0,
        thisMonthSessions: 0,
        weeklyGoal: 3,
        monthlyGoal: 12,
      }

      // Generate training recommendations (simplified for now)
      const recommendations: TrainingRecommendation[] = []

      // Create recent achievements (empty for now)
      const achievements: RecentAchievement[] = []

      // Calculate goal progress
      const goalProgress = {
        weekly: {
          target: 3,
          current: 0,
          percentage: 0,
        },
        monthly: {
          target: 12,
          current: 0,
          percentage: 0,
        },
      }

      const result: DashboardData = {
        user: user,
        stats: stats,
        recentSessions: [],
        progressData: { 
          overall: [], 
          bySkill: {}, 
          byPosition: [], 
          confidence: [], 
          weeklyTrends: [] 
        },
        upcomingBookings,
        recommendations,
        achievements: achievements.slice(0, 5), // Show top 5 achievements
        goalProgress,
      }

      return result
    })

    const response: DashboardOverviewResponse = {
      success: true,
      data: dashboardData,
    }

    // Set cache headers for dashboard data (5 minutes)
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'private, max-age=300, stale-while-revalidate=60',
      }
    })

  } catch (error) {
    console.error("Error fetching dashboard overview:", error)
    
    const response: DashboardOverviewResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch dashboard overview"
    }

    return NextResponse.json(response, { status: 500 })
  }
}

// Alternative approach: Direct database queries (more efficient)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Simplified approach - return basic dashboard data directly
    console.log("POST method called - returning basic data")
    
    // Get user with profile using raw SQL (same as GET method)
    const users = await db.$queryRaw<Array<{
      id: string
      name: string
      email: string
      profile_id: string | null
      profile_firstName: string | null
      profile_lastName: string | null
      profile_position: string | null
      profile_trainingLevel: string | null
    }>>`
      SELECT 
        u.id, u.name, u.email,
        p.id as profile_id,
        p."firstName" as profile_firstName,
        p."lastName" as profile_lastName,
        p.position as profile_position,
        p."trainingLevel" as profile_trainingLevel
      FROM "users" u
      LEFT JOIN "profiles" p ON u.id = p."userId"
      WHERE u.id = ${userId}
      LIMIT 1
    `

    const userWithProfile = users[0]

    if (!userWithProfile) {
      throw new Error("User not found")
    }

    // Transform the raw SQL result to match expected format
    const user = {
      id: userWithProfile.id,
      name: userWithProfile.name,
      email: userWithProfile.email,
      profile: userWithProfile.profile_id ? {
        id: userWithProfile.profile_id,
        firstName: userWithProfile.profile_firstName || '',
        lastName: userWithProfile.profile_lastName || '',
        position: userWithProfile.profile_position || 'GENERAL',
        trainingLevel: userWithProfile.profile_trainingLevel || 'BEGINNER',
        onboardingCompleted: false,
      } : null
    }

    const dashboardData = {
      user: user,
      stats: {
        totalSessions: 0,
        completedSessions: 0,
        totalWatchTime: 0,
        averageRating: 0,
        certificatesEarned: 0,
        currentStreak: 0,
        lastActive: new Date(),
        improvementRate: 0,
        successRate: 85,
        confidenceGrowth: 0,
        positionRank: 1,
        positionProgress: 0,
        thisWeekSessions: 0,
        thisMonthSessions: 0,
        weeklyGoal: 3,
        monthlyGoal: 12,
      },
      recentSessions: [],
      progressData: { 
        overall: [], 
        bySkill: {}, 
        byPosition: [], 
        confidence: [], 
        weeklyTrends: [] 
      },
      upcomingBookings: [],
      recommendations: [],
      achievements: [],
      goalProgress: {
        weekly: {
          target: 3,
          current: 0,
          percentage: 0,
        },
        monthly: {
          target: 12,
          current: 0,
          percentage: 0,
        },
      },
    }

    return NextResponse.json({
      success: true,
      data: dashboardData,
    })

  } catch (error) {
    console.error("Error fetching dashboard overview (direct):", error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch dashboard overview"
    }, { status: 500 })
  }
}
