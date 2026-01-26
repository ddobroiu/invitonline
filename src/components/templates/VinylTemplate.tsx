'use client'

import { useState, useRef } from 'react'
import styles from './VinylTemplate.module.css'
import RSVPModal from '@/components/RSVPModal'
import { Play, Pause, Music, Disc, Calendar, MapPin, Users, Star, Navigation } from 'lucide-react'

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
    audioUrl?: string
    photoUrl?: string
}


export default function VinylTemplate({
    id, title, date, location, locationUrl, message, eventType = 'nunta',
    godparents, godparentsBaptism, parentsGroom, parentsBride,
    motherName, fatherName, birthDate, childAge,
    civilCeremonyTime, civilCeremonyLoc, religiousCeremonyTime, religiousCeremonyLoc,
    partyTime, partyLoc, churchTime, churchLoc, restaurantTime, restaurantLoc,
    age, partyType, theme, specialInstructions, dressCode,
    customFields, audioUrl, photoUrl
}: Props) {

    const [isPlaying, setIsPlaying] = useState(false)
    const [showRSVP, setShowRSVP] = useState(false)
    const audioRef = useRef<HTMLAudioElement>(null)

    // Handle play/pause toggle
    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause()
            } else {
                audioRef.current.play()
            }
            setIsPlaying(!isPlaying)
        } else {
            // If no audio, just toggle animation
            setIsPlaying(!isPlaying)
        }
    }

    let albumName = 'THE WEDDING ALBUM'
    if (eventType === 'botez') albumName = "BABY'S FIRST HITS"
    else if (eventType === 'petrecere') albumName = "PARTY ANTHEMS"

    return (
        <div className={styles.container}>
            <div className={styles.playerCard}>

                <div className={styles.vinylWrapper} onClick={togglePlayPause}>
                    <div className={`${styles.vinyl} ${isPlaying ? styles.playing : ''}`}>
                        <div className={styles.label}>
                            {photoUrl ? (
                                <img src={photoUrl} alt="Label" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                            ) : (
                                <div>
                                    <Disc size={20} style={{ marginBottom: '5px' }} />
                                    SIDE A<br />
                                    2026<br />
                                    {eventType === 'nunta' ? 'WDD' : 'BND'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.trackInfo}>
                    <h1 className={styles.trackTitle}>{title}</h1>
                    <p className={styles.artist}><Music size={14} style={{ display: 'inline', marginRight: '5px' }} /> {albumName}</p>

                    {isPlaying && (
                        <div className={styles.soundWave}>
                            {[...Array(15)].map((_, i) => (
                                <div key={i} className={styles.bar} style={{
                                    animationDelay: `${i * 0.05}s`,
                                    height: `${Math.random() * 30 + 10}px`
                                }}></div>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.controls}>
                    <button className={styles.playBtn} onClick={togglePlayPause}>
                        {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
                    </button>
                </div>

                {/* Hidden Audio Player */}
                {audioUrl && (
                    <audio
                        ref={audioRef}
                        src={audioUrl}
                        loop
                        onEnded={() => setIsPlaying(false)}
                        style={{ display: 'none' }}
                    />
                )}

                <div className={styles.details} style={{ width: '100%', textAlign: 'left', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <div style={{ fontSize: '0.7rem', color: '#888', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}><Star size={10} /> Track Info</div>
                            <p style={{ marginBottom: '5px' }}><Calendar size={12} /> {date}</p>
                            <p><MapPin size={12} /> {location}</p>
                            <p style={{ marginTop: '10px', fontStyle: 'italic', fontSize: '0.85rem' }}>"{message}"</p>
                        </div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                            <div style={{ fontSize: '0.7rem', color: '#888', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}><Users size={10} /> Distribuție (Credits)</div>

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
                            {dressCode && <div style={{ color: 'var(--accent)', marginTop: '5px' }}>Dress: {dressCode}</div>}


                            <div style={{ marginTop: '10px', color: 'var(--accent)', fontWeight: 800 }}>
                                {civilCeremonyTime && <div>Intro: {civilCeremonyTime} {civilCeremonyLoc && `(${civilCeremonyLoc})`}</div>}
                                {religiousCeremonyTime && <div>Cununie: {religiousCeremonyTime} {religiousCeremonyLoc && `(${religiousCeremonyLoc})`}</div>}
                                {partyTime && <div>Remix: {partyTime} {partyLoc && `(${partyLoc})`}</div>}
                                {churchTime && <div>Ceremony: {churchTime} {churchLoc && `(${churchLoc})`}</div>}
                                {restaurantTime && <div>Afterparty: {restaurantTime} {restaurantLoc && `(${restaurantLoc})`}</div>}
                            </div>
                            {specialInstructions && <div style={{ fontSize: '0.7rem', marginTop: '10px', opacity: 0.7 }}>Lyrics: {specialInstructions}</div>}
                        </div>
                    </div>
                </div>

                <button className={styles.rsvpBtn} onClick={() => setShowRSVP(true)}>
                    REZERVAȚI BILETELE (RSVP)
                </button>
                {locationUrl && (
                    <button
                        className={styles.rsvpBtn}
                        style={{ background: 'transparent', border: '1px solid #fff', marginTop: '10px' }}
                        onClick={() => window.open(locationUrl, '_blank')}
                    >
                        <Navigation size={16} style={{ display: 'inline', marginRight: '5px' }} /> NAVIGARE LOCAȚIE
                    </button>
                )}
            </div>

            <RSVPModal
                isOpen={showRSVP}
                onClose={() => setShowRSVP(false)}
                eventId={id}
            />
        </div>
    )
}
