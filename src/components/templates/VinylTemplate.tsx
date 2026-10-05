'use client'

import { useState } from 'react'
import styles from './VinylTemplate.module.css'
import RSVPModal from '@/components/RSVPModal'
import { Play, Pause, Music, Disc, Calendar, MapPin, Users, Info, Navigation } from 'lucide-react'
import { useAudioPlayer } from './useAudioPlayer'
import {
    str, getMapUrl, getWazeUrl, getMainNames, getSchedule, parseDate, validCustomFields, CustomField,
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
    celebrantName?: string
    age?: string
    specialInstructions?: string
    dressCode?: string
    customFields?: CustomField[]
    audioUrl?: string
    photoUrl?: string
}

// Deterministic bar heights (no Math.random during render).
const BAR_HEIGHTS = [14, 26, 18, 32, 22, 12, 28, 20, 34, 16, 24, 30, 12, 26, 18]

export default function VinylTemplate(props: Props) {
    const {
        id, date, location, locationUrl, message, eventType = 'nunta',
        groomName, brideName, childName, celebrantName,
        godparents, godparentsBaptism, parentsGroom, parentsBride,
        motherName, fatherName, age, specialInstructions, dressCode,
        customFields, audioUrl, photoUrl,
    } = props

    const [showRSVP, setShowRSVP] = useState(false)
    const [spinOnly, setSpinOnly] = useState(false)
    const audio = useAudioPlayer(str(audioUrl) || undefined)
    const isPlaying = audio.hasAudio ? audio.isPlaying : spinOnly

    const togglePlayPause = () => {
        if (audio.hasAudio) audio.toggle()
        else setSpinOnly((s) => !s) // no audio: just spin the record
    }

    let albumName = 'Albumul nunții'
    let side = 'WED'
    if (eventType === 'botez') { albumName = 'Primele hituri ale bebelușului'; side = 'BBY' }
    else if (eventType === 'aniversare') { albumName = 'Aniversare — ediție limitată'; side = 'BDY' }
    else if (eventType === 'petrecere') { albumName = 'Imnurile petrecerii'; side = 'PTY' }

    const names = getMainNames(props)
    const year = parseDate(date).year
    const mapUrl = getMapUrl(location, locationUrl)
    const wazeUrl = getWazeUrl(location)
    const schedule = getSchedule(props)
    const fields = validCustomFields(customFields)
    const isWedding = eventType === 'nunta' || !eventType
    const isBaptism = eventType === 'botez'

    const credits: { label: string, value: string }[] = []
    if (isWedding) {
        if (str(groomName)) credits.push({ label: 'Mire', value: str(groomName) })
        if (str(brideName)) credits.push({ label: 'Mireasă', value: str(brideName) })
        if (str(parentsGroom)) credits.push({ label: 'Părinții mirelui', value: str(parentsGroom) })
        if (str(parentsBride)) credits.push({ label: 'Părinții miresei', value: str(parentsBride) })
        if (str(godparents)) credits.push({ label: 'Nași', value: str(godparents) })
    } else if (isBaptism) {
        if (str(childName)) credits.push({ label: 'Micuțul/Micuța', value: str(childName) })
        if (str(motherName)) credits.push({ label: 'Mama', value: str(motherName) })
        if (str(fatherName)) credits.push({ label: 'Tata', value: str(fatherName) })
        if (str(godparentsBaptism) || str(godparents)) credits.push({ label: 'Nași', value: str(godparentsBaptism) || str(godparents) })
    } else {
        if (str(celebrantName)) credits.push({ label: 'Sărbătorit', value: str(celebrantName) })
        if (str(age)) credits.push({ label: 'Vârstă', value: `${str(age)} ani` })
    }
    fields.forEach((f) => credits.push({ label: f.label, value: f.value }))

    const hasCast = credits.length > 0 || !!str(dressCode)
    const hasInfo = !!(str(date) || str(location) || str(message))
    const hasDetails = hasInfo || hasCast || schedule.length > 0 || !!str(specialInstructions)

    return (
        <div className={styles.vinylContainer}>
            <div className={styles.playerCard}>
                <div className={styles.side}>
                    <div className={styles.vinylWrapper} onClick={togglePlayPause} role="presentation">
                        <div className={`${styles.vinyl} ${isPlaying ? styles.playing : ''}`}>
                            <div className={styles.label}>
                                {photoUrl ? (
                                    <img src={photoUrl} alt="Copertă" className={styles.labelPhoto} />
                                ) : (
                                    <div className={styles.labelText}>
                                        <span>Fața A</span>
                                        <span className={styles.labelGap} />
                                        <span>{[year, side].filter(Boolean).join(' · ')}</span>
                                    </div>
                                )}
                                <span className={styles.spindle} />
                            </div>
                        </div>
                        <div className={styles.sheen} />
                    </div>

                    <div className={styles.trackInfo}>
                        <h1 className={styles.trackTitle}>{names || 'Invitație'}</h1>
                        <p className={styles.artist}><Music size={13} className={styles.inlineIcon} /> {albumName}</p>
                    </div>

                    <div className={`${styles.soundWave} ${isPlaying ? styles.waveActive : ''}`} aria-hidden="true">
                        {BAR_HEIGHTS.map((h, i) => (
                            <div key={i} className={styles.bar} style={{ animationDelay: `${i * 0.07}s`, height: `${h}px` }}></div>
                        ))}
                    </div>

                    <div className={styles.controls}>
                        <button
                            className={styles.playBtn}
                            onClick={togglePlayPause}
                            aria-label={isPlaying ? 'Pauză' : 'Redă'}
                            aria-pressed={isPlaying}
                        >
                            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className={styles.playIcon} />}
                        </button>
                        <span className={styles.controlHint}>
                            {audio.hasAudio
                                ? (isPlaying ? 'Se aude melodia noastră' : 'Ascultă melodia noastră')
                                : (isPlaying ? 'Discul se învârte' : 'Pornește discul')}
                        </span>
                    </div>
                </div>

                <div className={styles.main}>
                    {hasDetails && (
                        <div className={styles.details}>
                            {hasInfo && (
                                <section className={styles.section}>
                                    <div className={styles.detailsTitle}><Info size={12} /> Detalii</div>
                                    {str(date) && <p className={styles.infoRow}><Calendar size={16} className={styles.rowIcon} /> <span>{str(date)}</span></p>}
                                    {str(location) && <p className={styles.infoRow}><MapPin size={16} className={styles.rowIcon} /> <span>{str(location)}</span></p>}
                                    {str(message) && <p className={styles.message}>„{str(message)}”</p>}
                                </section>
                            )}

                            {hasCast && (
                                <section className={styles.section}>
                                    <div className={styles.detailsTitle}><Users size={12} /> Distribuție</div>
                                    <dl className={styles.credits}>
                                        {credits.map((c, i) => (
                                            <div key={`${c.label}-${i}`} className={styles.creditRow}>
                                                <dt>{c.label}</dt>
                                                <dd>{c.value}</dd>
                                            </div>
                                        ))}
                                        {str(dressCode) && (
                                            <div className={styles.creditRow}>
                                                <dt>Ținută</dt>
                                                <dd className={styles.accent}>{str(dressCode)}</dd>
                                            </div>
                                        )}
                                    </dl>
                                </section>
                            )}

                            {schedule.length > 0 && (
                                <section className={styles.section}>
                                    <div className={styles.detailsTitle}><Disc size={12} /> Tracklist</div>
                                    <ol className={styles.tracklist}>
                                        {schedule.map((s, i) => (
                                            <li key={s.key} className={styles.track}>
                                                <span className={styles.trackNo}>{String(i + 1).padStart(2, '0')}</span>
                                                <span className={styles.trackBody}>
                                                    <span className={styles.trackName}>{s.label}</span>
                                                    {s.loc && <span className={styles.trackLoc}>{s.loc}</span>}
                                                </span>
                                                {s.time && <span className={styles.trackTime}>{s.time}</span>}
                                            </li>
                                        ))}
                                    </ol>
                                </section>
                            )}

                            {str(specialInstructions) && (
                                <p className={styles.note}><strong>Notă:</strong> {str(specialInstructions)}</p>
                            )}
                        </div>
                    )}

                    <div className={styles.actions}>
                        <button className={styles.rsvpBtn} onClick={() => setShowRSVP(true)}>
                            Confirmă Prezența
                        </button>
                        {mapUrl && (
                            <div className={styles.mapRow}>
                                <a className={`${styles.rsvpBtn} ${styles.outlineBtn}`} href={mapUrl} target="_blank" rel="noopener noreferrer">
                                    <Navigation size={16} /> Vezi harta
                                </a>
                                {wazeUrl && (
                                    <a className={`${styles.rsvpBtn} ${styles.outlineBtn}`} href={wazeUrl} target="_blank" rel="noopener noreferrer">
                                        Waze
                                    </a>
                                )}
                            </div>
                        )}
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
