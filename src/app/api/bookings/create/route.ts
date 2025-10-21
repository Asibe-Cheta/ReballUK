import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser()
    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { sessionType, position, date, time } = await request.json()

    // Validate required fields
    if (!sessionType || !position || !date || !time) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Parse the date and time
    const selectedDate = new Date(date)
    const [hours, minutes] = time.split(':').map(Number)
    selectedDate.setHours(hours, minutes, 0, 0)

    // Check if the time slot is still available
    const startOfDay = new Date(selectedDate)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(selectedDate)
    endOfDay.setHours(23, 59, 59, 999)

    const existingBooking = await prisma.booking.findFirst({
      where: {
        scheduledFor: {
          gte: startOfDay,
          lte: endOfDay
        },
        status: {
          in: ["PENDING", "CONFIRMED"]
        }
      }
    })

    if (existingBooking) {
      return NextResponse.json(
        { success: false, error: "Time slot is no longer available" },
        { status: 409 }
      )
    }

    // Get or create a course based on session type and position
    let course = await prisma.course.findFirst({
      where: {
        name: {
          contains: position,
          mode: 'insensitive'
        },
        available: true
      }
    })

    // If no specific course found, create a general one
    if (!course) {
      course = await prisma.course.create({
        data: {
          name: `${position} Training - ${sessionType === '1v1' ? 'Personal' : 'Group'}`,
          description: `${position} training session for ${sessionType === '1v1' ? 'individual' : 'group'} training`,
          type: "BEGINNER",
          position: position as string,
          durationWeeks: 1,
          price121: sessionType === '1v1' ? 75 : 25,
          priceGroup: sessionType === '1v1' ? 75 : 25,
          available: true
        }
      })
    }

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        courseId: course.id,
        sessionType: sessionType,
        position: position,
        status: "PENDING",
        scheduledFor: selectedDate,
        amount: sessionType === '1v1' ? 75 : 25,
        paymentStatus: "PENDING",
        notes: `Session Type: ${sessionType}, Position: ${position}`
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        booking: {
          id: booking.id,
          status: booking.status,
          scheduledFor: booking.scheduledFor,
          amount: booking.amount,
          sessionType: booking.sessionType,
          position: booking.position
        }
      }
    })

  } catch (error) {
    console.error("Create booking error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create booking" },
      { status: 500 }
    )
  }
}
