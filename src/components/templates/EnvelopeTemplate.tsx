'use client'

import { useState } from 'react'
import styles from './EnvelopeTemplate.module.css'
import RSVPModal from '@/components/RSVPModal'
import { Heart, Calendar, MapPin, Users, Music, Star, Navigation } from 'lucide-react'

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
    parentsGroom?: string
    parentsBride?: string
    godparents?: string
    civilCeremonyTime?: string
    civilCeremonyLoc?: string
    religiousCeremonyTime?: string
    religiousCeremonyLoc?: string
    partyTime?: string
    partyLoc?: string
    // Baptism
    motherName?: string
    fatherName?: string
    godparentsBaptism?: string
    birthDate?: string
    childAge?: string
    churchTime?: string
    churchLoc?: string
    restaurantTime?: string
    restaurantLoc?: string
    // Party
    celebrantName?: string
    age?: string
    partyType?: string
    theme?: string
    specialInstructions?: string
    dressCode?: string
    customFields?: { label: string, value: string }[]
}

export default function EnvelopeTemplate({
    id, title, date, location, locationUrl, message, eventType = 'nunta',
    godparents, godparentsBaptism, parentsGroom, parentsBride,
    civilCeremonyTime, civilCeremonyLoc, religiousCeremonyTime, religiousCeremonyLoc,
    partyTime, partyLoc, churchTime, churchLoc, restaurantTime, restaurantLoc,
    motherName, fatherName, birthDate, childAge,
    age, partyType, theme, specialInstructions, dressCode,
    customFields
}: Props) {
    const [isOpen, setIsOpen] = useState(false)
    const [showRSVP, setShowRSVP] = useState(false)

    const handleConfirm = (e: React.MouseEvent) => {
        e.stopPropagation()
        setShowRSVP(true)
    }

    return (
        <div className={styles.container}>
            <div
                className={`${styles.envelopeWrapper} ${isOpen ? styles.open : ''}`}
                onClick={() => !showRSVP && setIsOpen(!isOpen)}
            >
                <div className={styles.interior}></div>
                <div className={styles.flap}></div>
                <div className={styles.pocket}></div>

                <div className={styles.card}>
                    <Heart size={32} style={{ color: '#d4af37', marginBottom: '10px' }} />
                    <h1 className={styles.title}>{title}</h1>
                    <div className={styles.date}><Calendar size={16} style={{ display: 'inline', marginRight: '5px' }} /> {date}</div>

                    <p className={styles.message}>{message}</p>
                    <p className={styles.location}><MapPin size={16} style={{ display: 'inline', marginRight: '5px' }} /> {location}</p>

                    <div className={styles.extraDetails} style={{ marginTop: '20px', textAlign: 'left', width: '100%', fontSize: '0.8rem', color: '#666' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <div style={{ fontWeight: 800, color: '#b8860b', borderBottom: '1px solid #eee', marginBottom: '4px' }}><Users size={12} /> Distribuție</div>

                                {/* Wedding Details */}
                                {parentsGroom && <div><strong>Părinți Mire:</strong> {parentsGroom}</div>}
                                {parentsBride && <div><strong>Părinți Mireasă:</strong> {parentsBride}</div>}
                                {godparents && <div><strong>Nași:</strong> {godparents}</div>}

                                {/* Baptism Details */}
                                {motherName && <div><strong>Mama:</strong> {motherName}</div>}
                                {fatherName && <div><strong>Tata:</strong> {fatherName}</div>}
                                {godparentsBaptism && <div><strong>Nași:</strong> {godparentsBaptism}</div>}

                                {customFields && customFields.map((field, i) => (
                                    field.label && field.value && (
                                        <div key={i}><strong>{field.label}:</strong> {field.value}</div>
                                    )
                                ))}

                                {dressCode && <div style={{ marginTop: '8px', color: '#d4af37' }}><strong>Dress Code:</strong> {dressCode}</div>}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <div style={{ fontWeight: 800, color: '#b8860b', borderBottom: '1px solid #eee', marginBottom: '4px' }}><Star size={12} /> Program</div>
                                {civilCeremonyTime && (
                                    <div>
                                        <strong>Civilă:</strong> {civilCeremonyTime}<br />
                                        <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>{civilCeremonyLoc}</span>
                                    </div>
                                )}
                                {religiousCeremonyTime && (
                                    <div style={{ marginTop: '4px' }}>
                                        <strong>Religioasă:</strong> {religiousCeremonyTime}<br />
                                        <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>{religiousCeremonyLoc}</span>
                                    </div>
                                )}
                                {(churchTime || churchLoc) && (
                                    <div style={{ marginTop: '4px' }}>
                                        <strong>Biserică:</strong> {churchTime}<br />
                                        <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>{churchLoc}</span>
                                    </div>
                                )}
                                {partyTime && (
                                    <div style={{ marginTop: '4px' }}>
                                        <strong>Petrecere:</strong> {partyTime}<br />
                                        <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>{partyLoc}</span>
                                    </div>
                                )}
                                {(restaurantTime || restaurantLoc) && (
                                    <div style={{ marginTop: '4px' }}>
                                        <strong>Local:</strong> {restaurantTime}<br />
                                        <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>{restaurantLoc}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        {specialInstructions && (
                            <div style={{ marginTop: '10px', fontSize: '0.75rem', background: '#f9f9f9', padding: '8px', borderRadius: '4px' }}>
                                <strong>Notă:</strong> {specialInstructions}
                            </div>
                        )}
                        {theme && <div style={{ marginTop: '5px' }}><strong>Tematică:</strong> {theme}</div>}
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button
                            className={styles.confirmButton}
                            onClick={handleConfirm}
                            style={{ marginTop: 0 }}
                        >
                            Confirmă Prezența
                        </button>
                        {locationUrl && (
                            <button
                                className={styles.confirmButton}
                                style={{ background: '#d4af37', color: '#000', marginTop: 0 }}
                                onClick={(e) => { e.stopPropagation(); window.open(locationUrl, '_blank') }}
                            >
                                <Navigation size={16} style={{ display: 'inline', marginRight: '5px' }} /> Locație
                            </button>
                        )}
                    </div>
                    <div style={{ marginTop: '10px' }}>
                        <Music size={14} style={{ color: '#ccc' }} />
                    </div>
                </div>
            </div>

            <RSVPModal
                isOpen={showRSVP}
                onClose={() => setShowRSVP(false)}
                eventId={id}
            />

            {!isOpen && (
                <p style={{
                    position: 'absolute',
                    bottom: '10%',
                    color: '#d4af37',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}
                    onClick={() => setIsOpen(true)}
                >
                    <Heart size={20} /> Desfă invitația magică
                </p>
            )}
        </div>
    )
}
