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

    // Get recent bookings with course and progress information
    const sessionsData = await freshDb.$queryRaw`
      SELECT 
        b.id,
        b.booked_at as date,
        c.title as session_type,
        c.position,
        COALESCE(p.completion_percentage, 0) as success_rate,
        COALESCE(p.rating, 0) as confidence,
        c.duration,
        p.feedback as notes
      FROM bookings b
      LEFT JOIN courses c ON b.course_id = c.id
      LEFT JOIN progress p ON b.course_id = p.course_id AND b.user_id = p.user_id
      WHERE b.user_id = ${user.id}
        AND b.status IN ('COMPLETED', 'IN_PROGRESS')
      ORDER BY b.booked_at DESC
      LIMIT 10
    `

    await freshDb.$disconnect()

    // Transform the data
    const sessions = Array.isArray(sessionsData) ? sessionsData.map((session: Record<string, unknown>) => ({
      id: session.id,
      date: session.date,
      sessionType: session.session_type || "Training Session",
      position: session.position || "General",
      successRate: Math.round(session.success_rate || 0),
      confidence: Math.round(session.confidence || 0),
      duration: session.duration || 60,
      notes: session.notes || ""
    })) : []

    return NextResponse.json(sessions)

  } catch (error) {
    console.error("Error fetching sessions:", error)
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    )
  }
}
