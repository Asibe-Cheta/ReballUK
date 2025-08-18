import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Name, email, and password are required" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create coach user
    const coach = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "COACH",
        emailVerified: true, // Auto-verify coach accounts
        profile: {
          create: {
            firstName: name.split(' ')[0] || name,
            lastName: name.split(' ').slice(1).join(' ') || '',
            trainingLevel: "ADVANCED",
            isActive: true
          }
        }
      },
      include: {
        profile: true
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: coach.id,
        name: coach.name,
        email: coach.email,
        role: coach.role
      },
      message: "Coach account created successfully"
    })
  } catch (error) {
    console.error("Error creating coach:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create coach account" },
      { status: 500 }
    )
  }
}
