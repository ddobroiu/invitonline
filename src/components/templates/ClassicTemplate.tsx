'use client'

import { useState } from 'react'
import styles from './ClassicTemplate.module.css'
import RSVPModal from '@/components/RSVPModal'
import { MapPin, Clock } from 'lucide-react'
import { Great_Vibes, Playfair_Display } from 'next/font/google'
import {
    str, getMapUrl, getWazeUrl, parseDate, getSchedule, getParents, getGodparents,
    validCustomFields, CustomField,
} from './templateUtils'

const script = Great_Vibes({ weight: '400', subsets: ['latin', 'latin-ext'], display: 'swap', variable: '--classic-script' })
const serif = Playfair_Display({
    weight: ['400', '700'], style: ['normal', 'italic'], subsets: ['latin', 'latin-ext'], display: 'swap', variable: '--classic-serif',
})

/** Watercolor-like floral sprig used in the four corners (pure SVG, no external image). */
function FloralCorner({ className }: { className: string }) {
    return (
        <svg className={className} viewBox="0 0 200 200" aria-hidden="true" focusable="false">
            <g fill="none" stroke="#8fa383" strokeWidth="1.6" strokeLinecap="round">
                <path d="M2 168 C 40 120, 70 70, 168 4" />
                <path d="M40 118 C 20 100, 12 80, 14 58" />
                <path d="M92 58 C 100 36, 118 22, 140 18" />
            </g>
            <g fill="#a9bb9c" opacity="0.85">
                <ellipse cx="26" cy="142" rx="14" ry="6" transform="rotate(-60 26 142)" />
                <ellipse cx="46" cy="134" rx="13" ry="5.5" transform="rotate(20 46 134)" />
                <ellipse cx="58" cy="98" rx="14" ry="6" transform="rotate(-70 58 98)" />
                <ellipse cx="80" cy="92" rx="13" ry="5.5" transform="rotate(10 80 92)" />
                <ellipse cx="18" cy="84" rx="12" ry="5" transform="rotate(-100 18 84)" />
                <ellipse cx="112" cy="46" rx="13" ry="5.5" transform="rotate(-40 112 46)" />
                <ellipse cx="130" cy="36" rx="12" ry="5" transform="rotate(40 130 36)" />
                <ellipse cx="150" cy="16" rx="11" ry="4.5" transform="rotate(-20 150 16)" />
            </g>
            <g fill="#cfdac6" opacity="0.9">
                <ellipse cx="36" cy="112" rx="10" ry="4" transform="rotate(-20 36 112)" />
                <ellipse cx="98" cy="72" rx="10" ry="4" transform="rotate(-50 98 72)" />
                <ellipse cx="148" cy="24" rx="9" ry="3.5" transform="rotate(30 148 24)" />
            </g>
            <g>
                <circle cx="70" cy="74" r="16" fill="#f1d3c8" />
                <circle cx="62" cy="68" r="9" fill="#e7b8a8" opacity="0.8" />
                <circle cx="78" cy="80" r="8" fill="#ebc4b6" opacity="0.8" />
                <circle cx="70" cy="74" r="4.5" fill="#c98f7d" />
                <circle cx="14" cy="60" r="9" fill="#f3ddd3" />
                <circle cx="14" cy="60" r="3" fill="#d4a291" />
                <circle cx="140" cy="18" r="7" fill="#f3ddd3" />
                <circle cx="140" cy="18" r="2.5" fill="#d4a291" />
                <circle cx="34" cy="156" r="3" fill="#e7b8a8" />
                <circle cx="104" cy="54" r="3" fill="#e7b8a8" />
            </g>
        </svg>
    )
}

interface Props {
    id?: string
    title?: string
    date?: string
    location?: string
    locationUrl?: string
    message?: string
    eventType?: string

    groomName?: string
    brideName?: string
    parentsGroom?: string
    parentsBride?: string
    godparents?: string

    childName?: string
    motherName?: string
    fatherName?: string
    godparentsBaptism?: string

    celebrantName?: string
    age?: string

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
    photoUrl?: string
    customFields?: CustomField[]
}

