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
    customFields?: { label: string, value: string }[]
    photoUrl?: string
    // Extra props for full compatibility
    parentsGroom?: string
    parentsBride?: string
    godparents?: string
    civilCeremonyTime?: string
    religiousCeremonyTime?: string
    partyTime?: string
    churchTime?: string
    restaurantTime?: string
}

export default function VipCardTemplate(props: Props) {
    const [isFlipped, setIsFlipped] = useState(false)
    const [showRSVP, setShowRSVP] = useState(false)

    // Format Date as Card Number: "2508 2026 0000 0000"
    // Extract numbers from date string usually looks like "25 August 2026"
    const year = props.date.match(/\d{4}/)?.[0] || '2026'

    // Simulate a card number based on event details
    const cardNumber = `0000 ${year} ${props.eventType === 'botez' ? 'BABY' : 'LOVE'} 8888`

    const handleFlip = () => {
        if (!showRSVP) {
            setIsFlipped(!isFlipped)
        }
    }

    // Determine background style if photo exists
    const cardStyle = props.photoUrl ? {
        backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url(${props.photoUrl})`,
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
                                {props.eventType === 'nunta' ? 'ROYAL WEDDING BANK' : 'PREMIUM EVENTS INC.'}
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
                                <div className={styles.value}>{props.title}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div className={styles.label}>VALID THRU</div>
                                <div className={styles.value}>{props.date.split(',')[0]}</div>
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
                                {props.title}
                            </div>
                            <div className={styles.cvv}>
                                {props.partyTime ? props.partyTime.replace(':', '') : '1900'}
                            </div>
                        </div>

                        <div className={styles.backContent}>
                            <div style={{ flex: 1, paddingRight: '15px' }}>
                                <p className={styles.message}>
                                    <ShieldCheck size={12} style={{ marginRight: '5px', display: 'inline' }} />
                                    This card grants exclusive access to the event located at: <br />
                                    <strong>{props.location}</strong>
                                </p>
                                <p className={styles.message} style={{ marginTop: '10px', fontStyle: 'italic', opacity: 0.6 }}>
                                    "{props.message}"
                                </p>

                                {props.customFields && props.customFields.length > 0 && (
                                    <div style={{ marginTop: '10px', fontSize: '0.6rem', color: '#d4af37' }}>
                                        {props.customFields.map((f, i) => (
                                            <div key={i}>{f.label}: {f.value}</div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className={styles.actions}>
                                <div style={{ background: '#fff', padding: '5px', borderRadius: '4px' }}>
                                    <QrCode size={50} color="#000" />
                                </div>
                                <button
                                    className={styles.rsvpBtn}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setShowRSVP(true)
                                    }}
                                >
                                    RSVP NOW
                                </button>
                                {props.locationUrl && (
                                    <button
                                        style={{
                                            background: 'transparent',
                                            border: '1px solid #666',
                                            color: '#ccc',
                                            padding: '4px 8px',
                                            fontSize: '0.6rem',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            window.open(props.locationUrl, '_blank')
                                        }}
                                    >
                                        <Navigation size={10} style={{ marginRight: '3px', display: 'inline' }} /> MAP
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
                eventId={props.id}
            />
        </div>
    )
}
