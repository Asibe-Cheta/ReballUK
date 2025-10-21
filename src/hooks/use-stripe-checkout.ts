import { useState } from 'react'
import { toast } from 'sonner'

interface UseStripeCheckoutProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function useStripeCheckout({ onSuccess, onError }: UseStripeCheckoutProps = {}) {
  const [isLoading, setIsLoading] = useState(false)

  const createCheckoutSession = async (data: {
    type: 'course' | 'booking'
    courseId?: string
    bookingId?: string
  }) => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe checkout
      if (result.url) {
        window.location.href = result.url
      } else {
        throw new Error('No checkout URL received')
      }

      onSuccess?.()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed'
      console.error('Stripe checkout error:', error)
      toast.error(errorMessage)
      onError?.(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const purchaseCourse = async (courseId: string) => {
    return createCheckoutSession({
      type: 'course',
      courseId
    })
  }

  const payForBooking = async (bookingId: string) => {
    return createCheckoutSession({
      type: 'booking',
      bookingId
    })
  }

  return {
    isLoading,
    purchaseCourse,
    payForBooking,
    createCheckoutSession
  }
}

