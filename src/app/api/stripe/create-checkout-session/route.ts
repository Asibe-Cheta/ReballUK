import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { createCourseCheckoutSession, createBookingCheckoutSession } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { type, courseId, bookingId } = body

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Handle course purchase
    if (type === 'course' && courseId) {
      // courseId can be either UUID or slug
      const course = await prisma.course.findFirst({
        where: { 
          OR: [
            { id: courseId },
            { slug: courseId }
          ]
        }
      })

      if (!course) {
        return NextResponse.json(
          { success: false, error: 'Course not found' },
          { status: 404 }
        )
      }

      if (!course.available) {
        return NextResponse.json(
          { success: false, error: 'Course is not available' },
          { status: 400 }
        )
      }

      const checkoutSession = await createCourseCheckoutSession({
        courseId: course.id,
        courseTitle: course.name,
        coursePrice: Number(course.price_121), // 1v1 course price
        userId: user.id,
        userEmail: user.email,
        successUrl: `${baseUrl}/dashboard?payment=success&course_id=${course.slug || course.id}`,
        cancelUrl: `${baseUrl}/programs/${course.slug || courseId}?payment=cancelled`,
        metadata: {
          courseLevel: course.type || '',
          position: course.position || '',
          slug: course.slug || ''
        }
      })

      return NextResponse.json({
        success: true,
        sessionId: checkoutSession.id,
        url: checkoutSession.url
      })
    }

    // Handle booking/session purchase
    if (type === 'booking' && bookingId) {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { course: true }
      })

      if (!booking) {
        return NextResponse.json(
          { success: false, error: 'Booking not found' },
          { status: 404 }
        )
      }

      if (booking.paymentStatus === 'PAID') {
        return NextResponse.json(
          { success: false, error: 'Booking already paid' },
          { status: 400 }
        )
      }

      const checkoutSession = await createBookingCheckoutSession({
        bookingId: booking.id,
        sessionType: booking.sessionType,
        position: booking.position || 'GENERAL',
        price: Number(booking.amount),
        userId: user.id,
        userEmail: user.email,
        successUrl: `${baseUrl}/dashboard?payment=success&booking_id=${booking.id}`,
        cancelUrl: `${baseUrl}/bookings?payment=cancelled`,
        metadata: {
          scheduledFor: booking.scheduledFor.toISOString()
        }
      })

      // Update booking with Stripe session ID
      await prisma.booking.update({
        where: { id: booking.id },
        data: { stripeSessionId: checkoutSession.id }
      })

      return NextResponse.json({
        success: true,
        sessionId: checkoutSession.id,
        url: checkoutSession.url
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid request type' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create checkout session' 
      },
      { status: 500 }
    )
  }
}

