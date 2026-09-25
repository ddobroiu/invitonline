'use client'

import { useRef, useState } from 'react'
import styles from './NetflixTemplate.module.css'
import RSVPModal from '@/components/RSVPModal'
import { Play, Info, CheckCircle, Plus, Users, Calendar, MapPin, Navigation, Church, PartyPopper } from 'lucide-react'
import {
    str, getMapUrl, getWazeUrl, getMainNames, splitNames, getSchedule, parseDate, validCustomFields, eventLabel, CustomField,
} from './templateUtils'

interface Props {
    id?: string
    title?: string
    date?: string
    location?: string
    locationUrl?: string
    message?: string
    eventType?: string
    childName?: string
    celebrantName?: string
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
    motherName?: string
    fatherName?: string
    godparentsBaptism?: string
    churchTime?: string
    churchLoc?: string
    restaurantTime?: string
    restaurantLoc?: string
    age?: string
    specialInstructions?: string
    dressCode?: string
    customFields?: CustomField[]
    videoUrl?: string
    photoUrl?: string
}

const SEGMENT_META: Record<string, { icon: React.ReactNode, desc: string }> = {
    civil: { icon: <CheckCircle size={32} />, desc: 'Jurămintele oficiale.' },
    religious: { icon: <Church size={32} />, desc: 'Binecuvântarea spirituală.' },
    church: { icon: <Church size={32} />, desc: 'Taina Sfântului Botez.' },
    party: { icon: <PartyPopper size={32} />, desc: 'Sărbătorim până dimineața!' },
    main: { icon: <Calendar size={32} />, desc: 'Premiera mult așteptată.' },
    restaurant: { icon: <Plus size={32} />, desc: 'Masa festivă și distracție.' },
}

