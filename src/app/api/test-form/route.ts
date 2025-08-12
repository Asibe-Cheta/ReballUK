import { NextRequest, NextResponse } from "next/server"
import { registerFormSchema } from "@/types/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Received form data:", JSON.stringify(body, null, 2))
    
    // Test validation without database
    const validationResult = registerFormSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: "Validation failed",
        details: validationResult.error.errors,
        receivedData: body
      }, { status: 400 })
    }
    
    return NextResponse.json({
      success: true,
      message: "Form validation passed!",
      validatedData: validationResult.data
    })
    
  } catch (error) {
    console.error("Test form error:", error)
    return NextResponse.json({
      success: false,
      error: "Server error: " + (error instanceof Error ? error.message : "Unknown error")
    }, { status: 500 })
  }
}
