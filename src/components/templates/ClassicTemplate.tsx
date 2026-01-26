'use client'

import { useState } from 'react'
import styles from './ClassicTemplate.module.css'
import RSVPModal from '@/components/RSVPModal'
import { MapPin, Calendar, Clock } from 'lucide-react'

interface Props {
    id?: string
    title: string
    date: string // Expected format: "21 Iunie 2024" or full string
    location: string
    locationUrl?: string
    message: string
    eventType: string

    // Wedding specifics
    groomName?: string
    brideName?: string
    parentsGroom?: string
    parentsBride?: string
    godparents?: string

    // Baptism specifics
    childName?: string
    motherName?: string
    fatherName?: string
    godparentsBaptism?: string

    civilCeremonyTime?: string
    religiousCeremonyTime?: string
    partyTime?: string

    // General
    customFields?: { label: string, value: string }[]
    specialInstructions?: string
}

export default function ClassicTemplate({
    id, title, date, location, locationUrl, message, eventType = 'nunta',
    groomName, brideName, parentsGroom, parentsBride, godparents,
    childName, motherName, fatherName, godparentsBaptism,
    civilCeremonyTime, religiousCeremonyTime, partyTime,
    customFields, specialInstructions
}: Props) {

    const [showRSVP, setShowRSVP] = useState(false)

    // Helper to parse date string loosely if needed, or just display as is
    // Assuming date comes as a string, we might want to split it if it has a specific format, 
    // but for now we'll display chunks if possible or just the string.

    // Attempt to extract Day, Month, Year, DayName if standard format
    // But since the format can vary, we will try to just wrap it nicely.

    const isWedding = eventType === 'nunta'
    const isBaptism = eventType === 'botez'

    const primaryName1 = isWedding ? groomName : isBaptism ? childName : title
    const primaryName2 = isWedding ? brideName : null

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                {/* Decorative corners */}
                <div className={styles.decorationTopLeft}></div>
                <div className={styles.decorationTopRight}></div>
                <div className={styles.decorationBottomLeft}></div>
                <div className={styles.decorationBottomRight}></div>

                {/* Intro */}
                <p className={styles.intro}>
                    {message || "Cu inimile pline de emoție și bucurie, noi"}
                </p>

                {/* Names */}
                <div className={styles.names}>
                    {primaryName1 || "Mire"}
                    {primaryName2 && (
                        <>
                            <span className={styles.ampersand}>&</span>
                            {primaryName2}
                        </>
                    )}
                </div>

                {/* Subtext */}
                <div className={styles.quote}>
                    Dragostea ne-a adunat,
                    <br />
                    Un destin am îmbrățișat.
                </div>

                {/* Date Block: "sâmbătă | 17 | iunie 2023" style */}
                <div className={styles.dateBlock}>
                    <span className={styles.dayName}>Sâmbătă</span>
                    <span className={styles.dayNumber}>{date.match(/\d+/)?.[0] || "17"}</span>
                    <span className={styles.year}>{date.replace(/\d+/, '').trim() || "Iunie 2024"}</span>
                </div>

                {/* Parents Section */}
                {(parentsGroom || parentsBride || motherName || fatherName) && (
                    <div className={styles.section}>
                        <div className={styles.sectionTitle}>Alături ne vor fi părinții</div>
                        <div className={styles.namesList}>
                            {parentsGroom && <div>{parentsGroom}</div>}
                            {parentsBride && <div>{parentsBride}</div>}
                            {motherName && <div>{motherName} & {fatherName}</div>}
                        </div>
                    </div>
                )}

                {/* Godparents Section */}
                {(godparents || godparentsBaptism) && (
                    <div className={styles.section}>
                        <div className={styles.sectionTitle}>Și nașii</div>
                        <div className={styles.namesList} style={{ fontFamily: 'Great Vibes, cursive', fontSize: '1.8rem' }}>
                            {godparents || godparentsBaptism}
                        </div>
                    </div>
                )}

                {/* Timeline / schedule simplified */}
                <div className={styles.section} style={{ marginTop: '2rem' }}>
                    {civilCeremonyTime && <div><Clock size={14} /> Cununia Civilă: {civilCeremonyTime}</div>}
                    {religiousCeremonyTime && <div><Clock size={14} /> Cununia Religioasă: {religiousCeremonyTime}</div>}
                    {partyTime && <div><Clock size={14} /> Petrecere: {partyTime}</div>}
                </div>

                {/* Location */}
                <div className={styles.locationContainer}>
                    <div className={styles.locationIcon}>
                        {/* Simple icon or building illustration */}
                        <MapPin size={32} />
                    </div>
                    <div className={styles.locationText}>{location}</div>
                    {locationUrl && (
                        <a href={locationUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#8d6e63', textDecoration: 'underline', fontSize: '0.9rem' }}>
                            Vezi harta
                        </a>
                    )}
                </div>

                {specialInstructions && (
                    <div style={{ marginTop: '2rem', fontStyle: 'italic', fontSize: '0.9rem', color: '#777' }}>
                        {specialInstructions}
                    </div>
                )}

                {/* RSVP Button */}
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
