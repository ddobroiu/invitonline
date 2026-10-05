import assert from 'node:assert/strict'
import fs from 'node:fs'
import { chromium } from '@playwright/test'

const base = process.argv[2] || 'http://localhost:3015'
const source = fs.readFileSync('src/config/invitation-landings.ts', 'utf8')
const slugs = [...source.matchAll(/slug: '([^']+)'/g)].map(match => match[1])
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
const errors = []
page.on('pageerror', error => errors.push(error.message))
await page.context().addCookies([{ name: 'cookie_consent', value: encodeURIComponent(JSON.stringify({ v: 2, analytics: false, marketing: false, ts: new Date().toISOString() })), url: base }])
fs.mkdirSync('test-results/seo', { recursive: true })
const titles = new Set(), descriptions = new Set()
try {
    const sitemap = await (await page.request.get(`${base}/sitemap.xml`)).text()
    for (const slug of slugs) {
        const res = await page.goto(`${base}/${slug}`, { waitUntil: 'networkidle' })
        assert.equal(res.status(), 200, slug)
        assert.ok(!res.headers()['x-robots-tag']?.includes('noindex'), slug)
        assert.equal(await page.locator('h1').count(), 1, slug)
        assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), `https://invitonline.ro/${slug}`)
        const title = await page.title(), description = await page.locator('meta[name="description"]').getAttribute('content')
        assert.ok(!titles.has(title)); titles.add(title)
        assert.ok(description.length > 80 && !descriptions.has(description)); descriptions.add(description)
        assert.ok(!await page.evaluate(() => document.querySelector('meta[name="robots"]')?.getAttribute('content')?.includes('noindex')))
        assert.ok(sitemap.includes(`<loc>https://invitonline.ro/${slug}</loc>`))
        const structured = await page.locator('script[type="application/ld+json"]').allTextContents()
        const entities = structured.flatMap(text => JSON.parse(text)['@graph'] || [])
        assert.ok(entities.some(item => item['@type'] === 'BreadcrumbList'))
        assert.ok(entities.some(item => item['@type'] === 'Service' && item.offers.price === 99 && item.url === `https://invitonline.ro/${slug}`))
        assert.ok(await page.evaluate(() => [...document.images].filter(image => image.loading !== 'lazy').every(image => image.complete && image.naturalWidth > 0)), `Missing hero image: ${slug}`)
        for (const width of [390, 1440]) {
            await page.setViewportSize({ width, height: 900 })
            assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${slug} overflows at ${width}`)
            await page.screenshot({ path: `test-results/seo/${slug}-${width}.png`, fullPage: true })
        }
        const faq = page.locator('details').first()
        await faq.locator('summary').click()
        assert.ok(await faq.evaluate(element => element.open))
        const cta = page.getByRole('link', { name: 'Personalizează invitația', exact: true })
        const url = new URL(await cta.getAttribute('href'), base)
        assert.ok(url.searchParams.get('template') && url.searchParams.get('tip'))
        const og = await page.request.get(`${base}/${slug}/opengraph-image`)
        assert.equal(og.status(), 200, `OG ${slug}`)
        assert.ok(og.headers()['content-type'].includes('image/png'))
        if (slug === 'invitatii-nunta') {
            fs.writeFileSync('test-results/seo/nunta-og.png', await og.body())
            await cta.click()
            await page.waitForURL('**/create?*')
            assert.ok(page.url().includes('template=modern') && page.url().includes('tip=nunta'))
        }
        console.log(`PASS ${slug}: metadata, structured data, sitemap, images and layout`)
    }
    const unknown = await page.request.get(`${base}/invitatie-necunoscuta`)
    assert.equal(unknown.status(), 404)
    await page.goto(base, { waitUntil: 'networkidle' })
    assert.ok(await page.getByRole('navigation', { name: 'Invitații după eveniment' }).getByRole('link', { name: 'Nuntă', exact: true }).count())
    assert.equal(errors.length, 0, errors.join('\n'))
    console.log('PASS SEO pages: unique content metadata, valid routes and no browser errors')
} finally { await browser.close() }
