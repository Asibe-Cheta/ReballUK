import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth-utils"
import { db, withRetry } from "@/lib/db"
import type { SessionData, DashboardSessionsResponse } from "@/types/dashboard"

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
    const limit = parseInt(searchParams.get("limit") || "10")
    const offset = parseInt(searchParams.get("offset") || "0")

    // Fetch recent sessions with full details
    const recentSessions = await withRetry(async () => {
      return await db.progress.findMany({
        where: { userId },
        include: {
          course: {
            select: {
              id: true,
              name: true,
              type: true,
              position: true,
            }
          },
          video: {
            select: {
              id: true,
              title: true,
              duration: true,
              videoUrl: true,
              thumbnailUrl: true,
              analysisType: true,
            }
          }
        },
        orderBy: { lastAccessedAt: 'desc' },
        take: limit,
        skip: offset,
      })
    })

    // Transform progress data to session data format - Fixed type casting for TrainingLevel enum
    const sessionData: SessionData[] = recentSessions.map(progress => {
      // Determine session type based on video analysis type or default
      const sessionType = progress.video?.analysisType as "SISW" | "TAV" | undefined || "PRACTICE"
      
      // Calculate performance score based on completion and rating
      const performanceScore = progress.rating 
        ? Math.round((progress.completionPercentage + (progress.rating * 20)) / 2)
        : progress.completionPercentage

      // Generate improvement areas based on performance
      const improvementAreas: string[] = []
      if (progress.completionPercentage < 80) {
        improvementAreas.push("completion-rate")
      }
      if ((progress.rating || 0) < 4) {
        improvementAreas.push("technique-refinement")
      }
      if (progress.timeSpent < (progress.video?.duration || 300)) {
        improvementAreas.push("focus-duration")
      }

      // Add position-specific improvement areas
      if (progress.course.position) {
        switch (progress.course.position) {
          case "STRIKER":
            if (performanceScore < 75) improvementAreas.push("finishing", "positioning")
            break
          case "WINGER":
            if (performanceScore < 75) improvementAreas.push("crossing", "pace")
            break
          case "CAM":
            if (performanceScore < 75) improvementAreas.push("vision", "passing")
            break
          case "DEFENDER":
            if (performanceScore < 75) improvementAreas.push("tackling", "positioning")
            break
          case "GOALKEEPER":
            if (performanceScore < 75) improvementAreas.push("shot-stopping", "distribution")
            break
          default:
            if (performanceScore < 75) improvementAreas.push("technical-skills")
        }
      }

      return {
        id: progress.id,
        date: progress.lastAccessedAt,
        type: sessionType,
        title: progress.video?.title || progress.course.name,
        duration: progress.timeSpent,
        rating: progress.rating || undefined,
        feedback: progress.feedback || undefined,
        performanceScore,
        improvementAreas: improvementAreas.slice(0, 3), // Limit to 3 main areas
        completionPercentage: progress.completionPercentage,
        videoUrl: progress.video?.videoUrl,
        thumbnailUrl: progress.video?.thumbnailUrl,
        course: {
          id: progress.course.id,
          title: progress.course.name,
          level: progress.course.type as "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "PROFESSIONAL",
          position: progress.course.position as "STRIKER" | "WINGER" | "CAM" | "FULLBACK" | "MIDFIELDER" | "DEFENDER" | "GOALKEEPER" | "OTHER",
        }
      }
    })

    const response: DashboardSessionsResponse = {
      success: true,
      data: sessionData,
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error("Error fetching dashboard sessions:", error)
    
    const response: DashboardSessionsResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch dashboard sessions"
    }

    return NextResponse.json(response, { status: 500 })
  }
}

// POST /api/dashboard/sessions - Add feedback to a session
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
    const { progressId, rating, feedback } = body

    if (!progressId) {
      return NextResponse.json(
        { success: false, error: "Progress ID is required" },
        { status: 400 }
      )
    }

    // Update progress with feedback
    const updatedProgress = await withRetry(async () => {
      return await db.progress.update({
        where: { 
          id: progressId,
          userId: user.id, // Ensure user owns this progress
        },
        data: {
          rating: rating ? Math.max(1, Math.min(5, rating)) : undefined,
          feedback: feedback || undefined,
          updatedAt: new Date(),
        },
        include: {
          course: {
            select: {
              id: true,
              name: true,
              type: true,
              position: true,
            }
          },
          video: {
            select: {
              title: true,
              analysisType: true,
            }
          }
        }
      })
    })

    return NextResponse.json({
      success: true,
      data: {
        id: updatedProgress.id,
        rating: updatedProgress.rating,
        feedback: updatedProgress.feedback,
        message: "Session feedback updated successfully"
      }
    })

  } catch (error) {
    console.error("Error updating session feedback:", error)
    
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return NextResponse.json(
        { success: false, error: "Session not found or access denied" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to update session feedback"
      },
      { status: 500 }
    )
  }
}
