'use client'

import { useRef, useEffect, useState } from 'react'
import styles from './ScratchTemplate.module.css'
import RSVPModal from '@/components/RSVPModal'
import { Trophy, Calendar, MapPin, Users, Info, Gift, Navigation } from 'lucide-react'

interface Props {
    id?: string
    title: string
    date: string
    location: string
    locationUrl?: string
    message: string
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
    // Baptism
    motherName?: string
    fatherName?: string
    godparentsBaptism?: string
    birthDate?: string
    childAge?: string
    churchTime?: string
    churchLoc?: string
    restaurantTime?: string
    restaurantLoc?: string
    // Party
    celebrantName?: string
    age?: string
    partyType?: string
    theme?: string
    specialInstructions?: string
    dressCode?: string
    customFields?: { label: string, value: string }[]
    photoUrl?: string
}


export default function ScratchTemplate({
    id, title, date, location, locationUrl, message, eventType = 'nunta',
    godparents, godparentsBaptism, parentsGroom, parentsBride,
    motherName, fatherName, birthDate, childAge,
    civilCeremonyTime, civilCeremonyLoc, religiousCeremonyTime, religiousCeremonyLoc,
    partyTime, partyLoc, churchTime, churchLoc, restaurantTime, restaurantLoc,
    age, partyType, theme, specialInstructions, dressCode,
    customFields, photoUrl
}: Props) {

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const [isRevealed, setIsRevealed] = useState(false)
    const [showRSVP, setShowRSVP] = useState(false)

    let mainPrize = 'O NUNTĂ DE VIS'
    if (eventType === 'botez') mainPrize = 'UN BOTEZ DE POVESTE'
    else if (eventType === 'petrecere') mainPrize = 'UN PARTY SUPREM'

    useEffect(() => {
        initCanvas()
    }, [title, date, location])

    const initCanvas = () => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        const wrapper = wrapperRef.current
        if (!canvas || !ctx || !wrapper) return

        const rect = wrapper.getBoundingClientRect()
        canvas.width = rect.width
        canvas.height = rect.height

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
        gradient.addColorStop(0, '#f1c40f')
        gradient.addColorStop(0.5, '#e67e22')
        gradient.addColorStop(1, '#f1c40f')

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        for (let i = 0; i < 3000; i++) {
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.15})`;
            ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
        }

        ctx.font = "bold 28px Inter, sans-serif"
        ctx.fillStyle = "#fff"
        ctx.textAlign = "center"
        ctx.shadowBlur = 15
        ctx.shadowColor = "rgba(0,0,0,0.5)"
        ctx.fillText("RĂZUIEȘTE AICI ✨", canvas.width / 2, canvas.height / 2 + 10)

        ctx.font = "bold 12px Inter, sans-serif"
        ctx.fillText("JACKPOT GARANTAT!", canvas.width / 2, canvas.height / 2 + 45)
    }

    const handleScratch = (e: any) => {
        if (isRevealed) return
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        const wrapper = wrapperRef.current
        if (!canvas || !ctx || !wrapper) return

        const rect = wrapper.getBoundingClientRect()
        const clientX = e.touches ? e.touches[0].clientX : e.clientX
        const clientY = e.touches ? e.touches[0].clientY : e.clientY

        const x = (clientX - rect.left)
        const y = (clientY - rect.top)

        ctx.globalCompositeOperation = 'destination-out'
        ctx.beginPath()
        ctx.arc(x, y, 35, 0, Math.PI * 2)
        ctx.fill()

        checkProgress(ctx, canvas)
    }

    const checkProgress = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const pixels = imageData.data
        let transparent = 0
        for (let i = 3; i < pixels.length; i += 160) {
            if (pixels[i] === 0) transparent++
        }
        if (transparent > (pixels.length / 160) * 0.4) {
            setIsRevealed(true)
        }
    }

    return (
        <div className={styles.scratchContainer}>
            <div className={styles.cardWrapper} ref={wrapperRef}>
                <div className={styles.cardContent}>
                    <div className={styles.headerTitle}><Trophy size={14} style={{ display: 'inline', marginRight: '5px' }} /> LOZ CÂȘTIGĂTOR</div>

                    <div>
                        {photoUrl ? (
                            <div style={{ margin: '10px 0', height: '150px', overflow: 'hidden', borderRadius: '8px' }}>
                                <img
                                    src={photoUrl}
                                    alt="Prize"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        border: '2px solid #f1c40f'
                                    }}
                                />
                            </div>
                        ) : (
                            <>
                                <h1 className={styles.prizeTitle}>JACKPOT!</h1>
                                <div className={styles.jackpotLabel}>PREMIUM TICKET</div>
                            </>
                        )}
                    </div>

                    <div className={styles.prizeDetails}>
                        <div className={styles.detailItem}>
                            <div className={styles.detailLabel}><Gift size={12} /> Premiu</div>
                            <div className={styles.detailValue}>{mainPrize}</div>
                        </div>
                        <div className={styles.detailItem} style={{ textAlign: 'left' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div>
                                    <div className={styles.detailLabel}><Calendar size={12} /> Data</div>
                                    <div className={styles.detailValue} style={{ fontSize: '0.9rem' }}>{date}</div>
                                </div>
                                <div>
                                    <div className={styles.detailLabel}><MapPin size={12} /> Locul</div>
                                    <div className={styles.detailValue} style={{ fontSize: '0.9rem' }}>{location}</div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.detailItem} style={{ textAlign: 'left', fontSize: '0.8rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <div>
                                    <div className={styles.detailLabel}><Users size={12} /> Distribuție</div>
                                    {customFields && customFields.map((field, i) => (
                                        field.label && field.value && (
                                            <div key={i}>{field.label}: {field.value}</div>
                                        )
                                    ))}
                                    {dressCode && <div style={{ color: '#e67e22', fontWeight: 800 }}>Dress: {dressCode}</div>}

                                </div>
                                <div>
                                    <div className={styles.detailLabel}><Info size={12} /> Info</div>
                                    {civilCeremonyTime && <div>Civilă: {civilCeremonyTime} {civilCeremonyLoc && `(${civilCeremonyLoc})`}</div>}
                                    {religiousCeremonyTime && <div>Religioasă: {religiousCeremonyTime} {religiousCeremonyLoc && `(${religiousCeremonyLoc})`}</div>}
                                    {partyTime && <div>Petrecere: {partyTime} {partyLoc && `(${partyLoc})`}</div>}
                                    {churchTime && <div>Biserică: {churchTime} {churchLoc && `(${churchLoc})`}</div>}
                                    {restaurantTime && <div>Local: {restaurantTime} {restaurantLoc && `(${restaurantLoc})`}</div>}
                                    {theme && <div>Tema: {theme}</div>}
                                </div>
                            </div>
                            {specialInstructions && (
                                <div style={{ marginTop: '10px', fontSize: '0.7rem', padding: '5px', background: '#f5f6fa', borderRadius: '4px' }}>
                                    <strong>Bonus:</strong> {specialInstructions}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <button className={styles.claimBtn} onClick={() => setShowRSVP(true)}>
                            REVENDICĂ PREMIUL (RSVP)
                        </button>
                        {locationUrl && (
                            <button
                                className={styles.claimBtn}
                                style={{ background: '#2f3640', marginTop: '10px' }}
                                onClick={() => window.open(locationUrl, '_blank')}
                            >
                                <Navigation size={14} style={{ display: 'inline', marginRight: '5px' }} /> VEZI LOCAȚIA
                            </button>
                        )}
                        <div className={styles.barCode}></div>
                    </div>
                </div>

                <canvas
                    ref={canvasRef}
                    className={`${styles.canvas} ${isRevealed ? styles.hidden : ''}`}
                    onMouseMove={handleScratch}
                    onTouchMove={handleScratch}
                />
            </div>

            <RSVPModal
                isOpen={showRSVP}
                onClose={() => setShowRSVP(false)}
                eventId={id}
            />
        </div>
    )
}
