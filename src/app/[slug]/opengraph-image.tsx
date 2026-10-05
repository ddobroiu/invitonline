import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { getInvitationLanding } from '@/config/invitation-landings'
import { INVITATION_PRICE } from '@/lib/stripe'

export const alt = 'InvitOnline — invitații digitale personalizate'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const page = getInvitationLanding(slug)
    if (!page) return new Response('Not found', { status: 404 })
    const [inter, playfair] = await Promise.all([readFile(join(process.cwd(), 'src/assets/og-fonts/Inter-Medium.ttf')), readFile(join(process.cwd(), 'src/assets/og-fonts/PlayfairDisplay-Bold.ttf'))])
    return new ImageResponse(<div style={{ width: '100%', height: '100%', background: '#f8f7f3', color: '#243c33', display: 'flex', flexDirection: 'column', padding: '64px 78px', justifyContent: 'space-between', borderBottom: '14px solid #48644f', fontFamily: 'Inter' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><span style={{ fontSize: 34, fontWeight: 700 }}>invitonline</span><span style={{ fontSize: 18, color: '#637364' }}>O invitație. O primă emoție.</span></div>
        <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ textTransform: 'uppercase', letterSpacing: 4, fontSize: 17, color: '#637364', marginBottom: 24 }}>{page.label}</span><div style={{ fontSize: 58, lineHeight: 1.12, fontWeight: 700, maxWidth: 990, fontFamily: 'Playfair' }}>{page.heading}</div></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: 21 }}>Personalizare · Confirmări RSVP · Un link pentru oaspeți</span><span style={{ background: '#243c33', color: '#fff', fontSize: 25, padding: '15px 24px', borderRadius: 8 }}>{INVITATION_PRICE / 100} lei / eveniment</span></div>
    </div>, { ...size, fonts: [{ name: 'Inter', data: inter, weight: 500 }, { name: 'Playfair', data: playfair, weight: 700 }] })
}
