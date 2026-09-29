import type { Metadata } from 'next'
import { cache } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/auth'
import InvitationView from './InvitationView'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

const getEvent = cache(async (id: string) => {
    try {
        return await prisma.event.findUnique({ where: { id } })
    } catch (error) {
        console.error('Invitation load error:', error)
        return null
    }
})

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params
    const event = await getEvent(id)
    if (!event || !event.isPaid) {
        return { title: 'Invitație', robots: { index: false, follow: false } }
    }
    const description = [event.date, event.location].filter(Boolean).join(' • ')
    return {
        title: event.title,
        description: event.message || description,
        robots: { index: false, follow: false },
        openGraph: {
            title: `Ești invitat: ${event.title}`,
            description: description || 'Deschide invitația și confirmă prezența.',
            type: 'website',
        },
    }
}

export default async function PublicInvitation({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const event = await getEvent(id)
    // Unknown link: real 404 status (not a 200 "not available" page)
    if (!event) notFound()
    const isOwner = (await getCurrentUserId()) === event.userId

    if (!event.isPaid && !isOwner) {
        return (
            <div className={styles.error}>
                <div className={styles.errorCard}>
                    <div className={styles.errorIcon}>✉️</div>
                    <h1>Invitația nu este disponibilă</h1>
                    <p>Link-ul nu există sau invitația nu a fost încă activată de organizator.</p>
                    <Link href="/" className={styles.homeLink}>Mergi la InvitOnline</Link>
                </div>
            </div>
        )
    }

    const { stripeSessionId: _s, userId: _u, ...publicEvent } = event
    return (
        <>
            {!event.isPaid && (
                <div className={styles.draftBanner}>
                    Previzualizare — invitația nu este activată, oaspeții nu o pot vedea încă.{' '}
                    <Link href="/dashboard">Activează din cont</Link>
                </div>
            )}
            <InvitationView event={JSON.parse(JSON.stringify(publicEvent))} />
        </>
    )
}
