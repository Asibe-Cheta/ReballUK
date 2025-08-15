import { requireCoach } from "@/lib/coach-auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  MessageSquare,
  Video,
  MoreHorizontal,
  Filter
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow, format } from "date-fns"

export default async function SessionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; date?: string }>
}) {
  await requireCoach()

  const resolvedSearchParams = await searchParams
  const { status, date } = resolvedSearchParams

  // Build where clause for filtering
  const where: any = {}

  if (status) {
    where.status = status.toUpperCase()
  }

  if (date) {
    const startDate = new Date(date)
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 1)
    where.scheduledFor = {
      gte: startDate,
      lt: endDate
    }
  }

  // Fetch sessions with user and course information
  const sessions = await prisma.booking.findMany({
    where,
    include: {
      user: {
        include: {
          profile: true
        }
      },
      course: true,
      videos: {
        select: {
          id: true,
          title: true,
          videoType: true
        }
      }
    },
    orderBy: { scheduledFor: "desc" }
  })

  // Calculate statistics
  const totalSessions = sessions.length
  const pendingSessions = sessions.filter(s => s.status === "PENDING").length
  const confirmedSessions = sessions.filter(s => s.status === "CONFIRMED").length
  const completedSessions = sessions.filter(s => s.status === "COMPLETED").length
  const cancelledSessions = sessions.filter(s => s.status === "CANCELLED").length

  const stats = [
    {
      title: "Total Sessions",
      value: totalSessions,
      description: "All time bookings",
      icon: Calendar,
      color: "text-blue-600"
    },
    {
      title: "Pending",
      value: pendingSessions,
      description: "Awaiting approval",
      icon: Clock,
      color: "text-orange-600"
    },
    {
      title: "Confirmed",
      value: confirmedSessions,
      description: "Scheduled sessions",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "Completed",
      value: completedSessions,
      description: "Finished sessions",
      icon: CheckCircle,
      color: "text-emerald-600"
    },
    {
      title: "Cancelled",
      value: cancelledSessions,
      description: "Cancelled sessions",
      icon: XCircle,
      color: "text-red-600"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="secondary">Pending</Badge>
      case "CONFIRMED":
        return <Badge variant="default">Confirmed</Badge>
      case "IN_PROGRESS":
        return <Badge variant="outline">In Progress</Badge>
      case "COMPLETED":
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>
      case "CANCELLED":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Session Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage all training sessions and bookings
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button asChild>
            <Link href="/coach/sessions/calendar">
              <Calendar className="mr-2 h-4 w-4" />
              Calendar View
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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

      {/* Sessions Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Sessions</CardTitle>
          <CardDescription>
            Complete list of training sessions and bookings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Player</TableHead>
                <TableHead>Session Type</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {session.user.name?.charAt(0) || session.user.email.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">
                          {session.user.name || "Unnamed User"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {session.user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {session.course?.title || session.sessionType}
                      </p>
                      {session.position && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {session.position}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {format(new Date(session.scheduledFor), "MMM dd, yyyy")}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {format(new Date(session.scheduledFor), "HH:mm")}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span>{session.duration} min</span>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(session.status)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        £{session.amount.toFixed(2)}
                      </p>
                      <Badge 
                        variant={session.paymentStatus === "PAID" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {session.paymentStatus}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      {session.videos.length > 0 ? (
                        <>
                          <Video className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{session.videos.length}</span>
                        </>
                      ) : (
                        <span className="text-gray-400 text-sm">No videos</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/coach/sessions/${session.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/coach/communications?user=${session.userId}`}>
                          <MessageSquare className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common session management tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/coach/sessions?status=pending">
                <AlertCircle className="h-6 w-6 mb-2" />
                Review Pending
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/coach/sessions?status=confirmed">
                <CheckCircle className="h-6 w-6 mb-2" />
                Confirmed Sessions
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/coach/content">
                <Video className="h-6 w-6 mb-2" />
                Upload Content
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/coach/communications">
                <MessageSquare className="h-6 w-6 mb-2" />
                Send Notifications
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
