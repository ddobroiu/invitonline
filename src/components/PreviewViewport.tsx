'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

/** Real viewport sizing, with React state retained for live editor updates. */
export default function PreviewViewport({ children, title }: { children: ReactNode; title: string }) {
    const frameRef = useRef<HTMLIFrameElement>(null)
    const [target, setTarget] = useState<HTMLElement | null>(null)
    useEffect(() => {
        const frame = frameRef.current
        if (!frame) return
        let observer: MutationObserver | undefined
        const initialize = () => {
            const doc = frame.contentDocument
            if (!doc) return
            doc.documentElement.lang = 'ro'
            doc.body.className = document.body.className
            const copies = new Map<string, HTMLElement>()
            const syncStyles = () => {
                const wanted = new Set<string>()
                document.querySelectorAll('style, link[rel="stylesheet"]').forEach((el) => {
                    const key = el.outerHTML
                    wanted.add(key)
                    if (copies.has(key)) return
                    const clone = el.cloneNode(true) as HTMLElement
                    clone.setAttribute('data-preview-style', '')
                    copies.set(key, clone)
                    doc.head.appendChild(clone)
                })
                for (const [key, clone] of copies) {
                    if (!wanted.has(key)) { clone.remove(); copies.delete(key) }
                }
            }
            syncStyles()
            observer?.disconnect()
            observer = new MutationObserver((records) => {
                const changed = records.some((record) => {
                    const target = record.target instanceof Element ? record.target : record.target.parentElement
                    if (target?.matches('style, link[rel="stylesheet"]') || target?.closest('style')) return true
                    return [...record.addedNodes, ...record.removedNodes].some(node => node instanceof Element && (node.matches('style, link[rel="stylesheet"]') || node.querySelector('style, link[rel="stylesheet"]')))
                })
                if (changed) syncStyles()
            })
            observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['href', 'media', 'rel'] })
            setTarget(doc.body)
        }
        initialize()
        frame.addEventListener('load', initialize)
        return () => { observer?.disconnect(); frame.removeEventListener('load', initialize) }
    }, [])
    return <>
        <iframe ref={frameRef} title={title} style={{ display: 'block', width: '100%', height: '100%', minHeight: 0, border: 0, flex: '1 1 auto', background: '#f6f3ee' }} />
        {target && createPortal(<div style={{ width: '100%', minHeight: '100dvh', display: 'flex', flexDirection: 'column', containerType: 'inline-size' }}>{children}</div>, target)}
    </>
}
