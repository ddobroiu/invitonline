// Evenimente GA4: doar cu acord pentru cookies analitice (gtag exista doar dupa ce CookieConsent a incarcat GA),
// fara date personale. Acelasi tipar ca evenimentul `purchase` din app/checkout/success/page.tsx.
import { hasAnalyticsConsent } from '@/lib/consent'

export function trackGa(event: string, params: Record<string, unknown> = {}): boolean {
    if (typeof window === 'undefined') return false
    const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag
    if (typeof gtag !== 'function' || !hasAnalyticsConsent(document.cookie)) return false
    gtag('event', event, params)
    return true
}
