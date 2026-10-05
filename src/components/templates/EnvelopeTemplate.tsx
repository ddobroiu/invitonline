'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './EnvelopeTemplate.module.css'
import RSVPModal from '@/components/RSVPModal'
import { Heart, Calendar, MapPin, Users, Clock, Navigation, Mail } from 'lucide-react'
import localFont from 'next/font/local'
import {
    str, getMapUrl, getWazeUrl, getMainNames, getSchedule, splitNames, validCustomFields, CustomField,
} from './templateUtils'

const script = localFont({ src: '../../assets/fonts/GreatVibes.ttf', weight: '400', display: 'swap', variable: '--env-script' })

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
    civilCeremonyTime?: string
    civilCeremonyLoc?: string
    religiousCeremonyTime?: string
    religiousCeremonyLoc?: string
    partyTime?: string
    partyLoc?: string
    childName?: string
    motherName?: string
    fatherName?: string
    godparentsBaptism?: string
    churchTime?: string
    churchLoc?: string
    restaurantTime?: string
    restaurantLoc?: string
    celebrantName?: string
    age?: string
    theme?: string
    host?: string
    specialInstructions?: string
    dressCode?: string
    photoUrl?: string
    customFields?: CustomField[]
}

type Stage = 'closed' | 'opening' | 'open'

