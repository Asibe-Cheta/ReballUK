"use client"

import { useState, useRef } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize2, RotateCcw } from "lucide-react"

interface TrainingVideo {
  id: string
  title: string
  description: string
  videoSrc: string
  thumbnail?: string
}

const trainingVideos: TrainingVideo[] = [
  {
    id: "first-video",
    title: "Advanced 1v1 Techniques",
    description: "Master the fundamentals of 1v1 attacking scenarios with detailed breakdowns and tactical insights.",
    videoSrc: "/videos/training/First Video.mp4"
  },
  {
    id: "second-video", 
    title: "Position-Specific Training",
    description: "Learn position-specific movements and decision-making for different areas of the pitch.",
    videoSrc: "/videos/training/Second Video.mp4"
  },
  {
    id: "last-video",
    title: "Game Scenario Analysis",
    description: "In-depth analysis of real game situations and how to apply training techniques effectively.",
    videoSrc: "/videos/training/Last video.mp4"
  }
]

export default function TrainingSessionsSection() {
  const [currentVideo, setCurrentVideo] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [videoError, setVideoError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleVideoClick = (videoId: string) => {
    setCurrentVideo(videoId)
    setVideoError(null)
    setIsLoading(true)
    setIsPlaying(true)
  }

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && duration) {
      const rect = e.currentTarget.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const newTime = (clickX / rect.width) * duration
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen()
        setIsFullscreen(true)
      } else {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const resetVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      setCurrentTime(0)
    }
  }

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('Video error:', e)
    setVideoError('Failed to load video. Please try again or contact support.')
    setIsLoading(false)
    setIsPlaying(false)
  }

  const handleVideoLoadStart = () => {
    setIsLoading(true)
    setVideoError(null)
  }

  const handleVideoCanPlay = () => {
    setIsLoading(false)
    setVideoError(null)
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Training Sessions
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Watch our training sessions in action. See how our innovative methods help players improve their game through scenario-based learning.
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {trainingVideos.map((video) => (
            <div
              key={video.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              onClick={() => handleVideoClick(video.id)}
            >
              {/* Video Thumbnail/Player */}
              <div className="relative aspect-video bg-gray-900">
                {currentVideo === video.id ? (
                  <div className="relative w-full h-full">
                    {videoError ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white p-4">
                        <div className="text-center">
                          <p className="text-red-400 mb-2">⚠️ Video Error</p>
                          <p className="text-sm">{videoError}</p>
                          <button
                            onClick={() => {
                              setVideoError(null)
                              setCurrentVideo(null)
                            }}
                            className="mt-3 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-sm"
                          >
                            Try Again
                          </button>
                        </div>
                      </div>
                    ) : (
                      <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onLoadStart={handleVideoLoadStart}
                        onCanPlay={handleVideoCanPlay}
                        onError={handleVideoError}
                        onEnded={() => setIsPlaying(false)}
                        autoPlay={isPlaying}
                        muted={isMuted}
                        preload="metadata"
                        crossOrigin="anonymous"
                      >
                        <source src={video.videoSrc} type="video/mp4" />
                        <source src={video.videoSrc} type="video/quicktime" />
                        <source src={video.videoSrc} type="video/webm" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                    
                    {isLoading && !videoError && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="text-white text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                          <p className="text-sm">Loading video...</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Video Controls Overlay */}
                    {!videoError && !isLoading && (
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        {/* Progress Bar */}
                        <div 
                          className="w-full h-1 bg-white/30 rounded-full mb-3 cursor-pointer"
                          onClick={handleProgressClick}
                        >
                          <div 
                            className="h-full bg-white rounded-full transition-all duration-100"
                            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                          />
                        </div>
                        
                        {/* Controls */}
                        <div className="flex items-center justify-between text-white">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                togglePlayPause()
                              }}
                              className="hover:scale-110 transition-transform duration-200"
                            >
                              {isPlaying ? (
                                <Pause className="w-5 h-5" />
                              ) : (
                                <Play className="w-5 h-5" />
                              )}
                            </button>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleMute()
                              }}
                              className="hover:scale-110 transition-transform duration-200"
                            >
                              {isMuted ? (
                                <VolumeX className="w-5 h-5" />
                              ) : (
                                <Volume2 className="w-5 h-5" />
                              )}
                            </button>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                resetVideo()
                              }}
                              className="hover:scale-110 transition-transform duration-200"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                            
                            <span className="text-sm">
                              {formatTime(currentTime)} / {formatTime(duration)}
                            </span>
                          </div>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleFullscreen()
                            }}
                            className="hover:scale-110 transition-transform duration-200"
                          >
                            <Maximize2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                    )}
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/50 rounded-full p-4 group-hover:bg-black/70 transition-colors duration-300">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Video Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {video.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {video.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
