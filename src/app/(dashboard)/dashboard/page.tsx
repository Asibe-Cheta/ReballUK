"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { 
  Users,
  Target,
  TrendingUp,
  Trophy,
  PlayCircle,
  Star,
  BarChart3,
  Activity,
  Award,
  UserRound
} from "lucide-react"
import { toast } from "sonner"

// Import modern components
import ModernStatsCard from "@/components/dashboard/modern-stats-card"
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

  // Loading state
  if (authLoading || isLoading) {
    return <DashboardSkeleton />
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Dashboard Unavailable
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !dashboardData) {
    return <DashboardSkeleton />
  }

  const { stats, user: userData } = dashboardData
  const userName = userData.profile?.firstName || userData.name?.split(' ')[0] || "Player"

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Welcome back, {userName}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here&apos;s your football training progress and performance overview
        </p>
      </div>

      {/* Main Stats Grid - DashboardKit Style (2x2 Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <ModernStatsCard
          title="SESSIONS"
          value={stats.totalSessions || 0}
          icon={<PlayCircle className="w-6 h-6" />}
          color="blue"
          description="Training sessions completed"
        />
        
        <ModernStatsCard
          title="SUCCESS RATE"
          value={`${stats.successRate || 0}%`}
          icon={<Target className="w-6 h-6" />}
          color="green"
          description="Performance in training"
        />
        
        <ModernStatsCard
          title="TRAINING HOURS"
          value={Math.floor((stats.totalWatchTime || 0) / 60) || 0}
          icon={<TrendingUp className="w-6 h-6" />}
          color="purple"
          description="Hours trained this month"
        />
        
        <ModernStatsCard
          title="STREAK"
          value={`${stats.currentStreak || 0} days`}
          icon={<Activity className="w-6 h-6" />}
          color="orange"
          description="Consecutive training days"
        />
      </div>

      {/* Secondary Stats Grid (3x2 Layout like DashboardKit) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <ModernStatsCard
          title="VIDEO SESSIONS"
          value={stats.completedSessions || 0}
          icon={<PlayCircle className="w-6 h-6" />}
          color="indigo"
          description="Video analysis sessions"
          size="sm"
        />
        
        <ModernStatsCard
          title="GOAL COMPLETION"
          value={`${stats.totalSessions > 0 ? Math.round(((stats.completedSessions || 0) / stats.totalSessions) * 100) : 0}%`}
          icon={<Trophy className="w-6 h-6" />}
          color="green"
          description="Training goal completion"
          size="sm"
        />
        
        <ModernStatsCard
          title="ACHIEVEMENTS"
          value={stats.certificatesEarned || 0}
          icon={<Star className="w-6 h-6" />}
          color="orange"
          description="Badges and certificates"
          size="sm"
        />
        
        <ModernStatsCard
          title="POSITION RANK"
          value={`#${stats.positionRank || 0}`}
          icon={<BarChart3 className="w-6 h-6" />}
          color="purple"
          description="Among position players"
          size="sm"
        />
        
        <ModernStatsCard
          title="TRAINING LEVEL"
          value={userData.profile?.trainingLevel || "BEGINNER"}
          icon={<Award className="w-6 h-6" />}
          color="blue"
          description="Current skill level"
          size="sm"
        />
        
        <ModernStatsCard
          title="POSITION"
          value={userData.profile?.position || "GENERAL"}
          icon={<UserRound className="w-6 h-6" />}
          color="red"
          description="Playing position"
          size="sm"
        />
      </div>

      {/* Large Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Training Success Rate
            </h3>
          </div>
          <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            {stats.successRate || 0}%
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Number of successful training sessions divided by total sessions completed.
          </p>
          
          {/* Mini Chart Placeholder */}
          <div className="mt-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <div className="flex items-end space-x-1 h-16">
              {[65, 70, 68, 85, 75, 82, 88].map((height, i) => (
                <div
                  key={i}
                  className="bg-purple-500 dark:bg-purple-400 rounded-sm flex-1"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-purple-600 dark:text-purple-400 mt-2">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Monthly Training Progress
            </h3>
          </div>
          <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {stats.completedSessions || 0}
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Training sessions completed this month across all categories.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">0</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Technical</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">0</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Physical</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">0</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Tactical</div>
            </div>
          </div>
        </div>
      </div>

      {/* Position-wise monthly training report */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Position-wise monthly training progress
          </h3>
                     <div className="flex items-center space-x-4">
             <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
               {stats.totalWatchTime || 0} min
             </div>
             <div className="text-lg text-gray-600 dark:text-gray-400">
               {stats.totalSessions > 0 ? Math.round((stats.totalWatchTime || 0) / stats.totalSessions) : 0} min avg
             </div>
           </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <div>Total Training Time</div>
          <div>Average per Session</div>
        </div>

                 {/* Chart Placeholder */}
         <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-end justify-center space-x-2 p-4">
           {[
             { month: "Jan", value: 0 },
             { month: "Feb", value: 0 },
             { month: "Mar", value: 0 },
             { month: "Apr", value: 0 },
             { month: "May", value: 0 },
             { month: "Jun", value: 0 },
             { month: "Jul", value: 0 },
             { month: "Aug", value: 0 },
             { month: "Sep", value: 0 },
             { month: "Oct", value: 0 },
             { month: "Nov", value: 0 },
             { month: "Dec", value: 0 }
           ].map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className="bg-blue-500 dark:bg-blue-400 w-8 rounded-t-sm"
                style={{ height: `${item.value * 4}px` }}
              />
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 rotate-45">
                {item.month}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Loading skeleton component
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="mb-8">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Main stats skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <Skeleton className="h-12 w-12 rounded-lg mb-3" />
                <Skeleton className="h-8 w-20 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Secondary stats skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>

      {/* Large cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    </div>
  )
}