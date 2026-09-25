'use client'

import { useState } from 'react'
import styles from './CinemaTemplate.module.css'
import RSVPModal from '@/components/RSVPModal'
import { Heart, Baby, PartyPopper, Cake, Ticket, Navigation, MapPin } from 'lucide-react'
import {
    str, upper, shortLocation, getMapUrl, getWazeUrl, getMainNames, splitNames, getSchedule,
    validCustomFields, CustomField,
} from './templateUtils'

interface CinemaTemplateProps {
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
    parentsBride?: string
    parentsGroom?: string
    godparents?: string
    godparentsBaptism?: string
    motherName?: string
    fatherName?: string
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
    customFields?: CustomField[]
    photoUrl?: string
}

export default function CinemaTemplate(props: CinemaTemplateProps) {
    const {
        id, date, location, locationUrl, message, eventType = 'nunta',
        groomName, brideName, childName, celebrantName, age,
        godparents, godparentsBaptism, parentsGroom, parentsBride,
        motherName, fatherName, dressCode, specialInstructions,
        customFields, photoUrl,
    } = props

    const [showRSVP, setShowRSVP] = useState(false)

    const mainNames = getMainNames(props)
    const nameParts = splitNames(mainNames)
    const mapUrl = getMapUrl(location, locationUrl)
    const wazeUrl = getWazeUrl(location)
    const schedule = getSchedule(props)
    const fields = validCustomFields(customFields)
    const isWedding = eventType === 'nunta' || !eventType
    const isBaptism = eventType === 'botez'

    // Credits, event-aware (no wedding roles on a baptism / birthday).
    const credits: { label: string, value: string }[] = []
    if (isWedding) {
        if (str(groomName)) credits.push({ label: 'Mire', value: str(groomName) })
        if (str(brideName)) credits.push({ label: 'Mireasă', value: str(brideName) })
        if (str(parentsGroom)) credits.push({ label: 'Produs de', value: str(parentsGroom) })
        if (str(parentsBride)) credits.push({ label: 'Co-produs de', value: str(parentsBride) })
        if (str(godparents)) credits.push({ label: 'Nași', value: str(godparents) })
    } else if (isBaptism) {
        if (str(childName)) credits.push({ label: 'În rolul principal', value: str(childName) })
        const parents = [str(motherName), str(fatherName)].filter(Boolean).join(' & ')
        if (parents) credits.push({ label: 'Produs de', value: parents })
        if (str(godparentsBaptism) || str(godparents)) credits.push({ label: 'Nași', value: str(godparentsBaptism) || str(godparents) })
    } else {
        if (str(celebrantName)) credits.push({ label: 'În rolul principal', value: str(celebrantName) })
        if (str(age)) credits.push({ label: 'Ediția aniversară', value: `${str(age)} ani` })
    }

    const Icon = isWedding ? Heart : isBaptism ? Baby : eventType === 'aniversare' ? Cake : PartyPopper

    return (
        <div className={styles.cinemaWrapper}>
            <div className={styles.poster}>
                <div className={styles.topText}>PRODUCȚIA ANULUI PREZINTĂ</div>

                <h1 className={styles.mainTitle}>
                    {nameParts.length === 2 ? (
                        <>
                            <span className={styles.namePart}>{nameParts[0]}</span>
                            {' & '}
                            <span className={styles.namePart}>{nameParts[1]}</span>
                        </>
                    ) : (mainNames || 'Premiera')}
                </h1>

                {str(date) && (
                    <div className={styles.comingSoon}>
                        PREMIERA: {str(date)}
                    </div>
                )}

                <div className={styles.photoArea}>
                    {photoUrl ? (
                        <div
                            className={styles.posterImage}
                            style={{ backgroundImage: `url("${photoUrl}")` }}
                            role="img"
                            aria-label={mainNames || 'Fotografie'}
                        />
                    ) : (
                        <div className={styles.iconCircle}>
                            <Icon size={72} color="#e50914" strokeWidth={1} />
                        </div>
                    )}
                </div>

                {str(message) && <p className={styles.tagline}>„{str(message)}”</p>}

                {str(location) && (
                    <div className={styles.locationTag}>
                        FILMAT LA: {shortLocation(location)}
                    </div>
                )}
                {str(location) && shortLocation(location) !== str(location) && (
                    <div className={styles.locationFull}>{str(location)}</div>
                )}

                {(mapUrl || wazeUrl) && (
                    <div className={styles.mapLinks}>
                        {mapUrl && (
                            <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                                <MapPin size={14} /> Vezi harta
                            </a>
                        )}
                        {wazeUrl && (
                            <a href={wazeUrl} target="_blank" rel="noopener noreferrer">
                                <Navigation size={14} /> Waze
                            </a>
                        )}
                    </div>
                )}

                {schedule.length > 0 && (
                    <div className={styles.showtimes}>
                        <div className={styles.blockTitle}>Programul proiecțiilor</div>
                        {schedule.map((s) => (
                            <div key={s.key} className={styles.showtime}>
                                <span className={styles.showtimeTime}>{s.time || '—'}</span>
                                <span className={styles.showtimeInfo}>
                                    <strong>{s.label}</strong>
                                    {s.loc && <span>{s.loc}</span>}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                <div className={styles.credits}>
                    {credits.map((c, i) => (
                        <div key={`${c.label}-${i}`} className={styles.creditLine}>
                            <span className={styles.creditLabel}>{upper(c.label)}</span>
                            <span className={styles.creditValue}>{upper(c.value)}</span>
                        </div>
                    ))}
                    {fields.map((f, i) => (
                        <div key={`${f.label}-${i}`} className={styles.creditLine}>
                            <span className={styles.creditLabel}>{upper(f.label)}</span>
                            <span className={styles.creditValue}>{upper(f.value)}</span>
                        </div>
                    ))}
                    {str(dressCode) && (
                        <div className={styles.creditLine}>
                            <span className={styles.creditLabel}>ȚINUTĂ</span>
                            <span className={styles.creditValue}>{upper(dressCode)}</span>
                        </div>
                    )}
                    <div className={styles.creditLine}>
                        <span className={styles.creditLabel}>REGIA</span>
                        <span className={styles.creditValue}>DESTINUL</span>
                    </div>
                </div>

                {str(specialInstructions) && (
                    <div className={styles.note}>{str(specialInstructions)}</div>
                )}

                <button className={styles.rsvpButton} onClick={() => setShowRSVP(true)}>
                    <Ticket size={18} /> Confirmă Prezența
                </button>

                <div className={styles.footer}>
                    RATED G – GARANTAT DISTRACȚIE | CC | Dolby Digital
                </div>
            </div>

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
