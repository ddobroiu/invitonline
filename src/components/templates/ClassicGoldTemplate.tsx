'use client'

import { useState } from 'react'
import styles from './ClassicGoldTemplate.module.css'
import RSVPModal from '@/components/RSVPModal'
import { Crown } from 'lucide-react'

interface Props {
    id?: string
    title: string
    date: string
    location: string
    locationUrl?: string
    message: string
    eventType: string
    groomName?: string
    brideName?: string
    parentsGroom?: string
    parentsBride?: string
    godparents?: string
    childName?: string
    motherName?: string
    fatherName?: string
    godparentsBaptism?: string
    civilCeremonyTime?: string
    religiousCeremonyTime?: string
    partyTime?: string
    customFields?: { label: string, value: string }[]
    specialInstructions?: string
}

export default function ClassicGoldTemplate({
    id, title, date, location, locationUrl, message, eventType = 'nunta',
    groomName, brideName, parentsGroom, parentsBride, godparents,
    childName, motherName, fatherName, godparentsBaptism,
    civilCeremonyTime, religiousCeremonyTime, partyTime,
    customFields, specialInstructions
}: Props) {

    const [showRSVP, setShowRSVP] = useState(false)
    const isWedding = eventType === 'nunta'
    const isBaptism = eventType === 'botez'

    const name1 = isWedding ? groomName : isBaptism ? childName : title
    const name2 = isWedding ? brideName : null

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.borderFrame}></div>

                <div className={styles.headerIcon}>
                    <Crown size={24} strokeWidth={1} />
                </div>

                <div className={styles.intro}>
                    {message || "Vă invităm la evenimentul nostru special"}
                </div>

                <div className={styles.names}>
                    {name1 || "Mirele"}
                    {name2 && (
                        <>
                            <span className={styles.ampersand}>&</span>
                            {name2}
                        </>
                    )}
                </div>

                <div className={styles.dateSection}>
                    <div className={styles.dateDisplay}>{date}</div>
                    <div className={styles.locationDisplay}>{location}</div>
                </div>

                <div className={styles.detailsGrid}>
                    {(parentsGroom || parentsBride || motherName || fatherName) && (
                        <div className={styles.detailCol}>
                            <h3>Părinți</h3>
                            {parentsGroom && <div>{parentsGroom}</div>}
                            {parentsBride && <div>{parentsBride}</div>}
                            {motherName && <div>{motherName} & {fatherName}</div>}
                        </div>
                    )}

                    {(godparents || godparentsBaptism) && (
                        <div className={styles.detailCol}>
                            <h3>Nași</h3>
                            <div>{godparents || godparentsBaptism}</div>
                        </div>
                    )}
                </div>

                <div className={styles.detailsGrid} style={{ marginTop: '1rem' }}>
                    {civilCeremonyTime && (
                        <div className={styles.detailCol}>
                            <h3>Cununia Civilă</h3>
                            <div>Ora: {civilCeremonyTime}</div>
                        </div>
                    )}
                    {religiousCeremonyTime && (
                        <div className={styles.detailCol}>
                            <h3>Biserică</h3>
                            <div>Ora: {religiousCeremonyTime}</div>
                        </div>
                    )}
                    {partyTime && (
                        <div className={styles.detailCol}>
                            <h3>Petrece</h3>
                            <div>Ora: {partyTime}</div>
                        </div>
                    )}
                </div>

                {locationUrl && (
                    <div style={{ marginTop: '2rem', zIndex: 1 }}>
                        <a href={locationUrl} target="_blank" className={styles.locationDisplay} style={{ borderBottom: '1px solid #d4af37', paddingBottom: '2px' }}>
                            Vezi Harta Locației
                        </a>
                    </div>
                )}

                <button className={styles.rsvpButton} onClick={() => setShowRSVP(true)}>
                    Confirmă Prezența
                </button>
            </div>

            <RSVPModal
                isOpen={showRSVP}
                onClose={() => setShowRSVP(false)}
                eventId={id}
            />
        </div>
    )
}
