"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Video, 
  Upload, 
  Eye,
  Clock,
  TrendingUp,
  Film,
  BarChart3
} from "lucide-react"
import SISWPlayer from "@/components/video-analysis/sisw-player"
import TAVBreakdown from "@/components/video-analysis/tav-breakdown"
import VideoUpload from "@/components/video-analysis/video-upload"
import VideoLibrary from "@/components/video-analysis/video-library"
import { ErrorBoundary } from "@/components/ui/error-boundary"

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

export default function VideoAnalysisPage() {
  return (
    <ErrorBoundary>
      <VideoAnalysisContent />
    </ErrorBoundary>
  )
}

function VideoAnalysisContent() {
  const { user, loading: isLoading } = useAuth()
  const router = useRouter()
  const [videos, setVideos] = useState<VideoData[]>([])
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null)
  const [isLoadingVideos, setIsLoadingVideos] = useState(true)
  const [filterType, setFilterType] = useState<"all" | "SISW" | "TAV">("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
      return
    }

    if (user) {
      fetchUserVideos()
    }
  }, [user, isLoading, router])

  const fetchUserVideos = async () => {
    try {
      setIsLoadingVideos(true)
      const response = await fetch("/api/videos/user")
      if (response.ok) {
        const data = await response.json()
        setVideos(data.videos)
      }
    } catch (error) {
      console.error("Error fetching videos:", error)
    } finally {
      setIsLoadingVideos(false)
    }
  }

  const handleVideoSelect = (video: VideoData) => {
    setSelectedVideo(video)
  }

        const handleVideoUpload = async () => {
        // Refresh video library after upload
        await fetchUserVideos()
      }

  const filteredVideos = videos.filter(video => {
    const matchesType = filterType === "all" || video.analysisType === filterType
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Video Analysis</h1>
          <p className="text-muted-foreground">
            Analyze your training sessions with SISW and TAV technology
          </p>
        </div>
        <Button onClick={() => setSelectedVideo(null)}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Video
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
            <Film className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{videos.length}</div>
            <p className="text-xs text-muted-foreground">
              {videos.filter(v => v.analysisType === "SISW").length} SISW, {videos.filter(v => v.analysisType === "TAV").length} TAV
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {videos.reduce((sum, video) => sum + video.viewCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all videos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analysis Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(videos.reduce((sum, video) => sum + video.duration, 0) / 60)}m
            </div>
            <p className="text-xs text-muted-foreground">
              Total video duration
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {videos.filter(v => new Date(v.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Videos this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="library" className="space-y-4">
        <TabsList>
          <TabsTrigger value="library">Video Library</TabsTrigger>
          <TabsTrigger value="sisw">SISW Analysis</TabsTrigger>
          <TabsTrigger value="tav">TAV Breakdown</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="space-y-4">
          <VideoLibrary 
            videos={filteredVideos}
            onVideoSelect={handleVideoSelect}
            isLoading={isLoadingVideos}
            filterType={filterType}
            setFilterType={setFilterType}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </TabsContent>

        <TabsContent value="sisw" className="space-y-4">
          {selectedVideo && selectedVideo.analysisType === "SISW" ? (
            <SISWPlayer video={selectedVideo} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>SISW Analysis</CardTitle>
                <CardDescription>
                  Session in Slow-motion with Voiceover analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Video className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No SISW Video Selected</h3>
                  <p className="text-muted-foreground mb-4">
                    Select a SISW video from your library to begin analysis
                  </p>
                  <Button onClick={() => setSelectedVideo(null)}>
                    Browse Library
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="tav" className="space-y-4">
          {selectedVideo && selectedVideo.analysisType === "TAV" ? (
            <TAVBreakdown video={selectedVideo} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>TAV Breakdown</CardTitle>
                <CardDescription>
                  Technical Analysis Video with Match of the Day style commentary
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No TAV Video Selected</h3>
                  <p className="text-muted-foreground mb-4">
                    Select a TAV video from your library to begin breakdown
                  </p>
                  <Button onClick={() => setSelectedVideo(null)}>
                    Browse Library
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <VideoUpload onUploadComplete={handleVideoUpload} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
