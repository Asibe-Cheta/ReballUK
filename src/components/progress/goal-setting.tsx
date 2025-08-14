"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Target, 
  Trophy, 
  Calendar,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  TrendingUp,
  Award
} from "lucide-react"

interface Goal {
  id: string
  title: string
  description: string
  category: string
  targetValue: number
  currentValue: number
  unit: string
  deadline: string
  status: "active" | "completed" | "overdue"
  createdAt: string
  completedAt?: string
}



const goalCategories = [
  { value: "success_rate", label: "Success Rate", icon: <Target className="h-4 w-4" /> },
  { value: "sessions", label: "Training Sessions", icon: <Calendar className="h-4 w-4" /> },
  { value: "confidence", label: "Confidence Level", icon: <TrendingUp className="h-4 w-4" /> },
  { value: "skills", label: "Skill Mastery", icon: <Award className="h-4 w-4" /> }
]

const goalUnits = {
  success_rate: "%",
  sessions: "sessions",
  confidence: "%",
  skills: "skills"
}

export default function GoalSetting() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    targetValue: 0,
    deadline: ""
  })

  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/progress/goals")
      if (response.ok) {
        const data = await response.json()
        setGoals(data)
      } else {
        // Generate mock data for demonstration
        generateMockGoals()
      }
    } catch (error) {
      console.error("Error fetching goals:", error)
      generateMockGoals()
    } finally {
      setIsLoading(false)
    }
  }

  const generateMockGoals = () => {
    const mockGoals: Goal[] = [
      {
        id: "1",
        title: "Improve 1v1 Success Rate",
        description: "Achieve 80% success rate in 1v1 finishing scenarios",
        category: "success_rate",
        targetValue: 80,
        currentValue: 65,
        unit: "%",
        deadline: "2024-03-31",
        status: "active",
        createdAt: "2024-01-15"
      },
      {
        id: "2",
        title: "Complete 20 Training Sessions",
        description: "Attend 20 training sessions this quarter",
        category: "sessions",
        targetValue: 20,
        currentValue: 12,
        unit: "sessions",
        deadline: "2024-03-31",
        status: "active",
        createdAt: "2024-01-15"
      },
      {
        id: "3",
        title: "Master 3 Core Skills",
        description: "Achieve 90% proficiency in dribbling, finishing, and passing",
        category: "skills",
        targetValue: 3,
        currentValue: 1,
        unit: "skills",
        deadline: "2024-06-30",
        status: "active",
        createdAt: "2024-01-15"
      }
    ]
    setGoals(mockGoals)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const goalData = editingGoal 
        ? { ...formData, id: editingGoal.id }
        : { ...formData, id: Date.now().toString() }

      const response = await fetch("/api/progress/goals", {
        method: editingGoal ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(goalData),
      })

      if (response.ok) {
        setIsDialogOpen(false)
        setEditingGoal(null)
        resetForm()
        fetchGoals()
      }
    } catch (error) {
      console.error("Error saving goal:", error)
    }
  }

  const handleDelete = async (goalId: string) => {
    try {
      const response = await fetch(`/api/progress/goals/${goalId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchGoals()
      }
    } catch (error) {
      console.error("Error deleting goal:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      targetValue: 0,
      deadline: ""
    })
  }

  const openEditDialog = (goal: Goal) => {
    setEditingGoal(goal)
    setFormData({
      title: goal.title,
      description: goal.description,
      category: goal.category,
      targetValue: goal.targetValue,
      deadline: goal.deadline
    })
    setIsDialogOpen(true)
  }

  const getProgressPercentage = (goal: Goal) => {
    return Math.min((goal.currentValue / goal.targetValue) * 100, 100)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "overdue":
        return <Clock className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }


    const cat = goalCategories.find(c => c.value === category)
    return cat ? cat.icon : <Target className="h-4 w-4" />
  }

  const getCategoryLabel = (category: string) => {
    const cat = goalCategories.find(c => c.value === category)
    return cat ? cat.label : "Unknown"
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    )
  }

  const activeGoals = goals.filter(goal => goal.status === "active")
  const completedGoals = goals.filter(goal => goal.status === "completed")
  const averageProgress = activeGoals.length > 0 
    ? activeGoals.reduce((sum, goal) => sum + getProgressPercentage(goal), 0) / activeGoals.length
    : 0

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Goals</p>
                <p className="text-2xl font-bold">{activeGoals.length}</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Progress</p>
                <p className="text-2xl font-bold">{averageProgress.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
            <Progress value={averageProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{completedGoals.length}</p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Your Goals</h3>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingGoal(null)
                resetForm()
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingGoal ? "Edit Goal" : "Create New Goal"}
                </DialogTitle>
                <DialogDescription>
                  Set a new training objective to track your progress
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Goal Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Improve 1v1 Success Rate"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your goal in detail"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {goalCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            <div className="flex items-center gap-2">
                              {category.icon}
                              {category.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Target Value</label>
                    <Input
                      type="number"
                      value={formData.targetValue}
                      onChange={(e) => setFormData({ ...formData, targetValue: Number(e.target.value) })}
                      placeholder="80"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Deadline</label>
                  <Input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingGoal ? "Update Goal" : "Create Goal"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {goals.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Goals Set</h3>
                <p className="text-muted-foreground mb-4">
                  Set your first training goal to start tracking your progress
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Goal
                </Button>
              </CardContent>
            </Card>
          ) : (
            goals.map((goal) => {
              const progress = getProgressPercentage(goal)
              const isOverdue = new Date(goal.deadline) < new Date() && goal.status === "active"
              
              return (
                <Card key={goal.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${getStatusColor(goal.status)}`}>
                          {getStatusIcon(goal.status)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{goal.title}</h3>
                            <Badge variant="outline" className="text-xs">
                              {getCategoryLabel(goal.category)}
                            </Badge>
                            <Badge className={`text-xs ${getStatusColor(goal.status)}`}>
                              {goal.status === "completed" ? "Completed" : 
                               isOverdue ? "Overdue" : "Active"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {goal.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Target: {goal.targetValue}{goal.unit}</span>
                            <span>Current: {goal.currentValue}{goal.unit}</span>
                            <span>Deadline: {new Date(goal.deadline).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(goal)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(goal.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{progress.toFixed(1)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
