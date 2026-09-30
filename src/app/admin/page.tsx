import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { getAdmin } from '@/lib/admin'
import { getKpis, STATS_CURRENCY, TYPE_LABELS, type Kpi } from '@/lib/stats'
import styles from './page.module.css'

// Pagina interna pentru proprietar (doar ADMIN_EMAILS, vezi lib/admin.ts): conturi, plati, incasari.
export const metadata: Metadata = {
    title: 'Admin',
    robots: { index: false, follow: false },
}
export const dynamic = 'force-dynamic'

const fmtDate = (d: Date) =>
    d.toLocaleString('ro-RO', { timeZone: 'Europe/Bucharest', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

const fmtMoney = (amount: number, currency: string = STATS_CURRENCY) =>
    `${amount.toLocaleString('ro-RO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ${currency.toUpperCase()}`

const fmtKpi = (k: Kpi, v: number) => (k.unit === 'money' ? fmtMoney(v) : v.toLocaleString('ro-RO'))

const typeLabel = (type: string | null | undefined) => (type ? TYPE_LABELS[type] ?? type : '–')

export default async function AdminPage() {
    const admin = await getAdmin()
    if (!admin) notFound()

    const [kpis, orders, users, unpaid] = await Promise.all([
        getKpis(),
        prisma.order.findMany({
            where: { status: 'completed' },
            orderBy: { createdAt: 'desc' },
            take: 100,
            select: {
                id: true,
                amount: true,
                currency: true,
                createdAt: true,
                invoiceSeries: true,
                invoiceNumber: true,
                invoiceLink: true,
                user: { select: { email: true, name: true } },
                event: { select: { type: true, template: true, title: true } },
            },
        }),
        prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100,
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                _count: { select: { events: true, orders: { where: { status: 'completed' } } } },
            },
        }),
        prisma.event.findMany({
            where: { isPaid: false, stripeSessionId: { not: null } },
            orderBy: { updatedAt: 'desc' },
            take: 30,
            select: { id: true, type: true, template: true, title: true, updatedAt: true, user: { select: { email: true } } },
        }),
    ])

    return (
        <main className={styles.page}>
            <h1 className={styles.title}>Admin</h1>
            <p className={styles.muted}>Conectat ca {admin.email}. Zile după ora României; plățile vin din comenzile aplicației.</p>

            <section className={styles.card}>
                <h2>Pe perioade</h2>
                <div className={styles.scroll}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Indicator</th>
                                <th className={styles.num}>Azi</th>
                                <th className={styles.num}>7 zile</th>
                                <th className={styles.num}>30 de zile</th>
                                <th className={styles.num}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {kpis.map((k) => (
                                <tr key={k.key}>
                                    <td>
                                        {k.label}
                                        {k.hint && <span className={styles.hint}>{k.hint}</span>}
                                    </td>
                                    {[k.today, k.d7, k.d30, k.total].map((v, i) => (
                                        <td key={i} className={styles.num}>{fmtKpi(k, v)}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className={styles.card}>
                <h2>Invitații plătite ({orders.length}{orders.length === 100 ? '+' : ''})</h2>
                <div className={styles.scroll}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Client</th>
                                <th>Ce a cumpărat</th>
                                <th className={styles.num}>Sumă</th>
                                <th>Factură</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((o) => (
                                <tr key={o.id}>
                                    <td className={styles.nowrap}>{fmtDate(o.createdAt)}</td>
                                    <td>
                                        {o.user.email}
                                        {o.user.name && <span className={styles.hint}>{o.user.name}</span>}
                                    </td>
                                    <td>
                                        {o.event ? `${typeLabel(o.event.type)} · ${o.event.template}` : 'Invitație (ștearsă)'}
                                        {o.event?.title && <span className={styles.hint}>{o.event.title}</span>}
                                    </td>
                                    <td className={styles.num}>{fmtMoney(o.amount, o.currency)}</td>
                                    <td>
                                        {o.invoiceNumber ? (
                                            o.invoiceLink ? (
                                                <a href={o.invoiceLink} target="_blank" rel="noreferrer">{o.invoiceSeries} {o.invoiceNumber}</a>
                                            ) : (
                                                `${o.invoiceSeries ?? ''} ${o.invoiceNumber}`
                                            )
                                        ) : (
                                            <span className={styles.muted}>fără factură</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr><td colSpan={5} className={styles.muted}>Nicio plată încă.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className={styles.card}>
                <h2>Checkout-uri neplătite</h2>
                <div className={styles.scroll}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Ultima modificare</th>
                                <th>Client</th>
                                <th>Invitație</th>
                            </tr>
                        </thead>
                        <tbody>
                            {unpaid.map((e) => (
                                <tr key={e.id}>
                                    <td className={styles.nowrap}>{fmtDate(e.updatedAt)}</td>
                                    <td>{e.user.email}</td>
                                    <td>
                                        {typeLabel(e.type)} · {e.template}
                                        <span className={styles.hint}>{e.title}</span>
                                    </td>
                                </tr>
                            ))}
                            {unpaid.length === 0 && (
                                <tr><td colSpan={3} className={styles.muted}>Niciun checkout neplătit.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className={styles.card}>
                <h2>Conturi noi (ultimele {users.length})</h2>
                <div className={styles.scroll}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Înregistrat</th>
                                <th>Email</th>
                                <th className={styles.num}>Invitații</th>
                                <th className={styles.num}>Plătite</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <td className={styles.nowrap}>{fmtDate(u.createdAt)}</td>
                                    <td>
                                        {u.email}
                                        {u.name && <span className={styles.hint}>{u.name}</span>}
                                    </td>
                                    <td className={styles.num}>{u._count.events}</td>
                                    <td className={styles.num}>{u._count.orders}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    )
}
