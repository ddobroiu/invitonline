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


export default function PassportTemplate(props: PassportTemplateProps) {
    const [isOpen, setIsOpen] = useState(false)

    // Format fields for MRZ zone
    const mrzTitle = props.title.replace(/[^a-zA-Z]/g, '<<').toUpperCase()
    const mrzDate = props.date.replace(/[^0-9]/g, '').padEnd(6, '0').slice(0, 6)

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
                        <div className={styles.headerText}>{props.date}</div>
                    </div>

                    <div className={styles.field}>
                        <div className={styles.fieldLabel}>Message / Mesaj</div>
                        <div className={styles.fieldValue} style={{ fontSize: '0.75rem', textTransform: 'none', fontStyle: 'italic', fontFamily: 'serif', letterSpacing: '0' }}>
                            "{props.message || 'Vă așteptăm cu drag!'}"
                        </div>
                    </div>

                    <div className={styles.stampsGrid}>
                        {(props.godparents || props.godparentsBaptism) && (
                            <div className={styles.stampBox}>
                                <div className={styles.stampLabel}>GODPARENTS / NAȘI</div>
                                <div className={styles.stampValue}>{props.godparents || props.godparentsBaptism}</div>
                            </div>
                        )}

                        {(props.parentsGroom || props.parentsBride) && (
                            <div className={styles.stampBox}>
                                <div className={styles.stampLabel}>PARENTS / PĂRINȚI</div>
                                <div className={styles.stampValue} style={{ fontSize: '0.65rem' }}>
                                    {props.parentsGroom}
                                    {props.parentsGroom && props.parentsBride && <br />}
                                    {props.parentsBride}
                                </div>
                            </div>
                        )}

                        {(props.civilCeremonyTime || props.religiousCeremonyTime || props.partyTime) && (
                            <div className={styles.stampBox}>
                                <div className={styles.stampLabel}>SCHEDULE / PROGRAM</div>
                                <div className={styles.stampValue} style={{ fontSize: '0.6rem' }}>
                                    {props.civilCeremonyTime && <div>Civil: {props.civilCeremonyTime}</div>}
                                    {props.religiousCeremonyTime && <div>Religious: {props.religiousCeremonyTime}</div>}
                                    {props.partyTime && <div>Party: {props.partyTime}</div>}
                                </div>
                            </div>
                        )}

                        {props.customFields && props.customFields.map((field, i) => (
                            field.label && field.value && (
                                <div key={i} className={styles.stampBox}>
                                    <div className={styles.stampLabel}>{field.label}</div>
                                    <div className={styles.stampValue}>{field.value}</div>
                                </div>
                            )
                        ))}
                    </div>

                    <div className={styles.officialStamp}>
                        ENTRY<br />PERMITTED<br />{props.date.split(' ')[0]}
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
                                    {props.eventType === 'nunta' ? 'Nunta Noastră' :
                                        props.eventType === 'botez' ? 'Botez' :
                                            'Eveniment Special'}
                                </div>
                                <div style={{ color: '#d4af37', fontSize: '1.2rem', marginTop: '10px', fontFamily: 'var(--font-heading)' }}>
                                    {props.title}
                                </div>
                                <div style={{ color: '#d4af37', fontSize: '0.8rem', marginTop: '5px' }}>
                                    {props.date}
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
                                {props.photoUrl ? (
                                    <img
                                        src={props.photoUrl}
                                        alt="Passport Photo"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <>
                                        {props.eventType === 'nunta' && <Heart size={30} color="#ccc" />}
                                        {props.eventType === 'botez' && <Baby size={30} color="#ccc" />}
                                        {!props.eventType && <PartyPopper size={30} color="#ccc" />}
                                    </>
                                )}
                            </div>
                            <div className={styles.fields}>
                                <div className={styles.field}>
                                    <div className={styles.fieldLabel}>Surname / Nume</div>
                                    <div className={styles.fieldValue}>{props.title.split('&')[0]?.trim()}</div>
                                </div>
                                <div className={styles.field}>
                                    <div className={styles.fieldLabel}>Given Names / Prenume</div>
                                    <div className={styles.fieldValue}>{props.title.split('&')[1]?.trim() || 'Invitat'}</div>
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
                                <div className={styles.fieldValue}>{props.date}</div>
                            </div>
                            <div className={styles.field} style={{ gridColumn: 'span 2' }}>
                                <div className={styles.fieldLabel}>Place of Issue / Locația</div>
                                <div className={styles.fieldValue} style={{ fontSize: '0.8rem' }}>{props.location.split(',')[0]}</div>
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
