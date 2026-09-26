import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import SiteShell from '@/components/SiteShell'
import CookieConsent from '@/components/CookieConsent'
import { BRAND, COMPANY, SITE_URL } from '@/config/legal'

const inter = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-body' })
const playfair = Playfair_Display({ subsets: ['latin', 'latin-ext'], variable: '--font-heading' })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://invitonline.ro'),
  title: {
    default: 'InvitOnline - Invitații Digitale Premium',
    template: '%s | InvitOnline',
  },
  description: 'Creează invitații digitale inovative pentru nunți, botezuri și aniversări.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a0a',
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: BRAND,
  legalName: COMPANY.name,
  url: SITE_URL,
  email: COMPANY.email,
  taxID: COMPANY.cui,
  identifier: COMPANY.euid,
  address: {
    '@type': 'PostalAddress',
    streetAddress: COMPANY.address.street,
    addressLocality: COMPANY.address.locality,
    addressRegion: COMPANY.address.county,
    postalCode: COMPANY.address.postalCode,
    addressCountry: COMPANY.address.countryCode,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ro">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        {/* Tracker-ul mydashboard.ro se încarcă din CookieConsent, doar după acordul pentru cookies analitice */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, '\\u003c') }}
        />
        <Providers>
          <SiteShell>{children}</SiteShell>
          <CookieConsent />
        </Providers>
      </body>
    </html>
  )
}
