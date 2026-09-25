export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/dashboard', '/invitatie/', '/checkout/'],
            },
        ],
        sitemap: 'https://invitonline.ro/sitemap.xml',
    }
}
