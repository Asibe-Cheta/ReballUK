"use client"

import { ReactNode } from "react"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface ModernStatsCardProps {
  title: string
  value: string | number
  change?: number
  icon?: ReactNode
  description?: string
  color?: "blue" | "green" | "purple" | "orange" | "red" | "indigo"
  size?: "sm" | "md" | "lg"
}

export default function ModernStatsCard({
  title,
  value,
  change,
  icon,
  description,
  color = "blue",
  size = "md"
}: ModernStatsCardProps) {
  
  // Color schemes matching DashboardKit design
  const colorSchemes = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      iconBg: "bg-blue-500 dark:bg-blue-600",
      iconColor: "text-white",
      valueColor: "text-blue-900 dark:text-blue-100",
      titleColor: "text-blue-700 dark:text-blue-300"
    },
    green: {
      bg: "bg-green-50 dark:bg-green-900/20",
      iconBg: "bg-green-500 dark:bg-green-600",
      iconColor: "text-white",
      valueColor: "text-green-900 dark:text-green-100",
      titleColor: "text-green-700 dark:text-green-300"
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-900/20",
      iconBg: "bg-purple-500 dark:bg-purple-600",
      iconColor: "text-white",
      valueColor: "text-purple-900 dark:text-purple-100",
      titleColor: "text-purple-700 dark:text-purple-300"
    },
    orange: {
      bg: "bg-orange-50 dark:bg-orange-900/20",
      iconBg: "bg-orange-500 dark:bg-orange-600",
      iconColor: "text-white",
      valueColor: "text-orange-900 dark:text-orange-100",
      titleColor: "text-orange-700 dark:text-orange-300"
    },
    red: {
      bg: "bg-red-50 dark:bg-red-900/20",
      iconBg: "bg-red-500 dark:bg-red-600",
      iconColor: "text-white",
      valueColor: "text-red-900 dark:text-red-100",
      titleColor: "text-red-700 dark:text-red-300"
    },
    indigo: {
      bg: "bg-indigo-50 dark:bg-indigo-900/20",
      iconBg: "bg-indigo-500 dark:bg-indigo-600",
      iconColor: "text-white",
      valueColor: "text-indigo-900 dark:text-indigo-100",
      titleColor: "text-indigo-700 dark:text-indigo-300"
    }
  }

  const sizeClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8"
  }

  const iconSizes = {
    sm: "w-8 h-8 p-2",
    md: "w-12 h-12 p-3",
    lg: "w-16 h-16 p-4"
  }

  const valueSizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl"
  }

  const scheme = colorSchemes[color]
  
  // Determine trend
  const trend = change !== undefined ? (change > 0 ? "up" : change < 0 ? "down" : "stable") : null
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 ${sizeClasses[size]}`}>
      {/* Top Section - Icon and Value */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className={`inline-flex items-center justify-center rounded-lg ${scheme.iconBg} ${iconSizes[size]} mb-3`}>
            <div className={`${scheme.iconColor}`}>
              {icon}
            </div>
          </div>
          
          <div className={`font-bold ${valueSizes[size]} ${scheme.valueColor} mb-1`}>
            {typeof value === "number" ? value.toLocaleString() : value}
          </div>
          
          <div className={`text-sm font-medium ${scheme.titleColor} uppercase tracking-wide`}>
            {title}
          </div>
        </div>
      </div>

      {/* Bottom Section - Description and Trend */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
        
        {change !== undefined && trend && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
            trend === "up" 
              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
              : trend === "down"
              ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
          }`}>
            {trend === "up" && <TrendingUp className="w-3 h-3" />}
            {trend === "down" && <TrendingDown className="w-3 h-3" />}
            {trend === "stable" && <Minus className="w-3 h-3" />}
            <span>
              {change > 0 ? "+" : ""}{Math.abs(change)}%
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
