import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { LEGAL_VERSION } from '@/config/legal'
import { readJsonObject, validateRegistration, ValidationError } from '@/lib/validation'

export async function POST(req: Request) {
    try {
        const body = await readJsonObject(req)
        const validationError = validateRegistration(body)
        if (validationError) return NextResponse.json({ message: validationError }, { status: 400 })
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
                // e-mailurile cu sfaturi: fara bifa de refuz, doar informarea sub formular (lib/lifecycle/consent.ts);
                // refuzul e linkul de dezabonare din fiecare e-mail (Legea 506/2004 art. 12 alin. 2)
                marketingOptOut: false,
                marketingChoiceAt: new Date(),
            }
        })

        // Bun venit, jurnalizat in EmailLog (lib/lifecycle); nu blocheaza crearea contului
        try {
            const { sendWelcomeNow } = await import('@/lib/lifecycle/run')
            await sendWelcomeNow({ id: user.id, email: user.email, name: user.name })
        } catch (emailErr) {
            console.error('Welcome email failed:', emailErr)
        }

        return NextResponse.json({ message: 'User created', userId: user.id }, { status: 201 })
    } catch (error) {
        if (error instanceof ValidationError) return NextResponse.json({ message: error.message }, { status: 400 })
        console.error('Register error:', error)
        return NextResponse.json({ message: 'Eroare de server. Încearcă din nou.' }, { status: 500 })
    }
}
