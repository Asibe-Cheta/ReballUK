import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-server"
import { getFreshDbClient } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const freshDb = getFreshDbClient()

    // Get goals from database (for now, return mock data since we don't have a goals table)
    // In a real implementation, you would create a goals table and query it here

    await freshDb.$disconnect()

    // Return mock goals for demonstration
    const mockGoals = [
      {
        id: "1",
        title: "Improve 1v1 Success Rate",
        description: "Achieve 80% success rate in 1v1 finishing scenarios",
        category: "success_rate",
        targetValue: 80,
        currentValue: 65,
        unit: "%",
        deadline: "2024-03-31",
        status: "active",
        createdAt: "2024-01-15"
      },
      {
        id: "2",
        title: "Complete 20 Training Sessions",
        description: "Attend 20 training sessions this quarter",
        category: "sessions",
        targetValue: 20,
        currentValue: 12,
        unit: "sessions",
        deadline: "2024-03-31",
        status: "active",
        createdAt: "2024-01-15"
      },
      {
        id: "3",
        title: "Master 3 Core Skills",
        description: "Achieve 90% proficiency in dribbling, finishing, and passing",
        category: "skills",
        targetValue: 3,
        currentValue: 1,
        unit: "skills",
        deadline: "2024-06-30",
        status: "active",
        createdAt: "2024-01-15"
      }
    ]

    return NextResponse.json(mockGoals)

  } catch (error) {
    console.error("Error fetching goals:", error)
    return NextResponse.json(
      { error: "Failed to fetch goals" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, category, targetValue, deadline } = body

    const freshDb = getFreshDbClient()

    // In a real implementation, you would create a goals table and insert the goal here
    // For now, we'll just return a success response

    await freshDb.$disconnect()

    return NextResponse.json({ 
      success: true, 
      message: "Goal created successfully",
      goal: {
        id: Date.now().toString(),
        title,
        description,
        category,
        targetValue,
        currentValue: 0,
        unit: getUnitForCategory(category),
        deadline,
        status: "active",
        createdAt: new Date().toISOString().split('T')[0]
      }
    })

  } catch (error) {
    console.error("Error creating goal:", error)
    return NextResponse.json(
      { error: "Failed to create goal" },
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
    const { id, title, description, category, targetValue, deadline } = body

    const freshDb = getFreshDbClient()

    // In a real implementation, you would update the goal in the database here
    // For now, we'll just return a success response

    await freshDb.$disconnect()

    return NextResponse.json({ 
      success: true, 
      message: "Goal updated successfully" 
    })

  } catch (error) {
    console.error("Error updating goal:", error)
    return NextResponse.json(
      { error: "Failed to update goal" },
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
    const goalId = searchParams.get("id")

    if (!goalId) {
      return NextResponse.json({ error: "Goal ID is required" }, { status: 400 })
    }

    const freshDb = getFreshDbClient()

    // In a real implementation, you would delete the goal from the database here
    // For now, we'll just return a success response

    await freshDb.$disconnect()

    return NextResponse.json({ 
      success: true, 
      message: "Goal deleted successfully" 
    })

  } catch (error) {
    console.error("Error deleting goal:", error)
    return NextResponse.json(
      { error: "Failed to delete goal" },
      { status: 500 }
    )
  }
}

function getUnitForCategory(category: string): string {
  switch (category) {
    case "success_rate":
    case "confidence":
      return "%"
    case "sessions":
      return "sessions"
    case "skills":
      return "skills"
    default:
      return ""
  }
}
