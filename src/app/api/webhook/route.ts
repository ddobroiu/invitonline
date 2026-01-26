import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import prisma from '@/lib/prisma'
import { headers } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27.acacia' as any,
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
    const body = await req.text()
    const signature = (await headers()).get('stripe-signature') as string

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`)
        return NextResponse.json({ message: 'Webhook Error' }, { status: 400 })
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session
        const eventId = session.metadata?.eventId

        if (eventId) {
            try {
                // 1. Update event status
                const updatedEvent = await prisma.event.update({
                    where: { id: eventId },
                    data: { isPaid: true },
                    include: { user: true }
                })

                console.log(`Payment confirmed for event: ${eventId}`)

                const user = updatedEvent.user
                let invLink = null
                let invSeries = null
                let invNumber = null

                // 2. Automated Invoicing (Oblio)
                // If we have CUI or Company Name, attempt to generate invoice
                const u = user as any
                if (u.cui || u.companyName) {
                    try {
                        const { createInvoice } = await import('@/lib/oblio')
                        const unitPrice = (session.amount_total || 0) / 100

                        const products = [{
                            name: `Pachet Invitatie Online - ${updatedEvent.type} (${updatedEvent.title})`,
                            quantity: 1,
                            price: unitPrice,
                            vatName: 'Normal', // Adjust based on your company's VAT status
                            vatPercentage: 19,
                            vatIncluded: true,
                        }]

                        const invoiceData = await createInvoice({
                            cif: u.cui || '',
                            name: u.companyName || u.name || 'Client',
                            rc: u.regCom || '',
                            address: u.address || '-',
                            city: u.city || '-',
                            county: u.county || '-',
                            email: u.email
                        }, products)


                        if (invoiceData) {
                            // Extract data from Oblio response
                            // Helper to navigate Oblio's nested response
                            const getField = (obj: any, key: string) => {
                                if (!obj) return null
                                if (obj[key]) return obj[key]
                                if (obj.data && obj.data[key]) return obj.data[key]
                                if (obj.data && obj.data.data && obj.data.data[key]) return obj.data.data[key]
                                return null
                            }

                            invLink = getField(invoiceData, 'link') || getField(invoiceData, 'url')
                            invSeries = getField(invoiceData, 'seriesName') || getField(invoiceData, 'series')
                            invNumber = getField(invoiceData, 'number')

                            console.log(`Invoice generated: ${invSeries} ${invNumber}`)
                        }
                    } catch (oblioErr: any) {
                        console.error("Oblio Generation Failed:", oblioErr.message)
                    }
                }

                // 3. Create Order Record
                await (prisma as any).order.create({
                    data: {
                        userId: user.id,
                        eventId: eventId,
                        amount: (session.amount_total || 0) / 100,
                        currency: session.currency?.toUpperCase() || 'RON',
                        stripeSessionId: session.id,
                        status: 'completed',
                        invoiceLink: invLink ? String(invLink) : null,
                        invoiceSeries: invSeries ? String(invSeries) : null,
                        invoiceNumber: invNumber ? String(invNumber) : null
                    }
                })



            } catch (error) {
                console.error("Error processing checkout session:", error)
                return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
            }
        }
    }

    return NextResponse.json({ received: true })
}

