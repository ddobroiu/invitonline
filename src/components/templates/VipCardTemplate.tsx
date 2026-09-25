'use client'

import { useState } from 'react'
import styles from './VipCardTemplate.module.css'
import RSVPModal from '@/components/RSVPModal'
import { Wifi, QrCode, Navigation, ShieldCheck, Calendar, MapPin } from 'lucide-react'
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
    groomName?: string
    brideName?: string
    childName?: string
    celebrantName?: string
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
    customFields?: CustomField[]
    photoUrl?: string
    dressCode?: string
    specialInstructions?: string
    age?: string
}

export default function VipCardTemplate(props: Props) {
    const {
        id, date, location, locationUrl, message, eventType = 'nunta',
        groomName, brideName, childName, celebrantName,
        godparents, godparentsBaptism, parentsGroom, parentsBride,
        motherName, fatherName, age, dressCode, specialInstructions,
        customFields, photoUrl,
    } = props
    const [isFlipped, setIsFlipped] = useState(false)
    const [showRSVP, setShowRSVP] = useState(false)

    const names = getMainNames(props)
    const parsed = parseDate(date)
    const year = parsed.year || String(new Date().getFullYear())
    const validOn = parsed.day && parsed.monthIndex >= 0 && parsed.year
        ? `${parsed.day.padStart(2, '0')}.${String(parsed.monthIndex + 1).padStart(2, '0')}.${parsed.year}`
        : str(date).split(',')[0]
    const mapUrl = getMapUrl(location, locationUrl)
    const wazeUrl = getWazeUrl(location)
    const schedule = getSchedule(props)
    const fields = validCustomFields(customFields)
    const isWedding = eventType === 'nunta' || !eventType
    const isBaptism = eventType === 'botez'

    const code = isBaptism ? 'BABY' : eventType === 'aniversare' ? 'BDAY' : eventType === 'petrecere' ? 'PRTY' : 'LOVE'
    const cardNumber = `0000 ${year} ${code} 8888`
    const cvv = (schedule.find((s) => s.time)?.time || '19:00').replace(/\D/g, '').slice(0, 4) || '1900'
    const bankName = isWedding ? 'ROYAL WEDDING BANK' : isBaptism ? 'LITTLE ANGEL BANK' : 'PREMIUM EVENTS INC.'

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

    const handleFlip = () => {
        if (!showRSVP) setIsFlipped((f) => !f)
    }

    const openRSVP = (e: React.MouseEvent) => {
        e.stopPropagation()
        setShowRSVP(true)
    }

    const photoBg = (overlay: string) => photoUrl ? {
        backgroundImage: `${overlay}, url("${photoUrl}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    } : {}
    const cardStyle = photoBg('linear-gradient(rgba(0,0,0,0.62), rgba(0,0,0,0.82))')
    const backStyle = photoBg('linear-gradient(rgba(0,0,0,0.86), rgba(0,0,0,0.9))')

    return (
        <div className={styles.container}>
            <div className={styles.layout}>
                <div className={styles.cardCol}>
                    <div
                        className={styles.scene}
                        onClick={handleFlip}
                        onKeyDown={(e) => {
                            if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
                                e.preventDefault()
                                handleFlip()
                            }
                        }}
                        role="button"
                        tabIndex={0}
                        aria-pressed={isFlipped}
                        aria-label="Întoarce cardul VIP"
                    >
                        <div className={`${styles.card} ${isFlipped ? styles.isFlipped : ''}`}>

                            {/* --- FRONT FACE --- */}
                            <div className={`${styles.face} ${styles.front}`} style={cardStyle}>
                                <div className={styles.topRow}>
                                    <div className={styles.bankName}>{bankName}</div>
                                    <Wifi className={styles.contactless} color="rgba(255,255,255,0.45)" />
                                </div>

                                <div className={styles.chip} aria-hidden="true"></div>

                                <div className={styles.number}>{cardNumber}</div>

                                <div className={styles.details}>
                                    <div className={styles.holder}>
                                        <div className={styles.label}>TITULAR</div>
                                        <div className={`${styles.value} ${styles.holderName}`}>{names || 'Invitat VIP'}</div>
                                    </div>
                                    {validOn && (
                                        <div className={styles.validOn}>
                                            <div className={styles.label}>VALABIL PE</div>
                                            <div className={styles.value}>{validOn}</div>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.logo}>VIP ACCESS</div>
                            </div>

                            {/* --- BACK FACE --- */}
                            <div className={`${styles.face} ${styles.back}`} style={backStyle}>
                                <div className={styles.magneticStrip} aria-hidden="true"></div>

                                <div className={styles.signatureRow}>
                                    <div className={styles.signatureArea}>{names}</div>
                                    <div className={styles.cvv}>{cvv}</div>
                                </div>

                                <div className={styles.backContent}>
                                    <div className={styles.backText}>
                                        {str(location) && (
                                            <div className={`${styles.message} ${styles.access}`}>
                                                <ShieldCheck className={styles.accessIcon} />
                                                Acces exclusiv la: <strong>{str(location)}</strong>
                                            </div>
                                        )}
                                        {str(message) && (
                                            <div className={`${styles.message} ${styles.backQuote}`}>
                                                „{str(message)}”
                                            </div>
                                        )}
                                    </div>

                                    <div className={styles.actions}>
                                        <div className={styles.qr}>
                                            <QrCode color="#000" />
                                        </div>
                                        <button type="button" className={styles.rsvpBtn} onClick={openRSVP}>
                                            RSVP
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className={styles.instruction}>
                        Apasă pe card pentru a-l întoarce ↻
                    </div>
                </div>

                {/* Statement: all the details, always readable (the card itself is small) */}
                <div className={styles.statement}>
                    <div className={styles.statementTitle}>Extras VIP</div>
                    {str(date) && (
                        <div className={styles.statementRow}><Calendar size={14} /> <span>{str(date)}</span></div>
                    )}
                    {str(location) && (
                        <div className={styles.statementRow}><MapPin size={14} /> <span>{str(location)}</span></div>
                    )}

                    {schedule.length > 0 && (
                        <div className={styles.statementBlock}>
                            {schedule.map((s) => (
                                <div key={s.key} className={styles.statementLine}>
                                    <span>{s.label}{s.loc && <em> · {s.loc}</em>}</span>
                                    <strong className={styles.time}>{s.time}</strong>
                                </div>
                            ))}
                        </div>
                    )}

                    {cast.length > 0 && (
                        <div className={styles.statementBlock}>
                            {cast.map((c, i) => (
                                <div key={`${c.label}-${i}`} className={`${styles.statementLine} ${styles.castLine}`}>
                                    <span className={styles.castLabel}>{c.label}</span>
                                    <strong className={styles.castValue}>{c.value}</strong>
                                </div>
                            ))}
                        </div>
                    )}

                    {str(specialInstructions) && <div className={styles.statementNote}>{str(specialInstructions)}</div>}

                    <div className={styles.statementActions}>
                        <button type="button" className={styles.primaryBtn} onClick={openRSVP}>Confirmă Prezența</button>
                        {mapUrl && (
                            <a className={styles.secondaryBtn} href={mapUrl} target="_blank" rel="noopener noreferrer">
                                <Navigation size={14} /> Vezi harta
                            </a>
                        )}
                        {wazeUrl && (
                            <a className={styles.secondaryBtn} href={wazeUrl} target="_blank" rel="noopener noreferrer">
                                Waze
                            </a>
                        )}
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
