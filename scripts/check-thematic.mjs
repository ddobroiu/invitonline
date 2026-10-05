import { chromium, expect } from '@playwright/test'
import fs from 'node:fs'
import assert from 'node:assert/strict'

const base = process.argv[2] || 'http://localhost:3015'
const source = fs.readFileSync('src/config/templates.ts', 'utf8')
const ids = [...source.matchAll(/\{ id: '([^']+)', name: '([^']+)'[^\n]*suits: \[([^\]]*)\]/g)].map(m => ({ id: m[1], type: m[3].split(',')[0].replaceAll("'", '').trim() }))
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
const errors = []
page.on('pageerror', e => errors.push(e.message))
await page.context().addCookies([{ name: 'cookie_consent', value: encodeURIComponent(JSON.stringify({ v: 2, analytics: false, marketing: false, ts: new Date().toISOString() })), url: base }])
fs.mkdirSync('shots/thematic-review', { recursive: true })
try {
    for (const { id, type } of (process.argv.includes('--interactions') ? [] : ids)) {
        await page.goto(`${base}/templates/${id}?cta=0&tip=${type}`, { waitUntil: 'domcontentloaded', timeout: 60000 })
        await page.locator('[class*="publicContainer"] > div').first().waitFor({ state: 'attached' })
        await page.evaluate(() => document.fonts.ready)
        await page.waitForTimeout(900)
        if (id === 'chat') await page.getByRole('button', { name: 'Răspunde la invitație', exact: true }).click()
        for (const width of [390, 1440]) {
            await page.setViewportSize({ width, height: 844 })
            await page.waitForTimeout(100)
            assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${id} overflows at ${width}`)
            await page.screenshot({ path: `shots/thematic-review/${id}-${width}.png` })
        }
        console.log(`Checked ${id}`)
        await page.setViewportSize({ width: 390, height: 844 })
    }
    for (const id of ['passport', 'scratch', 'chat', 'boarding']) {
        await page.goto(`${base}/templates/${id}?cta=0`, { waitUntil: 'domcontentloaded', timeout: 60000 })
        // Wait for client handlers before interacting; a slow external photo need not block the check.
        await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {})
        if (id === 'passport') {
            const cover = page.getByRole('button', { name: 'Deschide pașaportul' })
            await cover.press('Enter')
            assert.equal(await page.getByRole('button', { name: 'Închide pașaportul' }).getAttribute('aria-expanded'), 'true')
            await page.waitForTimeout(900)
        }
        if (id === 'scratch') await page.getByRole('button', { name: /arată|dezvăluie|răzuit/i }).click()
        if (id === 'chat') await page.getByRole('button', { name: 'Răspunde la invitație', exact: true }).click()
        await page.screenshot({ path: `shots/thematic-review/${id}-opened.png`, fullPage: true })
        await page.getByRole('button', { name: /confirm.*prezen|cu drag|check-in/i }).first().click()
        await page.getByRole('dialog').waitFor({ state: 'visible' })
        assert.equal(await page.getByRole('dialog').isVisible(), true, `${id}: RSVP missing`)
    }
    await page.goto(`${base}/demo`, { waitUntil: 'networkidle' })
    await expect(page.locator('article')).toHaveCount(ids.length)
    const catalogueFilter = page.getByLabel('Alege modelele')
    await catalogueFilter.selectOption('theme:travel')
    await expect(page.locator('article')).toHaveCount(3)
    assert.deepEqual((await page.locator('article h2').allTextContents()).sort(), ['Riviera', 'Bilet de avion', 'Pașaport'].sort())
    await catalogueFilter.selectOption('event:botez')
    assert.ok(await page.locator('article').count() > 0)
    assert.ok(!(await page.locator('article h2').allTextContents()).includes('Bilet de avion'))
    await catalogueFilter.selectOption('all')
    await expect(page.locator('article')).toHaveCount(ids.length)
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.goto(`${base}/create?template=boarding`, { waitUntil: 'networkidle' })
    await page.getByRole('group', { name: 'Tematica invitației' }).getByRole('button', { name: 'Călătorie', exact: true }).click()
    await page.getByRole('button', { name: /^Pașaport/ }).click()
    const preview = page.locator('iframe').first().contentFrame()
    await preview.getByRole('button', { name: 'Deschide pașaportul' }).waitFor()
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.screenshot({ path: 'shots/thematic-review/editor-travel.png' })
    assert.equal(errors.length, 0, errors.join('\n'))
    const tiles = ids.map(({ id }) => `<figure><figcaption>${id}</figcaption><img src="data:image/png;base64,${fs.readFileSync(`shots/thematic-review/${id}-390.png`).toString('base64')}" /></figure>`).join('')
    await page.setViewportSize({ width: 1600, height: 1500 })
    await page.setContent(`<style>body{background:#e9e4da;margin:0;padding:20px;display:grid;grid-template-columns:repeat(6,1fr);gap:16px;font:14px Arial}figure{margin:0}figcaption{padding:10px 0}img{width:100%;display:block}</style>${tiles}`)
    await page.screenshot({ path: 'shots/thematic-review/overview.png', fullPage: true })
    console.log(`${ids.length} models checked on phone and desktop; interactive invitations and theme filters passed.`)
} finally { await browser.close() }
