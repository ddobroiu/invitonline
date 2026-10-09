// Meta Pixel (Facebook / Instagram) — se incarca doar cu acord pentru cookies de marketing, ca TikTok Pixel (lib/tiktok.ts).
// Aceleasi pagini excluse ca TikTok (cont / autentificare / plata / API), niciodata pe localhost.
// autoConfig dezactivat (pixelul nu citeste singur butoane / formulare), fara date personale in evenimentele din browser.
// Deduplicarea cu Conversions API (lib/meta-capi.ts) prin eventID: Purchase = id-ul sesiunii Stripe (acelasi ca TikTok),
// CompleteRegistration = reg_<userId>.
// La retragerea acordului: fbq('consent', 'revoke') si stergerea cookie-urilor _fbp / _fbc.
import { CONSENT_COOKIE, getCookieValue, parseConsent } from '@/lib/consent'
import { isTikTokExcludedPath } from '@/lib/tiktok'

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1647428873689235'
export const META_CURRENCY = 'RON'
// Pretul activarii unei invitatii in lei (INVITATION_PRICE din lib/stripe.ts, fara a importa Stripe in browser)
export const META_INVITATION_VALUE = 99
export const META_CONTENT_ID = 'invitatie_premium'

const META_COOKIES = ['_fbp', '_fbc']

// Aceleasi excluderi ca TikTok Pixel (/checkout/success ramane permisa pentru Purchase)
export function isMetaExcludedPath(pathname: string | null | undefined): boolean {
    return isTikTokExcludedPath(pathname)
}

function isLocalHost(): boolean {
    const host = location.hostname
    return host === 'localhost' || host === '127.0.0.1' || host === '[::1]' || host.endsWith('.localhost')
}

export function hasMetaConsent(): boolean {
    if (typeof document === 'undefined') return false
    return parseConsent(getCookieValue(document.cookie, CONSENT_COOKIE))?.marketing === true
}

// ?fbclid= din linkul reclamei -> cookie _fbc (fb.1.<ms>.<fbclid>), 90 de zile, doar cu acord de marketing,
// ca serverul sa-l trimita la Conversions API chiar daca pixelul nu l-a scris inca
function captureFbclid() {
    try {
        const fbclid = new URLSearchParams(location.search).get('fbclid')
        if (!fbclid || fbclid.length > 500) return
        const current = getCookieValue(document.cookie, '_fbc')
        if (current && decodeURIComponent(current).endsWith(`.${fbclid}`)) return
        document.cookie = `_fbc=${encodeURIComponent(`fb.1.${Date.now()}.${fbclid}`)}; path=/; max-age=${60 * 60 * 24 * 90}; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`
    } catch {
        // nu strica pagina
    }
}

type Fbq = ((...args: unknown[]) => void) & {
    callMethod?: (...args: unknown[]) => void
    queue?: unknown[]
    push?: unknown
    loaded?: boolean
    version?: string
}
type FbWindow = Window & { fbq?: Fbq; _fbq?: Fbq }

let loaded = false
let revoked = false
let lastPath: string | null = null

export function isMetaLoaded(): boolean {
    return loaded
}

// Codul de baza oficial Meta (scris fara `arguments`), parametrizat doar cu ID-ul
function injectBaseCode(id: string) {
    const w = window as FbWindow
    if (!w.fbq) {
        const queue: unknown[] = []
        const fbq: Fbq = (...args: unknown[]) => {
            if (fbq.callMethod) fbq.callMethod(...args)
            else queue.push(args)
        }
        fbq.queue = queue
        fbq.push = fbq
        fbq.loaded = true
        fbq.version = '2.0'
        w.fbq = fbq
        w._fbq = fbq
        const s = document.createElement('script')
        s.async = true
        s.src = 'https://connect.facebook.net/en_US/fbevents.js'
        document.head.appendChild(s)
    }
    w.fbq!('set', 'autoConfig', false, id)
    w.fbq!('consent', 'grant')
    w.fbq!('init', id)
    w.fbq!('track', 'PageView')
}

