import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import SiteShell from '@/components/SiteShell'

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ro">
      <head>
        {/* mydashboard.ro: vizite, surse de trafic și legătura cu plățile (proiectul invitonline) */}
        <script defer src="https://mydashboard.ro/t.js" data-site="b6a9d9d1b5b7a1da" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <Providers>
          <SiteShell>{children}</SiteShell>
        </Providers>
      </body>
    </html>
  )
}
