import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    success: true,
    env: {
      sendgridApiKey: !!process.env.SENDGRID_API_KEY,
      sendgridFromEmail: process.env.SENDGRID_FROM_EMAIL,
      appUrl: process.env.NEXT_PUBLIC_APP_URL,
      jwtSecret: !!process.env.JWT_SECRET,
      databaseUrl: !!process.env.DATABASE_URL
    }
  })
}
