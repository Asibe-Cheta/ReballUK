"use client"

import { Calendar, PlayCircle, BarChart3, BookOpen, Target, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { QuickActionsProps, TrainingRecommendation } from "@/types/dashboard"

export default function QuickActions({
  onBookSession,
  onViewAnalysis,
  onStartTraining,
  recommendations,
  className,
}: QuickActionsProps) {
  const getPriorityColor = (priority: TrainingRecommendation["priority"]) => {
    switch (priority) {
      case "HIGH":
        return "border-red-500 text-red-600 dark:text-red-400"
      case "MEDIUM":
        return "border-yellow-500 text-yellow-600 dark:text-yellow-400"
      case "LOW":
        return "border-green-500 text-green-600 dark:text-green-400"
      default:
        return "border-gray-500 text-gray-600 dark:text-gray-400"
    }
  }

  const getRecommendationIcon = (type: TrainingRecommendation["type"]) => {
    switch (type) {
      case "SKILL_GAP":
        return <Target className="w-5 h-5" />
      case "POSITION_SPECIFIC":
        return <PlayCircle className="w-5 h-5" />
      case "CONFIDENCE_BUILDER":
        return <BarChart3 className="w-5 h-5" />
      case "NEXT_LEVEL":
        return <BookOpen className="w-5 h-5" />
      default:
        return <Target className="w-5 h-5" />
    }
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Primary Actions */}
      <div className="glow-card p-6 rounded-2xl" data-card="quick-actions">
        <span className="glow"></span>
        
        <h3 className="text-lg font-semibold text-pure-black dark:text-pure-white mb-4">
          Quick Actions
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button
            onClick={onStartTraining}
            className="h-auto py-4 flex-col gap-2"
          >
            <PlayCircle className="w-6 h-6" />
            <span className="text-sm font-medium">Start Training</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={onBookSession}
            className="h-auto py-4 flex-col gap-2"
          >
            <Calendar className="w-6 h-6" />
            <span className="text-sm font-medium">Book Session</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={onViewAnalysis}
            className="h-auto py-4 flex-col gap-2"
          >
            <BarChart3 className="w-6 h-6" />
            <span className="text-sm font-medium">View Analysis</span>
          </Button>
        </div>
      </div>

      {/* Training Recommendations */}
      {recommendations.length > 0 && (
        <div className="glow-card p-6 rounded-2xl" data-card="recommendations">
          <span className="glow"></span>
          
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-pure-black dark:text-pure-white">
              Recommended for You
            </h3>
            <span className="text-sm text-text-gray dark:text-medium-gray">
              Based on your progress
            </span>
          </div>
          
          <div className="space-y-4">
            {recommendations.slice(0, 3).map((recommendation) => (
              <div
                key={recommendation.id}
                className="relative p-4 rounded-xl border-2 border-light-gray dark:border-charcoal transition-all duration-200 hover:border-pure-black dark:hover:border-pure-white cursor-pointer group"
              >
                {/* Priority indicator */}
                <div className={cn(
                  "absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium border",
                  getPriorityColor(recommendation.priority)
                )}>
                  {recommendation.priority}
                </div>

                <div className="flex items-start gap-3 pr-16">
                  {/* Icon */}
                  <div className="text-pure-black dark:text-pure-white mt-0.5">
                    {getRecommendationIcon(recommendation.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-pure-black dark:text-pure-white mb-1">
                      {recommendation.title}
                    </h4>
                    <p className="text-sm text-text-gray dark:text-medium-gray mb-2">
                      {recommendation.description}
                    </p>
                    
                    {/* Reason */}
                    <p className="text-xs text-text-gray dark:text-medium-gray italic mb-3">
                      {recommendation.reason}
                    </p>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-xs text-text-gray dark:text-medium-gray">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {recommendation.estimatedTime} min
                      </div>
                      {recommendation.confidenceBoost > 0 && (
                        <div className="flex items-center gap-1">
                          <BarChart3 className="w-3 h-3" />
                          +{recommendation.confidenceBoost}% confidence
                        </div>
                      )}
                    </div>

                    {/* Skill Areas */}
                    {recommendation.skillAreas.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {recommendation.skillAreas.slice(0, 3).map((skill, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-2 py-1 bg-light-gray dark:bg-charcoal text-xs rounded-full text-text-gray dark:text-medium-gray"
                          >
                            {skill.replace("-", " ").replace("_", " ")}
                          </span>
                        ))}
                        {recommendation.skillAreas.length > 3 && (
                          <span className="inline-block px-2 py-1 bg-light-gray dark:bg-charcoal text-xs rounded-full text-text-gray dark:text-medium-gray">
                            +{recommendation.skillAreas.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover action */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-pure-black/5 dark:bg-pure-white/5 rounded-xl">
                  <Button size="sm">
                    Start Training
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          {recommendations.length > 3 && (
            <div className="mt-4 pt-4 border-t border-light-gray dark:border-charcoal">
              <Button variant="ghost" className="w-full text-sm">
                View All Recommendations ({recommendations.length})
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Goal Progress */}
      <div className="glow-card p-6 rounded-2xl" data-card="goal-progress">
        <span className="glow"></span>
        
        <h3 className="text-lg font-semibold text-pure-black dark:text-pure-white mb-4">
          Training Goals
        </h3>
        
        <div className="space-y-4">
          {/* Weekly Goal */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-text-gray dark:text-medium-gray">
                Weekly Goal
              </span>
              <span className="text-pure-black dark:text-pure-white font-medium">
                2/3 sessions
              </span>
            </div>
            <div className="w-full bg-light-gray dark:bg-charcoal rounded-full h-2">
              <div 
                className="bg-pure-black dark:bg-pure-white h-2 rounded-full transition-all duration-500"
                style={{ width: "67%" }}
              />
            </div>
          </div>

          {/* Monthly Goal */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-text-gray dark:text-medium-gray">
                Monthly Goal
              </span>
              <span className="text-pure-black dark:text-pure-white font-medium">
                8/12 sessions
              </span>
            </div>
            <div className="w-full bg-light-gray dark:bg-charcoal rounded-full h-2">
              <div 
                className="bg-pure-black dark:bg-pure-white h-2 rounded-full transition-all duration-500"
                style={{ width: "67%" }}
              />
            </div>
          </div>
        </div>

        {/* Encouragement */}
        <div className="mt-4 p-3 bg-light-gray dark:bg-charcoal rounded-lg">
          <p className="text-sm text-text-gray dark:text-medium-gray">
            💪 You&apos;re on track! Complete <strong>1 more session</strong> this week to hit your goal.
          </p>
        </div>
      </div>
    </div>
  )
}
