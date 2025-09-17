'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  Target,
  Activity,
  Download,
  Filter
} from 'lucide-react'

interface ProfileSubmission {
  id: string
  user: {
    id: string
    name: string
    email: string
    createdAt: string
  }
  playerName: string
  dateOfBirth: string | null
  guardianName: string | null
  contactEmail: string | null
  contactNumber: string | null
  postcode: string | null
  medicalConditions: string | null
  position: string | null
  playingLevel: string | null
  currentTeam: string | null
  trainingReason: string | null
  hearAbout: string | null
  postTrainingSnacks: string | null
  postTrainingDrinks: string | null
  socialMediaConsent: boolean
  marketingConsent: boolean
  welcomeCompleted: boolean
  welcomeCompletedDate: string | null
  createdAt: string
  updatedAt: string
}

export function ProfileSubmissions() {
  const [submissions, setSubmissions] = useState<ProfileSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    fetchSubmissions()
  }, [statusFilter, sortBy])

  const fetchSubmissions = async () => {
    try {
      const response = await fetch(`/api/admin/profiles?status=${statusFilter}&sort=${sortBy}`)
      if (response.ok) {
        const data = await response.json()
        setSubmissions(data)
      }
    } catch (error) {
      console.error('Failed to fetch profile submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    const csvContent = [
      // Headers
      [
        'Player Name',
        'Email',
        'Contact Email',
        'Contact Number',
        'Postcode',
        'Position',
        'Playing Level',
        'Current Team',
        'Training Reason',
        'Hear About',
        'Social Media Consent',
        'Marketing Consent',
        'Status',
        'Completion Date',
        'Registration Date'
      ].join(','),
      // Data rows
      ...submissions.map(submission => [
        submission.playerName || '',
        submission.user.email,
        submission.contactEmail || '',
        submission.contactNumber || '',
        submission.postcode || '',
        submission.position || '',
        submission.playingLevel || '',
        submission.currentTeam || '',
        submission.trainingReason || '',
        submission.hearAbout || '',
        submission.socialMediaConsent ? 'Yes' : 'No',
        submission.marketingConsent ? 'Yes' : 'No',
        submission.welcomeCompleted ? 'Completed' : 'Pending',
        submission.welcomeCompletedDate ? new Date(submission.welcomeCompletedDate).toLocaleDateString() : '',
        new Date(submission.user.createdAt).toLocaleDateString()
      ].map(field => `"${field}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `profile-submissions-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const getStatusBadge = (submission: ProfileSubmission) => {
    if (submission.welcomeCompleted) {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
        <CheckCircle className="h-3 w-3 mr-1" />
        Completed
      </Badge>
    } else {
      return <Badge variant="outline" className="border-yellow-200 text-yellow-800 dark:border-yellow-800 dark:text-yellow-200">
        <Clock className="h-3 w-3 mr-1" />
        Pending
      </Badge>
    }
  }

  const getPositionBadge = (position: string | null) => {
    if (!position) return <Badge variant="outline">Not Set</Badge>
    return <Badge variant="secondary">{position}</Badge>
  }

  const getPlayingLevelBadge = (level: string | null) => {
    if (!level) return <Badge variant="outline">Not Set</Badge>
    
    const colors = {
      'BEGINNER': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'INTERMEDIATE': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'ADVANCED': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'PROFESSIONAL': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    
    return <Badge className={colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
      {level}
    </Badge>
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Submissions</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">View and manage profile completion submissions</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Submissions</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">View and manage profile completion submissions</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={exportToCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Sorting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name">Player Name</SelectItem>
                <SelectItem value="completion">Completion Date</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={fetchSubmissions}>
              <Filter className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Submissions</CardTitle>
          <CardDescription>
            {submissions.length} total submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Player</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Completed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{submission.playerName || 'Not Set'}</div>
                        <div className="text-sm text-gray-500">{submission.user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {submission.contactEmail && (
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-1" />
                            {submission.contactEmail}
                          </div>
                        )}
                        {submission.contactNumber && (
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-1" />
                            {submission.contactNumber}
                          </div>
                        )}
                        {submission.postcode && (
                          <div className="flex items-center text-sm">
                            <MapPin className="h-3 w-3 mr-1" />
                            {submission.postcode}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getPositionBadge(submission.position)}
                    </TableCell>
                    <TableCell>
                      {getPlayingLevelBadge(submission.playingLevel)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(submission)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {submission.welcomeCompletedDate ? (
                        <div className="flex items-center text-sm">
                          <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                          {new Date(submission.welcomeCompletedDate).toLocaleDateString()}
                        </div>
                      ) : (
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          Not completed
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submissions.length}</div>
            <p className="text-xs text-muted-foreground">
              All profile submissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {submissions.filter(s => s.welcomeCompleted).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {submissions.length > 0 
                ? Math.round((submissions.filter(s => s.welcomeCompleted).length / submissions.length) * 100)
                : 0
              }% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {submissions.filter(s => !s.welcomeCompleted).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting completion
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
