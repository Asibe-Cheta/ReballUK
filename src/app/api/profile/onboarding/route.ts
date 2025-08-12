import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-server"
import { db, withRetry } from "@/lib/db"
import { onboardingSchema } from "@/types/profile"

// POST /api/profile/onboarding - Complete user onboarding
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const session = await auth()
    if (!session?.user?.id) {
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
      const errors = validationResult.error.errors.map(err => ({
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

    // Check if user already has a profile
    const existingProfile = await db.profile.findUnique({
      where: { userId: session.user.id }
    })

    if (existingProfile?.completedOnboarding) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Onboarding already completed",
          data: existingProfile
        },
        { status: 400 }
      )
    }

    // Create or update profile with onboarding data
    const profile = await withRetry(async () => {
      return await db.profile.upsert({
        where: { userId: session.user.id },
        update: {
          ...onboardingData,
          completedOnboarding: true,
          updatedAt: new Date(),
        },
        create: {
          userId: session.user.id,
          ...onboardingData,
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
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get user profile
    const profile = await db.profile.findUnique({
      where: { userId: session.user.id },
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
