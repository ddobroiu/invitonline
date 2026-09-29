'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { CONSENT_CHANGE_EVENT, type ConsentState } from '@/lib/consent'
import { hasTikTokConsent, isTikTokExcludedPath, isTikTokLoaded, loadTikTok, revokeTikTok, tiktokPage } from '@/lib/tiktok'

// Incarca TikTok Pixel doar cu acord de marketing si doar in afara paginilor excluse;
// reactioneaza la schimbarea acordului din bannerul de cookies si la navigarea client-side.
export default function TikTokPixel() {
    const pathname = usePathname()
    const pathRef = useRef(pathname)
    const firstPath = useRef<string | null>(null)

    useEffect(() => {
        pathRef.current = pathname
    }, [pathname])

    useEffect(() => {
        if (hasTikTokConsent()) {
            if (!isTikTokExcludedPath(pathRef.current)) {
                firstPath.current = pathRef.current
                loadTikTok()
            }
        } else {
            revokeTikTok()
        }

        const onChange = (e: Event) => {
            const state = (e as CustomEvent<ConsentState>).detail
            if (state?.marketing) {
                if (isTikTokLoaded()) loadTikTok() // grantConsent
                else if (!isTikTokExcludedPath(pathRef.current)) {
                    firstPath.current = pathRef.current
                    loadTikTok()
                }
            } else {
                revokeTikTok()
            }
        }
        window.addEventListener(CONSENT_CHANGE_EVENT, onChange)
        return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onChange)
    }, [])

    useEffect(() => {
        if (!isTikTokLoaded()) {
            // Navigare dintr-o pagina exclusa intr-una permisa, cu acord deja dat
            if (hasTikTokConsent() && !isTikTokExcludedPath(pathname)) {
                firstPath.current = pathname
                loadTikTok()
            }
            return
        }
        if (firstPath.current === pathname) {
            // Pageview-ul initial a fost trimis de codul de baza
            firstPath.current = null
            return
        }
        firstPath.current = null
        tiktokPage(pathname)
    }, [pathname])

    return null
}
