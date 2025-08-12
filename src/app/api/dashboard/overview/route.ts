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
      // First get user with profile
      const userWithProfile = await db.user.findUnique({
        where: { id: userId },
        include: {
          profile: true,
        }
      })

      if (!userWithProfile || !userWithProfile.profile) {
        throw new Error("User profile not found")
      }

      // Fetch all dashboard data in parallel
      const [
        statsResponse,
        sessionsResponse,
        progressResponse,
        upcomingBookingsData,
        certificatesData,
        recentProgressData,
      ] = await Promise.all([
        // Stats data (reuse stats API logic)
        fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/dashboard/stats`, {
          headers: {
            'Authorization': `Bearer ${session.user.id}`, // Simple auth for internal calls
          }
        }).then(res => res.json()).catch(() => null),

        // Sessions data (reuse sessions API logic)
        fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/dashboard/sessions?limit=5`, {
          headers: {
            'Authorization': `Bearer ${session.user.id}`,
          }
        }).then(res => res.json()).catch(() => null),

        // Progress data (reuse progress API logic)
        fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/dashboard/progress?timeframe=30d`, {
          headers: {
            'Authorization': `Bearer ${session.user.id}`,
          }
        }).then(res => res.json()).catch(() => null),

        // Upcoming bookings
        db.booking.findMany({
          where: {
            userId,
            status: { in: ['PENDING', 'CONFIRMED'] },
            scheduledFor: {
              gte: new Date(),
            }
          },
          include: {
            course: {
              select: {
                title: true,
                level: true,
                position: true,
                duration: true,
                thumbnailUrl: true,
              }
            }
          },
          orderBy: { scheduledFor: 'asc' },
          take: 5,
        }),

        // Recent certificates
        db.certificate.findMany({
          where: {
            userId,
            isActive: true,
          },
          orderBy: { issuedAt: 'desc' },
          take: 5,
        }),

        // Recent progress for recommendations
        db.progress.findMany({
          where: { userId },
          include: {
            course: {
              select: {
                position: true,
                level: true,
                tags: true,
              }
            }
          },
          orderBy: { lastAccessedAt: 'desc' },
          take: 20,
        }),
      ])

      // Transform upcoming bookings
      const upcomingBookings: UpcomingBooking[] = upcomingBookingsData.map(booking => ({
        id: booking.id,
        courseId: booking.courseId,
        course: {
          title: booking.course.title,
          level: booking.course.level,
          position: booking.course.position,
          duration: booking.course.duration,
          thumbnailUrl: booking.course.thumbnailUrl,
        },
        scheduledFor: booking.scheduledFor!,
        status: booking.status,
        notes: booking.notes,
        isUrgent: dashboardUtils.isBookingUrgent(booking.scheduledFor!),
      }))

      // Generate training recommendations
      const recommendations: TrainingRecommendation[] = dashboardUtils.generateRecommendations(
        statsResponse?.data || {
          successRate: 0,
          currentStreak: 0,
          averageRating: 0,
          totalSessions: 0,
          completedSessions: 0,
          totalWatchTime: 0,
          certificatesEarned: 0,
          lastActive: new Date(),
          improvementRate: 0,
          confidenceGrowth: 0,
          positionRank: 1,
          positionProgress: 0,
          thisWeekSessions: 0,
          thisMonthSessions: 0,
          weeklyGoal: 3,
          monthlyGoal: 12,
        },
        userWithProfile.profile,
        sessionsResponse?.data || []
      )

      // Create recent achievements from certificates and milestones
      const achievements: RecentAchievement[] = []

      // Add certificate achievements
      certificatesData.forEach(cert => {
        const isNew = new Date().getTime() - new Date(cert.issuedAt).getTime() < 7 * 24 * 60 * 60 * 1000
        achievements.push({
          id: cert.id,
          type: "CERTIFICATE",
          title: cert.title,
          description: cert.description || "Achievement unlocked!",
          earnedAt: cert.issuedAt,
          badgeUrl: cert.badgeUrl,
          isNew,
        })
      })

      // Add milestone achievements based on stats
      if (statsResponse?.data) {
        const stats = statsResponse.data
        
        if (stats.currentStreak >= 7) {
          achievements.push({
            id: "streak-7",
            type: "STREAK",
            title: "Week Warrior",
            description: `${stats.currentStreak} day training streak!`,
            earnedAt: new Date(),
            value: stats.currentStreak,
            isNew: true,
          })
        }

        if (stats.completedSessions >= 10) {
          achievements.push({
            id: "sessions-10",
            type: "MILESTONE",
            title: "Training Veteran",
            description: `Completed ${stats.completedSessions} training sessions!`,
            earnedAt: new Date(),
            value: stats.completedSessions,
            isNew: stats.completedSessions % 10 === 0,
          })
        }

        if (stats.improvementRate > 20) {
          achievements.push({
            id: "improvement-high",
            type: "IMPROVEMENT",
            title: "Rapid Improver",
            description: `${stats.improvementRate}% improvement this month!`,
            earnedAt: new Date(),
            value: stats.improvementRate,
            isNew: true,
          })
        }
      }

      // Calculate goal progress
      const weeklyTarget = statsResponse?.data?.weeklyGoal || 3
      const monthlyTarget = statsResponse?.data?.monthlyGoal || 12
      const weeklyCurrent = statsResponse?.data?.thisWeekSessions || 0
      const monthlyCurrent = statsResponse?.data?.thisMonthSessions || 0

      const goalProgress = {
        weekly: {
          target: weeklyTarget,
          current: weeklyCurrent,
          percentage: Math.min(100, Math.round((weeklyCurrent / weeklyTarget) * 100)),
        },
        monthly: {
          target: monthlyTarget,
          current: monthlyCurrent,
          percentage: Math.min(100, Math.round((monthlyCurrent / monthlyTarget) * 100)),
        },
      }

      const result: DashboardData = {
        user: userWithProfile,
        stats: statsResponse?.data || {} as any,
        recentSessions: sessionsResponse?.data || [],
        progressData: progressResponse?.data || { 
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

    // Fetch all data directly from database in one transaction
    const dashboardData = await db.$transaction(async (tx) => {
      // Get user with profile
      const userWithProfile = await tx.user.findUnique({
        where: { id: userId },
        include: { profile: true }
      })

      if (!userWithProfile?.profile) {
        throw new Error("User profile not found")
      }

      // Get basic stats
      const [
        totalBookings,
        completedBookings,
        recentProgress,
        upcomingBookings,
        certificates,
        weeklyProgress,
        monthlyProgress,
      ] = await Promise.all([
        tx.booking.count({ where: { userId } }),
        tx.booking.count({ where: { userId, status: "COMPLETED" } }),
        tx.progress.findMany({
          where: { 
            userId,
            lastAccessedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
          },
          include: {
            course: { select: { title: true, level: true, position: true } },
            video: { select: { title: true, analysisType: true } }
          },
          orderBy: { lastAccessedAt: 'desc' },
          take: 10,
        }),
        tx.booking.findMany({
          where: {
            userId,
            status: { in: ['PENDING', 'CONFIRMED'] },
            scheduledFor: { gte: new Date() }
          },
          include: {
            course: {
              select: {
                title: true,
                level: true,
                position: true,
                duration: true,
                thumbnailUrl: true,
              }
            }
          },
          orderBy: { scheduledFor: 'asc' },
          take: 5,
        }),
        tx.certificate.findMany({
          where: { userId, isActive: true },
          orderBy: { issuedAt: 'desc' },
          take: 5,
        }),
        tx.progress.count({
          where: {
            userId,
            lastAccessedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
          }
        }),
        tx.progress.count({
          where: {
            userId,
            lastAccessedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
          }
        }),
      ])

      // Calculate stats
      const totalWatchTime = recentProgress.reduce((sum, p) => sum + p.timeSpent, 0)
      const avgRating = recentProgress.length > 0 
        ? recentProgress.reduce((sum, p) => sum + (p.rating || 0), 0) / recentProgress.length
        : 0

      const stats = {
        totalSessions: totalBookings,
        completedSessions: completedBookings,
        totalWatchTime,
        averageRating: Math.round(avgRating * 100) / 100,
        certificatesEarned: certificates.length,
        currentStreak: 0, // Calculate separately if needed
        lastActive: recentProgress[0]?.lastAccessedAt || new Date(),
        improvementRate: 0, // Calculate from progress trends
        successRate: dashboardUtils.calculateSuccessRate(
          recentProgress.map(p => ({
            id: p.id,
            date: p.lastAccessedAt,
            type: "PRACTICE" as const,
            title: p.course.title,
            duration: p.timeSpent,
            rating: p.rating,
            feedback: "",
            performanceScore: p.completionPercentage,
            improvementAreas: [],
            completionPercentage: p.completionPercentage,
            course: {
              id: p.courseId,
              title: p.course.title,
              level: p.course.level,
              position: p.course.position,
            }
          }))
        ),
        confidenceGrowth: 0, // Calculate from recent vs older progress
        positionRank: 1,
        positionProgress: Math.round((completedBookings / Math.max(totalBookings, 1)) * 100),
        thisWeekSessions: weeklyProgress,
        thisMonthSessions: monthlyProgress,
        weeklyGoal: 3,
        monthlyGoal: 12,
      }

      return {
        userWithProfile,
        stats,
        recentProgress,
        upcomingBookings,
        certificates,
      }
    })

    const result: DashboardData = {
      user: dashboardData.userWithProfile,
      stats: dashboardData.stats,
      recentSessions: dashboardData.recentProgress.slice(0, 5).map(p => ({
        id: p.id,
        date: p.lastAccessedAt,
        type: (p.video?.analysisType as any) || "PRACTICE",
        title: p.video?.title || p.course.title,
        duration: p.timeSpent,
        rating: p.rating,
        feedback: p.feedback,
        performanceScore: p.completionPercentage,
        improvementAreas: [],
        completionPercentage: p.completionPercentage,
        course: {
          id: p.courseId,
          title: p.course.title,
          level: p.course.level,
          position: p.course.position,
        }
      })),
      progressData: {
        overall: [],
        bySkill: {},
        byPosition: [],
        confidence: [],
        weeklyTrends: [],
      },
      upcomingBookings: dashboardData.upcomingBookings.map(b => ({
        id: b.id,
        courseId: b.courseId,
        course: {
          title: b.course.title,
          level: b.course.level,
          position: b.course.position,
          duration: b.course.duration,
          thumbnailUrl: b.course.thumbnailUrl,
        },
        scheduledFor: b.scheduledFor!,
        status: b.status,
        notes: b.notes,
        isUrgent: dashboardUtils.isBookingUrgent(b.scheduledFor!),
      })),
      recommendations: dashboardUtils.generateRecommendations(
        dashboardData.stats,
        dashboardData.userWithProfile.profile,
        []
      ),
      achievements: dashboardData.certificates.map(c => ({
        id: c.id,
        type: "CERTIFICATE" as const,
        title: c.title,
        description: c.description || "",
        earnedAt: c.issuedAt,
        badgeUrl: c.badgeUrl,
        isNew: new Date().getTime() - c.issuedAt.getTime() < 7 * 24 * 60 * 60 * 1000,
      })),
      goalProgress: {
        weekly: {
          target: 3,
          current: dashboardData.stats.thisWeekSessions,
          percentage: Math.min(100, Math.round((dashboardData.stats.thisWeekSessions / 3) * 100)),
        },
        monthly: {
          target: 12,
          current: dashboardData.stats.thisMonthSessions,
          percentage: Math.min(100, Math.round((dashboardData.stats.thisMonthSessions / 12) * 100)),
        },
      },
    }

    return NextResponse.json({
      success: true,
      data: result,
    })

  } catch (error) {
    console.error("Error fetching dashboard overview (direct):", error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch dashboard overview"
    }, { status: 500 })
  }
}
