"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Target, 
  ArrowLeft,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

interface Booking {
  id: string
  status: string
  paymentStatus: string
  scheduledFor: string
  completedAt?: string
  amount: number
  notes?: string
  course: {
    id: string
    title: string
    description?: string
    duration: number
    level: string
    position?: string
  }
  createdAt: string
}

export default function MyBookingsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?callbackUrl=/my-bookings")
      return
    }
    
    if (user?.id) {
      fetchBookings()
    }
  }, [authLoading, user?.id, router])

  const fetchBookings = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/bookings/user")
      
      if (!response.ok) {
        throw new Error("Failed to fetch bookings")
      }

      const result = await response.json()
      
      if (result.success) {
        setBookings(result.data.bookings)
      } else {
        throw new Error(result.error || "Failed to load bookings")
      }
    } catch (error) {
      console.error("Fetch bookings error:", error)
      setError(error instanceof Error ? error.message : "Failed to load bookings")
      toast.error("Failed to load bookings")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const response = await fetch("/api/bookings/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId,
          action: "cancel"
        }),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || "Failed to cancel booking")
      }

      const result = await response.json()
      
      if (result.success) {
        toast.success("Booking cancelled successfully")
        fetchBookings() // Refresh the list
      } else {
        throw new Error(result.error || "Failed to cancel booking")
      }
    } catch (error) {
      console.error("Cancel booking error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to cancel booking")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "COMPLETED":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
      case "COMPLETED":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "FAILED":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const canCancelBooking = (booking: Booking) => {
    const bookingTime = new Date(booking.scheduledFor)
    const now = new Date()
    const hoursUntilBooking = (bookingTime.getTime() - now.getTime()) / (1000 * 60 * 60)
    
    return booking.status === "PENDING" || booking.status === "CONFIRMED" && hoursUntilBooking >= 24
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">My Bookings</h1>
            <p className="text-muted-foreground">
              View and manage your training sessions
            </p>
          </div>
        </div>
        <Button onClick={() => router.push("/bookings")} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Book New Session
        </Button>
      </div>

      {/* Bookings List */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your bookings...</p>
          </div>
        </div>
      ) : error ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Error Loading Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchBookings}>Try Again</Button>
          </CardContent>
        </Card>
      ) : bookings.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">No Bookings Found</CardTitle>
            <CardDescription className="text-center">
              You haven&apos;t booked any training sessions yet
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => router.push("/bookings")} className="flex items-center gap-2 mx-auto">
              <Plus className="h-4 w-4" />
              Book Your First Session
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{booking.course.title}</CardTitle>
                      <CardDescription>
                        {booking.course.position} Training • {booking.course.duration} minutes
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                    <Badge variant="outline" className={getPaymentStatusColor(booking.paymentStatus)}>
                      {booking.paymentStatus}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Scheduled For</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(booking.scheduledFor), 'EEEE, MMMM do, yyyy')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Time</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(booking.scheduledFor), 'h:mm a')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">REBALL Training Center</p>
                    </div>
                  </div>
                </div>

                {booking.notes && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium mb-1">Notes:</p>
                    <p className="text-sm text-muted-foreground">{booking.notes}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-semibold">${booking.amount}</span>
                    <span className="text-sm text-muted-foreground">
                      Booked on {format(new Date(booking.createdAt), 'MMM do, yyyy')}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {canCancelBooking(booking) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelBooking(booking.id)}
                        className="flex items-center gap-2"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                    )}
                    
                    {booking.status === "COMPLETED" && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
