'use client'

import { useState } from 'react'
import styles from './ClassicMinimalTemplate.module.css'
import RSVPModal from '@/components/RSVPModal'

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
    childName?: string
    specialInstructions?: string
}

export default function ClassicMinimalTemplate({
    id, title, date, location, locationUrl, message, eventType = 'nunta',
    groomName, brideName, childName, specialInstructions
}: Props) {
    const [showRSVP, setShowRSVP] = useState(false)
    const isWedding = eventType === 'nunta'
    const name1 = isWedding ? groomName : childName || title.split('&')[0]
    const name2 = isWedding ? brideName : title.split('&')[1]

    // Initials logic
    const getInitials = () => {
        const i1 = name1 ? name1.trim().charAt(0) : 'M'
        const i2 = name2 ? name2.trim().charAt(0) : ''
        return i2 ? `${i1} & ${i2}` : i1
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.initials}>{getInitials()}</div>

                <div className={styles.label}>SAVE THE DATE</div>
                <div className={styles.mainNames}>
                    {name1}
                    {name2 && <><br /><span style={{ fontSize: '1.5rem', fontStyle: 'italic', textTransform: 'lowercase', fontFamily: 'Montserrat, sans-serif' }}>and</span><br />{name2}</>}
                </div>

                <div className={styles.divider}></div>

                <div className={styles.infoBlock}>
                    <div className={styles.label}>WHEN</div>
                    <div className={styles.bigDate}>{date}</div>
                </div>

                <div className={styles.infoBlock}>
                    <div className={styles.label}>WHERE</div>
                    <div className={styles.value}>{location}</div>
                    {locationUrl && <a href={locationUrl} target="_blank" style={{ fontSize: '0.7rem', textDecoration: 'underline', color: '#888', marginTop: '5px', display: 'block' }}>MAP</a>}
                </div>

                <div className={styles.infoBlock}>
                    <div className={styles.value} style={{ fontStyle: 'italic', fontSize: '0.9rem', maxWidth: '300px', margin: '0 auto', color: '#555' }}>
                        "{message}"
                    </div>
                </div>

                <button className={styles.rsvpBtn} onClick={() => setShowRSVP(true)}>RSVP</button>
            </div>

            <RSVPModal
                isOpen={showRSVP}
                onClose={() => setShowRSVP(false)}
                eventId={id}
            />
        </div>
    )
}
