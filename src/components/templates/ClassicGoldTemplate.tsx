'use client'

import { useState } from 'react'
import styles from './ClassicGoldTemplate.module.css'
import RSVPModal from '@/components/RSVPModal'
import { Crown } from 'lucide-react'
import { Cinzel, Pinyon_Script, Lato } from 'next/font/google'
import {
    str, getMapUrl, getWazeUrl, getSchedule, getParents, getGodparents,
    validCustomFields, CustomField,
} from './templateUtils'

const cinzel = Cinzel({ weight: ['400', '700'], subsets: ['latin', 'latin-ext'], display: 'swap', variable: '--gold-cinzel' })
const pinyon = Pinyon_Script({ weight: '400', subsets: ['latin', 'latin-ext'], display: 'swap', variable: '--gold-script' })
const lato = Lato({ weight: ['300', '400', '700'], subsets: ['latin', 'latin-ext'], display: 'swap', variable: '--gold-lato' })

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

export default function ClassicGoldTemplate(props: Props) {
    const {
        id, title, date, location, locationUrl, message, eventType = 'nunta',
        groomName, brideName, childName, celebrantName,
        customFields, specialInstructions, dressCode, photoUrl,
    } = props

    const [showRSVP, setShowRSVP] = useState(false)
    const isWedding = eventType === 'nunta' || !eventType
    const isBaptism = eventType === 'botez'

    const name1 = isWedding
        ? (str(groomName) || str(title).split('&')[0]?.trim())
        : isBaptism ? (str(childName) || str(title)) : (str(title) || str(celebrantName))
    const name2 = isWedding ? (str(brideName) || str(title).split('&')[1]?.trim() || '') : ''

    const mapUrl = getMapUrl(location, locationUrl)
    const wazeUrl = getWazeUrl(location)
    const schedule = getSchedule(props)
    const parents = getParents(props)
    const godparentsText = getGodparents(props)
    const fields = validCustomFields(customFields)

    return (
        <div className={`${styles.container} ${cinzel.variable} ${pinyon.variable} ${lato.variable}`}>
            <div className={styles.card}>
                <div className={styles.borderFrame}></div>

                <div className={styles.headerIcon}>
                    <Crown size={26} strokeWidth={1.2} aria-hidden="true" />
                </div>

                <div className={`${styles.intro} ${str(message).length > 90 ? styles.introLong : ''}`}>
                    {str(message) || (isWedding ? 'Împreună cu familiile noastre, vă invităm la nunta noastră' : 'Vă invităm la evenimentul nostru special')}
                </div>

                {photoUrl && (
                    <div className={styles.photo}>
                        <img src={photoUrl} alt={name1 || 'Fotografie'} />
                    </div>
                )}

                <div className={styles.names}>
                    {name1 || 'Invitație'}
                    {name2 && (
                        <>
                            <span className={styles.ampersand}>&</span>
                            {name2}
                        </>
                    )}
                </div>

                {(str(date) || str(location) || mapUrl) && (
                    <div className={styles.dateSection}>
                        {str(date) && <div className={styles.dateDisplay}>{str(date)}</div>}
                        {str(location) && <div className={styles.locationDisplay}>{str(location)}</div>}
                        {mapUrl && (
                            <div className={styles.mapLinks}>
                                <a href={mapUrl} target="_blank" rel="noopener noreferrer">Vezi harta</a>
                                {wazeUrl && <a href={wazeUrl} target="_blank" rel="noopener noreferrer">Waze</a>}
                            </div>
                        )}
                    </div>
                )}

                {(parents.length > 0 || godparentsText) && (
                    <div className={styles.detailsGrid}>
                        {parents.length > 0 && (
                            <div className={styles.detailCol}>
                                <h3>{isBaptism ? 'Părinții' : 'Părinți'}</h3>
                                {parents.map((p) => <div key={p}>{p}</div>)}
                            </div>
                        )}
                        {godparentsText && (
                            <div className={styles.detailCol}>
                                <h3>Nași</h3>
                                <div>{godparentsText}</div>
                            </div>
                        )}
                    </div>
                )}

                {schedule.length > 0 && (
                    <div className={styles.detailsGrid}>
                        {schedule.map((s) => (
                            <div key={s.key} className={styles.detailCol}>
                                <h3>{s.label}</h3>
                                {s.time && <div>Ora: {s.time}</div>}
                                {s.loc && <div className={styles.small}>{s.loc}</div>}
                            </div>
                        ))}
                    </div>
                )}

                {fields.length > 0 && (
                    <div className={styles.detailsGrid}>
                        {fields.map((f, i) => (
                            <div key={`${f.label}-${i}`} className={styles.detailCol}>
                                <h3>{f.label}</h3>
                                <div>{f.value}</div>
                            </div>
                        ))}
                    </div>
                )}

                {(str(dressCode) || str(specialInstructions)) && (
                    <div className={styles.note}>
                        {str(dressCode) && <div>Ținută: {str(dressCode)}</div>}
                        {str(specialInstructions) && <div>{str(specialInstructions)}</div>}
                    </div>
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
