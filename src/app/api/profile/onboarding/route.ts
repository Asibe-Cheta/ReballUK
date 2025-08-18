import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth-utils"
import { db, withRetry } from "@/lib/db"
import { onboardingSchema } from "@/types/profile"
import { PlayerPosition, TrainingLevel } from "@prisma/client"

// POST /api/profile/onboarding - Complete user onboarding
export async function POST(request: NextRequest) {
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
    const validationResult = onboardingSchema.safeParse(body)
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

    const onboardingData = validationResult.data

    // Create or update profile with onboarding data
    const profile = await withRetry(async () => {
      return await db.profile.upsert({
        where: { userId: user.id },
        update: {
          firstName: onboardingData.firstName,
          lastName: onboardingData.lastName,
          dateOfBirth: onboardingData.dateOfBirth,
          position: onboardingData.position as PlayerPosition,
          trainingLevel: onboardingData.trainingLevel as TrainingLevel,
          confidenceRating: onboardingData.confidenceRating,
          preferredFoot: onboardingData.preferredFoot,
          ...(onboardingData.goals ? { goals: [onboardingData.goals] } : {}),
          completedOnboarding: true,
          updatedAt: new Date(),
        },
        create: {
          userId: user.id,
          firstName: onboardingData.firstName,
          lastName: onboardingData.lastName,
          dateOfBirth: onboardingData.dateOfBirth,
          position: onboardingData.position as PlayerPosition,
          trainingLevel: onboardingData.trainingLevel as TrainingLevel,
          confidenceRating: onboardingData.confidenceRating,
          preferredFoot: onboardingData.preferredFoot,
          ...(onboardingData.goals ? { goals: [onboardingData.goals] } : {}),
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
      data: profile,
      message: "Onboarding completed successfully",
    })
  } catch (error) {
    console.error("Error completing onboarding:", error)
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

// GET /api/profile/onboarding - Check onboarding status
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

    // Get user profile
    const profile = await db.profile.findUnique({
      where: { userId: user.id },
      select: {
        id: true,
        completedOnboarding: true,
        firstName: true,
        lastName: true,
        position: true,
        trainingLevel: true,
        confidenceRating: true,
        createdAt: true,
      }
    })

    const isOnboardingComplete = profile?.completedOnboarding || false
    const requiredFieldsComplete = !!(
      profile?.firstName &&
      profile?.lastName &&
      profile?.position &&
      profile?.trainingLevel &&
      profile?.confidenceRating
    )

    return NextResponse.json({
      success: true,
      data: {
        isOnboardingComplete,
        requiredFieldsComplete,
        profile: profile || null,
        needsOnboarding: !isOnboardingComplete || !requiredFieldsComplete,
      },
    })

  } catch (error) {
    console.error("Error checking onboarding status:", error)
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
