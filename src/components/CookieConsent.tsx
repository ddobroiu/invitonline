'use client'

import Link from 'next/link'
import { useCallback, useEffect, useId, useState } from 'react'
import {
    CONSENT_COOKIE,
    CONSENT_MAX_AGE,
    CONSENT_VERSION,
    OPEN_CONSENT_EVENT,
    getCookieValue,
    notifyConsentChange,
    parseConsent,
    type ConsentState,
} from '@/lib/consent'
import { LEGAL_LINKS } from '@/config/legal'

// mydashboard.ro (analiza traficului, operat de aceeasi societate) — se incarca doar cu acord pentru cookies analitice
const TRACKER_SRC = 'https://mydashboard.ro/t.js'
const TRACKER_SITE = 'b6a9d9d1b5b7a1da'
const TRACKER_KEYS = ['_md_vid', '_md_sid', '_md_last']

type TrackerWindow = Window & {
    mdConsent?: boolean
    mdTrack?: { consent?: (ok: boolean) => void }
}

function loadTracker() {
    const w = window as TrackerWindow
    w.mdConsent = true
    if (document.querySelector(`script[src="${TRACKER_SRC}"]`)) {
        w.mdTrack?.consent?.(true)
        return
    }
    const s = document.createElement('script')
    s.src = TRACKER_SRC
    s.defer = true
    s.setAttribute('data-site', TRACKER_SITE)
    s.setAttribute('data-consent', 'required')
    document.head.appendChild(s)
}

// Opreste tracker-ul si sterge identificatorii pe care i-a salvat
function removeTracker(): boolean {
    const w = window as TrackerWindow
    w.mdConsent = false
    w.mdTrack?.consent?.(false)
    for (const k of TRACKER_KEYS) {
        try { localStorage.removeItem(k) } catch { /* storage blocat */ }
    }
    const secure = location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `_md_vid=; path=/; max-age=0; SameSite=Lax${secure}`
    return Boolean(document.querySelector(`script[src="${TRACKER_SRC}"]`))
}

// Google Analytics 4 (proprietatea InvitOnline.ro) — tot doar cu acord pentru cookies analitice
const GA_ID = 'G-RZWJHYS1WB'

type GaWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void } & Record<string, unknown>

// Semnalele Google Consent Mode v2 pentru alegerea curenta (ads raman denied fara acord de marketing)
function consentSignals(analytics: boolean, marketing: boolean): Record<string, string> {
    const ads = marketing ? 'granted' : 'denied'
    return { analytics_storage: analytics ? 'granted' : 'denied', ad_storage: ads, ad_user_data: ads, ad_personalization: ads }
}

function loadGA(marketing: boolean) {
    const w = window as unknown as GaWindow
    w[`ga-disable-${GA_ID}`] = false
    w.dataLayer = w.dataLayer || []
    if (!w.gtag) {
        w.gtag = function gtag() {
            // gtag.js cere obiectul `arguments`, nu un array
            // eslint-disable-next-line prefer-rest-params
            w.dataLayer!.push(arguments)
        }
        // Consent Mode v2: implicit totul denied, inainte de config
        w.gtag('consent', 'default', consentSignals(false, false))
    }
    w.gtag('consent', 'update', consentSignals(true, marketing))
    if (document.querySelector(`script[src^="https://www.googletagmanager.com/gtag/js"]`)) return
    w.gtag('js', new Date())
    w.gtag('config', GA_ID, { anonymize_ip: true })
    const s = document.createElement('script')
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
    s.async = true
    document.head.appendChild(s)
}

// Opreste GA si sterge cookie-urile _ga*; intoarce true daca scriptul era incarcat
function removeGA(): boolean {
    const w = window as unknown as GaWindow
    w.gtag?.('consent', 'update', consentSignals(false, false))
    w[`ga-disable-${GA_ID}`] = true
    const host = location.hostname.replace(/^www\./, '')
    for (const c of document.cookie.split(';')) {
        const name = c.split('=')[0].trim()
        if (name.startsWith('_ga')) {
            document.cookie = `${name}=; path=/; max-age=0`
            document.cookie = `${name}=; path=/; domain=.${host}; max-age=0`
        }
    }
    return Boolean(document.querySelector(`script[src^="https://www.googletagmanager.com/gtag/js"]`))
}