export default function ClassicTemplate(props: Props) {
    const {
        id, title, date, location, locationUrl, message, eventType = 'nunta',
        groomName, brideName, childName, celebrantName,
        dressCode, specialInstructions, photoUrl, customFields,
    } = props

    const [showRSVP, setShowRSVP] = useState(false)

    const isWedding = eventType === 'nunta' || !eventType
    const isBaptism = eventType === 'botez'

    const primaryName1 = isWedding
        ? (str(groomName) || str(title).split('&')[0]?.trim())
        : isBaptism ? (str(childName) || str(title)) : (str(title) || str(celebrantName))
    const primaryName2 = isWedding ? (str(brideName) || str(title).split('&')[1]?.trim() || '') : ''

    const parsed = parseDate(date)
    const mapUrl = getMapUrl(location, locationUrl)
    const wazeUrl = getWazeUrl(location)
    const schedule = getSchedule(props)
    const parents = getParents(props)
    const godparentsText = getGodparents(props)
    const fields = validCustomFields(customFields)

    const quote = isWedding
        ? <>Dragostea ne-a adunat,<br />Un destin am îmbrățișat.</>
        : isBaptism
            ? <>Un înger mic a coborât,<br />Și viața ne-a înseninat.</>
            : <>Anii trec, prietenii rămân,<br />Hai să sărbătorim împreună!</>

    return (
        <div className={`${styles.container} ${script.variable} ${serif.variable}`}>
            <div className={styles.card}>
                <FloralCorner className={`${styles.corner} ${styles.topLeft}`} />
                <FloralCorner className={`${styles.corner} ${styles.topRight}`} />
                <FloralCorner className={`${styles.corner} ${styles.bottomLeft}`} />
                <FloralCorner className={`${styles.corner} ${styles.bottomRight}`} />

                <p className={styles.intro}>
                    {str(message) || (isWedding ? 'Cu inimile pline de emoție și bucurie, noi' : 'Cu drag vă invităm să fiți alături de noi')}
                </p>

                {photoUrl && (
                    <div className={styles.photo}>
                        <img src={photoUrl} alt={primaryName1 || 'Fotografie'} />
                    </div>
                )}

                <div className={styles.names}>
                    {primaryName1 || (isWedding ? 'Ana' : 'Invitație')}
                    {primaryName2 && (
                        <>
                            <span className={styles.ampersand}>&</span>
                            {primaryName2}
                        </>
                    )}
                </div>

                <div className={styles.quote}>{quote}</div>

                <div className={styles.ornament} aria-hidden="true"><span>❦</span></div>

                {str(date) && (
                    parsed.day && parsed.month ? (
                        <div className={styles.dateBlock}>
                            {parsed.weekday && <span className={styles.dayName}>{parsed.weekday}</span>}
                            <span className={styles.dayNumber}>{parsed.day}</span>
                            <span className={styles.year}>
                                {parsed.month}
                                {parsed.year && <span className={styles.yearNum}>{parsed.year}</span>}
                            </span>
                        </div>
                    ) : (
                        <div className={`${styles.dateBlock} ${styles.dateText}`}>{str(date)}</div>
                    )
                )}

                {parents.length > 0 && (
                    <div className={styles.section}>
                        <div className={styles.sectionTitle}>Alături ne vor fi părinții</div>
                        <div className={styles.namesList}>
                            {parents.map((p) => <div key={p}>{p}</div>)}
                        </div>
                    </div>
                )}

                {godparentsText && (
                    <div className={styles.section}>
                        <div className={styles.sectionTitle}>Și nașii</div>
                        <div className={`${styles.namesList} ${styles.script}`}>
                            {godparentsText}
                        </div>
                    </div>
                )}

                {schedule.length > 0 && (
                    <div className={`${styles.section} ${styles.schedule}`}>
                        <div className={styles.sectionTitle}>Programul zilei</div>
                        {schedule.map((s) => (
                            <div key={s.key} className={styles.scheduleItem}>
                                <div className={styles.scheduleHead}>
                                    <Clock size={14} aria-hidden="true" /> <strong>{s.label}</strong>
                                    {s.time && <span className={styles.scheduleTime}>{s.time}</span>}
                                </div>
                                {s.loc && <div className={styles.scheduleLoc}>{s.loc}</div>}
                            </div>
                        ))}
                    </div>
                )}

                {fields.length > 0 && (
                    <div className={`${styles.section} ${styles.fields}`}>
                        {fields.map((f, i) => (
                            <div key={`${f.label}-${i}`} className={styles.fieldItem}>
                                <span className={styles.fieldLabel}>{f.label}</span>
                                <span>{f.value}</span>
                            </div>
                        ))}
                    </div>
                )}

                {str(location) && (
                    <div className={styles.locationContainer}>
                        <div className={styles.locationIcon}>
                            <MapPin size={28} aria-hidden="true" />
                        </div>
                        <div className={styles.locationText}>{str(location)}</div>
                        <div className={styles.mapLinks}>
                            {mapUrl && <a href={mapUrl} target="_blank" rel="noopener noreferrer">Vezi harta</a>}
                            {wazeUrl && <a href={wazeUrl} target="_blank" rel="noopener noreferrer">Waze</a>}
                        </div>
                    </div>
                )}

                {str(dressCode) && (
                    <div className={styles.note}>Ținută: {str(dressCode)}</div>
                )}

                {str(specialInstructions) && (
                    <div className={styles.note}>{str(specialInstructions)}</div>
                )}

                <button type="button" className={styles.rsvpButton} onClick={() => setShowRSVP(true)}>
                    Confirmă Prezența
                </button>
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
