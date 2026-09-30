import prisma from '@/lib/prisma'
import {
    draftReminderMessage,
    firstInvitationMessage,
    postPurchaseMessage,
    reengageMessage,
    rsvpSummaryMessage,
    welcomeMessage,
} from './messages'
import { EMAIL_KINDS, EXEMPT_FROM_SPACING, sendLogged, type EmailKind, type LoggedResult, type Message } from './send'
import { daysUntil, eventInfo, hourRo, rsvpCounts, type EventInfo, type RsvpCounts } from './snapshot'

/**
 * Cronul e-mailurilor: cine ce primeste acum. Reguli, verificate la fiecare rulare:
 *   - doar conturile create dupa lansare (EmailSettings, pus de migrare); conturile vechi nu primesc nimic;
 *   - niciodata cui a bifat „Nu vreau…” la inregistrare, s-a dezabonat sau e in EmailUnsubscribe;
 *   - doar titularii de cont: invitatii care raspund la o invitatie (Guest) nu primesc niciodata marketing;
 *   - fiecare fel o singura data pe adresa (EmailLog.dedupeKey); rezumatul RSVP o data pe invitatie platita;
 *   - cel mult un e-mail la 48 de ore pe adresa, in afara de bun venit;
 *   - doar intre 09:00 si 20:00, ora Romaniei (bun venit oricand);
 *   - fiecare fel are o fereastra: dupa o pauza a cronului nu pleaca „ziua 1” cuiva care e de 10 zile in cont.
 */

const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR
const SPACING_MS = 48 * HOUR
const PAUSE_MS = 600
const MAX_FAILURES = 3
export const SEND_HOURS = { from: 9, to: 20 } as const

/** Ferestrele fiecarui fel (documentate si in pagina /admin). */
export const WINDOWS = {
    welcome: 'la înregistrare; reîncercat de cron în primele 2 zile',
    first_invitation: 'ziua 1–4 de la înregistrare, dacă nu există nicio invitație',
    draft_reminder: 'ciornă neactivată, la 4 ore – 7 zile de la ultima modificare, dacă evenimentul nu a trecut și nu s-a plătit nimic după',
    post_purchase: 'la 1–10 zile după prima plată, dacă evenimentul nu a trecut',
    rsvp_summary: 'cu 3–10 zile înainte de data invitației plătite (o dată pe invitație)',
    reengage: 'după 45 de zile fără activitate, dacă nu are un eveniment plătit care urmează (o singură dată)',
} satisfies Record<EmailKind, string>

interface History {
    sent: Set<string>
    failed: Map<string, number>
    lastSpacedAt: number | null
}

const historyKey = (kind: string, eventId?: string | null) => (kind === 'rsvp_summary' && eventId ? `${kind}:${eventId}` : kind)

async function histories(emails: string[]): Promise<Map<string, History>> {
    const map = new Map<string, History>()
    if (emails.length === 0) return map
    const logs = await prisma.emailLog.findMany({
        where: { email: { in: emails }, kind: { in: EMAIL_KINDS } },
        select: { email: true, kind: true, eventId: true, sentAt: true, error: true },
    })
    for (const log of logs) {
        const h = map.get(log.email) ?? { sent: new Set<string>(), failed: new Map<string, number>(), lastSpacedAt: null }
        const key = historyKey(log.kind, log.eventId)
        if (log.error) {
            h.failed.set(key, (h.failed.get(key) ?? 0) + 1)
        } else {
            h.sent.add(key)
            if (!EXEMPT_FROM_SPACING.includes(log.kind as EmailKind)) {
                h.lastSpacedAt = Math.max(h.lastSpacedAt ?? 0, log.sentAt.getTime())
            }
        }
        map.set(log.email, h)
    }
    return map
}

interface Job {
    kind: EmailKind
    email: string
    name: string | null
    userId: string
    event?: EventInfo
    rsvp?: RsvpCounts
    daysLeft?: number
    checkoutStarted?: boolean
    drafts?: number
}

