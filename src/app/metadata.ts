import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'InvitOnline - Invitații Digitale Premium pentru Nunți, Botezuri & Evenimente',
    description: 'Creează invitații digitale interactive și elegante pentru nunta ta. Template-uri premium, confirmări live, hărți integrate. Economisește timp și bani cu invitații online.',
    keywords: 'invitații digitale, invitații nuntă online, invitații botez digitale, invitații electronice, invitații interactive, RSVP online, invitații premium, invitații moderne',
    authors: [{ name: 'InvitOnline' }],
    openGraph: {
        title: 'InvitOnline - Invitații Digitale Premium',
        description: 'Creează invitații digitale interactive și elegante pentru nunta ta. Template-uri premium, confirmări live.',
        url: 'https://invitonline.ro',
        siteName: 'InvitOnline',
        images: [
            {
                url: 'https://invitonline.ro/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'InvitOnline - Invitații Digitale Premium',
            },
        ],
        locale: 'ro_RO',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'InvitOnline - Invitații Digitale Premium',
        description: 'Creează invitații digitale interactive pentru evenimente memorabile',
        images: ['https://invitonline.ro/og-image.jpg'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: 'your-google-verification-code',
    },
}

export default metadata