export default function EnvelopeTemplate(props: Props) {
    const {
        id, date, location, locationUrl, message, eventType = 'nunta',
        groomName, brideName, childName, celebrantName,
        godparents, godparentsBaptism, parentsGroom, parentsBride,
        motherName, fatherName, age, theme, host, specialInstructions, dressCode,
        photoUrl, customFields,
    } = props
    const [stage, setStage] = useState<Stage>('closed')
    const [showRSVP, setShowRSVP] = useState(false)
    const letterRef = useRef<HTMLElement>(null)

    // Two-phase opening: the flap/letter animation plays, then the full letter replaces the envelope
    // (normal document flow, so long content simply scrolls with the page).
    useEffect(() => {
        if (stage !== 'opening') return
        const t = setTimeout(() => setStage('open'), 1150)
        return () => clearTimeout(t)
    }, [stage])

    useEffect(() => {
        if (stage === 'open') letterRef.current?.focus({ preventScroll: true })
    }, [stage])

    const names = getMainNames(props)
    const nameParts = splitNames(names)
    const mapUrl = getMapUrl(location, locationUrl)
    const wazeUrl = getWazeUrl(location)
    const schedule = getSchedule(props)
    const fields = validCustomFields(customFields)

    const isWedding = eventType === 'nunta' || !eventType
    const isBaptism = eventType === 'botez'

    const sealText = nameParts.length > 1 && nameParts[0] && nameParts[1]
        ? `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toLocaleUpperCase('ro-RO')
        : (nameParts[0] ? nameParts[0].charAt(0).toLocaleUpperCase('ro-RO') : '')

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
        if (str(host)) cast.push({ label: 'Gazda', value: str(host) })
    }
    fields.forEach((f) => cast.push({ label: f.label, value: f.value }))
    const castTitle = isWedding || isBaptism ? 'Familia' : 'Detalii'

    const openEnvelope = () => {
        if (stage === 'closed') setStage('opening')
    }

    return (
        <div className={`${styles.container} ${script.variable}`}>
            {stage !== 'open' ? (
                <div className={styles.scene}>
                    <div
                        className={`${styles.envelope} ${stage === 'opening' ? styles.opening : ''}`}
                        role="button"
                        tabIndex={0}
                        aria-label="Deschide invitația"
                        onClick={openEnvelope}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openEnvelope() }
                        }}
                    >
                        <div className={styles.interior} />
                        <div className={styles.peek}>
                            <span className={styles.peekNames}>{names || 'Invitație'}</span>
                            {str(date) && <span className={styles.peekDate}>{str(date)}</span>}
                        </div>
                        <div className={styles.sides} />
                        <div className={styles.pocket}>
                            <div className={styles.address}>
                                <span className={styles.addressNames}>{names || 'Invitație'}</span>
                                {str(date) && <span className={styles.addressDate}>{str(date)}</span>}
                            </div>
                        </div>
                        <div className={styles.flap} />
                        <div className={styles.seal} aria-hidden="true">
                            {sealText ? <span>{sealText}</span> : <Heart size={20} fill="currentColor" />}
                        </div>
                    </div>

                    <button type="button" className={styles.hint} onClick={openEnvelope} disabled={stage !== 'closed'}>
                        <Mail size={18} aria-hidden="true" /> Deschide invitația
                    </button>
                </div>
            ) : (
                <article className={styles.letter} ref={letterRef} tabIndex={-1} aria-label="Invitație">
                    {photoUrl ? (
                        <img src={photoUrl} alt={names || 'Fotografie'} className={styles.photo} />
                    ) : (
                        <Heart size={30} className={styles.topHeart} aria-hidden="true" />
                    )}
                    <h1 className={styles.title}>
                        {nameParts.length > 1 ? (
                            <>
                                {nameParts[0]}
                                <span className={styles.amp}>&amp;</span>
                                {nameParts.slice(1).join(' & ')}
                            </>
                        ) : (names || 'Invitație')}
                    </h1>
                    {str(date) && (
                        <div className={styles.date}><Calendar size={16} aria-hidden="true" /> <span>{str(date)}</span></div>
                    )}

                    {str(message) && <p className={styles.message}>{str(message)}</p>}
                    {str(location) && (
                        <p className={styles.location}><MapPin size={16} aria-hidden="true" /> <span>{str(location)}</span></p>
                    )}

                    {(cast.length > 0 || schedule.length > 0 || str(dressCode)) && (
                        <div className={styles.extraDetails}>
                            {(cast.length > 0 || str(dressCode)) && (
                                <div className={styles.column}>
                                    <div className={styles.columnTitle}><Users size={14} aria-hidden="true" /> {castTitle}</div>
                                    {cast.map((c, i) => (
                                        <div key={`${c.label}-${i}`}><strong>{c.label}:</strong> {c.value}</div>
                                    ))}
                                    {str(dressCode) && <div className={styles.dress}><strong>Ținută:</strong> {str(dressCode)}</div>}
                                </div>
                            )}
                            {schedule.length > 0 && (
                                <div className={styles.column}>
                                    <div className={styles.columnTitle}><Clock size={14} aria-hidden="true" /> Program</div>
                                    {schedule.map((s) => (
                                        <div key={s.key}>
                                            <strong>{s.label}{s.time ? ':' : ''}</strong> {s.time}
                                            {s.loc && <span className={styles.subtle}>{s.loc}</span>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {str(specialInstructions) && (
                        <div className={styles.note}>
                            <strong>Notă:</strong> {str(specialInstructions)}
                        </div>
                    )}
                    {str(theme) && <div className={styles.note}><strong>Tematică:</strong> {str(theme)}</div>}

                    <div className={styles.buttons}>
                        <button type="button" className={styles.confirmButton} onClick={() => setShowRSVP(true)}>
                            Confirmă Prezența
                        </button>
                        {(mapUrl || wazeUrl) && (
                            <div className={styles.mapRow}>
                                {mapUrl && (
                                    <a className={`${styles.confirmButton} ${styles.mapButton}`} href={mapUrl} target="_blank" rel="noopener noreferrer">
                                        <Navigation size={14} aria-hidden="true" /> Vezi harta
                                    </a>
                                )}
                                {wazeUrl && (
                                    <a className={`${styles.confirmButton} ${styles.mapButton}`} href={wazeUrl} target="_blank" rel="noopener noreferrer">
                                        Waze
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    <button type="button" className={styles.back} onClick={() => setStage('closed')}>
                        <Mail size={14} aria-hidden="true" /> Înapoi la plic
                    </button>
                </article>
            )}

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
