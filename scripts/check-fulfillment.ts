import assert from 'node:assert/strict'
import Stripe from 'stripe'
import prisma from '../src/lib/prisma'
import { fulfillCheckout } from '../src/lib/fulfill'

async function main() {
    assert.equal(process.env.INVITONLINE_E2E, '1', 'Only use the disposable test database')
    const eventId = process.argv[2]
    const event = await prisma.event.findUniqueOrThrow({ where: { id: eventId } })
    const session = { id: 'cs_local_fixture', payment_status: 'paid', amount_total: 9900, currency: 'ron', metadata: { project: 'invitonline', userId: event.userId, eventId } } as unknown as Stripe.Checkout.Session
    assert.equal((await fulfillCheckout({ ...session, payment_status: 'unpaid' })).fulfilled, false)
    assert.equal((await fulfillCheckout({ ...session, metadata: { ...session.metadata, userId: 'wrong-user' } })).fulfilled, false)
    await assert.rejects(fulfillCheckout({ ...session, metadata: { ...session.metadata, terms_accepted_at: 'invalid' } }))
    assert.equal((await prisma.event.findUniqueOrThrow({ where: { id: eventId } })).isPaid, false)
    assert.equal(await prisma.order.count({ where: { eventId } }), 0)
    // Exercise the actual webhook handler, including Stripe signature validation.
    process.env.STRIPE_SECRET_KEY = 'sk_test_local_fixture'
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_local_fixture'
    const { POST } = await import('../src/app/api/webhook/route')
    const payload = JSON.stringify({ id: 'evt_local_fixture', type: 'checkout.session.completed', data: { object: session } })
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const request = (signature: string) => new Request('http://localhost/api/webhook', { method: 'POST', headers: { 'stripe-signature': signature }, body: payload })
    assert.equal((await POST(request('invalid'))).status, 400)
    const expired = stripe.webhooks.generateTestHeaderString({ payload, secret: process.env.STRIPE_WEBHOOK_SECRET, timestamp: Math.floor(Date.now() / 1000) - 600 })
    assert.equal((await POST(request(expired))).status, 400)
    assert.equal((await prisma.event.findUniqueOrThrow({ where: { id: eventId } })).isPaid, false)
    const signature = stripe.webhooks.generateTestHeaderString({ payload, secret: process.env.STRIPE_WEBHOOK_SECRET })
    assert.equal((await POST(request(signature))).status, 200)
    const active = await prisma.event.findUniqueOrThrow({ where: { id: eventId } })
    assert.equal(active.isPaid, true)
    assert.ok(active.publishedAt)
    assert.equal((await fulfillCheckout(session)).alreadyProcessed, true)
    assert.equal((await POST(request(signature))).status, 200)
    assert.equal(await prisma.order.count({ where: { eventId } }), 1)
    assert.equal((await prisma.event.findUniqueOrThrow({ where: { id: eventId } })).publishedAt?.getTime(), active.publishedAt.getTime())
    console.log('PASS payment ownership, webhook signatures, activation and idempotency')
}
main().finally(() => prisma.$disconnect()).catch(error => { console.error(error); process.exitCode = 1 })
