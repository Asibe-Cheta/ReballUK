"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  VolumeX,
  Settings,
  Share2,
  Download,
  Eye,
  Clock,
  Target,
  Mic,
  PenTool,
  Star,
  Zap,
  SkipBack,
  SkipForward,
  Maximize,
  Minimize,
  BarChart3
} from "lucide-react"

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

interface PerformanceMarker {
  id: string
  time: number
  type: "success" | "improvement" | "coaching"
  description: string
  confidence: number
}

interface VoiceoverSegment {
  id: string
  startTime: number
  endTime: number
  text: string
  coach: string
}

interface SISWPlayerProps {
  video: VideoData
}

export default function SISWPlayer({ video }: SISWPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showVoiceover, setShowVoiceover] = useState(true)
  const [showMarkers, setShowMarkers] = useState(true)
  const [selectedMarker, setSelectedMarker] = useState<PerformanceMarker | null>(null)

  // Mock data for demonstration
  const performanceMarkers: PerformanceMarker[] = [
    {
      id: "1",
      time: 15,
      type: "success",
      description: "Excellent first touch control",
      confidence: 85
    },
    {
      id: "2", 
      time: 32,
      type: "improvement",
      description: "Good body positioning, could improve speed",
      confidence: 70
    },
    {
      id: "3",
      time: 48,
      type: "coaching",
      description: "Remember to keep your head up",
      confidence: 60
    }
  ]

  const voiceoverSegments: VoiceoverSegment[] = [
    {
      id: "1",
      startTime: 10,
      endTime: 20,
      text: "Notice how the player maintains excellent control under pressure",
      coach: "Coach Mike"
    },
    {
      id: "2",
      startTime: 30,
      endTime: 40,
      text: "This is where we see the improvement in decision making",
      coach: "Coach Sarah"
    },
    {
      id: "3",
      startTime: 45,
      endTime: 55,
      text: "The body positioning here is crucial for success",
      coach: "Coach Mike"
    }
  ]

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("loadedmetadata", handleLoadedMetadata)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
    }
  }, [])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const changePlaybackSpeed = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed
      setPlaybackSpeed(speed)
    }
  }

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const getCurrentVoiceover = () => {
    return voiceoverSegments.find(
      segment => currentTime >= segment.startTime && currentTime <= segment.endTime
    )
  }

  const getCurrentMarkers = () => {
    return performanceMarkers.filter(
      marker => Math.abs(marker.time - currentTime) < 2
    )
  }

  return (
    <div className="space-y-6">
      {/* Video Player */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            SISW Analysis: {video.title}
          </CardTitle>
          <CardDescription>
            Session in Slow-motion with Voiceover - {video.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Video Container */}
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-auto"
              poster={video.thumbnailUrl}
              src={video.videoUrl}
            />
            
            {/* Voiceover Overlay */}
            {showVoiceover && getCurrentVoiceover() && (
              <div className="absolute bottom-20 left-4 right-4 bg-black/80 text-white p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Mic className="h-4 w-4" />
                  <span className="text-sm font-medium">{getCurrentVoiceover()?.coach}</span>
                </div>
                <p className="text-sm">{getCurrentVoiceover()?.text}</p>
              </div>
            )}

            {/* Performance Markers Overlay */}
            {showMarkers && getCurrentMarkers().map(marker => (
              <div
                key={marker.id}
                className={`absolute top-4 right-4 p-2 rounded-lg cursor-pointer transition-all ${
                  marker.type === "success" ? "bg-green-500/90" :
                  marker.type === "improvement" ? "bg-yellow-500/90" :
                  "bg-blue-500/90"
                }`}
                onClick={() => setSelectedMarker(marker)}
              >
                <Target className="h-4 w-4 text-white" />
              </div>
            ))}

            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              {/* Progress Bar */}
              <div className="mb-2">
                <Slider
                  value={[currentTime]}
                  max={duration}
                  step={0.1}
                  onValueChange={handleSeek}
                  className="w-full"
                />
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={togglePlay}
                    className="text-white hover:bg-white/20"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => skipTime(-10)}
                    className="text-white hover:bg-white/20"
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => skipTime(10)}
                    className="text-white hover:bg-white/20"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>

                  <span className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Volume Control */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleMute}
                      className="text-white hover:bg-white/20"
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      max={1}
                      step={0.1}
                      onValueChange={handleVolumeChange}
                      className="w-20"
                    />
                  </div>

                  {/* Playback Speed */}
                  <select
                    value={playbackSpeed}
                    onChange={(e) => changePlaybackSpeed(Number(e.target.value))}
                    className="bg-transparent text-white text-sm border border-white/20 rounded px-2 py-1"
                  >
                    <option value={0.25}>0.25x</option>
                    <option value={0.5}>0.5x</option>
                    <option value={0.75}>0.75x</option>
                    <option value={1}>1x</option>
                    <option value={1.25}>1.25x</option>
                    <option value={1.5}>1.5x</option>
                    <option value={2}>2x</option>
                  </select>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Control Toggles */}
          <div className="flex items-center gap-4">
            <Button
              variant={showVoiceover ? "default" : "outline"}
              size="sm"
              onClick={() => setShowVoiceover(!showVoiceover)}
            >
              <Mic className="mr-2 h-4 w-4" />
              Voiceover
            </Button>
            
            <Button
              variant={showMarkers ? "default" : "outline"}
              size="sm"
              onClick={() => setShowMarkers(!showMarkers)}
            >
              <Target className="mr-2 h-4 w-4" />
              Markers
            </Button>

            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>

            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Performance Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Markers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Performance Markers
            </CardTitle>
            <CardDescription>
              Key moments and coaching points throughout the session
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {performanceMarkers.map(marker => (
              <div
                key={marker.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedMarker?.id === marker.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setSelectedMarker(marker)}
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge
                    variant={
                      marker.type === "success" ? "default" :
                      marker.type === "improvement" ? "secondary" :
                      "outline"
                    }
                  >
                    {marker.type}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatTime(marker.time)}
                  </span>
                </div>
                <p className="text-sm mb-2">{marker.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Confidence:</span>
                  <Progress value={marker.confidence} className="flex-1" />
                  <span className="text-xs font-medium">{marker.confidence}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Session Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Session Statistics
            </CardTitle>
            <CardDescription>
              Performance metrics and analysis summary
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {video.performance?.successRate || 75}%
                </div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
              <div className="text-center p-4 bg-secondary/5 rounded-lg">
                <div className="text-2xl font-bold text-secondary-foreground">
                  {video.performance?.confidence || 82}%
                </div>
                <div className="text-sm text-muted-foreground">Confidence</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Key Moments</span>
                <span className="text-sm font-medium">{video.performance?.keyMoments || 5}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Session Duration</span>
                <span className="text-sm font-medium">{formatTime(video.duration)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Analysis Type</span>
                <Badge variant="outline">{video.analysisType}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Position</span>
                <span className="text-sm font-medium">{video.position || "General"}</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {video.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
