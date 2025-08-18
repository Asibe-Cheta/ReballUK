"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  ArrowLeft, 
  Calendar, 
  Target, 
  Users, 
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { toast } from "sonner"
import { ErrorBoundary } from "@/components/ui/error-boundary"

// Import booking components
import SessionTypeSelector, { SessionType } from "@/components/bookings/session-type-selector"
import TrainingPositionSelector, { PlayerPosition } from "@/components/bookings/training-position-selector"
import TimeSlotPicker from "@/components/bookings/time-slot-picker"
import BookingSummary from "@/components/bookings/booking-summary"

type BookingStep = "session-type" | "position" | "datetime" | "summary"

export default function BookingsPage() {
  return (
    <ErrorBoundary>
      <BookingsContent />
    </ErrorBoundary>
  )
}

function BookingsContent() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  
  // Booking state
  const [currentStep, setCurrentStep] = useState<BookingStep>("session-type")
  const [sessionType, setSessionType] = useState<SessionType | null>(null)
  const [position, setPosition] = useState<PlayerPosition | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if not authenticated
  if (!authLoading && !user) {
    router.push("/login?callbackUrl=/bookings")
    return null
  }

  const steps = [
    { id: "session-type", title: "Session Type", icon: Users },
    { id: "position", title: "Position", icon: Target },
    { id: "datetime", title: "Date & Time", icon: Calendar },
    { id: "summary", title: "Summary", icon: CheckCircle }
  ]

  const currentStepIndex = steps.findIndex(step => step.id === currentStep)

  const handleNext = () => {
    switch (currentStep) {
      case "session-type":
        if (sessionType) {
          setCurrentStep("position")
        } else {
          toast.error("Please select a session type")
        }
        break
      case "position":
        if (position) {
          setCurrentStep("datetime")
        } else {
          toast.error("Please select a training position")
        }
        break
      case "datetime":
        if (selectedDate && selectedTime) {
          setCurrentStep("summary")
        } else {
          toast.error("Please select a date and time")
        }
        break
    }
  }

  const handleBack = () => {
    switch (currentStep) {
      case "position":
        setCurrentStep("session-type")
        break
      case "datetime":
        setCurrentStep("position")
        break
      case "summary":
        setCurrentStep("datetime")
        break
    }
  }

  const handleConfirmBooking = async () => {
    if (!sessionType || !position || !selectedDate || !selectedTime) {
      toast.error("Please complete all booking details")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionType,
          position,
          date: selectedDate.toISOString(),
          time: selectedTime,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create booking")
      }

      const result = await response.json()
      
      if (result.success) {
        toast.success("Booking confirmed successfully!")
        router.push("/dashboard")
      } else {
        throw new Error(result.error || "Failed to create booking")
      }
    } catch (error) {
      console.error("Booking error:", error)
      toast.error("Failed to create booking. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "session-type":
        return (
          <SessionTypeSelector
            selectedType={sessionType}
            onSelect={setSessionType}
          />
        )
      case "position":
        return (
          <TrainingPositionSelector
            selectedPosition={position}
            onSelect={setPosition}
          />
        )
      case "datetime":
        return (
          <TimeSlotPicker
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onDateSelect={setSelectedDate}
            onTimeSelect={setSelectedTime}
          />
        )
      case "summary":
        return (
          <BookingSummary
            sessionType={sessionType}
            position={position}
            date={selectedDate}
            time={selectedTime}
            onConfirm={handleConfirmBooking}
            onBack={handleBack}
            isLoading={isSubmitting}
          />
        )
      default:
        return null
    }
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Book Training Session</h1>
            <p className="text-muted-foreground">
              Schedule your next football training session
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Progress Bar */}
            <Progress 
              value={((currentStepIndex + 1) / steps.length) * 100} 
              className="h-2"
            />
            
            {/* Step Indicators */}
            <div className="flex justify-between">
              {steps.map((step, index) => {
                const StepIcon = step.icon
                const isCompleted = index < currentStepIndex
                const isCurrent = index === currentStepIndex
                
                return (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center gap-2 ${
                      isCompleted ? "text-primary" : 
                      isCurrent ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center border-2
                      ${isCompleted ? "bg-primary border-primary text-primary-foreground" :
                        isCurrent ? "border-primary bg-primary/10" :
                        "border-muted-foreground"
                      }
                    `}>
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <StepIcon className="h-5 w-5" />
                      )}
                    </div>
                    <span className="text-xs font-medium text-center">
                      {step.title}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Step Content */}
      <div className="min-h-[500px]">
        {renderCurrentStep()}
      </div>

      {/* Navigation Buttons */}
      {currentStep !== "summary" && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === "session-type"}
              >
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={
                  (currentStep === "session-type" && !sessionType) ||
                  (currentStep === "position" && !position) ||
                  (currentStep === "datetime" && (!selectedDate || !selectedTime))
                }
              >
                {currentStep === "datetime" ? "Review Booking" : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Booking Info */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
            <AlertCircle className="h-5 w-5" />
            Booking Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
          <p>• Training sessions are held at our London training center</p>
          <p>• Sessions run Monday-Friday, 9 AM - 8 PM</p>
          <p>• Group sessions require minimum 3 players to proceed</p>
          <p>• Payment will be processed after booking confirmation</p>
          <p>• Free cancellation up to 24 hours before your session</p>
        </CardContent>
      </Card>
    </div>
  )
}
