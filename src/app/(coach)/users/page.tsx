import { requireCoach } from "@/lib/coach-auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  MessageSquare, 
  Calendar,
  TrendingUp,
  UserPlus
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; position?: string }>
}) {
  await requireCoach()

  const resolvedSearchParams = await searchParams
  const { search, status, position } = resolvedSearchParams

  // Build where clause for filtering
  const where: any = {
    role: "USER"
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { profile: { playerName: { contains: search, mode: "insensitive" } } }
    ]
  }

  if (status === "active") {
    where.profile = { isNot: null }
  } else if (status === "inactive") {
    where.profile = { is: null }
  }

  if (position) {
    where.profile = { ...where.profile, position }
  }

  // Fetch users with their profiles and statistics
  const users = await prisma.user.findMany({
    where,
    include: {
      profile: true,
      _count: {
        select: {
          bookings: true,
          progress: true,
          videos: true
        }
      },
      bookings: {
        where: {
          status: "COMPLETED"
        },
        select: {
          id: true
        }
      },
      progress: {
        orderBy: {
          createdAt: "desc"
        },
        take: 1,
        select: {
          createdAt: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  // Calculate statistics
  const totalUsers = users.length
  const activeUsers = users.filter(user => user.profile !== null).length
  const usersWithBookings = users.filter(user => user._count.bookings > 0).length
  const usersWithProgress = users.filter(user => user._count.progress > 0).length

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      description: "Registered players"
    },
    {
      title: "Active Users",
      value: activeUsers,
      description: "Currently active"
    },
    {
      title: "Users with Bookings",
      value: usersWithBookings,
      description: "Have scheduled sessions"
    },
    {
      title: "Users with Progress",
      value: usersWithProgress,
      description: "Have training data"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage all registered players and their training progress
          </p>
        </div>
        <Button asChild>
          <Link href="/coach/users/new">
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Link>
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
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

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>
            Find specific users or filter by criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or email..."
                  className="pl-10"
                  defaultValue={search}
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            Complete list of registered players
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {user.name?.charAt(0) || user.email.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">
                          {user.name || "Unnamed User"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.profile?.position ? (
                      <Badge variant="outline">
                        {user.profile.position}
                      </Badge>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.profile?.playingLevel ? (
                      <Badge variant="secondary">
                        {user.profile.playingLevel}
                      </Badge>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.profile ? "default" : "secondary"}>
                      {user.profile ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{user._count.bookings}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-4 w-4 text-gray-400" />
                      <span>{user._count.progress}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.progress[0] ? (
                      <span className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(user.progress[0].createdAt), { addSuffix: true })}
                      </span>
                    ) : (
                      <span className="text-gray-400">Never</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/coach/users/${user.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/coach/communications?user=${user.id}`}>
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
    </div>
  )
}
