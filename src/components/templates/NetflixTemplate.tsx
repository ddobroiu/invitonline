'use client'

import { useState } from 'react'
import styles from './NetflixTemplate.module.css'
import RSVPModal from '@/components/RSVPModal'
import { Play, Info, CheckCircle, Plus, Users, Calendar, MapPin, Navigation } from 'lucide-react'

interface Props {
    id?: string
    title: string
    date: string
    location: string
    locationUrl?: string
    message: string
    eventType: string
    childName?: string
    celebrantName?: string
    // Wedding
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
    age?: string
    partyType?: string
    theme?: string
    specialInstructions?: string
    dressCode?: string
    customFields?: { label: string, value: string }[]
    videoUrl?: string
    photoUrl?: string
}


export default function NetflixTemplate({
    id, title, date, location, locationUrl, message, eventType = 'nunta',
    groomName, brideName, childName, celebrantName,
    godparents, godparentsBaptism, parentsGroom, parentsBride,
    motherName, fatherName, birthDate, childAge,
    civilCeremonyTime, civilCeremonyLoc, religiousCeremonyTime, religiousCeremonyLoc,
    partyTime, partyLoc, churchTime, churchLoc, restaurantTime, restaurantLoc,
    age, partyType, theme, specialInstructions, dressCode,
    customFields, videoUrl, photoUrl
}: Props) {

    const [showRSVP, setShowRSVP] = useState(false)

    let genre = 'Romance'
    let ageRating = '12+'

    if (eventType === 'botez') {
        genre = 'Family'
        ageRating = 'All'
    } else if (eventType === 'petrecere') {
        genre = 'Reality TV'
        ageRating = '18+'
    }

    const segments = [
        civilCeremonyTime && { title: 'Cununia Civilă', time: civilCeremonyTime, icon: <CheckCircle size={32} />, desc: civilCeremonyLoc || 'Jurămintele oficiale.' },
        (religiousCeremonyTime || churchTime) && { title: 'Cununia Religioasă', time: religiousCeremonyTime || churchTime, icon: <MapPin size={32} />, desc: religiousCeremonyLoc || churchLoc || 'Binecuvântarea spirituală.' },
        (partyTime || restaurantTime) && { title: 'Marea Petrecere', time: partyTime || restaurantTime, icon: <Plus size={32} />, desc: partyLoc || restaurantLoc || 'Sărbătorim până dimineața!' }
    ].filter(Boolean) as any[]

    return (
        <div className={styles.netflixContainer}>
            <div
                className={styles.hero}
                style={{
                    backgroundImage: `linear-gradient(to top, #000 5%, transparent 95%), url("${photoUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2070'}")`
                }}
            >
                <div className={styles.heroContent}>
                    <div className={styles.nSeries}>{eventType.toUpperCase()} SERIES</div>
                    <h1 className={styles.title}>{title}</h1>

                    <div className={styles.meta}>
                        <span className={styles.match}>99% Match</span>
                        <span>{date.split(' ').pop()}</span>
                        <span className={styles.age}>{ageRating}</span>
                        <span>1 Season</span>
                        <span>{genre}</span>
                    </div>

                    <p className={styles.description}>
                        {message}
                        <br /><br />
                        <MapPin size={18} style={{ display: 'inline', marginRight: '5px' }} /> {location}
                        <br />
                        <Calendar size={18} style={{ display: 'inline', marginRight: '5px' }} /> {date}
                    </p>

                    <div className={styles.buttons}>
                        <button className={styles.playBtn} onClick={() => setShowRSVP(true)}>
                            <Play size={24} fill="currentColor" />
                            Confirmă Prezența
                        </button>
                        <button
                            className={styles.infoBtn}
                            onClick={() => document.getElementById('details')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            <Info size={24} />
                            Mai multe detalii
                        </button>
                        {locationUrl && (
                            <button className={styles.infoBtn} onClick={() => window.open(locationUrl, '_blank')}>
                                <Navigation size={24} />
                                Vezi Locația
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Video Section - If uploaded */}
            {videoUrl && (
                <section className={styles.episodes} style={{ paddingTop: '2rem', paddingBottom: '1rem' }}>
                    <h2 className={styles.sectionTitle}>🎬 Trailer Oficial</h2>
                    <div style={{
                        maxWidth: '900px',
                        margin: '0 auto',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
                    }}>
                        <video
                            controls
                            style={{
                                width: '100%',
                                display: 'block',
                                backgroundColor: '#000'
                            }}
                            poster="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=2070"
                        >
                            <source src={videoUrl} type="video/mp4" />
                            Browser-ul tău nu suportă redarea video.
                        </video>
                    </div>
                </section>
            )}

            <section id="details" className={styles.episodes}>
                <h2 className={styles.sectionTitle}>Episoadele Evenimentului</h2>
                <div className={styles.episodeList}>
                    {segments.map((seg, idx) => (
                        <div key={idx} className={styles.episodeCard}>
                            <div className={styles.episodeThumb}>
                                {seg.icon}
                            </div>
                            <div className={styles.episodeInfo}>
                                <div className={styles.episodeTime}>ORA {seg.time}</div>
                                <div className={styles.episodeTitle}>
                                    {idx + 1}. {seg.title}
                                </div>
                                <p className={styles.episodeDesc}>{seg.desc}</p>
                            </div>
                        </div>
                    ))}

                    <div className={styles.episodeCard} style={{ opacity: 0.9 }}>
                        <div className={styles.episodeThumb}><Users size={32} /></div>
                        <div className={styles.episodeInfo}>
                            <div className={styles.episodeTitle}>DISTRIBUȚIE SPECIALĂ (CAST)</div>
                            <div className={styles.episodeDesc}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '20px', marginTop: '10px' }}>
                                    {/* Explicit Cast Members */}
                                    {groomName && <div><strong>Mire:</strong><br />{groomName}</div>}
                                    {brideName && <div><strong>Mireasă:</strong><br />{brideName}</div>}
                                    {parentsGroom && <div><strong>Părinți Mire:</strong><br />{parentsGroom}</div>}
                                    {parentsBride && <div><strong>Părinți Mireasă:</strong><br />{parentsBride}</div>}
                                    {godparents && <div><strong>Nași:</strong><br />{godparents}</div>}

                                    {childName && <div><strong>Copil:</strong><br />{childName}</div>}
                                    {motherName && <div><strong>Mama:</strong><br />{motherName}</div>}
                                    {fatherName && <div><strong>Tata:</strong><br />{fatherName}</div>}
                                    {godparentsBaptism && <div><strong>Nași:</strong><br />{godparentsBaptism}</div>}

                                    {celebrantName && <div><strong>Sărbătorit:</strong><br />{celebrantName}</div>}
                                    {age && <div><strong>Vârstă:</strong><br />{age} ani</div>}

                                    {customFields && customFields.map((field, i) => (
                                        field.label && field.value && (
                                            <div key={i}>
                                                <strong>{field.label}:</strong><br />
                                                {field.value}
                                            </div>
                                        )
                                    ))}
                                    {dressCode && (
                                        <div>
                                            <strong>Dress Code:</strong><br />
                                            {dressCode}
                                        </div>
                                    )}
                                </div>
                                {specialInstructions && (
                                    <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                                        <strong>Notă:</strong> {specialInstructions}
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            <RSVPModal
                isOpen={showRSVP}
                onClose={() => setShowRSVP(false)}
                eventId={id}
            />
        </div>
    )
}
