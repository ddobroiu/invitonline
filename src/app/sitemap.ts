import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://invitonline.ro'

    // Blog articles
    const blogArticles = [
        'personalizare-invitatii-digitale',
        'invitatii-digitale-vs-traditionale',
        'cum-sa-alegi-modelul-perfect',
        'top-10-greseli-invitatii',
        'invitatii-eco-friendly',
        'eticheta-invitatiilor-nunta',
        'timeline-perfect-invitatii',
        'invitatii-interactive-2026',
    ]

    const blogUrls = blogArticles.map((slug) => ({
        url: `${baseUrl}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }))

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/create`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/demo`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        ...['/contact', '/termeni-si-conditii', '/politica-de-confidentialitate', '/politica-cookies'].map((path) => ({
            url: `${baseUrl}${path}`,
            lastModified: new Date('2026-09-26'),
            changeFrequency: 'yearly' as const,
            priority: 0.3,
        })),
        ...blogUrls,
    ]
}
