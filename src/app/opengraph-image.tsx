import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

// Default share image for every page without its own (blog articles set their cover photo).
// Generated at build time; fonts are bundled locally because the built-in one lacks ș/ț/ă.
export const alt = 'InvitOnline - Invitații digitale pentru nuntă și botez'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpengraphImage() {
    const fontDir = join(process.cwd(), 'src/assets/og-fonts')
    const [playfair, inter] = await Promise.all([
        readFile(join(fontDir, 'PlayfairDisplay-Bold.ttf')),
        readFile(join(fontDir, 'Inter-Medium.ttf')),
    ])

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '80px',
                    background: 'radial-gradient(circle at 80% 20%, #3a2f12 0%, #0a0a0a 55%)',
                    color: '#fff',
                    fontFamily: 'Inter',
                }}
            >
                <div style={{ display: 'flex', fontFamily: 'Playfair', fontSize: 44, letterSpacing: 4, color: '#d4af37' }}>
                    INVITONLINE
                </div>
                <div style={{ display: 'flex', fontFamily: 'Playfair', fontSize: 76, lineHeight: 1.1, marginTop: 28, maxWidth: 980 }}>
                    Invitații digitale pentru nuntă și botez
                </div>
                <div style={{ display: 'flex', fontSize: 32, color: 'rgba(255,255,255,0.75)', marginTop: 32 }}>
                    Modele interactive · Confirmări RSVP online · Hărți integrate
                </div>
                <div style={{ display: 'flex', fontSize: 28, color: '#d4af37', marginTop: 48 }}>invitonline.ro</div>
            </div>
        ),
        {
            ...size,
            fonts: [
                { name: 'Playfair', data: playfair, weight: 700, style: 'normal' },
                { name: 'Inter', data: inter, weight: 500, style: 'normal' },
            ],
        }
    )
}
