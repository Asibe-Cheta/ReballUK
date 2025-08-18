"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
import { 
  FormControl,
  FormField, 
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form"
import { 
  ConfidenceScenario, 
  CONFIDENCE_SCENARIO_LABELS,
  CONFIDENCE_SCENARIOS 
} from "@/types/welcome"

interface ConfidenceRatingProps {
  form: any
  name: string
  label?: string
  description?: string
}

const SCENARIO_DESCRIPTIONS: Record<ConfidenceScenario, string> = {
  "attacking-1v1": "How confident are you when taking on a defender in 1v1 situations?",
  "defending-1v1": "How confident are you when defending against an attacker in 1v1 situations?", 
  "aerial-duels": "How confident are you in winning headers and aerial challenges?",
  "pace-battles": "How confident are you in races for the ball and speed situations?",
  "skill-moves": "How confident are you performing skill moves and tricks?",
  "finishing-pressure": "How confident are you finishing chances under pressure?",
  "physical-challenges": "How confident are you in physical duels and challenges?",
  "decision-making": "How confident are you making quick decisions in pressure situations?"
}

const SCENARIO_ICONS: Record<ConfidenceScenario, string> = {
  "attacking-1v1": "⚡",
  "defending-1v1": "🛡️",
  "aerial-duels": "🦅", 
  "pace-battles": "🏃",
  "skill-moves": "✨",
  "finishing-pressure": "🎯",
  "physical-challenges": "💪",
  "decision-making": "🧠"
}

const CONFIDENCE_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: "Very Low", color: "text-red-500" },
  2: { label: "Low", color: "text-red-400" },
  3: { label: "Below Average", color: "text-orange-500" },
  4: { label: "Below Average", color: "text-orange-400" },
  5: { label: "Average", color: "text-yellow-500" },
  6: { label: "Above Average", color: "text-yellow-400" },
  7: { label: "Good", color: "text-green-400" },
  8: { label: "Very Good", color: "text-green-500" },
  9: { label: "Excellent", color: "text-green-600" },
  10: { label: "Outstanding", color: "text-green-700" }
}

export default function ConfidenceRating({
  form,
  name,
  label = "Confidence Assessment",
  description
}: ConfidenceRatingProps) {
  const [ratings, setRatings] = useState<Record<ConfidenceScenario, number>>(
    form.watch(name)?.scenarios || {}
  )
  
  const [overallRating, setOverallRating] = useState<number>(
    form.watch(name)?.overallConfidence || 5
  )

  useEffect(() => {
    // Calculate average when individual ratings change
    const values = Object.values(ratings).filter(Boolean)
    if (values.length > 0) {
      const average = Math.round(values.reduce((sum, val) => sum + val, 0) / values.length)
      setOverallRating(average)
    }
  }, [ratings])

  useEffect(() => {
    // Update form values
    form.setValue(`${name}.scenarios`, ratings)
    form.setValue(`${name}.overallConfidence`, overallRating)
    form.trigger(name)
  }, [ratings, overallRating, form, name])

  const handleRatingChange = (scenario: ConfidenceScenario, value: number) => {
    setRatings(prev => ({
      ...prev,
      [scenario]: value
    }))
  }

  const getRatingDisplay = (value: number) => {
    const config = CONFIDENCE_LABELS[value]
    return (
      <span className={cn("font-medium", config.color)}>
        {value}/10 - {config.label}
      </span>
    )
  }

  const completedRatings = Object.keys(ratings).length
  const totalRatings = CONFIDENCE_SCENARIOS.length

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base font-semibold">{label}</FormLabel>
          {description && (
            <p className="text-sm text-text-gray dark:text-medium-gray mb-2">
              {description}
            </p>
          )}
          <div className="text-sm text-text-gray dark:text-medium-gray mb-6">
            Rate your confidence from 1 (very low) to 10 (outstanding) • {completedRatings}/{totalRatings} completed
          </div>

          <FormControl>
            <div className="space-y-6">
              {/* Overall confidence display */}
              <div className="p-4 bg-light-gray dark:bg-charcoal rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-pure-black dark:text-pure-white">
                    Overall Confidence
                  </h3>
                  <div className="text-2xl">🎯</div>
                </div>
                <div className="text-lg">
                  {getRatingDisplay(overallRating)}
                </div>
                <div className="text-sm text-text-gray dark:text-medium-gray mt-1">
                  {completedRatings > 0 
                    ? "Calculated from your individual ratings"
                    : "Complete individual ratings to see overall score"
                  }
                </div>
              </div>

              {/* Individual scenario ratings */}
              <div className="space-y-4">
                {CONFIDENCE_SCENARIOS.map(scenario => {
                  const currentRating = ratings[scenario] || 5
                  const icon = SCENARIO_ICONS[scenario]
                  const scenarioLabel = CONFIDENCE_SCENARIO_LABELS[scenario]
                  const scenarioDescription = SCENARIO_DESCRIPTIONS[scenario]

                  return (
                    <div
                      key={scenario}
                      className="p-4 bg-pure-white dark:bg-dark-gray border border-light-gray dark:border-charcoal rounded-xl"
                    >
                      {/* Scenario header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="text-xl">{icon}</div>
                          <div>
                            <h4 className="font-medium text-pure-black dark:text-pure-white">
                              {scenarioLabel}
                            </h4>
                            <p className="text-sm text-text-gray dark:text-medium-gray">
                              {scenarioDescription}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Rating slider */}
                      <div className="space-y-3">
                        <Slider
                          value={[currentRating]}
                          onValueChange={(value) => handleRatingChange(scenario, value[0])}
                          max={10}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                        
                        {/* Rating display */}
                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            {getRatingDisplay(currentRating)}
                          </div>
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                              <button
                                key={num}
                                onClick={() => handleRatingChange(scenario, num)}
                                className={cn(
                                  "w-8 h-8 rounded-full text-xs font-medium transition-all duration-200",
                                  "border border-light-gray dark:border-charcoal",
                                  {
                                    "bg-pure-black dark:bg-pure-white text-pure-white dark:text-pure-black border-pure-black dark:border-pure-white": currentRating === num,
                                    "bg-pure-white dark:bg-dark-gray text-text-gray dark:text-medium-gray hover:border-pure-black dark:hover:border-pure-white": currentRating !== num,
                                  }
                                )}
                              >
                                {num}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Progress indicator */}
              <div className="p-3 bg-light-gray dark:bg-charcoal rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-pure-black dark:text-pure-white font-medium">
                    Assessment Progress
                  </span>
                  <span className="text-text-gray dark:text-medium-gray">
                    {completedRatings}/{totalRatings} scenarios rated
                  </span>
                </div>
                <div className="w-full bg-pure-white dark:bg-dark-gray rounded-full h-2 mt-2">
                  <div 
                    className="bg-pure-black dark:bg-pure-white h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(completedRatings / totalRatings) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
