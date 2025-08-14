"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Target, 
  Zap, 
  Eye, 
  Shield, 
  Users, 
  Star, 
  Save,
  RefreshCw,
  TrendingUp
} from "lucide-react"

interface ConfidenceRating {
  id: string
  scenario: string
  rating: number
  previousRating: number
  icon: React.ReactNode
  description: string
  color: string
}



const scenarios: Omit<ConfidenceRating, 'rating' | 'previousRating'>[] = [
  {
    id: "finishing",
    scenario: "1v1 Finishing",
    icon: <Target className="h-4 w-4" />,
    description: "Confidence in scoring when 1v1 with goalkeeper",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
  },
  {
    id: "dribbling",
    scenario: "1v1 Dribbling",
    icon: <Zap className="h-4 w-4" />,
    description: "Confidence in beating defenders 1v1",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
  },
  {
    id: "crossing",
    scenario: "Crossing & Delivery",
    icon: <Eye className="h-4 w-4" />,
    description: "Confidence in delivering accurate crosses",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
  },
  {
    id: "defending",
    scenario: "1v1 Defending",
    icon: <Shield className="h-4 w-4" />,
    description: "Confidence in stopping attackers 1v1",
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
  },
  {
    id: "passing",
    scenario: "Passing Under Pressure",
    icon: <Users className="h-4 w-4" />,
    description: "Confidence in accurate passing when pressured",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
  },
  {
    id: "shooting",
    scenario: "Long Range Shooting",
    icon: <Star className="h-4 w-4" />,
    description: "Confidence in scoring from distance",
    color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400"
  }
]

export default function ConfidenceRating() {
  const [ratings, setRatings] = useState<ConfidenceRating[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchConfidenceRatings()
  }, [])

  const fetchConfidenceRatings = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/progress/confidence")
      if (response.ok) {
        const data = await response.json()
        setRatings(data)
      } else {
        // Generate mock data for demonstration
        generateMockRatings()
      }
    } catch (error) {
      console.error("Error fetching confidence ratings:", error)
      generateMockRatings()
    } finally {
      setIsLoading(false)
    }
  }

  const generateMockRatings = () => {
    const mockRatings = scenarios.map(scenario => ({
      ...scenario,
      rating: Math.floor(Math.random() * 40) + 30, // 30-70 range
      previousRating: Math.floor(Math.random() * 40) + 30
    }))
    setRatings(mockRatings)
  }

  const handleRatingChange = (id: string, value: number[]) => {
    setRatings(prev => 
      prev.map(rating => 
        rating.id === id ? { ...rating, rating: value[0] } : rating
      )
    )
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      const response = await fetch("/api/progress/confidence", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ratings }),
      })
      
      if (response.ok) {
        // Show success feedback
        console.log("Confidence ratings saved successfully")
      }
    } catch (error) {
      console.error("Error saving confidence ratings:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 80) return "text-green-600"
    if (rating >= 60) return "text-yellow-600"
    if (rating >= 40) return "text-orange-600"
    return "text-red-600"
  }

  const getRatingLabel = (rating: number) => {
    if (rating >= 80) return "Excellent"
    if (rating >= 60) return "Good"
    if (rating >= 40) return "Fair"
    return "Needs Work"
  }

  const getImprovement = (current: number, previous: number) => {
    const diff = current - previous
    if (diff > 0) return { value: diff, positive: true }
    if (diff < 0) return { value: Math.abs(diff), positive: false }
    return { value: 0, positive: true }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>
    )
  }

  const averageRating = ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length
  const averageImprovement = ratings.reduce((sum, rating) => {
    const improvement = getImprovement(rating.rating, rating.previousRating)
    return sum + (improvement.positive ? improvement.value : -improvement.value)
  }, 0) / ratings.length

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Confidence</p>
                <p className="text-2xl font-bold">{averageRating.toFixed(1)}%</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Improvement</p>
                <p className={`text-2xl font-bold ${averageImprovement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {averageImprovement > 0 ? '+' : ''}{averageImprovement.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Strongest Area</p>
                <p className="text-lg font-semibold">
                  {ratings.reduce((max, rating) => rating.rating > max.rating ? rating : max).scenario}
                </p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confidence Ratings */}
      <div className="space-y-4">
        {ratings.map((rating) => {
          const improvement = getImprovement(rating.rating, rating.previousRating)
          
          return (
            <Card key={rating.id}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${rating.color}`}>
                        {rating.icon}
                      </div>
                      <div>
                        <h3 className="font-medium">{rating.scenario}</h3>
                        <p className="text-sm text-muted-foreground">{rating.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-bold ${getRatingColor(rating.rating)}`}>
                          {rating.rating}%
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {getRatingLabel(rating.rating)}
                        </Badge>
                      </div>
                      {improvement.value > 0 && (
                        <p className={`text-xs ${improvement.positive ? 'text-green-600' : 'text-red-600'}`}>
                          {improvement.positive ? '+' : '-'}{improvement.value}% from last time
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Slider
                      value={[rating.rating]}
                      onValueChange={(value) => handleRatingChange(rating.id, value)}
                      max={100}
                      min={0}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Not Confident</span>
                      <span>Very Confident</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="flex-1"
        >
          {isSaving ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Ratings
            </>
          )}
        </Button>
        <Button 
          variant="outline" 
          onClick={fetchConfidenceRatings}
          className="flex-1"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
    </div>
  )
}
