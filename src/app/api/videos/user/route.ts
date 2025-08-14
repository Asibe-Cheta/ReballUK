import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-server"
import { getFreshDbClient } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const analysisType = searchParams.get("analysisType")
    const position = searchParams.get("position")
    const search = searchParams.get("search")
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    const prisma = getFreshDbClient()

    // Build where clause
    const where: any = {
      userId: session.user.id
    }

    if (analysisType) {
      where.analysisType = analysisType
    }

    if (position) {
      where.position = position
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { has: search } }
      ]
    }

    // Build order by clause
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    // Fetch videos with pagination
    const videos = await prisma.video.findMany({
      where,
      orderBy,
      include: {
        session: {
          select: {
            id: true,
            sessionType: true,
            position: true,
            scheduledAt: true
          }
        }
      }
    })

    // Transform videos for frontend
    const transformedVideos = videos.map(video => ({
      id: video.id,
      title: video.title,
      description: video.description,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl,
      duration: video.duration,
      analysisType: video.analysisType,
      position: video.position,
      tags: video.tags,
      viewCount: video.viewCount,
      createdAt: video.createdAt,
      session: video.session ? {
        id: video.session.id,
        sessionType: video.session.sessionType,
        position: video.session.position,
        scheduledAt: video.session.scheduledAt
      } : null
    }))

    return NextResponse.json({
      videos: transformedVideos,
      total: transformedVideos.length
    })

  } catch (error) {
    console.error("Error fetching user videos:", error)
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { videoId, viewCount } = body

    if (!videoId) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      )
    }

    const prisma = getFreshDbClient()

    // Update video view count or other metadata
    const updatedVideo = await prisma.video.update({
      where: {
        id: videoId,
        userId: session.user.id // Ensure user owns the video
      },
      data: {
        viewCount: viewCount ? { increment: 1 } : undefined
      }
    })

    return NextResponse.json({
      success: true,
      video: {
        id: updatedVideo.id,
        viewCount: updatedVideo.viewCount
      }
    })

  } catch (error) {
    console.error("Error updating video:", error)
    return NextResponse.json(
      { error: "Failed to update video" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const videoId = searchParams.get("videoId")

    if (!videoId) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      )
    }

    const prisma = getFreshDbClient()

    // Delete video from database
    await prisma.video.delete({
      where: {
        id: videoId,
        userId: session.user.id // Ensure user owns the video
      }
    })

    // Note: In a production environment, you would also delete the video from Cloudinary
    // This would require calling Cloudinary's delete API

    return NextResponse.json({
      success: true,
      message: "Video deleted successfully"
    })

  } catch (error) {
    console.error("Error deleting video:", error)
    return NextResponse.json(
      { error: "Failed to delete video" },
      { status: 500 }
    )
  }
}
