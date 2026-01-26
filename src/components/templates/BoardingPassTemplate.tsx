'use client'

import { useState } from 'react'
import styles from './BoardingPassTemplate.module.css'
import RSVPModal from '@/components/RSVPModal'
import { Plane, Calendar, MapPin, User, Info, Users, Navigation } from 'lucide-react'

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


export default function BoardingPassTemplate({
    id, title, date, location, locationUrl, message, eventType = 'nunta',
    godparents, godparentsBaptism, parentsGroom, parentsBride,
    motherName, fatherName, birthDate, childAge,
    civilCeremonyTime, civilCeremonyLoc, religiousCeremonyTime, religiousCeremonyLoc,
    partyTime, partyLoc, churchTime, churchLoc, restaurantTime, restaurantLoc,
    age, partyType, theme, specialInstructions, dressCode,
    customFields
}: Props) {

    const [showRSVP, setShowRSVP] = useState(false)

    let airline = 'AIR LOVE'
    let fromCode = 'LOVE'
    let toCode = 'WED'

    if (eventType === 'botez') {
        airline = 'STORK AIR'
        fromCode = 'BABY'
        toCode = 'BAP'
    } else if (eventType === 'petrecere') {
        airline = 'PARTY JET'
        fromCode = 'GO'
        toCode = 'FUN'
    }

    return (
        <div className={styles.container}>
            <div className={styles.ticketWrapper}>
                <div className={styles.ticket}>

                    <div className={styles.mainSection}>
                        <div className={styles.header}>
                            <span className={styles.airline}><Plane size={24} style={{ marginRight: '8px' }} /> {airline}</span>
                            <span className={styles.classType}>FIRST CLASS</span>
                        </div>

                        <div className={styles.route}>
                            <div className={styles.cityCode}>
                                <div className={styles.code}>{fromCode}</div>
                                <div className={styles.cityName}>Origin</div>
                            </div>
                            <Plane className={styles.planeIcon} size={40} />
                            <div className={styles.cityCode}>
                                <div className={styles.code}>{toCode}</div>
                                <div className={styles.cityName}>Destination</div>
                            </div>
                        </div>

                        <div className={styles.detailsGrid}>
                            <div>
                                <div className={styles.detailLabel}><User size={12} /> Passenger</div>
                                <div className={styles.detailValue}>{title}</div>
                            </div>
                            <div>
                                <div className={styles.detailLabel}><Calendar size={12} /> Date / Time</div>
                                <div className={styles.detailValue}>{date}</div>
                            </div>
                            <div>
                                <div className={styles.detailLabel}><MapPin size={12} /> Gate / Lounge</div>
                                <div className={styles.detailValue}>{location}</div>
                            </div>
                        </div>

                        <div className={styles.extraDetails}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '10px' }}>
                                <div>
                                    <div className={styles.detailLabel}><Info size={12} /> Message</div>
                                    <div style={{ fontSize: '0.85rem' }}>{message}</div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div className={styles.detailLabel}><Users size={12} /> Flight Crew (Distribuție)</div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                                        {parentsGroom && <div><strong>P. Mire:</strong> {parentsGroom}</div>}
                                        {parentsBride && <div><strong>P. Mireasă:</strong> {parentsBride}</div>}
                                        {godparents && <div><strong>Nași:</strong> {godparents}</div>}

                                        {motherName && <div><strong>Mama:</strong> {motherName}</div>}
                                        {fatherName && <div><strong>Tata:</strong> {fatherName}</div>}
                                        {godparentsBaptism && <div><strong>Nași:</strong> {godparentsBaptism}</div>}

                                        {customFields && customFields.map((field, i) => (
                                            field.label && field.value && (
                                                <div key={i}><strong>{field.label}:</strong> {field.value}</div>
                                            )
                                        ))}
                                        {dressCode && <div style={{ color: '#2563eb', fontWeight: 800, marginTop: '5px' }}>Dress: {dressCode}</div>}
                                    </div>

                                </div>
                            </div>
                            {specialInstructions && (
                                <div style={{ marginTop: '10px', fontSize: '0.75rem', borderTop: '1px solid #eee', paddingTop: '8px' }}>
                                    <strong>Rules:</strong> {specialInstructions}
                                </div>
                            )}

                            <div style={{ marginTop: '15px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', fontSize: '0.75rem', fontWeight: 700 }}>
                                {civilCeremonyTime && <span style={{ color: '#2563eb' }}>Civilă: {civilCeremonyTime} {civilCeremonyLoc && `(${civilCeremonyLoc})`}</span>}
                                {religiousCeremonyTime && <span style={{ color: '#2563eb' }}>Religioasă: {religiousCeremonyTime} {religiousCeremonyLoc && `(${religiousCeremonyLoc})`}</span>}
                                {partyTime && <span style={{ color: '#2563eb' }}>Petrecere: {partyTime} {partyLoc && `(${partyLoc})`}</span>}
                                {churchTime && <span style={{ color: '#2563eb' }}>Biserică: {churchTime} {churchLoc && `(${churchLoc})`}</span>}
                                {restaurantTime && <span style={{ color: '#2563eb' }}>Local: {restaurantTime} {restaurantLoc && `(${restaurantLoc})`}</span>}
                            </div>
                        </div>
                    </div>

                    <div className={styles.stubSection}>
                        <div className={styles.stubTitle}>BOARDING PASS</div>

                        <div className={styles.qrCode}>
                            <div style={{
                                width: '100%',
                                height: '100%',
                                background: `url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(title)}') no-repeat center/cover`
                            }}></div>
                        </div>

                        <div style={{ width: '100%' }}>
                            <div className={styles.detailLabel} style={{ marginBottom: '8px' }}>Security Check Cleared</div>
                            <button className={styles.checkInBtn} onClick={() => setShowRSVP(true)}>
                                RSVP / CHECK-IN
                            </button>
                            {locationUrl && (
                                <button
                                    className={styles.checkInBtn}
                                    style={{ background: '#2563eb', marginTop: '8px' }}
                                    onClick={() => window.open(locationUrl, '_blank')}
                                >
                                    <Navigation size={14} style={{ display: 'inline', marginRight: '5px' }} /> VEZI LOCAȚIA
                                </button>
                            )}
                        </div>

                        <div className={styles.barcode}></div>
                    </div>

                </div>
            </div>

            <RSVPModal
                isOpen={showRSVP}
                onClose={() => setShowRSVP(false)}
                eventId={id}
            />
        </div>
    )
}
