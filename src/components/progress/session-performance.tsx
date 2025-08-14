"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Calendar, 
  Clock, 
  Target, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Eye,
  Star,
  Zap
} from "lucide-react"
import { format } from "date-fns"

interface SessionResult {
  id: string
  date: string
  sessionType: string
  position: string
  successRate: number
  confidence: number
  duration: number
  notes: string
}

interface SessionPerformanceProps {
  sessions: SessionResult[]
  className?: string
}

export default function SessionPerformance({ sessions, className }: SessionPerformanceProps) {
  if (!sessions || sessions.length === 0) {
    return (
      <div className="text-center py-8">
        <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No Sessions Yet</h3>
        <p className="text-muted-foreground mb-4">
          Complete your first training session to see your performance here
        </p>
        <Button>Book Your First Session</Button>
      </div>
    )
  }

  const getPerformanceIcon = (successRate: number) => {
    if (successRate >= 80) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (successRate >= 60) return <Minus className="h-4 w-4 text-yellow-500" />
    return <TrendingDown className="h-4 w-4 text-red-500" />
  }

  const getPerformanceColor = (successRate: number) => {
    if (successRate >= 80) return "text-green-600"
    if (successRate >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getPerformanceLabel = (successRate: number) => {
    if (successRate >= 80) return "Excellent"
    if (successRate >= 60) return "Good"
    if (successRate >= 40) return "Fair"
    return "Needs Work"
  }

  const getPositionIcon = (position: string) => {
    switch (position.toLowerCase()) {
      case "striker":
        return <Target className="h-4 w-4" />
      case "winger":
        return <Zap className="h-4 w-4" />
      case "midfielder":
        return <Eye className="h-4 w-4" />
      default:
        return <Star className="h-4 w-4" />
    }
  }

  const getPositionColor = (position: string) => {
    switch (position.toLowerCase()) {
      case "striker":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "winger":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "midfielder":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
      case "defender":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "goalkeeper":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const averageSuccessRate = sessions.reduce((sum, session) => sum + session.successRate, 0) / sessions.length
  const averageConfidence = sessions.reduce((sum, session) => sum + session.confidence, 0) / sessions.length

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Success Rate</p>
                <p className="text-2xl font-bold">{averageSuccessRate.toFixed(1)}%</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Confidence</p>
                <p className="text-2xl font-bold">{averageConfidence.toFixed(1)}%</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sessions List */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Recent Sessions</h3>
        {sessions.slice(0, 5).map((session) => (
          <Card key={session.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getPositionColor(session.position)}`}>
                    {getPositionIcon(session.position)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{session.sessionType}</h4>
                      <Badge variant="outline" className="text-xs">
                        {session.position}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(session.date), 'MMM dd, yyyy')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {session.duration}min
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    {getPerformanceIcon(session.successRate)}
                    <span className={`font-bold ${getPerformanceColor(session.successRate)}`}>
                      {session.successRate}%
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {getPerformanceLabel(session.successRate)}
                  </Badge>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Success Rate</span>
                  <span>{session.successRate}%</span>
                </div>
                <Progress value={session.successRate} className="h-2" />
              </div>

              {/* Notes */}
              {session.notes && (
                <div className="mt-3 p-2 bg-muted/50 rounded text-sm">
                  <p className="text-muted-foreground">{session.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View All Button */}
      {sessions.length > 5 && (
        <div className="text-center">
          <Button variant="outline" className="w-full">
            View All Sessions ({sessions.length})
          </Button>
        </div>
      )}
    </div>
  )
}
