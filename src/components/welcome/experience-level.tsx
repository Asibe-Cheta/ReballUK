"use client"

import { TrainingLevel } from "@prisma/client"
import { cn } from "@/lib/utils"
import { 
  FormControl,
  FormField, 
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form"
import { TRAINING_LEVEL_LABELS } from "@/types/profile"

interface ExperienceLevelProps {
  form: Record<string, unknown>
  name: string
  label?: string
  description?: string
}

const LEVEL_DESCRIPTIONS: Record<TrainingLevel, string> = {
  BEGINNER: "New to structured training, learning fundamental skills and techniques",
  INTERMEDIATE: "Comfortable with basics, looking to improve specific skills and tactics", 
  ADVANCED: "Strong technical ability, focusing on fine-tuning and advanced concepts",
  PROFESSIONAL: "Elite level training, match preparation and performance optimization"
}

const LEVEL_FEATURES: Record<TrainingLevel, string[]> = {
  BEGINNER: [
    "Basic ball control",
    "Fundamental techniques", 
    "Position awareness",
    "Simple tactics"
  ],
  INTERMEDIATE: [
    "Advanced techniques",
    "Tactical understanding",
    "Match situations",
    "Skill refinement"
  ],
  ADVANCED: [
    "Complex movements",
    "Game management", 
    "Leadership skills",
    "Performance analysis"
  ],
  PROFESSIONAL: [
    "Elite techniques",
    "Match preparation",
    "Mental conditioning",
    "Peak performance"
  ]
}

const LEVEL_COLORS: Record<TrainingLevel, string> = {
  BEGINNER: "from-green-500 to-green-600",
  INTERMEDIATE: "from-blue-500 to-blue-600", 
  ADVANCED: "from-purple-500 to-purple-600",
  PROFESSIONAL: "from-red-500 to-red-600"
}

const LEVEL_ICONS: Record<TrainingLevel, string> = {
  BEGINNER: "🌱",
  INTERMEDIATE: "🚀",
  ADVANCED: "⭐",
  PROFESSIONAL: "👑"
}

export default function ExperienceLevel({
  form,
  name,
  label = "Experience Level",
  description
}: ExperienceLevelProps) {
  const selectedLevel = form.watch(name)

  const handleLevelSelect = (level: TrainingLevel) => {
    form.setValue(name, level)
    form.trigger(name)
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base font-semibold">{label}</FormLabel>
          {description && (
            <p className="text-sm text-text-gray dark:text-medium-gray mb-4">
              {description}
            </p>
          )}
          <FormControl>
            <div className="space-y-3">
              {Object.entries(TrainingLevel).map(([key, level]) => {
                const isSelected = selectedLevel === level
                const icon = LEVEL_ICONS[level]
                const levelLabel = TRAINING_LEVEL_LABELS[level]
                const description = LEVEL_DESCRIPTIONS[level]
                const features = LEVEL_FEATURES[level]
                const gradientColor = LEVEL_COLORS[level]

                return (
                  <div
                    key={level}
                    onClick={() => handleLevelSelect(level)}
                    className={cn(
                      "relative cursor-pointer p-6 rounded-xl border-2 transition-all duration-300",
                      "bg-pure-white dark:bg-dark-gray border-light-gray dark:border-charcoal",
                      "hover:border-pure-black dark:hover:border-pure-white hover:shadow-lg",
                      {
                        "border-pure-black dark:border-pure-white bg-pure-black/5 dark:bg-pure-white/5": isSelected,
                        "ring-2 ring-pure-black/20 dark:ring-pure-white/20": isSelected,
                      }
                    )}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Level indicator */}
                      <div className={cn(
                        "flex items-center justify-center w-12 h-12 rounded-xl text-white text-xl font-bold",
                        "bg-gradient-to-br", gradientColor
                      )}>
                        {icon}
                      </div>

                      {/* Level content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className={cn(
                            "font-semibold text-lg transition-colors duration-300",
                            {
                              "text-pure-black dark:text-pure-white": isSelected,
                              "text-dark-text dark:text-light-gray": !isSelected,
                            }
                          )}>
                            {levelLabel}
                          </h3>
                          
                          {/* Selection indicator */}
                          {isSelected && (
                            <div className="w-4 h-4 bg-pure-black dark:bg-pure-white rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-pure-white dark:bg-pure-black rounded-full" />
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-sm text-text-gray dark:text-medium-gray mb-3">
                          {description}
                        </p>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-2">
                          {features.map((feature, index) => (
                            <div 
                              key={index}
                              className="flex items-center text-xs text-text-gray dark:text-medium-gray"
                            >
                              <div className={cn(
                                "w-1.5 h-1.5 rounded-full mr-2 bg-gradient-to-r",
                                gradientColor
                              )} />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Hover effect */}
                    <div className={cn(
                      "absolute inset-0 rounded-xl opacity-0 hover:opacity-5 transition-opacity duration-300",
                      "bg-gradient-to-br", gradientColor
                    )} />
                  </div>
                )
              })}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
