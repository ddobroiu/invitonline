import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { buildMetaPayload, metaCheckoutMetadata, metaPhone, metaVisitorFromHeaders, sendMetaEvent, sendMetaPurchase } from '../../src/lib/meta-capi'
import { metaViewContentFor } from '../../src/lib/meta'

const sha = (v: string) => createHash('sha256').update(v).digest('hex')
const consentCookie = (marketing: boolean) => `cookie_consent=${encodeURIComponent(JSON.stringify({ v: 2, analytics: true, marketing, ts: 'x' }))}`

const realFetch = globalThis.fetch
const saved = { ...process.env }
let calls: { url: string; body: Record<string, unknown> }[] = []

beforeEach(() => {
    calls = []
    delete process.env.META_CAPI_TOKEN
    delete process.env.META_TEST_EVENT_CODE
    delete process.env.META_PIXEL_ID
    delete process.env.NEXT_PUBLIC_META_PIXEL_ID
    globalThis.fetch = (async (url: string, init?: RequestInit) => {
        calls.push({ url: String(url), body: JSON.parse(String(init?.body)) })
        return new Response(JSON.stringify({ events_received: 1 }), { status: 200 })
    }) as typeof fetch
})
afterEach(() => {
    globalThis.fetch = realFetch
    process.env = { ...saved }
})

test('payload hashes email / phone / external id and keeps event id', () => {
    const body = buildMetaPayload({
        eventName: 'Purchase', eventId: 'cs_test_1', eventTime: 1700000000, eventSourceUrl: 'https://invitonline.ro/checkout/success',
        email: '  Ana@Example.COM ', phone: '0722 123 456', externalId: 'user1', ip: '1.2.3.4', userAgent: 'UA', fbp: 'fb.1.1.2', fbc: 'fb.1.1.abc',
        customData: { value: 99, currency: 'RON' },
    })
    const ev = (body.data as Record<string, unknown>[])[0]
    assert.equal(ev.event_name, 'Purchase')
    assert.equal(ev.event_id, 'cs_test_1')
    assert.equal(ev.action_source, 'website')
    assert.equal(ev.event_time, 1700000000)
    const user = ev.user_data as Record<string, unknown>
    assert.deepEqual(user.em, [sha('ana@example.com')])
    assert.deepEqual(user.ph, [sha('40722123456')])
    assert.deepEqual(user.external_id, [sha('user1')])
    assert.equal(user.client_ip_address, '1.2.3.4')
    assert.equal(user.fbp, 'fb.1.1.2')
    assert.equal(user.fbc, 'fb.1.1.abc')
    assert.equal(body.test_event_code, undefined)
    assert.equal('access_token' in body, false)
})

test('phone is E.164 digits without plus', () => {
    assert.equal(metaPhone('+40 722 123 456'), '40722123456')
    assert.equal(metaPhone('0040722123456'), '40722123456')
    assert.equal(metaPhone('abc'), undefined)
})

test('test_event_code comes from META_TEST_EVENT_CODE', () => {
    process.env.META_TEST_EVENT_CODE = 'TEST123'
    assert.equal(buildMetaPayload({ eventName: 'Lead', eventId: 'x' }).test_event_code, 'TEST123')
})

test('no token or no consent: nothing is sent', async () => {
    assert.equal(await sendMetaEvent({ marketing: true, eventName: 'Purchase', eventId: 'a' }), false)
    process.env.META_CAPI_TOKEN = 'secret'
    assert.equal(await sendMetaEvent({ marketing: false, eventName: 'Purchase', eventId: 'a' }), false)
    assert.equal(await sendMetaPurchase({ eventId: 'cs_1', value: 99, currency: 'ron', contentIds: ['x'], metadata: { tt_consent: '1' } }), false)
    assert.equal(calls.length, 0)
})

test('purchase with consent posts to the pixel with token in body', async () => {
    process.env.META_CAPI_TOKEN = 'secret'
    const metadata = { ...metaCheckoutMetadata({ marketing: true, fbp: 'fb.1.1.2', fbc: 'fb.1.1.abc' }), tt_ip: '1.2.3.4', tt_ua: 'UA' }
    assert.equal(await sendMetaPurchase({ eventId: 'cs_1', value: 99, currency: 'ron', contentIds: ['invitatie_premium'], metadata }), true)
    assert.equal(calls.length, 1)
    assert.equal(calls[0].url, 'https://graph.facebook.com/v21.0/1647428873689235/events')
    assert.equal(calls[0].body.access_token, 'secret')
    const ev = (calls[0].body.data as Record<string, unknown>[])[0]
    assert.equal(ev.event_id, 'cs_1')
    assert.deepEqual((ev.custom_data as Record<string, unknown>).currency, 'RON')
    assert.equal((ev.user_data as Record<string, unknown>).client_user_agent, 'UA')
})

test('checkout metadata and visitor are empty without marketing consent', () => {
    assert.deepEqual(metaCheckoutMetadata({ marketing: false, fbp: 'x' }), {})
    const h = new Headers({ cookie: `${consentCookie(false)}; _fbp=fb.1.1.2` })
    assert.deepEqual(metaVisitorFromHeaders(h), { marketing: false })
    const ok = metaVisitorFromHeaders(new Headers({ cookie: `${consentCookie(true)}; _fbp=fb.1.1.2`, 'x-forwarded-for': '5.6.7.8, 10.0.0.1' }))
    assert.equal(ok.marketing, true)
    assert.equal(ok.fbp, 'fb.1.1.2')
    assert.equal(ok.ip, '5.6.7.8')
})

test('ViewContent only on template, catalogue and landing pages', () => {
    assert.deepEqual((metaViewContentFor('/templates/boarding') as Record<string, unknown>).content_ids, ['boarding'])
    assert.ok(metaViewContentFor('/demo'))
    assert.equal((metaViewContentFor('/invitatii-nunta') as Record<string, unknown>).value, 99)
    assert.equal(metaViewContentFor('/dashboard'), null)
    assert.equal(metaViewContentFor('/invitatie/abc'), null)
})
