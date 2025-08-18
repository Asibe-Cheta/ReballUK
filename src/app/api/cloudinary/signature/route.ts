import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth-utils"
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
})

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser()
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Validate Cloudinary environment variables
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json({ 
        error: "Cloudinary configuration is missing. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables." 
      }, { status: 500 })
    }

    const body = await request.json()
    const { 
      filename, 
      analysisType = "SISW", 
      position = "", 
      tags = [] 
    } = body

    if (!filename) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 })
    }

    // Generate timestamp for signature
    const timestamp = Math.round(new Date().getTime() / 1000)

    // Create parameters for signature
    const params = {
      timestamp,
      folder: 'reball-videos',
      resource_type: 'video',
      transformation: 'f_auto,q_auto',
      context: `analysis_type=${analysisType}|position=${position}|tags=${tags.join(",")}|user_id=${user.id}`,
      public_id: `reball-videos/${user.id}/${Date.now()}_${filename.replace(/\.[^/.]+$/, "")}`
    }

    // Generate signature using Cloudinary
    const signature = cloudinary.utils.api_sign_request(
      params,
      process.env.CLOUDINARY_API_SECRET!
    )

    return NextResponse.json({
      signature,
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      params
    })

  } catch (error) {
    console.error("Error generating Cloudinary signature:", error)
    return NextResponse.json(
      { error: "Failed to generate upload signature" },
      { status: 500 }
    )
  }
}
