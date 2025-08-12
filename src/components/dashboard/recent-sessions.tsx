"use client"

import { useState } from "react"
import { Play, Star, Clock, TrendingUp, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { RecentSessionsProps, SessionData } from "@/types/dashboard"
import { dashboardUtils } from "@/types/dashboard"

export default function RecentSessions({
  sessions,
  isLoading = false,
  className,
}: RecentSessionsProps) {
  const [selectedSession, setSelectedSession] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className={cn("glow-card p-6 rounded-2xl", className)} data-card="sessions-loading">
        <span className="glow"></span>
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
              {i < 2 && <div className="border-t border-light-gray dark:border-charcoal" />}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div className={cn("glow-card p-6 rounded-2xl", className)} data-card="sessions-empty">
        <span className="glow"></span>
        <div className="text-center py-8">
          <div className="text-4xl mb-3">🎯</div>
          <h3 className="font-semibold text-pure-black dark:text-pure-white mb-2">
            No sessions yet
          </h3>
          <p className="text-text-gray dark:text-medium-gray text-sm mb-4">
            Start your first training session to see your progress here
          </p>
          <Button>Start Training</Button>
        </div>
      </div>
    )
  }

  const getSessionTypeIcon = (type: SessionData["type"]) => {
    switch (type) {
      case "SISW":
        return "🎬" // Video analysis
      case "TAV":
        return "📊" // Technical analysis
      case "PRACTICE":
        return "⚽" // Practice session
      case "ANALYSIS":
        return "🔍" // Analysis review
      default:
        return "📝"
    }
  }

  const getSessionTypeLabel = (type: SessionData["type"]) => {
    switch (type) {
      case "SISW":
        return "Session in Slow-motion"
      case "TAV":
        return "Technical Analysis Video"
      case "PRACTICE":
        return "Practice Session"
      case "ANALYSIS":
        return "Analysis Review"
      default:
        return "Training Session"
    }
  }

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400"
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  return (
    <div className={cn("glow-card p-6 rounded-2xl", className)} data-card="recent-sessions">
      <span className="glow"></span>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-pure-black dark:text-pure-white">
          Recent Sessions
        </h3>
        <Button variant="ghost" size="sm" className="text-text-gray dark:text-medium-gray">
          View All
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {sessions.map((session, index) => (
          <div key={session.id}>
            <div
              className={cn(
                "cursor-pointer transition-all duration-200 rounded-lg p-3 -m-3",
                "hover:bg-light-gray/50 dark:hover:bg-charcoal/50",
                selectedSession === session.id && "bg-light-gray dark:bg-charcoal"
              )}
              onClick={() => setSelectedSession(
                selectedSession === session.id ? null : session.id
              )}
            >
              <div className="flex items-center justify-between">
                {/* Session Info */}
                <div className="flex items-center gap-3">
                  {/* Session Thumbnail/Icon */}
                  <div className="relative">
                    {session.thumbnailUrl ? (
                      <img
                        src={session.thumbnailUrl}
                        alt={session.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-light-gray dark:bg-charcoal flex items-center justify-center text-xl">
                        {getSessionTypeIcon(session.type)}
                      </div>
                    )}
                    
                    {/* Play button overlay */}
                    {session.videoUrl && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg opacity-0 hover:opacity-100 transition-opacity">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Session Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-pure-black dark:text-pure-white truncate">
                      {session.title}
                    </h4>
                    <div className="flex items-center gap-3 text-sm text-text-gray dark:text-medium-gray">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {dashboardUtils.formatDuration(session.duration)}
                      </span>
                      <span>•</span>
                      <span>{dashboardUtils.formatRelativeTime(session.date)}</span>
                      <span>•</span>
                      <span>{getSessionTypeLabel(session.type)}</span>
                    </div>
                  </div>
                </div>

                {/* Performance Score */}
                <div className="flex items-center gap-3">
                  {session.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-pure-black dark:text-pure-white">
                        {session.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                  
                  {session.performanceScore !== undefined && (
                    <div className="text-right">
                      <div className={cn(
                        "text-sm font-medium",
                        getPerformanceColor(session.performanceScore)
                      )}>
                        {session.performanceScore}%
                      </div>
                      <div className="text-xs text-text-gray dark:text-medium-gray">
                        Performance
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {selectedSession === session.id && (
                <div className="mt-4 pt-4 border-t border-light-gray dark:border-charcoal">
                  {/* Completion Progress */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-text-gray dark:text-medium-gray">
                        Completion
                      </span>
                      <span className="text-pure-black dark:text-pure-white font-medium">
                        {session.completionPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-light-gray dark:bg-charcoal rounded-full h-2">
                      <div 
                        className="bg-pure-black dark:bg-pure-white h-2 rounded-full transition-all duration-500"
                        style={{ width: `${session.completionPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Improvement Areas */}
                  {session.improvementAreas.length > 0 && (
                    <div className="mb-3">
                      <div className="text-sm text-text-gray dark:text-medium-gray mb-2">
                        Areas for Improvement:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {session.improvementAreas.map((area, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-1 bg-light-gray dark:bg-charcoal text-xs rounded-full text-text-gray dark:text-medium-gray"
                          >
                            <TrendingUp className="w-3 h-3 mr-1" />
                            {area.replace("-", " ").replace("_", " ")}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Feedback */}
                  {session.feedback && (
                    <div className="mb-3">
                      <div className="text-sm text-text-gray dark:text-medium-gray mb-1">
                        Notes:
                      </div>
                      <p className="text-sm text-pure-black dark:text-pure-white">
                        {session.feedback}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {session.videoUrl && (
                      <Button size="sm" variant="outline">
                        <Play className="w-4 h-4 mr-2" />
                        Rewatch
                      </Button>
                    )}
                    <Button size="sm" variant="ghost">
                      View Analysis
                    </Button>
                    <Button size="sm" variant="ghost">
                      Add Feedback
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Separator */}
            {index < sessions.length - 1 && (
              <div className="border-t border-light-gray dark:border-charcoal my-4" />
            )}
          </div>
        ))}
      </div>

      {/* View More Button */}
      {sessions.length >= 5 && (
        <div className="mt-6 pt-4 border-t border-light-gray dark:border-charcoal">
          <Button variant="outline" className="w-full">
            View All Sessions
          </Button>
        </div>
      )}
    </div>
  )
}
