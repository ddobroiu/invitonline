import assert from 'node:assert/strict'
import fs from 'node:fs'
import { chromium } from '@playwright/test'

const base = process.argv[2] || 'http://localhost:3015'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
const errors = [], writes = []
page.on('pageerror', error => errors.push(error.message))
page.on('request', request => { if (request.method() === 'POST' && /\/api\/(guests|events)/.test(request.url())) writes.push(request.url()) })
await page.context().addCookies([{ name: 'cookie_consent', value: encodeURIComponent(JSON.stringify({ v: 2, analytics: false, marketing: false, ts: new Date().toISOString() })), url: base }])
fs.mkdirSync('test-results/homepage', { recursive: true })
try {
    for (const width of [1440, 390]) {
        await page.setViewportSize({ width, height: 1000 })
        await page.goto(base, { waitUntil: 'networkidle' })
        assert.deepEqual(await page.locator('#modele h3').allTextContents(), ['Bilet de avion', 'Pașaport', 'Lozul norocos', 'Discul nostru', 'Love Letter', 'Premiere'])
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
        assert.ok(await page.locator('#modele img').evaluateAll(images => images.every(image => decodeURIComponent(image.getAttribute('src')).includes('/images/models/'))))
        const flow = page.locator('#cum-functioneaza')
        await page.screenshot({ path: `test-results/homepage/hero-${width}.png` })
        await flow.scrollIntoViewIfNeeded()
        await flow.screenshot({ path: `test-results/homepage/flow-start-${width}.png` })
        const send = flow.getByRole('button', { name: 'Trimite invitația', exact: true })
        const confirm = flow.getByRole('button', { name: 'Confirmă prezența', exact: true })
        assert.equal(await confirm.isDisabled(), true)
        await send.click()
        assert.equal(await confirm.isEnabled(), true)
        await confirm.click()
        await flow.getByRole('status').filter({ hasText: 'Maria a confirmat' }).waitFor()
        assert.equal(await flow.getByText('Confirmat', { exact: true }).count(), 1)
        await flow.screenshot({ path: `test-results/homepage/flow-confirmed-${width}.png` })
        await flow.getByRole('button', { name: 'Reia exemplul', exact: true }).click()
        assert.equal(await flow.getByRole('button', { name: 'Confirmă prezența', exact: true }).isDisabled(), true)
        assert.equal(await flow.getByText('Confirmat', { exact: true }).count(), 0)
    }
    await page.goto(`${base}/demo`, { waitUntil: 'networkidle' })
    assert.deepEqual((await page.locator('article h2').allTextContents()).slice(0, 6), ['Bilet de avion', 'Pașaport', 'Lozul norocos', 'Discul nostru', 'Love Letter', 'Premiere'])
    assert.equal(await page.locator('article').count(), 23)
    assert.equal(writes.length, 0, 'The demonstration must not create real records')
    assert.equal(errors.length, 0, errors.join('\n'))
    console.log('PASS spectacular models first; send, confirm, dashboard and reset on phone/desktop; no real submissions')
} finally { await browser.close() }
