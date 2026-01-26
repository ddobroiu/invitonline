'use client'

import { useState, useRef } from 'react'
import styles from './FestivalTemplate.module.css'
import { Music, Zap, MapPin, Calendar, Clock, QrCode, Play, Pause } from 'lucide-react'

interface FestivalTemplateProps {
    title: string
    date: string
    location: string
    message?: string
    eventType?: string
    godparents?: string
    customFields?: { label: string, value: string }[]
    audioUrl?: string
    // Extra
    parentsGroom?: string
    parentsBride?: string
    motherName?: string
    fatherName?: string
    godparentsBaptism?: string
    civilCeremonyTime?: string
    religiousCeremonyTime?: string
    partyTime?: string
    churchTime?: string
    restaurantTime?: string
}


export default function FestivalTemplate(props: FestivalTemplateProps) {
    const mainTitle = props.title.toUpperCase()
    const [isPlaying, setIsPlaying] = useState(false)
    const audioRef = useRef<HTMLAudioElement>(null)

    const togglePlay = () => {
        if (!audioRef.current) return
        if (isPlaying) {
            audioRef.current.pause()
            setIsPlaying(false)
        } else {
            audioRef.current.play()
            setIsPlaying(true)
        }
    }

    return (
        <div className={styles.festivalWrapper}>
            <div className={styles.ticket}>
                <div className={styles.header}>
                    <div className={styles.festivalName}>
                        {props.eventType === 'nunta' ? 'THE WEDDING' : 'FESTIVAL'}
                    </div>

                    {props.audioUrl ? (
                        <button
                            onClick={togglePlay}
                            style={{
                                background: '#ffd700',
                                border: 'none',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: '#000',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                                zIndex: 10
                            }}
                        >
                            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                        </button>
                    ) : (
                        <div className={styles.ticketType}>OFFICIAL PASS / VIP ACCESS</div>
                    )}
                </div>

                {/* Audio Element */}
                <audio ref={audioRef} src={props.audioUrl} loop onEnded={() => setIsPlaying(false)} />

                <div className={styles.mainSection}>
                    <div className={styles.lineupTitle}>★ LINE-UP ★</div>

                    <div className={styles.performerGrid}>
                        <div className={styles.mainPerformer}>{mainTitle}</div>
                        <div className={styles.supportAct}>
                            {props.godparents && <div style={{ marginBottom: '5px' }}>★ SPECIAL GUESTS (NAȘI): {props.godparents.toUpperCase()} ★</div>}
                            {props.godparentsBaptism && <div style={{ marginBottom: '5px' }}>★ SPECIAL GUESTS (NAȘI): {props.godparentsBaptism.toUpperCase()} ★</div>}

                            {props.parentsGroom && <div style={{ display: 'inline-block', margin: '0 10px' }}>PROD. BY: {props.parentsGroom.toUpperCase()}</div>}
                            {props.parentsBride && <div style={{ display: 'inline-block', margin: '0 10px' }}>CO-PROD. BY: {props.parentsBride.toUpperCase()}</div>}

                            {props.customFields && props.customFields.map((field, i) => (
                                field.label && field.value && (
                                    <div key={i} style={{ display: 'inline-block', margin: '0 10px', fontSize: '0.7rem' }}>
                                        {field.label.toUpperCase()}: {field.value.toUpperCase()}
                                    </div>
                                )
                            ))}
                            {(!props.customFields && !props.godparents) && (
                                props.eventType === 'nunta' ? 'SPECIAL GUESTS: FAMILIA & PRIETENII' : 'FEATURING: GOOD VIBES ONLY'
                            )}
                        </div>

                        {/* Set Times */}
                        {(props.civilCeremonyTime || props.religiousCeremonyTime || props.partyTime) && (
                            <div style={{ marginTop: '15px', border: '1px solid rgba(255,255,255,0.3)', padding: '5px' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '5px' }}>SET TIMES</div>
                                <div style={{ fontSize: '0.7rem', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px' }}>
                                    {props.civilCeremonyTime && <span>CIVIL: {props.civilCeremonyTime}</span>}
                                    {props.religiousCeremonyTime && <span>RELIGIOUS: {props.religiousCeremonyTime}</span>}
                                    {props.partyTime && <span>PARTY: {props.partyTime}</span>}
                                </div>
                            </div>
                        )}

                    </div>

                    <div className={styles.infoLine}>
                        <div className={styles.infoBlock}>
                            <div className={styles.infoLabel}>LOCATION / STAGE</div>
                            <div className={styles.infoValue}>{props.location.split(',')[0]}</div>
                        </div>
                        <div className={styles.infoBlock} style={{ textAlign: 'right' }}>
                            <div className={styles.infoLabel}>DATE / TIME</div>
                            <div className={styles.infoValue}>{props.date}</div>
                        </div>
                    </div>

                    <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.8rem', opacity: 0.8, fontStyle: 'italic' }}>
                        "{props.message}"
                    </div>
                </div>

                <div className={styles.qrSection}>
                    <div className={styles.qrCode}>
                        <QrCode size={100} color="#fff" strokeWidth={1} />
                    </div>
                    <div style={{ color: '#333', fontSize: '0.6rem', fontWeight: 'bold' }}>SCAN FOR TICKET VALIDATION</div>
                    <div className={styles.barcode}></div>
                </div>
            </div>
        </div>
    )
}
