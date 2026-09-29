import { BRAND } from '@/config/legal'

// Next merges metadata shallowly: a page that sets `openGraph` replaces the layout's object,
// so every page-level openGraph spreads these shared fields.
export const OG_BASE = {
    siteName: BRAND,
    locale: 'ro_RO',
} as const

/** Serializes JSON-LD for a <script> tag, escaping "<" so the payload cannot close the tag. */
export function jsonLdString(data: unknown): string {
    return JSON.stringify(data).replace(/</g, '\\u003c')
}
