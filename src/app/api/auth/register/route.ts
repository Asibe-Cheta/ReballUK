import { NextRequest, NextResponse } from "next/server"
import { createClient } from '@supabase/supabase-js'
import { isValidEmail, validatePassword } from "@/lib/auth-utils"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, captchaToken } = await request.json()


    // Validate input
    if (!name || !email || !password) {
      console.log("Missing required fields:", { name: !!name, email: !!email, password: !!password })
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      )
    }

    // Log captcha token status for debugging
    console.log("Registration attempt:", { 
      name, 
      email, 
      hasPassword: !!password,
      hasCaptchaToken: !!captchaToken,
      captchaTokenLength: captchaToken?.length || 0
    })

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

    // Create Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { success: false, error: "Supabase configuration missing" },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Check if user already exists
    const { data: existingUser } = await supabase.auth.getUser()
    if (existingUser.user) {
      return NextResponse.json(
        { success: false, error: "User with this email already exists" },
        { status: 409 }
      )
    }

    // Create user with Supabase Auth (with captcha token if provided)
    const signUpOptions: any = {
      data: {
        full_name: name,
      }
    }

    // Add captcha token if provided
    if (captchaToken) {
      signUpOptions.captchaToken = captchaToken
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password,
      options: signUpOptions
    })

    if (error) {
      console.error("Supabase signup error:", error)
      console.error("Error details:", {
        message: error.message,
        status: error.status,
        name: error.name
      })
      
      // Check if it's specifically an email sending error
      if (error.message.includes('email') || error.message.includes('confirmation')) {
        return NextResponse.json(
          { success: false, error: "Error sending confirmation email" },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      )
    }

    if (!data.user) {
      return NextResponse.json(
        { success: false, error: "Failed to create user" },
        { status: 500 }
      )
    }

    // Log successful signup details
    console.log("Supabase signup successful:", {
      userId: data.user.id,
      email: data.user.email,
      emailConfirmed: data.user.email_confirmed_at,
      session: data.session ? "present" : "absent"
    })

    // Create profile record
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: data.user.id,
        player_name: name,
        contact_email: email.toLowerCase(),
        welcome_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (profileError) {
      console.error("Profile creation error:", profileError)
      // Don't fail the registration if profile creation fails
      // The user can complete their profile later
    }

    return NextResponse.json({
      success: true,
      message: "Registration successful. Please check your email to verify your account."
    })

          } catch (error) {
          console.error("Registration error details:", error)
          console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")
          
          // Check if it's a database connection error
          if (error instanceof Error && error.message.includes('ECONNREFUSED')) {
            return NextResponse.json(
              { success: false, error: "Database connection failed. Please try again in a moment." },
              { status: 503 }
            )
          }
          
          return NextResponse.json(
            { success: false, error: "Registration failed", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
          )
        }
}
