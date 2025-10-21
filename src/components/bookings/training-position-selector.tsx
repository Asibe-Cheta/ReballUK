"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Target, 
  Zap, 
  Eye, 
  Shield, 
  Users, 
  Star, 
  ArrowRight,
  TrendingUp
} from "lucide-react"
import { cn } from "@/lib/utils"

export type PlayerPosition = "STRIKER" | "WINGER" | "CAM" | "CM" | "CDM" | "FULLBACK" | "CENTREBACK" | "OTHER"

interface PositionOption {
  id: PlayerPosition
  title: string
  description: string
  focus: string[]
  icon: React.ReactNode
  color: string
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
}

interface TrainingPositionSelectorProps {
  selectedPosition: PlayerPosition | null
  onSelect: (position: PlayerPosition) => void
  className?: string
}

const positionOptions: PositionOption[] = [
  {
    id: "STRIKER",
    title: "Striker Training",
    description: "Master 1v1 attacking, finishing, and goal-scoring techniques",
    focus: ["1v1 Attacking", "Finishing", "Movement", "Runs in Box"],
    icon: <Target className="h-6 w-6" />,
    color: "text-red-600 bg-red-50 dark:bg-red-900/20",
    difficulty: "INTERMEDIATE"
  },
  {
    id: "WINGER",
    title: "Winger Training",
    description: "Develop 1v1 attacking, crossing, and finishing abilities",
    focus: ["1v1 Attacking", "Crossing", "Finishing", "Dribbling"],
    icon: <Zap className="h-6 w-6" />,
    color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
    difficulty: "ADVANCED"
  },
  {
    id: "CAM",
    title: "CAM Training",
    description: "Enhance 1v1 attacking, playmaking and creative skills",
    focus: ["1v1 Attacking", "Crossing", "Finishing", "Dribbling"],
    icon: <Eye className="h-6 w-6" />,
    color: "text-purple-600 bg-purple-50 dark:bg-purple-900/20",
    difficulty: "ADVANCED"
  },
  {
    id: "CM",
    title: "Central Midfielder Training",
    description: "Develop 1v1 attacking, dribbling, and receiving skills",
    focus: ["1v1 Attacking", "Dribbling", "Receiving", "Passing"],
    icon: <Users className="h-6 w-6" />,
    color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20",
    difficulty: "INTERMEDIATE"
  },
  {
    id: "CDM",
    title: "CDM Training",
    description: "Master 1v1 defending, screening, and ball distribution",
    focus: ["1v1 Defending", "Screening", "Dribbling", "Receiving"],
    icon: <Shield className="h-6 w-6" />,
    color: "text-teal-600 bg-teal-50 dark:bg-teal-900/20",
    difficulty: "INTERMEDIATE"
  },
  {
    id: "FULLBACK",
    title: "Full-back Training",
    description: "Build 1v1 defending, attacking, and crossing skills",
    focus: ["1v1 Defending", "1v1 Attacking", "Crossing", "Dribbling"],
    icon: <Shield className="h-6 w-6" />,
    color: "text-green-600 bg-green-50 dark:bg-green-900/20",
    difficulty: "INTERMEDIATE"
  },
  {
    id: "CENTREBACK",
    title: "Centre-back Training",
    description: "Master 1v1 defending and receiving techniques",
    focus: ["1v1 Defending", "Receiving", "Positioning", "Aerial Duels"],
    icon: <Shield className="h-6 w-6" />,
    color: "text-orange-600 bg-orange-50 dark:bg-orange-900/20",
    difficulty: "INTERMEDIATE"
  },
  {
    id: "OTHER",
    title: "General Training",
    description: "All-round football skills and fitness",
    focus: ["Fitness", "Basic Skills", "Tactics", "Team Play"],
    icon: <Star className="h-6 w-6" />,
    color: "text-gray-600 bg-gray-50 dark:bg-gray-900/20",
    difficulty: "BEGINNER"
  }
]

const difficultyColors = {
  BEGINNER: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  INTERMEDIATE: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  ADVANCED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
}

export default function TrainingPositionSelector({ 
  selectedPosition, 
  onSelect, 
  className 
}: TrainingPositionSelectorProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Choose Your Position Focus</h2>
        <p className="text-muted-foreground">
          Select position-specific training to improve your game
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {positionOptions.map((position) => (
          <Card
            key={position.id}
            className={cn(
              "cursor-pointer transition-all duration-200 hover:shadow-md",
              selectedPosition === position.id && "ring-2 ring-primary shadow-lg"
            )}
            onClick={() => onSelect(position.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg", position.color)}>
                    {position.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{position.title}</CardTitle>
                    <Badge 
                      variant="secondary" 
                      className={cn("mt-1", difficultyColors[position.difficulty])}
                    >
                      {position.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <CardDescription className="text-sm">
                {position.description}
              </CardDescription>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Focus Areas:
                </p>
                <div className="flex flex-wrap gap-1">
                  {position.focus.map((focus, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {focus}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Position-specific drills</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
