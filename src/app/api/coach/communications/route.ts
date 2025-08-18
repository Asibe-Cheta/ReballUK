import { NextRequest, NextResponse } from "next/server"
import { requireCoach } from "@/lib/coach-auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await requireCoach()
    
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const userId = searchParams.get("userId")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      coachId: session.id
    }

    if (type) {
      where.type = type.toUpperCase()
    }

    if (userId) {
      where.userId = userId
    }

    // Fetch communications with pagination
    const [communications, total] = await Promise.all([
      prisma.communication.findMany({
        where,
        include: {
          user: {
            include: {
              profile: true
            }
          }
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      }),
      prisma.communication.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: communications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching communications:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch communications" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireCoach()
    
    const body = await request.json()
    const { type, userId, subject, content, recipients } = body

    let communications = []

    if (recipients === "all" || recipients === "active") {
      // Send to all users or active users
      const where: any = { role: "USER" }
      if (recipients === "active") {
        where.profile = { isActive: true }
      }

      const users = await prisma.user.findMany({
        where,
        select: { id: true }
      })

                communications = await Promise.all(
            users.map(user =>
              prisma.communication.create({
                data: {
                  coachId: session.id,
                  userId: user.id,
                  type: type.toUpperCase(),
                  subject,
                  content
                }
              })
            )
          )
    } else if (userId) {
      // Send to specific user
      const communication = await prisma.communication.create({
        data: {
          coachId: session.id,
          userId,
          type: type.toUpperCase(),
          subject,
          content
        }
      })
      communications = [communication]
    } else {
      // Broadcast message (no specific user)
      const communication = await prisma.communication.create({
        data: {
          coachId: session.id,
          type: type.toUpperCase(),
          subject,
          content
        }
      })
      communications = [communication]
    }

    return NextResponse.json({
      success: true,
      data: communications,
      message: `Message sent to ${communications.length} recipient(s)`
    })
  } catch (error) {
    console.error("Error sending communication:", error)
    return NextResponse.json(
      { success: false, error: "Failed to send communication" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireCoach()
    
    const body = await request.json()
    const { communicationId, isRead, isArchived } = body

    // Update communication
    const communication = await prisma.communication.update({
      where: { id: communicationId },
      data: {
        isRead,
        isArchived
      },
      include: {
        user: {
          include: {
            profile: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: communication
    })
  } catch (error) {
    console.error("Error updating communication:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update communication" },
      { status: 500 }
    )
  }
}
