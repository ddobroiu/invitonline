// Escape user-provided text before interpolating it into HTML emails
export function escapeHtml(value: unknown): string {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}

// Public base URL of the site, used in emails and Stripe redirects
export function getSiteUrl(req?: Request): string {
    const fromEnv = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL
    if (fromEnv) return fromEnv.replace(/\/$/, '')
    if (req) return new URL(req.url).origin
    return 'http://localhost:3000'
}
