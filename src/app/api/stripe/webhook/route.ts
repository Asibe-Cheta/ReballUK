import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { constructWebhookEvent } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = await constructWebhookEvent(body, signature)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const metadata = session.metadata

        if (!metadata) {
          console.error('No metadata in session')
          break
        }

        const { type, courseId, bookingId, userId } = metadata

        // Handle course purchase
        if (type === 'course' && courseId && userId) {
          // Create a booking record for the course
          await prisma.booking.create({
            data: {
              userId: userId,
              courseId: courseId,
              sessionType: 'course',
              status: 'CONFIRMED',
              paymentStatus: 'PAID',
              amount: session.amount_total ? session.amount_total / 100 : 0,
              price: session.amount_total ? session.amount_total / 100 : 0,
              stripeSessionId: session.id,
              stripePaymentIntentId: session.payment_intent as string || null,
              scheduledFor: new Date(), // For courses, this can be the purchase date
              notes: `Course purchased: ${courseId}`
            }
          })

          console.log(`Course ${courseId} purchased by user ${userId}`)
        }

        // Handle booking/session purchase
        if (type === 'booking' && bookingId) {
          await prisma.booking.update({
            where: { id: bookingId },
            data: {
              paymentStatus: 'PAID',
              status: 'CONFIRMED',
              stripePaymentIntentId: session.payment_intent as string || null
            }
          })

          console.log(`Booking ${bookingId} payment confirmed`)
        }

        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log(`PaymentIntent ${paymentIntent.id} succeeded`)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.error(`PaymentIntent ${paymentIntent.id} failed`)
        
        // Update booking to failed if metadata available
        if (paymentIntent.metadata?.bookingId) {
          await prisma.booking.update({
            where: { id: paymentIntent.metadata.bookingId },
            data: {
              paymentStatus: 'FAILED',
              status: 'CANCELLED'
            }
          })
        }
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        console.log(`Charge ${charge.id} refunded`)
        
        // Handle refund logic if needed
        // You might want to update booking status to REFUNDED
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

// Configure to receive raw body for webhook signature verification
export const runtime = 'nodejs'
export const preferredRegion = 'auto'

