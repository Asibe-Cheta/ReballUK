import { NextRequest, NextResponse } from "next/server"
import { requireCoach } from "@/lib/coach-auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await requireCoach()
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const sessionId = searchParams.get("sessionId")
    const type = searchParams.get("type")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      coachId: session.user.id
    }

    if (userId) {
      where.userId = userId
    }

    if (sessionId) {
      where.sessionId = sessionId
    }

    if (type) {
      where.type = type.toUpperCase()
    }

    // Fetch notes with pagination
    const [notes, total] = await Promise.all([
      prisma.coachNote.findMany({
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
      prisma.coachNote.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: notes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching notes:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch notes" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireCoach()
    
    const body = await request.json()
    const { userId, sessionId, title, content, type, isPrivate } = body

    // Create note
    const note = await prisma.coachNote.create({
      data: {
        coachId: session.user.id,
        userId,
        sessionId,
        title,
        content,
        type: type?.toUpperCase() || "GENERAL",
        isPrivate: isPrivate || false
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
      data: note
    })
  } catch (error) {
    console.error("Error creating note:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create note" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireCoach()
    
    const body = await request.json()
    const { noteId, title, content, type, isPrivate } = body

    // Update note
    const note = await prisma.coachNote.update({
      where: { id: noteId },
      data: {
        title,
        content,
        type: type?.toUpperCase(),
        isPrivate
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
      data: note
    })
  } catch (error) {
    console.error("Error updating note:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update note" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireCoach()
    
    const { searchParams } = new URL(request.url)
    const noteId = searchParams.get("noteId")

    if (!noteId) {
      return NextResponse.json(
        { success: false, error: "Note ID is required" },
        { status: 400 }
      )
    }

    // Delete note
    await prisma.coachNote.delete({
      where: { id: noteId }
    })

    return NextResponse.json({
      success: true,
      message: "Note deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting note:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete note" },
      { status: 500 }
    )
  }
}
