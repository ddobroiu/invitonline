import Stripe from 'stripe'

// Price for activating one invitation (in cents)
export const INVITATION_PRICE = 2000
export const INVITATION_CURRENCY = 'eur'

let stripeClient: Stripe | null = null

// Lazily create the client so the app builds and runs without Stripe keys
export function getStripe(): Stripe | null {
    if (!process.env.STRIPE_SECRET_KEY) return null
    if (!stripeClient) {
        stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY)
    }
    return stripeClient
}
