// No real credentials, account creation, emails or sessions are used by this probe.
const origins = process.argv.slice(2)
for (const base of origins.length ? origins : ['http://localhost:3015', 'https://invitonline.ro', 'https://www.invitonline.ro']) {
    try {
        const providers = await fetch(`${base}/api/auth/providers`, { signal: AbortSignal.timeout(15000) })
        const providerData = await providers.json().catch(() => ({}))
        const csrf = await fetch(`${base}/api/auth/csrf`, { signal: AbortSignal.timeout(15000) })
        const { csrfToken } = await csrf.json()
        const cookies = csrf.headers.getSetCookie().map(cookie => cookie.split(';')[0]).join('; ')
        const login = await fetch(`${base}/api/auth/callback/credentials`, {
            method: 'POST', redirect: 'manual', signal: AbortSignal.timeout(20000),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', Cookie: cookies },
            body: new URLSearchParams({ csrfToken, email: 'auth-diagnostic@example.invalid', password: 'intentionally-invalid', json: 'true', callbackUrl: `${base}/dashboard` }),
        })
        const result = await login.json().catch(() => ({}))
        let errorCode
        try { errorCode = new URL(result.url, base).searchParams.get('error') } catch { /* Non-JSON server failure */ }
        console.log(JSON.stringify({ base, providersStatus: providers.status, credentialsAvailable: Boolean(providerData.credentials), csrfStatus: csrf.status, loginStatus: login.status, errorCode }))
    } catch (error) { console.log(JSON.stringify({ base, failure: error.message, code: error.cause?.code })) }
}
