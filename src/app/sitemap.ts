import type { MetadataRoute } from 'next'
import { LEGAL_LINKS, LEGAL_VERSION, SITE_URL } from '@/config/legal'
import { articleDateISO, articlesContent } from './blog/[slug]/articles'

// Only public, indexable pages. Excluded on purpose: /create (editor), /login, /dashboard,
// /checkout/*, /api/*, /templates/* (standalone demos) and every /invitatie/* guest invitation.
// lastModified uses real content dates only (article dates, legal version) — never the request time.
export default function sitemap(): MetadataRoute.Sitemap {
    const blogUrls = Object.entries(articlesContent).map(([slug, article]) => {
        const date = articleDateISO(article.date)
        return {
            url: `${SITE_URL}/blog/${slug}`,
            ...(date ? { lastModified: date } : {}),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        }
    })

    const latestArticle = blogUrls
        .map((u) => u.lastModified)
        .filter((d): d is string => !!d)
        .sort()
        .pop()

    return [
        { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
        { url: `${SITE_URL}/demo`, changeFrequency: 'monthly', priority: 0.9 },
        {
            url: `${SITE_URL}/blog`,
            ...(latestArticle ? { lastModified: latestArticle } : {}),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        ...blogUrls,
        ...Object.values(LEGAL_LINKS).map((path) => ({
            url: `${SITE_URL}${path}`,
            lastModified: LEGAL_VERSION,
            changeFrequency: 'yearly' as const,
            priority: 0.3,
        })),
    ]
}
