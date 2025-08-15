import { NextRequest, NextResponse } from "next/server"
import { requireCoach } from "@/lib/coach-auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    await requireCoach()
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const date = searchParams.get("date")
    const userId = searchParams.get("userId")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (status) {
      where.status = status.toUpperCase()
    }

    if (date) {
      const startDate = new Date(date)
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 1)
      where.scheduledFor = {
        gte: startDate,
        lt: endDate
      }
    }

    if (userId) {
      where.userId = userId
    }

    // Fetch sessions with pagination
    const [sessions, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          user: {
            include: {
              profile: true
            }
          },
          course: true,
          videos: {
            select: {
              id: true,
              title: true,
              videoType: true
            }
          }
        },
        orderBy: { scheduledFor: "desc" },
        skip,
        take: limit
      }),
      prisma.booking.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: sessions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching sessions:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch sessions" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireCoach()
    
    const body = await request.json()
    const { sessionId, status, notes } = body

    // Update session
    const session = await prisma.booking.update({
      where: { id: sessionId },
      data: {
        status: status?.toUpperCase(),
        notes
      },
      include: {
        user: {
          include: {
            profile: true
          }
        },
        course: true
      }
    })

    return NextResponse.json({
      success: true,
      data: session
    })
  } catch (error) {
    console.error("Error updating session:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update session" },
      { status: 500 }
    )
  }
}
