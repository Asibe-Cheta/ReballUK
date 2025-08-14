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
  Trophy,
  TrendingUp
} from "lucide-react"
import { cn } from "@/lib/utils"

export type PlayerPosition = "STRIKER" | "WINGER" | "CAM" | "FULLBACK" | "GOALKEEPER" | "DEFENDER" | "MIDFIELDER" | "OTHER"

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
    description: "Master goal-scoring techniques and finishing skills",
    focus: ["Finishing", "Movement", "Shooting", "Positioning"],
    icon: <Target className="h-6 w-6" />,
    color: "text-red-600 bg-red-50 dark:bg-red-900/20",
    difficulty: "INTERMEDIATE"
  },
  {
    id: "WINGER",
    title: "Winger Training",
    description: "Develop speed, crossing, and dribbling abilities",
    focus: ["Dribbling", "Crossing", "Speed", "1v1 Skills"],
    icon: <Zap className="h-6 w-6" />,
    color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
    difficulty: "ADVANCED"
  },
  {
    id: "CAM",
    title: "CAM Training",
    description: "Enhance playmaking and creative attacking skills",
    focus: ["Vision", "Passing", "Creativity", "Decision Making"],
    icon: <Eye className="h-6 w-6" />,
    color: "text-purple-600 bg-purple-50 dark:bg-purple-900/20",
    difficulty: "ADVANCED"
  },
  {
    id: "FULLBACK",
    title: "Full-back Training",
    description: "Build defensive and attacking full-back skills",
    focus: ["Defending", "Crossing", "Positioning", "Stamina"],
    icon: <Shield className="h-6 w-6" />,
    color: "text-green-600 bg-green-50 dark:bg-green-900/20",
    difficulty: "INTERMEDIATE"
  },
  {
    id: "GOALKEEPER",
    title: "Goalkeeper Training",
    description: "Specialized goalkeeper techniques and reflexes",
    focus: ["Shot Stopping", "Distribution", "Positioning", "Communication"],
    icon: <Shield className="h-6 w-6" />,
    color: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20",
    difficulty: "INTERMEDIATE"
  },
  {
    id: "DEFENDER",
    title: "Defender Training",
    description: "Master defensive techniques and positioning",
    focus: ["Tackling", "Heading", "Positioning", "Communication"],
    icon: <Shield className="h-6 w-6" />,
    color: "text-orange-600 bg-orange-50 dark:bg-orange-900/20",
    difficulty: "BEGINNER"
  },
  {
    id: "MIDFIELDER",
    title: "Midfielder Training",
    description: "Develop all-round midfield skills and control",
    focus: ["Passing", "Control", "Vision", "Stamina"],
    icon: <Users className="h-6 w-6" />,
    color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20",
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
