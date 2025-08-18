import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth-utils"
import { getFreshDbClient } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get("timeRange") || "month"

    const freshDb = getFreshDbClient()

    // Calculate date range
    const now = new Date()
    let startDate: Date
    
    switch (timeRange) {
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "month":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case "quarter":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case "year":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(0) // All time
    }

    // Get user profile
    const profileResult = await freshDb.$queryRaw`
      SELECT p.position, p.training_level
      FROM profiles p
      WHERE p.user_id = ${user.id}
      LIMIT 1
    `

    const profile = Array.isArray(profileResult) ? profileResult[0] : null

    // Get booking statistics
    const bookingStats = await freshDb.$queryRaw`
      SELECT 
        COUNT(*) as total_sessions,
        COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as completed_sessions,
        SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) * 60 as total_minutes
      FROM bookings b
      WHERE b.user_id = ${user.id}
        AND b.booked_at >= ${startDate}
    `

    const stats = Array.isArray(bookingStats) ? bookingStats[0] : bookingStats

    // Get progress statistics
    const progressStats = await freshDb.$queryRaw`
      SELECT 
        AVG(completion_percentage) as avg_completion,
        AVG(rating) as avg_rating,
        COUNT(*) as total_progress_entries
      FROM progress p
      WHERE p.user_id = ${user.id}
        AND p.created_at >= ${startDate}
    `

    const progress = Array.isArray(progressStats) ? progressStats[0] : progressStats

    // Calculate success rate (mock calculation for now)
    const successRate = progress.avg_completion || 0
    const averageConfidence = progress.avg_rating || 0
    const totalTrainingHours = Math.round((stats.total_minutes || 0) / 60)
    const totalSessions = stats.total_sessions || 0

    // Calculate streaks (mock calculation)
    const currentStreak = Math.floor(Math.random() * 5) + 1
    const bestStreak = Math.max(currentStreak, Math.floor(Math.random() * 10) + 5)

    // Calculate improvement rate (mock calculation)
    const improvementRate = Math.floor(Math.random() * 20) + 5

    await freshDb.$disconnect()

    return NextResponse.json({
      totalSessions,
      successRate: Math.round(successRate),
      averageConfidence: Math.round(averageConfidence),
      totalTrainingHours,
      currentStreak,
      bestStreak,
      improvementRate,
      position: profile?.position || "Not Set",
      trainingLevel: profile?.training_level || "BEGINNER"
    })

  } catch (error) {
    console.error("Error fetching progress stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch progress statistics" },
      { status: 500 }
    )
  }
}
