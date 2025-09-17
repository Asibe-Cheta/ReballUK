import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-utils'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Check if user is admin
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get total users
    const totalUsers = await db.user.count({
      where: { role: 'USER' }
    })

    // Get completed profiles
    const completedProfiles = await db.profile.count({
      where: { welcomeCompleted: true }
    })

    // Get pending profiles
    const pendingProfiles = await db.profile.count({
      where: { welcomeCompleted: false }
    })

    // Get total bookings
    const totalBookings = await db.booking.count()

    // Get recent signups (last 7 days)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const recentSignups = await db.user.count({
      where: {
        role: 'USER',
        createdAt: { gte: weekAgo }
      }
    })

    // Calculate profile completion rate
    const profileCompletionRate = totalUsers > 0 
      ? Math.round((completedProfiles / totalUsers) * 100)
      : 0

    // Get average completion time (simplified calculation)
    const completedProfilesWithDates = await db.profile.findMany({
      where: { 
        welcomeCompleted: true,
        welcomeCompletedDate: { not: null }
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

    // Get top positions
    const positionStats = await db.profile.groupBy({
      by: ['position'],
      where: { position: { not: null } },
      _count: { position: true },
      orderBy: { _count: { position: 'desc' } },
      take: 5
    })

    const topPositions = positionStats.map(stat => ({
      position: stat.position || 'Unknown',
      count: stat._count.position
    }))

    // Get recent activity
    const recentProfiles = await db.profile.findMany({
      where: { welcomeCompleted: true },
      orderBy: { welcomeCompletedDate: 'desc' },
      take: 5,
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    })

    const recentBookings = await db.booking.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3,
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    })

    const recentUsers = await db.user.findMany({
      where: { role: 'USER' },
      orderBy: { createdAt: 'desc' },
      take: 2,
      select: { name: true, email: true, createdAt: true }
    })

    const recentActivity = [
      ...recentProfiles.map(profile => ({
        id: `profile-${profile.id}`,
        type: 'profile_completed' as const,
        user: profile.user.name || profile.user.email?.split('@')[0] || 'Unknown',
        timestamp: profile.welcomeCompletedDate?.toISOString() || profile.createdAt.toISOString()
      })),
      ...recentBookings.map(booking => ({
        id: `booking-${booking.id}`,
        type: 'booking_created' as const,
        user: booking.user.name || booking.user.email?.split('@')[0] || 'Unknown',
        timestamp: booking.createdAt.toISOString()
      })),
      ...recentUsers.map(user => ({
        id: `user-${user.email}`,
        type: 'user_registered' as const,
        user: user.name || user.email?.split('@')[0] || 'Unknown',
        timestamp: user.createdAt.toISOString()
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10)

    const stats = {
      totalUsers,
      completedProfiles,
      pendingProfiles,
      totalBookings,
      recentSignups,
      profileCompletionRate,
      averageCompletionTime,
      topPositions,
      recentActivity
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
