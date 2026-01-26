'use client'

import { useState } from 'react'
import styles from './PassportTemplate.module.css'
import { Plane, Globe, MapPin, Calendar, Heart, Baby, PartyPopper } from 'lucide-react'

interface PassportTemplateProps {
    title: string
    date: string
    location: string
    message?: string
    eventType?: string
    groomName?: string
    brideName?: string
    childName?: string
    celebrantName?: string
    customFields?: { label: string, value: string }[]
    photoUrl?: string
    // Extra details
    parentsGroom?: string
    parentsBride?: string
    godparents?: string
    motherName?: string
    fatherName?: string
    godparentsBaptism?: string
    civilCeremonyTime?: string
    religiousCeremonyTime?: string
    partyTime?: string
    churchTime?: string
    restaurantTime?: string
}


export default function PassportTemplate({
    id, title, date, location, locationUrl, message, eventType = 'nunta',
    groomName, brideName, childName, celebrantName,
    godparents, godparentsBaptism, parentsGroom, parentsBride,
    motherName, fatherName, birthDate, childAge,
    civilCeremonyTime, civilCeremonyLoc, religiousCeremonyTime, religiousCeremonyLoc,
    partyTime, partyLoc, churchTime, churchLoc, restaurantTime, restaurantLoc,
    age, partyType, theme, specialInstructions, dressCode,
    customFields, photoUrl
}: any) { // Use any briefly or fix interface if needed, but destructuring is key
    const [isOpen, setIsOpen] = useState(false)

    // Format fields for MRZ zone
    const mrzTitle = title.replace(/[^a-zA-Z]/g, '<<').toUpperCase()
    const mrzDate = date.replace(/[^0-9]/g, '').padEnd(6, '0').slice(0, 6)

    return (
        <div className={styles.passportWrapper}>
            <div
                className={`${styles.book} ${isOpen ? styles.open : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {/* --- RIGHT PAGE (STATIC BASE - VISAS / EXTRA INFO) --- */}
                <div className={styles.rightPage}>
                    <div className={styles.header} style={{ borderBottom: '1px dashed #999', marginBottom: '15px' }}>
                        <div className={styles.headerText}>VISAS / VIZE & MENTIUNI</div>
                        <div className={styles.headerText}>{date}</div>
                    </div>

                    <div className={styles.field}>
                        <div className={styles.fieldLabel}>Message / Mesaj</div>
                        <div className={styles.fieldValue} style={{ fontSize: '0.75rem', textTransform: 'none', fontStyle: 'italic', fontFamily: 'serif', letterSpacing: '0' }}>
                            "{message || 'Vă așteptăm cu drag!'}"
                        </div>
                    </div>

                    <div className={styles.stampsGrid}>
                        {(godparents || godparentsBaptism) && (
                            <div className={styles.stampBox}>
                                <div className={styles.stampLabel}>GODPARENTS / NAȘI</div>
                                <div className={styles.stampValue}>{godparents || godparentsBaptism}</div>
                            </div>
                        )}

                        {(parentsGroom || parentsBride) && (
                            <div className={styles.stampBox}>
                                <div className={styles.stampLabel}>PARENTS / PĂRINȚI</div>
                                <div className={styles.stampValue} style={{ fontSize: '0.65rem' }}>
                                    {parentsGroom}
                                    {parentsGroom && parentsBride && <br />}
                                    {parentsBride}
                                </div>
                            </div>
                        )}

                        {(groomName || brideName || childName || celebrantName) && (
                            <div className={styles.stampBox}>
                                <div className={styles.stampLabel}>CAST / DISTRIBUȚIE</div>
                                <div className={styles.stampValue} style={{ fontSize: '0.65rem' }}>
                                    {groomName} {groomName && brideName && '&'} {brideName}
                                    {childName || celebrantName}
                                </div>
                            </div>
                        )}

                        {(civilCeremonyTime || religiousCeremonyTime || partyTime || churchTime || restaurantTime) && (
                            <div className={styles.stampBox}>
                                <div className={styles.stampLabel}>SCHEDULE / PROGRAM</div>
                                <div className={styles.stampValue} style={{ fontSize: '0.6rem' }}>
                                    {civilCeremonyTime && <div>Civil: {civilCeremonyTime}</div>}
                                    {religiousCeremonyTime && <div>Religious: {religiousCeremonyTime}</div>}
                                    {churchTime && <div>Church: {churchTime}</div>}
                                    {partyTime && <div>Party: {partyTime}</div>}
                                    {restaurantTime && <div>Restaurant: {restaurantTime}</div>}
                                </div>
                            </div>
                        )}

                        {customFields && customFields.map((field: any, i: number) => (
                            field.label && field.value && (
                                <div key={i} className={styles.stampBox}>
                                    <div className={styles.stampLabel}>{field.label}</div>
                                    <div className={styles.stampValue}>{field.value}</div>
                                </div>
                            )
                        ))}
                    </div>

                    <div className={styles.officialStamp}>
                        ENTRY<br />PERMITTED<br />{date.split(' ')[0]}
                    </div>
                </div>

                {/* --- FLIPPER (FRONT & BACK) --- */}
                <div className={styles.flipper}>

                    {/* FRONT: COVER */}
                    <div className={styles.front}>
                        <div className={styles.coverGold}>
                            <div className={styles.coverTitle}>Pașaport</div>
                            <div className={styles.emblem}>
                                <Globe size={80} strokeWidth={1} />
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div className={styles.coverEvent}>
                                    {eventType === 'nunta' ? 'Nunta Noastră' :
                                        eventType === 'botez' ? 'Botez' :
                                            'Eveniment Special'}
                                </div>
                                <div style={{ color: '#d4af37', fontSize: '1.2rem', marginTop: '10px', fontFamily: 'var(--font-heading)' }}>
                                    {title}
                                </div>
                                <div style={{ color: '#d4af37', fontSize: '0.8rem', marginTop: '5px' }}>
                                    {date}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BACK: IDENTITY PAGE (LEFT) */}
                    <div className={styles.back}>
                        <div className={styles.header}>
                            <div>
                                <div className={styles.headerText}>Republica Dragostei</div>
                                <div className={styles.headerText}>Passport / Pașaport</div>
                            </div>
                            <Plane size={24} color="#333" />
                        </div>

                        <div className={styles.photoRow}>
                            <div className={styles.photoArea}>
                                {photoUrl ? (
                                    <img
                                        src={photoUrl}
                                        alt="Passport Photo"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <>
                                        {eventType === 'nunta' && <Heart size={30} color="#ccc" />}
                                        {eventType === 'botez' && <Baby size={30} color="#ccc" />}
                                        {!eventType && <PartyPopper size={30} color="#ccc" />}
                                    </>
                                )}
                            </div>
                            <div className={styles.fields}>
                                <div className={styles.field}>
                                    <div className={styles.fieldLabel}>Surname / Nume</div>
                                    <div className={styles.fieldValue}>{title.split('&')[0]?.trim()}</div>
                                </div>
                                <div className={styles.field}>
                                    <div className={styles.fieldLabel}>Given Names / Prenume</div>
                                    <div className={styles.fieldValue}>{title.split('&')[1]?.trim() || 'Invitat'}</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                            <div className={styles.field}>
                                <div className={styles.fieldLabel}>Nationality</div>
                                <div className={styles.fieldValue}>IUBIRE</div>
                            </div>
                            <div className={styles.field}>
                                <div className={styles.fieldLabel}>Date of Birth</div>
                                <div className={styles.fieldValue}>{date}</div>
                            </div>
                            <div className={styles.field} style={{ gridColumn: 'span 2' }}>
                                <div className={styles.fieldLabel}>Place of Issue / Locația</div>
                                <div className={styles.fieldValue} style={{ fontSize: '0.8rem' }}>{location.split(',')[0]}</div>
                            </div>
                        </div>

                        <div className={styles.mrz}>
                            P&lt;ROU{mrzTitle}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;<br />
                            {mrzDate}6M&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;01
                        </div>
                    </div>
                </div>
            </div>

            {!isOpen && <div className={styles.hint}>apasă pentru a deschide</div>}
        </div>
    )
}
