import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { consumeAuthToken } from '@/lib/auth-tokens'
import { readJsonObject, ValidationError } from '@/lib/validation'

const INVALID = { message: 'Linkul nu mai este valabil (a expirat sau a fost deja folosit). Cere unul nou.' }

// Parola noua din linkul primit pe e-mail: token de unica folosinta (doar hash-ul e in baza), 60 de minute.
export async function POST(req: Request) {
    try {
        const body = await readJsonObject(req)
        if (typeof body.token !== 'string' || typeof body.password !== 'string') throw new ValidationError('Completează o parolă validă și folosește linkul primit pe email.')
        const token = body.token
        const password = body.password

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
        if (error instanceof ValidationError) return NextResponse.json({ message: error.message }, { status: 400 })
        console.error('Password reset error:', error)
        return NextResponse.json({ message: 'Eroare de server. Încearcă din nou.' }, { status: 500 })
    }
}
