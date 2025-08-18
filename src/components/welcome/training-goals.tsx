"use client"

import { useState, useEffect } from "react"
import { Check, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { 
  FormControl,
  FormField, 
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form"
import { TrainingGoal, TRAINING_GOAL_LABELS } from "@/types/welcome"

interface TrainingGoalsProps {
  form: any
  name: string
  label?: string
  description?: string
  maxSelections?: number
  minSelections?: number
}

const GOAL_CATEGORIES = {
  technical: {
    label: "Technical Skills",
    goals: ["improve-finishing", "enhance-dribbling", "increase-pace"] as TrainingGoal[],
    color: "from-blue-500 to-blue-600",
    icon: "⚽"
  },
  tactical: {
    label: "Tactical Awareness", 
    goals: ["better-positioning", "tactical-awareness", "decision-making"] as TrainingGoal[],
    color: "from-purple-500 to-purple-600",
    icon: "🧠"
  },
  physical: {
    label: "Physical & Mental",
    goals: ["physical-fitness", "mental-strength", "build-confidence"] as TrainingGoal[],
    color: "from-green-500 to-green-600", 
    icon: "💪"
  },
  preparation: {
    label: "Match Preparation",
    goals: ["match-preparation", "teamwork-skills"] as TrainingGoal[],
    color: "from-orange-500 to-orange-600",
    icon: "🎯"
  }
}

const GOAL_DESCRIPTIONS: Record<TrainingGoal, string> = {
  "improve-finishing": "Master shooting techniques and goal-scoring accuracy",
  "enhance-dribbling": "Develop close control and ability to beat defenders",
  "better-positioning": "Learn optimal positioning for your role on the field",
  "increase-pace": "Improve speed, acceleration, and explosive movements", 
  "build-confidence": "Develop mental strength and self-belief in 1v1 situations",
  "tactical-awareness": "Understand game situations and make smarter decisions",
  "physical-fitness": "Build strength, endurance, and overall athletic performance",
  "mental-strength": "Develop focus, resilience, and mental toughness",
  "teamwork-skills": "Improve communication and team coordination",
  "match-preparation": "Learn pre-game routines and performance optimization"
}

export default function TrainingGoals({
  form,
  name,
  label = "Training Goals",
  description,
  maxSelections = 5,
  minSelections = 1
}: TrainingGoalsProps) {
  const [selectedGoals, setSelectedGoals] = useState<TrainingGoal[]>(
    form.watch(name) || []
  )

  useEffect(() => {
    form.setValue(name, selectedGoals)
    form.trigger(name)
  }, [selectedGoals, form, name])

  const handleGoalToggle = (goal: TrainingGoal) => {
    setSelectedGoals(prev => {
      if (prev.includes(goal)) {
        // Remove goal
        return prev.filter(g => g !== goal)
      } else {
        // Add goal (if under max limit)
        if (prev.length < maxSelections) {
          return [...prev, goal]
        }
        return prev
      }
    })
  }

  const isSelected = (goal: TrainingGoal) => selectedGoals.includes(goal)
  const canSelectMore = selectedGoals.length < maxSelections
  const hasMinimum = selectedGoals.length >= minSelections

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
          <div className="text-sm text-text-gray dark:text-medium-gray mb-4">
            Select {minSelections}-{maxSelections} goals • {selectedGoals.length}/{maxSelections} selected
          </div>
          
          <FormControl>
            <div className="space-y-6">
              {Object.entries(GOAL_CATEGORIES).map(([key, category]) => (
                <div key={key} className="space-y-3">
                  {/* Category header */}
                  <div className="flex items-center space-x-2">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm",
                      "bg-gradient-to-br", category.color
                    )}>
                      {category.icon}
                    </div>
                    <h3 className="font-semibold text-pure-black dark:text-pure-white">
                      {category.label}
                    </h3>
                  </div>

                  {/* Goals in category */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-2">
                    {category.goals.map(goal => {
                      const selected = isSelected(goal)
                      const disabled = !selected && !canSelectMore
                      const goalLabel = TRAINING_GOAL_LABELS[goal]
                      const goalDescription = GOAL_DESCRIPTIONS[goal]

                      return (
                        <div
                          key={goal}
                          onClick={() => !disabled && handleGoalToggle(goal)}
                          className={cn(
                            "relative cursor-pointer p-4 rounded-lg border-2 transition-all duration-300",
                            "bg-pure-white dark:bg-dark-gray",
                            {
                              "border-pure-black dark:border-pure-white bg-pure-black/5 dark:bg-pure-white/5": selected,
                              "border-light-gray dark:border-charcoal hover:border-pure-black dark:hover:border-pure-white": !selected && !disabled,
                              "border-light-gray dark:border-charcoal opacity-50 cursor-not-allowed": disabled,
                            }
                          )}
                        >
                          {/* Selection indicator */}
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className={cn(
                                "font-medium transition-colors duration-300",
                                {
                                  "text-pure-black dark:text-pure-white": selected,
                                  "text-dark-text dark:text-light-gray": !selected && !disabled,
                                  "text-text-gray dark:text-medium-gray": disabled,
                                }
                              )}>
                                {goalLabel}
                              </div>
                            </div>
                            
                            <div className={cn(
                              "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                              {
                                "bg-pure-black dark:bg-pure-white border-pure-black dark:border-pure-white": selected,
                                                              "border-light-gray dark:border-charcoal": !selected && !disabled,
                              "border-light-gray dark:border-charcoal opacity-50": disabled,
                              }
                            )}>
                              {selected ? (
                                <Check className="w-3 h-3 text-pure-white dark:text-pure-black" />
                              ) : disabled ? (
                                <X className="w-3 h-3 text-text-gray dark:text-medium-gray" />
                              ) : (
                                <Plus className="w-3 h-3 text-text-gray dark:text-medium-gray" />
                              )}
                            </div>
                          </div>

                          {/* Goal description */}
                          <p className="text-xs text-text-gray dark:text-medium-gray leading-relaxed">
                            {goalDescription}
                          </p>

                          {/* Selection effect */}
                          {selected && (
                            <div className={cn(
                              "absolute inset-0 rounded-lg opacity-10 bg-gradient-to-br",
                              category.color
                            )} />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </FormControl>

          {/* Selection summary */}
          {selectedGoals.length > 0 && (
            <div className="mt-4 p-3 bg-light-gray dark:bg-charcoal rounded-lg">
              <div className="text-sm font-medium text-pure-black dark:text-pure-white mb-2">
                Selected Goals:
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedGoals.map(goal => (
                  <span
                    key={goal}
                    className="inline-flex items-center px-2 py-1 bg-pure-black dark:bg-pure-white text-pure-white dark:text-pure-black text-xs rounded-full"
                  >
                    {TRAINING_GOAL_LABELS[goal]}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleGoalToggle(goal)
                      }}
                      className="ml-1 hover:bg-pure-white/20 dark:hover:bg-pure-black/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <FormMessage />
        </FormItem>
      )}
    />
  )
}
