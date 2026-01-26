'use client'

import Link from 'next/link'

export default function Footer() {
    return (
        <footer style={{
            background: '#050505',
            borderTop: '1px solid #222',
            padding: '60px 40px 20px',
            color: '#888',
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
                        <li style={{ marginBottom: '10px' }}><Link href="/login" className="hover-text-white">Contul Meu</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 style={{ color: 'white', marginBottom: '15px', fontSize: '1rem' }}>Contact</h4>
                    <p style={{ marginBottom: '10px' }}>contact@invitonline.ro</p>
                    <p style={{ marginBottom: '10px' }}>+40 700 123 456</p>
                    <p style={{ marginBottom: '10px' }}>București, România</p>
                    <Link href="/blog" style={{ color: '#d4af37', textDecoration: 'underline' }}>Blog & Articole</Link>
                </div>

                <div>
                    <h4 style={{ color: 'white', marginBottom: '15px', fontSize: '1rem' }}>Urmărește-ne</h4>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <a href="#" style={{ color: 'white' }}>Instagram</a>
                        <a href="#" style={{ color: 'white' }}>Facebook</a>
                        <a href="#" style={{ color: 'white' }}>TikTok</a>
                    </div>
                </div>
            </div>

            <div style={{
                textAlign: 'center',
                paddingTop: '20px',
                borderTop: '1px solid #111',
                fontSize: '0.8rem'
            }}>
                <p>&copy; {new Date().getFullYear()} InvitOnline. Toate drepturile rezervate.</p>
            </div>
        </footer>
    )
}
