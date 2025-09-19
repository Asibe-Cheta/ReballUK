"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
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
  Calendar,
  Clock,
  Plus,
  BookOpen,
  Zap,
  ArrowRight,
  Video,
  Users,
  CheckCircle
} from "lucide-react"
import { toast } from "sonner"

// Import Shadcn components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import ProfileCompletionGuard from "@/components/auth/profile-completion-guard"

export default function DashboardPage() {
  return (
    <ProfileCompletionGuard fallbackMessage="Please complete your profile to access the dashboard">
      <DashboardContent />
    </ProfileCompletionGuard>
  )
}

function DashboardContent() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  
  // Simple dashboard state
  const [isLoading, setIsLoading] = useState(true)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?callbackUrl=/dashboard")
      return
    }
    
    if (user) {
      // Simulate loading
      const timer = setTimeout(() => setIsLoading(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [user, authLoading, router])

  const handleBookSession = () => {
    router.push("/bookings")
  }

  const handleVideoAnalysis = () => {
    router.push("/video-analysis")
  }

  const handleMyBookings = () => {
    router.push("/my-bookings")
  }

  const handleProgress = () => {
    router.push("/progress")
  }

  // Loading state
  if (authLoading || isLoading) {
    return <DashboardSkeleton />
  }

  // Not authenticated
  if (!user) {
    return null
  }

  const userName = user.name?.split(' ')[0] || "Player"

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
          Welcome back, {userName}!
        </h1>
        <p className="text-sm lg:text-base text-muted-foreground">
          Ready to elevate your football skills? Let&apos;s get you started with your training journey.
        </p>
      </div>

      {/* Quick Actions */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Get started with your football training journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            <Button 
              onClick={handleBookSession}
              className="h-auto p-3 lg:p-4 flex flex-col items-center gap-2"
              variant="outline"
            >
              <Calendar className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" />
              <div className="text-center">
                <div className="font-medium text-sm lg:text-base">Book Session</div>
                <div className="text-xs text-muted-foreground">Schedule training</div>
              </div>
            </Button>
            
            <Button 
              onClick={handleVideoAnalysis}
              className="h-auto p-3 lg:p-4 flex flex-col items-center gap-2"
              variant="outline"
            >
              <Video className="h-5 w-5 lg:h-6 lg:w-6 text-green-600" />
              <div className="text-center">
                <div className="font-medium text-sm lg:text-base">Video Analysis</div>
                <div className="text-xs text-muted-foreground">Review performance</div>
              </div>
            </Button>
            
            <Button 
              onClick={handleMyBookings}
              className="h-auto p-3 lg:p-4 flex flex-col items-center gap-2"
              variant="outline"
            >
              <Target className="h-5 w-5 lg:h-6 lg:w-6 text-purple-600" />
              <div className="text-center">
                <div className="font-medium text-sm lg:text-base">My Bookings</div>
                <div className="text-xs text-muted-foreground">View sessions</div>
              </div>
            </Button>
            
            <Button 
              onClick={handleProgress}
              className="h-auto p-3 lg:p-4 flex flex-col items-center gap-2"
              variant="outline"
            >
              <TrendingUp className="h-5 w-5 lg:h-6 lg:w-6 text-orange-600" />
              <div className="text-center">
                <div className="font-medium text-sm lg:text-base">Progress</div>
                <div className="text-xs text-muted-foreground">Track improvement</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid gap-3 lg:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Sessions</CardTitle>
            <PlayCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Book your first session to get started
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Level</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">BEGINNER</div>
            <p className="text-xs text-muted-foreground">
              Current skill level
            </p>
            <Badge variant="secondary" className="mt-2">
              GENERAL
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Video Analysis</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Upload videos for analysis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Complete sessions to earn badges
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Getting Started Guide
          </CardTitle>
          <CardDescription>
            Follow these steps to begin your football training journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 rounded-lg bg-muted/50">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <span className="text-sm font-bold text-blue-600">1</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium mb-1">Book Your First Training Session</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Choose from 1v1 or group sessions. Select your preferred position and training focus.
                </p>
                <Button size="sm" onClick={handleBookSession}>
                  <Plus className="mr-2 h-4 w-4" />
                  Book Session
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 rounded-lg bg-muted/50">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <span className="text-sm font-bold text-green-600">2</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium mb-1">Upload Training Videos</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Record your training sessions and upload them for professional analysis and feedback.
                </p>
                <Button size="sm" variant="outline" onClick={handleVideoAnalysis}>
                  <Video className="mr-2 h-4 w-4" />
                  Upload Video
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 rounded-lg bg-muted/50">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <span className="text-sm font-bold text-purple-600">3</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium mb-1">Track Your Progress</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Monitor your improvement over time with detailed analytics and performance metrics.
                </p>
                <Button size="sm" variant="outline" onClick={handleProgress}>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Progress
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest training activities and achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No activity yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start your training journey to see your activity here
              </p>
              <Button onClick={handleBookSession}>
                <Plus className="mr-2 h-4 w-4" />
                Start Training
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
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
              <span className="font-medium">0</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Training Hours</span>
              </div>
              <span className="font-medium">0h</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-500" />
                <span className="text-sm">Current Streak</span>
              </div>
              <span className="font-medium">0 days</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-purple-500" />
                <span className="text-sm">Video Analysis</span>
              </div>
              <span className="font-medium">0 videos</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-orange-500" />
                <span className="text-sm">Sessions Booked</span>
              </div>
              <span className="font-medium">0</span>
            </div>
          </CardContent>
        </Card>
      </div>
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

      {/* Quick Actions skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats skeleton */}
      <div className="grid gap-3 lg:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
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