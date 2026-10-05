import fs from 'node:fs'
import { chromium } from '@playwright/test'

const base = process.argv[2] || 'http://localhost:3015'
const catalogue = fs.readFileSync('src/config/templates.ts', 'utf8')
const allModels = [...catalogue.matchAll(/\{ id: '([^']+)', name:/g)].map(match => match[1])
const version = catalogue.match(/MODEL_PREVIEW_VERSION = '([^']+)'/)[1]
const models = process.argv.includes('--only') ? process.argv.slice(process.argv.indexOf('--only') + 1).filter(id => allModels.includes(id)) : allModels
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 390, height: 650 }, reducedMotion: 'reduce' })
await page.context().addCookies([{ name: 'cookie_consent', value: encodeURIComponent(JSON.stringify({ v: 2, analytics: false, marketing: false, ts: new Date().toISOString() })), url: base }])
fs.mkdirSync('public/images/models', { recursive: true })
try {
    for (const id of models) {
        await page.goto(`${base}/templates/${id}?cta=0`, { waitUntil: 'domcontentloaded', timeout: 60000 })
        await page.locator('[class*="publicContainer"] > div').first().waitFor({ state: 'attached' })
        await page.evaluate(() => document.fonts.ready)
        await page.addStyleTag({ content: 'nextjs-portal { display: none !important; }' })
        await page.waitForTimeout(1200)
        if (id === 'chat') { await page.getByRole('button', { name: 'Răspunde la invitație', exact: true }).click(); await page.waitForTimeout(1500) }
        await page.screenshot({ path: `public/images/models/${id}.jpg`, type: 'jpeg', quality: 82 })
        fs.copyFileSync(`public/images/models/${id}.jpg`, `public/images/models/${id}-v${version}.jpg`)
        console.log(`Captured ${id}`)
    }
} finally { await browser.close() }
