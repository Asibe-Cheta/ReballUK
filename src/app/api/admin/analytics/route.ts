import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-utils'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    // Check if user is admin
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '30d'

    // Calculate date range
    const now = new Date()
    let startDate = new Date()
    
    switch (timeRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      case 'all':
        startDate = new Date('2020-01-01') // Very early date
        break
    }

    // Get overview statistics
    const totalUsers = await db.user.count({
      where: { 
        role: 'USER',
        createdAt: { gte: startDate }
      }
    })

    const completedProfiles = await db.profile.count({
      where: { 
        welcomeCompleted: true,
        welcomeCompletedDate: { gte: startDate }
      }
    })

    const pendingProfiles = await db.profile.count({
      where: { 
        welcomeCompleted: false,
        createdAt: { gte: startDate }
      }
    })

    const completionRate = totalUsers > 0 ? Math.round((completedProfiles / totalUsers) * 100) : 0

    // Calculate average completion time
    const completedProfilesWithDates = await db.profile.findMany({
      where: { 
        welcomeCompleted: true,
        welcomeCompletedDate: { gte: startDate, not: null }
      },
      select: {
        createdAt: true,
        welcomeCompletedDate: true
      }
    })

    const averageCompletionTime = completedProfilesWithDates.length > 0
      ? Math.round(
          completedProfilesWithDates.reduce((acc, profile) => {
            if (profile.welcomeCompletedDate) {
              const diffTime = profile.welcomeCompletedDate.getTime() - profile.createdAt.getTime()
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
              return acc + diffDays
            }
            return acc
          }, 0) / completedProfilesWithDates.length
        )
      : 0

    // Position distribution
    const positionStats = await db.profile.groupBy({
      by: ['position'],
      where: { 
        position: { not: null },
        createdAt: { gte: startDate }
      },
      _count: { position: true },
      orderBy: { _count: { position: 'desc' } }
    })

    const positionDistribution = positionStats.map(stat => ({
      position: stat.position || 'Unknown',
      count: stat._count.position,
      percentage: totalUsers > 0 ? Math.round((stat._count.position / totalUsers) * 100) : 0
    }))

    // Playing level distribution
    const levelStats = await db.profile.groupBy({
      by: ['playingLevel'],
      where: { 
        playingLevel: { not: null },
        createdAt: { gte: startDate }
      },
      _count: { playingLevel: true },
      orderBy: { _count: { playingLevel: 'desc' } }
    })

    const levelDistribution = levelStats.map(stat => ({
      level: stat.playingLevel || 'Unknown',
      count: stat._count.playingLevel,
      percentage: totalUsers > 0 ? Math.round((stat._count.playingLevel / totalUsers) * 100) : 0
    }))

    // Geographic distribution
    const geographicStats = await db.profile.groupBy({
      by: ['postcode'],
      where: { 
        postcode: { not: null },
        createdAt: { gte: startDate }
      },
      _count: { postcode: true },
      orderBy: { _count: { postcode: 'desc' } },
      take: 20
    })

    const geographicDistribution = geographicStats.map(stat => ({
      postcode: stat.postcode || 'Unknown',
      count: stat._count.postcode
    }))

    // Training reasons
    const trainingReasonStats = await db.profile.groupBy({
      by: ['trainingReason'],
      where: { 
        trainingReason: { not: null },
        createdAt: { gte: startDate }
      },
      _count: { trainingReason: true },
      orderBy: { _count: { trainingReason: 'desc' } },
      take: 10
    })

    const trainingReasons = trainingReasonStats.map(stat => ({
      reason: stat.trainingReason || 'Not specified',
      count: stat._count.trainingReason
    }))

    // How they heard about REBALL
    const hearAboutStats = await db.profile.groupBy({
      by: ['hearAbout'],
      where: { 
        hearAbout: { not: null },
        createdAt: { gte: startDate }
      },
      _count: { hearAbout: true },
      orderBy: { _count: { hearAbout: 'desc' } },
      take: 10
    })

    const hearAboutSources = hearAboutStats.map(stat => ({
      source: stat.hearAbout || 'Not specified',
      count: stat._count.hearAbout
    }))

    // Consent statistics
    const socialMediaConsent = await db.profile.count({
      where: { 
        socialMediaConsent: true,
        createdAt: { gte: startDate }
      }
    })

    const marketingConsent = await db.profile.count({
      where: { 
        marketingConsent: true,
        createdAt: { gte: startDate }
      }
    })

    // Recent activity (simplified - last 7 days)
    const recentActivity = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      
      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)

      const registrations = await db.user.count({
        where: {
          role: 'USER',
          createdAt: { gte: date, lt: nextDate }
        }
      })

      const completions = await db.profile.count({
        where: {
          welcomeCompleted: true,
          welcomeCompletedDate: { gte: date, lt: nextDate }
        }
      })

      recentActivity.push({
        date: date.toISOString().split('T')[0],
        registrations,
        completions
      })
    }

    const analytics = {
      overview: {
        totalUsers,
        completedProfiles,
        pendingProfiles,
        completionRate,
        averageCompletionTime
      },
      positionDistribution,
      levelDistribution,
      completionTrend: [], // Could be implemented with more complex date grouping
      geographicDistribution,
      trainingReasons,
      hearAboutSources,
      consentStats: {
        socialMediaConsent,
        marketingConsent
      },
      recentActivity
    }

    return NextResponse.json(analytics)

  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
