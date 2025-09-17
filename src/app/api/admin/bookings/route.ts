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
    const status = searchParams.get('status') || 'all'
    const sort = searchParams.get('sort') || 'newest'

    // Build where clause
    let whereClause: any = {}
    
    if (status !== 'all') {
      whereClause.status = status
    }

    // Build order by clause
    let orderBy: any = {}
    switch (sort) {
      case 'oldest':
        orderBy = { createdAt: 'asc' }
        break
      case 'scheduled':
        orderBy = { scheduledFor: 'asc' }
        break
      case 'player':
        orderBy = { user: { name: 'asc' } }
        break
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' }
        break
    }

    // Get bookings with related data
    const bookings = await db.booking.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        course: {
          select: {
            id: true,
            title: true,
            position: true,
            level: true
          }
        }
      },
      orderBy
    })

    // Transform the data to match our interface
    const transformedBookings = bookings.map(booking => ({
      id: booking.id,
      user: {
        id: booking.user.id,
        name: booking.user.name,
        email: booking.user.email
      },
      course: {
        id: booking.course.id,
        title: booking.course.title,
        position: booking.course.position,
        level: booking.course.level
      },
      scheduledFor: booking.scheduledFor.toISOString(),
      status: booking.status,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString()
    }))

    return NextResponse.json(transformedBookings)

  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
