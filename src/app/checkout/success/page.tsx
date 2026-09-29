'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import styles from './page.module.css'
import { CONSENT_CHANGE_EVENT, hasAnalyticsConsent } from '@/lib/consent'
import { trackTikTok } from '@/lib/tiktok'

// GA4 purchase event: only with analytics consent (gtag exists only after the cookie
// banner loaded GA), once per Stripe session, no personal data
function trackPurchase(sessionId: string, value: number, currency: string) {
    const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag
    if (typeof gtag !== 'function' || !hasAnalyticsConsent(document.cookie)) return
    const key = `ga_purchase_${sessionId}`
    try {
        if (localStorage.getItem(key)) return
        localStorage.setItem(key, '1')
    } catch { /* storage blocat: trimitem o data pentru afisarea curenta */ }
    gtag('event', 'purchase', {
        transaction_id: sessionId,
        value,
        currency,
        items: [{ item_id: 'invitatie_premium', item_name: 'Invitație premium', quantity: 1 }],
    })
}

// TikTok CompletePayment: only with marketing consent, once per Stripe session, no personal data.
// If consent is given later on this page (banner), it fires then. event_id = Stripe session id, the same
// id the server-side Events API uses after the payment (lib/fulfill.ts), so TikTok deduplicates them.
function trackTikTokPurchase(sessionId: string, value: number, currency: string): () => void {
    const key = `tt_purchase_${sessionId}`
    const fire = (): boolean => {
        try { if (localStorage.getItem(key)) return true } catch { /* storage blocat */ }
        const sent = trackTikTok('CompletePayment', {
            value,
            currency,
            content_type: 'product',
            contents: [{ content_id: 'invitatie_premium', content_name: 'Invitație premium', quantity: 1, price: value }],
            order_id: sessionId,
            event_id: sessionId,
        }, { event_id: sessionId })
        if (sent) {
            try { localStorage.setItem(key, '1') } catch { /* storage blocat */ }
        }
        return sent
    }
    if (fire()) return () => {}
    const onChange = () => { if (fire()) window.removeEventListener(CONSENT_CHANGE_EVENT, onChange) }
    window.addEventListener(CONSENT_CHANGE_EVENT, onChange)
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onChange)
}

const MAX_ATTEMPTS = 10

type State = 'loading' | 'done' | 'pending' | 'missing' | 'invalid' | 'unavailable' | 'auth'

const MESSAGES: Record<Exclude<State, 'loading' | 'done'>, { icon: string, title: string, text: string }> = {
    pending: {
        icon: '⏳',
        title: 'Verificăm plata',
        text: 'Nu am putut confirma încă plata. Dacă ai fost debitat, invitația se va activa automat în câteva minute — o găsești în contul tău.',
    },
    missing: {
        icon: '🔎',
        title: 'Nicio plată de verificat',
        text: 'Pagina aceasta se deschide automat după o plată. Poți activa o invitație din contul tău.',
    },
    invalid: {
        icon: '⚠️',
        title: 'Sesiune de plată invalidă',
        text: 'Nu am găsit această plată. Verifică statusul invitației în contul tău sau încearcă din nou activarea.',
    },
    unavailable: {
        icon: '⚠️',
        title: 'Plățile nu sunt disponibile',
        text: 'Momentan nu putem verifica plățile. Invitația rămâne salvată în contul tău — încearcă din nou mai târziu.',
    },
    auth: {
        icon: '🔒',
        title: 'Autentifică-te',
        text: 'Intră în contul cu care ai făcut plata ca să vezi invitația activată.',
    },
}

function SuccessContent() {
    const searchParams = useSearchParams()
    const sessionId = searchParams.get('session_id')
    const [invitationUrl, setInvitationUrl] = useState('')
    const [state, setState] = useState<State>(sessionId ? 'loading' : 'missing')
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (!sessionId) return
        let attempts = 0
        let timer: ReturnType<typeof setTimeout>
        let cancelled = false
        let stopTikTok: (() => void) | undefined

        const verifyPayment = async () => {
            attempts++
            try {
                const res = await fetch(`/api/checkout?session_id=${encodeURIComponent(sessionId)}`)
                // Non-retryable answers: stop polling and explain
                if (res.status === 401) { if (!cancelled) setState('auth'); return }
                if (res.status === 503) { if (!cancelled) setState('unavailable'); return }
                if (res.status === 400 || res.status === 403 || res.status === 404) { if (!cancelled) setState('invalid'); return }
                if (res.ok) {
                    const data = await res.json()
                    if (data.paid && data.eventId) {
                        if (cancelled) return
                        if (typeof data.amount === 'number' && data.amount > 0) {
                            trackPurchase(sessionId, data.amount, String(data.currency || 'EUR'))
                            stopTikTok = trackTikTokPurchase(sessionId, data.amount, String(data.currency || 'EUR'))
                        }
                        setInvitationUrl(`${window.location.origin}/invitatie/${data.eventId}`)
                        setState('done')
                        return
                    }
                }
            } catch (err) {
                console.error(err)
            }
            if (cancelled) return
            if (attempts < MAX_ATTEMPTS) timer = setTimeout(verifyPayment, 2000)
            else setState('pending')
        }

        verifyPayment()
        return () => {
            cancelled = true
            clearTimeout(timer)
            stopTikTok?.()
        }
    }, [sessionId])

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(invitationUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch { /* clipboard blocked: the link stays visible to copy manually */ }
    }

    const info = state === 'loading' || state === 'done' ? null : MESSAGES[state]

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`Ești invitat! Deschide invitația aici: ${invitationUrl}`)}`

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.icon}>{info ? info.icon : state === 'loading' ? '⏳' : '✅'}</div>
                <h1 className={styles.title}>{info ? info.title : state === 'loading' ? 'Verificăm plata' : 'Plată reușită!'}</h1>

                {state === 'loading' && (
                    <>
                        <p className={styles.text}>Îți activăm invitația...</p>
                        <div className={styles.loader}>Se generează link-ul unic...</div>
                    </>
                )}

                {info && <p className={styles.text}>{info.text}</p>}

                {state === 'done' && (
                    <>
                        <p className={styles.text}>Felicitări! Invitația ta premium a fost activată. Trimite link-ul oaspeților:</p>
                        <div className={styles.linkContainer}>
                            <div className={styles.linkBox}>
                                <code>{invitationUrl}</code>
                                <button onClick={copy} className={styles.copyBtn}>
                                    {copied ? 'Copiat ✓' : 'Copiază'}
                                </button>
                            </div>
                            <div className={styles.actions}>
                                <a href={invitationUrl} target="_blank" rel="noopener noreferrer" className={styles.viewBtn}>
                                    Vezi invitația
                                </a>
                                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.whatsappBtn}>
                                    Trimite pe WhatsApp
                                </a>
                            </div>
                        </div>
                    </>
                )}

                {state === 'auth' ? (
                    <Link href={`/login?callbackUrl=${encodeURIComponent(`/checkout/success?session_id=${sessionId}`)}`} className={styles.backBtn}>
                        Intră în cont
                    </Link>
                ) : (
                    <Link href="/dashboard" className={styles.backBtn}>
                        Mergi la contul meu
                    </Link>
                )}
            </div>
        </div>
    )
}

export default function CheckoutSuccess() {
    return (
        <Suspense fallback={null}>
            <SuccessContent />
        </Suspense>
    )
}
