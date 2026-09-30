import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { consumeAuthToken } from '@/lib/auth-tokens'

const INVALID = { message: 'Linkul nu mai este valabil (a expirat sau a fost deja folosit). Cere unul nou.' }

// Parola noua din linkul primit pe e-mail: token de unica folosinta (doar hash-ul e in baza), 60 de minute.
export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}))
        const token = String(body.token || '')
        const password = String(body.password || '')

        if (password.length < 6) {
            return NextResponse.json({ message: 'Parola trebuie să aibă cel puțin 6 caractere.' }, { status: 400 })
        }
        if (password.length > 200) {
            return NextResponse.json({ message: 'Parola este prea lungă.' }, { status: 400 })
        }

        const used = await consumeAuthToken(token, 'reset')
        if (!used) return NextResponse.json(INVALID, { status: 400 })

        const user = await prisma.user.findFirst({
            where: { email: { equals: used.email, mode: 'insensitive' } },
            orderBy: { createdAt: 'asc' },
            select: { id: true, email: true },
        })
        if (!user) return NextResponse.json(INVALID, { status: 400 })

        const now = new Date()
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: await bcrypt.hash(password, 10),
                // a dovedit ca primeste e-mail la adresa contului
                emailVerified: now,
                // sesiunile deschise inainte (pe orice dispozitiv) nu mai sunt primite (lib/auth.ts)
                passwordChangedAt: now,
            },
        })
        // celelalte linkuri de resetare inca nefolosite nu mai merg
        await prisma.authToken.updateMany({
            where: { email: used.email, purpose: 'reset', usedAt: null },
            data: { usedAt: now },
        })

        return NextResponse.json({ message: 'Parola a fost schimbată.', email: user.email })
    } catch (error) {
        console.error('Password reset error:', error)
        return NextResponse.json({ message: 'Eroare de server. Încearcă din nou.' }, { status: 500 })
    }
}
