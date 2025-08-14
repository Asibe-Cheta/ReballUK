import { NextResponse } from "next/server"
import { auth } from "@/lib/auth-server"
import { db, withRetry } from "@/lib/db"
import { z } from "zod"

// Enhanced profile creation schema
const profileCreationSchema = z.object({
  // Personal information
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  dateOfBirth: z.string().optional().nullable().transform(val => val ? new Date(val) : null),
  phoneNumber: z.string().optional().nullable(),
  emergencyContact: z.string().optional().nullable(),
  
  // Position and physical info
  position: z.enum(['STRIKER', 'WINGER', 'CAM', 'FULLBACK', 'GOALKEEPER', 'DEFENDER', 'MIDFIELDER', 'OTHER']),
  preferredFoot: z.enum(['left', 'right', 'both']),
  height: z.number().min(100).max(250).optional().nullable(),
  weight: z.number().min(30).max(200).optional().nullable(),
  
  // Experience
  trainingLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'PROFESSIONAL']),
  yearsPlaying: z.number().min(0).max(50).optional().nullable(),
  currentClub: z.string().max(100).optional().nullable(),
  previousExperience: z.string().max(1000).optional().nullable(),
  coachingExperience: z.boolean().default(false),
  
  // Goals (stored as JSON)
  goals: z.object({
    primaryGoals: z.array(z.string()).min(1).max(10),
    specificAreas: z.string().optional().nullable(),
    shortTermGoals: z.string().optional().nullable(),
    longTermGoals: z.string().optional().nullable(),
  }),
  
  // Confidence (stored as JSON)
  confidence: z.object({
    scenarios: z.record(z.string(), z.number().min(1).max(10)),
    overallConfidence: z.number().min(1).max(10),
    areasForImprovement: z.array(z.string()).optional(),
  }),
  
  // Preferences (stored as JSON)
  preferences: z.object({
    availableDays: z.array(z.string()).min(1),
    preferredTimes: z.array(z.string()).min(1),
    sessionFrequency: z.string(),
    sessionDuration: z.string(),
    trainingIntensity: z.string(),
    groupTraining: z.boolean().default(false),
    oneOnOneTraining: z.boolean().default(true),
  }),
  
  // System fields
  completedOnboarding: z.boolean().default(true),
})

export async function POST() {
  try {
    // Authenticate user
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    console.log("Profile creation request:", body)
    
    const validationResult = profileCreationSchema.safeParse(body)
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }))
      
      console.error("Validation errors:", errors)
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

    // Check if user already has a profile
    const existingProfile = await db.profile.findUnique({
      where: { userId: session.user.id }
    })

    if (existingProfile?.completedOnboarding) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Profile already exists and onboarding is complete",
          profile: existingProfile
        },
        { status: 409 }
      )
    }

    // Create or update profile with comprehensive data
    const profile = await withRetry(async () => {
      return await db.profile.upsert({
        where: { userId: session.user.id },
        update: {
          // Personal info
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          dateOfBirth: profileData.dateOfBirth,
          phoneNumber: profileData.phoneNumber,
          emergencyContact: profileData.emergencyContact,
          
          // Position and physical
          position: profileData.position,
          preferredFoot: profileData.preferredFoot,
          height: profileData.height,
          weight: profileData.weight,
          
          // Experience
          trainingLevel: profileData.trainingLevel,
          
          // Extended profile data (stored as JSON in bio field for now)
          bio: JSON.stringify({
            yearsPlaying: profileData.yearsPlaying,
            currentClub: profileData.currentClub,
            previousExperience: profileData.previousExperience,
            coachingExperience: profileData.coachingExperience,
            goals: profileData.goals,
            confidence: profileData.confidence,
            preferences: profileData.preferences,
          }),
          
          // Calculate confidence rating average
          confidenceRating: Math.round(
            Object.values(profileData.confidence.scenarios).reduce((sum, val) => sum + val, 0) / 
            Object.values(profileData.confidence.scenarios).length
          ),
          
          // Mark as completed
          completedOnboarding: true,
          updatedAt: new Date(),
        },
        create: {
          userId: session.user.id,
          
          // Personal info
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          dateOfBirth: profileData.dateOfBirth,
          phoneNumber: profileData.phoneNumber,
          emergencyContact: profileData.emergencyContact,
          
          // Position and physical
          position: profileData.position,
          preferredFoot: profileData.preferredFoot,
          height: profileData.height,
          weight: profileData.weight,
          
          // Experience
          trainingLevel: profileData.trainingLevel,
          
          // Extended profile data
          bio: JSON.stringify({
            yearsPlaying: profileData.yearsPlaying,
            currentClub: profileData.currentClub,
            previousExperience: profileData.previousExperience,
            coachingExperience: profileData.coachingExperience,
            goals: profileData.goals,
            confidence: profileData.confidence,
            preferences: profileData.preferences,
          }),
          
          // Calculate confidence rating
          confidenceRating: Math.round(
            Object.values(profileData.confidence.scenarios).reduce((sum, val) => sum + val, 0) / 
            Object.values(profileData.confidence.scenarios).length
          ),
          
          // Mark as completed
          completedOnboarding: true,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              createdAt: true,
            }
          }
        }
      })
    })

    // Create initial user statistics record (for future analytics)
    try {
      await db.$executeRaw`
        INSERT INTO user_stats (user_id, total_sessions, completed_sessions, total_watch_time, created_at, updated_at)
        VALUES (${session.user.id}, 0, 0, 0, NOW(), NOW())
        ON CONFLICT (user_id) DO NOTHING
      `
    } catch (error) {
      // This is optional - don't fail profile creation if stats creation fails
      console.warn("Could not create user stats:", error)
    }

    // Send welcome notification (optional)
    try {
      // Here you could trigger welcome email, push notification, etc.
      console.log(`Welcome email should be sent to: ${session.user.email}`)
    } catch (error) {
      console.warn("Could not send welcome notification:", error)
    }

    return NextResponse.json({
      success: true,
      profile,
      message: "Profile created successfully! Welcome to REBALL.",
    })

  } catch (error) {
    console.error("Error creating profile:", error)
    
    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Profile already exists for this user",
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

      if (error.message.includes("Data too long")) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Some profile data is too long. Please shorten your text inputs.",
          },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { 
        success: false, 
        error: "Internal server error",
        message: "Failed to create profile. Please try again."
      },
      { status: 500 }
    )
  }
}

// GET /api/profile/create - Check if user can create profile
export async function GET() {
  try {
    // Authenticate user
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check existing profile
    const existingProfile = await db.profile.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
        completedOnboarding: true,
        firstName: true,
        lastName: true,
        position: true,
        trainingLevel: true,
        createdAt: true,
      }
    })

    const canCreateProfile = !existingProfile || !existingProfile.completedOnboarding
    
    return NextResponse.json({
      success: true,
      data: {
        canCreateProfile,
        existingProfile: existingProfile || null,
        user: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
        }
      },
    })

  } catch (error) {
    console.error("Error checking profile creation status:", error)
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
