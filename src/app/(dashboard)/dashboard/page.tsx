"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { 
  PlayCircle,
  Target,
  TrendingUp,
  Trophy,
  Star,
  BarChart3,
  Activity,
  Award,
  UserRound,
  Calendar,
  Clock,
  Plus,
  BookOpen,
  Zap,
  ArrowRight,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { toast } from "sonner"

// Import Shadcn components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

// Import types
import type { DashboardData } from "@/types/dashboard"

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  
  // Dashboard data state
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login-simple?callbackUrl=/dashboard")
    }
  }, [isAuthenticated, authLoading, router])

  // Fetch dashboard data
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchDashboardData()
    }
  }, [isAuthenticated, user?.id])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/dashboard/overview", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data")
      }

      const result = await response.json()
      
      if (result.success) {
        setDashboardData(result.data)
      } else {
        throw new Error(result.error || "Failed to load dashboard")
      }
    } catch (error) {
      console.error("Dashboard data fetch error:", error)
      setError(error instanceof Error ? error.message : "Failed to load dashboard")
      toast.error("Failed to load dashboard data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBookSession = () => {
    router.push("/bookings")
  }

  const handleViewProgress = () => {
    router.push("/bookings")
  }

  // Loading state
  if (authLoading || isLoading) {
    return <DashboardSkeleton />
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <CardTitle className="text-xl">Dashboard Unavailable</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={fetchDashboardData} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isAuthenticated || !dashboardData) {
    return <DashboardSkeleton />
  }

  const { stats, user: userData } = dashboardData
  const userName = userData.profile?.firstName || userData.name?.split(' ')[0] || "Player"
  const isNewUser = (stats.totalSessions || 0) === 0

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {userName}!
        </h1>
        <p className="text-muted-foreground">
          {isNewUser 
            ? "Ready to start your football training journey? Let's get you set up with your first session."
            : "Here's your football training progress and performance overview."
          }
        </p>
      </div>

      {/* New User Onboarding */}
      {isNewUser && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Welcome to REBALL!
            </CardTitle>
                         <CardDescription>
               You&apos;re all set up! Here&apos;s what you can do to get started with your football training.
             </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/20">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Book Your First Session</p>
                  <p className="text-xs text-muted-foreground">Start with a beginner-friendly training</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/20">
                  <Target className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Set Your Goals</p>
                  <p className="text-xs text-muted-foreground">Define what you want to achieve</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/20">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Track Progress</p>
                  <p className="text-xs text-muted-foreground">Monitor your improvement over time</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleBookSession} className="flex-1">
                <Plus className="mr-2 h-4 w-4" />
                Book First Session
              </Button>
              <Button variant="outline" onClick={handleViewProgress}>
                View Training Plans
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <PlayCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSessions || 0}</div>
            <p className="text-xs text-muted-foreground">
              {isNewUser ? "No sessions completed yet" : "Training sessions completed"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isNewUser ? "N/A" : `${stats.successRate || 0}%`}
            </div>
            <p className="text-xs text-muted-foreground">
              {isNewUser ? "Complete your first session" : "Performance in training"}
            </p>
            {!isNewUser && (
              <Progress value={stats.successRate || 0} className="mt-2" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor((stats.totalWatchTime || 0) / 60) || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {isNewUser ? "No training time yet" : "Hours trained this month"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Level</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userData.profile?.trainingLevel || "BEGINNER"}
            </div>
            <p className="text-xs text-muted-foreground">
              Current skill level
            </p>
            <Badge variant="secondary" className="mt-2">
              {userData.profile?.position || "GENERAL"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats and Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Sessions */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
            <CardDescription>
              {isNewUser ? "Your training sessions will appear here" : "Your latest training activities"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isNewUser ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No sessions yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Book your first training session to get started
                </p>
                <Button onClick={handleBookSession}>
                  <Plus className="mr-2 h-4 w-4" />
                  Book Session
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Placeholder for actual session data */}
                <div className="flex items-center gap-4 p-3 rounded-lg border">
                  <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/20">
                    <PlayCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Technical Training</p>
                    <p className="text-sm text-muted-foreground">Ball control and dribbling</p>
                  </div>
                  <Badge variant="outline">Completed</Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Your training summary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Achievements</span>
              </div>
              <span className="font-medium">{stats.certificatesEarned || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Position Rank</span>
              </div>
              <span className="font-medium">#{stats.positionRank || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-500" />
                <span className="text-sm">Current Streak</span>
              </div>
              <span className="font-medium">{stats.currentStreak || 0} days</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-purple-500" />
                <span className="text-sm">Goal Completion</span>
              </div>
              <span className="font-medium">
                {stats.totalSessions > 0 ? Math.round(((stats.completedSessions || 0) / stats.totalSessions) * 100) : 0}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Training Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Training Progress</CardTitle>
          <CardDescription>
            {isNewUser ? "Start training to see your progress" : "Your training performance over time"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isNewUser ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <TrendingUp className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No training data yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Complete your first training session to start tracking your progress and see detailed analytics.
              </p>
              <div className="flex gap-2">
                <Button onClick={handleBookSession}>
                  <Plus className="mr-2 h-4 w-4" />
                  Start Training
                </Button>
                <Button variant="outline">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold text-blue-600">0</div>
                  <div className="text-sm text-muted-foreground">Technical</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold text-green-600">0</div>
                  <div className="text-sm text-muted-foreground">Physical</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold text-purple-600">0</div>
                  <div className="text-sm text-muted-foreground">Tactical</div>
                </div>
              </div>
              <div className="h-32 bg-muted rounded-lg flex items-end justify-center space-x-2 p-4">
                {Array.from({ length: 12 }, (_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="bg-primary w-6 rounded-t-sm" style={{ height: '4px' }} />
                    <div className="text-xs text-muted-foreground mt-2 rotate-45">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Loading skeleton component
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Stats skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-8" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}