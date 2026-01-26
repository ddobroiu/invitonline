'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'

export default function Header() {
    const pathname = usePathname()
    const { data: session } = useSession()
    const [scrolled, setScrolled] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks = [
        { name: 'Acasă', href: '/' },
        { name: 'Creează', href: '/create' },
        { name: 'Modele', href: '/demo' },
    ]

    if (session) {
        navLinks.push({ name: 'Dashboard', href: '/dashboard' })
    }

    return (
        <header style={{
            position: 'fixed',
            top: scrolled ? '15px' : '0',
            left: 0,
            right: 0,
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            padding: '0 20px',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: 'none'
        }}>
            <div style={{
                width: '100%',
                maxWidth: scrolled ? '1000px' : '1400px',
                background: scrolled ? 'rgba(10, 10, 10, 0.92)' : 'rgba(10, 10, 10, 0.6)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: scrolled ? '100px' : '0 0 24px 24px',
                padding: scrolled ? '12px 32px' : '18px 40px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.4s ease',
                pointerEvents: 'auto',
                boxShadow: scrolled ? '0 12px 40px rgba(0,0,0,0.5)' : 'none'
            }}>
                <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                    <h2 style={{
                        fontSize: '1.25rem',
                        fontWeight: '900',
                        fontFamily: 'var(--font-heading)',
                        color: '#fff',
                        letterSpacing: '0.5px',
                        margin: 0,
                        textTransform: 'uppercase'
                    }}>
                        INVITONLINE<span style={{ color: 'var(--accent)' }}>.RO</span>
                    </h2>
                </Link>

                {/* DESKTOP NAV */}
                <nav className="mobile-hide" style={{ flex: 1, justifyContent: 'center' }}>
                    <ul style={{ display: 'flex', gap: '32px', listStyle: 'none', margin: 0, padding: 0 }}>
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href
                            return (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        style={{
                                            color: isActive ? 'var(--accent)' : '#eee',
                                            fontSize: '0.9rem',
                                            fontWeight: '700',
                                            transition: 'all 0.2s',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px',
                                            textDecoration: 'none'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent)'}
                                        onMouseOut={(e) => e.currentTarget.style.color = isActive ? 'var(--accent)' : '#eee'}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>

                <div className="mobile-hide" style={{ gap: '15px', alignItems: 'center' }}>
                    {!session ? (
                        <Link href="/login" style={{ textDecoration: 'none' }}>
                            <button style={{
                                padding: '12px 28px',
                                borderRadius: '50px',
                                background: 'var(--accent)',
                                border: 'none',
                                color: '#000',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                fontWeight: '900',
                                textTransform: 'uppercase',
                                transition: 'all 0.3s',
                                letterSpacing: '0.5px'
                            }}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                INTRĂ / ÎNREGISTRARE
                            </button>
                        </Link>
                    ) : (
                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            style={{
                                padding: '10px 22px',
                                borderRadius: '50px',
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                color: '#fff',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                fontWeight: '700',
                                transition: 'all 0.3s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        >
                            IEȘIRE
                        </button>
                    )}
                </div>

                {/* MOBILE HAMBURGER */}
                <div
                    className={`hamburger ${isMenuOpen ? 'open' : ''}`}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>

            {/* MOBILE MENU OVERLAY */}
            {isMenuOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100vh',
                    background: 'rgba(10, 10, 10, 0.98)',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '40px',
                    pointerEvents: 'auto',
                    animation: 'fadeIn 0.3s ease'
                }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, textAlign: 'center' }}>
                        {navLinks.map((link) => (
                            <li key={link.href} style={{ marginBottom: '30px' }}>
                                <Link
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    style={{
                                        fontSize: '2rem',
                                        fontWeight: '800',
                                        color: pathname === link.href ? 'var(--accent)' : '#fff',
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                        <li style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {!session ? (
                                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                                    <button style={{
                                        padding: '15px 50px',
                                        borderRadius: '50px',
                                        background: 'var(--accent)',
                                        border: 'none',
                                        fontSize: '1.1rem',
                                        fontWeight: '900',
                                        width: '100%',
                                        color: '#000'
                                    }}>INTRĂ / ÎNREGISTRARE</button>
                                </Link>
                            ) : (
                                <button
                                    onClick={() => {
                                        signOut({ callbackUrl: '/' })
                                        setIsMenuOpen(false)
                                    }}
                                    style={{
                                        padding: '15px 50px',
                                        borderRadius: '50px',
                                        background: 'transparent',
                                        border: '1px solid #444',
                                        color: '#fff',
                                        fontSize: '1.2rem',
                                        width: '100%'
                                    }}
                                >IEȘIRE</button>
                            )}
                        </li>
                    </ul>
                </div>
            )}
        </header>
    )
}
