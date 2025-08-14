"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Video, 
  Play, 
  Eye, 
  Clock, 
  Calendar,
  Target,
  BarChart3,
  Search,
  Filter,
  Grid,
  List,
  MoreVertical,
  Download,
  Share2,
  Trash2,
  Edit,
  Star,
  Users
} from "lucide-react"
import { format } from "date-fns"

interface VideoData {
  id: string
  title: string
  description: string
  videoUrl: string
  thumbnailUrl: string
  duration: number
  analysisType: "SISW" | "TAV"
  tags: string[]
  viewCount: number
  createdAt: string
  sessionId?: string
  position?: string
  performance?: {
    successRate: number
    confidence: number
    keyMoments: number
  }
}

interface VideoLibraryProps {
  videos: VideoData[]
  onVideoSelect: (video: VideoData) => void
  isLoading: boolean
  filterType: "all" | "SISW" | "TAV"
  setFilterType: (type: "all" | "SISW" | "TAV") => void
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export default function VideoLibrary({
  videos,
  onVideoSelect,
  isLoading,
  filterType,
  setFilterType,
  searchQuery,
  setSearchQuery
}: VideoLibraryProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"date" | "title" | "duration" | "views">("date")

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy")
  }

  const sortedVideos = [...videos].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "title":
        return a.title.localeCompare(b.title)
      case "duration":
        return b.duration - a.duration
      case "views":
        return b.viewCount - a.viewCount
      default:
        return 0
    }
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Video className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No videos yet</h3>
          <p className="text-muted-foreground mb-4">
            Upload your first training session video to get started with analysis
          </p>
          <Button>
            <Video className="mr-2 h-4 w-4" />
            Upload Video
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters and Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <Select value={filterType} onValueChange={(value: "all" | "SISW" | "TAV") => setFilterType(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="SISW">SISW</SelectItem>
              <SelectItem value="TAV">TAV</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value: "date" | "title" | "duration" | "views") => setSortBy(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date Added</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="duration">Duration</SelectItem>
              <SelectItem value="views">Views</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Video Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedVideos.map(video => (
            <VideoCard
              key={video.id}
              video={video}
              onSelect={onVideoSelect}
              formatDuration={formatDuration}
              formatDate={formatDate}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedVideos.map(video => (
            <VideoListItem
              key={video.id}
              video={video}
              onSelect={onVideoSelect}
              formatDuration={formatDuration}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}

      {/* Stats Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Library Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{videos.length}</div>
              <div className="text-sm text-muted-foreground">Total Videos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {videos.reduce((sum, video) => sum + video.duration, 0) / 60}
              </div>
              <div className="text-sm text-muted-foreground">Total Minutes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {videos.reduce((sum, video) => sum + video.viewCount, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Views</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {videos.filter(v => v.analysisType === "SISW").length}
              </div>
              <div className="text-sm text-muted-foreground">SISW Videos</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface VideoCardProps {
  video: VideoData
  onSelect: (video: VideoData) => void
  formatDuration: (seconds: number) => string
  formatDate: (dateString: string) => string
}

function VideoCard({ video, onSelect, formatDuration, formatDate }: VideoCardProps) {
  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-all" onClick={() => onSelect(video)}>
      <div className="relative">
        <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
          {video.thumbnailUrl ? (
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <Video className="h-12 w-12 text-gray-400" />
            </div>
          )}
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black/50 rounded-full p-3">
              <Play className="h-6 w-6 text-white fill-white" />
            </div>
          </div>

          {/* Duration Badge */}
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {formatDuration(video.duration)}
          </div>

          {/* Analysis Type Badge */}
          <div className="absolute top-2 left-2">
            <Badge
              variant={video.analysisType === "SISW" ? "default" : "secondary"}
              className="text-xs"
            >
              {video.analysisType === "SISW" ? (
                <Target className="mr-1 h-3 w-3" />
              ) : (
                <BarChart3 className="mr-1 h-3 w-3" />
              )}
              {video.analysisType}
            </Badge>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-medium line-clamp-2">{video.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {video.description}
          </p>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {video.viewCount}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(video.createdAt)}
            </div>
          </div>

          {video.position && (
            <Badge variant="outline" className="text-xs">
              {video.position}
            </Badge>
          )}

          {video.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {video.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {video.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{video.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface VideoListItemProps {
  video: VideoData
  onSelect: (video: VideoData) => void
  formatDuration: (seconds: number) => string
  formatDate: (dateString: string) => string
}

function VideoListItem({ video, onSelect, formatDuration, formatDate }: VideoListItemProps) {
  return (
    <Card className="group cursor-pointer hover:shadow-md transition-all" onClick={() => onSelect(video)}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Thumbnail */}
          <div className="relative w-32 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            {video.thumbnailUrl ? (
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <Video className="h-8 w-8 text-gray-400" />
              </div>
            )}
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-black/50 rounded-full p-2">
                <Play className="h-4 w-4 text-white fill-white" />
              </div>
            </div>

            {/* Duration Badge */}
            <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded text-xs">
              {formatDuration(video.duration)}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium line-clamp-1">{video.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {video.description}
                </p>
                
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {video.viewCount} views
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(video.createdAt)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDuration(video.duration)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <Badge
                  variant={video.analysisType === "SISW" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {video.analysisType === "SISW" ? (
                    <Target className="mr-1 h-3 w-3" />
                  ) : (
                    <BarChart3 className="mr-1 h-3 w-3" />
                  )}
                  {video.analysisType}
                </Badge>
                
                {video.position && (
                  <Badge variant="outline" className="text-xs">
                    {video.position}
                  </Badge>
                )}
              </div>
            </div>

            {video.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {video.tags.slice(0, 5).map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {video.tags.length > 5 && (
                  <Badge variant="secondary" className="text-xs">
                    +{video.tags.length - 5}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
