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

                // 4. Send Emails (Resend)
                try {
                    const { sendEmail } = await import('@/lib/resend')

                    // --- To User ---
                    await sendEmail({
                        to: user.email,
                        subject: 'Plata Reușită! Invitația ta este acum activă 🎉',
                        html: `
                            <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
                                <h1 style="color: #2e7d32;">Plată Confirmată!</h1>
                                <p>Bună, ${user.name || 'Utilizator'}!</p>
                                <p>Îți mulțumim pentru plată. Invitația ta pentru evenimentul "<strong>${updatedEvent.title}</strong>" a fost activată și poate fi acum partajată cu oaspeții.</p>
                                
                                <div style="margin: 30px 0; background: #f5f5f5; padding: 20px; border-radius: 12px; border-left: 4px solid #d4af37;">
                                    <p style="margin: 0; font-weight: bold; color: #555;">Link-ul tău unic:</p>
                                    <p style="margin: 10px 0; font-size: 1.1rem; color: #000;">${process.env.NEXT_PUBLIC_SITE_URL}/invitatie/${eventId}</p>
                                    <a href="${process.env.NEXT_PUBLIC_SITE_URL}/invitatie/${eventId}" style="display: inline-block; background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 6px; margin-top: 10px;">Vezi Invitația</a>
                                </div>

                                ${invLink ? `
                                <p>Factura ta fiscală a fost generată și o poți descărca de aici:</p>
                                <a href="${invLink}" style="color: #d4af37; font-weight: bold;">Descarcă Factura (PDF)</a>
                                ` : ''}

                                <p style="margin-top: 40px; font-size: 0.8rem; color: #888;">
                                    Dacă ai nevoie de ajutor, ne poți contacta la ${process.env.ADMIN_EMAIL}.
                                </p>
                            </div>
                        `
                    })

                    // --- To Admin ---
                    await sendEmail({
                        to: process.env.ADMIN_EMAIL || 'contact@invitonline.ro',
                        subject: `💸 Vânzare Nouă: ${user.email}`,
                        html: `
                            <div style="font-family: sans-serif;">
                                <h2>Vânzare Nouă!</h2>
                                <p><strong>Client:</strong> ${user.email} (${user.name || 'N/A'})</p>
                                <p><strong>Eveniment:</strong> ${updatedEvent.title} (${updatedEvent.type})</p>
                                <p><strong>Suma:</strong> ${(session.amount_total || 0) / 100} ${session.currency?.toUpperCase()}</p>
                                <p><strong>Stripe Session:</strong> ${session.id}</p>
                                ${invSeries ? `<p><strong>Factura:</strong> ${invSeries} ${invNumber}</p>` : '<p><strong>Factura:</strong> Nu a fost generată automat (lipsă date CUI?)</p>'}
                            </div>
                        `
                    })
                } catch (emailErr) {
                    console.error('Webhook notification emails failed:', emailErr)
                }

            } catch (error) {
                console.error("Error processing checkout session:", error)
                return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
            }
        }
    }

    return NextResponse.json({ received: true })
}

