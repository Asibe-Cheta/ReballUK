import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth-utils"
import { getFreshDbClient } from "@/lib/db"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const freshDb = getFreshDbClient()

    // Get skill data from progress table grouped by course tags
    await freshDb.$queryRaw`
      SELECT 
        c.tags,
        AVG(p.completion_percentage) as avg_completion,
        AVG(p.rating) as avg_rating,
        COUNT(*) as total_attempts,
        MAX(p.created_at) as last_attempt
      FROM progress p
      LEFT JOIN courses c ON p.course_id = c.id
      WHERE p.user_id = ${user.id}
        AND p.completion_percentage > 0
      GROUP BY c.tags
      ORDER BY avg_completion DESC
    `

    await freshDb.$disconnect()

    // For now, return mock data since we need to map skills to specific scenarios
    const mockSkillData = [
      {
        skill: "1v1 Finishing",
        current: Math.floor(Math.random() * 40) + 30,
        previous: Math.floor(Math.random() * 40) + 30,
        target: Math.floor(Math.random() * 20) + 80,
        icon: "Target",
        color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      },
      {
        skill: "Dribbling",
        current: Math.floor(Math.random() * 40) + 30,
        previous: Math.floor(Math.random() * 40) + 30,
        target: Math.floor(Math.random() * 20) + 80,
        icon: "Zap",
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      },
      {
        skill: "Crossing",
        current: Math.floor(Math.random() * 40) + 30,
        previous: Math.floor(Math.random() * 40) + 30,
        target: Math.floor(Math.random() * 20) + 80,
        icon: "Eye",
        color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
      },
      {
        skill: "Defending",
        current: Math.floor(Math.random() * 40) + 30,
        previous: Math.floor(Math.random() * 40) + 30,
        target: Math.floor(Math.random() * 20) + 80,
        icon: "Shield",
        color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      },
      {
        skill: "Passing",
        current: Math.floor(Math.random() * 40) + 30,
        previous: Math.floor(Math.random() * 40) + 30,
        target: Math.floor(Math.random() * 20) + 80,
        icon: "Users",
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      },
      {
        skill: "Shooting",
        current: Math.floor(Math.random() * 40) + 30,
        previous: Math.floor(Math.random() * 40) + 30,
        target: Math.floor(Math.random() * 20) + 80,
        icon: "Star",
        color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400"
      }
    ]

    return NextResponse.json(mockSkillData)

  } catch (error) {
    console.error("Error fetching skill data:", error)
    return NextResponse.json(
      { error: "Failed to fetch skill data" },
      { status: 500 }
    )
  }
}
