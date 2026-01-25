'use client'

import { useRef, useEffect, useState } from 'react'
import styles from '@/app/templates/scratch/page.module.css'

interface Props {
    title: string
    date: string
    location: string
    message: string
    eventType?: string
}

export default function ScratchTemplate({ title, date, location, message, eventType = 'nunta' }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const [isRevealed, setIsRevealed] = useState(false)

    let mainPrize = 'O NUNTĂ DE VIS'
    let winTitle = 'JACKPOT!'

    if (eventType === 'botez') {
        mainPrize = 'UN BOTEZ DE POVESTE'
        winTitle = "IT'S A BABY!"
    } else if (eventType === 'aniversare') {
        mainPrize = 'PARTY LEGENDAR'
        winTitle = 'BIRTHDAY BASH!'
    } else if (eventType === 'petrecere') {
        mainPrize = 'SUPREME PARTY'
        winTitle = 'YOU ARE INVITED!'
    }

    // Reset scratch on data change
    useEffect(() => {
        setIsRevealed(false)
        initCanvas()
    }, [title, date, location, eventType])

    const initCanvas = () => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (!canvas || !ctx) return

        canvas.width = 300 // Slightly smaller for preview
        canvas.height = 400

        const gradient = ctx.createLinearGradient(0, 0, 300, 400)
        gradient.addColorStop(0, '#DAA520')
        gradient.addColorStop(0.25, '#FFD700')
        gradient.addColorStop(0.5, '#F0E68C')
        gradient.addColorStop(0.75, '#DAA520')
        gradient.addColorStop(1, '#B8860B')

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.font = "bold 24px Arial"
        ctx.fillStyle = "#fff"
        ctx.textAlign = "center"
        ctx.shadowColor = "rgba(0,0,0,0.5)"
        ctx.shadowBlur = 5
        ctx.fillText("RĂZUIEȘTE AICI!", canvas.width / 2, canvas.height / 2)
        ctx.fillText("🎁", canvas.width / 2, canvas.height / 2 - 40)

        // Pattern
        ctx.shadowBlur = 0
        ctx.fillStyle = "rgba(255,255,255,0.1)"
        for (let i = 0; i < 400; i += 20) {
            ctx.fillRect(0, i, 300, 2)
            ctx.fillRect(i, 0, 2, 400)
        }
    }

    useEffect(() => {
        initCanvas()
    }, [])

    const handleScratch = (e: React.MouseEvent | React.TouchEvent) => {
        if (isRevealed) return

        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        const wrapper = wrapperRef.current
        if (!canvas || !ctx || !wrapper) return

        const rect = wrapper.getBoundingClientRect()
        let x, y

        // Calculate scaling if CSS scales the element
        const scaleX = canvas.width / rect.width
        const scaleY = canvas.height / rect.height

        if ('touches' in e) {
            x = (e.touches[0].clientX - rect.left) * scaleX
            y = (e.touches[0].clientY - rect.top) * scaleY
        } else {
            x = ((e as React.MouseEvent).clientX - rect.left) * scaleX
            y = ((e as React.MouseEvent).clientY - rect.top) * scaleY
        }

        ctx.globalCompositeOperation = 'destination-out'
        ctx.beginPath()
        ctx.arc(x, y, 20, 0, Math.PI * 2)
        ctx.fill()

        checkProgress()
    }

    const checkProgress = () => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (!canvas || !ctx) return

        if (Math.random() > 0.1) return

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const pixels = imageData.data
        let transparentPixels = 0

        // Sampling pixels to be faster
        for (let i = 3; i < pixels.length; i += 40) {
            if (pixels[i] === 0) transparentPixels++
        }

        const percent = transparentPixels / (pixels.length / 40)
        if (percent > 0.3) {
            setIsRevealed(true)
        }
    }

    return (
        <div className={styles.scratchContainer} style={{ minHeight: '100%', background: 'transparent' }}>
            <div className={styles.cardWrapper} ref={wrapperRef} style={{ width: '300px', height: '400px', transform: 'scale(0.9)' }}>
                <div className={styles.cardContent}>
                    <div>
                        <div className={styles.detailLabel}>LOZ CÂȘTIGĂTOR</div>
                        <h1 className={styles.prizeTitle} style={{ fontSize: '1.5rem' }}>{winTitle}</h1>
                    </div>

                    <div className={styles.confetti}>🎉 💍 🥂</div>

                    <div className={styles.prizeDetails}>
                        <div>
                            <div className={styles.detailLabel}>PREMIU</div>
                            <div className={styles.detailRow} style={{ fontSize: '1rem' }}>{mainPrize}</div>
                        </div>
                        <div>
                            <div className={styles.detailLabel}>DATA</div>
                            <div className={styles.detailRow} style={{ fontSize: '1rem' }}>{date}</div>
                        </div>
                        <div>
                            <div className={styles.detailLabel}>LOCAȚIA</div>
                            <div className={styles.detailRow} style={{ fontSize: '1rem' }}>{location}</div>
                        </div>
                    </div>

                    <button style={{
                        background: '#ff4500', color: 'white', border: 'none',
                        padding: '8px 20px', borderRadius: '50px', fontWeight: 'bold',
                        cursor: 'pointer', marginTop: '1rem', fontSize: '0.8rem'
                    }}>
                        Vreau sa particip!
                    </button>
                </div>

                <canvas
                    ref={canvasRef}
                    className={`${styles.canvas} ${isRevealed ? styles.hidden : ''}`}
                    onMouseMove={handleScratch}
                    onTouchMove={handleScratch}
                />
            </div>
        </div>
    )
}
