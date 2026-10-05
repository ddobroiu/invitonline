import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { chromium } from '@playwright/test'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const base = process.argv[2] || 'http://localhost:3015'
const databaseUrl = new URL(process.env.DATABASE_URL)
assert.ok(['127.0.0.1', 'localhost'].includes(databaseUrl.hostname) && databaseUrl.port === '54329', 'This check only uses the bundled local database')
assert.ok(['127.0.0.1', 'localhost'].includes(new URL(base).hostname), 'This check only targets localhost')
const schema = databaseUrl.searchParams.get('schema') || 'public'
const table = `"${schema.replaceAll('"', '""')}"."User"`
const pool = new Pool({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 5000, query_timeout: 10000 })
const id = randomUUID()
const email = `login-check-${id}@example.invalid`
const password = randomUUID()
let browser
try {
    // Direct fixture creation avoids sending any welcome email through configured providers.
    await pool.query(`INSERT INTO ${table} (id,email,password,name,"updatedAt") VALUES ($1,$2,$3,$4,NOW())`, [id, email, await bcrypt.hash(password, 10), 'Login check'])
    browser = await chromium.launch()
    const context = await browser.newContext()
    await context.addCookies([{ name: 'cookie_consent', value: encodeURIComponent(JSON.stringify({ v: 2, analytics: false, marketing: false, ts: new Date().toISOString() })), url: base }])
    const page = await context.newPage()
    await page.goto(`${base}/login`, { waitUntil: 'networkidle' })
    await page.locator('#email').fill(email)
    await page.locator('#password').fill('incorrect-password')
    await page.getByRole('button', { name: 'Autentificare', exact: true }).click()
    await page.getByText(/Email sau parolă incorectă/).waitFor()
    assert.equal((await context.request.post(`${base}/api/register`, { data: { email, password, name: 'Login check', acceptTerms: true } })).status(), 409)
    await page.locator('#password').fill(password)
    await page.getByRole('button', { name: 'Autentificare', exact: true }).click()
    await page.waitForURL(`${base}/dashboard`)
    const session = await (await context.request.get(`${base}/api/auth/session`)).json()
    assert.equal(session.user.id, id)
    await page.reload({ waitUntil: 'networkidle' })
    const persisted = await (await context.request.get(`${base}/api/auth/session`)).json()
    assert.equal(persisted.user.id, id)
    const { csrfToken } = await (await context.request.get(`${base}/api/auth/csrf`)).json()
    const signedOut = await context.request.post(`${base}/api/auth/signout`, { form: { csrfToken, callbackUrl: `${base}/login`, json: 'true' } })
    assert.equal(signedOut.status(), 200)
    assert.deepEqual(await (await context.request.get(`${base}/api/auth/session`)).json(), {})
    console.log('PASS local login, incorrect password, duplicate account, dashboard, persisted session and logout')
} finally {
    await browser?.close()
    await pool.query(`DELETE FROM ${table} WHERE id = $1 AND email = $2`, [id, email])
    await pool.end()
}
