import { requireCoach } from "@/lib/coach-auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign,
  Target,
  Activity,
  Download,
  Filter
} from "lucide-react"
import Link from "next/link"

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: { period?: string; metric?: string }
}) {
  await requireCoach()

  const { period = "30d", metric = "overview" } = searchParams

  // Calculate date range based on period
  const getDateRange = (period: string) => {
    const now = new Date()
    const startDate = new Date()
    
    switch (period) {
      case "7d":
        startDate.setDate(now.getDate() - 7)
        break
      case "30d":
        startDate.setDate(now.getDate() - 30)
        break
      case "90d":
        startDate.setDate(now.getDate() - 90)
        break
      case "1y":
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }
    
    return { startDate, endDate: now }
  }

  const { startDate, endDate } = getDateRange(period)

  // Fetch analytics data
  const [
    totalUsers,
    newUsers,
    totalBookings,
    totalRevenue,
    completedSessions,
    averageSessionRating,
    userGrowth,
    revenueGrowth,
    positionStats,
    trainingLevelStats
  ] = await Promise.all([
    // Total users
    prisma.user.count({
      where: { role: "USER" }
    }),
    
    // New users in period
    prisma.user.count({
      where: {
        role: "USER",
        createdAt: { gte: startDate, lte: endDate }
      }
    }),
    
    // Total bookings in period
    prisma.booking.count({
      where: {
        createdAt: { gte: startDate, lte: endDate }
      }
    }),
    
    // Total revenue in period
    prisma.booking.aggregate({
      where: {
        paymentStatus: "PAID",
        createdAt: { gte: startDate, lte: endDate }
      },
      _sum: { amount: true }
    }),
    
    // Completed sessions in period
    prisma.booking.count({
      where: {
        status: "COMPLETED",
        createdAt: { gte: startDate, lte: endDate }
      }
    }),
    
    // Average session rating
    prisma.progress.aggregate({
      where: {
        rating: { not: null },
        createdAt: { gte: startDate, lte: endDate }
      },
      _avg: { rating: true }
    }),
    
    // User growth over time (monthly)
    prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "createdAt") as month,
        COUNT(*) as count
      FROM "users" 
      WHERE "role" = 'USER' 
        AND "createdAt" >= ${startDate}
        AND "createdAt" <= ${endDate}
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month
    `,
    
    // Revenue growth over time (monthly)
    prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "createdAt") as month,
        SUM("amount") as revenue
      FROM "bookings" 
      WHERE "paymentStatus" = 'PAID'
        AND "createdAt" >= ${startDate}
        AND "createdAt" <= ${endDate}
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month
    `,
    
    // Position statistics
    prisma.profile.groupBy({
      by: ['position'],
      where: {
        position: { not: null }
      },
      _count: {
        position: true
      }
    }),
    
    // Training level statistics
    prisma.profile.groupBy({
      by: ['trainingLevel'],
      _count: {
        trainingLevel: true
      }
    })
  ])

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      description: "All registered players",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "New Users",
      value: newUsers,
      description: `This ${period}`,
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Total Bookings",
      value: totalBookings,
      description: `This ${period}`,
      icon: Calendar,
      color: "text-purple-600"
    },
    {
      title: "Total Revenue",
      value: `£${totalRevenue._sum.amount?.toFixed(2) || "0.00"}`,
      description: `This ${period}`,
      icon: DollarSign,
      color: "text-emerald-600"
    },
    {
      title: "Completed Sessions",
      value: completedSessions,
      description: `This ${period}`,
      icon: Target,
      color: "text-green-600"
    },
    {
      title: "Avg. Rating",
      value: averageSessionRating._avg.rating?.toFixed(1) || "0.0",
      description: "Session feedback",
      icon: Activity,
      color: "text-orange-600"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analytics & Reporting
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track performance metrics and generate insights
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Customize your analytics view
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Period</label>
              <Select defaultValue={period}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                  <SelectItem value="1y">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Metric Focus</label>
              <Select defaultValue={metric}>
                <SelectTrigger>
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Overview</SelectItem>
                  <SelectItem value="users">User Growth</SelectItem>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="sessions">Sessions</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>
              Monthly user registration trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Chart visualization would go here
                </p>
                <p className="text-sm text-gray-400">
                  {Array.isArray(userGrowth) ? `${userGrowth.length} data points` : "No data"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Growth</CardTitle>
            <CardDescription>
              Monthly revenue trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Chart visualization would go here
                </p>
                <p className="text-sm text-gray-400">
                  {Array.isArray(revenueGrowth) ? `${revenueGrowth.length} data points` : "No data"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Position Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Player Positions</CardTitle>
            <CardDescription>
              Distribution of players by position
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {positionStats.map((stat) => (
                <div key={stat.position} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium">
                      {stat.position || "Unknown"}
                    </span>
                  </div>
                  <Badge variant="outline">
                    {stat._count.position}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Training Level Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Training Levels</CardTitle>
            <CardDescription>
              Distribution of players by training level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trainingLevelStats.map((stat) => (
                <div key={stat.trainingLevel} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium">
                      {stat.trainingLevel}
                    </span>
                  </div>
                  <Badge variant="outline">
                    {stat._count.trainingLevel}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Reports</CardTitle>
          <CardDescription>
            Generate detailed reports for specific metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/coach/reports/users">
                <Users className="h-6 w-6 mb-2" />
                User Report
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/coach/reports/revenue">
                <DollarSign className="h-6 w-6 mb-2" />
                Revenue Report
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/coach/reports/sessions">
                <Calendar className="h-6 w-6 mb-2" />
                Session Report
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/coach/reports/performance">
                <Target className="h-6 w-6 mb-2" />
                Performance Report
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
