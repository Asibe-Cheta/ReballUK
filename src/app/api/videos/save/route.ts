import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth-utils"
import { getFreshDbClient } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      description,
      videoUrl,
      thumbnailUrl,
      duration,
      analysisType,
      position,
      tags,
      publicId,
      sessionId
    } = body

    if (!title || !videoUrl || !publicId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const prisma = getFreshDbClient()

    // Save video metadata to database
    const video = await prisma.video.create({
      data: {
        userId: user.id,
        courseId: null, // Videos can be standalone
        title,
        description: description || "",
        videoUrl,
        thumbnailUrl: thumbnailUrl || "",
        duration: duration || 0,
        videoType: analysisType || "SISW",
        analysisType: analysisType || "SISW",
        position: position || "OTHER",
        tags: tags || [],
        publicId,
        sessionId: sessionId || null,
        viewCount: 0,
        orderIndex: 0,
        isPreview: false
      }
    })

    return NextResponse.json({
      success: true,
      video: {
        id: video.id,
        title: video.title,
        videoUrl: video.videoUrl,
        thumbnailUrl: video.thumbnailUrl,
        duration: video.duration,
        analysisType: video.analysisType,
        position: video.position,
        createdAt: video.createdAt
      }
    })

  } catch (error) {
    console.error("Error saving video:", error)
    return NextResponse.json(
      { error: "Failed to save video" },
      { status: 500 }
    )
  }
}
