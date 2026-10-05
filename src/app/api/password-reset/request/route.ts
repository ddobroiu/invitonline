import { NextResponse, after } from 'next/server'
import prisma from '@/lib/prisma'
import { canRequestReset, createAuthToken, hashIp, isValidEmail, normalizeEmail } from '@/lib/auth-tokens'
import { resetPasswordEmail } from '@/lib/emails'
import { sendEmail } from '@/lib/resend'
import { clientIp } from '@/lib/tiktok-events'
import { getSiteUrl } from '@/lib/utils'
import { readJsonObject, ValidationError } from '@/lib/validation'

// Acelasi raspuns daca adresa are cont sau nu (nu dezvaluim cine are cont), si la depasirea limitei.
const SAME_ANSWER = {
    message: 'Dacă există un cont cu această adresă, îți trimitem în câteva minute un e-mail cu linkul pentru parola nouă. Verifică și dosarul Spam.',
}

export async function POST(req: Request) {
    try {
        const body = await readJsonObject(req)
        if (typeof body.email !== 'string') throw new ValidationError('Adresa de email nu este validă.')
        const email = normalizeEmail(body.email)
        if (!isValidEmail(email)) {
            return NextResponse.json({ message: 'Adresa de email nu este validă.' }, { status: 400 })
        }

        const ipHash = hashIp(clientIp(req.headers))
        if (!(await canRequestReset(email, ipHash))) return NextResponse.json(SAME_ANSWER)

        const user = await prisma.user.findFirst({
            where: { email: { equals: email, mode: 'insensitive' } },
            orderBy: { createdAt: 'asc' },
            select: { id: true, email: true },
        })

        // Randul se scrie si pentru adresele fara cont (link nefolosibil, nu pleaca niciun e-mail),
        // ca limita pe IP sa numere toate cererile.
        const token = await createAuthToken(email, 'reset', null, ipHash)

        if (user) {
            const link = `${getSiteUrl(req)}/resetare-parola?token=${encodeURIComponent(token)}`
            const { subject, html } = resetPasswordEmail(link)
            // Dupa raspuns, ca timpul de raspuns sa nu arate daca adresa are cont
            after(async () => {
                const res = await sendEmail({ to: user.email, subject, html, log: { kind: 'password_reset', userId: user.id } })
                if (!res.success) console.error('[password-reset] trimiterea a esuat pentru', user.id)
            })
        }

        return NextResponse.json(SAME_ANSWER)
    } catch (error) {
        if (error instanceof ValidationError) return NextResponse.json({ message: error.message }, { status: 400 })
        console.error('Password reset request error:', error)
        return NextResponse.json({ message: 'Eroare de server. Încearcă din nou.' }, { status: 500 })
    }
}
