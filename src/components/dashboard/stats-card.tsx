"use client"

import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import type { StatsCardProps } from "@/types/dashboard"
import { dashboardUtils } from "@/types/dashboard"

export default function StatsCard({
  title,
  value,
  change,
  icon,
  description,
  trend,
  isLoading = false,
  className,
}: StatsCardProps) {
  if (isLoading) {
    return (
      <div className={cn("glow-card p-6 rounded-2xl", className)} data-card="stats-loading">
        <span className="glow"></span>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    )
  }

  const trendDirection = trend || (change !== undefined ? dashboardUtils.getTrendDirection(change) : "stable")
  const trendColor = dashboardUtils.getTrendColor(trendDirection)

  const TrendIcon = trendDirection === "up" ? TrendingUp : 
                   trendDirection === "down" ? TrendingDown : Minus

  return (
    <div className={cn("glow-card p-6 rounded-2xl", className)} data-card="stats">
      <span className="glow"></span>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-text-gray dark:text-medium-gray">
          {title}
        </h3>
        <div className="text-pure-black dark:text-pure-white">
          {icon}
        </div>
      </div>

      {/* Main Value */}
      <div className="mb-2">
        <div className="text-2xl font-bold text-pure-black dark:text-pure-white">
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>
      </div>

      {/* Trend and Description */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-text-gray dark:text-medium-gray">
          {description}
        </div>
        
        {change !== undefined && (
          <div className={cn("flex items-center gap-1 text-xs font-medium", trendColor)}>
            <TrendIcon className="w-3 h-3" />
            {Math.abs(change)}%
          </div>
        )}
      </div>

      {/* Progress bar for percentage values */}
      {typeof value === "string" && value.includes("%") && (
        <div className="mt-3">
          <div className="w-full bg-light-gray dark:bg-charcoal rounded-full h-1.5">
            <div 
              className="bg-pure-black dark:bg-pure-white h-1.5 rounded-full transition-all duration-500"
              style={{ 
                width: `${Math.min(100, parseInt(value.replace("%", "")))}%` 
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
