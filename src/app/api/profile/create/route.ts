import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth-utils"
import { db, withRetry } from "@/lib/db"
import { z } from "zod"

// Profile creation schema matching our new database schema
const profileCreationSchema = z.object({
  // Personal information
  playerName: z.string().min(1, "Player name is required").max(100),
  dateOfBirth: z.string().optional().nullable().transform(val => val ? new Date(val) : null),
  guardianName: z.string().optional().nullable(),
  contactEmail: z.string().email().optional().nullable(),
  contactNumber: z.string().optional().nullable(),
  postcode: z.string().optional().nullable(),
  medicalConditions: z.string().optional().nullable(),
  
  // Position and level
  position: z.enum(['STRIKER', 'WINGER', 'CAM', 'FULLBACK', 'GOALKEEPER', 'DEFENDER', 'MIDFIELDER', 'OTHER']),
  playingLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'PROFESSIONAL']),
  currentTeam: z.string().optional().nullable(),
  evidenceFiles: z.array(z.string()).optional().nullable(),
  
  // Training information
  trainingReason: z.string().optional().nullable(),
  hearAbout: z.string().optional().nullable(),
  referralName: z.string().optional().nullable(),
  postTrainingSnacks: z.string().optional().nullable(),
  postTrainingDrinks: z.string().optional().nullable(),
  
  // Consent
  socialMediaConsent: z.boolean().default(false),
  marketingConsent: z.boolean().default(false),
  
  // System fields
  welcomeCompleted: z.boolean().default(true),
})

export async function POST(request: Request) {
  try {
    // Authenticate user
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const profileData = profileCreationSchema.parse(body)

    // Check if user already has a profile
    const existingProfile = await db.profile.findUnique({
      where: { userId: user.id }
    })

    if (existingProfile?.welcomeCompleted) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Profile already exists and onboarding is complete",
          profile: existingProfile
        },
        { status: 400 }
      )
    }

    // Create or update profile
    const profile = await withRetry(async () => {
      if (existingProfile) {
        // Update existing profile
        return await db.profile.update({
          where: { userId: user.id },
          data: {
            playerName: profileData.playerName,
            dateOfBirth: profileData.dateOfBirth,
            guardianName: profileData.guardianName,
            contactEmail: profileData.contactEmail,
            contactNumber: profileData.contactNumber,
            postcode: profileData.postcode,
            medicalConditions: profileData.medicalConditions,
            position: profileData.position,
            playingLevel: profileData.playingLevel,
            currentTeam: profileData.currentTeam,
            evidenceFiles: profileData.evidenceFiles || [],
            trainingReason: profileData.trainingReason,
            hearAbout: profileData.hearAbout,
            referralName: profileData.referralName,
            postTrainingSnacks: profileData.postTrainingSnacks,
            postTrainingDrinks: profileData.postTrainingDrinks,
            socialMediaConsent: profileData.socialMediaConsent,
            marketingConsent: profileData.marketingConsent,
            welcomeCompleted: profileData.welcomeCompleted,
            welcomeCompletedDate: profileData.welcomeCompleted ? new Date() : null,
          }
        })
      } else {
        // Create new profile
        return await db.profile.create({
          data: {
            userId: user.id,
            playerName: profileData.playerName,
            dateOfBirth: profileData.dateOfBirth,
            guardianName: profileData.guardianName,
            contactEmail: profileData.contactEmail,
            contactNumber: profileData.contactNumber,
            postcode: profileData.postcode,
            medicalConditions: profileData.medicalConditions,
            position: profileData.position,
            playingLevel: profileData.playingLevel,
            currentTeam: profileData.currentTeam,
            evidenceFiles: profileData.evidenceFiles || [],
            trainingReason: profileData.trainingReason,
            hearAbout: profileData.hearAbout,
            referralName: profileData.referralName,
            postTrainingSnacks: profileData.postTrainingSnacks,
            postTrainingDrinks: profileData.postTrainingDrinks,
            socialMediaConsent: profileData.socialMediaConsent,
            marketingConsent: profileData.marketingConsent,
            welcomeCompleted: profileData.welcomeCompleted,
            welcomeCompletedDate: profileData.welcomeCompleted ? new Date() : null,
          }
        })
      }
    })

    return NextResponse.json({
      success: true,
      message: existingProfile ? "Profile updated successfully" : "Profile created successfully",
      profile: {
        id: profile.id,
        playerName: profile.playerName,
        position: profile.position,
        playingLevel: profile.playingLevel,
        welcomeCompleted: profile.welcomeCompleted,
        createdAt: profile.createdAt,
      }
    })

  } catch (error) {
    console.error("Profile creation error:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Validation failed", 
          details: error.errors 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    // Authenticate user
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check existing profile
    const existingProfile = await db.profile.findUnique({
      where: { userId: user.id },
      select: {
        id: true,
        welcomeCompleted: true,
        playerName: true,
        position: true,
        playingLevel: true,
        createdAt: true,
      }
    })

    const canCreateProfile = !existingProfile || !existingProfile.welcomeCompleted
    
    return NextResponse.json({
      success: true,
      data: {
        canCreateProfile,
        existingProfile,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      }
    })

  } catch (error) {
    console.error("Profile check error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}