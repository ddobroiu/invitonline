'use client'

import { useState } from 'react'
import styles from './ClassicMinimalTemplate.module.css'
import RSVPModal from '@/components/RSVPModal'
import { Bodoni_Moda, Montserrat } from 'next/font/google'
import {
    str, getMapUrl, getWazeUrl, getSchedule, getGodparents, getParents,
    validCustomFields, CustomField, eventLabel,
} from './templateUtils'

const bodoni = Bodoni_Moda({ weight: ['400', '600'], subsets: ['latin', 'latin-ext'], display: 'swap', variable: '--min-serif' })
const montserrat = Montserrat({ weight: ['300', '400', '500'], subsets: ['latin', 'latin-ext'], display: 'swap', variable: '--min-sans' })

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
    childName?: string
    celebrantName?: string
    parentsGroom?: string
    parentsBride?: string
    motherName?: string
    fatherName?: string
    godparents?: string
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
    photoUrl?: string
    customFields?: CustomField[]
}

export default function ClassicMinimalTemplate(props: Props) {
    const {
        id, title, date, location, locationUrl, message, eventType = 'nunta',
        groomName, brideName, childName, celebrantName, specialInstructions, dressCode,
        photoUrl, customFields,
    } = props
    const [showRSVP, setShowRSVP] = useState(false)
    const isWedding = eventType === 'nunta' || !eventType
    const titleParts = str(title).split('&').map((s) => s.trim())

    const name1 = isWedding
        ? (str(groomName) || titleParts[0] || '')
        : eventType === 'botez'
            ? (str(childName) || str(title))
            : (str(title) || str(celebrantName))
    const name2 = isWedding ? (str(brideName) || titleParts[1] || '') : ''

    const initials = (() => {
        const i1 = name1 ? name1.charAt(0).toUpperCase() : ''
        const i2 = name2 ? name2.charAt(0).toUpperCase() : ''
        if (i1 && i2) return `${i1} & ${i2}`
        return i1 || '♥'
    })()

    const mapUrl = getMapUrl(location, locationUrl)
    const wazeUrl = getWazeUrl(location)
    const schedule = getSchedule(props)
    const parents = getParents(props)
    const godparentsText = getGodparents(props)
    const fields = validCustomFields(customFields)

    return (
        <div className={`${styles.container} ${bodoni.variable} ${montserrat.variable}`}>
            <div className={styles.card}>
                {photoUrl ? (
                    <div className={styles.photo}>
                        <img src={photoUrl} alt={name1 || 'Fotografie'} />
                    </div>
                ) : (
                    <div className={styles.initials}>{initials}</div>
                )}

                <div className={styles.label}>{isWedding ? 'Save the Date' : eventLabel(eventType)}</div>
                <div className={styles.mainNames}>
                    {name1 || 'Invitație'}
                    {name2 && <><br /><span className={styles.and}>și</span><br />{name2}</>}
                </div>

                <div className={styles.divider}></div>

                {str(date) && (
                    <div className={styles.infoBlock}>
                        <div className={styles.label}>Când</div>
                        <div className={styles.bigDate}>{str(date)}</div>
                    </div>
                )}

                {str(location) && (
                    <div className={styles.infoBlock}>
                        <div className={styles.label}>Unde</div>
                        <div className={styles.value}>{str(location)}</div>
                        <div className={styles.mapLinks}>
                            {mapUrl && <a href={mapUrl} target="_blank" rel="noopener noreferrer">Vezi harta</a>}
                            {wazeUrl && <a href={wazeUrl} target="_blank" rel="noopener noreferrer">Waze</a>}
                        </div>
                    </div>
                )}

                {schedule.length > 0 && (
                    <div className={styles.infoBlock}>
                        <div className={styles.label}>Program</div>
                        {schedule.map((s) => (
                            <div key={s.key} className={styles.scheduleItem}>
                                <span className={styles.scheduleLabel}>{s.label}{s.time && <> — <strong>{s.time}</strong></>}</span>
                                {s.loc && <span className={styles.scheduleLoc}>{s.loc}</span>}
                            </div>
                        ))}
                    </div>
                )}

                {(parents.length > 0 || godparentsText) && (
                    <div className={styles.infoBlock}>
                        {parents.length > 0 && (
                            <>
                                <div className={styles.label}>Părinți</div>
                                {parents.map((p) => <div key={p} className={styles.smallValue}>{p}</div>)}
                            </>
                        )}
                        {godparentsText && (
                            <>
                                <div className={`${styles.label} ${parents.length ? styles.labelSpaced : ''}`}>Nași</div>
                                <div className={styles.smallValue}>{godparentsText}</div>
                            </>
                        )}
                    </div>
                )}

                {fields.map((f, i) => (
                    <div key={`${f.label}-${i}`} className={styles.infoBlock}>
                        <div className={styles.label}>{f.label}</div>
                        <div className={styles.smallValue}>{f.value}</div>
                    </div>
                ))}

                {str(message) && (
                    <div className={styles.infoBlock}>
                        <div className={styles.message}>„{str(message)}”</div>
                    </div>
                )}

                {(str(dressCode) || str(specialInstructions)) && (
                    <div className={styles.infoBlock}>
                        {str(dressCode) && <div className={styles.smallValue}>Ținută: {str(dressCode)}</div>}
                        {str(specialInstructions) && <div className={styles.smallValue}>{str(specialInstructions)}</div>}
                    </div>
                )}

                <button type="button" className={styles.rsvpBtn} onClick={() => setShowRSVP(true)}>Confirmă Prezența</button>
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
