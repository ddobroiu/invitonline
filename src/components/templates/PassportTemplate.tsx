'use client'

import { useState } from 'react'
import styles from './PassportTemplate.module.css'
import RSVPModal from '@/components/RSVPModal'
import { Plane, Globe, Heart, Baby, PartyPopper, Cake, Navigation, Stamp } from 'lucide-react'
import {
    str, shortLocation, getMapUrl, getWazeUrl, getMainNames, getSchedule, getParents, getGodparents,
    parseDate, eventLabel, validCustomFields, CustomField,
} from './templateUtils'

interface PassportTemplateProps {
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
    customFields?: CustomField[]
    photoUrl?: string
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
}

/** Machine-readable-zone style text: A-Z only, separators as "<". */
function toMrz(text: string): string {
    return text
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toUpperCase()
        .replace(/[^A-Z]+/g, '<<')
}

export default function PassportTemplate(props: PassportTemplateProps) {
    const {
        id, title, date, location, locationUrl, message, eventType = 'nunta',
        groomName, brideName, dressCode, specialInstructions, customFields, photoUrl,
    } = props
    const [isOpen, setIsOpen] = useState(false)
    const [showRSVP, setShowRSVP] = useState(false)

    const isWedding = eventType === 'nunta' || !eventType
    const isBaptism = eventType === 'botez'
    const names = getMainNames(props)
    const titleParts = str(title).split('&').map((s) => s.trim()).filter(Boolean)
    const holder1 = isWedding ? (str(groomName) || titleParts[0] || names) : names
    const holder2 = isWedding ? (str(brideName) || titleParts[1] || '') : ''

    const parsed = parseDate(date)
    const mapUrl = getMapUrl(location, locationUrl)
    const wazeUrl = getWazeUrl(location)
    const schedule = getSchedule(props)
    const parents = getParents(props)
    const godparentsText = getGodparents(props)
    const fields = validCustomFields(customFields)

    const mrzTitle = toMrz(names || 'INVITATIE')
    const mrzDate = (`${parsed.year.slice(-2)}${parsed.monthIndex >= 0 ? String(parsed.monthIndex + 1).padStart(2, '0') : ''}${parsed.day.padStart(2, '0')}` || '').replace(/\D/g, '').padEnd(6, '0').slice(0, 6)

    const country = isWedding ? 'Republica Dragostei' : isBaptism ? 'Republica Îngerașilor' : 'Republica Distracției'
    const coverEvent = isWedding ? 'Nunta Noastră' : isBaptism ? 'Botez' : eventType === 'aniversare' ? 'Aniversare' : 'Petrecere'
    const Icon = isWedding ? Heart : isBaptism ? Baby : eventType === 'aniversare' ? Cake : PartyPopper

    return (
        <div className={styles.passportWrapper}>
            <div
                className={`${styles.book} ${isOpen ? styles.open : ''}`}
                onClick={() => setIsOpen((o) => !o)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setIsOpen((o) => !o)
                    }
                }}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                aria-label={isOpen ? 'Închide pașaportul' : 'Deschide pașaportul'}
            >
                {/* --- RIGHT PAGE (VISAS / EXTRA INFO) --- */}
                <div className={styles.rightPage}>
                    <div className={`${styles.header} ${styles.dashedHeader}`}>
                        <div className={styles.headerText}>Vize & Mențiuni</div>
                        <div className={styles.headerText}>{str(date)}</div>
                    </div>

                    <div className={styles.field}>
                        <div className={styles.fieldLabel}>Mesaj</div>
                        <div className={styles.messageValue}>
                            „{str(message) || 'Vă așteptăm cu drag!'}”
                        </div>
                    </div>

                    {str(location) && (
                        <div className={`${styles.field} ${styles.destination}`}>
                            <div className={styles.fieldLabel}>Destinație</div>
                            <div className={styles.fieldValue}>{str(location)}</div>
                        </div>
                    )}

                    {schedule.length > 0 && (
                        <div className={`${styles.stampBox} ${styles.scheduleBox}`}>
                            <div className={styles.stampLabel}>Program</div>
                            {schedule.map((s) => (
                                <div key={s.key} className={styles.scheduleRow}>
                                    <span className={styles.scheduleTime}>{s.time || '—'}</span>
                                    <span className={styles.scheduleText}>
                                        <strong>{s.label}</strong>
                                        {s.loc && <span className={styles.scheduleLoc}>{s.loc}</span>}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {(godparentsText || parents.length > 0 || fields.length > 0 || str(dressCode)) && (
                        <div className={styles.stampsGrid}>
                            {godparentsText && (
                                <div className={styles.stampBox}>
                                    <div className={styles.stampLabel}>Nași</div>
                                    <div className={styles.stampValue}>{godparentsText}</div>
                                </div>
                            )}

                            {parents.length > 0 && (
                                <div className={styles.stampBox}>
                                    <div className={styles.stampLabel}>Părinți</div>
                                    <div className={styles.stampValue}>
                                        {parents.map((p) => <div key={p}>{p}</div>)}
                                    </div>
                                </div>
                            )}

                            {fields.map((f, i) => (
                                <div key={`${f.label}-${i}`} className={styles.stampBox}>
                                    <div className={styles.stampLabel}>{f.label}</div>
                                    <div className={styles.stampValue}>{f.value}</div>
                                </div>
                            ))}

                            {str(dressCode) && (
                                <div className={styles.stampBox}>
                                    <div className={styles.stampLabel}>Ținută</div>
                                    <div className={styles.stampValue}>{str(dressCode)}</div>
                                </div>
                            )}
                        </div>
                    )}

                    {str(specialInstructions) && (
                        <div className={styles.note}>{str(specialInstructions)}</div>
                    )}

                </div>

                {/* --- FLIPPER (FRONT COVER & IDENTITY PAGE) --- */}
                <div className={styles.flipper}>
                    <div className={styles.front}>
                        <div className={styles.coverGold}>
                            <div className={styles.coverTitle}>Pașaport</div>
                            <div className={styles.emblem}>
                                <Globe strokeWidth={1} />
                            </div>
                            <div className={styles.coverBottom}>
                                <div className={styles.coverEvent}>{coverEvent}</div>
                                <div className={styles.coverNames}>{names}</div>
                                {str(date) && <div className={styles.coverDate}>{str(date)}</div>}
                            </div>
                        </div>
                    </div>

                    <div className={styles.back}>
                        <div className={styles.header}>
                            <div>
                                <div className={styles.headerText}>{country}</div>
                                <div className={styles.headerText}>Pașaport / Passport</div>
                            </div>
                            <Plane size={24} color="#333" />
                        </div>

                        <div className={styles.photoRow}>
                            <div className={styles.photoArea}>
                                {photoUrl ? (
                                    <img src={photoUrl} alt={names || 'Fotografie'} className={styles.photo} />
                                ) : (
                                    <Icon size={30} color="#bbb" />
                                )}
                            </div>
                            <div className={styles.fields}>
                                <div className={styles.field}>
                                    <div className={styles.fieldLabel}>Titular</div>
                                    <div className={styles.fieldValue}>{holder1 || '—'}</div>
                                </div>
                                <div className={styles.field}>
                                    <div className={styles.fieldLabel}>{holder2 ? 'Împreună cu' : 'Eveniment'}</div>
                                    <div className={styles.fieldValue}>{holder2 || eventLabel(eventType)}</div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.infoGrid}>
                            <div className={styles.field}>
                                <div className={styles.fieldLabel}>Cetățenie</div>
                                <div className={styles.fieldValue}>{isWedding ? 'IUBIRE' : 'BUCURIE'}</div>
                            </div>
                            <div className={styles.field}>
                                <div className={styles.fieldLabel}>Data</div>
                                <div className={styles.fieldValue}>{str(date) || '—'}</div>
                            </div>
                            <div className={`${styles.field} ${styles.fullRow}`}>
                                <div className={styles.fieldLabel}>Locul emiterii / Locația</div>
                                <div className={styles.fieldValue}>{shortLocation(location) || '—'}</div>
                            </div>
                        </div>

                        <div className={styles.officialStamp}>
                            Intrare<br />permisă<br />{parsed.day && parsed.month ? `${parsed.day} ${parsed.month.slice(0, 3).toUpperCase()}` : str(date).split(' ')[0]}
                        </div>

                        <div className={styles.mrz}>
                            P&lt;ROU{mrzTitle}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;<br />
                            {mrzDate}6M&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;01
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.hint}>
                {isOpen ? 'apasă pe pașaport pentru a-l închide' : 'apasă pe pașaport pentru a-l deschide'}
            </div>

            <div className={styles.actions}>
                <button className={styles.rsvpButton} onClick={() => setShowRSVP(true)}>
                    <Stamp size={16} /> Confirmă Prezența
                </button>
                {(mapUrl || wazeUrl) && (
                    <div className={styles.mapLinks}>
                        {mapUrl && (
                            <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                                <Navigation size={12} /> Vezi harta
                            </a>
                        )}
                        {wazeUrl && <a href={wazeUrl} target="_blank" rel="noopener noreferrer">Waze</a>}
                    </div>
                )}
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
