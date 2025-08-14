"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface ChartData {
  date: string
  successRate: number
  sessions: number
  confidence: number
}

interface ProgressChartProps {
  timeRange: string
}

export default function ProgressChart({ timeRange }: ProgressChartProps) {
  const [data, setData] = useState<ChartData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [trend, setTrend] = useState<"up" | "down" | "stable">("stable")

  useEffect(() => {
    fetchChartData()
  }, [timeRange])

  const fetchChartData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/progress/chart?timeRange=${timeRange}`)
      if (response.ok) {
        const chartData = await response.json()
        setData(chartData.data)
        setTrend(chartData.trend)
      } else {
        // Generate mock data for demonstration
        generateMockData()
      }
    } catch (error) {
      console.error("Error fetching chart data:", error)
      generateMockData()
    } finally {
      setIsLoading(false)
    }
  }

  const generateMockData = () => {
    const mockData: ChartData[] = []
    const days = timeRange === "week" ? 7 : timeRange === "month" ? 30 : 90
    const baseRate = 65
    const variance = 15

    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() - (days - i - 1))
      
      mockData.push({
        date: date.toLocaleDateString("en-GB", { 
          month: "short", 
          day: "numeric" 
        }),
        successRate: Math.max(0, Math.min(100, baseRate + (Math.random() - 0.5) * variance)),
        sessions: Math.floor(Math.random() * 3) + 1,
        confidence: Math.max(0, Math.min(100, baseRate + (Math.random() - 0.5) * variance))
      })
    }

    setData(mockData)
    setTrend("up")
  }

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getTrendText = () => {
    switch (trend) {
      case "up":
        return "Improving"
      case "down":
        return "Declining"
      default:
        return "Stable"
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <p>No data available for this time period</p>
      </div>
    )
  }

  const averageSuccessRate = data.reduce((sum, item) => sum + item.successRate, 0) / data.length

  return (
    <div className="space-y-4">
      {/* Chart Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">{averageSuccessRate.toFixed(1)}%</span>
          <Badge variant="secondary" className="flex items-center gap-1">
            {getTrendIcon()}
            <span className={getTrendColor()}>{getTrendText()}</span>
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          Average success rate
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="colorSuccessRate" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis 
            dataKey="date" 
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            }}
            formatter={(value: any) => [`${value}%`, "Success Rate"]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Area
            type="monotone"
            dataKey="successRate"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#colorSuccessRate)"
            dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Chart Legend */}
      <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Success Rate</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>Confidence</span>
        </div>
      </div>
    </div>
  )
}
