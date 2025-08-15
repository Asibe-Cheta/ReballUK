import { requireCoach } from "@/lib/coach-auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  MessageSquare, 
  Send, 
  Users, 
  Mail, 
  Bell,
  Eye,
  Archive,
  Trash2,
  MoreHorizontal,
  UserPlus
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

export default async function CommunicationsPage({
  searchParams,
}: {
  searchParams: { user?: string; type?: string }
}) {
  await requireCoach()

  const { user, type } = searchParams

  // Fetch communications
  const communications = await prisma.communication.findMany({
    where: {
      coachId: session.user.id,
      ...(type && { type: type.toUpperCase() }),
      ...(user && { userId: user })
    },
    include: {
      user: {
        include: {
          profile: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  // Fetch all users for message targeting
  const users = await prisma.user.findMany({
    where: { role: "USER" },
    include: { profile: true },
    orderBy: { name: "asc" }
  })

  // Calculate statistics
  const totalMessages = communications.length
  const unreadMessages = communications.filter(c => !c.isRead).length
  const broadcastMessages = communications.filter(c => !c.userId).length
  const directMessages = communications.filter(c => c.userId).length

  const stats = [
    {
      title: "Total Messages",
      value: totalMessages,
      description: "All communications",
      icon: MessageSquare,
      color: "text-blue-600"
    },
    {
      title: "Unread",
      value: unreadMessages,
      description: "Pending review",
      icon: Bell,
      color: "text-orange-600"
    },
    {
      title: "Broadcasts",
      value: broadcastMessages,
      description: "Announcements",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Direct Messages",
      value: directMessages,
      description: "Individual messages",
      icon: Mail,
      color: "text-green-600"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Communications Hub
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Send messages, announcements, and manage communications
          </p>
        </div>
        <Button asChild>
          <Link href="/coach/communications/new">
            <Send className="mr-2 h-4 w-4" />
            New Message
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

      {/* Send New Message */}
      <Card>
        <CardHeader>
          <CardTitle>Send New Message</CardTitle>
          <CardDescription>
            Send a message to specific users or broadcast to all
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="messageType">Message Type</Label>
                <Select name="messageType" defaultValue="MESSAGE">
                  <SelectTrigger>
                    <SelectValue placeholder="Select message type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MESSAGE">Direct Message</SelectItem>
                    <SelectItem value="ANNOUNCEMENT">Announcement</SelectItem>
                    <SelectItem value="EMAIL">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipients">Recipients</Label>
                <Select name="recipients" defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Select recipients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="active">Active Users Only</SelectItem>
                    <SelectItem value="specific">Specific Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject (Optional)</Label>
              <Input 
                id="subject" 
                name="subject" 
                placeholder="Enter message subject..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Message Content</Label>
              <Textarea 
                id="content" 
                name="content" 
                placeholder="Enter your message..."
                rows={4}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button">
                Save Draft
              </Button>
              <Button type="submit">
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Message History */}
      <Card>
        <CardHeader>
          <CardTitle>Message History</CardTitle>
          <CardDescription>
            Recent communications and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {communications.map((communication) => (
                <TableRow key={communication.id}>
                  <TableCell>
                    <Badge variant="outline">
                      {communication.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {communication.user ? (
                      <div>
                        <p className="font-medium">
                          {communication.user.name || "Unnamed User"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {communication.user.email}
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">All Users</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {communication.subject || "No Subject"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                        {communication.content}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Badge variant={communication.isRead ? "default" : "secondary"}>
                        {communication.isRead ? "Read" : "Unread"}
                      </Badge>
                      {communication.isArchived && (
                        <Badge variant="outline">Archived</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(communication.createdAt), { addSuffix: true })}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Archive className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
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
            Common communication tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/coach/communications?type=announcement">
                <Bell className="h-6 w-6 mb-2" />
                Send Announcement
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/coach/communications?type=email">
                <Mail className="h-6 w-6 mb-2" />
                Send Email
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/coach/communications?type=message">
                <MessageSquare className="h-6 w-6 mb-2" />
                Direct Message
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/coach/users">
                <UserPlus className="h-6 w-6 mb-2" />
                Select Users
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
