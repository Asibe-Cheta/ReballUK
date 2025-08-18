import { db, withRetry } from "@/lib/db"
import type { 
  UserWithProfile, 
  UserWithRelations, 
  ProfileUpdateInput,
  OnboardingInput,
  CourseWithRelations,
  ProgressWithRelations,
  BookingWithRelations,
  PlayerStats
} from "@/types/profile"
import { Prisma } from "@prisma/client"

// User Profile Operations
export const userProfileOperations = {
  // Get user with profile by ID
  async getUserProfile(userId: string): Promise<UserWithProfile | null> {
    return withRetry(async () => {
      return await db.user.findUnique({
        where: { id: userId },
        include: {
          profile: true,
        }
      })
    })
  },

  // Get user with all relations
  async getUserWithRelations(userId: string): Promise<UserWithRelations | null> {
    return withRetry(async () => {
      return await db.user.findUnique({
        where: { id: userId },
        include: {
          profile: true,
          bookings: {
            include: {
              course: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 10, // Latest 10 bookings
          },
          progress: {
            include: {
              course: true,
              video: true,
            },
            orderBy: { lastAccessedAt: 'desc' },
            take: 10, // Latest 10 progress entries
          },
          certificates: {
            where: { isActive: true },
            orderBy: { issuedAt: 'desc' },
          }
        }
      })
    })
  },

  // Update user profile
  async updateUserProfile(
    userId: string, 
    profileData: ProfileUpdateInput
  ): Promise<{ success: boolean; profile?: Record<string, unknown>; error?: string }> {
    try {
      const profile = await withRetry(async () => {
        return await db.profile.upsert({
          where: { userId },
          update: {
            ...profileData,
            position: profileData.position as any,
            trainingLevel: profileData.trainingLevel as any,
            goals: profileData.goals ? [profileData.goals] : [],
            updatedAt: new Date(),
          },
          create: {
            userId,
            ...profileData,
            position: profileData.position as any,
            trainingLevel: profileData.trainingLevel as any,
            goals: profileData.goals ? [profileData.goals] : [],
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

      return { success: true, profile }
    } catch (error) {
      console.error("Error updating user profile:", error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }
    }
  },

  // Complete user onboarding
  async completeOnboarding(
    userId: string, 
    onboardingData: OnboardingInput
  ): Promise<{ success: boolean; profile?: Record<string, unknown>; error?: string }> {
    try {
      const profile = await withRetry(async () => {
        return await db.profile.upsert({
          where: { userId },
          update: {
            ...onboardingData,
            position: onboardingData.position as any,
            trainingLevel: onboardingData.trainingLevel as any,
            goals: onboardingData.goals ? [onboardingData.goals] : [],
            completedOnboarding: true,
            updatedAt: new Date(),
          },
          create: {
            userId,
            ...onboardingData,
            position: onboardingData.position as any,
            trainingLevel: onboardingData.trainingLevel as any,
            goals: onboardingData.goals ? [onboardingData.goals] : [],
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

      return { success: true, profile }
    } catch (error) {
      console.error("Error completing onboarding:", error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }
    }
  },

  // Check if user profile is complete
  async isProfileComplete(userId: string): Promise<boolean> {
    const profile = await db.profile.findUnique({
      where: { userId },
      select: {
        firstName: true,
        lastName: true,
        position: true,
        trainingLevel: true,
        confidenceRating: true,
        completedOnboarding: true,
      }
    })

    if (!profile) return false

    return !!(
      profile.firstName &&
      profile.lastName &&
      profile.position &&
      profile.trainingLevel &&
      profile.confidenceRating &&
      profile.completedOnboarding
    )
  },
}

// Course Operations
export const courseOperations = {
  // Get all active courses with stats
  async getActiveCourses(
    filters?: {
      position?: string
      level?: string
      limit?: number
      offset?: number
    }
  ): Promise<CourseWithRelations[]> {
    const where: Prisma.CourseWhereInput = {
      isActive: true,
      ...(filters?.position && { position: filters.position as string }),
      ...(filters?.level && { level: filters.level as string }),
    }

    return withRetry(async () => {
      return await db.course.findMany({
        where,
        include: {
          videos: {
            where: { isActive: true },
            orderBy: { orderIndex: 'asc' },
            select: {
              id: true,
              title: true,
              duration: true,
              isPreview: true,
              thumbnailUrl: true,
            }
          },
          _count: {
            select: {
              bookings: true,
              progress: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: filters?.limit || 50,
        skip: filters?.offset || 0,
      })
    })
  },

  // Get course by ID with full details
  async getCourseById(courseId: string): Promise<CourseWithRelations | null> {
    return withRetry(async () => {
      return await db.course.findUnique({
        where: { id: courseId, isActive: true },
        include: {
          videos: {
            where: { isActive: true },
            orderBy: { orderIndex: 'asc' },
          },
          _count: {
            select: {
              bookings: true,
              progress: true,
            }
          }
        }
      })
    })
  },

  // Get recommended courses for user
  async getRecommendedCourses(
    userId: string,
    limit = 6
  ): Promise<CourseWithRelations[]> {
    // Get user profile to determine recommendations
    const profile = await db.profile.findUnique({
      where: { userId },
      select: {
        position: true,
        trainingLevel: true,
      }
    })

    const where: Prisma.CourseWhereInput = {
      isActive: true,
      // Recommend courses for user's position and level
      ...(profile?.position && { position: profile.position }),
      ...(profile?.trainingLevel && { level: profile.trainingLevel }),
    }

    return withRetry(async () => {
      return await db.course.findMany({
        where,
        include: {
          videos: {
            where: { isActive: true },
            select: {
              id: true,
              title: true,
              duration: true,
              isPreview: true,
            }
          },
          _count: {
            select: {
              bookings: true,
              progress: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      })
    })
  },
}

// Progress Operations
export const progressOperations = {
  // Get user progress for a course
  async getUserCourseProgress(
    userId: string,
    courseId: string
  ): Promise<ProgressWithRelations[]> {
    return withRetry(async () => {
      return await db.progress.findMany({
        where: { userId, courseId },
        include: {
          course: true,
          video: true,
        },
        orderBy: { lastAccessedAt: 'desc' },
      })
    })
  },

  // Update video progress
  async updateVideoProgress(
    userId: string,
    courseId: string,
    videoId: string,
    data: {
      completionPercentage: number
      timeSpent: number
      feedback?: string
      rating?: number
    }
  ): Promise<{ success: boolean; progress?: Record<string, unknown>; error?: string }> {
    try {
      const progress = await withRetry(async () => {
        return await db.progress.upsert({
          where: {
            userId_courseId_videoId: {
              userId,
              courseId,
              videoId,
            }
          },
          update: {
            completionPercentage: data.completionPercentage,
            timeSpent: data.timeSpent,
            feedback: data.feedback,
            rating: data.rating,
            lastAccessedAt: new Date(),
            isCompleted: data.completionPercentage >= 100,
            updatedAt: new Date(),
          },
          create: {
            userId,
            courseId,
            videoId,
            sessionType: "video-progress",
            successRate: 0.0,
            confidence: 0,
            duration: data.timeSpent,
            completionPercentage: data.completionPercentage,
            timeSpent: data.timeSpent,
            feedback: data.feedback,
            rating: data.rating,
            lastAccessedAt: new Date(),
            isCompleted: data.completionPercentage >= 100,
          },
          include: {
            course: true,
            video: true,
          }
        })
      })

      return { success: true, progress }
    } catch (error) {
      console.error("Error updating video progress:", error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }
    }
  },

  // Get user's recent progress
  async getRecentProgress(
    userId: string,
    limit = 10
  ): Promise<ProgressWithRelations[]> {
    return withRetry(async () => {
      return await db.progress.findMany({
        where: { userId },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              thumbnailUrl: true,
            }
          },
          video: {
            select: {
              id: true,
              title: true,
              duration: true,
              thumbnailUrl: true,
            }
          }
        },
        orderBy: { lastAccessedAt: 'desc' },
        take: limit,
      })
    })
  },
}

// Booking Operations
export const bookingOperations = {
  // Create a course booking
  async createBooking(
    userId: string,
    courseId: string,
    data: {
      scheduledFor?: Date
      notes?: string
    }
  ): Promise<{ success: boolean; booking?: Record<string, unknown>; error?: string }> {
    try {
      // Check if user already has an active booking for this course
      const existingBooking = await db.booking.findFirst({
        where: {
          userId,
          courseId,
          status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] }
        }
      })

      if (existingBooking) {
        return {
          success: false,
          error: "You already have an active booking for this course"
        }
      }

      const booking = await withRetry(async () => {
        return await db.booking.create({
          data: {
            userId,
            courseId,
            sessionType: 'course-booking',
            position: 'general',
            scheduledFor: data.scheduledFor,
            notes: data.notes,
            paymentStatus: 'PENDING',
            price: 0,
          },
          include: {
            course: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        })
      })

      return { success: true, booking }
    } catch (error) {
      console.error("Error creating booking:", error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }
    }
  },

  // Get user bookings
  async getUserBookings(
    userId: string,
    status?: string
  ): Promise<BookingWithRelations[]> {
    const where: Prisma.BookingWhereInput = {
      userId,
      ...(status && { status: status as any }),
    }

    return withRetry(async () => {
      return await db.booking.findMany({
        where,
        include: {
          course: {
            include: {
              _count: {
                select: {
                  videos: true,
                }
              }
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
      })
    })
  },

  // Update booking status
  async updateBookingStatus(
    bookingId: string,
    status: string,
    userId: string
  ): Promise<{ success: boolean; booking?: Record<string, unknown>; error?: string }> {
    try {
      const booking = await withRetry(async () => {
        return await db.booking.update({
          where: { 
            id: bookingId,
            userId, // Ensure user owns this booking
          },
          data: {
            status: status as any,
            updatedAt: new Date(),
            ...(status === 'COMPLETED' && { completedAt: new Date() }),
          },
          include: {
            course: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        })
      })

      return { success: true, booking }
    } catch (error) {
      console.error("Error updating booking status:", error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }
    }
  },
}

// Analytics Operations
export const analyticsOperations = {
  // Get user statistics
  async getUserStats(userId: string): Promise<PlayerStats> {
    const [
      totalBookings,
      completedBookings,
      totalProgress,
      certificates,
      profile,
      progressData,
    ] = await Promise.all([
      db.booking.count({ where: { userId } }),
      db.booking.count({ where: { userId, status: 'COMPLETED' } }),
      db.progress.count({ where: { userId } }),
      db.certificate.count({ where: { userId, isActive: true } }),
      db.profile.findUnique({ where: { userId } }),
      db.progress.findMany({
        where: { userId },
        select: {
          timeSpent: true,
          rating: true,
          lastAccessedAt: true,
          completionPercentage: true,
        }
      })
    ])

    const totalWatchTime = progressData.reduce((total, p) => total + (p.timeSpent || 0), 0)
    const ratingsData = progressData.filter(p => p.rating !== null)
    const averageRating = ratingsData.length > 0
      ? ratingsData.reduce((sum, p) => sum + (p.rating || 0), 0) / ratingsData.length
      : 0

    const lastActive = progressData.length > 0
      ? new Date(Math.max(...progressData.map(p => new Date(p.lastAccessedAt).getTime())))
      : new Date()

    const progressPercentage = totalProgress > 0
      ? progressData.reduce((sum, p) => sum + p.completionPercentage, 0) / totalProgress
      : 0

    return {
      totalCourses: totalBookings,
      completedCourses: completedBookings,
      totalWatchTime,
      averageRating: Math.round(averageRating * 100) / 100,
      certificatesEarned: certificates,
      currentStreak: calculateDaysSince(lastActive),
      lastActive,
      progressPercentage: Math.round(progressPercentage),
      favoritePosition: profile?.position || "Not set",
      trainingLevel: profile?.trainingLevel || "Not set",
    }
  },
}

// Helper functions
function calculateDaysSince(date: Date): number {
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}
