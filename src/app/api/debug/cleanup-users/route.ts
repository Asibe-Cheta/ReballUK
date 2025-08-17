import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST() {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    
    // Delete unverified users older than 24 hours using raw query
    const deletedUsersResult = await prisma.$executeRaw`
      DELETE FROM "User" 
      WHERE "emailVerified" = false 
      AND "createdAt" < ${twentyFourHoursAgo}
    `

    // Also delete expired verification tokens
    const deletedTokensResult = await prisma.$executeRaw`
      DELETE FROM "VerificationToken" 
      WHERE expires < NOW()
    `

    return NextResponse.json({
      success: true,
      message: "Cleanup completed",
      deletedUsers: "Completed",
      deletedTokens: "Completed"
    })

  } catch (error) {
    console.error("Cleanup error:", error)
    return NextResponse.json(
      { success: false, error: "Cleanup failed" },
      { status: 500 }
    )
  }
}