async function collectJobs(now: number): Promise<{ jobs: Job[]; launchedAt: Date | null }> {
    const settings = await prisma.emailSettings.findUnique({ where: { id: 1 } })
    // Fara randul de lansare (migrarea n-a rulat), nu trimitem nimic.
    if (!settings) return { jobs: [], launchedAt: null }
    const launchedAt = settings.lifecycleLaunchedAt

    const unsubscribed = new Set((await prisma.emailUnsubscribe.findMany({ select: { email: true } })).map((u) => u.email.toLowerCase()))

    const users = await prisma.user.findMany({
        where: { createdAt: { gte: launchedAt }, marketingOptOut: false },
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            events: {
                select: {
                    id: true,
                    type: true,
                    title: true,
                    date: true,
                    location: true,
                    data: true,
                    isPaid: true,
                    stripeSessionId: true,
                    updatedAt: true,
                    guests: { select: { status: true, persons: true } },
                },
                orderBy: { updatedAt: 'desc' },
            },
            orders: { where: { status: 'completed' }, select: { createdAt: true, eventId: true }, orderBy: { createdAt: 'asc' } },
        },
        orderBy: { createdAt: 'asc' },
    })

    const history = await histories(users.map((u) => u.email.toLowerCase()))
    const jobs: Job[] = []
    const seen = new Set<string>()

    for (const u of users) {
        const email = u.email.trim().toLowerCase()
        if (unsubscribed.has(email) || seen.has(email)) continue
        const h = history.get(email)
        const can = (kind: EmailKind, eventId?: string) => {
            const key = historyKey(kind, eventId)
            return !h?.sent.has(key) && (h?.failed.get(key) ?? 0) < MAX_FAILURES
        }
        const age = now - u.createdAt.getTime()
        const base = { email, name: u.name, userId: u.id }
        const push = (job: Job) => {
            seen.add(email)
            jobs.push(job)
        }

        if (can('welcome') && age < 2 * DAY) {
            push({ ...base, kind: 'welcome' })
            continue
        }
        if (h?.lastSpacedAt && now - h.lastSpacedAt < SPACING_MS) continue

        const paid = u.events.filter((e) => e.isPaid)
        const drafts = u.events.filter((e) => !e.isPaid)
        const lastPaidAt = u.orders.length ? u.orders[u.orders.length - 1].createdAt.getTime() : null

        // 1. rezumat RSVP: cea mai apropiata invitatie platita, cu 3-10 zile inainte
        const upcoming = paid
            .map((e) => ({ e, info: eventInfo(e), days: daysUntil(eventInfo(e), now) }))
            .filter((x) => x.days !== null && x.days >= 3 && x.days <= 10 && can('rsvp_summary', x.e.id))
            .sort((a, b) => (a.days ?? 0) - (b.days ?? 0))[0]
        if (upcoming) {
            push({ ...base, kind: 'rsvp_summary', event: upcoming.info, rsvp: rsvpCounts(upcoming.e.guests), daysLeft: upcoming.days ?? 0 })
            continue
        }

        // 2. sfaturi dupa prima plata
        const first = u.orders[0]
        if (first && now - first.createdAt.getTime() >= DAY && now - first.createdAt.getTime() < 10 * DAY && can('post_purchase')) {
            const ev = paid.find((e) => e.id === first.eventId)
            const info = ev ? eventInfo(ev) : null
            const days = info ? daysUntil(info, now) : null
            if (ev && info && (days === null || days >= 0)) {
                push({ ...base, kind: 'post_purchase', event: info, rsvp: rsvpCounts(ev.guests) })
                continue
            }
        }

        // 3. ciorna neactivata (cosul abandonat): cea mai recent modificata, in fereastra
        if (can('draft_reminder')) {
            const draft = drafts.find((e) => {
                const idle = now - e.updatedAt.getTime()
                if (idle < 4 * HOUR || idle >= 7 * DAY) return false
                if (lastPaidAt && lastPaidAt >= e.updatedAt.getTime()) return false
                const days = daysUntil(eventInfo(e), now)
                return days === null || days >= 1
            })
            if (draft) {
                push({ ...base, kind: 'draft_reminder', event: eventInfo(draft), checkoutStarted: Boolean(draft.stripeSessionId) })
                continue
            }
        }

        // 4. nicio invitatie, la 1-4 zile de la inregistrare
        if (u.events.length === 0 && age >= DAY && age < 4 * DAY && can('first_invitation')) {
            push({ ...base, kind: 'first_invitation' })
            continue
        }

        // 5. revenire, o singura data
        const lastActivity = Math.max(u.createdAt.getTime(), ...u.events.map((e) => e.updatedAt.getTime()), lastPaidAt ?? 0)
        const hasUpcoming = paid.some((e) => {
            const d = daysUntil(eventInfo(e), now)
            return d !== null && d >= 0
        })
        if (now - lastActivity >= 45 * DAY && !hasUpcoming && can('reengage')) {
            push({ ...base, kind: 'reengage', drafts: drafts.length })
        }
    }

    const order: EmailKind[] = ['welcome', 'rsvp_summary', 'post_purchase', 'draft_reminder', 'first_invitation', 'reengage']
    jobs.sort((a, b) => order.indexOf(a.kind) - order.indexOf(b.kind))
    return { jobs, launchedAt }
}

