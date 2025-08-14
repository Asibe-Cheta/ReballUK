"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { TrendingUp, TrendingDown } from "lucide-react"

interface ChartData {
  date: string
  successRate: number
  sessions: number
}

interface ProgressChartProps {
  timeframe: "week" | "month" | "all"
}

export default function ProgressChart({ timeframe }: ProgressChartProps) {
  const [data, setData] = useState<ChartData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchChartData()
  }, [timeframe])

  const fetchChartData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`/api/progress/chart?timeframe=${timeframe}`)
      if (response.ok) {
        const chartData = await response.json()
        setData(chartData)
      } else {
        setError("Failed to load chart data")
      }
    } catch (error) {
      console.error("Error fetching chart data:", error)
      setError("Failed to load chart data")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Error Loading Chart</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <p>Unable to load progress data</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Success Rate Trend</CardTitle>
          <CardDescription>Your 1v1 success rate over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <p>No data available for this period</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate trend
  const recentData = data.slice(-7)
  const trend = recentData.length >= 2 
    ? recentData[recentData.length - 1].successRate - recentData[0].successRate
    : 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Success Rate Trend</CardTitle>
            <CardDescription>Your 1v1 success rate over time</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {trend > 0 ? (
              <TrendingUp className="w-5 h-5 text-green-600" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-600" />
            )}
            <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(trend).toFixed(1)}%
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString('en-GB', { 
                  month: 'short', 
                  day: 'numeric' 
                })
              }}
            />
            <YAxis 
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              formatter={(value: number) => [`${value}%`, 'Success Rate']}
              labelFormatter={(label) => {
                const date = new Date(label)
                return date.toLocaleDateString('en-GB', { 
                  weekday: 'short',
                  month: 'short', 
                  day: 'numeric' 
                })
              }}
            />
            <Area 
              type="monotone" 
              dataKey="successRate" 
              stroke="#3b82f6" 
              fill="#3b82f6" 
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
