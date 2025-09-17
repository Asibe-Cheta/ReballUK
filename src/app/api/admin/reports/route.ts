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
    const reportType = searchParams.get('type') || 'overview'

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
        startDate = new Date('2020-01-01')
        break
    }

    // Get user growth data
    const userGrowth = []
    const daysDiff = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const interval = Math.max(1, Math.floor(daysDiff / 30)) // Max 30 data points

    for (let i = 0; i < daysDiff; i += interval) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)
      date.setHours(0, 0, 0, 0)
      
      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + interval)

      const newUsers = await db.user.count({
        where: {
          role: 'USER',
          createdAt: { gte: date, lt: nextDate }
        }
      })

      const totalUsers = await db.user.count({
        where: {
          role: 'USER',
          createdAt: { lt: nextDate }
        }
      })

      userGrowth.push({
        date: date.toISOString().split('T')[0],
        newUsers,
        totalUsers
      })
    }

    // Get profile completion data
    const profileCompletions = []
    for (let i = 0; i < daysDiff; i += interval) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)
      date.setHours(0, 0, 0, 0)
      
      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + interval)

      const completions = await db.profile.count({
        where: {
          welcomeCompleted: true,
          welcomeCompletedDate: { gte: date, lt: nextDate }
        }
      })

      profileCompletions.push({
        date: date.toISOString().split('T')[0],
        completions
      })
    }

    // Get booking trends
    const bookingTrends = []
    for (let i = 0; i < daysDiff; i += interval) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)
      date.setHours(0, 0, 0, 0)
      
      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + interval)

      const bookings = await db.booking.count({
        where: {
          createdAt: { gte: date, lt: nextDate }
        }
      })

      const completed = await db.booking.count({
        where: {
          status: 'COMPLETED',
          updatedAt: { gte: date, lt: nextDate }
        }
      })

      bookingTrends.push({
        date: date.toISOString().split('T')[0],
        bookings,
        completed
      })
    }

    // Get position popularity
    const positionStats = await db.profile.groupBy({
      by: ['position'],
      where: { 
        position: { not: null },
        createdAt: { gte: startDate }
      },
      _count: { position: true },
      orderBy: { _count: { position: 'desc' } }
    })

    const totalWithPosition = positionStats.reduce((sum, stat) => sum + stat._count.position, 0)
    const positionPopularity = positionStats.map(stat => ({
      position: stat.position || 'Unknown',
      count: stat._count.position,
      percentage: totalWithPosition > 0 ? Math.round((stat._count.position / totalWithPosition) * 100) : 0
    }))

    // Get level distribution
    const levelStats = await db.profile.groupBy({
      by: ['playingLevel'],
      where: { 
        playingLevel: { not: null },
        createdAt: { gte: startDate }
      },
      _count: { playingLevel: true },
      orderBy: { _count: { playingLevel: 'desc' } }
    })

    const totalWithLevel = levelStats.reduce((sum, stat) => sum + stat._count.playingLevel, 0)
    const levelDistribution = levelStats.map(stat => ({
      level: stat.playingLevel || 'Unknown',
      count: stat._count.playingLevel,
      percentage: totalWithLevel > 0 ? Math.round((stat._count.playingLevel / totalWithLevel) * 100) : 0
    }))

    // Get geographic spread (simplified by postcode)
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

    const geographicSpread = geographicStats.map(stat => ({
      region: stat.postcode || 'Unknown',
      count: stat._count.postcode
    }))

    // Calculate completion rates
    const totalUsers = await db.user.count({
      where: { 
        role: 'USER',
        createdAt: { gte: startDate }
      }
    })

    const completedProfiles = await db.profile.count({
      where: { 
        welcomeCompleted: true,
        createdAt: { gte: startDate }
      }
    })

    const overallCompletionRate = totalUsers > 0 ? Math.round((completedProfiles / totalUsers) * 100) : 0

    // Completion rates by position
    const completionByPosition = []
    for (const position of positionStats) {
      const positionUsers = await db.profile.count({
        where: { 
          position: position.position,
          createdAt: { gte: startDate }
        }
      })

      const positionCompleted = await db.profile.count({
        where: { 
          position: position.position,
          welcomeCompleted: true,
          createdAt: { gte: startDate }
        }
      })

      completionByPosition.push({
        position: position.position || 'Unknown',
        rate: positionUsers > 0 ? Math.round((positionCompleted / positionUsers) * 100) : 0
      })
    }

    // Completion rates by level
    const completionByLevel = []
    for (const level of levelStats) {
      const levelUsers = await db.profile.count({
        where: { 
          playingLevel: level.playingLevel,
          createdAt: { gte: startDate }
        }
      })

      const levelCompleted = await db.profile.count({
        where: { 
          playingLevel: level.playingLevel,
          welcomeCompleted: true,
          createdAt: { gte: startDate }
        }
      })

      completionByLevel.push({
        level: level.playingLevel || 'Unknown',
        rate: levelUsers > 0 ? Math.round((levelCompleted / levelUsers) * 100) : 0
      })
    }

    // Engagement metrics (simplified)
    const totalBookings = await db.booking.count({
      where: { createdAt: { gte: startDate } }
    })

    const uniqueUsers = await db.booking.groupBy({
      by: ['userId'],
      where: { createdAt: { gte: startDate } },
      _count: { userId: true }
    })

    const repeatBookings = uniqueUsers.filter(user => user._count.userId > 1).length
    const repeatBookingRate = uniqueUsers.length > 0 ? Math.round((repeatBookings / uniqueUsers.length) * 100) : 0

    const reportData = {
      userGrowth,
      profileCompletions,
      bookingTrends,
      positionPopularity,
      levelDistribution,
      geographicSpread,
      completionRates: {
        overall: overallCompletionRate,
        byPosition: completionByPosition,
        byLevel: completionByLevel
      },
      engagementMetrics: {
        averageSessionTime: 60, // Placeholder - would need actual session data
        repeatBookings: repeatBookingRate,
        referralRate: 15 // Placeholder - would need referral tracking
      }
    }

    return NextResponse.json(reportData)

  } catch (error) {
    console.error('Error fetching report data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
