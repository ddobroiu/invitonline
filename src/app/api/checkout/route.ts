import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { getStripe, INVITATION_CURRENCY, INVITATION_PRICE } from '@/lib/stripe'
import { fulfillCheckout } from '@/lib/fulfill'
import { getSiteUrl } from '@/lib/utils'
import { LEGAL_VERSION } from '@/config/legal'
import { getCookieValue, hasAnalyticsConsent, hasMarketingConsent } from '@/lib/consent'
import { clientIp, tiktokCheckoutMetadata } from '@/lib/tiktok-events'

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        const userId = (session?.user as any)?.id
        if (!userId) {
            return NextResponse.json({ message: 'Trebuie să fii autentificat.' }, { status: 401 })
        }

        const stripe = getStripe()
        if (!stripe) {
            return NextResponse.json({ message: 'Plățile nu sunt configurate încă (STRIPE_SECRET_KEY lipsește).' }, { status: 503 })
        }

        const { eventId, consent } = await req.json()
        // Acordul pentru furnizarea imediata si pierderea dreptului de retragere (OUG 34/2014, art. 16 lit. a si m)
        if (consent !== true) {
            return NextResponse.json({ message: 'Trebuie să accepți Termenii și condițiile și furnizarea imediată a serviciului digital.' }, { status: 400 })
        }
        const consentAt = new Date().toISOString()
        const event = eventId ? await prisma.event.findUnique({ where: { id: eventId } }) : null

        if (!event || event.userId !== userId) {
            return NextResponse.json({ message: 'Invitația nu a fost găsită.' }, { status: 404 })
        }
        if (event.isPaid) {
            return NextResponse.json({ message: 'Invitația este deja activată.' }, { status: 400 })
        }

        const siteUrl = getSiteUrl(req)
        // Contul Stripe „Applications” e comun aplicatiilor: eticheta de proiect separa platile in mydashboard
        // Identificatorul de vizitator mydashboard se trimite doar cu acord pentru cookies analitice
        const cookieHeader = req.headers.get('cookie')
        const vid = hasAnalyticsConsent(cookieHeader) ? getCookieValue(cookieHeader, '_md_vid') : undefined
        const tag = { project: 'invitonline', ...(vid && { md_vid: vid.slice(0, 64) }) }
        const consentMeta = { terms_version: LEGAL_VERSION, terms_accepted_at: consentAt, withdrawal_waiver: 'true' }
        // TikTok Events API (lib/tiktok-events.ts): consimtamant + _ttp/ttclid/IP/UA, doar cu acord pentru marketing
        const tiktok = tiktokCheckoutMetadata({
            marketing: hasMarketingConsent(cookieHeader),
            ttp: getCookieValue(cookieHeader, '_ttp'),
            ttclid: getCookieValue(cookieHeader, 'tt_ttclid'),
            ip: clientIp(req.headers),
            userAgent: req.headers.get('user-agent'),
        })
        const checkoutSession = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: INVITATION_CURRENCY,
                        product_data: {
                            name: `Invitație Premium - ${event.title}`,
                            description: 'Acces complet și link unic pentru invitația ta online.',
                        },
                        unit_amount: INVITATION_PRICE,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            customer_email: session?.user?.email || undefined,
            success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${siteUrl}/dashboard?canceled=true`,
            metadata: { ...tag, ...consentMeta, eventId: event.id, userId, ...tiktok },
            payment_intent_data: { metadata: { ...tag, eventId: event.id, userId } },
            // Numele, adresa si (pentru firme) CUI-ul pentru factura Oblio, cerute de Stripe la plata
            billing_address_collection: 'required',
            tax_id_collection: { enabled: true },
        })

        await prisma.event.update({
            where: { id: event.id },
            data: { stripeSessionId: checkoutSession.id }
        })

        return NextResponse.json({ url: checkoutSession.url })
    } catch (error: any) {
        console.error('Stripe Checkout Error:', error)
        return NextResponse.json({ message: 'Nu am putut iniția plata. Încearcă din nou.' }, { status: 500 })
    }
}

// Called by the success page: verifies the Stripe session directly so activation
// works even if the webhook is delayed or not configured.
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        const userId = (session?.user as any)?.id
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const sessionId = new URL(req.url).searchParams.get('session_id')
        if (!sessionId) {
            return NextResponse.json({ message: 'Sesiune invalidă' }, { status: 400 })
        }
        const stripe = getStripe()
        if (!stripe) {
            return NextResponse.json({ message: 'Plățile nu sunt configurate încă.' }, { status: 503 })
        }

        let checkoutSession
        try {
            checkoutSession = await stripe.checkout.sessions.retrieve(sessionId)
        } catch (err) {
            // Unknown / malformed session id
            const stripeErr = err as { statusCode?: number, type?: string }
            if (stripeErr?.statusCode === 404 || stripeErr?.type === 'StripeInvalidRequestError') {
                return NextResponse.json({ message: 'Sesiune de plată inexistentă' }, { status: 404 })
            }
            throw err
        }
        if (checkoutSession.metadata?.userId !== userId) {
            return NextResponse.json({ message: 'Sesiune invalidă' }, { status: 403 })
        }

        if (checkoutSession.payment_status === 'paid') {
            await fulfillCheckout(checkoutSession)
        }

        return NextResponse.json({
            paid: checkoutSession.payment_status === 'paid',
            eventId: checkoutSession.metadata?.eventId,
            // For the GA4 purchase event on the success page (no personal data)
            amount: (checkoutSession.amount_total ?? 0) / 100,
            currency: (checkoutSession.currency ?? 'eur').toUpperCase(),
        })
    } catch (error) {
        console.error('Checkout verify error:', error)
        return NextResponse.json({ message: 'Eroare la verificarea plății' }, { status: 500 })
    }
}
