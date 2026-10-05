'use client'

import Link from 'next/link'
import { ANPC_SAL_URL, ANPC_URL, COMPANY, COMPANY_ADDRESS_LINE, LEGAL_LINKS } from '@/config/legal'
import { openCookieSettings } from '@/lib/consent'

export default function Footer() {
    const socialLinks = [
        { label: 'Instagram', url: process.env.NEXT_PUBLIC_INSTAGRAM_URL },
        { label: 'Facebook', url: process.env.NEXT_PUBLIC_FACEBOOK_URL },
        { label: 'TikTok', url: process.env.NEXT_PUBLIC_TIKTOK_URL },
    ].filter(link => link.url?.startsWith('https://'))
    return (
        <footer style={{
            background: '#243c33',
            borderTop: '1px solid #3f5548',
            padding: '60px clamp(16px, 4vw, 40px) 20px',
            color: '#b6c1ae',
            marginTop: 'auto'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '40px',
                marginBottom: '40px'
            }}>
                <div>
                    <h3 style={{ color: 'white', marginBottom: '20px', fontFamily: 'var(--font-heading)' }}>INVITONLINE</h3>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                        Revoluționăm modul în care inviți oamenii dragi alături de tine.
                        Digital, Elegant, Simplu.
                    </p>
                </div>

                <div>
                    <h4 style={{ color: 'white', marginBottom: '15px', fontSize: '1rem' }}>Link-uri Utile</h4>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '10px' }}><Link href="/" className="hover-text-white">Acasă</Link></li>
                        <li style={{ marginBottom: '10px' }}><Link href="/create" className="hover-text-white">Creează Invitație</Link></li>
                        <li style={{ marginBottom: '10px' }}><Link href="/demo" className="hover-text-white">Modele Demo</Link></li>
                        <li style={{ marginBottom: '10px' }}><Link href="/invitatii-online" className="hover-text-white">Invitații online</Link></li>
                        <li style={{ marginBottom: '10px' }}><Link href="/blog" className="hover-text-white">Blog & Articole</Link></li>
                        <li style={{ marginBottom: '10px' }}><Link href="/dashboard" className="hover-text-white">Contul Meu</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 style={{ color: 'white', marginBottom: '15px', fontSize: '1rem' }}>Pentru evenimentul tău</h4>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {[['/invitatii-nunta', 'Invitații de nuntă'], ['/invitatii-botez', 'Invitații de botez'], ['/invitatii-aniversare', 'Invitații de aniversare'], ['/invitatii-petrecere', 'Invitații de petrecere'], ['/invitatii-corporate', 'Invitații corporate']].map(([href, label]) => <li key={href} style={{ marginBottom: '10px' }}><Link href={href} className="hover-text-white">{label}</Link></li>)}
                    </ul>
                </div>

                <div>
                    <h4 style={{ color: 'white', marginBottom: '15px', fontSize: '1rem' }}>Contact</h4>
                    <p style={{ marginBottom: '10px' }}><a href={`mailto:${COMPANY.email}`} className="hover-text-white">{COMPANY.email}</a></p>
                    <p style={{ marginBottom: '10px' }}><Link href={LEGAL_LINKS.contact} className="hover-text-white">Date de contact și identificare</Link></p>
                </div>

                <div>
                    <h4 style={{ color: 'white', marginBottom: '15px', fontSize: '1rem' }}>Informații legale</h4>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '10px' }}><Link href={LEGAL_LINKS.terms} className="hover-text-white">Termeni și condiții</Link></li>
                        <li style={{ marginBottom: '10px' }}><Link href={LEGAL_LINKS.privacy} className="hover-text-white">Politica de confidențialitate</Link></li>
                        <li style={{ marginBottom: '10px' }}><Link href={LEGAL_LINKS.cookies} className="hover-text-white">Politica de cookies</Link></li>
                        <li style={{ marginBottom: '10px' }}>
                            <button type="button" onClick={openCookieSettings} className="hover-text-white" style={{ background: 'none', border: 'none', color: 'inherit', padding: 0, cursor: 'pointer', font: 'inherit' }}>
                                Setări cookies
                            </button>
                        </li>
                        <li style={{ marginBottom: '10px' }}><a href={ANPC_SAL_URL} target="_blank" rel="noopener noreferrer" className="hover-text-white">ANPC – SAL (Soluționarea alternativă a litigiilor)</a></li>
                        <li style={{ marginBottom: '10px' }}><a href={ANPC_URL} target="_blank" rel="noopener noreferrer" className="hover-text-white">ANPC</a></li>
                    </ul>
                </div>

                {socialLinks.length > 0 && <div>
                    <h4 style={{ color: 'white', marginBottom: '15px', fontSize: '1rem' }}>Urmărește-ne</h4>
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        {socialLinks.map(link => <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" className="hover-text-white">{link.label}</a>)}
                    </div>
                </div>}
            </div>

            <div style={{
                textAlign: 'center',
                paddingTop: '20px',
                borderTop: '1px solid #111',
                fontSize: '0.8rem'
            }}>
                <p style={{ marginBottom: '8px', lineHeight: 1.6 }}>
                    InvitOnline este operat de {COMPANY.name} · CUI {COMPANY.cui} ({COMPANY.vatStatus}) · Nr. Reg. Com. {COMPANY.regCom} ·
                    Sediu: {COMPANY_ADDRESS_LINE} · <a href={`mailto:${COMPANY.email}`} className="hover-text-white">{COMPANY.email}</a>
                </p>
                <p>&copy; {new Date().getFullYear()} InvitOnline. Toate drepturile rezervate.</p>
                <p style={{ marginTop: '6px' }}>
                    Realizat de <a href="https://e-web.ro" target="_blank" rel="noopener" className="hover-text-white">e-web.ro</a>
                </p>
            </div>
        </footer>
    )
}
