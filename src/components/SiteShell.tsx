'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import styles from './SiteShell.module.css'

// Public invitations (and the template previews that imitate them) are shown full screen, without the site header/footer
export default function SiteShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isInvitation = pathname?.startsWith('/invitatie/') || pathname?.startsWith('/templates/')
    const hideFooter = isInvitation || pathname === '/create' || pathname === '/dashboard'

    if (isInvitation) {
        return <main className={styles.invitation}>{children}</main>
    }

    return (
        <div className={styles.shell}>
            <Header />
            <main className={styles.content}>
                {children}
            </main>
            {!hideFooter && <Footer />}
        </div>
    )
}
