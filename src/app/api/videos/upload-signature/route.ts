import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-server"
import { generateUploadSignature } from "@/lib/cloudinary"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if Cloudinary environment variables are configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json({ 
        error: "Cloudinary configuration is missing. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables." 
      }, { status: 500 })
    }

    const body = await request.json()
    const { params } = body

    if (!params) {
      return NextResponse.json({ error: "Missing upload parameters" }, { status: 400 })
    }

    // Generate upload signature
    const signature = generateUploadSignature(params)

    return NextResponse.json({
      signature,
      timestamp: params.timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME
    })

  } catch (error) {
    console.error("Error generating upload signature:", error)
    return NextResponse.json(
      { error: "Failed to generate upload signature" },
      { status: 500 }
    )
  }
}
