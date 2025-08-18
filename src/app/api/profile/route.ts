import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth-utils"
import { db, withRetry } from "@/lib/db"
import { profileUpdateSchema } from "@/types/profile"
import { PlayerPosition, TrainingLevel } from "@prisma/client"

// GET /api/profile - Get user profile
export async function GET() {
  try {
    // Authenticate user
    const user = await getCurrentUser()
    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get user with profile
    const userWithProfile = await withRetry(async () => {
      return await db.user.findUnique({
        where: { id: user.id },
        include: {
          profile: true,
          _count: {
            select: {
              bookings: true,
              progress: true,
              certificates: true,
            }
          }
        }
      })
    })

    if (!userWithProfile) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: userWithProfile,
    })
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

// PUT /api/profile - Update user profile
export async function PUT(request: Request) {
  try {
    // Authenticate user
    const user = await getCurrentUser()
    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    
    // Validate input
    const validationResult = profileUpdateSchema.safeParse(body)
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }))
      
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          errors,
        },
        { status: 400 }
      )
    }

    const profileData = validationResult.data

    // Update or create profile
    const updatedProfile = await withRetry(async () => {
      return await db.profile.upsert({
        where: { userId: user.id },
        update: {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          dateOfBirth: profileData.dateOfBirth,
          position: profileData.position as PlayerPosition,
          trainingLevel: profileData.trainingLevel as TrainingLevel,
          confidenceRating: profileData.confidenceRating,
          preferredFoot: profileData.preferredFoot,
          height: profileData.height,
          weight: profileData.weight,
          currentClub: profileData.currentClub,
          previousExperience: profileData.previousExperience,
          coachingExperience: profileData.coachingExperience,
          goals: profileData.goals,
          confidence: profileData.confidence,
          preferences: profileData.preferences,
          medicalInfo: profileData.medicalInfo,
          completedOnboarding: true, // Mark onboarding as complete
          updatedAt: new Date(),
        },
        create: {
          userId: user.id,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          dateOfBirth: profileData.dateOfBirth,
          position: profileData.position as PlayerPosition,
          trainingLevel: profileData.trainingLevel as TrainingLevel,
          confidenceRating: profileData.confidenceRating,
          preferredFoot: profileData.preferredFoot,
          height: profileData.height,
          weight: profileData.weight,
          currentClub: profileData.currentClub,
          previousExperience: profileData.previousExperience,
          coachingExperience: profileData.coachingExperience,
          goals: profileData.goals,
          confidence: profileData.confidence,
          preferences: profileData.preferences,
          medicalInfo: profileData.medicalInfo,
          completedOnboarding: true,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            }
          }
        }
      })
    })

    return NextResponse.json({
      success: true,
      data: updatedProfile,
      message: "Profile updated successfully",
    })
  } catch (error) {
    console.error("Error updating user profile:", error)
    
    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Profile already exists or duplicate data",
          },
          { status: 409 }
        )
      }
      
      if (error.message.includes("Foreign key constraint")) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Invalid user reference",
          },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { 
        success: false, 
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

// DELETE /api/profile - Soft delete user profile (mark as inactive)
export async function DELETE() {
  try {
    // Authenticate user
    const user = await getCurrentUser()
    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Soft delete profile
    const updatedProfile = await withRetry(async () => {
      return await db.profile.update({
        where: { userId: user.id },
        data: {
          isActive: false,
          updatedAt: new Date(),
        }
      })
    })

    return NextResponse.json({
      success: true,
      data: updatedProfile,
      message: "Profile deactivated successfully",
    })
  } catch (error) {
    console.error("Error deactivating user profile:", error)
    
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return NextResponse.json(
        { success: false, error: "Profile not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