// Incarca pixelul o singura data pe pagina (cu PageView); la un nou acord doar reacorda consimtamantul.
export function loadMeta(pathname?: string | null): boolean {
    if (typeof window === 'undefined' || !META_PIXEL_ID || !hasMetaConsent() || isLocalHost()) return false
    const path = pathname ?? location.pathname
    captureFbclid()
    if (loaded) {
        if (revoked) (window as FbWindow).fbq?.('consent', 'grant')
        revoked = false
        return true
    }
    if (isMetaExcludedPath(path)) return false
    injectBaseCode(META_PIXEL_ID)
    loaded = true
    revoked = false
    lastPath = path
    return true
}

// Retragerea acordului: consent revoke (daca era incarcat) si stergerea _fbp / _fbc
export function revokeMeta() {
    if (typeof window === 'undefined') return
    if (loaded && !revoked) {
        ;(window as FbWindow).fbq?.('consent', 'revoke')
        revoked = true
    }
    const host = location.hostname
    const parent = host.split('.').slice(-2).join('.')
    for (const name of META_COOKIES) {
        document.cookie = `${name}=; path=/; max-age=0`
        document.cookie = `${name}=; path=/; domain=${host}; max-age=0`
        if (parent && parent !== host) document.cookie = `${name}=; path=/; domain=.${parent}; max-age=0`
        document.cookie = `${name}=; path=/; domain=.${host}; max-age=0`
    }
}

// ViewContent pe paginile de produs: modelele (/templates/<id>), catalogul (/demo) si paginile de prezentare cu pret
// (/invitatii-*, /invitatie-*). Fara date personale. Exportat pentru teste.
export function metaViewContentFor(pathname: string | null | undefined): Record<string, unknown> | null {
    if (!pathname) return null
    const tpl = /^\/templates\/([a-z0-9-]{1,60})\/?$/i.exec(pathname)
    if (tpl) {
        return { content_ids: [tpl[1]], content_type: 'product', content_name: `Model ${tpl[1]}`, content_category: 'model' }
    }
    if (pathname === '/demo' || pathname === '/demo/') {
        return { content_ids: [META_CONTENT_ID], content_type: 'product', content_name: 'Modele de invitații', content_category: 'catalog' }
    }
    const landing = /^\/(invitatii|invitatie)-[a-z0-9-]{2,60}\/?$/i.exec(pathname)
    if (landing) {
        return {
            content_ids: [META_CONTENT_ID], content_type: 'product', content_name: 'Invitație premium',
            content_category: pathname.replace(/^\/|\/$/g, ''), value: META_INVITATION_VALUE, currency: META_CURRENCY,
        }
    }
    return null
}

// La fiecare pagina permisa (prima incarcare si navigarea client-side): PageView + ViewContent unde e cazul
export function syncMetaWithPath(pathname: string | null | undefined) {
    if (typeof window === 'undefined' || !hasMetaConsent()) return
    const path = pathname || '/'
    if (isMetaExcludedPath(path)) return
    const w = window as FbWindow
    if (!loaded) {
        if (!loadMeta(path)) return
    } else {
        if (revoked) loadMeta(path)
        if (lastPath === path) return
        lastPath = path
        w.fbq?.('track', 'PageView')
    }
    const view = metaViewContentFor(path)
    if (view) w.fbq?.('track', 'ViewContent', view)
}

// Eveniment Meta: no-op fara acord de marketing, pe paginile excluse sau pe localhost.
// Daca acordul exista dar pixelul nu e inca incarcat, il incarca (stub-ul pune evenimentul in coada).
// `eventId`: deduplicarea cu evenimentul trimis de server (lib/meta-capi.ts).
export function trackMeta(event: string, params?: Record<string, unknown>, eventId?: string): boolean {
    if (typeof window === 'undefined' || !hasMetaConsent() || isMetaExcludedPath(location.pathname) || isLocalHost()) return false
    if (!loaded || revoked) {
        if (!loadMeta()) return false
    }
    const fbq = (window as FbWindow).fbq
    if (!fbq) return false
    if (eventId) fbq('track', event, params ?? {}, { eventID: eventId })
    else fbq('track', event, params ?? {})
    return true
}
