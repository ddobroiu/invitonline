import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

/**
 * Acces la /admin: doar conturile ale caror adrese sunt in ADMIN_EMAILS (separate prin virgula).
 * Fara variabila, /admin nu exista pentru nimeni (404). Adresa se ia din baza de date (contul sesiunii), nu din token.
 * Atentie: inregistrarea nu verifica adresa de e-mail, deci contul pentru adresa din ADMIN_EMAILS trebuie
 * sa existe deja (creat de proprietar) inainte de a seta variabila.
 */
export function adminEmails(): string[] {
    return (process.env.ADMIN_EMAILS || '')
        .split(',')
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean)
}

/** Contul de admin logat, sau null (nelogat, variabila lipsa sau adresa nepermisa). */
export async function getAdmin(): Promise<{ id: string, email: string } | null> {
    const allowed = adminEmails()
    if (allowed.length === 0) return null
    const session = await getServerSession(authOptions)
    const userId = (session?.user as { id?: string } | undefined)?.id
    if (!userId) return null
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true } })
    if (!user || !allowed.includes(user.email.trim().toLowerCase())) return null
    return user
}
