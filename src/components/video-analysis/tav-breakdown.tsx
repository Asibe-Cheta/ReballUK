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
  BarChart3,
  ArrowRight,
  ArrowLeft,
  Circle,
  Square,
  Triangle,
  Users,
  Award,
  Lightbulb,
  MessageSquare
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

interface TacticalOverlay {
  id: string
  type: "arrow" | "circle" | "line" | "box"
  startTime: number
  endTime: number
  position: { x: number; y: number }
  endPosition?: { x: number; y: number }
  color: string
  label?: string
  description: string
}

interface KeyMoment {
  id: string
  time: number
  type: "goal" | "assist" | "defense" | "transition" | "set-piece"
  title: string
  description: string
  impact: "high" | "medium" | "low"
  player: string
  position: string
}

interface ExpertCommentary {
  id: string
  time: number
  commentator: string
  title: string
  analysis: string
  rating: number
  tags: string[]
}

interface TAVBreakdownProps {
  video: VideoData
}

export default function TAVBreakdown({ video }: TAVBreakdownProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [showOverlays, setShowOverlays] = useState(true)
  const [showCommentary, setShowCommentary] = useState(true)
  const [selectedMoment, setSelectedMoment] = useState<KeyMoment | null>(null)
  const [drawingMode, setDrawingMode] = useState<"arrow" | "circle" | "line" | "box" | null>(null)

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
    }
  }

  // Mock data for demonstration
  const tacticalOverlays: TacticalOverlay[] = [
    {
      id: "1",
      type: "arrow",
      startTime: 12,
      endTime: 18,
      position: { x: 30, y: 50 },
      endPosition: { x: 70, y: 30 },
      color: "#00ff00",
      label: "Player Movement",
      description: "Excellent off-the-ball movement to create space"
    },
    {
      id: "2",
      type: "circle",
      startTime: 25,
      endTime: 32,
      position: { x: 45, y: 60 },
      color: "#ff0000",
      label: "Pressure Point",
      description: "Defensive pressure forcing the error"
    },
    {
      id: "3",
      type: "line",
      startTime: 40,
      endTime: 45,
      position: { x: 20, y: 40 },
      endPosition: { x: 80, y: 40 },
      color: "#0000ff",
      label: "Defensive Line",
      description: "Well-organized defensive structure"
    }
  ]

  const keyMoments: KeyMoment[] = [
    {
      id: "1",
      time: 15,
      type: "goal",
      title: "Clinical Finish",
      description: "Excellent composure in front of goal, perfect technique",
      impact: "high",
      player: "Alex Johnson",
      position: "Striker"
    },
    {
      id: "2",
      time: 28,
      type: "assist",
      title: "Vision and Execution",
      description: "Perfect through ball, excellent vision and timing",
      impact: "high",
      player: "Mike Chen",
      position: "Midfielder"
    },
    {
      id: "3",
      time: 42,
      type: "defense",
      title: "Crucial Interception",
      description: "Well-timed tackle, prevented counter-attack",
      impact: "medium",
      player: "Sarah Williams",
      position: "Defender"
    }
  ]

  const expertCommentary: ExpertCommentary[] = [
    {
      id: "1",
      time: 10,
      commentator: "Gary Neville",
      title: "Tactical Brilliance",
      analysis: "This is exactly what we want to see from a modern striker. The movement off the ball creates space for teammates and the finish is clinical.",
      rating: 9,
      tags: ["tactics", "finishing", "movement"]
    },
    {
      id: "2",
      time: 25,
      commentator: "Jamie Carragher",
      title: "Defensive Organization",
      analysis: "The defensive line is perfectly positioned. They're compact, they're communicating, and they're cutting off all passing lanes.",
      rating: 8,
      tags: ["defense", "organization", "communication"]
    },
    {
      id: "3",
      time: 38,
      commentator: "Thierry Henry",
      title: "Attacking Transition",
      analysis: "The speed of transition from defense to attack is exceptional. This is how you catch teams out of position.",
      rating: 9,
      tags: ["transition", "speed", "attack"]
    }
  ]

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
      drawOverlays()
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

  const drawOverlays = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw overlays for current time
    const currentOverlays = tacticalOverlays.filter(
      overlay => currentTime >= overlay.startTime && currentTime <= overlay.endTime
    )

    currentOverlays.forEach(overlay => {
      ctx.strokeStyle = overlay.color
      ctx.fillStyle = overlay.color
      ctx.lineWidth = 3

      const x = (overlay.position.x / 100) * canvas.width
      const y = (overlay.position.y / 100) * canvas.height

      switch (overlay.type) {
        case "arrow":
          if (overlay.endPosition) {
            const endX = (overlay.endPosition.x / 100) * canvas.width
            const endY = (overlay.endPosition.y / 100) * canvas.height
            
            // Draw arrow
            ctx.beginPath()
            ctx.moveTo(x, y)
            ctx.lineTo(endX, endY)
            ctx.stroke()
            
            // Draw arrowhead
            const angle = Math.atan2(endY - y, endX - x)
            ctx.beginPath()
            ctx.moveTo(endX, endY)
            ctx.lineTo(endX - 10 * Math.cos(angle - Math.PI / 6), endY - 10 * Math.sin(angle - Math.PI / 6))
            ctx.moveTo(endX, endY)
            ctx.lineTo(endX - 10 * Math.cos(angle + Math.PI / 6), endY - 10 * Math.sin(angle + Math.PI / 6))
            ctx.stroke()
          }
          break
        case "circle":
          ctx.beginPath()
          ctx.arc(x, y, 20, 0, 2 * Math.PI)
          ctx.stroke()
          break
        case "line":
          if (overlay.endPosition) {
            const endX = (overlay.endPosition.x / 100) * canvas.width
            const endY = (overlay.endPosition.y / 100) * canvas.height
            ctx.beginPath()
            ctx.moveTo(x, y)
            ctx.lineTo(endX, endY)
            ctx.stroke()
          }
          break
        case "box":
          if (overlay.endPosition) {
            const endX = (overlay.endPosition.x / 100) * canvas.width
            const endY = (overlay.endPosition.y / 100) * canvas.height
            ctx.strokeRect(x, y, endX - x, endY - y)
          }
          break
      }

      // Draw label
      if (overlay.label) {
        ctx.fillStyle = "white"
        ctx.strokeStyle = "black"
        ctx.lineWidth = 2
        ctx.font = "12px Arial"
        ctx.strokeText(overlay.label, x + 25, y - 10)
        ctx.fillText(overlay.label, x + 25, y - 10)
      }
    })
  }

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

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const getCurrentCommentary = () => {
    return expertCommentary.find(
      commentary => Math.abs(commentary.time - currentTime) < 3
    )
  }

  const getCurrentMoments = () => {
    return keyMoments.filter(
      moment => Math.abs(moment.time - currentTime) < 2
    )
  }

  return (
    <div className="space-y-6">
      {/* Video Player with Tactical Overlays */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            TAV Breakdown: {video.title}
          </CardTitle>
          <CardDescription>
            Technical Analysis Video - Match of the Day style analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Video Container with Canvas Overlay */}
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-auto"
              poster={video.thumbnailUrl}
              src={video.videoUrl}
            />
            
            {/* Canvas for Tactical Overlays */}
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              width={800}
              height={450}
            />

            {/* Expert Commentary Overlay */}
            {showCommentary && getCurrentCommentary() && (
              <div className="absolute top-4 left-4 right-4 bg-black/80 text-white p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-sm font-medium">{getCurrentCommentary()?.commentator}</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < (getCurrentCommentary()?.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <h4 className="font-medium mb-1">{getCurrentCommentary()?.title}</h4>
                <p className="text-sm">{getCurrentCommentary()?.analysis}</p>
              </div>
            )}

            {/* Key Moments Overlay */}
            {getCurrentMoments().map(moment => (
              <div
                key={moment.id}
                className={`absolute top-4 right-4 p-2 rounded-lg cursor-pointer transition-all ${
                  moment.impact === "high" ? "bg-red-500/90" :
                  moment.impact === "medium" ? "bg-yellow-500/90" :
                  "bg-blue-500/90"
                }`}
                onClick={() => setSelectedMoment(moment)}
              >
                <Award className="h-4 w-4 text-white" />
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
                    onClick={() => videoRef.current && (videoRef.current.currentTime -= 10)}
                    className="text-white hover:bg-white/20"
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => videoRef.current && (videoRef.current.currentTime += 10)}
                    className="text-white hover:bg-white/20"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>

                  <span className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Drawing Tools */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant={drawingMode === "arrow" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setDrawingMode(drawingMode === "arrow" ? null : "arrow")}
                      className="text-white hover:bg-white/20"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={drawingMode === "circle" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setDrawingMode(drawingMode === "circle" ? null : "circle")}
                      className="text-white hover:bg-white/20"
                    >
                      <Circle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={drawingMode === "line" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setDrawingMode(drawingMode === "line" ? null : "line")}
                      className="text-white hover:bg-white/20"
                    >
                      <PenTool className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>

                  <select
                    value={playbackSpeed}
                    onChange={(e) => {
                      setPlaybackSpeed(Number(e.target.value))
                      if (videoRef.current) {
                        videoRef.current.playbackRate = Number(e.target.value)
                      }
                    }}
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
                </div>
              </div>
            </div>
          </div>

          {/* Control Toggles */}
          <div className="flex items-center gap-4">
            <Button
              variant={showOverlays ? "default" : "outline"}
              size="sm"
              onClick={() => setShowOverlays(!showOverlays)}
            >
              <PenTool className="mr-2 h-4 w-4" />
              Tactical Overlays
            </Button>
            
            <Button
              variant={showCommentary ? "default" : "outline"}
              size="sm"
              onClick={() => setShowCommentary(!showCommentary)}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Expert Commentary
            </Button>

            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share Analysis
            </Button>

            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Moments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Key Moments
            </CardTitle>
            <CardDescription>
              Critical plays and tactical decisions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {keyMoments.map(moment => (
              <div
                key={moment.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedMoment?.id === moment.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setSelectedMoment(moment)}
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge
                    variant={
                      moment.impact === "high" ? "default" :
                      moment.impact === "medium" ? "secondary" :
                      "outline"
                    }
                  >
                    {moment.type}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatTime(moment.time)}
                  </span>
                </div>
                <h4 className="font-medium mb-1">{moment.title}</h4>
                <p className="text-sm mb-2">{moment.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{moment.player}</span>
                  <span>{moment.position}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Expert Commentary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Expert Commentary
            </CardTitle>
            <CardDescription>
              Professional analysis and insights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {expertCommentary.map(commentary => (
              <div key={commentary.id} className="p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{commentary.commentator}</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < commentary.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <h4 className="font-medium mb-1">{commentary.title}</h4>
                <p className="text-sm mb-2">{commentary.analysis}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {formatTime(commentary.time)}
                  </span>
                  <div className="flex gap-1">
                    {commentary.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Tactical Analysis Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Tactical Analysis Summary
          </CardTitle>
          <CardDescription>
            Key insights and recommendations from the analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-500/10 rounded-lg">
              <div className="text-2xl font-bold text-green-600">85%</div>
              <div className="text-sm text-muted-foreground">Tactical Execution</div>
            </div>
            <div className="text-center p-4 bg-blue-500/10 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">92%</div>
              <div className="text-sm text-muted-foreground">Decision Making</div>
            </div>
            <div className="text-center p-4 bg-purple-500/10 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">78%</div>
              <div className="text-sm text-muted-foreground">Positioning</div>
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            <h4 className="font-medium">Key Recommendations:</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5" />
                <span>Improve defensive positioning during transitions</span>
              </li>
              <li className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5" />
                <span>Enhance communication with teammates</span>
              </li>
              <li className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5" />
                <span>Work on finishing under pressure</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
