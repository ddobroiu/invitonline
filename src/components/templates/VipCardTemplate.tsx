'use client'

import { useState } from 'react'
import styles from './VipCardTemplate.module.css'
import RSVPModal from '@/components/RSVPModal'
import { Wifi, QrCode, CreditCard, Navigation, Star, ShieldCheck } from 'lucide-react'

interface Props {
    id?: string
    title: string
    date: string
    location: string
    locationUrl?: string
    message: string
    eventType?: string
    groomName?: string
    brideName?: string
    childName?: string
    celebrantName?: string
    parentsBride?: string
    parentsGroom?: string
    godparents?: string
    godparentsBaptism?: string
    motherName?: string
    fatherName?: string
    civilCeremonyTime?: string
    civilCeremonyLoc?: string
    religiousCeremonyTime?: string
    religiousCeremonyLoc?: string
    partyTime?: string
    partyLoc?: string
    churchTime?: string
    churchLoc?: string
    restaurantTime?: string
    restaurantLoc?: string
    customFields?: { label: string, value: string }[]
    photoUrl?: string
    dressCode?: string
    age?: string
}

export default function VipCardTemplate({
    id, title, date, location, locationUrl, message, eventType = 'nunta',
    groomName, brideName, childName, celebrantName,
    godparents, godparentsBaptism, parentsGroom, parentsBride,
    motherName, fatherName, birthDate, childAge,
    civilCeremonyTime, civilCeremonyLoc, religiousCeremonyTime, religiousCeremonyLoc,
    partyTime, partyLoc, churchTime, churchLoc, restaurantTime, restaurantLoc,
    age, partyType, theme, specialInstructions, dressCode,
    customFields, photoUrl
}: any) {
    const [isFlipped, setIsFlipped] = useState(false)
    const [showRSVP, setShowRSVP] = useState(false)

    // Format Date as Card Number: "2508 2026 0000 0000"
    // Extract numbers from date string usually looks like "25 August 2026"
    const year = date.match(/\d{4}/)?.[0] || '2026'

    // Simulate a card number based on event details
    const cardNumber = `0000 ${year} ${eventType === 'botez' ? 'BABY' : 'LOVE'} 8888`

    const handleFlip = () => {
        if (!showRSVP) {
            setIsFlipped(!isFlipped)
        }
    }

    // Determine background style if photo exists
    const cardStyle = photoUrl ? {
        backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url(${photoUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    } : {}

    return (
        <div className={styles.container}>
            <div className={styles.scene} onClick={handleFlip}>
                <div className={`${styles.card} ${isFlipped ? styles.isFlipped : ''}`}>

                    {/* --- FRONT FACE --- */}
                    <div className={`${styles.face} ${styles.front}`} style={cardStyle}>
                        <div className={styles.topRow}>
                            <div className={styles.bankName}>
                                {eventType === 'nunta' ? 'ROYAL WEDDING BANK' : 'PREMIUM EVENTS INC.'}
                            </div>
                            <Wifi size={24} color="rgba(255,255,255,0.4)" style={{ transform: 'rotate(90deg)' }} />
                        </div>

                        <div className={styles.chip}></div>

                        <div className={styles.number}>
                            {cardNumber}
                        </div>

                        <div className={styles.details}>
                            <div>
                                <div className={styles.label}>CARD HOLDER</div>
                                <div className={styles.value}>{title}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div className={styles.label}>VALID THRU</div>
                                <div className={styles.value}>{date.split(',')[0]}</div>
                            </div>
                        </div>

                        <div className={styles.logo}>
                            VIP ACCESS
                        </div>
                    </div>

                    {/* --- BACK FACE --- */}
                    <div className={`${styles.face} ${styles.back}`} style={cardStyle}>
                        <div className={styles.magneticStrip}></div>

                        <div className={styles.signatureRow}>
                            <div className={styles.signatureArea}>
                                {title}
                            </div>
                            <div className={styles.cvv}>
                                {partyTime ? partyTime.replace(':', '') : '1900'}
                            </div>
                        </div>

                        <div className={styles.backContent}>
                            <div style={{ flex: 1, paddingRight: '15px' }}>
                                <div className={styles.message}>
                                    <ShieldCheck size={12} style={{ marginRight: '5px', display: 'inline' }} />
                                    Exclusive access to the event at: <br />
                                    <strong>{location}</strong>
                                </div>
                                <div className={styles.message} style={{ marginTop: '5px', fontStyle: 'italic', opacity: 0.6 }}>
                                    "{message}"
                                </div>

                                <div style={{ marginTop: '5px', fontSize: '0.55rem', color: '#ccc', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                                    {groomName && <div><strong>Mire:</strong> {groomName}</div>}
                                    {brideName && <div><strong>Mireasă:</strong> {brideName}</div>}
                                    {childName && <div><strong>Copil:</strong> {childName}</div>}
                                    {celebrantName && <div><strong>Sărbătorit:</strong> {celebrantName}</div>}
                                    {(godparents || godparentsBaptism) && <div><strong>Nași:</strong> {godparents || godparentsBaptism}</div>}
                                    {parentsGroom && <div><strong>P. Mire:</strong> {parentsGroom}</div>}
                                    {parentsBride && <div><strong>P. Mireasă:</strong> {parentsBride}</div>}
                                </div>

                                <div style={{ marginTop: '5px', fontSize: '0.55rem', color: '#d4af37', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                                    {civilCeremonyTime && <div>Civil: {civilCeremonyTime}</div>}
                                    {religiousCeremonyTime && <div>Relig: {religiousCeremonyTime}</div>}
                                    {partyTime && <div>Party: {partyTime}</div>}
                                    {churchTime && <div>Church: {churchTime}</div>}
                                    {restaurantTime && <div>Restaurant: {restaurantTime}</div>}
                                </div>

                                {customFields && customFields.length > 0 && (
                                    <div style={{ marginTop: '5px', fontSize: '0.55rem', color: '#d4af37' }}>
                                        {customFields.map((f: any, i: number) => (
                                            <div key={i}>{f.label}: {f.value}</div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className={styles.actions}>
                                <div style={{ background: '#fff', padding: '3px', borderRadius: '4px' }}>
                                    <QrCode size={40} color="#000" />
                                </div>
                                <button
                                    className={styles.rsvpBtn}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setShowRSVP(true)
                                    }}
                                >
                                    RSVP
                                </button>
                                {locationUrl && (
                                    <button
                                        style={{
                                            background: 'transparent',
                                            border: '1px solid #666',
                                            color: '#ccc',
                                            padding: '2px 5px',
                                            fontSize: '0.5rem',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            window.open(locationUrl, '_blank')
                                        }}
                                    >
                                        <Navigation size={8} style={{ marginRight: '2px', display: 'inline' }} /> MAP
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div className={styles.instruction}>
                Apasa pe card pentru a-l intoarce ↻
            </div>

            <RSVPModal
                isOpen={showRSVP}
                onClose={() => setShowRSVP(false)}
                eventId={id}
            />
        </div>
    )
}
