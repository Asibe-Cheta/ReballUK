import { NextResponse } from "next/server"
import { auth } from "@/lib/auth-server"
import { db, withRetry } from "@/lib/db"
import { dashboardUtils } from "@/types/dashboard"
import type { UserStats, DashboardStatsResponse } from "@/types/dashboard"

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

    // Fetch comprehensive user statistics
    const stats = await withRetry(async () => {
      // Get profile first
      const profile = await db.profile.findUnique({
        where: { userId },
        select: {
          position: true,
          trainingLevel: true,
          confidenceRating: true,
        }
      })

      const [
        // Basic counts
        totalBookings,
        completedBookings,
        totalProgress,
        progressData,
        certificates,
        
        // Recent data for trends
        recentSessions,
        thisWeekSessions,
        thisMonthSessions,
        
        // Performance metrics
        allUserProgress,
      ] = await Promise.all([
        // Total sessions (bookings)
        db.booking.count({
          where: { userId }
        }),
        
        // Completed sessions
        db.booking.count({
          where: { 
            userId,
            status: "COMPLETED"
          }
        }),
        
        // Total progress entries
        db.progress.count({
          where: { userId }
        }),
        
        // Progress data for calculations
        db.progress.findMany({
          where: { userId },
          select: {
            timeSpent: true,
            rating: true,
            lastAccessedAt: true,
            completionPercentage: true,
            isCompleted: true,
            createdAt: true,
          },
          orderBy: { lastAccessedAt: 'desc' },
          take: 50, // Last 50 for trend analysis
        }),
        
        // Certificates earned
        db.certificate.count({
          where: { 
            userId,
            isActive: true
          }
        }),
        

        
        // Recent sessions for performance calculation
        db.progress.findMany({
          where: { 
            userId,
            lastAccessedAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
            }
          },
          include: {
            course: {
              select: {
                title: true,
                level: true,
                position: true,
              }
            },
            video: {
              select: {
                title: true,
                duration: true,
                analysisType: true,
              }
            }
          },
          orderBy: { lastAccessedAt: 'desc' },
          take: 20,
        }),
        
        // This week's sessions
        db.progress.count({
          where: {
            userId,
            lastAccessedAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
          }
        }),
        
        // This month's sessions
        db.progress.count({
          where: {
            userId,
            lastAccessedAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
          }
        }),
        
        // All user progress for position ranking
        db.progress.findMany({
          where: {
            user: {
              profile: {
                position: profile?.position || "OTHER"
              }
            }
          },
          select: {
            userId: true,
            completionPercentage: true,
            rating: true,
          }
        }),
      ])

      // Calculate total watch time
      const totalWatchTime = progressData.reduce((total, p) => {
        return total + (p.timeSpent || 0)
      }, 0)

      // Calculate average rating
      const ratingsData = progressData.filter(p => p.rating !== null && p.rating !== undefined)
      const averageRating = ratingsData.length > 0
        ? ratingsData.reduce((sum, p) => sum + (p.rating || 0), 0) / ratingsData.length
        : 0

      // Calculate last active date
      const lastActive = progressData.length > 0
        ? new Date(Math.max(...progressData.map(p => new Date(p.lastAccessedAt).getTime())))
        : new Date()

      // Calculate current streak
      const currentStreak = calculateStreakFromProgress(progressData.map(p => ({ lastAccessedAt: p.lastAccessedAt })))

      // Calculate improvement rate
      const progressPoints = progressData.map(p => ({
        date: p.lastAccessedAt.toISOString(),
        value: p.completionPercentage,
        metric: "performance" as const
      }))
      const improvementRate = dashboardUtils.calculateImprovementRate(progressPoints)

      // Calculate success rate
      const sessionData = recentSessions.map(s => ({
        id: s.id,
        date: s.lastAccessedAt,
        type: (s.video?.analysisType || "PRACTICE") as "SISW" | "TAV" | "PRACTICE" | "ANALYSIS",
        title: s.video?.title || s.course.title,
        duration: s.timeSpent,
        rating: s.rating,
        feedback: "",
        performanceScore: s.completionPercentage,
        improvementAreas: [],
        completionPercentage: s.completionPercentage,
        course: {
          id: s.courseId,
          title: s.course.title,
          level: s.course.level as "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "PROFESSIONAL",
          position: s.course.position as "STRIKER" | "WINGER" | "CAM" | "FULLBACK" | "MIDFIELDER" | "DEFENDER" | "GOALKEEPER" | "OTHER",
        }
      }))
      const successRate = dashboardUtils.calculateSuccessRate(sessionData)

      // Calculate confidence growth (simplified)
      const recentConfidence = ratingsData.slice(0, 10)
      const olderConfidence = ratingsData.slice(10, 20)
      const confidenceGrowth = recentConfidence.length > 0 && olderConfidence.length > 0
        ? ((recentConfidence.reduce((sum, p) => sum + (p.rating || 0), 0) / recentConfidence.length) -
           (olderConfidence.reduce((sum, p) => sum + (p.rating || 0), 0) / olderConfidence.length)) * 20
        : 0

      // Calculate position rank (simplified)
      const usersByPosition = allUserProgress.reduce((acc, p) => {
        if (!acc[p.userId]) {
          acc[p.userId] = {
            totalScore: 0,
            count: 0,
          }
        }
        acc[p.userId].totalScore += (p.completionPercentage + (p.rating || 0) * 20)
        acc[p.userId].count += 1
        return acc
      }, {} as Record<string, { totalScore: number; count: number }>)

      const averageScores = Object.entries(usersByPosition).map(([id, data]) => ({
        userId: id,
        avgScore: data.totalScore / data.count
      })).sort((a, b) => b.avgScore - a.avgScore)

      const userRank = averageScores.findIndex(u => u.userId === userId) + 1

      // Calculate position progress (percentage of skills mastered)
      const completedSessions = progressData.filter(p => p.isCompleted).length
      const positionProgress = totalProgress > 0 
        ? Math.min(100, (completedSessions / Math.max(totalProgress, 1)) * 100)
        : 0

      // Set realistic goals based on user level
      const weeklyGoal = profile?.trainingLevel === "BEGINNER" ? 2 : 
                        profile?.trainingLevel === "INTERMEDIATE" ? 3 : 4
      const monthlyGoal = weeklyGoal * 4

      const userStats: UserStats = {
        totalSessions: totalBookings,
        completedSessions: completedBookings,
        totalWatchTime,
        averageRating: Math.round(averageRating * 100) / 100,
        certificatesEarned: certificates,
        currentStreak,
        lastActive,
        improvementRate,
        successRate,
        confidenceGrowth: Math.round(confidenceGrowth),
        positionRank: userRank || 1,
        positionProgress: Math.round(positionProgress),
        thisWeekSessions,
        thisMonthSessions,
        weeklyGoal,
        monthlyGoal,
      }

      return userStats
    })

    const response: DashboardStatsResponse = {
      success: true,
      data: stats,
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    
    const response: DashboardStatsResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch dashboard stats"
    }

    return NextResponse.json(response, { status: 500 })
  }
}

// Helper function to calculate streak - Fixed type casting for Vercel deployment
function calculateStreakFromProgress(progressData: Array<{ lastAccessedAt: Date }>): number {
  if (progressData.length === 0) return 0

  const sortedData = progressData
    .map(p => new Date(p.lastAccessedAt))
    .sort((a, b) => b.getTime() - a.getTime())

  let streak = 0
      const currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)

  for (const sessionDate of sortedData) {
    const sessionDay = new Date(sessionDate)
    sessionDay.setHours(0, 0, 0, 0)

    const diffDays = Math.floor((currentDate.getTime() - sessionDay.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === streak) {
      streak++
    } else if (diffDays === streak + 1) {
      // Allow for 1 day gap
      streak++
      currentDate.setTime(currentDate.getTime() - 24 * 60 * 60 * 1000)
    } else {
      break
    }
  }

  return Math.max(0, streak - 1) // Subtract 1 to account for starting from today
}
