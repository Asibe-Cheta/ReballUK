'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  Search, 
  Filter, 
  Eye, 
  Mail, 
  Phone,
  MapPin,
  Calendar,
  User,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

interface Player {
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

export function PlayerManagement() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [positionFilter, setPositionFilter] = useState('all')
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)

  useEffect(() => {
    fetchPlayers()
  }, [])

  const fetchPlayers = async () => {
    try {
      const response = await fetch('/api/admin/players')
      if (response.ok) {
        const data = await response.json()
        setPlayers(data)
      }
    } catch (error) {
      console.error('Failed to fetch players:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPlayers = players.filter(player => {
    const matchesSearch = 
      player.playerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.user.name?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'completed' && player.welcomeCompleted) ||
      (statusFilter === 'pending' && !player.welcomeCompleted)

    const matchesPosition = 
      positionFilter === 'all' ||
      player.position === positionFilter

    return matchesSearch && matchesStatus && matchesPosition
  })

  const getStatusBadge = (player: Player) => {
    if (player.welcomeCompleted) {
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Player Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage all player profiles and submissions</p>
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Player Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage all player profiles and submissions</p>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {filteredPlayers.length} of {players.length} players
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
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

            <Select value={positionFilter} onValueChange={setPositionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                <SelectItem value="STRIKER">Striker</SelectItem>
                <SelectItem value="WINGER">Winger</SelectItem>
                <SelectItem value="CAM">CAM</SelectItem>
                <SelectItem value="FULLBACK">Fullback</SelectItem>
                <SelectItem value="MIDFIELDER">Midfielder</SelectItem>
                <SelectItem value="DEFENDER">Defender</SelectItem>
                <SelectItem value="GOALKEEPER">Goalkeeper</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={fetchPlayers}>
              <Filter className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Players Table */}
      <Card>
        <CardHeader>
          <CardTitle>Players</CardTitle>
          <CardDescription>
            View and manage player profiles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Player</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlayers.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{player.playerName || 'Not Set'}</div>
                        <div className="text-sm text-gray-500">{player.user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {player.contactEmail && (
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-1" />
                            {player.contactEmail}
                          </div>
                        )}
                        {player.contactNumber && (
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-1" />
                            {player.contactNumber}
                          </div>
                        )}
                        {player.postcode && (
                          <div className="flex items-center text-sm">
                            <MapPin className="h-3 w-3 mr-1" />
                            {player.postcode}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getPositionBadge(player.position)}
                    </TableCell>
                    <TableCell>
                      {getPlayingLevelBadge(player.playingLevel)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(player)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(player.user.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedPlayer(player)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Player Profile Details</DialogTitle>
                            <DialogDescription>
                              Complete profile information for {player.playerName || player.user.email}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedPlayer && (
                            <div className="space-y-6">
                              {/* Personal Information */}
                              <div>
                                <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Player Name</label>
                                    <p className="text-sm">{selectedPlayer.playerName || 'Not provided'}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                                    <p className="text-sm">{selectedPlayer.dateOfBirth ? new Date(selectedPlayer.dateOfBirth).toLocaleDateString() : 'Not provided'}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Guardian Name</label>
                                    <p className="text-sm">{selectedPlayer.guardianName || 'Not provided'}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Medical Conditions</label>
                                    <p className="text-sm">{selectedPlayer.medicalConditions || 'None reported'}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Contact Information */}
                              <div>
                                <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Contact Email</label>
                                    <p className="text-sm">{selectedPlayer.contactEmail || 'Not provided'}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Contact Number</label>
                                    <p className="text-sm">{selectedPlayer.contactNumber || 'Not provided'}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Postcode</label>
                                    <p className="text-sm">{selectedPlayer.postcode || 'Not provided'}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Football Information */}
                              <div>
                                <h3 className="text-lg font-semibold mb-3">Football Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Position</label>
                                    <p className="text-sm">{selectedPlayer.position || 'Not set'}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Playing Level</label>
                                    <p className="text-sm">{selectedPlayer.playingLevel || 'Not set'}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Current Team</label>
                                    <p className="text-sm">{selectedPlayer.currentTeam || 'Not provided'}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Training Information */}
                              <div>
                                <h3 className="text-lg font-semibold mb-3">Training Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Training Reason</label>
                                    <p className="text-sm">{selectedPlayer.trainingReason || 'Not provided'}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">How did you hear about REBALL?</label>
                                    <p className="text-sm">{selectedPlayer.hearAbout || 'Not provided'}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Post Training Snacks</label>
                                    <p className="text-sm">{selectedPlayer.postTrainingSnacks || 'Not provided'}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Post Training Drinks</label>
                                    <p className="text-sm">{selectedPlayer.postTrainingDrinks || 'Not provided'}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Consent */}
                              <div>
                                <h3 className="text-lg font-semibold mb-3">Consent</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Social Media Consent</label>
                                    <p className="text-sm">{selectedPlayer.socialMediaConsent ? 'Yes' : 'No'}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Marketing Consent</label>
                                    <p className="text-sm">{selectedPlayer.marketingConsent ? 'Yes' : 'No'}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Account Information */}
                              <div>
                                <h3 className="text-lg font-semibold mb-3">Account Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Account Email</label>
                                    <p className="text-sm">{selectedPlayer.user.email}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Account Name</label>
                                    <p className="text-sm">{selectedPlayer.user.name || 'Not set'}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Profile Completed</label>
                                    <p className="text-sm">{selectedPlayer.welcomeCompleted ? 'Yes' : 'No'}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Completion Date</label>
                                    <p className="text-sm">
                                      {selectedPlayer.welcomeCompletedDate 
                                        ? new Date(selectedPlayer.welcomeCompletedDate).toLocaleDateString()
                                        : 'Not completed'
                                      }
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
