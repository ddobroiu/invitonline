'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { X, Mail } from 'lucide-react'

export default function Header() {
    const pathname = usePathname()
    const { data: session } = useSession()
    const [scrolled, setScrolled] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        handleScroll()
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Close the mobile menu whenever the route changes (link click, back button, redirects)
    const [menuPath, setMenuPath] = useState(pathname)
    if (menuPath !== pathname) {
        setMenuPath(pathname)
        if (isMenuOpen) setIsMenuOpen(false)
    }

    // Close on Escape
    useEffect(() => {
        if (!isMenuOpen) return
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsMenuOpen(false) }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [isMenuOpen])

    // Lock page scroll while the mobile menu is open
    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [isMenuOpen])

    const navLinks = [
        { name: 'Acasă', href: '/' },
        { name: 'Creează', href: '/create' },
        { name: 'Modele', href: '/demo' },
        { name: 'Blog', href: '/blog' },
    ]

    if (session) {
        navLinks.push({ name: 'Contul meu', href: '/dashboard' })
    }

    const isActiveLink = (href: string) => href === '/' ? pathname === '/' : !!pathname?.startsWith(href)

    return (
        <header style={{
            position: 'fixed',
            top: scrolled ? '15px' : '0',
            left: 0,
            right: 0,
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            padding: scrolled ? '0 12px' : '0',
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
                padding: scrolled ? '12px clamp(16px, 3vw, 32px)' : '16px clamp(16px, 3vw, 40px)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.4s ease',
                pointerEvents: 'auto',
                boxShadow: scrolled ? '0 12px 40px rgba(0,0,0,0.5)' : 'none'
            }}>
                <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <style>{`
                        @keyframes floatMail {
                            0%, 100% { transform: translateY(0) rotate(0deg); box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3); }
                            50% { transform: translateY(-4px) rotate(-3deg); box-shadow: 0 15px 25px rgba(212, 175, 55, 0.5); }
                        }
                    `}</style>
                    <div style={{
                        background: 'linear-gradient(135deg, var(--accent) 0%, #fff 100%)',
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: 'floatMail 3.5s ease-in-out infinite',
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                        <Mail size={22} color="#000" strokeWidth={2.5} />
                    </div>
                    <div>
                        {/* Logo text is not a heading: every page has its own h1/h2 outline */}
                        <span style={{
                            display: 'block',
                            fontSize: '1.3rem',
                            fontWeight: '900',
                            fontFamily: 'var(--font-heading)',
                            color: '#fff',
                            letterSpacing: '0.5px',
                            margin: 0,
                            lineHeight: 0.9,
                            textTransform: 'uppercase'
                        }}>
                            INVIT<span style={{ color: 'var(--accent)' }}>ONLINE</span>
                        </span>
                        <span style={{
                            fontSize: '0.55rem',
                            color: 'rgba(255,255,255,0.6)',
                            letterSpacing: '2.5px',
                            textTransform: 'uppercase',
                            display: 'block',
                            fontWeight: '600',
                            marginLeft: '2px',
                            marginTop: '3px'
                        }}>
                            Digital Events
                        </span>
                    </div>
                </Link>

                {/* DESKTOP NAV */}
                <nav className="mobile-hide" style={{ flex: 1, justifyContent: 'center' }}>
                    <ul style={{ display: 'flex', gap: scrolled ? '24px' : '32px', listStyle: 'none', margin: 0, padding: 0 }}>
                        {navLinks.map((link) => {
                            const isActive = isActiveLink(link.href)
                            return (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        aria-current={isActive ? 'page' : undefined}
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

                <div className="mobile-hide" style={{ gap: '25px', alignItems: 'center', display: 'flex' }}>
                    {!session ? (
                        <>
                            <Link
                                href="/login"
                                style={{
                                    textDecoration: 'none',
                                    color: '#ccc',
                                    fontSize: '0.85rem',
                                    fontWeight: '700',
                                    letterSpacing: '1px',
                                    transition: 'color 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
                                onMouseOut={(e) => e.currentTarget.style.color = '#ccc'}
                            >
                                LOGIN
                            </Link>
                            <Link
                                href="/login?tab=register"
                                style={{
                                    display: 'inline-block',
                                    padding: '10px 24px',
                                    borderRadius: '50px',
                                    background: 'linear-gradient(135deg, var(--accent) 0%, #f6e27a 100%)',
                                    color: '#000',
                                    fontSize: '0.85rem',
                                    fontWeight: '900',
                                    textTransform: 'uppercase',
                                    textDecoration: 'none',
                                    transition: 'all 0.3s',
                                    letterSpacing: '0.5px',
                                    boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)'
                                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.4)'
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.3)'
                                }}
                            >
                                CREEAZĂ CONT
                            </Link>
                        </>
                    ) : (
                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            style={{
                                padding: '8px 20px',
                                borderRadius: '50px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: '#fff',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                transition: 'all 0.3s'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                            }}
                        >
                            IEȘIRE
                        </button>
                    )}
                </div>

                {/* MOBILE HAMBURGER */}
                <button
                    type="button"
                    aria-label={isMenuOpen ? 'Închide meniul' : 'Deschide meniul'}
                    aria-expanded={isMenuOpen}
                    className={`hamburger ${isMenuOpen ? 'open' : ''}`}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
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
                    <button
                        type="button"
                        aria-label="Închide meniul"
                        onClick={() => setIsMenuOpen(false)}
                        style={{
                            position: 'absolute',
                            top: '25px',
                            right: '25px',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '50%',
                            width: '44px',
                            height: '44px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}
                    >
                        <X color="white" size={24} />
                    </button>

                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, textAlign: 'center' }}>
                        {navLinks.map((link) => (
                            <li key={link.href} style={{ marginBottom: '26px' }}>
                                <Link
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    aria-current={isActiveLink(link.href) ? 'page' : undefined}
                                    style={{
                                        fontSize: '2rem',
                                        fontWeight: '800',
                                        color: isActiveLink(link.href) ? 'var(--accent)' : '#fff',
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                        <li style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
                            {!session ? (
                                <>
                                    <Link href="/login" onClick={() => setIsMenuOpen(false)} style={{
                                        color: '#ccc',
                                        textDecoration: 'none',
                                        fontWeight: '700',
                                        fontSize: '1.2rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px'
                                    }}>
                                        LOGIN
                                    </Link>
                                    <Link
                                        href="/login?tab=register"
                                        onClick={() => setIsMenuOpen(false)}
                                        style={{
                                            display: 'block',
                                            padding: '15px 50px',
                                            borderRadius: '50px',
                                            background: 'var(--accent)',
                                            fontSize: '1.1rem',
                                            fontWeight: '900',
                                            color: '#000',
                                            textAlign: 'center',
                                            boxShadow: '0 5px 20px rgba(212, 175, 55, 0.2)'
                                        }}
                                    >
                                        CREEAZĂ CONT
                                    </Link>
                                </>
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
