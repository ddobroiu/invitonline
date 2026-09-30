import prisma from '@/lib/prisma'

/**
 * Cifrele aplicatiei pentru mydashboard.ro si pagina /admin (contractul comun din mydashboard.ro/lib/app-stats.ts:
 * { project, generatedAt, currency, kpi[], recent[] }). Zilele sunt cele din Romania.
 * Platile se numara doar din tabelul Order al aplicatiei (comenzi 'completed'), nu din contul Stripe.
 */

export type StatsPeriod = 'today' | 'd7' | 'd30' | 'total'

// Coloanele DateTime din Prisma sunt `timestamp` fara fus orar, in UTC: fiecare limita devine un timestamp UTC
const utc = (expr: string) => `((${expr}) at time zone 'UTC')`
const PERIODS: Record<StatsPeriod, string> = {
    today: utc("date_trunc('day', now() at time zone 'Europe/Bucharest') at time zone 'Europe/Bucharest'"),
    d7: utc("now() - interval '7 days'"),
    d30: utc("now() - interval '30 days'"),
    total: utc("'1970-01-01'::timestamptz"),
}

// Moneda in care se incaseaza invitatiile (src/lib/stripe.ts); comenzile in alta moneda nu intra in suma
export const STATS_CURRENCY = 'RON'

type KpiRow = {
    period: StatsPeriod
    users: number
    events: number
    payers: number
    newPayers: number
    orders: number
    revenue: number
    unpaid: number
    rsvps: number
    active: number
}

type EmailKpiRow = {
    period: StatsPeriod
    emailsSent: number
    emailsFailed: number
    unsubscribes: number
}

export type KpiKey = Exclude<keyof KpiRow, 'period'> | Exclude<keyof EmailKpiRow, 'period'>

export type Kpi = {
    key: KpiKey
    label: string
    unit: 'count' | 'money' | 'percent'
    hint?: string
    today: number
    d7: number
    d30: number
    total: number
}

type RecentRow = {
    at: Date
    kind: 'signup' | 'order'
    email: string
    eventType: string | null
    amount: number | null
}

/** Schema tabelelor (din ?schema= al DATABASE_URL). SQL-ul brut trebuie sa o numeasca explicit. */
export function schemaDb(): string {
    try {
        const schema = new URL(process.env.DATABASE_URL || '').searchParams.get('schema')
        return schema && /^[A-Za-z0-9_]+$/.test(schema) ? schema : 'public'
    } catch {
        return 'public'
    }
}

/** „a***@gmail.com”: destul ca sa recunosti un cont, fara adresa intreaga. */
export function maskEmail(email: string): string {
    const [user, domain] = String(email || '').split('@')
    if (!domain) return '***'
    return `${user.slice(0, 1)}***@${domain}`
}

export const TYPE_LABELS: Record<string, string> = { nunta: 'Nuntă', botez: 'Botez', aniversare: 'Aniversare', petrecere: 'Petrecere' }

export async function getKpis(): Promise<Kpi[]> {
    const s = `"${schemaDb()}"`
    const paid = `o.status = 'completed'`
    const parts = Object.entries(PERIODS).map(
        ([key, since]) => `
      select '${key}' as period,
        (select count(*) from ${s}."User" where "createdAt" >= ${since})::int as users,
        (select count(*) from ${s}."Event" where "createdAt" >= ${since})::int as events,
        (select count(distinct o."userId") from ${s}."Order" o where ${paid} and o."createdAt" >= ${since})::int as payers,
        (select count(*) from (select o."userId", min(o."createdAt") as first from ${s}."Order" o
                                where ${paid} group by o."userId") f
          where f.first >= ${since})::int as "newPayers",
        (select count(*) from ${s}."Order" o where ${paid} and o."createdAt" >= ${since})::int as orders,
        (select coalesce(sum(o.amount), 0) from ${s}."Order" o
          where ${paid} and upper(o.currency) = '${STATS_CURRENCY}' and o."createdAt" >= ${since})::float8 as revenue,
        (select count(*) from ${s}."Event" e
          where e."isPaid" = false and e."stripeSessionId" is not null and e."updatedAt" >= ${since})::int as unpaid,
        (select count(*) from ${s}."Guest" g
          where g.status in ('confirmed', 'declined') and coalesce(g."respondedAt", g."createdAt") >= ${since})::int as rsvps,
        (select count(distinct "userId") from ${s}."Event" where "updatedAt" >= ${since})::int as active`,
    )
    const [rows, emailRows] = await Promise.all([
        prisma.$queryRawUnsafe<KpiRow[]>(parts.join(' union all ')),
        getEmailKpiRows(),
    ])
    const byPeriod = Object.fromEntries(rows.map((r) => [r.period, r])) as Partial<Record<StatsPeriod, KpiRow>>
    const emailByPeriod = Object.fromEntries((emailRows ?? []).map((r) => [r.period, r])) as Partial<Record<StatsPeriod, EmailKpiRow>>

    const value = (period: StatsPeriod, key: KpiKey): number => {
        const r = { ...byPeriod[period], ...emailByPeriod[period] } as Record<string, unknown>
        return Number(r[key] ?? 0)
    }
    const row = (key: KpiKey, label: string, unit: Kpi['unit'], hint?: string): Kpi => ({
        key,
        label,
        unit,
        ...(hint && { hint }),
        today: value('today', key),
        d7: value('d7', key),
        d30: value('d30', key),
        total: value('total', key),
    })

    const emailKpis = emailRows
        ? [
              row('emailsSent', 'E-mailuri automate trimise', 'count', 'bun venit, ciornă, sfaturi, rezumat RSVP, revenire'),
              row('emailsFailed', 'E-mailuri eșuate', 'count', 'automate și confirmări de plată'),
              row('unsubscribes', 'Dezabonări', 'count', 'din linkul sau antetul e-mailurilor'),
          ]
        : []

    return [
        row('users', 'Conturi noi', 'count'),
        row('events', 'Invitații create', 'count', 'ciorne și invitații activate'),
        row('payers', 'Clienți plătitori', 'count', 'conturi cu cel puțin o plată în perioadă'),
        row('newPayers', 'Clienți plătitori noi', 'count', 'prima lor plată e în perioadă'),
        row('orders', 'Invitații plătite', 'count', 'comenzi confirmate în aplicație'),
        row('revenue', 'Încasat în aplicație', 'money', `comenzile din baza aplicației, în ${STATS_CURRENCY}`),
        row('unpaid', 'Checkout-uri neplătite', 'count', 'invitații trimise la plată, dar neactivate'),
        row('rsvps', 'Răspunsuri RSVP', 'count', 'invitați care au confirmat sau refuzat'),
        row('active', 'Utilizatori activi', 'count', 'au creat sau modificat o invitație'),
        ...emailKpis,
    ]
}

