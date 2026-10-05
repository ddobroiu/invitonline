import fs from 'node:fs'
import Stripe from 'stripe'
import prisma from '../src/lib/prisma'

// Never creates a payment, customer, order or webhook. Signed ping probes do not activate invitations.
const key = process.env.STRIPE_SECRET_KEY
const report: Record<string, unknown> = { checkedAt: new Date().toISOString(), mode: key?.startsWith('sk_live_') ? 'live' : key?.startsWith('sk_test_') ? 'test' : 'missing', webhookSecretConfigured: Boolean(process.env.STRIPE_WEBHOOK_SECRET) }
const safeError = (error: unknown) => {
    const value = error as { type?: string; code?: string; statusCode?: number }
    return { type: value.type || 'connection_or_database_error', code: value.code, status: value.statusCode }
}
async function main() {
    if (!key) return
    const stripe = new Stripe(key, { timeout: 15000, maxNetworkRetries: 0 })
    const results = await Promise.allSettled([
        stripe.accounts.retrieve(),
        stripe.webhookEndpoints.list({ limit: 100 }),
        stripe.checkout.sessions.list({ limit: 100 }),
    ])
    const [account, endpoints, sessions] = results
    report.account = account.status === 'fulfilled' ? { chargesEnabled: account.value.charges_enabled, payoutsEnabled: account.value.payouts_enabled, detailsSubmitted: account.value.details_submitted } : safeError(account.reason)
    report.webhooks = endpoints.status === 'fulfilled' ? endpoints.value.data.filter(endpoint => { try { return ['invitonline.ro', 'www.invitonline.ro'].includes(new URL(endpoint.url).hostname) } catch { return false } }).map(endpoint => ({ url: endpoint.url, status: endpoint.status, live: endpoint.livemode, checkoutCompleted: endpoint.enabled_events.includes('*') || endpoint.enabled_events.includes('checkout.session.completed'), asyncPaymentSucceeded: endpoint.enabled_events.includes('*') || endpoint.enabled_events.includes('checkout.session.async_payment_succeeded') })) : safeError(endpoints.reason)
    if (sessions.status === 'fulfilled') {
        const relevant = sessions.value.data.filter(session => session.metadata?.project === 'invitonline')
        const paid = relevant.filter(session => session.payment_status === 'paid')
        report.recentSessions = { scope: 'last_100_account_sessions', found: relevant.length, paid: paid.length, open: relevant.filter(session => session.status === 'open').length, expired: relevant.filter(session => session.status === 'expired').length, paidAtExpectedPrice: paid.filter(session => session.amount_total === 9900 && session.currency === 'ron').length }
        if (paid.length) {
            try {
                const orders = await prisma.order.findMany({ where: { stripeSessionId: { in: paid.map(session => session.id) } }, select: { status: true, event: { select: { isPaid: true, publishedAt: true } } } })
                report.fulfillment = { paidStripeSessions: paid.length, completedOrders: orders.filter(order => order.status === 'completed').length, activeInvitations: orders.filter(order => order.event?.isPaid).length, activationTimestamps: orders.filter(order => order.event?.publishedAt).length }
            } catch (error) { report.fulfillment = safeError(error) }
        }
    } else report.recentSessions = safeError(sessions.reason)
    const publicChecks = await Promise.allSettled(['/', '/api/checkout', '/robots.txt'].map(async path => {
        const res = await fetch(`https://invitonline.ro${path}`, { signal: AbortSignal.timeout(15000) })
        return { path, status: res.status, robotsHeader: res.headers.get('x-robots-tag') }
    }))
    report.publicSite = publicChecks.map((result, index) => result.status === 'fulfilled' ? result.value : { path: ['/', '/api/checkout', '/robots.txt'][index], reachable: false })
    const secret = process.env.STRIPE_WEBHOOK_SECRET
    if (secret) {
        const payload = JSON.stringify({ id: 'evt_invitonline_integration_probe', object: 'event', created: Math.floor(Date.now() / 1000), livemode: report.mode === 'live', type: 'ping', data: { object: { object: 'ping' } } })
        const signature = stripe.webhooks.generateTestHeaderString({ payload, secret })
        const probes = await Promise.allSettled(['invalid', signature].map(async header => {
            const res = await fetch('https://invitonline.ro/api/webhook', { method: 'POST', headers: { 'content-type': 'application/json', 'stripe-signature': header }, body: payload, signal: AbortSignal.timeout(15000) })
            return res.status
        }))
        report.webhookProbes = { eventType: 'ping', noPaymentCreated: true, invalidSignatureStatus: probes[0].status === 'fulfilled' ? probes[0].value : 'unreachable', validSignatureStatus: probes[1].status === 'fulfilled' ? probes[1].value : 'unreachable' }
    }
}
main().catch(error => { report.error = safeError(error) }).finally(async () => {
    await prisma.$disconnect()
    fs.mkdirSync('test-results', { recursive: true })
    fs.writeFileSync('test-results/payment-audit.json', JSON.stringify(report, null, 2))
    console.log(JSON.stringify(report, null, 2))
})
