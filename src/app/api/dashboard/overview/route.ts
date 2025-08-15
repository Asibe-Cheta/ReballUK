import { NextResponse } from "next/server"
import { auth } from "@/lib/auth-server"
import { Client } from "pg"
import type { 
  DashboardData, 
  DashboardOverviewResponse
} from "@/types/dashboard"
import type { User } from "@prisma/client"
import type { Profile } from "@prisma/client"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Use raw PostgreSQL client to avoid prepared statement conflicts
    const pgClient = new Client({
      connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
    })

    const dashboardData = await (async () => {
      console.log("=== DASHBOARD GET METHOD WITH RAW POSTGRES ===")
      
      try {
        await pgClient.connect()
        console.log("Connected to database successfully")

        // Get user with profile using raw PostgreSQL
        const userResult = await pgClient.query(`
          SELECT 
            u.id, u.name, u.email, u.role,
            p.id as profile_id,
            p."firstName" as profile_firstName,
            p."lastName" as profile_lastName,
            p.position as profile_position,
            p."trainingLevel" as profile_trainingLevel
          FROM "users" u
          LEFT JOIN "profiles" p ON u.id = p."userId"
          WHERE u.id = $1
          LIMIT 1
        `, [userId])

        const userWithProfile = userResult.rows.length > 0 ? userResult.rows[0] : null

        if (!userWithProfile) {
          throw new Error("User not found")
        }

        // Transform the raw SQL result to match expected format
        const user = {
          id: userWithProfile.id,
          name: userWithProfile.name,
          email: userWithProfile.email,
          role: userWithProfile.role || 'USER',
          profile: userWithProfile.profile_id ? {
            id: userWithProfile.profile_id,
            userId: userWithProfile.id,
            firstName: userWithProfile.profile_firstName || '',
            lastName: userWithProfile.profile_lastName || '',
            position: userWithProfile.profile_position || 'GENERAL',
            trainingLevel: userWithProfile.profile_trainingLevel || 'BEGINNER',
            dateOfBirth: null,
            preferredFoot: null,
            height: null,
            weight: null,
            bio: null,
            goals: [],
            confidenceRating: null,
            completedOnboarding: false,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          } : null
        }

        // Close the PostgreSQL connection
        await pgClient.end()
        console.log("PostgreSQL connection closed successfully")

        return user
      } catch (error) {
        console.error("Dashboard GET error:", error)
        try {
          await pgClient.end()
        } catch (disconnectError) {
          console.error("Failed to close PostgreSQL connection:", disconnectError)
        }
        throw error
      }
    })()

      

    const result: DashboardData = {
      user: {
        id: dashboardData.id,
        name: dashboardData.name,
        email: dashboardData.email,
        password: null,
        emailVerified: null,
        image: null,
        role: dashboardData.role || "USER",
        verificationToken: null,
        verificationExpires: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        profile: dashboardData.profile ? {
          ...dashboardData.profile,
          userId: dashboardData.id,
          dateOfBirth: dashboardData.profile.dateOfBirth || null,
          preferredFoot: dashboardData.profile.preferredFoot || null,
          height: dashboardData.profile.height || null,
          weight: dashboardData.profile.weight || null,
          bio: dashboardData.profile.bio || null,
          goals: dashboardData.profile.goals || [],
          confidenceRating: dashboardData.profile.confidenceRating || null,
          completedOnboarding: dashboardData.profile.completedOnboarding || false,
          isActive: dashboardData.profile.isActive !== undefined ? dashboardData.profile.isActive : true,
          createdAt: dashboardData.profile.createdAt || new Date(),
          updatedAt: dashboardData.profile.updatedAt || new Date(),
        } : null
      } as User & { profile: Profile },
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

    const response: DashboardOverviewResponse = {
      success: true,
      data: result,
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
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Use raw PostgreSQL client to avoid prepared statement conflicts (same as GET)
    console.log("POST method called - using raw PostgreSQL")
    
    const pgClient = new Client({
      connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
    })

    let user
    try {
      await pgClient.connect()
      console.log("POST: Connected to database successfully")

      // Get user with profile using raw PostgreSQL
      const userResult = await pgClient.query(`
        SELECT 
          u.id, u.name, u.email,
          p.id as profile_id,
          p."firstName" as profile_firstName,
          p."lastName" as profile_lastName,
          p.position as profile_position,
          p."trainingLevel" as profile_trainingLevel
        FROM "users" u
        LEFT JOIN "profiles" p ON u.id = p."userId"
        WHERE u.id = $1
        LIMIT 1
      `, [userId])

      const userWithProfile = userResult.rows.length > 0 ? userResult.rows[0] : null

      if (!userWithProfile) {
        throw new Error("User not found")
      }

      // Transform the raw SQL result to match expected format
      user = {
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

      await pgClient.end()
      console.log("POST: PostgreSQL connection closed successfully")
    } catch (error) {
      console.error("POST: Dashboard error:", error)
      try {
        await pgClient.end()
      } catch (disconnectError) {
        console.error("POST: Failed to close PostgreSQL connection:", disconnectError)
      }
      throw error
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
