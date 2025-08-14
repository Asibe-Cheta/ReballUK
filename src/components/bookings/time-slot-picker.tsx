"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock, Check, X, Loader2 } from "lucide-react"
import { format, addDays, startOfDay, isSameDay, parseISO } from "date-fns"
import { cn } from "@/lib/utils"

interface TimeSlot {
  id: string
  time: string
  available: boolean
  bookedBy?: string
}

interface TimeSlotPickerProps {
  selectedDate: Date | undefined
  selectedTime: string | null
  onDateSelect: (date: Date | undefined) => void
  onTimeSelect: (time: string | null) => void
  className?: string
}

// Generate time slots from 9 AM to 8 PM
const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = []
  for (let hour = 9; hour <= 20; hour++) {
    const time = `${hour.toString().padStart(2, '0')}:00`
    slots.push({
      id: time,
      time,
      available: Math.random() > 0.3, // 70% availability for demo
      bookedBy: Math.random() > 0.7 ? "John D." : undefined
    })
  }
  return slots
}

// Disable past dates and weekends
const disabledDays = (date: Date) => {
  const today = startOfDay(new Date())
  const day = date.getDay()
  return date < today || day === 0 || day === 6 // Disable past dates and weekends
}

export default function TimeSlotPicker({
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
  className
}: TimeSlotPickerProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load time slots when date changes
  useEffect(() => {
    if (selectedDate) {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        setTimeSlots(generateTimeSlots())
        setIsLoading(false)
      }, 500)
    } else {
      setTimeSlots([])
    }
  }, [selectedDate])

  const handleDateSelect = (date: Date | undefined) => {
    onDateSelect(date)
    onTimeSelect(null) // Reset time selection when date changes
  }

  const handleTimeSelect = (time: string) => {
    onTimeSelect(selectedTime === time ? null : time)
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Select Date & Time</h2>
        <p className="text-muted-foreground">
          Choose when you&apos;d like to have your training session
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Select Date
            </CardTitle>
            <CardDescription>
              Choose a date for your training session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={disabledDays}
              className="rounded-md border"
              classNames={{
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_disabled: "text-muted-foreground opacity-50"
              }}
            />
            
            {selectedDate && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">Selected Date:</p>
                <p className="text-sm text-muted-foreground">
                  {format(selectedDate, 'EEEE, MMMM do, yyyy')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Time Slots */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Available Times
            </CardTitle>
            <CardDescription>
              {selectedDate 
                ? `Available slots for ${format(selectedDate, 'EEEE, MMMM do')}`
                : "Select a date to see available times"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedDate ? (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Please select a date first</p>
              </div>
            ) : isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin" />
                <p className="text-muted-foreground">Loading available times...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot.id}
                    variant={slot.available ? "outline" : "ghost"}
                    className={cn(
                      "h-12 justify-start",
                      !slot.available && "opacity-50 cursor-not-allowed",
                      selectedTime === slot.time && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => slot.available && handleTimeSelect(slot.time)}
                    disabled={!slot.available}
                  >
                    <div className="flex items-center gap-2">
                      {slot.available ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                      <span>{slot.time}</span>
                    </div>
                    {!slot.available && slot.bookedBy && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        Booked
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            )}

            {selectedTime && (
              <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm font-medium text-primary">Selected Time:</p>
                <p className="text-sm text-primary">
                  {selectedTime} on {selectedDate && format(selectedDate, 'EEEE, MMMM do')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Session Info */}
      {selectedDate && selectedTime && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Session Scheduled</h3>
                <p className="text-sm text-muted-foreground">
                  {format(selectedDate, 'EEEE, MMMM do, yyyy')} at {selectedTime}
                </p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                Available
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
