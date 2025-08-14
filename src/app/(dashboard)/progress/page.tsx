"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  TrendingUp, 
  Target, 
  Trophy, 
  Calendar,
  Clock,
  Award,
  BarChart3,
  LineChart,
  Activity,
  Star,
  Zap,
  Eye
} from "lucide-react"
import ProgressChart from "@/components/progress/progress-chart"
import ConfidenceRating from "@/components/progress/confidence-rating"
import SessionPerformance from "@/components/progress/session-performance"
import SkillBreakdown from "@/components/progress/skill-breakdown"
import GoalSetting from "@/components/progress/goal-setting"

interface ProgressStats {
  totalSessions: number
  successRate: number
  averageConfidence: number
  totalTrainingHours: number
  currentStreak: number
  bestStreak: number
  improvementRate: number
  position: string
  trainingLevel: string
}

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

export default function ProgressPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [timeRange, setTimeRange] = useState("month")
  const [stats, setStats] = useState<ProgressStats | null>(null)
  const [recentSessions, setRecentSessions] = useState<SessionResult[]>([])
  const [isLoadingStats, setIsLoadingStats] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      fetchProgressStats()
      fetchRecentSessions()
    }
  }, [user, timeRange])

  const fetchProgressStats = async () => {
    try {
      setIsLoadingStats(true)
      const response = await fetch(`/api/progress/stats?timeRange=${timeRange}`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching progress stats:", error)
    } finally {
      setIsLoadingStats(false)
    }
  }

  const fetchRecentSessions = async () => {
    try {
      const response = await fetch("/api/progress/sessions")
      if (response.ok) {
        const data = await response.json()
        setRecentSessions(data)
      }
    } catch (error) {
      console.error("Error fetching recent sessions:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Progress Analytics</h1>
          <p className="text-muted-foreground">
            Track your 1v1 training improvement and performance metrics
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingStats ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                `${stats?.successRate || 0}%`
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.improvementRate ? `+${stats.improvementRate}%` : "0%"} from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingStats ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                stats?.totalSessions || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Training sessions completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingStats ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                `${stats?.totalTrainingHours || 0}h`
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Total time invested
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingStats ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                stats?.currentStreak || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Best: {stats?.bestStreak || 0} sessions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Success Rate Trend
                </CardTitle>
                <CardDescription>
                  Your 1v1 success rate over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProgressChart timeRange={timeRange} />
              </CardContent>
            </Card>

            {/* Recent Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Sessions
                </CardTitle>
                <CardDescription>
                  Your latest training performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SessionPerformance sessions={recentSessions} />
              </CardContent>
            </Card>
          </div>

          {/* Confidence Ratings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Confidence Levels
              </CardTitle>
              <CardDescription>
                Track your confidence in different 1v1 scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConfidenceRating />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Skill Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Skill Breakdown
                </CardTitle>
                <CardDescription>
                  Performance across different 1v1 scenarios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SkillBreakdown />
              </CardContent>
            </Card>

            {/* Position Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Position Performance
                </CardTitle>
                <CardDescription>
                  Success rates by training position
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.position && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Current Position</span>
                      <Badge variant="secondary">{stats.position}</Badge>
                    </div>
                  )}
                  {stats?.trainingLevel && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Training Level</span>
                      <Badge variant="outline">{stats.trainingLevel}</Badge>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Average Confidence</span>
                    <div className="flex items-center gap-2">
                      <Progress value={stats?.averageConfidence || 0} className="w-24" />
                      <span className="text-sm">{stats?.averageConfidence || 0}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Detailed Skill Analysis
              </CardTitle>
              <CardDescription>
                Deep dive into your 1v1 performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SkillBreakdown detailed={true} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Goal Setting & Tracking
              </CardTitle>
              <CardDescription>
                Set and track your training objectives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GoalSetting />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
