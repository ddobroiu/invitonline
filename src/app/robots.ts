import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/config/legal'

// Only the API and checkout are blocked from crawling. Guest invitations (/invitatie/*), /create, /login and
// /dashboard are NOT disallowed on purpose: they carry noindex (meta + X-Robots-Tag, see next.config.ts) and
// crawlers must be able to fetch them to see it — a robots.txt block alone can leave a linked URL indexed.
export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/checkout/'],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
    }
}
