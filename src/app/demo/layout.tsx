import type { Metadata } from 'next'
import { OG_BASE } from '@/lib/seo'
import { TEMPLATES } from '@/config/templates'

export const metadata: Metadata = {
    title: 'Modele de invitații digitale',
    description: `${TEMPLATES.length} modele de invitații digitale: elegante, bilet de avion, pașaport, ziar sau vinil. Explorează tematicile și personalizează pentru evenimentul tău.`,
    alternates: { canonical: '/demo' },
    openGraph: {
        ...OG_BASE,
        title: 'Modele de invitații digitale | InvitOnline',
        description: `${TEMPLATES.length} modele de invitații digitale, cu tematici originale și previzualizare pe desktop și mobil.`,
        type: 'website',
        url: '/demo',
    },
}

export default function DemoLayout({ children }: { children: React.ReactNode }) {
    return children
}
