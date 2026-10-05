'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { ArrowUpRight, LogOut, Mail, Menu, X } from 'lucide-react'
import styles from './Header.module.css'

export default function Header() {
    const pathname = usePathname()
    const { data: session } = useSession()
    const [openPath, setOpenPath] = useState<string | null>(null)
    const open = openPath === pathname
    useEffect(() => {
        if (!open) return
        const previous = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpenPath(null) }
        window.addEventListener('keydown', close)
        return () => { document.body.style.overflow = previous; window.removeEventListener('keydown', close) }
    }, [open])
    const links = [{ href: '/', label: 'Acasă' }, { href: '/demo', label: 'Colecția de invitații' }, { href: '/blog', label: 'Inspirație' }, { href: '/contact', label: 'Contact' }]
    return <header className={styles.header}>
        <div className={styles.inner}>
            <Link href="/" className={styles.logo} aria-label="InvitOnline — acasă"><span className={styles.mark}><Mail size={21} strokeWidth={1.4} /></span><span>invit<span className={styles.logoLight}>online</span><small>MADE FOR YOUR MOMENTS</small></span></Link>
            <nav className={styles.navigation} aria-label="Navigare principală">{links.map(link => <Link key={link.href} href={link.href} aria-current={pathname === link.href ? 'page' : undefined}>{link.label}</Link>)}</nav>
            <div className={styles.actions}><Link href={session ? '/dashboard' : '/login'}>{session ? 'Contul meu' : 'Autentificare'}</Link><Link href="/create" className={styles.cta}>Creează invitația <ArrowUpRight size={16} /></Link>{session && <button className={styles.signOut} aria-label="Ieșire din cont" onClick={() => signOut({ callbackUrl: '/' })}><LogOut size={18} /></button>}</div>
            <button className={styles.toggle} aria-label={open ? 'Închide meniul' : 'Deschide meniul'} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpenPath(open ? null : pathname)}>{open ? <X /> : <Menu />}</button>
        </div>
        {open && <nav id="mobile-navigation" className={styles.mobile} aria-label="Navigare mobilă">{links.map(link => <Link key={link.href} href={link.href} onClick={() => setOpenPath(null)} aria-current={pathname === link.href ? 'page' : undefined}>{link.label}</Link>)}<Link href={session ? '/dashboard' : '/login'} onClick={() => setOpenPath(null)}>{session ? 'Contul meu' : 'Autentificare'}</Link><Link href="/create" className={styles.cta} onClick={() => setOpenPath(null)}>Creează invitația <ArrowUpRight size={18} /></Link>{session && <button onClick={() => signOut({ callbackUrl: '/' })}>Ieșire din cont</button>}</nav>}
    </header>
}
