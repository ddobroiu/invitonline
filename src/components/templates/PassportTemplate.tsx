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
}


export default function PassportTemplate(props: PassportTemplateProps) {
    const [isOpen, setIsOpen] = useState(false)

    // Format fields for MRZ zone
    const mrzTitle = props.title.replace(/[^a-zA-Z]/g, '<<').toUpperCase()
    const mrzDate = props.date.replace(/[^0-9]/g, '').padEnd(6, '0').slice(0, 6)

    return (
        <div className={styles.passportWrapper}>
            <div
                className={`${styles.passport} ${isOpen ? styles.open : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {/* FRONT COVER */}
                <div className={styles.cover}>
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
                        </div>
                    </div>
                </div>

                {/* INSIDE DATA PAGE */}
                <div className={styles.inner}>
                    <div className={styles.dataPage}>
                        <div className={styles.header}>
                            <div>
                                <div className={styles.headerText}>Republica Dragostei</div>
                                <div className={styles.headerText}>Passport / Pașaport</div>
                            </div>
                            <Plane size={24} color="#333" />
                        </div>

                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div className={styles.photoArea}>
                                {props.photoUrl ? (
                                    <img
                                        src={props.photoUrl}
                                        alt="Passport Photo"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            borderRadius: '4px'
                                        }}
                                    />
                                ) : (
                                    <>
                                        {props.eventType === 'nunta' && <Heart size={40} color="#ccc" />}
                                        {props.eventType === 'botez' && <Baby size={40} color="#ccc" />}
                                        {props.eventType !== 'nunta' && props.eventType !== 'botez' && <PartyPopper size={40} color="#ccc" />}
                                        <div style={{ position: 'absolute', bottom: '5px', fontSize: '0.5rem' }}>PHOTO HERE</div>
                                    </>
                                )}
                            </div>

                            <div className={styles.fields}>
                                <div className={styles.field}>
                                    <div className={styles.fieldLabel}>Surname / Nume</div>
                                    <div className={styles.fieldValue}>{props.title.split('&')[0].trim()}</div>
                                </div>
                                <div className={styles.field}>
                                    <div className={styles.fieldLabel}>Given Names / Prenume</div>
                                    <div className={styles.fieldValue}>{props.title.split('&')[1]?.trim() || 'Invitat'}</div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.inputGrid} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div className={styles.field}>
                                <div className={styles.fieldLabel}>Date of Issue / Data</div>
                                <div className={styles.fieldValue}>{props.date}</div>
                            </div>
                            <div className={styles.field}>
                                <div className={styles.fieldLabel}>Authority / Locația</div>
                                <div className={styles.fieldValue}>{props.location.split(',')[0]}</div>
                            </div>
                        </div>

                        <div className={styles.field}>
                            <div className={styles.fieldLabel}>Message / Mesaj</div>
                            <div className={styles.fieldValue} style={{ fontSize: '0.7rem', textTransform: 'none', fontStyle: 'italic' }}>
                                "{props.message}"
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '10px', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '10px' }}>
                            {props.customFields && props.customFields.map((field, i) => (
                                field.label && field.value && (
                                    <div key={i} className={styles.field}>
                                        <div className={styles.fieldLabel}>{field.label}</div>
                                        <div className={styles.fieldValue} style={{ fontSize: '0.65rem' }}>{field.value}</div>
                                    </div>
                                )
                            ))}
                        </div>

                        <div className={styles.stamp}>
                            VIP<br />ACCESS<br />GRANTED
                        </div>


                        <div className={styles.mrz}>
                            P&lt;ROU{mrzTitle}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;<br />
                            {mrzDate}6M&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;01
                        </div>
                    </div>
                </div>
            </div>

            {!isOpen && (
                <div className={styles.instruction}>Apasă pentru a deschide</div>
            )}
        </div>
    )
}
