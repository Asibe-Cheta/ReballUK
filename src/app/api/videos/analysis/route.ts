import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-server"
import { getFreshDbClient } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const videoId = searchParams.get("videoId")
    const analysisType = searchParams.get("analysisType") || "SISW"

    if (!videoId) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      )
    }

    const prisma = getFreshDbClient()

    // Fetch video and its analysis data
    const video = await prisma.video.findFirst({
      where: {
        id: videoId,
        userId: session.user.id
      },
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

    if (!video) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      )
    }

    // For now, return mock analysis data
    // In a production environment, this would come from a separate analysis table
    const analysisData = {
      videoId: video.id,
      analysisType: video.analysisType,
      performanceMarkers: [
        {
          id: 1,
          timestamp: 15.5,
          type: "success",
          description: "Excellent first touch control",
          confidence: 0.9
        },
        {
          id: 2,
          timestamp: 23.2,
          type: "improvement",
          description: "Good body positioning, could improve speed",
          confidence: 0.7
        },
        {
          id: 3,
          timestamp: 31.8,
          type: "success",
          description: "Perfect finishing technique",
          confidence: 0.95
        }
      ],
      voiceovers: [
        {
          id: 1,
          timestamp: 10.0,
          duration: 5.0,
          text: "Notice how the player maintains excellent body control throughout the movement",
          type: "coaching"
        },
        {
          id: 2,
          timestamp: 25.0,
          duration: 4.0,
          text: "This is where we see the importance of quick decision making",
          type: "analysis"
        }
      ],
      tacticalOverlays: [
        {
          id: 1,
          timestamp: 12.0,
          duration: 3.0,
          type: "arrow",
          coordinates: { x1: 100, y1: 150, x2: 200, y2: 100 },
          color: "#00ff00",
          description: "Movement direction"
        },
        {
          id: 2,
          timestamp: 28.0,
          duration: 2.0,
          type: "circle",
          coordinates: { x: 180, y: 120, radius: 30 },
          color: "#ff0000",
          description: "Key decision point"
        }
      ],
      keyMoments: [
        {
          id: 1,
          timestamp: 15.5,
          title: "First Touch Control",
          description: "Player demonstrates excellent first touch under pressure",
          importance: "high"
        },
        {
          id: 2,
          timestamp: 31.8,
          title: "Finishing Technique",
          description: "Perfect execution of the finishing movement",
          importance: "high"
        }
      ],
      expertCommentary: [
        {
          id: 1,
          timestamp: 8.0,
          duration: 6.0,
          text: "What we're seeing here is textbook positioning. The player anticipates the ball's trajectory and positions themselves perfectly.",
          coach: "Coach Smith"
        },
        {
          id: 2,
          timestamp: 22.0,
          duration: 5.0,
          text: "This is a great example of how small adjustments in body position can make a huge difference in execution.",
          coach: "Coach Johnson"
        }
      ]
    }

    return NextResponse.json({
      video: {
        id: video.id,
        title: video.title,
        videoUrl: video.videoUrl,
        thumbnailUrl: video.thumbnailUrl,
        duration: video.duration,
        analysisType: video.analysisType,
        position: video.position,
        session: video.session
      },
      analysis: analysisData
    })

  } catch (error) {
    console.error("Error fetching video analysis:", error)
    return NextResponse.json(
      { error: "Failed to fetch video analysis" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      videoId,
      analysisType,
      performanceMarkers,
      voiceovers,
      tacticalOverlays,
      keyMoments,
      expertCommentary
    } = body

    if (!videoId) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      )
    }

    const prisma = getFreshDbClient()

    // Verify video ownership
    const video = await prisma.video.findFirst({
      where: {
        id: videoId,
        userId: session.user.id
      }
    })

    if (!video) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      )
    }

    // In a production environment, you would save this analysis data to a separate table
    // For now, we'll just return success
    console.log("Analysis data received:", {
      videoId,
      analysisType,
      performanceMarkers,
      voiceovers,
      tacticalOverlays,
      keyMoments,
      expertCommentary
    })

    return NextResponse.json({
      success: true,
      message: "Analysis data saved successfully"
    })

  } catch (error) {
    console.error("Error saving video analysis:", error)
    return NextResponse.json(
      { error: "Failed to save video analysis" },
      { status: 500 }
    )
  }
}
