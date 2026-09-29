// TikTok Pixel — se incarca doar cu acord pentru cookies de marketing (categoria „Marketing / reclame” din banner).
// Nu se incarca pe paginile de cont / autentificare / plata / API (vezi TIKTOK_EXCLUDED_PREFIXES).
import { CONSENT_COOKIE, getCookieValue, parseConsent } from '@/lib/consent'

export const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || 'DATFVURC77U3L597V800'
export const TIKTOK_CURRENCY = 'EUR'

// tt_ttclid: identificatorul de click TikTok (?ttclid= din linkul reclamei), pastrat 30 de zile DOAR cu acord de marketing,
// ca checkout-ul sa-l poata trimite serverului pentru TikTok Events API (lib/tiktok-events.ts)
const TTCLID_COOKIE = 'tt_ttclid'
const TIKTOK_COOKIES = ['_ttp', '_tt_enable_cookie', TTCLID_COOKIE]

// Salveaza ?ttclid= din URL-ul curent pentru 30 de zile (apelat doar cu acord de marketing)
function captureTtclid() {
    try {
        const ttclid = new URLSearchParams(location.search).get('ttclid')
        if (ttclid && ttclid.length <= 500) {
            document.cookie = `${TTCLID_COOKIE}=${encodeURIComponent(ttclid)}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`
        }
    } catch {
        // nu strica pagina
    }
}

// Site-ul nu are o lista de excludere pentru GA4, asa ca o definim aici.
// /checkout/success (pagina de multumire) ramane permisa, pentru evenimentul CompletePayment.
export const TIKTOK_EXCLUDED_PREFIXES = ['/admin', '/dashboard', '/cont', '/account', '/login', '/autentificare', '/register', '/api', '/plata']

export function isTikTokExcludedPath(pathname: string | null | undefined): boolean {
    if (!pathname) return false
    if (pathname === '/checkout/success' || pathname.startsWith('/checkout/success/')) return false
    if (pathname === '/checkout' || pathname.startsWith('/checkout/')) return true
    return TIKTOK_EXCLUDED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Ttq = any
type TtWindow = Window & { ttq?: Ttq; TiktokAnalyticsObject?: string }

let loaded = false

export function hasTikTokConsent(): boolean {
    if (typeof document === 'undefined') return false
    return parseConsent(getCookieValue(document.cookie, CONSENT_COOKIE))?.marketing === true
}

export function isTikTokLoaded(): boolean {
    return loaded
}

// Codul de baza oficial TikTok (parametrizat doar cu ID-ul), apoi holdConsent -> load -> page -> grantConsent.
// Idempotent: se incarca o singura data pe durata paginii; la un nou acord doar reacorda consimtamantul.
export function loadTikTok() {
    if (typeof window === 'undefined') return
    if (!hasTikTokConsent()) return
    captureTtclid()
    const w = window as TtWindow
    if (loaded) {
        w.ttq?.grantConsent()
        return
    }
    loaded = true
    /* eslint-disable */
    ;(function (w: any, d: Document, t: string) {
        w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t: any,e: any){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t: any){for(
        var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e: any,n: any){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=d.createElement("script")
        ;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=d.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
        ttq.holdConsent();
        ttq.load(TIKTOK_PIXEL_ID);
        ttq.page();
    })(window, document, 'ttq')
    /* eslint-enable */
    w.ttq.grantConsent()
}

// Retragerea acordului: revokeConsent (daca era incarcat) si stergerea cookie-urilor _ttp / _tt_enable_cookie / tt_ttclid
export function revokeTikTok() {
    if (typeof window === 'undefined') return
    const w = window as TtWindow
    if (loaded) w.ttq?.revokeConsent()
    const host = location.hostname
    const parent = host.split('.').slice(-2).join('.')
    for (const name of TIKTOK_COOKIES) {
        document.cookie = `${name}=; path=/; max-age=0`
        document.cookie = `${name}=; path=/; domain=${host}; max-age=0`
        if (parent && parent !== host) document.cookie = `${name}=; path=/; domain=.${parent}; max-age=0`
        document.cookie = `${name}=; path=/; domain=.${host}; max-age=0`
    }
}

// Pageview la navigarea client-side (prima incarcare e acoperita de ttq.page() din codul de baza)
export function tiktokPage(pathname: string | null | undefined) {
    if (!loaded || !hasTikTokConsent() || isTikTokExcludedPath(pathname)) return
    ;(window as TtWindow).ttq?.page()
}

// Eveniment TikTok: no-op fara acord de marketing sau pe paginile excluse.
// Daca acordul exista dar pixelul nu e inca incarcat, il incarca (stub-ul pune evenimentul in coada).
// `options.event_id`: deduplicarea cu evenimentul trimis de server (TikTok Events API, lib/tiktok-events.ts).
export function trackTikTok(event: string, params?: Record<string, unknown>, options?: { event_id?: string }): boolean {
    if (typeof window === 'undefined' || !hasTikTokConsent() || isTikTokExcludedPath(location.pathname)) return false
    if (!loaded) loadTikTok()
    ;(window as TtWindow).ttq?.track(event, params ?? {}, options ?? {})
    return true
}
