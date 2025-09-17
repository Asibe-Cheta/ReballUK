import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth-utils"
import { db, withRetry } from "@/lib/db"
import type { ProgressData, ProgressPoint, DashboardProgressResponse } from "@/types/dashboard"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userId = user.id
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get("timeframe") || "30d" // 7d, 30d, 90d, 1y
    const metricParam = searchParams.get("metric") || "performance" // performance, confidence, success_rate
    const metric: "confidence" | "success_rate" | "performance" | "skill_level" = (metricParam === "confidence" || metricParam === "success_rate" || metricParam === "performance" || metricParam === "skill_level") 
      ? metricParam as "confidence" | "success_rate" | "performance" | "skill_level"
      : "performance"

    // Calculate date range based on timeframe
    const now = new Date()
    const timeframeMap = {
      "7d": 7,
      "30d": 30,
      "90d": 90,
      "1y": 365,
    }
    const days = timeframeMap[timeframe as keyof typeof timeframeMap] || 30
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)

    // Fetch progress data for the specified timeframe
    const progressData = await withRetry(async () => {
      const [rawProgress, profile, weeklyData] = await Promise.all([
        // Raw progress data
        db.progress.findMany({
          where: {
            userId,
            lastAccessedAt: {
              gte: startDate,
            },
          },
          include: {
            course: {
              select: {
                position: true,
                level: true,
                tags: true,
              }
            },
            video: {
              select: {
                analysisType: true,
                tags: true,
              }
            }
          },
          orderBy: { lastAccessedAt: 'asc' },
        }),

        // User profile for position data
        db.profile.findUnique({
          where: { userId },
          select: {
            position: true,
            playingLevel: true,
          }
        }),

        // Weekly aggregated data
        db.$queryRaw<Array<{
          week: string,
          sessions_completed: number,
          average_rating: number,
          total_time: number,
          avg_completion: number,
        }>>`
          SELECT 
            DATE_TRUNC('week', last_accessed_at) as week,
            COUNT(*) as sessions_completed,
            COALESCE(AVG(rating), 0) as average_rating,
            SUM(time_spent) as total_time,
            AVG(completion_percentage) as avg_completion
          FROM progress 
          WHERE user_id = ${userId}
            AND last_accessed_at >= ${startDate}
          GROUP BY DATE_TRUNC('week', last_accessed_at)
          ORDER BY week ASC
        `
      ])

      return { rawProgress, profile, weeklyData }
    })

    const { rawProgress, profile, weeklyData } = progressData

    // Transform raw progress to progress points
    const overall: ProgressPoint[] = rawProgress.map((p) => {
      let value: number
      
      switch (metric) {
        case "confidence":
          value = (p.rating || 0) * 20 // Convert 1-5 rating to 0-100 scale
          break
        case "success_rate":
          // Calculate success based on completion and rating
          value = p.completionPercentage >= 80 && (p.rating || 0) >= 4 ? 100 : 0
          break
        case "performance":
        default:
          // Weighted combination of completion and rating
          value = p.rating 
            ? Math.round((p.completionPercentage + (p.rating * 20)) / 2)
            : p.completionPercentage
      }

      return {
        date: p.lastAccessedAt.toISOString().split('T')[0],
        value,
        metric,
      }
    })

    // Group by skill areas (based on course tags and video analysis type)
    const bySkill: Record<string, ProgressPoint[]> = {}
    rawProgress.forEach(p => {
      const skills = [
        ...(p.course.tags || []),
        ...(p.video?.tags || []),
        p.video?.analysisType || "general"
      ].filter(Boolean)

      skills.forEach(skill => {
        if (!bySkill[skill]) {
          bySkill[skill] = []
        }

        let value: number
        switch (metric) {
          case "confidence":
            value = (p.rating || 0) * 20
            break
          case "success_rate":
            value = p.completionPercentage >= 80 && (p.rating || 0) >= 4 ? 100 : 0
            break
          case "performance":
          default:
            value = p.rating 
              ? Math.round((p.completionPercentage + (p.rating * 20)) / 2)
              : p.completionPercentage
        }

        bySkill[skill].push({
          date: p.lastAccessedAt.toISOString().split('T')[0],
          value,
          metric,
          category: skill,
        })
      })
    })

    // Position-specific progress
    const byPosition: ProgressPoint[] = rawProgress
      .filter(p => p.course.position === profile?.position)
      .map(p => {
        let value: number
        switch (metric) {
          case "confidence":
            value = (p.rating || 0) * 20
            break
          case "success_rate":
            value = p.completionPercentage >= 80 && (p.rating || 0) >= 4 ? 100 : 0
            break
          case "performance":
          default:
            value = p.rating 
              ? Math.round((p.completionPercentage + (p.rating * 20)) / 2)
              : p.completionPercentage
        }

        return {
          date: p.lastAccessedAt.toISOString().split('T')[0],
          value,
          metric,
          category: profile?.position || "unknown",
        }
      })

    // Confidence-specific progress
    const confidence: ProgressPoint[] = rawProgress
      .filter(p => p.rating !== null && p.rating !== undefined)
      .map(p => ({
        date: p.lastAccessedAt.toISOString().split('T')[0],
        value: (p.rating || 0) * 20, // Convert to 0-100 scale
        metric: "confidence" as const,
      }))

    // Weekly trends with improvement calculations
    const weeklyTrends = weeklyData.map((week, index) => {
      const prevWeek = weeklyData[index - 1]
      const improvementScore = prevWeek 
        ? Math.round(((Number(week.avg_completion) - Number(prevWeek.avg_completion)) / Number(prevWeek.avg_completion)) * 100)
        : 0

      return {
        week: new Date(week.week).toISOString().split('T')[0],
        sessionsCompleted: Number(week.sessions_completed),
        averageRating: Math.round(Number(week.average_rating) * 100) / 100,
        totalTime: Number(week.total_time),
        improvementScore: Math.max(-100, Math.min(100, improvementScore)), // Cap between -100% and 100%
      }
    })

    const result: ProgressData = {
      overall,
      bySkill,
      byPosition,
      confidence,
      weeklyTrends,
    }

    const response: DashboardProgressResponse = {
      success: true,
      data: result,
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error("Error fetching dashboard progress:", error)
    
    const response: DashboardProgressResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch dashboard progress"
    }

    return NextResponse.json(response, { status: 500 })
  }
}

