import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Stripe from 'stripe'
import prisma from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27.acacia' as any,
})

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const { eventId } = await req.json()

        const event = await prisma.event.findUnique({
            where: { id: eventId },
        })

        if (!event || event.userId !== (session.user as any).id) {
            return NextResponse.json({ message: 'Event not found' }, { status: 404 })
        }

        // Create Stripe Checkout Session
        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: `Invitație Premium - ${event.title}`,
                            description: 'Acces complet și link unic pentru invitația ta online.',
                        },
                        unit_amount: 2000, // 20.00 EUR
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXTAUTH_URL}/dashboard?canceled=true`,
            metadata: {
                eventId: event.id,
                userId: (session.user as any).id,
            },
        })

        // Save session ID to track it in webhook
        await prisma.event.update({
            where: { id: event.id },
            data: { stripeSessionId: checkoutSession.id }
        })

        return NextResponse.json({ url: checkoutSession.url })
    } catch (error: any) {
        console.error('Stripe Checkout Error:', error)
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}
