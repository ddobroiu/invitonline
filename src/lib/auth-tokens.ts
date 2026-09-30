// One-time e-mail tokens: sign-in links ("login", 30 min) and password resets ("reset", 60 min).
// Only the SHA-256 of the token is stored. A token works once.
import { createHash, randomBytes } from 'node:crypto'
import prisma from '@/lib/prisma'

export type TokenPurpose = 'login' | 'reset'

const TTL_MINUTES: Record<TokenPurpose, number> = { login: 30, reset: 60 }
// At most this many links per e-mail address and purpose in RATE_WINDOW_MIN minutes
const RATE_LIMIT = 3
const RATE_WINDOW_MIN = 15

export function hashToken(raw: string): string {
    return createHash('sha256').update(raw).digest('hex')
}

export function normalizeEmail(email: unknown): string {
    return String(email ?? '').trim().toLowerCase()
}

export function isValidEmail(email: string): boolean {
    return email.length <= 200 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/** True when another link may be sent now (rate limit per address). */
export async function canSendToken(email: string, purpose: TokenPurpose): Promise<boolean> {
    const since = new Date(Date.now() - RATE_WINDOW_MIN * 60_000)
    const recent = await prisma.authToken.count({ where: { email, purpose, createdAt: { gte: since } } })
    return recent < RATE_LIMIT
}

// Password reset requests: at most 3 per address and 10 per IP address in an hour
const RESET_LIMIT_PER_EMAIL = 3
const RESET_LIMIT_PER_IP = 10
const RESET_WINDOW_MIN = 60

/** SHA-256 of the client IP (the IP itself is not stored). */
export function hashIp(ip: string | null | undefined): string | null {
    return ip ? createHash('sha256').update(`ip:${ip}`).digest('hex') : null
}

/** True when another reset request may be handled now (per address and per IP, last hour). */
export async function canRequestReset(email: string, ipHash: string | null): Promise<boolean> {
    const since = new Date(Date.now() - RESET_WINDOW_MIN * 60_000)
    const [byEmail, byIp] = await Promise.all([
        prisma.authToken.count({ where: { email, purpose: 'reset', createdAt: { gte: since } } }),
        ipHash ? prisma.authToken.count({ where: { ipHash, purpose: 'reset', createdAt: { gte: since } } }) : 0,
    ])
    return byEmail < RESET_LIMIT_PER_EMAIL && byIp < RESET_LIMIT_PER_IP
}

/** Creates a token and returns the raw value to put in the link. */
export async function createAuthToken(email: string, purpose: TokenPurpose, termsVersion?: string | null, ipHash?: string | null): Promise<string> {
    const raw = randomBytes(32).toString('base64url')
    await prisma.authToken.create({
        data: {
            email,
            purpose,
            tokenHash: hashToken(raw),
            termsVersion: termsVersion || null,
            ipHash: ipHash || null,
            expiresAt: new Date(Date.now() + TTL_MINUTES[purpose] * 60_000),
        },
    })
    return raw
}

/**
 * Marks the token used and returns it, or null when unknown, expired, already used or for another purpose.
 * The conditional update makes two simultaneous uses impossible.
 */
export async function consumeAuthToken(raw: string, purpose: TokenPurpose) {
    if (!raw || raw.length > 200) return null
    const tokenHash = hashToken(raw)
    const now = new Date()
    const res = await prisma.authToken.updateMany({
        where: { tokenHash, purpose, usedAt: null, expiresAt: { gt: now } },
        data: { usedAt: now },
    })
    if (res.count !== 1) return null
    return prisma.authToken.findUnique({ where: { tokenHash } })
}
