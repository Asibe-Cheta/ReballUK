"use client"

import { useState, useEffect } from "react"
import { useForm, Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { CalendarIcon, ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// Import welcome components
import StepIndicator from "@/components/welcome/step-indicator"
import PlayerPositionSelector from "@/components/welcome/player-position-selector"
import ExperienceLevel from "@/components/welcome/experience-level"
import TrainingGoals from "@/components/welcome/training-goals"
import ConfidenceRating from "@/components/welcome/confidence-rating"

// Import types and schemas
import {
  OnboardingStep,
  WelcomeFormData,
  welcomeFormSchema,
  personalInfoSchema,
  positionInfoSchema, 
  experienceInfoSchema,
  goalsInfoSchema,
  confidenceInfoSchema,
  preferencesInfoSchema,
  welcomeUtils,
  AGE_GROUP_LABELS,
  TRAINING_DAY_LABELS,
  TIME_SLOT_LABELS,
  TrainingDay,
  TimeSlot
} from "@/types/welcome"

// Local storage key for form persistence
const FORM_STORAGE_KEY = "reball-welcome-form"

export default function WelcomePage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  
  // Form state
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("personal")
  const [completedSteps, setCompletedSteps] = useState<OnboardingStep[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form setup
  const form = useForm<WelcomeFormData>({
    resolver: zodResolver(welcomeFormSchema) as Resolver<WelcomeFormData>,
    mode: "onChange",
    defaultValues: {
      personal: {
        firstName: "",
        lastName: "",
        ageGroup: "19-23",
        phoneNumber: "",
        emergencyContact: "",
      },
      position: {
        position: undefined,
        preferredFoot: "right",
        height: undefined,
        weight: undefined,
      },
      experience: {
        trainingLevel: undefined,
        yearsPlaying: undefined,
        currentClub: "",
        previousExperience: "",
        coachingExperience: false,
      },
      goals: {
        primaryGoals: [],
        specificAreas: "",
        shortTermGoals: "",
        longTermGoals: "",
      },
      confidence: {
        scenarios: {},
        overallConfidence: 5,
        areasForImprovement: [],
      },
      preferences: {
        availableDays: [],
        preferredTimes: [],
        sessionFrequency: "twice-week",
        sessionDuration: "60-min",
        trainingIntensity: "moderate",
        groupTraining: false,
        oneOnOneTraining: true,
      },
    },
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login-simple?callbackUrl=/welcome")
    }
  }, [isAuthenticated, authLoading, router])

  // Load saved form data on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem(FORM_STORAGE_KEY)
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData)
          if (parsedData.formData) {
            form.reset(parsedData.formData)
          }
          if (parsedData.currentStep) {
            setCurrentStep(parsedData.currentStep)
          }
          if (parsedData.completedSteps) {
            setCompletedSteps(parsedData.completedSteps)
          }
        } catch (error) {
          console.error("Error loading saved form data:", error)
        }
      }
    }
  }, [form])

  // Save form data on change
  useEffect(() => {
    if (typeof window !== "undefined") {
      const formData = form.getValues()
      const dataToSave = {
        formData,
        currentStep,
        completedSteps,
        timestamp: new Date().toISOString(),
      }
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(dataToSave))
    }
  }, [form.watch(), currentStep, completedSteps])

  const validateCurrentStep = async (): Promise<boolean> => {
    const formData = form.getValues()
    
    try {
      switch (currentStep) {
        case "personal":
          personalInfoSchema.parse(formData.personal)
          break
        case "position":
          positionInfoSchema.parse(formData.position)
          break
        case "experience":
          experienceInfoSchema.parse(formData.experience)
          break
        case "goals":
          goalsInfoSchema.parse(formData.goals)
          break
        case "confidence":
          confidenceInfoSchema.parse(formData.confidence)
          break
        case "preferences":
          preferencesInfoSchema.parse(formData.preferences)
          break
        case "review":
          welcomeFormSchema.parse(formData)
          break
        default:
          return true
      }
      return true
    } catch (error) {
      console.error("Validation error:", error)
      return false
    }
  }

  const handleNext = async () => {
    const isValid = await validateCurrentStep()
    
    if (!isValid) {
      toast.error("Please complete all required fields before continuing")
      return
    }

    // Mark current step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep])
    }

    // Move to next step
    const nextStep = welcomeUtils.getNextStep(currentStep)
    if (nextStep) {
      setCurrentStep(nextStep)
    }
  }

  const handlePrevious = () => {
    const prevStep = welcomeUtils.getPreviousStep(currentStep)
    if (prevStep) {
      setCurrentStep(prevStep)
    }
  }



  const handleSubmit = async (data: WelcomeFormData) => {
    if (!user?.id) {
      toast.error("User not found. Please sign in again.")
      return
    }

    setIsSubmitting(true)

    try {
      // Format data for API
      const profileData = welcomeUtils.formatFormDataForAPI(data)

      // Submit to API
      const response = await fetch("/api/profile/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      })

      const result = await response.json()

      if (result.success) {
        // Clear saved form data
        localStorage.removeItem(FORM_STORAGE_KEY)
        
        toast.success("Welcome to REBALL! Your profile has been created.")
        router.push("/dashboard")
      } else {
        throw new Error(result.error || "Failed to create profile")
      }
    } catch (error) {
      console.error("Profile creation error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create profile")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case "personal":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="font-marker text-3xl mb-2">Personal Information</h2>
              <p className="text-text-gray dark:text-medium-gray">
                Let&apos;s start with some basic information about you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="personal.firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="personal.lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="personal.dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Birth (Optional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="personal.ageGroup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age Group *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your age group" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(AGE_GROUP_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="personal.phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="+44 123 456 7890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="personal.emergencyContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emergency Contact (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Name and phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )

      case "position":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="font-marker text-3xl mb-2">Playing Position</h2>
              <p className="text-text-gray dark:text-medium-gray">
                Tell us about your role on the field and physical attributes
              </p>
            </div>

            <PlayerPositionSelector
              form={form}
              name="position.position"
              description="Choose your primary playing position to receive personalized training content"
            />

            <FormField
              control={form.control}
              name="position.preferredFoot"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Foot *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your preferred foot" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="position.height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (cm) - Optional</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="175" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position.weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg) - Optional</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="70" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )

      case "experience":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="font-marker text-3xl mb-2">Experience Level</h2>
              <p className="text-text-gray dark:text-medium-gray">
                Help us understand your football background and experience
              </p>
            </div>

            <ExperienceLevel
              form={form}
              name="experience.trainingLevel"
              description="Select the level that best describes your current training and skill level"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="experience.yearsPlaying"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years Playing Football (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="5" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experience.currentClub"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Club (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Manchester United FC" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="experience.previousExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Previous Experience (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us about your football journey, previous clubs, achievements, etc."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experience.coachingExperience"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I have coaching or mentoring experience
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
        )

      case "goals":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="font-marker text-3xl mb-2">Training Goals</h2>
              <p className="text-text-gray dark:text-medium-gray">
                What would you like to achieve through your training with REBALL?
              </p>
            </div>

            <TrainingGoals
              form={form}
              name="goals.primaryGoals"
              description="Select your main training objectives (1-5 goals)"
            />

            <FormField
              control={form.control}
              name="goals.specificAreas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specific Areas to Improve (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe any specific skills or areas you'd like to focus on..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="goals.shortTermGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short-term Goals (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Goals for the next 3-6 months..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="goals.longTermGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Long-term Goals (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Goals for the next 1-2 years..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )

      case "confidence":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="font-marker text-3xl mb-2">Confidence Assessment</h2>
              <p className="text-text-gray dark:text-medium-gray">
                Rate your confidence in different 1v1 situations to help us personalize your training
              </p>
            </div>

            <ConfidenceRating
              form={form}
              name="confidence"
              description="Honest self-assessment helps us create the most effective training plan for you"
            />
          </div>
        )

      case "preferences":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="font-marker text-3xl mb-2">Training Preferences</h2>
              <p className="text-text-gray dark:text-medium-gray">
                When and how would you prefer to train?
              </p>
            </div>

            <FormField
              control={form.control}
              name="preferences.availableDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available Days *</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                    {Object.entries(TRAINING_DAY_LABELS).map(([day, label]) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox
                          id={day}
                          checked={field.value?.includes(day as TrainingDay)}
                          onCheckedChange={(checked) => {
                            const current = field.value || []
                            if (checked) {
                              field.onChange([...current, day])
                            } else {
                              field.onChange(current.filter((d: string) => d !== day))
                            }
                          }}
                        />
                        <label htmlFor={day} className="text-sm font-medium">
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferences.preferredTimes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Time Slots *</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    {Object.entries(TIME_SLOT_LABELS).map(([time, label]) => (
                      <div key={time} className="flex items-center space-x-2">
                        <Checkbox
                          id={time}
                          checked={field.value?.includes(time as TimeSlot)}
                          onCheckedChange={(checked) => {
                            const current = field.value || []
                            if (checked) {
                              field.onChange([...current, time])
                            } else {
                              field.onChange(current.filter((t: string) => t !== time))
                            }
                          }}
                        />
                        <label htmlFor={time} className="text-sm font-medium">
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="preferences.sessionFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Training Frequency *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="How often?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="once-week">Once per week</SelectItem>
                        <SelectItem value="twice-week">Twice per week</SelectItem>
                        <SelectItem value="three-times-week">3 times per week</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferences.sessionDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session Duration *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="How long?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="30-min">30 minutes</SelectItem>
                        <SelectItem value="45-min">45 minutes</SelectItem>
                        <SelectItem value="60-min">60 minutes</SelectItem>
                        <SelectItem value="90-min">90 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="preferences.trainingIntensity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Training Intensity *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select intensity" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low - Light training, focus on technique</SelectItem>
                      <SelectItem value="moderate">Moderate - Balanced approach</SelectItem>
                      <SelectItem value="high">High - Intense training sessions</SelectItem>
                      <SelectItem value="very-high">Very High - Maximum intensity</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="preferences.oneOnOneTraining"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I&apos;m interested in 1-on-1 training sessions
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferences.groupTraining"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I&apos;m interested in group training sessions
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
        )

      case "review":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="font-marker text-3xl mb-2">Review & Complete</h2>
              <p className="text-text-gray dark:text-medium-gray">
                Review your information and complete your REBALL profile
              </p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Personal info summary */}
              <div className="p-4 bg-light-gray dark:bg-charcoal rounded-xl">
                <h3 className="font-semibold mb-2">Personal Information</h3>
                <div className="text-sm space-y-1">
                  <p><strong>Name:</strong> {form.getValues("personal.firstName")} {form.getValues("personal.lastName")}</p>
                  <p><strong>Age Group:</strong> {AGE_GROUP_LABELS[form.getValues("personal.ageGroup")]}</p>
                </div>
              </div>

              {/* Position summary */}
              <div className="p-4 bg-light-gray dark:bg-charcoal rounded-xl">
                <h3 className="font-semibold mb-2">Position & Physical</h3>
                <div className="text-sm space-y-1">
                  <p><strong>Position:</strong> {form.getValues("position.position")}</p>
                  <p><strong>Preferred Foot:</strong> {form.getValues("position.preferredFoot")}</p>
                </div>
              </div>

              {/* Experience summary */}
              <div className="p-4 bg-light-gray dark:bg-charcoal rounded-xl">
                <h3 className="font-semibold mb-2">Experience</h3>
                <div className="text-sm space-y-1">
                  <p><strong>Level:</strong> {form.getValues("experience.trainingLevel")}</p>
                  {form.getValues("experience.yearsPlaying") && (
                    <p><strong>Years Playing:</strong> {form.getValues("experience.yearsPlaying")}</p>
                  )}
                </div>
              </div>

                             {/* Goals summary */}
               <div className="p-4 bg-light-gray dark:bg-charcoal rounded-xl">
                 <h3 className="font-semibold mb-2">Training Goals</h3>
                 <div className="text-sm">
                   <p><strong>Primary Goals:</strong> {form.getValues("goals.primaryGoals")?.length || 0} selected</p>
                 </div>
               </div>
            </div>

            <div className="p-6 bg-pure-black/5 dark:bg-pure-white/5 rounded-xl border border-pure-black/10 dark:border-pure-white/10">
              <h3 className="font-semibold mb-3">🎉 Ready to start your REBALL journey?</h3>
              <p className="text-sm text-text-gray dark:text-medium-gray mb-4">
                You&apos;re about to join thousands of players who have improved their 1v1 game through our proven training methods. 
                Your personalized training program will be ready as soon as you complete this final step.
              </p>
              <div className="text-xs text-text-gray dark:text-medium-gray">
                By completing your profile, you agree to our Terms of Service and Privacy Policy.
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-light-gray to-pure-white dark:from-charcoal dark:to-dark-gray py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-marker text-4xl mb-2">Welcome to REBALL</h1>
          <p className="text-text-gray dark:text-medium-gray">
            Let&apos;s create your personalized training profile
          </p>
        </div>

        {/* Step indicator */}
        <StepIndicator
          currentStep={currentStep}
          completedSteps={completedSteps}
          className="mb-8"
        />

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            {/* Step content */}
            <div className="bg-pure-white dark:bg-dark-gray rounded-2xl p-8 shadow-lg">
              {renderStepContent()}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={welcomeUtils.getPreviousStep(currentStep) === null}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>

              <div className="text-sm text-text-gray dark:text-medium-gray">
                Step {welcomeUtils.getStepIndex(currentStep) + 1} of {7}
              </div>

              {currentStep === "review" ? (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating Profile...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
