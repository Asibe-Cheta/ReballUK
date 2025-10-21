export interface CourseCheckoutData {
  courseId: string
  courseTitle: string
  coursePrice: number
  courseLevel: string
  position: string
}

export interface BookingCheckoutData {
  bookingId: string
  sessionType: '1v1' | 'group'
  position: string
  price: number
  scheduledFor: string
}

export interface StripeCheckoutResponse {
  success: boolean
  sessionId?: string
  url?: string
  error?: string
}

export interface StripeWebhookEvent {
  id: string
  type: string
  data: {
    object: any
  }
}

export interface PaymentMetadata {
  userId: string
  type: 'course' | 'booking'
  courseId?: string
  bookingId?: string
  sessionType?: string
  position?: string
}

