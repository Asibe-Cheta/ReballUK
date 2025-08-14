"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Target, 
  PoundSterling,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react"
import { format } from "date-fns"
import { SessionType } from "./session-type-selector"
import { PlayerPosition } from "./training-position-selector"

interface BookingSummaryProps {
  sessionType: SessionType | null
  position: PlayerPosition | null
  date: Date | undefined
  time: string | null
  onConfirm: () => void
  onBack: () => void
  isLoading?: boolean
}

const sessionTypeDetails = {
  group: {
    title: "Group Training",
    price: 25,
    duration: 60,
    maxPlayers: 8
  },
  "1v1": {
    title: "1v1 Personal Training",
    price: 75,
    duration: 60,
    maxPlayers: 1
  }
}

const positionDetails = {
  STRIKER: { color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
  WINGER: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  CAM: { color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" },
  FULLBACK: { color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
  GOALKEEPER: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
  DEFENDER: { color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" },
  MIDFIELDER: { color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400" },
  OTHER: { color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400" }
}

export default function BookingSummary({
  sessionType,
  position,
  date,
  time,
  onConfirm,
  onBack,
  isLoading = false
}: BookingSummaryProps) {
  if (!sessionType || !position || !date || !time) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            Incomplete Booking
          </CardTitle>
          <CardDescription>
            Please complete all booking details before proceeding
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {!sessionType && <p className="text-red-600">• Select a session type</p>}
            {!position && <p className="text-red-600">• Choose a training position</p>}
            {!date && <p className="text-red-600">• Pick a date</p>}
            {!time && <p className="text-red-600">• Select a time slot</p>}
          </div>
        </CardContent>
      </Card>
    )
  }

  const sessionDetails = sessionTypeDetails[sessionType]
  const positionDetail = positionDetails[position]

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Booking Summary</h2>
        <p className="text-muted-foreground">
          Review your training session details before confirming
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Session Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Session Type */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{sessionDetails.title}</p>
                <p className="text-sm text-muted-foreground">
                  {sessionDetails.maxPlayers} player{sessionDetails.maxPlayers > 1 ? 's' : ''} max
                </p>
              </div>
            </div>
            <Badge variant="secondary">£{sessionDetails.price}</Badge>
          </div>

          {/* Position */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{position} Training</p>
                <p className="text-sm text-muted-foreground">Position-specific focus</p>
              </div>
            </div>
            <Badge variant="secondary" className={positionDetail.color}>
              {position}
            </Badge>
          </div>

          {/* Date & Time */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{format(date, 'EEEE, MMMM do, yyyy')}</p>
                <p className="text-sm text-muted-foreground">Training date</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">{time}</p>
              <p className="text-sm text-muted-foreground">{sessionDetails.duration} minutes</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">REBALL Training Center</p>
                <p className="text-sm text-muted-foreground">London, UK</p>
              </div>
            </div>
            <Badge variant="outline">On-site</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PoundSterling className="h-5 w-5" />
            Pricing Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Session Fee</span>
              <span>£{sessionDetails.price}</span>
            </div>
            <div className="flex justify-between">
              <span>Duration</span>
              <span>{sessionDetails.duration} minutes</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>£{sessionDetails.price}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Information */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
            <Info className="h-5 w-5" />
            Important Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
          <p>• Please arrive 10 minutes before your scheduled time</p>
          <p>• Bring appropriate training gear and footwear</p>
          <p>• Water and equipment will be provided</p>
          <p>• Cancellation policy: 24 hours notice required</p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex-1"
          disabled={isLoading}
        >
          Back to Edit
        </Button>
        <Button 
          onClick={onConfirm}
          className="flex-1"
          disabled={isLoading}
        >
          {isLoading ? "Confirming..." : "Confirm Booking"}
        </Button>
      </div>
    </div>
  )
}
