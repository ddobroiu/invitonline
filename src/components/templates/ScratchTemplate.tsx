'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import styles from './ScratchTemplate.module.css'
import RSVPModal from '@/components/RSVPModal'
import { Trophy, Calendar, MapPin, Users, Info, Gift, Navigation, Sparkles } from 'lucide-react'
import {
    str, getMapUrl, getWazeUrl, getMainNames, getSchedule, validCustomFields, CustomField,
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
    theme?: string
    specialInstructions?: string
    dressCode?: string
    customFields?: CustomField[]
    photoUrl?: string
}

const BRUSH = 28 // brush radius in CSS pixels

export default function ScratchTemplate(props: Props) {
    const {
        id, date, location, locationUrl, message, eventType = 'nunta',
        groomName, brideName, childName, celebrantName,
        godparents, godparentsBaptism, parentsGroom, parentsBride,
        motherName, fatherName, age, theme, specialInstructions, dressCode,
        customFields, photoUrl,
    } = props

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const moveCount = useRef(0)
    const lastPoint = useRef<{ x: number, y: number } | null>(null)
    const sizeRef = useRef({ w: 0, h: 0 })
    const revealedRef = useRef(false)
    const [isRevealed, setIsRevealed] = useState(false)
    const [hasScratched, setHasScratched] = useState(false)
    const [showRSVP, setShowRSVP] = useState(false)

    let mainPrize = 'O NUNTĂ DE VIS'
    if (eventType === 'botez') mainPrize = 'UN BOTEZ DE POVESTE'
    else if (eventType === 'aniversare') mainPrize = 'O ANIVERSARE DE NEUITAT'
    else if (eventType === 'petrecere') mainPrize = 'O PETRECERE SUPREMĂ'

    const names = getMainNames(props)
    const mapUrl = getMapUrl(location, locationUrl)
    const wazeUrl = getWazeUrl(location)
    const schedule = getSchedule(props)
    const fields = validCustomFields(customFields)
    const isWedding = eventType === 'nunta' || !eventType
    const isBaptism = eventType === 'botez'

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

    const hasCast = cast.length > 0 || !!str(dressCode)
    const hasProgram = schedule.length > 0 || !!str(theme)

    const reveal = useCallback(() => {
        if (revealedRef.current) return
        revealedRef.current = true
        setIsRevealed(true)
    }, [])

    /** (Re)draws the scratch layer at the wrapper's current layout size (crisp on high-DPI screens). */
    const drawCover = useCallback(() => {
        if (revealedRef.current) return
        const canvas = canvasRef.current
        const wrapper = wrapperRef.current
        const ctx = canvas?.getContext('2d', { willReadFrequently: true })
        if (!canvas || !ctx || !wrapper) return

        const width = Math.max(1, Math.round(wrapper.clientWidth))
        const height = Math.max(1, Math.round(wrapper.clientHeight))
        if (sizeRef.current.w === width && sizeRef.current.h === height) return
        sizeRef.current = { w: width, h: height }
        const dpr = Math.min(2, window.devicePixelRatio || 1)
        canvas.width = Math.round(width * dpr)
        canvas.height = Math.round(height * dpr)
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

        ctx.globalCompositeOperation = 'source-over'
        const gradient = ctx.createLinearGradient(0, 0, width, height)
        gradient.addColorStop(0, '#f7d046')
        gradient.addColorStop(0.35, '#e9a23b')
        gradient.addColorStop(0.65, '#f1c40f')
        gradient.addColorStop(1, '#e67e22')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)

        // Foil texture
        const specks = Math.round((width * height) / 60)
        for (let i = 0; i < specks; i++) {
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.18})`
            ctx.fillRect(Math.random() * width, Math.random() * height, 2, 2)
        }
        // Diagonal sheen stripes
        ctx.strokeStyle = 'rgba(255,255,255,0.08)'
        ctx.lineWidth = 18
        for (let x = -height; x < width; x += 70) {
            ctx.beginPath()
            ctx.moveTo(x, height)
            ctx.lineTo(x + height, 0)
            ctx.stroke()
        }

        // Hint text near the top of the card so it is visible without scrolling
        const cy = Math.min(height * 0.42, 240)
        const big = Math.max(18, Math.min(30, Math.floor(width / 11)))
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.shadowBlur = 12
        ctx.shadowColor = 'rgba(0,0,0,0.35)'
        ctx.fillStyle = '#fff'
        ctx.font = `900 ${big}px Inter, system-ui, sans-serif`
        ctx.fillText('RĂZUIEȘTE AICI', width / 2, cy)
        ctx.font = `800 ${Math.round(big * 0.5)}px Inter, system-ui, sans-serif`
        ctx.fillText('cu degetul sau cu mouse-ul', width / 2, cy + big * 1.1)
        ctx.font = `900 ${Math.round(big * 0.48)}px Inter, system-ui, sans-serif`
        ctx.fillText('★ JACKPOT GARANTAT ★', width / 2, cy + big * 2.2)
        ctx.shadowBlur = 0

        // Coin circles as decoration
        ctx.fillStyle = 'rgba(255,255,255,0.18)'
        for (const [px, py, r] of [[0.15, 0.12, 22], [0.85, 0.2, 16], [0.2, 0.8, 18], [0.8, 0.72, 26]] as const) {
            ctx.beginPath()
            ctx.arc(width * px, height * py, r, 0, Math.PI * 2)
            ctx.fill()
        }
    }, [])

    // Keep the canvas in sync with the card size (content changes, mockup/window resize).
    useEffect(() => {
        const wrapper = wrapperRef.current
        if (!wrapper) return
        drawCover()
        if (typeof ResizeObserver === 'undefined') return
        const observer = new ResizeObserver(() => drawCover())
        observer.observe(wrapper)
        return () => observer.disconnect()
    }, [drawCover])

    /**
     * Reveal when enough foil is gone: either 45% of the whole card, or 60% of the part of the
     * card currently on screen (tall cards on phones can't be fully scratched without scrolling).
     */
    const checkProgress = () => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d', { willReadFrequently: true })
        if (!canvas || !ctx || revealedRef.current) return
        const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const rect = canvas.getBoundingClientRect()
        const scale = canvas.height / Math.max(1, rect.height)
        const visTop = Math.max(0, -rect.top) * scale
        const visBottom = Math.min(rect.height, window.innerHeight - rect.top) * scale

        let total = 0, cleared = 0, visTotal = 0, visCleared = 0
        const step = 6
        for (let y = 0; y < canvas.height; y += step) {
            const inView = y >= visTop && y <= visBottom
            for (let x = 0; x < canvas.width; x += step) {
                const alpha = data[(y * canvas.width + x) * 4 + 3]
                total++
                if (alpha === 0) cleared++
                if (inView) {
                    visTotal++
                    if (alpha === 0) visCleared++
                }
            }
        }
        if ((total && cleared / total > 0.45) || (visTotal > total * 0.25 && visCleared / visTotal > 0.6)) reveal()
    }

    const scratchAt = (clientX: number, clientY: number) => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d', { willReadFrequently: true })
        if (!canvas || !ctx) return
        const rect = canvas.getBoundingClientRect()
        if (!rect.width || !rect.height) return
        // CSS-pixel coordinates (the context is already scaled for DPR); handles CSS-scaled previews.
        const x = (clientX - rect.left) * (sizeRef.current.w / rect.width)
        const y = (clientY - rect.top) * (sizeRef.current.h / rect.height)

        ctx.globalCompositeOperation = 'destination-out'
        ctx.strokeStyle = '#000' // fully opaque brush = fully erased foil
        ctx.fillStyle = '#000'
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.lineWidth = BRUSH * 2
        const last = lastPoint.current
        ctx.beginPath()
        if (last) {
            ctx.moveTo(last.x, last.y)
            ctx.lineTo(x, y)
            ctx.stroke()
        } else {
            ctx.arc(x, y, BRUSH, 0, Math.PI * 2)
            ctx.fill()
        }
        ctx.globalCompositeOperation = 'source-over'
        lastPoint.current = { x, y }

        if (!hasScratched) setHasScratched(true)
        moveCount.current++
        if (moveCount.current % 6 === 0) checkProgress()
    }

    const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (revealedRef.current) return
        lastPoint.current = null
        scratchAt(e.clientX, e.clientY)
    }

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (revealedRef.current) return
        // Mouse scratches on hover; touch/pen only while pressed.
        if (e.pointerType !== 'mouse' && e.buttons === 0) return
        const events = typeof e.nativeEvent.getCoalescedEvents === 'function' ? e.nativeEvent.getCoalescedEvents() : []
        if (events.length > 1) events.forEach((ev) => scratchAt(ev.clientX, ev.clientY))
        else scratchAt(e.clientX, e.clientY)
    }

    const handlePointerEnd = () => {
        lastPoint.current = null
        checkProgress()
    }

    return (
        <div className={styles.scratchContainer}>
            <div className={styles.stage}>
                <div className={`${styles.cardWrapper} ${isRevealed ? styles.revealed : ''}`} ref={wrapperRef}>
                    <div className={styles.cardContent}>
                        <div className={styles.headerTitle}><Trophy size={14} /> LOZ CÂȘTIGĂTOR</div>

                        <div className={styles.top}>
                            {photoUrl ? (
                                <div className={styles.photo}>
                                    <img src={photoUrl} alt={names || 'Fotografie'} />
                                </div>
                            ) : (
                                <>
                                    <h1 className={styles.prizeTitle}>JACKPOT!</h1>
                                    <div className={styles.jackpotLabel}>BILET PREMIUM</div>
                                </>
                            )}
                            {names && <div className={styles.names}>{names}</div>}
                        </div>

                        <div className={styles.prizeDetails}>
                            <div className={`${styles.detailItem} ${styles.prizeItem}`}>
                                <div className={styles.detailLabel}><Gift size={12} /> Premiul tău</div>
                                <div className={styles.prizeValue}>{mainPrize}</div>
                            </div>
                            {(str(date) || str(location)) && (
                                <div className={`${styles.detailItem} ${styles.left}`}>
                                    <div className={styles.twoCols}>
                                        {str(date) && (
                                            <div>
                                                <div className={styles.detailLabel}><Calendar size={12} /> Data</div>
                                                <div className={styles.detailValue}>{str(date)}</div>
                                            </div>
                                        )}
                                        {str(location) && (
                                            <div>
                                                <div className={styles.detailLabel}><MapPin size={12} /> Locul</div>
                                                <div className={styles.detailValue}>{str(location)}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            {str(message) && (
                                <div className={styles.detailItem}>
                                    <div className={styles.message}>„{str(message)}”</div>
                                </div>
                            )}
                            {(hasCast || hasProgram || str(specialInstructions)) && (
                                <div className={`${styles.detailItem} ${styles.left}`}>
                                    <div className={styles.twoCols}>
                                        {hasCast && (
                                            <div>
                                                <div className={styles.detailLabel}><Users size={12} /> Distribuție</div>
                                                <ul className={styles.list}>
                                                    {cast.map((c, i) => (
                                                        <li key={`${c.label}-${i}`}><strong>{c.label}:</strong> {c.value}</li>
                                                    ))}
                                                    {str(dressCode) && <li className={styles.dress}>Ținută: {str(dressCode)}</li>}
                                                </ul>
                                            </div>
                                        )}
                                        {hasProgram && (
                                            <div>
                                                <div className={styles.detailLabel}><Info size={12} /> Program</div>
                                                <ul className={styles.list}>
                                                    {schedule.map((s) => (
                                                        <li key={s.key}>
                                                            <span className={styles.time}>{s.time}</span> <strong>{s.label}</strong>
                                                            {s.loc && <span className={styles.loc}>{s.loc}</span>}
                                                        </li>
                                                    ))}
                                                    {str(theme) && <li><strong>Tema:</strong> {str(theme)}</li>}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                    {str(specialInstructions) && (
                                        <div className={styles.bonus}>
                                            <strong>Bonus:</strong> {str(specialInstructions)}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className={styles.footer}>
                            <button className={styles.claimBtn} onClick={() => setShowRSVP(true)} tabIndex={isRevealed ? 0 : -1}>
                                Confirmă Prezența
                            </button>
                            {mapUrl && (
                                <div className={styles.mapRow}>
                                    <a className={`${styles.claimBtn} ${styles.darkBtn}`} href={mapUrl} target="_blank" rel="noopener noreferrer" tabIndex={isRevealed ? 0 : -1}>
                                        <Navigation size={14} /> Vezi harta
                                    </a>
                                    {wazeUrl && (
                                        <a className={`${styles.claimBtn} ${styles.darkBtn}`} href={wazeUrl} target="_blank" rel="noopener noreferrer" tabIndex={isRevealed ? 0 : -1}>
                                            Waze
                                        </a>
                                    )}
                                </div>
                            )}
                            <div className={styles.barCode}></div>
                        </div>
                    </div>

                    <canvas
                        ref={canvasRef}
                        className={`${styles.canvas} ${isRevealed ? styles.hidden : ''}`}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerEnd}
                        onPointerLeave={handlePointerEnd}
                        onPointerCancel={handlePointerEnd}
                        aria-label="Zonă de răzuit — răzuiește pentru a vedea invitația"
                        role="img"
                    />
                </div>

                <div className={styles.helper} aria-live="polite">
                    {isRevealed ? (
                        <span className={styles.won}><Sparkles size={15} /> Felicitări! Ai câștigat o invitație!</span>
                    ) : (
                        <button type="button" className={styles.revealBtn} onClick={reveal}>
                            {hasScratched ? 'Arată tot biletul' : 'Nu poți răzui? Arată invitația'}
                        </button>
                    )}
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
