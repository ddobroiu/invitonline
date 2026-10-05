import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { PGlite } from '@electric-sql/pglite'
import { PGLiteSocketServer } from '@electric-sql/pglite-socket'
import { chromium } from '@playwright/test'

// A disposable database and server: no production records, emails, uploads or payments.
const port = Number(process.env.E2E_PORT || 3016)
const dbPort = Number(process.env.E2E_DB_PORT || 54330)
const base = `http://localhost:${port}`
const db = await PGlite.create()
await db.exec('CREATE SCHEMA invitonline; SET search_path TO invitonline;')
for (const migration of fs.readdirSync('prisma/migrations').sort()) {
    const file = path.join('prisma/migrations', migration, 'migration.sql')
    if (fs.existsSync(file)) await db.exec(fs.readFileSync(file, 'utf8'))
}
const socket = new PGLiteSocketServer({ db, host: '127.0.0.1', port: dbPort, maxConnections: 20 })
await socket.start()
const env = { ...process.env, INVITONLINE_E2E: '1', DATABASE_URL: `postgresql://postgres:postgres@127.0.0.1:${dbPort}/postgres?schema=invitonline&sslmode=disable`, NEXTAUTH_URL: base, NEXTAUTH_SECRET: 'local-e2e-only-do-not-use-in-production', RESEND_API_KEY: '', STRIPE_SECRET_KEY: '', STRIPE_WEBHOOK_SECRET: '', GOOGLE_CLIENT_ID: '', GOOGLE_CLIENT_SECRET: '', NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: '', CLOUDINARY_CLOUD_NAME: '', CLOUDINARY_API_KEY: '', CLOUDINARY_API_SECRET: '' }
const app = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'dev', '--port', String(port)], { env, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true })
let log = ''
app.stdout.on('data', chunk => { log = (log + chunk).slice(-12000) })
app.stderr.on('data', chunk => { log = (log + chunk).slice(-12000) })
let browser
fs.mkdirSync('test-results/site', { recursive: true })
try {
    for (let attempt = 0; attempt < 90; attempt++) {
        try { if ((await fetch(`${base}/api/auth/session`)).ok) break } catch { /* booting */ }
        if (app.exitCode !== null) throw new Error('Test server exited: '+log)
        if (attempt === 89) throw new Error('Test server did not start: '+log)
        await new Promise(resolve => setTimeout(resolve, 1000))
    }
    browser = await chromium.launch()
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
    await context.addCookies([{ name: 'cookie_consent', value: encodeURIComponent(JSON.stringify({ v: 2, analytics: false, marketing: false, ts: new Date().toISOString() })), url: base }])
    const api = context.request
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', e => errors.push(e.message))
    const eventInput = { title: 'Ana & Andrei', date: '12 Iulie 2027', eventDateISO: '2027-07-12', location: 'București', template: 'boarding', type: 'nunta', brideName: 'Ana', groomName: 'Andrei' }
    assert.equal((await api.post(`${base}/api/events`, { data: eventInput })).status(), 401)
    assert.equal((await api.post(`${base}/api/register`, { data: { name: ' ', email: 'wrong', password: '123', acceptTerms: true } })).status(), 400)
    assert.equal((await api.post(`${base}/api/register`, { data: 'null', headers: { 'Content-Type': 'application/json' } })).status(), 400)
    const signup = { name: 'Ana Test', email: 'ana-site-e2e@example.invalid', password: 'test-password-123', acceptTerms: true }
    assert.equal((await api.post(`${base}/api/register`, { data: signup })).status(), 201)
    assert.equal((await api.post(`${base}/api/register`, { data: signup })).status(), 409)
    await page.goto(`${base}/login`, { waitUntil: 'networkidle' })
    await page.locator('input[name="email"]').fill(signup.email)
    await page.locator('input[name="password"]').fill(signup.password)
    await page.getByRole('button', { name: 'Autentificare', exact: true }).click()
    await page.waitForURL('**/dashboard')
    console.log('PASS signup, authentication, malformed requests and access control')

    for (const change of [{ title: ' ' }, { date: '31 Februarie 2027', eventDateISO: '' }, { template: 'wrong' }, { type: 'wrong' }, { photoUrl: 'javascript:alert(1)' }, { partyTime: '99:00' }]) assert.equal((await api.post(`${base}/api/events`, { data: { ...eventInput, ...change } })).status(), 400)
    const saved = await api.post(`${base}/api/events`, { data: { ...eventInput, isPaid: true, userId: 'other' } })
    assert.equal(saved.status(), 201)
    const { event } = await saved.json()
    assert.equal(event.isPaid, false)
    assert.notEqual(event.userId, 'other')
    assert.equal((await api.post(`${base}/api/checkout`, { data: { eventId: event.id, consent: false } })).status(), 400)
    assert.equal((await api.post(`${base}/api/checkout`, { data: { eventId: event.id, consent: true } })).status(), 503)
    assert.equal((await api.post(`${base}/api/upload-media`, { multipart: { type: 'image' } })).status(), 400)
    assert.equal((await api.post(`${base}/api/upload-media`, { multipart: { type: 'image', file: { name: 'test.png', mimeType: 'image/png', buffer: Buffer.from('local test') } } })).status(), 503)
    assert.equal((await api.post(`${base}/api/upload-media`, { multipart: { type: 'image', file: { name: 'test.svg', mimeType: 'image/svg+xml', buffer: Buffer.from('<svg/>') } } })).status(), 400)
    assert.equal((await api.post(`${base}/api/user/billing`, { data: { cui: 'wrong' } })).status(), 400)
    assert.equal((await api.post(`${base}/api/user/billing`, { data: { address: 'Strada Test 12', cui: 'RO12345678' } })).status(), 200)
    assert.equal((await (await api.get(`${base}/api/user/billing`)).json()).address, 'Strada Test 12')
    assert.equal((await api.post(`${base}/api/password-reset`, { data: { token: 'wrong', password: {} } })).status(), 400)
    assert.equal((await api.post(`${base}/api/password-reset/request`, { data: 'null', headers: { 'Content-Type': 'application/json' } })).status(), 400)
    await page.goto(`${base}/create?id=${event.id}`, { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: 'Detalii', exact: true }).click()
    await page.locator('#f-location').fill('Cluj-Napoca')
    await page.locator('#f-eventDateISO').fill('')
    await page.locator('#f-date').fill('31 Februarie 2027')
    await page.getByRole('button', { name: 'Finalizare', exact: true }).click()
    await page.getByRole('alert').filter({ hasText: 'Verifică detaliile invitației' }).waitFor()
    assert.equal(await page.locator('#f-eventDateISO').getAttribute('aria-invalid'), 'true')
    await page.locator('#f-eventDateISO').fill('2027-07-12')
    await page.getByRole('button', { name: 'Finalizare', exact: true }).click()
    await page.getByRole('button', { name: /Salvează ca draft/ }).click()
    await page.waitForURL('**/dashboard')
    assert.equal((await (await api.get(`${base}/api/events?id=${event.id}`)).json()).event.location, 'Cluj-Napoca')
    console.log('PASS editor validation, saving, protected fields and unavailable service states')

    const publicContext = await browser.newContext({ viewport: { width: 390, height: 844 } })
    const publicApi = publicContext.request
    await publicContext.addCookies([{ name: 'cookie_consent', value: encodeURIComponent(JSON.stringify({ v: 2, analytics: false, marketing: false, ts: new Date().toISOString() })), url: base }])
    const guest = { eventId: event.id, name: 'Maria Test', contact: 'maria@example.invalid', persons: 2, status: 'confirmed' }
    assert.equal((await publicApi.post(`${base}/api/guests`, { data: guest })).status(), 403)
    assert.equal((await publicApi.get(`${base}/api/guests?eventId=${event.id}`)).status(), 401)
    // PGlite has one database session: isolate transaction tests from the dashboard's background requests.
    const paymentDb = await PGlite.create()
    await paymentDb.exec('CREATE SCHEMA invitonline; SET search_path TO invitonline;')
    for (const migration of fs.readdirSync('prisma/migrations').sort()) {
        const file = path.join('prisma/migrations', migration, 'migration.sql')
        if (fs.existsSync(file)) await paymentDb.exec(fs.readFileSync(file, 'utf8'))
    }
    await paymentDb.query('INSERT INTO invitonline."User" (id,email,"updatedAt") VALUES ($1,$2,now())', [event.userId, signup.email])
    await paymentDb.query('INSERT INTO invitonline."Event" (id,"userId",type,template,title,date,location,data,"updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,now())', [event.id, event.userId, event.type, event.template, event.title, event.date, event.location, event.data])
    const paymentSocket = new PGLiteSocketServer({ db: paymentDb, host: '127.0.0.1', port: dbPort + 1 })
    await paymentSocket.start()
    try {
        await new Promise((resolve, reject) => {
            const check = spawn(process.execPath, ['--import', 'tsx', 'scripts/check-fulfillment.ts', event.id], { env: { ...env, DATABASE_URL: env.DATABASE_URL.replace(`:${dbPort}/`, `:${dbPort + 1}/`), OBLIO_CLIENT_SECRET: '', TIKTOK_ACCESS_TOKEN: '', EMAIL_DEV_LOG: '' }, stdio: 'inherit', windowsHide: true })
            check.on('error', reject)
            check.on('close', code => code === 0 ? resolve() : reject(new Error(`Payment check failed (${code})`)))
        })
    } finally { await paymentSocket.stop(); await paymentDb.close() }
    await db.query('UPDATE invitonline."Event" SET "isPaid"=true, "publishedAt"=now() WHERE id=$1', [event.id])
    for (const change of [{ contact: 'x' }, { persons: 1.5 }, { name: ' ' }, { status: 'pending' }]) assert.equal((await publicApi.post(`${base}/api/guests`, { data: { ...guest, ...change } })).status(), 400)
    const publicPage = await publicContext.newPage()
    await publicPage.goto(`${base}/invitatie/${event.id}`, { waitUntil: 'networkidle' })
    await publicPage.getByRole('button', { name: /confirm.*prezen/i }).first().click()
    const dialog = publicPage.getByRole('dialog')
    await dialog.getByLabel('Nume complet').fill(guest.name)
    await dialog.getByLabel('Email sau telefon').fill('invalid')
    await dialog.getByRole('button', { name: 'Trimite răspunsul' }).click()
    await dialog.getByRole('alert').waitFor()
    await dialog.getByLabel('Email sau telefon').fill(guest.contact)
    await dialog.getByLabel('Număr persoane').selectOption('2')
    await dialog.getByRole('button', { name: 'Trimite răspunsul' }).click()
    await dialog.getByRole('heading', { name: /Mulțumim/ }).waitFor()
    const list = (await (await api.get(`${base}/api/guests?eventId=${event.id}`)).json()).guests
    assert.equal(list.length, 1)
    assert.equal(list[0].persons, 2)
    assert.ok(list[0].respondedAt)
    assert.equal((await api.patch(`${base}/api/guests`, { data: { id: list[0].id, status: 'declined' } })).status(), 200)
    const reconfirmed = await (await api.patch(`${base}/api/guests`, { data: { id: list[0].id, status: 'confirmed' } })).json()
    assert.equal(reconfirmed.guest.persons, 1)
    console.log('PASS activation visibility, RSVP validation, database persistence and guest status changes')

    await page.goto(`${base}/dashboard`, { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: 'Lista invitați', exact: true }).click()
    await page.getByText('Maria Test', { exact: true }).waitFor()
    const downloadWait = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Export CSV' }).click()
    const download = await downloadWait
    await download.saveAs('test-results/site/guests.csv')
    assert.ok(fs.readFileSync('test-results/site/guests.csv', 'utf8').includes('Maria Test'))
    await page.screenshot({ path: 'test-results/site/dashboard-desktop.png' })
    await page.setViewportSize({ width: 390, height: 844 })
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
    await page.screenshot({ path: 'test-results/site/dashboard-mobile.png' })
    console.log('PASS dashboard guest list and CSV export')

    for (const url of ['/', '/demo', '/login', '/login?tab=register', '/resetare-parola', '/blog', '/blog/invitatii-digitale-vs-traditionale', '/contact', '/termeni-si-conditii', '/politica-de-confidentialitate', '/politica-cookies', '/checkout/success', '/dezabonare', '/pagina-inexistenta']) {
        await publicPage.goto(base+url, { waitUntil: 'networkidle' })
        for (const width of [390, 1440]) {
            await publicPage.setViewportSize({ width, height: 900 })
            assert.ok(await publicPage.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${url} overflows at ${width}`)
            await publicPage.screenshot({ path: `test-results/site/${url.replace(/[^a-z0-9]/gi, '-') || 'home'}-${width}.png` })
        }
    }
    assert.equal(errors.length, 0, errors.join('\n'))
    console.log('PASS public pages on phone and desktop; no browser errors')
} catch (error) {
    console.error(log.slice(-4000))
    throw error
} finally {
    await browser?.close()
    if (process.platform === 'win32') await new Promise(resolve => { const stop = spawn('taskkill', ['/pid', String(app.pid), '/t', '/f'], { windowsHide: true, stdio: 'ignore' }); stop.on('close', resolve) })
    else app.kill('SIGTERM')
    await socket.stop()
    await db.close()
}
