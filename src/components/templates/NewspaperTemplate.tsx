'use client'

import { useState } from 'react'
import styles from './NewspaperTemplate.module.css'
import RSVPModal from '@/components/RSVPModal'
import { Heart, Baby, PartyPopper, Cake, Scissors } from 'lucide-react'
import {
    str, shortLocation, getMapUrl, getWazeUrl, getMainNames, getSchedule, getParents, getGodparents,
    parseDate, validCustomFields, CustomField,
} from './templateUtils'

interface NewspaperTemplateProps {
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
    parentsGroom?: string
    parentsBride?: string
    godparents?: string
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
    photoUrl?: string
    customFields?: CustomField[]
}

const PAPER: Record<string, { name: string, slogan: string, weather: string, article: (who: string) => string, lead: string }> = {
    nunta: {
        name: 'The Wedding Times',
        slogan: 'Ziarul oficial al celor mai frumoase povești de dragoste',
        weather: 'IUBIRE MAXIMĂ & SOARE',
        article: (who) => `Redacția noastră a aflat că ${who} au decis să își unească destinele într-o ceremonie fastuoasă.`,
        lead: 'Pregătirile sunt în toi, iar lista de invitați include cele mai importante persoane din viața cuplului.',
    },
    botez: {
        name: 'The Baby Times',
        slogan: 'Ziarul oficial al celor mai dulci vești',
        weather: 'ZÂMBETE & GÂNGURELI',
        article: (who) => `Redacția noastră a aflat că micuțul/micuța ${who} va fi creștinat(ă) într-o ceremonie plină de emoție.`,
        lead: 'Familia se pregătește intens, iar lista de invitați include cele mai dragi persoane din viața celui mic.',
    },
    aniversare: {
        name: 'The Birthday Times',
        slogan: 'Ziarul oficial al celor mai frumoase aniversări',
        weather: 'TORT & ARTIFICII',
        article: (who) => `Redacția noastră a aflat că ${who} sărbătorește o nouă aniversare și nu vrea să o facă fără tine.`,
        lead: 'Tortul este comandat, muzica e pregătită, iar lista de invitați include doar oameni speciali.',
    },
    petrecere: {
        name: 'The Party Times',
        slogan: 'Ziarul oficial al celor mai tari petreceri',
        weather: 'DISTRACȚIE 100%',
        article: (who) => `Redacția noastră a aflat că ${who} pregătește o petrecere de neuitat.`,
        lead: 'DJ-ul e confirmat, atmosfera e garantată, iar lista de invitați include cei mai buni prieteni.',
    },
}

