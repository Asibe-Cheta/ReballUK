"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { ProgressChartProps, ChartDataPoint } from "@/types/dashboard"

export default function ProgressChart({
  data,
  config,
  height = 300,
  className,
  isLoading = false,
}: ProgressChartProps) {
  const [activeTimeframe, setActiveTimeframe] = useState(config.timeframe)
  const [activeMetric, setActiveMetric] = useState(config.metric)

  if (isLoading) {
    return (
      <div className={cn("glow-card p-6 rounded-2xl", className)} data-card="chart-loading">
        <span className="glow"></span>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  // Transform data for chart
  const chartData: ChartDataPoint[] = data.map(point => ({
    date: new Date(point.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }),
    value: point.value,
    label: point.category,
    category: point.category,
  }))

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-pure-white dark:bg-dark-gray border border-light-gray dark:border-charcoal rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-pure-black dark:text-pure-white mb-1">
            {label}
          </p>
          <p className="text-sm text-text-gray dark:text-medium-gray">
            {getMetricLabel(activeMetric)}: {formatValue(data.value, activeMetric)}
          </p>
          {data.category && (
            <p className="text-xs text-text-gray dark:text-medium-gray mt-1">
              Category: {data.category}
            </p>
          )}
        </div>
      )
    }
    return null
  }

  const timeframeOptions = [
    { value: "7d", label: "7D" },
    { value: "30d", label: "30D" },
    { value: "90d", label: "90D" },
    { value: "1y", label: "1Y" },
  ]

  const metricOptions = [
    { value: "performance", label: "Performance" },
    { value: "confidence", label: "Confidence" },
    { value: "success_rate", label: "Success Rate" },
    { value: "skill_level", label: "Skill Level" },
  ]

  return (
    <div className={cn("glow-card p-6 rounded-2xl", className)} data-card="progress-chart">
      <span className="glow"></span>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-pure-black dark:text-pure-white">
          Progress Overview
        </h3>
        
        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Metric Selector */}
          <div className="flex rounded-lg bg-light-gray dark:bg-charcoal p-1">
            {metricOptions.map((option) => (
              <Button
                key={option.value}
                variant="ghost"
                size="sm"
                onClick={() => setActiveMetric(option.value as any)}
                className={cn(
                  "text-xs px-3 py-1 h-auto",
                  activeMetric === option.value
                    ? "bg-pure-white dark:bg-dark-gray text-pure-black dark:text-pure-white shadow-sm"
                    : "text-text-gray dark:text-medium-gray hover:text-pure-black dark:hover:text-pure-white"
                )}
              >
                {option.label}
              </Button>
            ))}
          </div>
          
          {/* Timeframe Selector */}
          <div className="flex rounded-lg bg-light-gray dark:bg-charcoal p-1">
            {timeframeOptions.map((option) => (
              <Button
                key={option.value}
                variant="ghost"
                size="sm"
                onClick={() => setActiveTimeframe(option.value as any)}
                className={cn(
                  "text-xs px-3 py-1 h-auto",
                  activeTimeframe === option.value
                    ? "bg-pure-white dark:bg-dark-gray text-pure-black dark:text-pure-white shadow-sm"
                    : "text-text-gray dark:text-medium-gray hover:text-pure-black dark:hover:text-pure-white"
                )}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ height }}>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            {config.showTrend ? (
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="currentColor" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="currentColor" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-light-gray dark:stroke-charcoal" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs fill-text-gray dark:fill-medium-gray"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  className="text-xs fill-text-gray dark:fill-medium-gray"
                  axisLine={false}
                  tickLine={false}
                  domain={[0, getMaxValue(activeMetric)]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type={config.smoothing ? "monotone" : "linear"}
                  dataKey="value"
                  stroke="currentColor"
                  strokeWidth={2}
                  fill="url(#colorValue)"
                  className="text-pure-black dark:text-pure-white"
                />
              </AreaChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-light-gray dark:stroke-charcoal" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs fill-text-gray dark:fill-medium-gray"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  className="text-xs fill-text-gray dark:fill-medium-gray"
                  axisLine={false}
                  tickLine={false}
                  domain={[0, getMaxValue(activeMetric)]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type={config.smoothing ? "monotone" : "linear"}
                  dataKey="value"
                  stroke="currentColor"
                  strokeWidth={2}
                  dot={{ fill: "currentColor", strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, stroke: "currentColor", strokeWidth: 2 }}
                  className="text-pure-black dark:text-pure-white"
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-text-gray dark:text-medium-gray">
                No progress data available yet
              </p>
              <p className="text-sm text-text-gray dark:text-medium-gray mt-1">
                Complete some training sessions to see your progress
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Legend/Summary */}
      {chartData.length > 0 && (
        <div className="mt-4 pt-4 border-t border-light-gray dark:border-charcoal">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-gray dark:text-medium-gray">
              Showing {chartData.length} data points over {activeTimeframe}
            </span>
            <span className="text-text-gray dark:text-medium-gray">
              Current: {formatValue(chartData[chartData.length - 1]?.value || 0, activeMetric)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper functions
function getMetricLabel(metric: string): string {
  const labels = {
    performance: "Performance Score",
    confidence: "Confidence Level",
    success_rate: "Success Rate",
    skill_level: "Skill Level",
  }
  return labels[metric as keyof typeof labels] || "Value"
}

function formatValue(value: number, metric: string): string {
  switch (metric) {
    case "confidence":
    case "success_rate":
      return `${Math.round(value)}%`
    case "performance":
    case "skill_level":
      return `${Math.round(value)}/100`
    default:
      return Math.round(value).toString()
  }
}

function getMaxValue(metric: string): number {
  switch (metric) {
    case "confidence":
    case "success_rate":
    case "performance":
    case "skill_level":
      return 100
    default:
      return "dataMax"
  }
}
