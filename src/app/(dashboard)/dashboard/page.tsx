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
  Activity
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
          Welcome back, {userName}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here&apos;s your football training progress and performance overview
        </p>
      </div>

      {/* Main Stats Grid - DashboardKit Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <ModernStatsCard
          title="CUSTOMERS"
          value={stats.totalSessions || 1000}
          icon={<Users className="w-6 h-6" />}
          color="blue"
          description="Training sessions completed"
        />
        
        <ModernStatsCard
          title="REVENUE"
          value={`${stats.successRate || 85}%`}
          icon={<Target className="w-6 h-6" />}
          color="green"
          change={15}
          description="Success rate in training"
        />
        
        <ModernStatsCard
          title="GROWTH"
          value={Math.floor((stats.totalWatchTime || 0) / 60) || 120}
          icon={<TrendingUp className="w-6 h-6" />}
          color="purple"
          change={-5}
          description="Training hours this month"
        />
        
        <ModernStatsCard
          title="RETURNS"
          value={stats.currentStreak || 7}
          icon={<Activity className="w-6 h-6" />}
          color="orange"
          change={12}
          description="Day training streak"
        />
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <ModernStatsCard
          title="DOWNLOADS"
          value={3550}
          icon={<PlayCircle className="w-6 h-6" />}
          color="indigo"
          description="Video sessions viewed"
          size="sm"
        />
        
        <ModernStatsCard
          title="ORDERS"
          value="100%"
          icon={<Trophy className="w-6 h-6" />}
          color="green"
          description="Goal completion rate"
          size="sm"
        />
        
        <ModernStatsCard
          title="CERTIFICATES"
          value={stats.certificatesEarned || 5}
          icon={<Star className="w-6 h-6" />}
          color="orange"
          description="Achievements earned"
          size="sm"
        />
        
        <ModernStatsCard
          title="RANK"
          value={`#${stats.positionRank || 1}`}
          icon={<BarChart3 className="w-6 h-6" />}
          color="purple"
          description="Position ranking"
          size="sm"
        />
      </div>

      {/* Large Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Conversion Rate
            </h3>
          </div>
          <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            {stats.successRate || 53.94}%
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Number of successful sessions divided by total training sessions.
          </p>
          
          {/* Mini Chart Placeholder */}
          <div className="mt-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <div className="flex items-end space-x-1 h-16">
              {[40, 65, 45, 80, 55, 70, 85].map((height, i) => (
                <div
                  key={i}
                  className="bg-purple-500 dark:bg-purple-400 rounded-sm flex-1"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-purple-600 dark:text-purple-400 mt-2">
              <span>2018</span>
              <span>2019</span>
              <span>2020</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Training Delivered
            </h3>
          </div>
          <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {stats.completedSessions || 1432}
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Number of training sessions completed this month.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">130</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">May</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">251</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">June</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">235</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">July</div>
            </div>
          </div>
        </div>
      </div>

      {/* Department wise monthly training report */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Position wise monthly training report
          </h3>
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              £21,356.46
            </div>
            <div className="text-lg text-gray-600 dark:text-gray-400">
              £1935.6
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <div>Total Training Value</div>
          <div>Average per Session</div>
        </div>

        {/* Chart Placeholder */}
        <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-end justify-center space-x-2 p-4">
          {[
            { month: "Jan", value: 25 },
            { month: "Feb", value: 15 },
            { month: "Mar", value: 35 },
            { month: "Apr", value: 28 },
            { month: "May", value: 20 },
            { month: "Jun", value: 32 },
            { month: "Jul", value: 45 },
            { month: "Aug", value: 25 },
            { month: "Sep", value: 38 },
            { month: "Oct", value: 22 },
            { month: "Nov", value: 40 },
            { month: "Dec", value: 35 }
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