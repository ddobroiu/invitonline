// Alerte catre mydashboard (e-mail la contact@mydashboard.ro): credite terminate la un furnizor, erori importante.
// Fara MYDASHBOARD_ALERT_TOKEN (ex. local) nu trimite nimic. Nu arunca niciodata.
const PROJECT = 'invitonline'
const CREDIT_RE = /credit balance|insufficient[_ ](credit|funds|balance|quota)|out of credits|exceeded your current quota|billing|payment required|run out of searches|spend(ing)? limit|quota|RESOURCE_EXHAUSTED/i

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function faraCredite(err: any): boolean {
    const status = err?.status ?? err?.statusCode ?? err?.response?.status ?? err?.http_code
    const text = `${err?.message ?? ''} ${err?.response?.data?.error ?? ''} ${err?.error?.message ?? ''}`
    return status === 402 || CREDIT_RE.test(text)
}

// Cel mult o alerta la 10 minute pe cheie (in proces); revenirea (resolved) trece mereu
const THROTTLE_MS = 10 * 60_000
const lastSent = new Map<string, number>()

export async function alerta(kind: 'credits' | 'error', key: string, message: unknown, resolved = false): Promise<void> {
    const token = process.env.MYDASHBOARD_ALERT_TOKEN
    if (!token) return
    if (!resolved) {
        const now = Date.now()
        if (now - (lastSent.get(key) ?? 0) < THROTTLE_MS) return
        lastSent.set(key, now)
        if (lastSent.size > 200) for (const [k, t] of lastSent) if (now - t >= THROTTLE_MS) lastSent.delete(k)
    }
    try {
        await fetch('https://mydashboard.ro/api/alert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-alert-token': token },
            body: JSON.stringify({ project: PROJECT, kind, key, message: String(message).slice(0, 900), resolved }),
            signal: AbortSignal.timeout(5000),
        })
    } catch { /* alerta nu blocheaza niciodata aplicatia */ }
}
