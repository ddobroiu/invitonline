'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// Public invitations (and the template previews that imitate them) are shown full screen, without the site header/footer
export default function SiteShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isInvitation = pathname?.startsWith('/invitatie/') || pathname?.startsWith('/templates/')
    const hideFooter = isInvitation || pathname === '/create' || pathname === '/dashboard'

    if (isInvitation) {
        return <main style={{ flex: 1 }}>{children}</main>
    }

    return (
        <>
            <Header />
            <main style={{ flex: 1, paddingTop: '80px' }}>
                {children}
            </main>
            {!hideFooter && <Footer />}
        </>
    )
}
