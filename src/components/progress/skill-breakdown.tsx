"use client"

import { useState, useEffect } from "react"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Target, 
  Zap, 
  Eye, 
  Shield, 
  Users, 
  Star,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react"

interface SkillData {
  skill: string
  current: number
  previous: number
  target: number
  icon: React.ReactNode
  color: string
}

interface SkillBreakdownProps {
  detailed?: boolean
  className?: string
}

const skills: Omit<SkillData, 'current' | 'previous' | 'target'>[] = [
  {
    skill: "1v1 Finishing",
    icon: <Target className="h-4 w-4" />,
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
  },
  {
    skill: "Dribbling",
    icon: <Zap className="h-4 w-4" />,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
  },
  {
    skill: "Crossing",
    icon: <Eye className="h-4 w-4" />,
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
  },
  {
    skill: "Defending",
    icon: <Shield className="h-4 w-4" />,
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
  },
  {
    skill: "Passing",
    icon: <Users className="h-4 w-4" />,
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
  },
  {
    skill: "Shooting",
    icon: <Star className="h-4 w-4" />,
    color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400"
  }
]

export default function SkillBreakdown({ detailed = false, className }: SkillBreakdownProps) {
  const [skillData, setSkillData] = useState<SkillData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSkillData()
  }, [])

  const fetchSkillData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/progress/skills")
      if (response.ok) {
        const data = await response.json()
        setSkillData(data)
      } else {
        // Generate mock data for demonstration
        generateMockSkillData()
      }
    } catch (error) {
      console.error("Error fetching skill data:", error)
      generateMockSkillData()
    } finally {
      setIsLoading(false)
    }
  }

  const generateMockSkillData = () => {
    const mockData = skills.map(skill => ({
      ...skill,
      current: Math.floor(Math.random() * 40) + 30, // 30-70 range
      previous: Math.floor(Math.random() * 40) + 30,
      target: Math.floor(Math.random() * 20) + 80 // 80-100 range
    }))
    setSkillData(mockData)
  }

  const getImprovementIcon = (current: number, previous: number) => {
    const diff = current - previous
    if (diff > 5) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (diff < -5) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-yellow-500" />
  }

  const getImprovementText = (current: number, previous: number) => {
    const diff = current - previous
    if (diff > 5) return `+${diff}% improvement`
    if (diff < -5) return `${diff}% decline`
    return "No change"
  }

  const getImprovementColor = (current: number, previous: number) => {
    const diff = current - previous
    if (diff > 5) return "text-green-600"
    if (diff < -5) return "text-red-600"
    return "text-yellow-600"
  }

  const getSkillLevel = (score: number) => {
    if (score >= 90) return { label: "Elite", color: "bg-purple-100 text-purple-800" }
    if (score >= 80) return { label: "Advanced", color: "bg-green-100 text-green-800" }
    if (score >= 70) return { label: "Intermediate", color: "bg-blue-100 text-blue-800" }
    if (score >= 60) return { label: "Developing", color: "bg-yellow-100 text-yellow-800" }
    return { label: "Beginner", color: "bg-red-100 text-red-800" }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-64 w-full" />
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    )
  }

  // Prepare data for radar chart
  const radarData = skillData.map(skill => ({
    skill: skill.skill,
    current: skill.current,
    target: skill.target
  }))

  const averageCurrent = skillData.reduce((sum, skill) => sum + skill.current, 0) / skillData.length
  const averageTarget = skillData.reduce((sum, skill) => sum + skill.target, 0) / skillData.length
  const progressToTarget = (averageCurrent / averageTarget) * 100

  return (
    <div className="space-y-6">
      {/* Radar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Skill Radar Chart
          </CardTitle>
          <CardDescription>
            Your current performance vs target levels across different skills
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis 
                dataKey="skill" 
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickLine={false}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                tick={{ fontSize: 10, fill: "#64748b" }}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                }}
                formatter={(value: unknown, name: unknown) => [`${value}%`, name]}
              />
              <Radar
                name="Current Level"
                dataKey="current"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Radar
                name="Target Level"
                dataKey="target"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.1}
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Skill Level</p>
                <p className="text-2xl font-bold">{averageCurrent.toFixed(1)}%</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className={getSkillLevel(averageCurrent).color}>
                {getSkillLevel(averageCurrent).label}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Target Progress</p>
                <p className="text-2xl font-bold">{progressToTarget.toFixed(1)}%</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="mt-2">
              <Progress value={progressToTarget} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Strongest Skill</p>
                <p className="text-lg font-semibold">
                  {skillData.reduce((max, skill) => skill.current > max.current ? skill : max).skill}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Skill Breakdown */}
      {detailed && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Detailed Skill Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skillData.map((skill) => {
              const improvement = getImprovementText(skill.current, skill.previous)
              const improvementColor = getImprovementColor(skill.current, skill.previous)
              const skillLevel = getSkillLevel(skill.current)
              
              return (
                <Card key={skill.skill}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${skill.color}`}>
                          {skill.icon}
                        </div>
                        <div>
                          <h4 className="font-medium">{skill.skill}</h4>
                          <Badge variant="outline" className={`text-xs ${skillLevel.color}`}>
                            {skillLevel.label}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          {getImprovementIcon(skill.current, skill.previous)}
                          <span className="text-lg font-bold">{skill.current}%</span>
                        </div>
                        <p className={`text-xs ${improvementColor}`}>{improvement}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Current</span>
                        <span>Target</span>
                      </div>
                      <div className="space-y-1">
                        <Progress value={skill.current} className="h-2" />
                        <Progress value={skill.target} className="h-2 bg-blue-100" />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Current: {skill.current}%</span>
                        <span>Target: {skill.target}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
