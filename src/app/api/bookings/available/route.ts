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

    const { date } = await request.json()

    if (!date) {
      return NextResponse.json(
        { success: false, error: "Date is required" },
        { status: 400 }
      )
    }

    const selectedDate = new Date(date)
    const startOfDay = new Date(selectedDate)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(selectedDate)
    endOfDay.setHours(23, 59, 59, 999)

    // Get existing bookings for the selected date
    const existingBookings = await prisma.booking.findMany({
      where: {
        scheduledFor: {
          gte: startOfDay,
          lte: endOfDay
        },
        status: {
          in: ["PENDING", "CONFIRMED"]
        }
      },
      select: {
        scheduledFor: true,
        status: true
      }
    })

    // Generate time slots from 9 AM to 8 PM
    const timeSlots = []
    for (let hour = 9; hour <= 20; hour++) {
      const timeString = `${hour.toString().padStart(2, '0')}:00`
      const slotTime = new Date(selectedDate)
      slotTime.setHours(hour, 0, 0, 0)

      // Check if this time slot is booked
      const isBooked = existingBookings.some(booking => {
        const bookingTime = new Date(booking.scheduledFor!)
        return bookingTime.getHours() === hour
      })

      timeSlots.push({
        id: timeString,
        time: timeString,
        available: !isBooked,
        bookedBy: isBooked ? "Booked" : undefined
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        date: selectedDate.toISOString(),
        timeSlots
      }
    })

  } catch (error) {
    console.error("Available time slots error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch available time slots" },
      { status: 500 }
    )
  }
}
