import { NextResponse } from "next/server"
import { auth } from "@/lib/auth-server"
import { db, withRetry } from "@/lib/db"
import { profileUpdateSchema } from "@/types/profile"

// GET /api/profile - Get user profile
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

    // Get user with profile
    const userWithProfile = await withRetry(async () => {
      return await db.user.findUnique({
        where: { id: session.user.id },
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
export async function PUT() {
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
    const validationResult = profileUpdateSchema.safeParse(body)
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

    const profileData = validationResult.data

    // Update or create profile
    const updatedProfile = await withRetry(async () => {
      return await db.profile.upsert({
        where: { userId: session.user.id },
        update: {
          ...profileData,
          completedOnboarding: true, // Mark onboarding as complete
          updatedAt: new Date(),
        },
        create: {
          userId: session.user.id,
          ...profileData,
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
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Soft delete profile
    const updatedProfile = await withRetry(async () => {
      return await db.profile.update({
        where: { userId: session.user.id },
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
