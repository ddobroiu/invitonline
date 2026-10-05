'use client'

import { useState } from 'react'
import styles from './FestivalTemplate.module.css'
import RSVPModal from '@/components/RSVPModal'
import { QrCode, Play, Pause, Navigation, Ticket, MapPin, Calendar, Music } from 'lucide-react'
import { useAudioPlayer } from './useAudioPlayer'
import {
    str, upper, getMapUrl, getWazeUrl, getMainNames, getSchedule, getParents, getGodparents,
    splitNames, validCustomFields, CustomField,
} from './templateUtils'

interface FestivalTemplateProps {
    id?: string
    title?: string
    date?: string
    location?: string
    locationUrl?: string
    message?: string
    eventType?: string
    groomName?: string
    brideName?: string
    childName?: string
    celebrantName?: string
    age?: string
    godparents?: string
    customFields?: CustomField[]
    audioUrl?: string
    photoUrl?: string
    parentsGroom?: string
    parentsBride?: string
    motherName?: string
    fatherName?: string
    godparentsBaptism?: string
    civilCeremonyTime?: string
    civilCeremonyLoc?: string
    religiousCeremonyTime?: string
    religiousCeremonyLoc?: string
    partyTime?: string
    partyLoc?: string
    churchTime?: string
    churchLoc?: string
    restaurantTime?: string
    restaurantLoc?: string
    dressCode?: string
    specialInstructions?: string
}

