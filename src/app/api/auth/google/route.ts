import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { setAuthCookie } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    // Debug logging at the start
    console.error('=== GOOGLE OAUTH DEBUG START ===')
    console.error('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID)
    console.error('GOOGLE_REDIRECT_URI:', process.env.GOOGLE_REDIRECT_URI)
    console.error('Request URL:', request.url)
    
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    console.error('Code parameter:', code)
    console.error('Error parameter:', error)

    if (error) {
      console.error('Google OAuth error:', error)
      return NextResponse.redirect(new URL('/login?error=google_auth_failed', request.url))
    }

    if (!code) {
      const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google'
      console.error('Using redirect URI:', redirectUri)
      
      // Redirect to Google OAuth
      const googleAuthUrl = `https://accounts.google.com/oauth/authorize?` +
        `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=code&` +
        `scope=openid email profile&` +
        `access_type=offline`

      console.error('Google Auth URL:', googleAuthUrl)
      console.error('=== GOOGLE OAUTH DEBUG END ===')
      return NextResponse.redirect(googleAuthUrl)
    }

    // Exchange code for tokens
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google'
    console.error('Token exchange - redirect URI:', redirectUri)
    
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      console.error('Google token exchange failed:', tokenData)
      return NextResponse.redirect(new URL('/login?error=google_auth_failed', request.url))
    }

    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    const userData = await userResponse.json()

    if (!userResponse.ok) {
      console.error('Google user info failed:', userData)
      return NextResponse.redirect(new URL('/login?error=google_auth_failed', request.url))
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: userData.email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        profile: {
          select: {
            position: true,
            trainingLevel: true,
            completedOnboarding: true,
          }
        }
      }
    })

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          image: userData.picture,
          role: "USER",
          emailVerified: true, // Google accounts are pre-verified
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          emailVerified: true,
          createdAt: true,
          profile: {
            select: {
              position: true,
              trainingLevel: true,
              completedOnboarding: true,
            }
          }
        }
      })
    }

    // Set authentication cookie
    await setAuthCookie(user.id)

    // Redirect to home page
    return NextResponse.redirect(new URL('/', request.url))

  } catch (error) {
    console.error('Google OAuth error:', error)
    return NextResponse.redirect(new URL('/login?error=google_auth_failed', request.url))
  }
}
