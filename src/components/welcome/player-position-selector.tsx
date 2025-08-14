"use client"

import { useState } from "react"
import { PlayerPosition } from "@prisma/client"
import { cn } from "@/lib/utils"
import { 
  FormControl,
  FormField, 
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form"
import { PLAYER_POSITION_LABELS } from "@/types/profile"

interface PlayerPositionSelectorProps {
  form: Record<string, unknown>
  name: string
  label?: string
  description?: string
}

const POSITION_DESCRIPTIONS: Record<PlayerPosition, string> = {
  STRIKER: "Lead the attack, score goals, and create chances in the final third",
  WINGER: "Provide width, deliver crosses, and support both attack and defense",
  CAM: "Control the game from behind the striker, create chances and score goals",
  FULLBACK: "Defend the flanks while providing attacking support down the wings",
  MIDFIELDER: "Link defense and attack, control possession, and dictate tempo",
  DEFENDER: "Protect the goal, win aerial duels, and organize the defensive line",
  GOALKEEPER: "Guard the goal, distribute the ball, and command the penalty area",
  OTHER: "Multiple positions or still exploring your best role on the field"
}

const POSITION_ICONS: Record<PlayerPosition, string> = {
  STRIKER: "⚽",
  WINGER: "🏃",
  CAM: "🎯",
  FULLBACK: "🛡️",
  MIDFIELDER: "⚙️", 
  DEFENDER: "🏰",
  GOALKEEPER: "🥅",
  OTHER: "❓"
}

export default function PlayerPositionSelector({
  form,
  name,
  label = "Playing Position",
  description
}: PlayerPositionSelectorProps) {
  const [selectedPosition, setSelectedPosition] = useState<PlayerPosition | null>(
    form.watch(name) || null
  )

  const handlePositionSelect = (position: PlayerPosition) => {
    setSelectedPosition(position)
    form.setValue(name, position)
    form.trigger(name) // Trigger validation
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {Object.entries(PlayerPosition).map(([key, position]) => {
                const isSelected = selectedPosition === position
                const icon = POSITION_ICONS[position]
                const label = PLAYER_POSITION_LABELS[position]
                const description = POSITION_DESCRIPTIONS[position]

                return (
                  <div
                    key={position}
                    onClick={() => handlePositionSelect(position)}
                    className={cn(
                      "relative cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 group hover:scale-105",
                      "bg-pure-white dark:bg-dark-gray border-light-gray dark:border-charcoal",
                      "hover:border-pure-black dark:hover:border-pure-white hover:shadow-lg",
                      {
                        "border-pure-black dark:border-pure-white bg-pure-black/5 dark:bg-pure-white/5": isSelected,
                        "ring-2 ring-pure-black/20 dark:ring-pure-white/20": isSelected,
                      }
                    )}
                  >
                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-pure-black dark:bg-pure-white rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-pure-white dark:bg-pure-black rounded-full" />
                      </div>
                    )}

                    {/* Position icon */}
                    <div className="text-2xl mb-2 text-center">
                      {icon}
                    </div>

                    {/* Position name */}
                    <div className={cn(
                      "font-semibold text-center mb-1 transition-colors duration-300",
                      {
                        "text-pure-black dark:text-pure-white": isSelected,
                        "text-dark-text dark:text-light-gray": !isSelected,
                      }
                    )}>
                      {label}
                    </div>

                    {/* Position description */}
                    <div className="text-xs text-text-gray dark:text-medium-gray text-center leading-relaxed">
                      {description}
                    </div>

                    {/* Hover effect */}
                    <div className={cn(
                      "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300",
                      "bg-gradient-to-br from-pure-black to-transparent"
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