export default function NetflixTemplate(props: Props) {
    const {
        id, date, location, locationUrl, message, eventType = 'nunta',
        groomName, brideName, childName, celebrantName,
        godparents, godparentsBaptism, parentsGroom, parentsBride,
        motherName, fatherName, age, specialInstructions, dressCode,
        customFields, videoUrl, photoUrl,
    } = props

    const [showRSVP, setShowRSVP] = useState(false)
    const detailsRef = useRef<HTMLElement>(null)

    let genre = 'Romantic'
    let ageRating = '12+'
    if (eventType === 'botez') {
        genre = 'Familie'
        ageRating = 'AG'
    } else if (eventType === 'petrecere') {
        genre = 'Reality show'
        ageRating = '18+'
    } else if (eventType === 'aniversare') {
        genre = 'Comedie'
        ageRating = '15+'
    }

    const names = getMainNames(props)
    const nameParts = splitNames(names)
    const year = parseDate(date).year
    const mapUrl = getMapUrl(location, locationUrl)
    const wazeUrl = getWazeUrl(location)
    const baseSchedule = getSchedule(props)
    // Without a detailed program, show the event itself as the single "episode".
    const schedule = baseSchedule.length > 0
        ? baseSchedule
        : (str(location) || str(date))
            ? [{ key: 'main', label: eventLabel(eventType), time: '', loc: [str(date), str(location)].filter(Boolean).join(' · ') }]
            : []
    const fields = validCustomFields(customFields)
    const isWedding = eventType === 'nunta' || !eventType
    const isBaptism = eventType === 'botez'

    const cast: { label: string, value: string }[] = []
    if (isWedding) {
        if (str(groomName)) cast.push({ label: 'Mire', value: str(groomName) })
        if (str(brideName)) cast.push({ label: 'Mireasă', value: str(brideName) })
        if (str(parentsGroom)) cast.push({ label: 'Părinții mirelui', value: str(parentsGroom) })
        if (str(parentsBride)) cast.push({ label: 'Părinții miresei', value: str(parentsBride) })
        if (str(godparents)) cast.push({ label: 'Nași', value: str(godparents) })
    } else if (isBaptism) {
        if (str(childName)) cast.push({ label: 'Micuțul/Micuța', value: str(childName) })
        if (str(motherName)) cast.push({ label: 'Mama', value: str(motherName) })
        if (str(fatherName)) cast.push({ label: 'Tata', value: str(fatherName) })
        if (str(godparentsBaptism) || str(godparents)) cast.push({ label: 'Nași', value: str(godparentsBaptism) || str(godparents) })
    } else {
        if (str(celebrantName)) cast.push({ label: 'Sărbătorit', value: str(celebrantName) })
        if (str(age)) cast.push({ label: 'Vârstă', value: `${str(age)} ani` })
    }
    fields.forEach((f) => cast.push({ label: f.label, value: f.value }))
    if (str(dressCode)) cast.push({ label: 'Ținută', value: str(dressCode) })

    const heroImage = photoUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2070'

    return (
        <div className={styles.netflixContainer}>
            <div
                className={styles.hero}
                style={{
                    backgroundImage: `url("${heroImage}")`
                }}
            >
                <div className={styles.heroContent}>
                    <div className={styles.nSeries}><span className={styles.nLogo} aria-hidden="true">N</span>SERIALUL {eventLabel(eventType).toLocaleUpperCase('ro-RO')}</div>
                    <h1 className={styles.title}>
                    {nameParts.length === 2 ? (
                        <>
                            <span className={styles.namePart}>{nameParts[0]}</span>
                            {' & '}
                            <span className={styles.namePart}>{nameParts[1]}</span>
                        </>
                    ) : (names || 'Invitație')}
                </h1>

                    <div className={styles.meta}>
                        <span className={styles.match}>99% potrivire</span>
                        {year && <span>{year}</span>}
                        <span className={styles.age}>{ageRating}</span>
                        <span>1 sezon</span>
                        <span>{genre}</span>
                    </div>

                    <div className={styles.description}>
                        {str(message) && <p>{str(message)}</p>}
                        {str(location) && (
                            <p><MapPin size={18} className={styles.inlineIcon} /> {str(location)}</p>
                        )}
                        {str(date) && (
                            <p><Calendar size={18} className={styles.inlineIcon} /> {str(date)}</p>
                        )}
                    </div>

                    <div className={styles.buttons}>
                        <button className={styles.playBtn} onClick={() => setShowRSVP(true)}>
                            <Play size={24} fill="currentColor" />
                            Confirmă Prezența
                        </button>
                        <button
                            className={`${styles.infoBtn} ${styles.wideBtn}`}
                            onClick={() => detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                        >
                            <Info size={24} />
                            Mai multe detalii
                        </button>
                        {mapUrl && (
                            <a className={`${styles.infoBtn} ${wazeUrl ? '' : styles.wideBtn}`} href={mapUrl} target="_blank" rel="noopener noreferrer">
                                <MapPin size={22} />
                                Vezi harta
                            </a>
                        )}
                        {wazeUrl && (
                            <a className={`${styles.infoBtn} ${mapUrl ? '' : styles.wideBtn}`} href={wazeUrl} target="_blank" rel="noopener noreferrer">
                                <Navigation size={24} />
                                Waze
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {videoUrl && (
                <section className={`${styles.episodes} ${styles.videoSection}`}>
                    <h2 className={styles.sectionTitle}>🎬 Trailer oficial</h2>
                    <div className={styles.videoFrame}>
                        <video
                            key={videoUrl}
                            src={videoUrl}
                            controls
                            playsInline
                            preload="metadata"
                            poster={photoUrl || undefined}
                            className={styles.video}
                        >
                            Browserul tău nu suportă redarea video.
                        </video>
                    </div>
                </section>
            )}

            <section ref={detailsRef} className={styles.episodes}>
                <h2 className={styles.sectionTitle}>Episoadele evenimentului</h2>
                <div className={styles.episodeList}>
                    {schedule.map((seg, idx) => (
                        <div key={seg.key} className={styles.episodeCard}>
                            <div className={styles.episodeThumb}>
                                {SEGMENT_META[seg.key]?.icon}
                            </div>
                            <div className={styles.episodeInfo}>
                                {seg.time && <div className={styles.episodeTime}>ORA {seg.time}</div>}
                                <div className={styles.episodeTitle}>
                                    {idx + 1}. {seg.label}
                                </div>
                                <p className={styles.episodeDesc}>{seg.loc || SEGMENT_META[seg.key]?.desc}</p>
                            </div>
                        </div>
                    ))}

                    {(cast.length > 0 || str(specialInstructions)) && (
                        <div className={`${styles.episodeCard} ${styles.castCard}`}>
                            <div className={styles.episodeThumb}><Users size={32} /></div>
                            <div className={styles.episodeInfo}>
                                <div className={styles.episodeTitle}>DISTRIBUȚIA</div>
                                <div className={styles.episodeDesc}>
                                    <div className={styles.castGrid}>
                                        {cast.map((c, i) => (
                                            <div key={`${c.label}-${i}`} className={styles.castItem}>
                                                <span className={styles.castLabel}>{c.label}</span>
                                                <span className={styles.castValue}>{c.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {str(specialInstructions) && (
                                        <div className={styles.note}>
                                            <strong>Notă:</strong> {str(specialInstructions)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {showRSVP && (
                <RSVPModal
                    isOpen={showRSVP}
                    onClose={() => setShowRSVP(false)}
                    eventId={id}
                />
            )}
        </div>
    )
}
