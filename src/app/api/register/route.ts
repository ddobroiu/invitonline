import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { escapeHtml, getSiteUrl } from '@/lib/utils'
import { LEGAL_VERSION } from '@/config/legal'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const email = String(body.email || '').trim().toLowerCase()
        const password = String(body.password || '')
        const name = String(body.name || '').trim().slice(0, 120) || null

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json({ message: 'Adresa de email nu este validă.' }, { status: 400 })
        }
        if (body.acceptTerms !== true) {
            return NextResponse.json({ message: 'Pentru a crea contul trebuie să accepți Termenii și condițiile.' }, { status: 400 })
        }
        if (password.length < 6) {
            return NextResponse.json({ message: 'Parola trebuie să aibă cel puțin 6 caractere.' }, { status: 400 })
        }

        const existingUser = await prisma.user.findFirst({
            where: { email: { equals: email, mode: 'insensitive' } }
        })
        if (existingUser) {
            return NextResponse.json({ message: 'Există deja un cont cu acest email.' }, { status: 409 })
        }

        const user = await prisma.user.create({
            data: {
                email,
                password: await bcrypt.hash(password, 10),
                name,
                termsAcceptedAt: new Date(),
                termsVersion: LEGAL_VERSION,
            }
        })

        try {
            const { sendEmail } = await import('@/lib/resend')
            await sendEmail({
                to: email,
                subject: 'Bun venit la InvitOnline! 💌',
                html: `
                    <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #d4af37;">Bună, ${escapeHtml(name || 'și bine ai venit')}!</h1>
                        <p>Contul tău a fost creat cu succes. Acum poți crea invitații digitale premium pentru evenimentele tale speciale.</p>
                        <div style="margin: 30px 0;">
                            <a href="${getSiteUrl(req)}/create" style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Creează prima invitație</a>
                        </div>
                        <p>O zi minunată,<br/>Echipa InvitOnline</p>
                    </div>
                `
            })
        } catch (emailErr) {
            console.error('Welcome email failed:', emailErr)
        }

        return NextResponse.json({ message: 'User created', userId: user.id }, { status: 201 })
    } catch (error) {
        console.error('Register error:', error)
        return NextResponse.json({ message: 'Eroare de server. Încearcă din nou.' }, { status: 500 })
    }
}
