// Consimtamantul pentru cookies, pastrat intr-un cookie first-party (citibil si pe server, ex. la checkout).
// Valoare: JSON { v: versiune, analytics, marketing, ts }.

export const CONSENT_COOKIE = 'cookie_consent'
// v2: categoria Marketing (TikTok Pixel) — toata lumea este intrebata din nou
export const CONSENT_VERSION = 2
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 180 // 6 luni, apoi intrebam din nou
export const OPEN_CONSENT_EVENT = 'open-cookie-settings'
// Emis pe window dupa fiecare alegere salvata; detail = ConsentState (analytics + marketing)
export const CONSENT_CHANGE_EVENT = 'cookie-consent-change'

export type ConsentState = {
    v: number
    analytics: boolean
    marketing: boolean
    ts: string
}

export function parseConsent(raw: string | undefined | null): ConsentState | null {
    if (!raw) return null
    try {
        const data = JSON.parse(decodeURIComponent(raw))
        if (!data || data.v !== CONSENT_VERSION) return null
        return {
            v: data.v,
            analytics: data.analytics === true,
            marketing: data.marketing === true,
            ts: String(data.ts || ''),
        }
    } catch {
        return null
    }
}

// Valoarea unui cookie dintr-un header Cookie (server) sau din document.cookie (browser)
export function getCookieValue(cookieHeader: string | null | undefined, name: string): string | undefined {
    if (!cookieHeader) return undefined
    for (const part of cookieHeader.split(';')) {
        const idx = part.indexOf('=')
        if (idx === -1) continue
        if (part.slice(0, idx).trim() === name) return part.slice(idx + 1).trim()
    }
    return undefined
}

export function hasAnalyticsConsent(cookieHeader: string | null | undefined): boolean {
    return parseConsent(getCookieValue(cookieHeader, CONSENT_COOKIE))?.analytics === true
}

export function hasMarketingConsent(cookieHeader: string | null | undefined): boolean {
    return parseConsent(getCookieValue(cookieHeader, CONSENT_COOKIE))?.marketing === true
}

export function notifyConsentChange(state: ConsentState) {
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent<ConsentState>(CONSENT_CHANGE_EVENT, { detail: state }))
}

export function openCookieSettings() {
    if (typeof window !== 'undefined') window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))
}
