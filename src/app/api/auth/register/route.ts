import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword, isValidEmail, validatePassword, createVerificationToken } from "@/lib/auth-utils"
import { sendVerificationEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    console.log("Registration attempt:", { name, email, hasPassword: !!password })

    // Validate input
    if (!name || !email || !password) {
      console.log("Missing required fields:", { name: !!name, email: !!email, password: !!password })
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      )
    }

    // Validate email format
    if (!isValidEmail(email)) {
      console.log("Invalid email format:", email)
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Validate password strength
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      console.log("Password validation failed:", passwordValidation.errors)
      return NextResponse.json(
        { success: false, error: "Password validation failed", details: passwordValidation.errors },
        { status: 400 }
      )
    }

    // Check if user already exists
    console.log("Checking for existing user...")
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      console.log("User already exists:", email)
      return NextResponse.json(
        { success: false, error: "User with this email already exists" },
        { status: 409 }
      )
    }

    // Hash password
    console.log("Hashing password...")
    const hashedPassword = await hashPassword(password)

    // Create user
    console.log("Creating user in database...")
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase(),
        password: hashedPassword,
        role: "USER",
        emailVerified: false,
      }
    })

    console.log("User created successfully:", user.id)

    // Create verification token
    console.log("Creating verification token...")
    const verificationToken = await createVerificationToken(user.id)

    // Send verification email
    try {
      console.log("Sending verification email...")
      await sendVerificationEmail(user.email, user.name, verificationToken)
      console.log("Verification email sent successfully")
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError)
      // Don't fail the registration if email fails
    }

    return NextResponse.json({
      success: true,
      message: "Registration successful. Please check your email to verify your account.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
      }
    })

  } catch (error) {
    console.error("Registration error details:", error)
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")
    return NextResponse.json(
      { success: false, error: "Registration failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
