'use client'

import { useMemo, useState } from 'react'
import styles from './BoardingPassTemplate.module.css'
import RSVPModal from '@/components/RSVPModal'
import { Plane, Calendar, MapPin, User, Info, Users, Navigation, Clock, ShieldCheck } from 'lucide-react'
import {
    str, getMapUrl, getWazeUrl, getSchedule, getMainNames, validCustomFields, CustomField,
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
    celebrantName?: string
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
    age?: string
    specialInstructions?: string
    dressCode?: string
    photoUrl?: string
    customFields?: CustomField[]
}

const QR_SIZE = 21

/** Decorative, deterministic QR-like pattern (no network request, stable between renders). */
function buildQrCells(seedText: string): boolean[] {
    let seed = 2166136261
    for (let i = 0; i < seedText.length; i++) {
        seed ^= seedText.charCodeAt(i)
        seed = Math.imul(seed, 16777619) >>> 0
    }
    const rand = () => {
        seed ^= seed << 13; seed >>>= 0
        seed ^= seed >>> 17
        seed ^= seed << 5; seed >>>= 0
        return seed / 4294967296
    }
    const cells: boolean[] = []
    const inFinder = (x: number, y: number) =>
        (x < 8 && y < 8) || (x >= QR_SIZE - 8 && y < 8) || (x < 8 && y >= QR_SIZE - 8)
    for (let y = 0; y < QR_SIZE; y++) {
        for (let x = 0; x < QR_SIZE; x++) {
            if (inFinder(x, y)) {
                // Finder pattern: 7x7 ring + 3x3 center, 1-cell quiet separator.
                const fx = x >= QR_SIZE - 8 ? x - (QR_SIZE - 7) : x
                const fy = y >= QR_SIZE - 8 ? y - (QR_SIZE - 7) : y
                const inside = fx >= 0 && fx < 7 && fy >= 0 && fy < 7
                const ring = fx === 0 || fx === 6 || fy === 0 || fy === 6
                const core = fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4
                cells.push(inside && (ring || core))
            } else if (y === 6 || x === 6) {
                cells.push((x + y) % 2 === 0) // timing patterns
            } else {
                cells.push(rand() > 0.52)
            }
        }
    }
    return cells
}

