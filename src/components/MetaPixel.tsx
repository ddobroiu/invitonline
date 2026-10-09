'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { CONSENT_CHANGE_EVENT, type ConsentState } from '@/lib/consent'
import { hasMetaConsent, revokeMeta, syncMetaWithPath } from '@/lib/meta'

// Incarca Meta Pixel doar cu acord de marketing si doar in afara paginilor excluse (ca TikTokPixel);
// reactioneaza la schimbarea acordului din bannerul de cookies si la navigarea client-side (PageView + ViewContent).
export default function MetaPixel() {
    const pathname = usePathname()
    const pathRef = useRef(pathname)

    useEffect(() => {
        pathRef.current = pathname
        if (hasMetaConsent()) syncMetaWithPath(pathname)
    }, [pathname])

    useEffect(() => {
        if (!hasMetaConsent()) revokeMeta()

        const onChange = (e: Event) => {
            const state = (e as CustomEvent<ConsentState>).detail
            if (state?.marketing) syncMetaWithPath(pathRef.current)
            else revokeMeta()
        }
        window.addEventListener(CONSENT_CHANGE_EVENT, onChange)
        return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onChange)
    }, [])

    return null
}