function build(job: Job): Message {
    switch (job.kind) {
        case 'welcome':
            return welcomeMessage(job.name)
        case 'first_invitation':
            return firstInvitationMessage(job.name)
        case 'draft_reminder':
            return draftReminderMessage(job.name, job.event!, Boolean(job.checkoutStarted))
        case 'post_purchase':
            return postPurchaseMessage(job.name, job.event!, job.rsvp!)
        case 'rsvp_summary':
            return rsvpSummaryMessage(job.name, job.event!, job.rsvp!, job.daysLeft ?? 0)
        case 'reengage':
            return reengageMessage(job.name, job.drafts ?? 0)
    }
}

/** Chiar inainte de trimitere: s-a dezabonat intre timp? a platit ciorna intre timp? */
async function stillWanted(job: Job): Promise<boolean> {
    if (job.kind === 'welcome') return true
    const [user, unsub] = await Promise.all([
        prisma.user.findUnique({ where: { id: job.userId }, select: { marketingOptOut: true } }),
        prisma.emailUnsubscribe.findUnique({ where: { email: job.email }, select: { email: true } }),
    ])
    if (!user || user.marketingOptOut || unsub) return false
    if (job.kind === 'draft_reminder' && job.event) {
        const ev = await prisma.event.findUnique({ where: { id: job.event.id }, select: { isPaid: true } })
        if (!ev || ev.isPaid) return false
    }
    return true
}

export interface RunReport {
    dry: boolean
    launchedAt: string | null
    inSendingHours: boolean
    sendingHours: string
    due: Partial<Record<EmailKind, number>>
    sent: Partial<Record<EmailKind, number>>
    failed: Partial<Record<EmailKind, number>>
    /** in afara orelor de trimitere: raman pentru o rulare ulterioara */
    deferred: number
    skipped: number
    remaining: number
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** `now` doar pentru teste (cronul foloseste ceasul real). */
export async function runLifecycle({ dry, limit, now = Date.now() }: { dry: boolean; limit: number; now?: number }): Promise<RunReport> {
    const { jobs, launchedAt } = await collectJobs(now)
    const hour = hourRo(now)
    const inSendingHours = hour >= SEND_HOURS.from && hour < SEND_HOURS.to
    const report: RunReport = {
        dry,
        launchedAt: launchedAt?.toISOString() ?? null,
        inSendingHours,
        sendingHours: `${SEND_HOURS.from}:00–${SEND_HOURS.to}:00 Europe/Bucharest`,
        due: {},
        sent: {},
        failed: {},
        deferred: 0,
        skipped: 0,
        remaining: 0,
    }
    for (const job of jobs) report.due[job.kind] = (report.due[job.kind] ?? 0) + 1

    const sendable = inSendingHours ? jobs : jobs.filter((j) => j.kind === 'welcome')
    report.deferred = jobs.length - sendable.length

    if (dry) {
        report.remaining = sendable.length
        return report
    }

    const batch = sendable.slice(0, limit)
    report.remaining = sendable.length - batch.length

    for (const [index, job] of batch.entries()) {
        if (index > 0) await sleep(PAUSE_MS)

        let result: LoggedResult | 'skipped'
        try {
            result = (await stillWanted(job))
                ? await sendLogged({ email: job.email, kind: job.kind, userId: job.userId, eventId: job.event?.id ?? null }, () => build(job))
                : 'skipped'
        } catch (error) {
            console.error(`[lifecycle] ${job.kind} către ${job.email}:`, error)
            result = 'failed'
        }

        if (result === 'sent') report.sent[job.kind] = (report.sent[job.kind] ?? 0) + 1
        else if (result === 'failed') report.failed[job.kind] = (report.failed[job.kind] ?? 0) + 1
        else report.skipped += 1
    }

    return report
}

/**
 * La inregistrare: bun venit imediat, jurnalizat, fara sa astepte cronul. Pleaca si celor care au bifat
 * „Nu vreau…” (e mesajul despre contul creat, fara reclama), dar fara link de dezabonare la ei.
 */
export function sendWelcomeNow(user: { id: string; email: string; name: string | null; marketingOptOut: boolean }) {
    return sendLogged(
        { email: user.email, kind: 'welcome', userId: user.id, withUnsubscribe: !user.marketingOptOut },
        () => welcomeMessage(user.name),
    )
}
