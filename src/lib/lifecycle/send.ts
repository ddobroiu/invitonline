import prisma from '@/lib/prisma'
import { sendEmail, type Unsubscribe } from '@/lib/resend'
import { button, emailLayout } from '@/lib/emails'
import { COMPANY } from '@/config/legal'
import { escapeHtml, getSiteUrl } from '@/lib/utils'

/**
 * Trimiterea cu jurnal: fiecare e-mail din ciclul de viata se rezerva intai in EmailLog (cheia unica
 * „adresa:fel”, la rezumatul RSVP „adresa:fel:eveniment”), apoi pleaca. Daca inregistrarea si cronul
 * incearca acelasi e-mail in acelasi timp, doar unul primeste randul. O trimitere esuata isi elibereaza
 * cheia (NULL, in lib/resend.ts), ca sa poata fi reincercata. Id-ul randului (uuid aleator) devine linkul
 * de dezabonare din mesaj.
 */

export type EmailKind = 'welcome' | 'first_invitation' | 'draft_reminder' | 'post_purchase' | 'rsvp_summary' | 'reengage'

export const EMAIL_KINDS: EmailKind[] = ['welcome', 'first_invitation', 'draft_reminder', 'post_purchase', 'rsvp_summary', 'reengage']

export const KIND_LABELS: Record<string, string> = {
    welcome: 'Bun venit',
    first_invitation: 'Prima invitație (fără nicio ciornă)',
    draft_reminder: 'Ciornă neactivată',
    post_purchase: 'Sfaturi după plată',
    rsvp_summary: 'Rezumat RSVP înainte de eveniment',
    reengage: 'Revenire (o singură dată)',
    payment_confirmation: 'Confirmare plată (tranzacțional)',
}

/** Nu intra in regula „cel mult un e-mail la 48 de ore”. */
export const EXEMPT_FROM_SPACING: EmailKind[] = ['welcome']

/** Felurile a caror cheie de unicitate include si invitatia (o data pe eveniment platit, nu pe adresa). */
const PER_EVENT: EmailKind[] = ['rsvp_summary']

export interface Message {
    subject: string
    heading: string
    /** Paragrafe de text simplu; se scapa la randare. */
    paragraphs: string[]
    cta?: { label: string; url: string }
    footnote?: string
}

export type LoggedResult = 'sent' | 'failed' | 'duplicate'

export function unsubscribeLinks(logId: string): Unsubscribe {
    const base = getSiteUrl()
    return {
        pageUrl: `${base}/dezabonare?id=${logId}`,
        oneClickUrl: `${base}/api/dezabonare?id=${logId}`,
    }
}

export function renderMessage(m: Message, unsubscribe: Unsubscribe | null): { html: string; text: string } {
    const p = m.paragraphs.map((t) => `<p style="margin:0 0 14px;">${escapeHtml(t)}</p>`).join('')
    const cta = m.cta ? button(m.cta.url, m.cta.label) : ''
    const footnote = m.footnote ? `<p style="font-size:13px;color:#777;margin:18px 0 0;">${escapeHtml(m.footnote)}</p>` : ''
    const unsub = unsubscribe
        ? `<p style="font-size:12px;color:#999;margin:14px 0 0;border-top:1px solid #eee;padding-top:12px;">Nu mai vrei aceste e-mailuri? <a href="${escapeHtml(unsubscribe.pageUrl)}" style="color:#999;">Dezabonează-te</a>. Contul și invitațiile tale rămân neatinse; vei primi doar mesajele strict necesare (de exemplu, confirmarea unei plăți).</p>`
        : ''
    const html = emailLayout(m.heading, `${p}${cta}${footnote}${unsub}`)
    const text = [
        m.heading,
        '',
        ...m.paragraphs,
        m.cta ? `\n${m.cta.label}: ${m.cta.url}` : '',
        m.footnote ? `\n${m.footnote}` : '',
        '',
        `InvitOnline · ${getSiteUrl()} · ${COMPANY.email}`,
        unsubscribe ? `Dezabonare: ${unsubscribe.pageUrl}` : '',
    ].join('\n')
    return { html, text }
}

function isUniqueViolation(err: unknown): boolean {
    return typeof err === 'object' && err !== null && (err as { code?: unknown }).code === 'P2002'
}

export async function sendLogged(
    target: { email: string; kind: EmailKind; userId?: string | null; eventId?: string | null; withUnsubscribe?: boolean },
    build: () => Message,
): Promise<LoggedResult> {
    const email = target.email.trim().toLowerCase()
    const dedupeKey = PER_EVENT.includes(target.kind) && target.eventId
        ? `${email}:${target.kind}:${target.eventId}`
        : `${email}:${target.kind}`

    let logId: string
    try {
        const row = await prisma.emailLog.create({
            data: { email, kind: target.kind, dedupeKey, userId: target.userId ?? null, eventId: target.eventId ?? null },
            select: { id: true },
        })
        logId = row.id
    } catch (err) {
        if (isUniqueViolation(err)) return 'duplicate'
        throw err
    }

    const unsubscribe = target.withUnsubscribe === false ? null : unsubscribeLinks(logId)
    let message: Message
    try {
        message = build()
    } catch (error) {
        // `build` n-ar trebui sa arunce; daca o face, randul nu ramane „trimis”
        await prisma.emailLog.update({
            where: { id: logId },
            data: { error: (error instanceof Error ? error.message : String(error)).slice(0, 500), dedupeKey: null },
        })
        return 'failed'
    }
    const { html, text } = renderMessage(message, unsubscribe)
    const result = await sendEmail({
        to: email,
        subject: message.subject,
        html,
        text,
        replyTo: COMPANY.email,
        ...(unsubscribe && { unsubscribe }),
        log: { id: logId, kind: target.kind },
    })
    return result.success ? 'sent' : 'failed'
}
