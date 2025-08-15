import { NextRequest, NextResponse } from "next/server"
import { requireCoach } from "@/lib/coach-auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    await requireCoach()
    
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const status = searchParams.get("status")
    const position = searchParams.get("position")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      role: "USER"
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { profile: { firstName: { contains: search, mode: "insensitive" } } },
        { profile: { lastName: { contains: search, mode: "insensitive" } } }
      ]
    }

    if (status === "active") {
      where.profile = { isActive: true }
    } else if (status === "inactive") {
      where.profile = { isActive: false }
    }

    if (position) {
      where.profile = { ...where.profile, position }
    }

    // Fetch users with pagination
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          profile: true,
          _count: {
            select: {
              bookings: true,
              progress: true,
              videos: true
            }
          }
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      }),
      prisma.user.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireCoach()
    
    const body = await request.json()
    const { email, name, password, profile } = body

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password, // This should be hashed in production
        role: "USER",
        profile: profile ? {
          create: profile
        } : undefined
      },
      include: {
        profile: true
      }
    })

    return NextResponse.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create user" },
      { status: 500 }
    )
  }
}
