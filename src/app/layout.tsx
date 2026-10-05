import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Providers from '@/components/Providers'
import SiteShell from '@/components/SiteShell'
import CookieConsent from '@/components/CookieConsent'
import TikTokPixel from '@/components/TikTokPixel'
import { BRAND, COMPANY, SITE_URL } from '@/config/legal'

const inter = localFont({ src: '../assets/fonts/Inter.ttf', weight: '100 900', display: 'swap', variable: '--font-body' })
const playfair = localFont({ src: '../assets/fonts/PlayfairDisplay.ttf', weight: '400 900', display: 'swap', variable: '--font-heading' })

export const metadata: Metadata = {
  // Canonical host is fixed (apex, https) so canonicals/OG never follow a www or localhost env value
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'InvitOnline - Invitații digitale pentru nuntă și botez',
    template: '%s | InvitOnline',
  },
  description: 'Creează invitații digitale interactive pentru nunți, botezuri și aniversări, cu confirmări RSVP online și hărți integrate.',
  applicationName: BRAND,
  openGraph: {
    siteName: BRAND,
    locale: 'ro_RO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f8f7f3',
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: BRAND,
      legalName: COMPANY.name,
      url: SITE_URL,
      logo: `${SITE_URL}/icon.svg`,
      email: COMPANY.email,
      taxID: COMPANY.cui,
      identifier: COMPANY.euid,
      address: {
        '@type': 'PostalAddress',
        // Satul si numarul; comuna este addressLocality
        streetAddress: 'Sat Topliceni nr. 214',
        addressLocality: COMPANY.address.locality,
        addressRegion: COMPANY.address.county,
        postalCode: COMPANY.address.postalCode,
        addressCountry: COMPANY.address.countryCode,
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: BRAND,
      inLanguage: 'ro-RO',
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
  ],
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
          {/* TikTok Pixel: doar cu acord pentru cookies de marketing */}
          <TikTokPixel />
        </Providers>
      </body>
    </html>
  )
}
