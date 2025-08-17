import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const users = await prisma.$queryRaw`
      SELECT id, name, email, "emailVerified", "createdAt", role
      FROM "User"
      ORDER BY "createdAt" DESC
    `

    return NextResponse.json({
      success: true,
      count: Array.isArray(users) ? users.length : 0,
      users: users
    })

  } catch (error) {
    console.error("Debug users error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}
