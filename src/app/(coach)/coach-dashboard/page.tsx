import { requireCoach } from "@/lib/coach-auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  CheckCircle,
  AlertCircle,
  UserPlus,
  Video,
  MessageSquare
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

export default async function CoachDashboard() {
  await requireCoach()

  // Fetch dashboard statistics
  const [
    totalUsers,
    activeUsers,
    totalBookings,
    pendingBookings,
    completedSessions,
    totalRevenue,
    recentUsers,
    upcomingSessions
  ] = await Promise.all([
    // Total registered users
    prisma.user.count({
      where: { role: "USER" }
    }),
    
    // Active users (with profile and recent activity)
    prisma.user.count({
      where: {
        role: "USER",
        profile: { isNot: null },
        OR: [
          { bookings: { some: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } } },
          { progress: { some: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } } }
        ]
      }
    }),
    
    // Total bookings
    prisma.booking.count(),
    
    // Pending bookings
    prisma.booking.count({
      where: { status: "PENDING" }
    }),
    
    // Completed sessions
    prisma.booking.count({
      where: { status: "COMPLETED" }
    }),
    
    // Total revenue
    prisma.booking.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { amount: true }
    }),
    
    // Recent user registrations
    prisma.user.findMany({
      where: { role: "USER" },
      include: { profile: true },
      orderBy: { createdAt: "desc" },
      take: 5
    }),
    
    // Upcoming sessions
    prisma.booking.findMany({
      where: {
        status: { in: ["PENDING", "CONFIRMED"] },
        scheduledFor: { gte: new Date() }
      },
      include: {
        user: { include: { profile: true } },
        course: true
      },
      orderBy: { scheduledFor: "asc" },
      take: 5
    })
  ])

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      description: "Registered players",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Users",
      value: activeUsers,
      description: "Active this month",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Total Bookings",
      value: totalBookings,
      description: "All time bookings",
      icon: Calendar,
      color: "text-purple-600"
    },
    {
      title: "Pending Bookings",
      value: pendingBookings,
      description: "Awaiting approval",
      icon: Clock,
      color: "text-orange-600"
    },
    {
      title: "Completed Sessions",
      value: completedSessions,
      description: "Successful sessions",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "Total Revenue",
      value: `£${totalRevenue._sum.amount?.toFixed(2) || "0.00"}`,
      description: "All time earnings",
      icon: DollarSign,
      color: "text-emerald-600"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Coach Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's what's happening with your players.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button asChild>
            <Link href="/coach/users">
              <UserPlus className="mr-2 h-4 w-4" />
              View All Users
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/coach/sessions">
              <Calendar className="mr-2 h-4 w-4" />
              Manage Sessions
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistics Grid */}
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

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>
              New player registrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center space-x-4">
                  <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {user.name?.charAt(0) || user.email.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user.name || "Unnamed User"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="/coach/users">View All Users</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
            <CardDescription>
              Next scheduled training sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingSessions.map((booking) => (
                <div key={booking.id} className="flex items-center space-x-4">
                  <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {booking.user.name || booking.user.email}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {booking.course?.name || booking.sessionType}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={booking.status === "CONFIRMED" ? "default" : "secondary"}>
                      {booking.status}
                    </Badge>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(booking.scheduledFor).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="/coach/sessions">View All Sessions</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/coach/users">
                <Users className="h-6 w-6 mb-2" />
                Manage Users
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/coach/sessions">
                <Calendar className="h-6 w-6 mb-2" />
                View Sessions
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/coach/communications">
                <MessageSquare className="h-6 w-6 mb-2" />
                Send Message
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/coach/content">
                <Video className="h-6 w-6 mb-2" />
                Upload Content
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
