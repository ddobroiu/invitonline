import type Stripe from 'stripe'
import prisma from '@/lib/prisma'
import { escapeHtml, getSiteUrl } from '@/lib/utils'

/**
 * Marks the event as paid, creates the order (with invoice when billing data exists)
 * and sends notification emails. Safe to call multiple times for the same session:
 * both the Stripe webhook and the success page call it.
 */
export async function fulfillCheckout(session: Stripe.Checkout.Session) {
    const eventId = session.metadata?.eventId
    if (!eventId || session.payment_status !== 'paid') return { fulfilled: false }

    const existingOrder = await prisma.order.findUnique({ where: { stripeSessionId: session.id } })
    if (existingOrder) {
        await prisma.event.update({ where: { id: eventId }, data: { isPaid: true } })
        return { fulfilled: true, alreadyProcessed: true }
    }

    const updatedEvent = await prisma.event.update({
        where: { id: eventId },
        data: { isPaid: true },
        include: { user: true }
    })

    const user = updatedEvent.user
    const amount = (session.amount_total || 0) / 100
    const currency = session.currency?.toUpperCase() || 'EUR'

    // Create the order first so a concurrent call hits the unique constraint instead of duplicating
    let order
    try {
        order = await prisma.order.create({
            data: {
                userId: user.id,
                eventId,
                amount,
                currency,
                stripeSessionId: session.id,
                status: 'completed',
            }
        })
    } catch {
        return { fulfilled: true, alreadyProcessed: true }
    }

    // Automated invoicing (Oblio) when the user saved billing details
    let invLink: string | null = null
    let invSeries: string | null = null
    let invNumber: string | null = null

    if ((user.cui || user.companyName) && process.env.OBLIO_API_KEY) {
        try {
            const { createInvoice } = await import('@/lib/oblio')
            const invoiceData = await createInvoice({
                cif: user.cui || '',
                name: user.companyName || user.name || 'Client',
                rc: user.regCom || '',
                address: user.address || '-',
                city: user.city || '-',
                county: user.county || '-',
                email: user.email
            }, [{
                name: `Pachet Invitatie Online - ${updatedEvent.type} (${updatedEvent.title})`,
                quantity: 1,
                price: amount,
                currency,
                vatName: 'Normal',
                vatPercentage: 19,
                vatIncluded: true,
            }])

            const getField = (obj: any, key: string) => obj?.[key] ?? obj?.data?.[key] ?? obj?.data?.data?.[key] ?? null
            invLink = getField(invoiceData, 'link') || getField(invoiceData, 'url')
            invSeries = getField(invoiceData, 'seriesName') || getField(invoiceData, 'series')
            invNumber = getField(invoiceData, 'number')

            await prisma.order.update({
                where: { id: order.id },
                data: {
                    invoiceLink: invLink ? String(invLink) : null,
                    invoiceSeries: invSeries ? String(invSeries) : null,
                    invoiceNumber: invNumber ? String(invNumber) : null,
                }
            })
        } catch (err: any) {
            console.error('Oblio Generation Failed:', err?.message)
        }
    }

    // Notification emails
    try {
        const { sendEmail } = await import('@/lib/resend')
        const siteUrl = getSiteUrl()
        const inviteUrl = `${siteUrl}/invitatie/${eventId}`

        await sendEmail({
            to: user.email,
            subject: 'Plata reușită! Invitația ta este acum activă 🎉',
            html: `
                <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #2e7d32;">Plată confirmată!</h1>
                    <p>Bună, ${escapeHtml(user.name || 'Utilizator')}!</p>
                    <p>Îți mulțumim pentru plată. Invitația ta „<strong>${escapeHtml(updatedEvent.title)}</strong>” a fost activată și poate fi partajată cu oaspeții.</p>
                    <div style="margin: 30px 0; background: #f5f5f5; padding: 20px; border-radius: 12px; border-left: 4px solid #d4af37;">
                        <p style="margin: 0; font-weight: bold; color: #555;">Link-ul tău unic:</p>
                        <p style="margin: 10px 0; font-size: 1.1rem; color: #000;">${inviteUrl}</p>
                        <a href="${inviteUrl}" style="display: inline-block; background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 6px; margin-top: 10px;">Vezi invitația</a>
                    </div>
                    ${invLink ? `<p>Factura ta fiscală: <a href="${escapeHtml(invLink)}" style="color: #d4af37; font-weight: bold;">Descarcă factura (PDF)</a></p>` : ''}
                </div>
            `
        })

        await sendEmail({
            to: process.env.ADMIN_EMAIL || 'contact@invitonline.ro',
            subject: `💸 Vânzare nouă: ${user.email}`,
            html: `
                <div style="font-family: sans-serif;">
                    <h2>Vânzare nouă!</h2>
                    <p><strong>Client:</strong> ${escapeHtml(user.email)} (${escapeHtml(user.name || 'N/A')})</p>
                    <p><strong>Eveniment:</strong> ${escapeHtml(updatedEvent.title)} (${escapeHtml(updatedEvent.type)})</p>
                    <p><strong>Suma:</strong> ${amount} ${currency}</p>
                    <p><strong>Stripe Session:</strong> ${session.id}</p>
                    <p><strong>Factura:</strong> ${invSeries ? `${escapeHtml(invSeries)} ${escapeHtml(invNumber)}` : 'Nu a fost generată automat'}</p>
                </div>
            `
        })
    } catch (err) {
        console.error('Payment notification emails failed:', err)
    }

    return { fulfilled: true }
}
