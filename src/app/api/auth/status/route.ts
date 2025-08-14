import { NextResponse } from "next/server"

export async function GET() {
  const envStatus = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    DIRECT_URL: !!process.env.DIRECT_URL,
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
    GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
  }

  const allRequired = envStatus.DATABASE_URL && envStatus.NEXTAUTH_SECRET
  const googleOAuthReady = envStatus.GOOGLE_CLIENT_ID && envStatus.GOOGLE_CLIENT_SECRET

  return NextResponse.json({
    success: true,
    environment: {
      ready: allRequired,
      features: {
        emailAuth: allRequired,
        googleOAuth: googleOAuthReady,
        database: envStatus.DATABASE_URL,
      }
    },
    recommendations: {
      ...(!envStatus.DATABASE_URL && { database: "Add DATABASE_URL to .env.local" }),
      ...(!envStatus.NEXTAUTH_SECRET && { auth: "Add NEXTAUTH_SECRET to .env.local" }),
      ...(!googleOAuthReady && { 
        googleOAuth: "Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET for Google OAuth (optional)" 
      }),
    }
  })
}
