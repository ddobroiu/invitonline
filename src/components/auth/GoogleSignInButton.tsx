'use client'

import { useEffect, useState } from 'react'
import { getProviders, signIn } from 'next-auth/react'
import { LEGAL_VERSION } from '@/config/legal'
import { GOOGLE_TERMS_COOKIE, GOOGLE_TERMS_COOKIE_MAX_AGE } from '@/lib/google-auth-shared'

// Afla o singura data pe pagina daca serverul are Google configurat (GOOGLE_CLIENT_ID/SECRET)
let googleAvailable: Promise<boolean> | null = null
function isGoogleAvailable() {
    googleAvailable ??= getProviders().then((p) => Boolean(p?.google)).catch(() => false)
    return googleAvailable
}

/**
 * „Continuă cu Google”, dupa regulile de marca Google (logo „G” in culori, fundal alb, text #1F1F1F,
 * contur #747775). Nu apare daca Google nu e configurat pe server.
 *
 * termsAccepted: bifa „Sunt de acord cu Termenii” din formular. Cu bifa, serverul poate crea un cont nou;
 * fara ea, doar intra in conturile existente. requireTerms: pe fila „Cont nou” butonul cere intai bifa.
 */
export default function GoogleSignInButton({
    callbackUrl,
    termsAccepted,
    requireTerms,
    onBlocked,
    dividerColor = 'rgba(255, 255, 255, 0.12)',
}: {
    callbackUrl: string
    termsAccepted: boolean
    requireTerms: boolean
    onBlocked: (message: string) => void
    dividerColor?: string
}) {
    const [available, setAvailable] = useState(false)
    const [busy, setBusy] = useState(false)

    useEffect(() => {
        let alive = true
        isGoogleAvailable().then((ok) => { if (alive) setAvailable(ok) })
        return () => { alive = false }
    }, [])

    if (!available) return null

    const handleClick = () => {
        if (requireTerms && !termsAccepted) {
            onBlocked('Pentru a crea contul cu Google, bifează mai sus acordul cu Termenii și condițiile.')
            return
        }
        const secure = window.location.protocol === 'https:' ? '; Secure' : ''
        document.cookie = termsAccepted
            ? `${GOOGLE_TERMS_COOKIE}=${LEGAL_VERSION}; Max-Age=${GOOGLE_TERMS_COOKIE_MAX_AGE}; Path=/; SameSite=Lax${secure}`
            : `${GOOGLE_TERMS_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax${secure}`
        setBusy(true)
        signIn('google', { callbackUrl }).catch(() => setBusy(false))
    }

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '1.25rem 0', color: '#777', fontSize: '0.8rem' }}>
                <span style={{ flex: 1, height: 1, background: dividerColor }} />
                sau
                <span style={{ flex: 1, height: 1, background: dividerColor }} />
            </div>
            <button
                type="button"
                onClick={handleClick}
                disabled={busy}
                style={{
                    width: '100%',
                    minHeight: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    padding: '0 16px',
                    background: '#FFFFFF',
                    color: '#1F1F1F',
                    border: '1px solid #747775',
                    borderRadius: '12px',
                    fontFamily: 'Roboto, Arial, sans-serif',
                    fontSize: '15px',
                    fontWeight: 500,
                    cursor: busy ? 'wait' : 'pointer',
                    opacity: busy ? 0.7 : 1,
                }}
            >
                <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span>{busy ? 'Se deschide Google...' : 'Continuă cu Google'}</span>
            </button>
        </div>
    )
}