export default function BoardingPassTemplate(props: Props) {
    const {
        id, date, location, locationUrl, message, eventType = 'nunta',
        groomName, brideName, childName, celebrantName,
        godparents, godparentsBaptism, parentsGroom, parentsBride,
        motherName, fatherName, age, specialInstructions, dressCode,
        photoUrl, customFields,
    } = props

    const [showRSVP, setShowRSVP] = useState(false)

    let airline = 'AIR LOVE'
    let fromCode = 'LOVE'
    let toCode = 'WED'

    if (eventType === 'botez') {
        airline = 'STORK AIR'
        fromCode = 'BABY'
        toCode = 'BAP'
    } else if (eventType === 'petrecere') {
        airline = 'PARTY JET'
        fromCode = 'GO'
        toCode = 'FUN'
    } else if (eventType === 'aniversare') {
        airline = 'B-DAY AIR'
        fromCode = 'YAY'
        toCode = 'BDAY'
    }

    const isWedding = eventType === 'nunta' || !eventType
    const isBaptism = eventType === 'botez'
    const passenger = getMainNames(props) || 'Invitat'
    const mapUrl = getMapUrl(location, locationUrl)
    const wazeUrl = getWazeUrl(location)
    const schedule = getSchedule(props)
    const fields = validCustomFields(customFields)
    const boardingTime = schedule.find((s) => s.time)?.time || ''
    const flightNo = `${airline.replace(/[^A-Z]/g, '').slice(0, 2)} ${String(id || passenger).split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 9000, 7) + 1000}`

    const qrCells = useMemo(() => buildQrCells(`${id || ''}|${passenger}`), [id, passenger])

    const crew: { label: string, value: string }[] = []
    if (isWedding) {
        if (str(groomName)) crew.push({ label: 'Mire', value: str(groomName) })
        if (str(brideName)) crew.push({ label: 'Mireasă', value: str(brideName) })
        if (str(parentsGroom)) crew.push({ label: 'Părinții mirelui', value: str(parentsGroom) })
        if (str(parentsBride)) crew.push({ label: 'Părinții miresei', value: str(parentsBride) })
        if (str(godparents)) crew.push({ label: 'Nași', value: str(godparents) })
    } else if (isBaptism) {
        if (str(childName)) crew.push({ label: 'Micuțul/Micuța', value: str(childName) })
        if (str(motherName)) crew.push({ label: 'Mama', value: str(motherName) })
        if (str(fatherName)) crew.push({ label: 'Tata', value: str(fatherName) })
        if (str(godparentsBaptism) || str(godparents)) crew.push({ label: 'Nași', value: str(godparentsBaptism) || str(godparents) })
    } else {
        if (str(celebrantName)) crew.push({ label: 'Sărbătorit', value: str(celebrantName) })
        if (str(age)) crew.push({ label: 'Vârstă', value: `${str(age)} ani` })
    }
    fields.forEach((f) => crew.push({ label: f.label, value: f.value }))

    const hasExtra = !!str(message) || crew.length > 0 || !!str(dressCode)

    return (
        <div className={styles.container}>
            <div className={styles.ticketWrapper}>
                <div className={styles.ticket}>

                    <div className={styles.mainSection}>
                        <div className={styles.header}>
                            <span className={styles.airline}><Plane size={22} className={styles.airlineIcon} /> {airline}</span>
                            <span className={styles.classType}>FIRST CLASS · {flightNo}</span>
                        </div>

                        <div className={styles.route}>
                            <div className={styles.cityCode}>
                                <div className={styles.code}>{fromCode}</div>
                                <div className={styles.cityName}>Plecare</div>
                            </div>
                            <div className={styles.flightPath}>
                                <span className={styles.pathLine} />
                                <Plane className={styles.planeIcon} size={30} />
                                <span className={styles.pathLine} />
                            </div>
                            <div className={`${styles.cityCode} ${styles.cityTo}`}>
                                <div className={styles.code}>{toCode}</div>
                                <div className={styles.cityName}>Destinație</div>
                            </div>
                        </div>

                        <div className={styles.passengerCell}>
                            {photoUrl && <img className={styles.avatar} src={photoUrl} alt={passenger} />}
                            <div className={styles.passengerText}>
                                <div className={styles.detailLabel}><User size={12} /> Pasager</div>
                                <div className={styles.passengerName}>{passenger}</div>
                            </div>
                        </div>

                        {(str(date) || boardingTime || str(location)) && (
                            <div className={styles.detailsGrid}>
                                {str(date) && (
                                    <div>
                                        <div className={styles.detailLabel}><Calendar size={12} /> Data</div>
                                        <div className={styles.detailValue}>{str(date)}</div>
                                    </div>
                                )}
                                {boardingTime && (
                                    <div>
                                        <div className={styles.detailLabel}><Clock size={12} /> Îmbarcare</div>
                                        <div className={styles.detailValue}>{boardingTime}</div>
                                    </div>
                                )}
                                {str(location) && (
                                    <div className={styles.gateCell}>
                                        <div className={styles.detailLabel}><MapPin size={12} /> Poarta / Locația</div>
                                        <div className={styles.detailValue}>{str(location)}</div>
                                    </div>
                                )}
                            </div>
                        )}

                        {(hasExtra || schedule.length > 0 || str(specialInstructions)) && (
                            <div className={styles.extraDetails}>
                                {hasExtra && (
                                    <div className={styles.extraGrid}>
                                        {str(message) && (
                                            <div>
                                                <div className={styles.detailLabel}><Info size={12} /> Mesaj</div>
                                                <p className={styles.message}>{str(message)}</p>
                                            </div>
                                        )}
                                        {(crew.length > 0 || str(dressCode)) && (
                                            <div>
                                                <div className={styles.detailLabel}><Users size={12} /> Echipajul</div>
                                                <div className={styles.crew}>
                                                    {crew.map((c, i) => (
                                                        <div key={`${c.label}-${i}`}><span className={styles.crewLabel}>{c.label}:</span> {c.value}</div>
                                                    ))}
                                                    {str(dressCode) && <div className={styles.dress}>Ținută: {str(dressCode)}</div>}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {schedule.length > 0 && (
                                    <div className={styles.itinerary}>
                                        <div className={styles.detailLabel}><Plane size={12} /> Itinerariu</div>
                                        <ul className={styles.scheduleList}>
                                            {schedule.map((s) => (
                                                <li key={s.key} className={styles.scheduleRow}>
                                                    <span className={styles.scheduleTime}>{s.time || '—'}</span>
                                                    <span className={styles.scheduleBody}>
                                                        <strong>{s.label}</strong>
                                                        {s.loc && <span className={styles.scheduleLoc}>{s.loc}</span>}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {str(specialInstructions) && (
                                    <div className={styles.rules}>
                                        <strong>Reguli la bord:</strong> {str(specialInstructions)}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className={styles.stubSection}>
                        <div className={styles.stubTitle}>BOARDING PASS</div>

                        <div className={styles.qrCode} aria-hidden="true">
                            <svg viewBox={`-1 -1 ${QR_SIZE + 2} ${QR_SIZE + 2}`} shapeRendering="crispEdges">
                                <rect x={-1} y={-1} width={QR_SIZE + 2} height={QR_SIZE + 2} fill="#fff" />
                                {qrCells.map((on, i) => on && (
                                    <rect key={i} x={i % QR_SIZE} y={Math.floor(i / QR_SIZE)} width={1} height={1} fill="#0f172a" />
                                ))}
                            </svg>
                        </div>

                        <div className={styles.stubActions}>
                            <div className={styles.security}><ShieldCheck size={13} /> Control de securitate: OK</div>
                            <button className={styles.checkInBtn} onClick={() => setShowRSVP(true)}>
                                Confirmă Prezența
                            </button>
                            {(mapUrl || wazeUrl) && (
                                <div className={styles.mapRow}>
                                    {mapUrl && (
                                        <a className={`${styles.checkInBtn} ${styles.mapBtn}`} href={mapUrl} target="_blank" rel="noopener noreferrer">
                                            <Navigation size={14} /> Harta
                                        </a>
                                    )}
                                    {wazeUrl && (
                                        <a className={`${styles.checkInBtn} ${styles.wazeBtn}`} href={wazeUrl} target="_blank" rel="noopener noreferrer">
                                            Waze
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className={styles.barcode}></div>
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
