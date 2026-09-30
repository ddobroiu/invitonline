/**
 * Layout audit of every invitation template: renders /templates/<id>?cta=0 (the exact public view, with
 * example data) at several widths and edge cases, saves screenshots and a JSON report with the problems
 * found automatically (horizontal overflow, elements outside the viewport, small tap targets, broken
 * images, console errors, missing text).
 *
 *   node scripts/audit-templates.mjs <outDir> [baseUrl=http://localhost:3000] [templateIds,comma,separated]
 *
 * Needs a running app (npm run dev or npm start). One browser, one page at a time (light on the machine).
 */
import { chromium } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

const outDir = process.argv[2]
const base = (process.argv[3] || 'http://localhost:3000').replace(/\/$/, '')
const only = process.argv[4] ? process.argv[4].split(',') : null
if (!outDir) {
    console.error('usage: node scripts/audit-templates.mjs <outDir> [baseUrl] [ids]')
    process.exit(1)
}
fs.mkdirSync(outDir, { recursive: true })

const src = fs.readFileSync(new URL('../src/config/templates.ts', import.meta.url), 'utf8')
const all = [...src.matchAll(/\{ id: '([^']+)', name: '([^']+)'[^\n]*suits: \[([^\]]*)\]/g)].map((m) => ({
    id: m[1],
    name: m[2],
    suits: m[3].split(',').map((s) => s.trim().replace(/'/g, '')).filter(Boolean),
}))
const templates = only ? all.filter((t) => only.includes(t.id)) : all

const WIDTHS = [360, 390, 414, 768, 1024, 1440]
const HEIGHT = { 360: 740, 390: 844, 414: 896, 768: 1024, 1024: 768, 1440: 900 }
const EDGE_CASES = ['lung', 'fara-foto', 'multe', 'minim']
const MAX_SHOT_HEIGHT = 5000

// Buttons that open or reveal the invitation (templates with an intro)
const INTERACT = [
    /deschide|atinge|apasă|click|răzuiește|dezvăluie|vezi invitația|întoarce|arată tot|sari/i,
]

async function measure(page) {
    return page.evaluate(() => {
        const vw = document.documentElement.clientWidth
        const doc = document.scrollingElement || document.documentElement
        const issues = []
        if (doc.scrollWidth > vw + 1) issues.push(`page scrolls horizontally: scrollWidth ${doc.scrollWidth} > ${vw}`)
        const describe = (el) => {
            const cls = typeof el.className === 'string' ? el.className.split(' ')[0].replace(/_[a-zA-Z0-9-]{5,}$/, '').replace(/^.*?_+/, '') : ''
            const text = (el.textContent || '').trim().slice(0, 40)
            return `${el.tagName.toLowerCase()}${cls ? '.' + cls : ''}${text ? ` "${text}"` : ''}`
        }
        // Is the element clipped away by an ancestor with overflow hidden/clip (then it's not a real overflow)?
        const clippedByAncestor = (el, rect) => {
            let p = el.parentElement
            while (p && p !== document.body) {
                const cs = getComputedStyle(p)
                if (/(hidden|clip|auto|scroll)/.test(cs.overflowX)) {
                    const pr = p.getBoundingClientRect()
                    if (pr.right <= vw + 1 && pr.left >= -1) return true
                    if (rect.right > pr.right || rect.left < pr.left) return true
                }
                p = p.parentElement
            }
            return false
        }
        const outside = []
        const clipped = []
        const smallTargets = []
        for (const el of document.querySelectorAll('body *')) {
            const cs = getComputedStyle(el)
            if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) continue
            const r = el.getBoundingClientRect()
            if (r.width === 0 || r.height === 0) continue
            if ((r.right > vw + 2 || r.left < -2) && !clippedByAncestor(el, r) && cs.position !== 'fixed') {
                outside.push(`${describe(el)} [${Math.round(r.left)}..${Math.round(r.right)}]`)
            }
            // text that is cut: single-line element whose content is wider than the box and overflow hidden/ellipsis
            if (el.children.length === 0 && (el.textContent || '').trim() && el.scrollWidth > el.clientWidth + 2 && /(hidden|clip)/.test(cs.overflowX)) {
                clipped.push(describe(el))
            }
            if ((el.tagName === 'BUTTON' || el.tagName === 'A' || el.getAttribute('role') === 'button') && (r.height < 32 || r.width < 32) && r.top < doc.scrollHeight) {
                smallTargets.push(`${describe(el)} ${Math.round(r.width)}x${Math.round(r.height)}`)
            }
        }
        const brokenImages = [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.src).map((i) => i.src.slice(0, 80))
        const undefinedText = /\bundefined\b|\bnull\b|NaN/.test(document.body.innerText) ? ['text contains undefined/null/NaN'] : []
        return {
            issues: [...issues, ...undefinedText],
            outside: outside.slice(0, 8),
            outsideCount: outside.length,
            clipped: clipped.slice(0, 8),
            smallTargets: [...new Set(smallTargets)].slice(0, 8),
            brokenImages,
            height: doc.scrollHeight,
        }
    })
}

const browser = await chromium.launch()
const report = []
try {
    for (const tpl of templates) {
        const runs = [
            ...WIDTHS.map((w) => ({ w, caz: 'standard', tip: tpl.suits[0] })),
            ...EDGE_CASES.flatMap((caz) => [360, 1440].map((w) => ({ w, caz, tip: tpl.suits[0] }))),
            ...['nunta', 'botez', 'aniversare', 'petrecere', 'corporate'].filter((t) => t !== tpl.suits[0]).map((tip) => ({ w: 390, caz: 'standard', tip })),
        ]
        for (const run of runs) {
            const context = await browser.newContext({
                viewport: { width: run.w, height: HEIGHT[run.w] || 800 },
                deviceScaleFactor: 1,
                isMobile: run.w < 768,
                hasTouch: run.w < 1024,
                reducedMotion: 'no-preference',
            })
            // no cookie banner in screenshots
            await context.addCookies([{ name: 'cookie_consent', value: encodeURIComponent(JSON.stringify({ v: 2, analytics: false, marketing: false, ts: new Date().toISOString() })), url: base }])
            const page = await context.newPage()
            const errors = []
            page.on('pageerror', (e) => errors.push(String(e.message).slice(0, 160)))
            page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)) })
            const url = `${base}/templates/${tpl.id}?cta=0&tip=${run.tip}&caz=${run.caz}`
            const name = `${tpl.id}__${run.tip}__${run.caz}__${run.w}`
            const entry = { template: tpl.id, ...run, url }
            try {
                await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 })
                await page.waitForTimeout(1800)
                const m = await measure(page)
                Object.assign(entry, m)
                await page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage: m.height <= MAX_SHOT_HEIGHT, clip: m.height > MAX_SHOT_HEIGHT ? { x: 0, y: 0, width: run.w, height: MAX_SHOT_HEIGHT } : undefined })
                // Interacted state + RSVP form, once per template at a phone and a desktop width
                if (run.caz === 'standard' && (run.w === 390 || run.w === 1440) && run.tip === tpl.suits[0]) {
                    const opener = page.getByRole('button', { name: INTERACT[0] }).first()
                    if (await opener.count() && await opener.isVisible().catch(() => false)) {
                        await opener.click({ timeout: 3000 }).catch(() => {})
                        await page.waitForTimeout(2200)
                        const m2 = await measure(page)
                        entry.afterInteract = m2
                        await page.screenshot({ path: path.join(outDir, `${name}__deschis.png`), fullPage: m2.height <= MAX_SHOT_HEIGHT })
                    }
                    const rsvp = page.getByRole('button', { name: /confirm|rsvp|check-in|particip/i }).first()
                    if (await rsvp.count()) {
                        await rsvp.scrollIntoViewIfNeeded().catch(() => {})
                        await rsvp.click({ timeout: 3000, force: true }).catch(() => {})
                        await page.waitForTimeout(700)
                        const dialog = page.getByRole('dialog')
                        entry.rsvpOpens = await dialog.count() > 0
                        await page.screenshot({ path: path.join(outDir, `${name}__rsvp.png`) })
                    } else {
                        entry.rsvpOpens = false
                    }
                }
            } catch (e) {
                entry.error = String(e.message || e).slice(0, 200)
            }
            entry.consoleErrors = [...new Set(errors)].slice(0, 5)
            report.push(entry)
            const flag = (entry.issues?.length || entry.outsideCount || entry.error || entry.consoleErrors.length) ? '!' : '.'
            process.stdout.write(flag)
            await context.close()
        }
        process.stdout.write(` ${tpl.id}\n`)
    }
} finally {
    await browser.close()
    fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2))
}

// Short summary per template
const byTpl = {}
for (const e of report) {
    const t = (byTpl[e.template] ||= { shots: 0, overflow: 0, outside: 0, errors: 0, smallTargets: new Set(), clipped: new Set(), noRsvp: false })
    t.shots++
    if (e.issues?.some((i) => i.startsWith('page scrolls'))) t.overflow++
    if (e.outsideCount) t.outside++
    if (e.error || e.consoleErrors?.length) t.errors++
    e.smallTargets?.forEach((s) => t.smallTargets.add(s.replace(/ \d+x\d+$/, '')))
    e.clipped?.forEach((s) => t.clipped.add(s))
    if (e.rsvpOpens === false) t.noRsvp = true
}
const lines = Object.entries(byTpl).map(([id, t]) => `${id}: ${t.shots} shots, h-overflow ${t.overflow}, outside-viewport ${t.outside}, errors ${t.errors}, rsvp ${t.noRsvp ? 'NOT FOUND' : 'ok'}, small targets ${t.smallTargets.size}, clipped ${t.clipped.size}`)
fs.writeFileSync(path.join(outDir, 'summary.txt'), lines.join('\n') + '\n')
console.log(lines.join('\n'))
