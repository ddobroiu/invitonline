import { AuthOptions, getServerSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { findGoogleUser, googleEnabled, resolveGoogleSignIn } from "@/lib/auth-google"

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const user = await prisma.user.findFirst({
                    where: { email: { equals: credentials.email.trim(), mode: 'insensitive' } }
                })

                if (!user) {
                    return null
                }

                if (!user.password) {
                    return null
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

                if (!isPasswordValid) {
                    return null
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                }
            }
        }),
        // „Continuă cu Google”: doar cu GOOGLE_CLIENT_ID si GOOGLE_CLIENT_SECRET (fara ele butonul nu apare)
        ...(googleEnabled
            ? [GoogleProvider({
                clientId: process.env.GOOGLE_CLIENT_ID!,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            })]
            : []),
    ],
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: '/login',
        // erorile (ex. Google anulat) ajung pe /login?error=…, cu mesaj in romana
        error: '/login',
    },
    callbacks: {
        async signIn({ account, profile }) {
            if (account?.provider !== 'google') return true
            return resolveGoogleSignIn(profile, account.providerAccountId)
        },
        async jwt({ token, account, user }) {
            if (user) {
                // Intrarea in cont (credentials sau Google): momentul ei, comparat mai jos cu passwordChangedAt
                token.authAt = Date.now()
                // La intrarea cu Google, token.sub ar fi id-ul Google: il inlocuim cu id-ul contului nostru
                // si punem adresa din cont (rutele cauta dupa session.user.email exact).
                if (account?.provider === 'google') {
                    const linked = await findGoogleUser(account.providerAccountId)
                    if (!linked) throw new Error('Google account not linked')
                    token.sub = linked.id
                    token.email = linked.email
                    token.name = linked.name ?? token.name
                }
                return token
            }
            // La fiecare citire a sesiunii: dupa o resetare a parolei (sau stergerea ei la legarea cu Google),
            // sesiunile deschise inainte nu mai sunt primite. Eroarea aici = NextAuth sterge cookie-ul, sesiune nula.
            if (!token.sub) throw new Error('Session without user')
            const current = await prisma.user.findUnique({ where: { id: token.sub }, select: { passwordChangedAt: true } })
            if (!current) throw new Error('Session user no longer exists')
            // tokenurile vechi n-au authAt: iat (secunde) e momentul emiterii sau al ultimei reinnoiri
            const authAt = typeof token.authAt === 'number' ? token.authAt : typeof token.iat === 'number' ? token.iat * 1000 : 0
            if (current.passwordChangedAt && authAt < current.passwordChangedAt.getTime()) throw new Error('Session revoked')
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.sub
            }
            return session
        }
    }
}

// Id of the logged-in user, or null
export async function getCurrentUserId(): Promise<string | null> {
    const session = await getServerSession(authOptions)
    return (session?.user as any)?.id ?? null
}
