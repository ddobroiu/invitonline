import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { fulfillCheckout } from '@/lib/fulfill'
import { alerta } from '@/lib/alerts'

export async function POST(req: Request) {
    const stripe = getStripe()
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!stripe || !webhookSecret) {
        return NextResponse.json({ message: 'Stripe not configured' }, { status: 503 })
    }

    const body = await req.text()
    const signature = req.headers.get('stripe-signature') || ''

    let event: Stripe.Event
    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
        console.error('Webhook signature verification failed:', err instanceof Error ? err.message : String(err))
        return NextResponse.json({ message: 'Webhook Error' }, { status: 400 })
    }

    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
        try {
            await fulfillCheckout(event.data.object as Stripe.Checkout.Session)
        } catch (error) {
            console.error('Error processing checkout session:', error)
            void alerta('error', 'stripe-webhook', `InvitOnline: plata Stripe ${(event.data.object as Stripe.Checkout.Session).id} nu a fost procesata (webhook 500): ${error instanceof Error ? error.message : String(error)}`)
            return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
        }
    }

    return NextResponse.json({ received: true })
}