// POST /api/dashboard/progress - Record new progress entry
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { 
      courseId, 
      videoId, 
      completionPercentage, 
      timeSpent, 
      rating, 
      feedback 
    } = body

    if (!courseId || completionPercentage === undefined || timeSpent === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Create or update progress entry
    const progress = await withRetry(async () => {
      return await db.progress.upsert({
        where: {
          userId_courseId_videoId: {
            userId: user.id,
            courseId,
            videoId: videoId || null,
          }
        },
        update: {
          completionPercentage: Math.max(0, Math.min(100, completionPercentage)),
          timeSpent: Math.max(0, timeSpent),
          rating: rating ? Math.max(1, Math.min(5, rating)) : undefined,
          feedback: feedback || undefined,
          lastAccessedAt: new Date(),
          isCompleted: completionPercentage >= 100,
          updatedAt: new Date(),
        },
        create: {
          userId: user.id,
          courseId,
          videoId: videoId || null,
          sessionType: "PRACTICE",
          position: "GENERAL",
          duration: timeSpent,
          notes: feedback || "",
          successRate: completionPercentage,
          confidence: rating ? rating * 20 : 50,
          sessionDate: new Date(),
          completionPercentage: Math.max(0, Math.min(100, completionPercentage)),
          timeSpent: Math.max(0, timeSpent),
          rating: rating ? Math.max(1, Math.min(5, rating)) : undefined,
          feedback: feedback || undefined,
          lastAccessedAt: new Date(),
          isCompleted: completionPercentage >= 100,
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
            }
          }
        }
      })
    })

    return NextResponse.json({
      success: true,
      data: {
        id: progress.id,
        completionPercentage: progress.completionPercentage,
        timeSpent: progress.timeSpent,
        rating: progress.rating,
        isCompleted: progress.isCompleted,
        message: "Progress recorded successfully"
      }
    })

  } catch (error) {
    console.error("Error recording progress:", error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to record progress"
      },
      { status: 500 }
    )
  }
}
