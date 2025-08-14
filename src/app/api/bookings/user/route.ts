import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build where clause
    const whereClause: Record<string, any> = {
      userId: session.user.id
    }

    if (status) {
      whereClause.status = status
    }

    // Get user's bookings
    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            duration: true,
            level: true,
            position: true
          }
        }
      },
      orderBy: {
        scheduledFor: 'desc'
      },
      take: limit,
      skip: offset
    })

    // Get total count for pagination
    const totalCount = await prisma.booking.count({
      where: whereClause
    })

    // Format the response
    const formattedBookings = bookings.map(booking => ({
      id: booking.id,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      scheduledFor: booking.scheduledFor,
      completedAt: booking.completedAt,
      amount: booking.amount,
      notes: booking.notes,
      course: booking.course,
      createdAt: booking.createdAt
    }))

    return NextResponse.json({
      success: true,
      data: {
        bookings: formattedBookings,
        pagination: {
          total: totalCount,
          limit,
          offset,
          hasMore: offset + limit < totalCount
        }
      }
    })

  } catch (error) {
    console.error("Get user bookings error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch bookings" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { bookingId, action } = await request.json()

    if (!bookingId || !action) {
      return NextResponse.json(
        { success: false, error: "Booking ID and action are required" },
        { status: 400 }
      )
    }

    // Verify the booking belongs to the user
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId: session.user.id
      }
    })

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      )
    }

    let updatedBooking

    switch (action) {
      case 'cancel':
        // Check if booking can be cancelled (24 hours before)
        const bookingTime = new Date(booking.scheduledFor!)
        const now = new Date()
        const hoursUntilBooking = (bookingTime.getTime() - now.getTime()) / (1000 * 60 * 60)

        if (hoursUntilBooking < 24) {
          return NextResponse.json(
            { success: false, error: "Bookings can only be cancelled 24 hours in advance" },
            { status: 400 }
          )
        }

        updatedBooking = await prisma.booking.update({
          where: { id: bookingId },
          data: { status: "CANCELLED" },
          include: {
            course: {
              select: {
                title: true,
                duration: true
              }
            }
          }
        })
        break

      case 'complete':
        updatedBooking = await prisma.booking.update({
          where: { id: bookingId },
          data: { 
            status: "COMPLETED",
            completedAt: new Date()
          },
          include: {
            course: {
              select: {
                title: true,
                duration: true
              }
            }
          }
        })
        break

      default:
        return NextResponse.json(
          { success: false, error: "Invalid action" },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      data: {
        booking: {
          id: updatedBooking.id,
          status: updatedBooking.status,
          scheduledFor: updatedBooking.scheduledFor,
          completedAt: updatedBooking.completedAt,
          course: updatedBooking.course
        }
      }
    })

  } catch (error) {
    console.error("Update booking error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update booking" },
      { status: 500 }
    )
  }
}
