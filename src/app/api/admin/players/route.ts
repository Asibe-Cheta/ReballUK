import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-utils'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Check if user is admin
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get all users with their profiles
    const players = await db.user.findMany({
      where: { role: 'USER' },
      include: {
        profile: true
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transform the data to match our interface
    const transformedPlayers = players.map(player => ({
      id: player.profile?.id || player.id,
      user: {
        id: player.id,
        name: player.name,
        email: player.email,
        createdAt: player.createdAt.toISOString()
      },
      playerName: player.profile?.playerName || null,
      dateOfBirth: player.profile?.dateOfBirth?.toISOString() || null,
      guardianName: player.profile?.guardianName || null,
      contactEmail: player.profile?.contactEmail || null,
      contactNumber: player.profile?.contactNumber || null,
      postcode: player.profile?.postcode || null,
      medicalConditions: player.profile?.medicalConditions || null,
      position: player.profile?.position || null,
      playingLevel: player.profile?.playingLevel || null,
      currentTeam: player.profile?.currentTeam || null,
      trainingReason: player.profile?.trainingReason || null,
      hearAbout: player.profile?.hearAbout || null,
      postTrainingSnacks: player.profile?.postTrainingSnacks || null,
      postTrainingDrinks: player.profile?.postTrainingDrinks || null,
      socialMediaConsent: player.profile?.socialMediaConsent || false,
      marketingConsent: player.profile?.marketingConsent || false,
      welcomeCompleted: player.profile?.welcomeCompleted || false,
      welcomeCompletedDate: player.profile?.welcomeCompletedDate?.toISOString() || null,
      createdAt: player.profile?.createdAt?.toISOString() || player.createdAt.toISOString(),
      updatedAt: player.profile?.updatedAt?.toISOString() || player.updatedAt.toISOString()
    }))

    return NextResponse.json(transformedPlayers)

  } catch (error) {
    console.error('Error fetching players:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
