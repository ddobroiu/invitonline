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
export const STATS_CURRENCY = 'EUR'

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

export type KpiKey = Exclude<keyof KpiRow, 'period'>

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
    const rows = await prisma.$queryRawUnsafe<KpiRow[]>(parts.join(' union all '))
    const byPeriod = Object.fromEntries(rows.map((r) => [r.period, r])) as Partial<Record<StatsPeriod, KpiRow>>

    const row = (key: KpiKey, label: string, unit: Kpi['unit'], hint?: string): Kpi => ({
        key,
        label,
        unit,
        ...(hint && { hint }),
        today: Number(byPeriod.today?.[key] ?? 0),
        d7: Number(byPeriod.d7?.[key] ?? 0),
        d30: Number(byPeriod.d30?.[key] ?? 0),
        total: Number(byPeriod.total?.[key] ?? 0),
    })

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
    ]
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
