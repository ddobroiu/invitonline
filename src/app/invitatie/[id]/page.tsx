'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import EnvelopeTemplate from '@/components/templates/EnvelopeTemplate'
import NetflixTemplate from '@/components/templates/NetflixTemplate'
import BoardingPassTemplate from '@/components/templates/BoardingPassTemplate'
import VinylTemplate from '@/components/templates/VinylTemplate'
import ScratchTemplate from '@/components/templates/ScratchTemplate'
import PassportTemplate from '@/components/templates/PassportTemplate'
import NewspaperTemplate from '@/components/templates/NewspaperTemplate'
import CinemaTemplate from '@/components/templates/CinemaTemplate'
import FestivalTemplate from '@/components/templates/FestivalTemplate'
import ChatTemplate from '@/components/templates/ChatTemplate'
import StoryTemplate from '@/components/templates/StoryTemplate'
import VipCardTemplate from '@/components/templates/VipCardTemplate'
import ClassicTemplate from '@/components/templates/ClassicTemplate'
import ClassicGoldTemplate from '@/components/templates/ClassicGoldTemplate'
import ClassicMinimalTemplate from '@/components/templates/ClassicMinimalTemplate'
import styles from './page.module.css'

export default function PublicInvitation({ params }: { params: { id: string } }) {
    const [event, setEvent] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        const fetchInvitation = async () => {
            try {
                const res = await fetch(`/api/invitations/${params.id}`)
                if (res.ok) {
                    const data = await res.json()
                    setEvent({
                        ...data.event.data,
                        title: data.event.title,
                        date: data.event.date,
                        location: data.event.location,
                        locationUrl: data.event.locationUrl,
                        template: data.event.template,
                        message: data.event.message
                    })
                } else {
                    setError(true)
                }
            } catch (err) {
                setError(true)
            } finally {
                setLoading(false)
            }
        }
        fetchInvitation()
    }, [params.id])

    if (loading) return <div className={styles.loading}>Se încarcă invitația...</div>
    if (error) return <div className={styles.error}>Invitația nu a fost găsită sau nu este activată.</div>

    return (
        <main className={styles.publicContainer}>
            {event.template === 'envelope' && <EnvelopeTemplate id={params.id} {...event} />}
            {event.template === 'netflix' && <NetflixTemplate id={params.id} {...event} />}
            {event.template === 'boarding' && <BoardingPassTemplate id={params.id} {...event} />}
            {event.template === 'vinyl' && <VinylTemplate id={params.id} {...event} />}
            {event.template === 'scratch' && <ScratchTemplate id={params.id} {...event} />}
            {event.template === 'passport' && <PassportTemplate id={params.id} {...event} />}
            {event.template === 'news' && <NewspaperTemplate id={params.id} {...event} />}
            {event.template === 'cinema' && <CinemaTemplate id={params.id} {...event} />}
            {event.template === 'festival' && <FestivalTemplate id={params.id} {...event} />}
            {event.template === 'chat' && <ChatTemplate id={params.id} {...event} />}
            {event.template === 'story' && <StoryTemplate id={params.id} {...event} />}
            {event.template === 'vip' && <VipCardTemplate id={params.id} {...event} />}
            {event.template === 'classic' && <ClassicTemplate id={params.id} {...event} />}
            {event.template === 'classic-gold' && <ClassicGoldTemplate id={params.id} {...event} />}
            {event.template === 'classic-minimal' && <ClassicMinimalTemplate id={params.id} {...event} />}
        </main>
    )
}