/**
 * Cifrele e-mailurilor pe perioade. null cand tabelele lipsesc (migrarea 20261001120000_lifecycle_emails
 * n-a rulat inca): restul statisticilor merg mai departe, fara randurile de e-mail.
 */
async function getEmailKpiRows(): Promise<EmailKpiRow[] | null> {
    const s = `"${schemaDb()}"`
    const parts = Object.entries(PERIODS).map(
        ([key, since]) => `
      select '${key}' as period,
        (select count(*) from ${s}."EmailLog" where error is null and kind <> 'payment_confirmation' and "sentAt" >= ${since})::int as "emailsSent",
        (select count(*) from ${s}."EmailLog" where error is not null and "sentAt" >= ${since})::int as "emailsFailed",
        (select count(*) from ${s}."EmailUnsubscribe" where "unsubscribedAt" >= ${since})::int as unsubscribes`,
    )
    try {
        return await prisma.$queryRawUnsafe<EmailKpiRow[]>(parts.join(' union all '))
    } catch (e) {
        console.error('[stats] cifrele e-mailurilor lipsesc:', e instanceof Error ? e.message : e)
        return null
    }
}

export type EmailKindStats = { kind: string; sent: number; sent7: number; sent30: number; failed: number; failed30: number; lastAt: Date | null }

/** Pentru sectiunea „E-mailuri” din /admin. null cand tabelele lipsesc. */
export async function getEmailAdminStats() {
    const s = `"${schemaDb()}"`
    const d7 = PERIODS.d7
    const d30 = PERIODS.d30
    try {
        const [kinds, unsub, optOut, failures, settings] = await Promise.all([
            prisma.$queryRawUnsafe<EmailKindStats[]>(`
          select kind,
            (count(*) filter (where error is null))::int as sent,
            (count(*) filter (where error is null and "sentAt" >= ${d7}))::int as sent7,
            (count(*) filter (where error is null and "sentAt" >= ${d30}))::int as sent30,
            (count(*) filter (where error is not null))::int as failed,
            (count(*) filter (where error is not null and "sentAt" >= ${d30}))::int as failed30,
            max("sentAt") as "lastAt"
          from ${s}."EmailLog" group by kind`),
            prisma.$queryRawUnsafe<{ total: number; d7: number; d30: number }[]>(`
          select count(*)::int as total,
            (count(*) filter (where "unsubscribedAt" >= ${d7}))::int as d7,
            (count(*) filter (where "unsubscribedAt" >= ${d30}))::int as d30
          from ${s}."EmailUnsubscribe"`),
            prisma.user.count({ where: { marketingOptOut: true } }),
            prisma.emailLog.findMany({
                where: { error: { not: null } },
                orderBy: { sentAt: 'desc' },
                take: 20,
                select: { id: true, email: true, kind: true, sentAt: true, error: true },
            }),
            prisma.emailSettings.findUnique({ where: { id: 1 } }),
        ])
        return {
            launchedAt: settings?.lifecycleLaunchedAt ?? null,
            kinds,
            unsubscribes: unsub[0] ?? { total: 0, d7: 0, d30: 0 },
            optedOut: optOut,
            failures,
        }
    } catch (e) {
        console.error('[stats] e-mailuri:', e instanceof Error ? e.message : e)
        return null
    }
}

export async function statsMydashboard() {
    const s = `"${schemaDb()}"`
    const [kpi, recent] = await Promise.all([
        getKpis(),
        prisma.$queryRawUnsafe<RecentRow[]>(`
      (select "createdAt" as at, 'signup' as kind, email, null::text as "eventType", null::float8 as amount
         from ${s}."User" order by "createdAt" desc limit 20)
      union all
      (select o."createdAt", 'order', u.email, e.type, o.amount
         from ${s}."Order" o join ${s}."User" u on u.id = o."userId" left join ${s}."Event" e on e.id = o."eventId"
        where o.status = 'completed'
        order by o."createdAt" desc limit 30)
      order by at desc
      limit 50
    `),
    ])

    return {
        project: 'invitonline',
        generatedAt: new Date().toISOString(),
        currency: STATS_CURRENCY,
        kpi,
        recent: recent.map((r) => ({
            at: new Date(r.at).toISOString(),
            title:
                r.kind === 'signup'
                    ? `Cont nou: ${maskEmail(r.email)}`
                    : `${r.eventType ? `Invitație ${(TYPE_LABELS[r.eventType] ?? r.eventType).toLowerCase()}` : 'Invitație'}: ${maskEmail(r.email)}`,
            detail: null,
            amount: r.amount === null ? null : Number(r.amount),
            ...(r.kind === 'order' ? { status: 'paid' } : {}),
        })),
    }
}
