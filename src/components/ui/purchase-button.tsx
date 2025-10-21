"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart, CreditCard, Loader2 } from "lucide-react"
import { useStripeCheckout } from "@/hooks/use-stripe-checkout"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface PurchaseButtonProps {
  courseId?: string
  bookingId?: string
  type: 'course' | 'booking'
  price: number
  disabled?: boolean
  className?: string
  variant?: 'default' | 'outline' | 'secondary'
  size?: 'default' | 'sm' | 'lg'
  children?: React.ReactNode
}

export default function PurchaseButton({
  courseId,
  bookingId,
  type,
  price,
  disabled = false,
  className,
  variant = 'default',
  size = 'default',
  children
}: PurchaseButtonProps) {
  const { user } = useAuth()
  const router = useRouter()
  const { isLoading, purchaseCourse, payForBooking } = useStripeCheckout()

  const handlePurchase = async () => {
    if (!user) {
      router.push('/login?callbackUrl=' + window.location.pathname)
      return
    }

    if (type === 'course' && courseId) {
      await purchaseCourse(courseId)
    } else if (type === 'booking' && bookingId) {
      await payForBooking(bookingId)
    }
  }

  return (
    <Button
      onClick={handlePurchase}
      disabled={disabled || isLoading}
      variant={variant}
      size={size}
      className={cn("gap-2", className)}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          {children || (
            <>
              <CreditCard className="h-4 w-4" />
              Purchase - £{price.toFixed(2)}
            </>
          )}
        </>
      )}
    </Button>
  )
}