export default function NewspaperTemplate(props: NewspaperTemplateProps) {
    const {
        id, date, location, locationUrl, message, eventType = 'nunta',
        groomName, brideName, childName, celebrantName, age,
        dressCode, specialInstructions, customFields, photoUrl,
    } = props

    const [showRSVP, setShowRSVP] = useState(false)

    const type = PAPER[eventType] ? eventType : 'nunta'
    const paper = PAPER[type]
    const names = getMainNames(props) || 'Protagoniștii'
    const year = parseDate(date).year || String(new Date().getFullYear())
    const mapUrl = getMapUrl(location, locationUrl)
    const wazeUrl = getWazeUrl(location)
    const schedule = getSchedule(props)
    const parents = getParents(props)
    const godparentsText = getGodparents(props)
    const fields = validCustomFields(customFields)

    const protagonists: { label: string, value: string }[] = []
    if (type === 'nunta') {
        if (str(groomName)) protagonists.push({ label: 'Mire', value: str(groomName) })
        if (str(brideName)) protagonists.push({ label: 'Mireasă', value: str(brideName) })
    } else if (type === 'botez') {
        if (str(childName)) protagonists.push({ label: 'Micuțul/Micuța', value: str(childName) })
    } else {
        if (str(celebrantName)) protagonists.push({ label: 'Sărbătorit', value: str(celebrantName) })
        if (str(age)) protagonists.push({ label: 'Vârstă', value: `${str(age)} ani` })
    }

    const Icon = type === 'nunta' ? Heart : type === 'botez' ? Baby : type === 'aniversare' ? Cake : PartyPopper

    return (
        <div className={styles.paperWrapper}>
            <div className={styles.newspaper}>
                <div className={styles.headerMeta}>
                    <div className={styles.weatherBox}>
                        <strong>METEO:</strong> {paper.weather}
                    </div>
                    <div className={styles.editionInfo}>
                        NR. 1 • VOL. {year} • EDIȚIE LIMITATĂ
                    </div>
                    <div className={styles.priceBox}>
                        PREȚ: UN ZÂMBET
                    </div>
                </div>

                <div className={styles.masthead}>
                    <h1>{paper.name}</h1>
                    <div className={styles.slogan}>„{paper.slogan}”</div>
                </div>

                <div className={styles.doubleRule} aria-hidden="true"></div>

                <div className={styles.mainHeadline}>
                    {names}: EVENIMENTUL DECENIULUI A FOST CONFIRMAT!
                </div>

                {str(date) && (
                    <div className={styles.subHeadline}>
                        <em>Surse exclusive confirmă data de {str(date)} ca fiind „cea mai importantă zi din istorie”.</em>
                    </div>
                )}

                <div className={styles.articleBody}>
                    <div className={styles.firstColumn}>
                        <div className={styles.eventPhotoContainer}>
                            {photoUrl ? (
                                <img src={photoUrl} alt={names} className={styles.actualPhoto} />
                            ) : (
                                <div className={styles.placeholderPhoto}>
                                    <Icon size={50} strokeWidth={1} />
                                </div>
                            )}
                            <div className={styles.stamp}>EXCLUSIV</div>
                            <div className={styles.photoCaption}>▲ FIG 1. Protagoniștii acestui eveniment istoric.</div>
                        </div>

                        <p className={styles.articleText}>
                            <span className={styles.dropCap}>D</span>intr-o mare de evenimente mondene, unul singur strălucește cu adevărat.{' '}
                            {paper.article(names)}
                            {str(location) && <> Locația aleasă, <strong>{str(location)}</strong>, va deveni centrul universului pentru o zi.</>}
                        </p>
                    </div>

                    <div className={styles.secondColumn}>
                        <div className={styles.leadStory}>
                            <h3>DETALIILE SCANDALOS DE FRUMOASE</h3>
                            <p>
                                Deși s-a încercat păstrarea secretului, reporterii noștri au aflat totul. {paper.lead}
                            </p>
                            <div className={styles.quoteBox}>
                                „{str(message) || 'Vă așteptăm să scriem istorie împreună!'}”
                            </div>
                        </div>

                        <div className={styles.infoGrid}>
                            {str(date) && (
                                <div className={styles.infoItem}>
                                    <div className={styles.infoLabel}>DATA</div>
                                    <div className={styles.infoValue}>{str(date)}</div>
                                </div>
                            )}
                            {str(location) && (
                                <div className={styles.infoItem}>
                                    <div className={styles.infoLabel}>LOCAȚIE</div>
                                    <div className={styles.infoValue}>{shortLocation(location)}</div>
                                </div>
                            )}
                            {schedule[0]?.time && (
                                <div className={styles.infoItem}>
                                    <div className={styles.infoLabel}>ORA</div>
                                    <div className={styles.infoValue}>{schedule[0].time}</div>
                                </div>
                            )}
                            <div className={styles.infoItem}>
                                <div className={styles.infoLabel}>ȚINUTĂ</div>
                                <div className={styles.infoValue}>{str(dressCode) || 'Elegantă'}</div>
                            </div>
                            {(mapUrl || wazeUrl) && (
                                <div className={styles.mapLinks}>
                                    {mapUrl && <a href={mapUrl} target="_blank" rel="noopener noreferrer">Vezi harta</a>}
                                    {wazeUrl && <a href={wazeUrl} target="_blank" rel="noopener noreferrer">Waze</a>}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.classifiedsTitle}>MICĂ PUBLICITATE & ANUNȚURI</div>
                <div className={styles.classifiedsGrid}>
                    {protagonists.length > 0 && (
                        <div className={styles.classifiedBox}>
                            <h4>PROTAGONIȘTI</h4>
                            {protagonists.map((p) => <p key={p.label}><strong>{p.label}:</strong> {p.value}</p>)}
                        </div>
                    )}
                    {parents.length > 0 && (
                        <div className={styles.classifiedBox}>
                            <h4>PĂRINȚI</h4>
                            {parents.map((p) => <p key={p}>{p}</p>)}
                        </div>
                    )}
                    {godparentsText && (
                        <div className={styles.classifiedBox}>
                            <h4>NAȘI</h4>
                            <p>{godparentsText}</p>
                        </div>
                    )}
                    {schedule.length > 0 && (
                        <div className={styles.classifiedBox}>
                            <h4>PROGRAM</h4>
                            {schedule.map((s) => (
                                <p key={s.key}><strong>{s.time}</strong> {s.label}{s.loc && ` – ${s.loc}`}</p>
                            ))}
                        </div>
                    )}
                    {fields.map((f, i) => (
                        <div key={`${f.label}-${i}`} className={styles.classifiedBox}>
                            <h4>{f.label.toLocaleUpperCase('ro-RO')}</h4>
                            <p>{f.value}</p>
                        </div>
                    ))}
                    {str(specialInstructions) && (
                        <div className={styles.classifiedBox}>
                            <h4>DE REȚINUT</h4>
                            <p>{str(specialInstructions)}</p>
                        </div>
                    )}
                    <button type="button" className={`${styles.classifiedBox} ${styles.darkBox}`} onClick={() => setShowRSVP(true)}>
                        <span className={styles.darkBoxTitle}>RSVP</span>
                        <span>Vă rugăm confirmați prezența — apăsați aici sau folosiți talonul de mai jos.</span>
                    </button>
                </div>

                <div className={styles.footerBar}>
                    INVITAȚII ONLINE NEWS GROUP © {year} • TIPĂRIT ÎN INIMA TA
                </div>

                <div className={styles.rsvpWrapper}>
                    <div className={styles.cutLine}>
                        <span aria-hidden="true"><Scissors size={20} strokeWidth={1.5} /></span>
                    </div>
                    <div className={styles.rsvpCoupon}>
                        <div className={styles.rsvpHeader}>TALON DE CONFIRMARE</div>
                        <div className={styles.rsvpContent}>
                            <p>DA, doresc să iau parte la acest eveniment istoric!</p>
                            <p className={styles.rsvpSub}>Vă rugăm să ne onorați cu prezența.</p>

                            <button className={styles.rsvpButton} onClick={() => setShowRSVP(true)}>
                                Confirmă Prezența
                            </button>

                            <div className={styles.rsvpFine}>
                                *Prin completarea acestui talon, sunteți de acord să vă distrați.
                            </div>
                        </div>
                    </div>
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
