import { NextResponse } from "next/server"
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
})

export async function GET() {
  try {
    // Check if environment variables are set
    const hasCloudName = !!process.env.CLOUDINARY_CLOUD_NAME
    const hasApiKey = !!process.env.CLOUDINARY_API_KEY
    const hasApiSecret = !!process.env.CLOUDINARY_API_SECRET
    const hasPublicCloudName = !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

    if (!hasCloudName || !hasApiKey || !hasApiSecret) {
      return NextResponse.json({
        success: false,
        error: "Missing Cloudinary environment variables",
        config: {
          hasCloudName,
          hasApiKey,
          hasApiSecret,
          hasPublicCloudName
        }
      }, { status: 500 })
    }

    // Test Cloudinary connection by getting account info
    try {
      const accountInfo = await cloudinary.api.ping()
      return NextResponse.json({
        success: true,
        message: "Cloudinary configuration is valid",
        accountInfo,
        config: {
          cloudName: process.env.CLOUDINARY_CLOUD_NAME,
          hasApiKey: !!process.env.CLOUDINARY_API_KEY,
          hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
          publicCloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
        }
      })
    } catch (cloudinaryError) {
      return NextResponse.json({
        success: false,
        error: "Cloudinary connection failed",
        details: cloudinaryError instanceof Error ? cloudinaryError.message : "Unknown error",
        config: {
          hasCloudName,
          hasApiKey,
          hasApiSecret,
          hasPublicCloudName
        }
      }, { status: 500 })
    }

  } catch (error) {
    console.error("Cloudinary test error:", error)
    return NextResponse.json({
      success: false,
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