export default function FestivalTemplate(props: FestivalTemplateProps) {
    const {
        id, date, location, locationUrl, message, eventType = 'nunta',
        audioUrl, photoUrl, customFields, dressCode, specialInstructions, age,
    } = props

    const [showRSVP, setShowRSVP] = useState(false)
    const { isPlaying, toggle, hasAudio } = useAudioPlayer(str(audioUrl) || undefined)

    const mainTitle = upper(getMainNames(props)) || 'HEADLINER'
    const headliners = splitNames(mainTitle)
    const mapUrl = getMapUrl(location, locationUrl)
    const wazeUrl = getWazeUrl(location)
    const schedule = getSchedule(props)
    const parents = getParents(props)
    const godparentsText = getGodparents(props)
    const fields = validCustomFields(customFields)
    const isWedding = eventType === 'nunta' || !eventType

    const festivalName =
        eventType === 'botez' ? 'BABY FEST' :
            eventType === 'aniversare' ? 'B-DAY FEST' :
                eventType === 'petrecere' ? 'PARTY FEST' : 'THE WEDDING'

    const showAge = !!str(age) && (eventType === 'aniversare' || eventType === 'petrecere')
    const hasSupport = !!godparentsText || parents.length > 0 || fields.length > 0 || showAge

    return (
        <div className={styles.festivalWrapper}>
            <div className={styles.ticket}>
                <div className={styles.body}>
                    <div className={styles.header}>
                        <div className={styles.festivalName}>{festivalName}</div>
                        <div className={styles.ticketType}>PERMIS OFICIAL · ACCES VIP</div>
                        {hasAudio && (
                            <button
                                className={`${styles.audioBtn} ${isPlaying ? styles.audioOn : ''}`}
                                onClick={toggle}
                                aria-label={isPlaying ? 'Oprește muzica' : 'Pornește muzica'}
                                aria-pressed={isPlaying}
                            >
                                {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                                <span>{isPlaying ? 'Pauză' : 'Soundtrack'}</span>
                                <Music size={14} className={styles.audioNote} />
                            </button>
                        )}
                    </div>

                    <div className={styles.mainSection}>
                        <div className={styles.colA}>
                            {photoUrl && (
                                <div className={styles.photo}>
                                    <img src={photoUrl} alt={mainTitle} />
                                </div>
                            )}

                            <div className={styles.lineupTitle}>LINE-UP</div>

                            <div className={styles.performerGrid}>
                                <div className={styles.mainPerformer}>
                                    {headliners.map((n, i) => (
                                        <span key={i} className={styles.headliner}>
                                            {i > 0 && <span className={styles.amp}>&amp;</span>}
                                            {n}
                                        </span>
                                    ))}
                                </div>

                                <div className={styles.supportAct}>
                                    {godparentsText && (
                                        <div className={styles.supportLine}>
                                            <span className={styles.supportLabel}>{isWedding || eventType === 'botez' ? 'Invitați speciali · Nașii' : 'Invitați speciali'}</span>
                                            {upper(godparentsText)}
                                        </div>
                                    )}
                                    {parents.length > 0 && (
                                        <div className={styles.supportLine}>
                                            <span className={styles.supportLabel}>{eventType === 'botez' ? 'Alături de părinții' : 'Alături de'}</span>
                                            {parents.map((p) => <span key={p} className={styles.inlineAct}>{upper(p)}</span>)}
                                        </div>
                                    )}
                                    {showAge && (
                                        <div className={styles.supportLine}>
                                            <span className={styles.supportLabel}>Turneul aniversar</span>
                                            {upper(age)} ANI
                                        </div>
                                    )}
                                    {fields.map((f, i) => (
                                        <div key={`${f.label}-${i}`} className={styles.supportLine}>
                                            <span className={styles.supportLabel}>{f.label}</span>
                                            {upper(f.value)}
                                        </div>
                                    ))}
                                    {!hasSupport && (
                                        <div className={styles.supportLine}>
                                            {isWedding ? 'INVITAȚI SPECIALI: FAMILIA ȘI PRIETENII' : 'FEATURING: GOOD VIBES ONLY'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className={styles.colB}>
                            {schedule.length > 0 && (
                                <div className={styles.setTimes}>
                                    <div className={styles.setTimesTitle}>SET TIMES</div>
                                    <ul className={styles.setTimesList}>
                                        {schedule.map((s) => (
                                            <li key={s.key} className={styles.setRow}>
                                                <span className={styles.setTime}>{s.time || '—'}</span>
                                                <span className={styles.setBody}>
                                                    <span className={styles.setName}>{s.label}</span>
                                                    {s.loc && <span className={styles.setLoc}>{s.loc}</span>}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className={styles.infoLine}>
                                <div className={styles.infoBlock}>
                                    <div className={styles.infoLabel}><MapPin size={11} /> LOCAȚIE / SCENĂ</div>
                                    <div className={styles.infoValue}>{str(location) || '—'}</div>
                                </div>
                                <div className={`${styles.infoBlock} ${styles.infoDate}`}>
                                    <div className={styles.infoLabel}><Calendar size={11} /> DATA</div>
                                    <div className={styles.infoValue}>{str(date) || '—'}</div>
                                </div>
                            </div>

                            {(mapUrl || wazeUrl) && (
                                <div className={styles.mapLinks}>
                                    {mapUrl && (
                                        <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                                            <Navigation size={14} /> Vezi harta
                                        </a>
                                    )}
                                    {wazeUrl && <a href={wazeUrl} target="_blank" rel="noopener noreferrer">Waze</a>}
                                </div>
                            )}

                            {(str(dressCode) || str(specialInstructions)) && (
                                <div className={styles.rules}>
                                    {str(dressCode) && <div><strong>DRESS CODE:</strong> {str(dressCode)}</div>}
                                    {str(specialInstructions) && <div>{str(specialInstructions)}</div>}
                                </div>
                            )}

                            {str(message) && (
                                <div className={styles.message}>„{str(message)}”</div>
                            )}

                            <button className={styles.rsvpButton} onClick={() => setShowRSVP(true)}>
                                <Ticket size={18} /> Confirmă Prezența
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles.qrSection}>
                    <div className={styles.qrCode}>
                        <QrCode size={80} color="#fff" strokeWidth={1} />
                    </div>
                    <div className={styles.qrText}>SCANEAZĂ PENTRU VALIDAREA BILETULUI</div>
                    <div className={styles.barcode}></div>
                    <div className={styles.admit}>ADMIT ONE · {festivalName}</div>
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
