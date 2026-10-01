import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'
import { LEGAL_VERSION } from '@/config/legal'
import { GOOGLE_TERMS_COOKIE } from '@/lib/google-auth-shared'

/**
 * „Continuă cu Google” fara adaptorul Prisma (sesiuni JWT, ca la e-mail + parola): contul se gaseste sau
 * se creeaza aici, in callbacks.signIn, iar callbacks.jwt pune in token id-ul contului nostru (nu „sub”-ul Google).
 *
 *   1. dupa googleId (contul Google legat deja) — merge si daca adresa Gmail s-a schimbat intre timp;
 *   2. dupa adresa de e-mail (fara diferente de litere mari/mici) — contul existent se leaga de Google,
 *      DOAR daca Google spune ca adresa e verificata (altfel oricine ar putea intra in contul altcuiva);
 *      daca adresa contului nu fusese dovedita niciodata (emailVerified NULL), parola lui se sterge: altfel
 *      cine a creat contul cu adresa altcuiva (inregistrarea nu verifica adresa) ar pastra accesul cu parola;
 *   3. cont nou — doar daca utilizatorul a bifat acordul cu Termenii (cookie-ul pus de buton); fara parola,
 *      cu acordul pentru e-mailurile cu sfaturi ca la inregistrarea cu parola (informarea e sub formular,
 *      refuzul e linkul de dezabonare din fiecare e-mail), deci intra in ciclul de viata (lib/lifecycle/run.ts).
 */

export const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)

type GoogleClaims = { email?: unknown; email_verified?: unknown; name?: unknown; picture?: unknown }

function isUniqueViolation(err: unknown): boolean {
    return typeof err === 'object' && err !== null && (err as { code?: unknown }).code === 'P2002'
}

/** Pagina din site spre care s-ar fi intors utilizatorul (din cookie-ul NextAuth), ca s-o pastram. */
async function pendingCallbackPath(): Promise<string | null> {
    const jar = await cookies()
    const raw = jar.get('__Secure-next-auth.callback-url')?.value ?? jar.get('next-auth.callback-url')?.value
    if (!raw) return null
    try {
        const url = new URL(raw, 'http://local')
        const path = url.pathname + url.search
        return path.startsWith('/') && !path.startsWith('//') && !path.startsWith('/login') ? path : null
    } catch {
        return null
    }
}

async function loginError(code: string, keepCallback = false): Promise<string> {
    const params = new URLSearchParams({ error: code })
    if (keepCallback) {
        params.set('tab', 'register')
        const cb = await pendingCallbackPath()
        if (cb) params.set('callbackUrl', cb)
    }
    return `/login?${params.toString()}`
}

/** true = poate intra; string = redirect catre /login cu eroarea. */
export async function resolveGoogleSignIn(claims: GoogleClaims | undefined, googleId: string): Promise<true | string> {
    const email = String(claims?.email ?? '').trim().toLowerCase()
    const verified = claims?.email_verified === true || claims?.email_verified === 'true'
    if (!googleId || !email || !verified) return loginError('GoogleUnverified')

    const picture = typeof claims?.picture === 'string' ? claims.picture.slice(0, 500) : null
    const now = new Date()

    // 1. Legat deja
    const linked = await prisma.user.findUnique({ where: { googleId }, select: { id: true, emailVerified: true } })
    if (linked) {
        if (!linked.emailVerified) await prisma.user.update({ where: { id: linked.id }, data: { emailVerified: now } })
        return true
    }

    // 2. Cont existent cu aceeasi adresa (verificata de Google): il legam
    const existing = await prisma.user.findFirst({
        where: { email: { equals: email, mode: 'insensitive' } },
        orderBy: { createdAt: 'asc' },
        select: { id: true, googleId: true, emailVerified: true, image: true },
    })
    if (existing) {
        if (existing.googleId && existing.googleId !== googleId) return loginError('GoogleOtherAccount')
        const res = await prisma.user.updateMany({
            where: { id: existing.id, googleId: null },
            data: {
                googleId,
                emailVerified: existing.emailVerified ?? now,
                image: existing.image ?? picture,
                // adresa nedovedita pana acum: parola (poate a altcuiva) nu mai deschide contul
                // si sesiunile deschise inainte cu ea nu mai sunt primite (lib/auth.ts)
                ...(existing.emailVerified ? {} : { password: null, passwordChangedAt: now }),
            },
        })
        if (res.count === 0) {
            // legat intre timp (alt tab): e bine doar daca e acelasi cont Google
            const again = await prisma.user.findUnique({ where: { id: existing.id }, select: { googleId: true } })
            if (again?.googleId !== googleId) return loginError('GoogleOtherAccount')
        }
        return true
    }

    // 3. Cont nou: doar cu acordul pentru Termeni, dat chiar inainte de click
    const jar = await cookies()
    if (jar.get(GOOGLE_TERMS_COOKIE)?.value !== LEGAL_VERSION) return loginError('GoogleTerms', true)

    const name = typeof claims?.name === 'string' ? claims.name.trim().slice(0, 120) || null : null
    let user: { id: string; email: string; name: string | null }
    try {
        user = await prisma.user.create({
            data: {
                email,
                password: null,
                name,
                googleId,
                emailVerified: now,
                image: picture,
                termsAcceptedAt: now,
                termsVersion: LEGAL_VERSION,
                // e-mailurile cu sfaturi: ca la inregistrarea cu parola (api/register), alegerea e facuta acum
                marketingOptOut: false,
                marketingChoiceAt: now,
            },
            select: { id: true, email: true, name: true },
        })
    } catch (err) {
        // creat in paralel (dublu click / alt tab): intra daca e acelasi cont Google
        if (isUniqueViolation(err)) {
            const again = await prisma.user.findUnique({ where: { googleId }, select: { id: true } })
            return again ? true : loginError('GoogleOtherAccount')
        }
        throw err
    }

    // Bun venit, o singura data (EmailLog, cheia adresa:welcome), cu link de dezabonare. Nu blocheaza intrarea in cont.
    try {
        const { sendWelcomeNow } = await import('@/lib/lifecycle/run')
        await sendWelcomeNow({ id: user.id, email: user.email, name: user.name })
    } catch (emailErr) {
        console.error('Welcome email (Google) failed:', emailErr)
    }
    return true
}

/** Contul nostru pentru un cont Google (dupa resolveGoogleSignIn). */
export function findGoogleUser(googleId: string) {
    return prisma.user.findUnique({ where: { googleId }, select: { id: true, email: true, name: true } })
}
