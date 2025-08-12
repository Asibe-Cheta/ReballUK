"use client"

import { Check } from "lucide-react"
import { OnboardingStep, ONBOARDING_STEPS, welcomeUtils } from "@/types/welcome"
import { cn } from "@/lib/utils"

interface StepIndicatorProps {
  currentStep: OnboardingStep
  completedSteps: OnboardingStep[]
  className?: string
}

export default function StepIndicator({ 
  currentStep, 
  completedSteps, 
  className 
}: StepIndicatorProps) {
  const currentIndex = welcomeUtils.getStepIndex(currentStep)
  const progressPercentage = welcomeUtils.getProgressPercentage(currentStep)

  return (
    <div className={cn("w-full", className)}>
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-text-gray dark:text-medium-gray mb-2">
          <span>Progress</span>
          <span>{progressPercentage}% Complete</span>
        </div>
        <div className="w-full bg-light-gray dark:bg-charcoal rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-pure-black to-gray-700 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Step indicators */}
      <div className="hidden lg:flex justify-between">
        {ONBOARDING_STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id)
          const isCurrent = step.id === currentStep
          const isPast = index < currentIndex

          return (
            <div key={step.id} className="flex flex-col items-center flex-1">
              {/* Step circle */}
              <div className={cn(
                "relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300",
                {
                  "bg-pure-black border-pure-black text-pure-white": isCompleted || isCurrent,
                  "bg-pure-white dark:bg-dark-gray border-light-gray dark:border-charcoal text-text-gray dark:text-medium-gray": !isCompleted && !isCurrent,
                  "ring-4 ring-pure-black/20 dark:ring-pure-white/20": isCurrent,
                }
              )}>
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-semibold">{index + 1}</span>
                )}
              </div>

              {/* Step label */}
              <div className="text-center mt-2">
                <div className={cn(
                  "text-xs font-medium transition-colors duration-300",
                  {
                    "text-pure-black dark:text-pure-white": isCurrent || isCompleted,
                    "text-text-gray dark:text-medium-gray": !isCurrent && !isCompleted,
                  }
                )}>
                  {step.title}
                </div>
                {step.estimatedTime && (
                  <div className="text-xs text-text-gray dark:text-medium-gray mt-1">
                    {step.estimatedTime}
                  </div>
                )}
              </div>

              {/* Connector line */}
              {index < ONBOARDING_STEPS.length - 1 && (
                <div className={cn(
                  "absolute top-4 left-1/2 w-full h-0.5 -z-10 transition-colors duration-300",
                  {
                    "bg-pure-black dark:bg-pure-white": isPast || isCompleted,
                    "bg-light-gray dark:bg-charcoal": !isPast && !isCompleted,
                  }
                )} style={{ marginLeft: '1rem' }} />
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile step indicator */}
      <div className="lg:hidden flex items-center justify-center">
        <div className="text-center">
          <div className="text-sm font-medium text-pure-black dark:text-pure-white mb-1">
            Step {currentIndex + 1} of {ONBOARDING_STEPS.length}
          </div>
          <div className="text-xs text-text-gray dark:text-medium-gray">
            {ONBOARDING_STEPS[currentIndex]?.title}
          </div>
        </div>
      </div>
    </div>
  )
}
