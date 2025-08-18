import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth-utils"
import { getFreshDbClient } from "@/lib/db"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const freshDb = getFreshDbClient()

    // Get confidence ratings from progress table
    await freshDb.$queryRaw`
      SELECT 
        p.rating as current_rating,
        p.feedback,
        p.created_at,
        c.title as scenario
      FROM progress p
      LEFT JOIN courses c ON p.course_id = c.id
      WHERE p.user_id = ${user.id}
        AND p.rating IS NOT NULL
      ORDER BY p.created_at DESC
      LIMIT 50
    `

    await freshDb.$disconnect()

    // For now, return mock data since we don't have a dedicated confidence table
    const mockRatings = [
      {
        id: "finishing",
        scenario: "1v1 Finishing",
        rating: Math.floor(Math.random() * 40) + 30,
        previousRating: Math.floor(Math.random() * 40) + 30,
        icon: "Target",
        description: "Confidence in scoring when 1v1 with goalkeeper",
        color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      },
      {
        id: "dribbling",
        scenario: "1v1 Dribbling",
        rating: Math.floor(Math.random() * 40) + 30,
        previousRating: Math.floor(Math.random() * 40) + 30,
        icon: "Zap",
        description: "Confidence in beating defenders 1v1",
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      },
      {
        id: "crossing",
        scenario: "Crossing & Delivery",
        rating: Math.floor(Math.random() * 40) + 30,
        previousRating: Math.floor(Math.random() * 40) + 30,
        icon: "Eye",
        description: "Confidence in delivering accurate crosses",
        color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
      },
      {
        id: "defending",
        scenario: "1v1 Defending",
        rating: Math.floor(Math.random() * 40) + 30,
        previousRating: Math.floor(Math.random() * 40) + 30,
        icon: "Shield",
        description: "Confidence in stopping attackers 1v1",
        color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      },
      {
        id: "passing",
        scenario: "Passing Under Pressure",
        rating: Math.floor(Math.random() * 40) + 30,
        previousRating: Math.floor(Math.random() * 40) + 30,
        icon: "Users",
        description: "Confidence in accurate passing when pressured",
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      },
      {
        id: "shooting",
        scenario: "Long Range Shooting",
        rating: Math.floor(Math.random() * 40) + 30,
        previousRating: Math.floor(Math.random() * 40) + 30,
        icon: "Star",
        description: "Confidence in scoring from distance",
        color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400"
      }
    ]

    return NextResponse.json(mockRatings)

  } catch (error) {
    console.error("Error fetching confidence ratings:", error)
    return NextResponse.json(
      { error: "Failed to fetch confidence ratings" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { ratings } = body

    const freshDb = getFreshDbClient()

    // Store confidence ratings in progress table
    // For now, we'll create a mock entry since we don't have a dedicated confidence table
    await freshDb.progress.create({
      data: {
        userId: user.id,
        courseId: "mock-confidence-course", // You might want to create a dedicated course for confidence ratings
        sessionType: "confidence-assessment",
        successRate: 0.0,
        confidence: Math.round(ratings.reduce((sum: number, rating: Record<string, unknown>) => sum + (rating.rating as number), 0) / ratings.length),
        duration: 0,
        completionPercentage: 100,
        timeSpent: 0,
        isCompleted: true,
        rating: ratings.reduce((sum: number, rating: Record<string, unknown>) => sum + (rating.rating as number), 0) / ratings.length,
        feedback: JSON.stringify(ratings)
      }
    })

    await freshDb.$disconnect()

    return NextResponse.json({ 
      success: true, 
      message: "Confidence ratings saved successfully" 
    })

  } catch (error) {
    console.error("Error saving confidence ratings:", error)
    return NextResponse.json(
      { error: "Failed to save confidence ratings" },
      { status: 500 }
    )
  }
}