function saveConsent(analytics: boolean, marketing: boolean): ConsentState {
    const state: ConsentState = { v: CONSENT_VERSION, analytics, marketing, ts: new Date().toISOString() }
    const secure = location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(state))}; path=/; max-age=${CONSENT_MAX_AGE}; SameSite=Lax${secure}`
    return state
}

export default function CookieConsent() {
    const [open, setOpen] = useState(false)
    const [showDetails, setShowDetails] = useState(false)
    const [analytics, setAnalytics] = useState(false)
    const [marketing, setMarketing] = useState(false)
    const uid = useId()

    const apply = useCallback((state: ConsentState) => {
        if (state.analytics) {
            loadTracker()
            loadGA(state.marketing)
        } else if ([removeTracker(), removeGA()].some(Boolean)) {
            // Scriptul era deja incarcat: o reincarcare garanteaza ca nu mai trimite nimic
            window.location.reload()
        }
    }, [])

    useEffect(() => {
        const current = parseConsent(getCookieValue(document.cookie, CONSENT_COOKIE))
        const timer = window.setTimeout(() => {
            if (current) {
                setAnalytics(current.analytics)
                setMarketing(current.marketing)
                if (current.analytics) { loadTracker(); loadGA(current.marketing) }
                else { removeTracker(); removeGA() }
            } else {
                setOpen(true)
            }
        }, 0)

        const reopen = () => {
            const saved = parseConsent(getCookieValue(document.cookie, CONSENT_COOKIE))
            setAnalytics(saved?.analytics ?? false)
            setMarketing(saved?.marketing ?? false)
            setShowDetails(true)
            setOpen(true)
        }
        window.addEventListener(OPEN_CONSENT_EVENT, reopen)
        return () => {
            window.clearTimeout(timer)
            window.removeEventListener(OPEN_CONSENT_EVENT, reopen)
        }
    }, [])

    const decide = (a: boolean, m: boolean) => {
        setAnalytics(a)
        setMarketing(m)
        setOpen(false)
        setShowDetails(false)
        const state = saveConsent(a, m)
        notifyConsentChange(state)
        apply(state)
    }

    if (!open) return null

    return (
        <div role="dialog" aria-modal="false" aria-labelledby={`${uid}-title`} aria-describedby={`${uid}-desc`} style={wrapStyle}>
            <div style={boxStyle}>
                <h2 id={`${uid}-title`} style={titleStyle}>Folosim cookies</h2>
                <p id={`${uid}-desc`} style={textStyle}>
                    Folosim cookies strict necesare pentru funcționarea site-ului (autentificare, securitate, salvarea opțiunii tale).
                    Cu acordul tău, folosim și cookies analitice pentru a înțelege cum este folosit site-ul și cookies de marketing pentru măsurarea reclamelor. Poți schimba oricând
                    alegerea din „Setări cookies” (în subsolul paginii). Detalii în{' '}
                    <Link href={LEGAL_LINKS.cookies} style={linkStyle}>Politica de cookies</Link> și{' '}
                    <Link href={LEGAL_LINKS.privacy} style={linkStyle}>Politica de confidențialitate</Link>.
                </p>

                {showDetails && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '12px 0' }}>
                        <label style={rowStyle}>
                            <input type="checkbox" checked disabled />
                            <span><strong>Strict necesare</strong> — mereu active (sesiune, securitate, preferința privind cookies).</span>
                        </label>
                        <label style={rowStyle}>
                            <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} />
                            <span><strong>Analitice</strong> — statistici de trafic (mydashboard.ro, operat de noi, și Google Analytics 4).</span>
                        </label>
                        <label style={rowStyle}>
                            <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
                            <span><strong>Marketing / reclame</strong> — ne permite să măsurăm eficiența reclamelor (ex. TikTok) și să vă arătăm reclame relevante.</span>
                        </label>
                    </div>
                )}

                <div style={btnRowStyle}>
                    <button type="button" style={btnPrimary} onClick={() => decide(false, false)}>Refuză</button>
                    {showDetails ? (
                        <button type="button" style={btnSecondary} onClick={() => decide(analytics, marketing)}>Salvează alegerea</button>
                    ) : (
                        <button type="button" style={btnSecondary} onClick={() => setShowDetails(true)}>Setări</button>
                    )}
                    <button type="button" style={btnPrimary} onClick={() => decide(true, true)}>Accept toate</button>
                </div>
            </div>
        </div>
    )
}

const wrapStyle: React.CSSProperties = {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10000,
    padding: '12px',
    display: 'flex',
    justifyContent: 'center',
    pointerEvents: 'none',
}

const boxStyle: React.CSSProperties = {
    pointerEvents: 'auto',
    width: '100%',
    maxWidth: '720px',
    maxHeight: '85vh',
    overflowY: 'auto',
    background: '#fffdf9',
    color: '#243c33',
    border: '1px solid rgba(212, 175, 55, 0.35)',
    borderRadius: '16px',
    padding: '18px 18px 14px',
    boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
    fontFamily: 'var(--font-body), system-ui, sans-serif',
    fontSize: '0.9rem',
    lineHeight: 1.5,
}

const titleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading), Georgia, serif',
    fontSize: '1.15rem',
    color: '#243c33',
    marginBottom: '6px',
}

const textStyle: React.CSSProperties = { color: '#637364' }

const linkStyle: React.CSSProperties = { color: '#48644f', textDecoration: 'underline' }

const rowStyle: React.CSSProperties = { display: 'flex', gap: '10px', alignItems: 'flex-start', cursor: 'pointer' }

const btnRowStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    justifyContent: 'flex-end',
    marginTop: '12px',
}

const btnBase: React.CSSProperties = {
    padding: '10px 16px',
    borderRadius: '10px',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
    flex: '1 1 auto',
    minWidth: '120px',
}

const btnSecondary: React.CSSProperties = {
    ...btnBase,
    background: 'transparent',
    color: '#243c33',
    border: '1px solid #444',
}

const btnPrimary: React.CSSProperties = {
    ...btnBase,
    background: '#243c33',
    color: '#fff',
    border: '1px solid var(--accent)',
}
