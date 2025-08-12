"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { 
  Trophy, 
  Target, 
  Clock, 
  TrendingUp, 
  Award, 
  PlayCircle,
  Calendar,
  BarChart3,
  CheckCircle,
  Star,
  Users
} from "lucide-react"
import { toast } from "sonner"

// Import dashboard components
import StatsCard from "@/components/dashboard/stats-card"
import ProgressChart from "@/components/dashboard/progress-chart"
import RecentSessions from "@/components/dashboard/recent-sessions"
import QuickActions from "@/components/dashboard/quick-actions"
import { Skeleton } from "@/components/ui/skeleton"

// Import types
import type { DashboardData, UserStats, SessionData, ProgressData } from "@/types/dashboard"
import { dashboardUtils } from "@/types/dashboard"

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
      router.push("/login?callbackUrl=/dashboard")
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

      // Use the direct database approach for better performance
      const response = await fetch("/api/dashboard/overview", {
        method: "POST", // Use POST endpoint for direct database queries
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

  // Action handlers
  const handleBookSession = () => {
    router.push("/courses")
  }

  const handleViewAnalysis = () => {
    router.push("/progress")
  }

  const handleStartTraining = () => {
    router.push("/training")
  }

  // Loading state
  if (authLoading || isLoading) {
    return <DashboardSkeleton />
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-light-gray to-pure-white dark:from-charcoal dark:to-dark-gray py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="font-marker text-3xl mb-4">Dashboard Unavailable</h1>
            <p className="text-text-gray dark:text-medium-gray mb-6">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="px-6 py-2 bg-pure-black dark:bg-pure-white text-pure-white dark:text-pure-black rounded-lg hover:opacity-90 transition-opacity"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return null
  }

  if (!dashboardData) {
    return <DashboardSkeleton />
  }

  const { stats, recentSessions, progressData, recommendations, goalProgress } = dashboardData

  return (
    <div className="min-h-screen bg-gradient-to-b from-light-gray to-pure-white dark:from-charcoal dark:to-dark-gray py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-marker text-4xl mb-2">
            Welcome back, {dashboardData.user.profile?.firstName || dashboardData.user.name || "Player"}! 👋
          </h1>
          <p className="text-text-gray dark:text-medium-gray">
            Here's your training progress and performance overview
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Sessions"
            value={stats.totalSessions}
            change={stats.thisWeekSessions > 0 ? 15 : undefined}
            icon={<PlayCircle className="w-5 h-5" />}
            description="Completed training sessions"
          />
          
          <StatsCard
            title="Success Rate"
            value={`${stats.successRate}%`}
            change={stats.improvementRate}
            icon={<Target className="w-5 h-5" />}
            description="Performance in sessions"
            trend={dashboardUtils.getTrendDirection(stats.improvementRate)}
          />
          
          <StatsCard
            title="Training Time"
            value={dashboardUtils.formatDuration(stats.totalWatchTime)}
            change={stats.currentStreak > 3 ? 12 : undefined}
            icon={<Clock className="w-5 h-5" />}
            description="Total training hours"
          />
          
          <StatsCard
            title="Current Streak"
            value={`${stats.currentStreak} days`}
            change={stats.currentStreak > 0 ? stats.currentStreak * 5 : undefined}
            icon={<TrendingUp className="w-5 h-5" />}
            description="Consecutive training days"
            trend={stats.currentStreak >= 7 ? "up" : "stable"}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Progress Chart - Takes 2/3 width */}
          <div className="lg:col-span-2">
            <ProgressChart
              data={progressData.overall}
              config={{
                timeframe: "30d",
                metric: "performance",
                showTrend: true,
                smoothing: true,
              }}
              height={400}
            />
          </div>

          {/* Quick Actions - Takes 1/3 width */}
          <div>
            <QuickActions
              onBookSession={handleBookSession}
              onViewAnalysis={handleViewAnalysis}
              onStartTraining={handleStartTraining}
              recommendations={recommendations}
            />
          </div>
        </div>

        {/* Secondary Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Sessions */}
          <RecentSessions
            sessions={recentSessions}
          />

          {/* Additional Stats and Achievements */}
          <div className="space-y-6">
            {/* Performance Metrics */}
            <div className="glow-card p-6 rounded-2xl" data-card="performance-metrics">
              <span className="glow"></span>
              <h3 className="text-lg font-semibold text-pure-black dark:text-pure-white mb-4">
                Performance Metrics
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm text-text-gray dark:text-medium-gray">
                      Average Rating
                    </span>
                  </div>
                  <span className="font-semibold text-pure-black dark:text-pure-white">
                    {stats.averageRating.toFixed(1)}/5.0
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm text-text-gray dark:text-medium-gray">
                      Certificates
                    </span>
                  </div>
                  <span className="font-semibold text-pure-black dark:text-pure-white">
                    {stats.certificatesEarned}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-text-gray dark:text-medium-gray">
                      Position Rank
                    </span>
                  </div>
                  <span className="font-semibold text-pure-black dark:text-pure-white">
                    #{stats.positionRank}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-text-gray dark:text-medium-gray">
                      Confidence Growth
                    </span>
                  </div>
                  <span className={`font-semibold ${
                    stats.confidenceGrowth > 0 
                      ? "text-green-600 dark:text-green-400" 
                      : stats.confidenceGrowth < 0
                      ? "text-red-600 dark:text-red-400"
                      : "text-text-gray dark:text-medium-gray"
                  }`}>
                    {stats.confidenceGrowth > 0 ? "+" : ""}{stats.confidenceGrowth}%
                  </span>
                </div>
              </div>
            </div>

            {/* Weekly Progress */}
            {progressData.weeklyTrends.length > 0 && (
              <div className="glow-card p-6 rounded-2xl" data-card="weekly-progress">
                <span className="glow"></span>
                <h3 className="text-lg font-semibold text-pure-black dark:text-pure-white mb-4">
                  This Week's Progress
                </h3>
                
                <div className="space-y-3">
                  {progressData.weeklyTrends.slice(-1).map((week, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-text-gray dark:text-medium-gray">
                          Sessions Completed
                        </span>
                        <span className="text-pure-black dark:text-pure-white font-medium">
                          {week.sessionsCompleted}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-text-gray dark:text-medium-gray">
                          Average Rating
                        </span>
                        <span className="text-pure-black dark:text-pure-white font-medium">
                          {week.averageRating.toFixed(1)}/5
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-text-gray dark:text-medium-gray">
                          Total Time
                        </span>
                        <span className="text-pure-black dark:text-pure-white font-medium">
                          {dashboardUtils.formatDuration(week.totalTime)}
                        </span>
                      </div>

                      {week.improvementScore !== 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-text-gray dark:text-medium-gray">
                            Improvement
                          </span>
                          <span className={`font-medium ${
                            week.improvementScore > 0
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}>
                            {week.improvementScore > 0 ? "+" : ""}{week.improvementScore}%
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Goal Progress Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glow-card p-6 rounded-2xl" data-card="weekly-goal">
            <span className="glow"></span>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-pure-black dark:text-pure-white">
                Weekly Goal
              </h3>
              <span className="text-sm text-text-gray dark:text-medium-gray">
                {goalProgress.weekly.current}/{goalProgress.weekly.target} sessions
              </span>
            </div>
            <div className="w-full bg-light-gray dark:bg-charcoal rounded-full h-3 mb-2">
              <div 
                className="bg-pure-black dark:bg-pure-white h-3 rounded-full transition-all duration-500"
                style={{ width: `${goalProgress.weekly.percentage}%` }}
              />
            </div>
            <p className="text-sm text-text-gray dark:text-medium-gray">
              {goalProgress.weekly.current >= goalProgress.weekly.target 
                ? "🎉 Goal achieved this week!" 
                : `${goalProgress.weekly.target - goalProgress.weekly.current} sessions remaining`
              }
            </p>
          </div>

          <div className="glow-card p-6 rounded-2xl" data-card="monthly-goal">
            <span className="glow"></span>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-pure-black dark:text-pure-white">
                Monthly Goal
              </h3>
              <span className="text-sm text-text-gray dark:text-medium-gray">
                {goalProgress.monthly.current}/{goalProgress.monthly.target} sessions
              </span>
            </div>
            <div className="w-full bg-light-gray dark:bg-charcoal rounded-full h-3 mb-2">
              <div 
                className="bg-pure-black dark:bg-pure-white h-3 rounded-full transition-all duration-500"
                style={{ width: `${goalProgress.monthly.percentage}%` }}
              />
            </div>
            <p className="text-sm text-text-gray dark:text-medium-gray">
              {goalProgress.monthly.current >= goalProgress.monthly.target 
                ? "🏆 Monthly goal achieved!" 
                : `${goalProgress.monthly.target - goalProgress.monthly.current} sessions remaining`
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Loading skeleton component
function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-light-gray to-pure-white dark:from-charcoal dark:to-dark-gray py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header skeleton */}
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>

        {/* Stats cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glow-card p-6 rounded-2xl" data-card="stats-loading">
              <span className="glow"></span>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                </div>
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
        </div>

        {/* Main content skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="glow-card p-6 rounded-2xl" data-card="chart-loading">
              <span className="glow"></span>
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
          <div>
            <div className="glow-card p-6 rounded-2xl" data-card="actions-loading">
              <span className="glow"></span>
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <div className="grid grid-cols-1 gap-3">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}