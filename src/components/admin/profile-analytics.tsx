'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  UserCheck, 
  Clock,
  Calendar,
  MapPin,
  Target,
  PieChart,
  Activity
} from 'lucide-react'

interface AnalyticsData {
  overview: {
    totalUsers: number
    completedProfiles: number
    pendingProfiles: number
    completionRate: number
    averageCompletionTime: number
  }
  positionDistribution: Array<{ position: string; count: number; percentage: number }>
  levelDistribution: Array<{ level: string; count: number; percentage: number }>
  completionTrend: Array<{ date: string; completed: number; pending: number }>
  geographicDistribution: Array<{ postcode: string; count: number }>
  trainingReasons: Array<{ reason: string; count: number }>
  hearAboutSources: Array<{ source: string; count: number }>
  consentStats: {
    socialMediaConsent: number
    marketingConsent: number
  }
  recentActivity: Array<{
    date: string
    registrations: number
    completions: number
  }>
}

export function ProfileAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/admin/analytics?timeRange=${timeRange}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Detailed analytics on profile submissions and completion</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Failed to load analytics
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Unable to fetch analytics data. Please try again.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Detailed analytics on profile submissions and completion</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Profiles</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.completedProfiles}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.overview.completionRate}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Profiles</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.pendingProfiles}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting completion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Completion Time</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.averageCompletionTime}</div>
            <p className="text-xs text-muted-foreground">
              Days to complete
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Completion Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Completion Progress</CardTitle>
          <CardDescription>
            Overall completion rate and progress tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Completion Rate</span>
              <span className="text-sm text-muted-foreground">
                {analytics.overview.completedProfiles} / {analytics.overview.totalUsers}
              </span>
            </div>
            <Progress value={analytics.overview.completionRate} className="h-3" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {analytics.overview.pendingProfiles} profiles pending completion
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Position Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Position Distribution</CardTitle>
            <CardDescription>
              Most popular player positions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.positionDistribution.map((position) => (
                <div key={position.position} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">{position.position}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{position.count}</span>
                    <Badge variant="outline">{position.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Playing Level Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Playing Level Distribution</CardTitle>
            <CardDescription>
              Distribution of player skill levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.levelDistribution.map((level) => (
                <div key={level.level} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">{level.level}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{level.count}</span>
                    <Badge variant="outline">{level.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Training Reasons */}
        <Card>
          <CardHeader>
            <CardTitle>Training Reasons</CardTitle>
            <CardDescription>
              Why players are joining REBALL
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.trainingReasons.map((reason) => (
                <div key={reason.reason} className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate">{reason.reason}</span>
                  <Badge variant="secondary">{reason.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* How They Heard About REBALL */}
        <Card>
          <CardHeader>
            <CardTitle>Discovery Sources</CardTitle>
            <CardDescription>
              How players found REBALL
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.hearAboutSources.map((source) => (
                <div key={source.source} className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate">{source.source}</span>
                  <Badge variant="secondary">{source.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Geographic Distribution</CardTitle>
          <CardDescription>
            Player distribution by postcode
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {analytics.geographicDistribution.map((location) => (
              <div key={location.postcode} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium">{location.postcode}</span>
                </div>
                <Badge variant="outline">{location.count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Consent Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Consent Statistics</CardTitle>
          <CardDescription>
            Marketing and social media consent rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Social Media Consent</span>
                <span className="text-sm text-muted-foreground">
                  {analytics.consentStats.socialMediaConsent} users
                </span>
              </div>
              <Progress 
                value={(analytics.consentStats.socialMediaConsent / analytics.overview.totalUsers) * 100} 
                className="h-2" 
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Marketing Consent</span>
                <span className="text-sm text-muted-foreground">
                  {analytics.consentStats.marketingConsent} users
                </span>
              </div>
              <Progress 
                value={(analytics.consentStats.marketingConsent / analytics.overview.totalUsers) * 100} 
                className="h-2" 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
