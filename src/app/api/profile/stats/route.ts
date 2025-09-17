import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth-utils"
import { db, withRetry } from "@/lib/db"
import type { PlayerStats } from "@/types/profile"

// GET /api/profile/stats - Get user statistics
export async function GET() {
  try {
    // Authenticate user
    const user = await getCurrentUser()
    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Calculate user statistics
    const stats = await withRetry(async () => {
      // Get basic counts
      const [
        totalBookings,
        completedBookings,
        totalProgress,
        completedProgress,
        certificates,
        profile,
        progressData,
      ] = await Promise.all([
        // Total courses booked
        db.booking.count({
          where: { userId: user.id }
        }),
        
        // Completed courses
        db.booking.count({
          where: { 
            userId: user.id,
            status: "COMPLETED"
          }
        }),
        
        // Total progress entries
        db.progress.count({
          where: { userId: user.id }
        }),
        
        // Completed progress entries
        db.progress.count({
          where: { 
            userId: user.id,
            isCompleted: true
          }
        }),
        
        // Certificates earned
        db.certificate.count({
          where: { 
            userId: user.id,
            isActive: true
          }
        }),
        
        // User profile
        db.profile.findUnique({
          where: { userId: user.id }
        }),
        
        // Progress data for calculations
        db.progress.findMany({
          where: { userId: user.id },
          select: {
            timeSpent: true,
            rating: true,
            lastAccessedAt: true,
            completionPercentage: true,
          }
        })
      ])

      // Calculate total watch time
      const totalWatchTime = progressData.reduce((total, progress) => {
        return total + (progress.timeSpent || 0)
      }, 0)

      // Calculate average rating
      const ratingsData = progressData.filter(p => p.rating !== null)
      const averageRating = ratingsData.length > 0
        ? ratingsData.reduce((sum, p) => sum + (p.rating || 0), 0) / ratingsData.length
        : 0

      // Calculate current streak (simplified - days since last access)
      const lastActive = progressData.length > 0
        ? new Date(Math.max(...progressData.map(p => new Date(p.lastAccessedAt).getTime())))
        : new Date()

      const currentStreak = calculateStreak(lastActive)

      // Calculate overall progress percentage
      const progressPercentage = completedProgress > 0
        ? progressData.reduce((sum, p) => sum + (p.completionPercentage || 0), 0) / completedProgress
        : 0

      const playerStats: PlayerStats = {
        totalCourses: totalBookings,
        completedCourses: completedBookings,
        totalWatchTime,
        averageRating: Math.round(averageRating * 100) / 100,
        certificatesEarned: certificates,
        currentStreak,
        lastActive,
        progressPercentage: Math.round(progressPercentage),
        favoritePosition: profile?.position || "Not set",
         playingLevel: profile?.playingLevel || "Not set",
      }

      return playerStats
    })

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

// Helper function to calculate streak
function calculateStreak(lastActive: Date): number {
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - lastActive.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  // If last active was more than 2 days ago, streak is broken
  if (diffDays > 2) {
    return 0
  }
  
  // Simple streak calculation - in a real app, you'd store this in the database
  return diffDays === 0 ? 1 : diffDays === 1 ? 2 : 0
}
