import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
}

// Initialize Stripe with the secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-09-30.clover',
  typescript: true,
})

// Helper function to format amount for Stripe (convert to cents)
export function formatAmountForStripe(amount: number): number {
  return Math.round(amount * 100)
}

// Helper function to format amount from Stripe (convert from cents)
export function formatAmountFromStripe(amount: number): number {
  return amount / 100
}

// Create a checkout session for a course purchase
export async function createCourseCheckoutSession({
  courseId,
  courseTitle,
  coursePrice,
  userId,
  userEmail,
  successUrl,
  cancelUrl,
  metadata = {}
}: {
  courseId: string
  courseTitle: string
  coursePrice: number
  userId: string
  userEmail: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}) {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'gbp',
          product_data: {
            name: courseTitle,
            description: `REBALL Training Course: ${courseTitle}`,
          },
          unit_amount: formatAmountForStripe(coursePrice),
        },
        quantity: 1,
      },
    ],
    customer_email: userEmail,
    client_reference_id: userId,
    metadata: {
      courseId,
      userId,
      type: 'course',
      ...metadata
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
    // Enable automatic tax calculation if needed
    // automatic_tax: { enabled: true },
  })

  return session
}

// Create a checkout session for a booking/session purchase
export async function createBookingCheckoutSession({
  bookingId,
  sessionType,
  position,
  price,
  userId,
  userEmail,
  successUrl,
  cancelUrl,
  metadata = {}
}: {
  bookingId: string
  sessionType: string
  position: string
  price: number
  userId: string
  userEmail: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}) {
  const sessionTitle = sessionType === '1v1' 
    ? `1v1 Personal Training - ${position}` 
    : `Group Training - ${position}`

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'gbp',
          product_data: {
            name: sessionTitle,
            description: `REBALL ${sessionType === '1v1' ? 'Personal' : 'Group'} Training Session`,
          },
          unit_amount: formatAmountForStripe(price),
        },
        quantity: 1,
      },
    ],
    customer_email: userEmail,
    client_reference_id: userId,
    metadata: {
      bookingId,
      userId,
      sessionType,
      position,
      type: 'booking',
      ...metadata
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  })

  return session
}

// Retrieve a checkout session
export async function retrieveCheckoutSession(sessionId: string) {
  return await stripe.checkout.sessions.retrieve(sessionId)
}

// Construct Stripe webhook event from request
export async function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not set')
  }

  return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
}

