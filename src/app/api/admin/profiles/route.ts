import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-utils'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    // Check if user is admin
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'all'
    const sort = searchParams.get('sort') || 'newest'

    // Build where clause
    let whereClause: any = { role: 'USER' }
    
    if (status === 'completed') {
      whereClause.profile = { welcomeCompleted: true }
    } else if (status === 'pending') {
      whereClause.profile = { welcomeCompleted: false }
    }

    // Build order by clause
    let orderBy: any = {}
    switch (sort) {
      case 'oldest':
        orderBy = { createdAt: 'asc' }
        break
      case 'name':
        orderBy = { profile: { playerName: 'asc' } }
        break
      case 'completion':
        orderBy = { profile: { welcomeCompletedDate: 'desc' } }
        break
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' }
        break
    }

    // Get users with their profiles
    const users = await db.user.findMany({
      where: whereClause,
      include: {
        profile: true
      },
      orderBy
    })

    // Transform the data to match our interface
    const submissions = users.map(user => ({
      id: user.profile?.id || user.id,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt.toISOString()
      },
      playerName: user.profile?.playerName || null,
      dateOfBirth: user.profile?.dateOfBirth?.toISOString() || null,
      guardianName: user.profile?.guardianName || null,
      contactEmail: user.profile?.contactEmail || null,
      contactNumber: user.profile?.contactNumber || null,
      postcode: user.profile?.postcode || null,
      medicalConditions: user.profile?.medicalConditions || null,
      position: user.profile?.position || null,
      playingLevel: user.profile?.playingLevel || null,
      currentTeam: user.profile?.currentTeam || null,
      trainingReason: user.profile?.trainingReason || null,
      hearAbout: user.profile?.hearAbout || null,
      postTrainingSnacks: user.profile?.postTrainingSnacks || null,
      postTrainingDrinks: user.profile?.postTrainingDrinks || null,
      socialMediaConsent: user.profile?.socialMediaConsent || false,
      marketingConsent: user.profile?.marketingConsent || false,
      welcomeCompleted: user.profile?.welcomeCompleted || false,
      welcomeCompletedDate: user.profile?.welcomeCompletedDate?.toISOString() || null,
      createdAt: user.profile?.createdAt?.toISOString() || user.createdAt.toISOString(),
      updatedAt: user.profile?.updatedAt?.toISOString() || user.updatedAt.toISOString()
    }))

    return NextResponse.json(submissions)

  } catch (error) {
    console.error('Error fetching profile submissions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
