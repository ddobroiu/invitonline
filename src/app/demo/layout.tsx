import type { Metadata } from 'next'
import { OG_BASE } from '@/lib/seo'

export const metadata: Metadata = {
    title: 'Modele de invitații digitale',
    description: '15 modele de invitații digitale interactive, de la Classic Gold și Plic 3D la Cinematic Netflix, Boarding Pass și Vinyl Record. Previzualizare pe desktop și mobil.',
    alternates: { canonical: '/demo' },
    openGraph: {
        ...OG_BASE,
        title: 'Modele de invitații digitale | InvitOnline',
        description: '15 modele de invitații digitale interactive, cu previzualizare pe desktop și mobil.',
        type: 'website',
        url: '/demo',
    },
}

export default function DemoLayout({ children }: { children: React.ReactNode }) {
    return children
}
