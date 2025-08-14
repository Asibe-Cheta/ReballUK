"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, User, Crown, Clock, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

export type SessionType = "group" | "1v1"

interface SessionTypeOption {
  id: SessionType
  title: string
  description: string
  price: number
  duration: number
  features: string[]
  icon: React.ReactNode
  popular?: boolean
}

interface SessionTypeSelectorProps {
  selectedType: SessionType | null
  onSelect: (type: SessionType) => void
  className?: string
}

const sessionTypes: SessionTypeOption[] = [
  {
    id: "group",
    title: "Group Training",
    description: "Train with other players in a collaborative environment",
    price: 25,
    duration: 60,
    features: [
      "Up to 8 players per session",
      "Position-specific drills",
      "Team building exercises",
      "Competitive environment"
    ],
    icon: <Users className="h-6 w-6" />
  },
  {
    id: "1v1",
    title: "1v1 Personal Training",
    description: "One-on-one personalized training with expert coaches",
    price: 75,
    duration: 60,
    features: [
      "Personalized training plan",
      "Individual attention",
      "Advanced techniques",
      "Performance analysis"
    ],
    icon: <User className="h-6 w-6" />,
    popular: true
  }
]

export default function SessionTypeSelector({ 
  selectedType, 
  onSelect, 
  className 
}: SessionTypeSelectorProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Choose Your Training Type</h2>
        <p className="text-muted-foreground">
          Select the training format that best suits your goals and schedule
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sessionTypes.map((type) => (
          <Card
            key={type.id}
            className={cn(
              "cursor-pointer transition-all duration-200 hover:shadow-md",
              selectedType === type.id && "ring-2 ring-primary shadow-lg",
              type.popular && "border-primary/20"
            )}
            onClick={() => onSelect(type.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {type.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{type.title}</CardTitle>
                    {type.popular && (
                      <Badge variant="secondary" className="mt-1">
                        <Crown className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <CardDescription className="text-sm">
                {type.description}
              </CardDescription>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{type.duration} minutes</span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <DollarSign className="h-4 w-4" />
                  <span>${type.price}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Includes:</p>
                <ul className="space-y-1">
                  {type.features.map((feature, index) => (
                    <li key={index} className="text-sm flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
