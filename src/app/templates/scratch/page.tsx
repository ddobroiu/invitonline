'use client'

import { useRef, useEffect, useState } from 'react'
import styles from './page.module.css'
import UseTemplateCta from '../UseTemplateCta'

export default function ScratchPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const [isRevealed, setIsRevealed] = useState(false)
    const scratchCount = useRef(0)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (!canvas || !ctx) return

        // Set canvas size
        canvas.width = 350
        canvas.height = 500

        // Fill with scratch layer (Gold/Silver gradient)
        const gradient = ctx.createLinearGradient(0, 0, 350, 500)
        gradient.addColorStop(0, '#DAA520') // Goldenrod
        gradient.addColorStop(0.25, '#FFD700') // Gold
        gradient.addColorStop(0.5, '#F0E68C') // Khaki
        gradient.addColorStop(0.75, '#DAA520')
        gradient.addColorStop(1, '#B8860B') // DarkGoldenRod

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Add overlay text
        ctx.font = "bold 30px Arial"
        ctx.fillStyle = "#fff"
        ctx.textAlign = "center"
        ctx.shadowColor = "rgba(0,0,0,0.5)"
        ctx.shadowBlur = 5
        ctx.fillText("RĂZUIEȘTE AICI!", canvas.width / 2, canvas.height / 2)
        ctx.fillText("🎁", canvas.width / 2, canvas.height / 2 - 50)

        // Pattern overlay
        ctx.shadowBlur = 0
        ctx.fillStyle = "rgba(255,255,255,0.1)"
        for (let i = 0; i < 500; i += 20) {
            ctx.fillRect(0, i, 350, 2)
            ctx.fillRect(i, 0, 2, 500)
        }

    }, [])

    const handleScratch = (e: React.MouseEvent | React.TouchEvent) => {
        if (isRevealed) return

        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        const wrapper = wrapperRef.current
        if (!canvas || !ctx || !wrapper) return

        const rect = wrapper.getBoundingClientRect()
        let clientX: number, clientY: number

        if ('touches' in e) {
            if (e.touches.length === 0) return
            clientX = e.touches[0].clientX
            clientY = e.touches[0].clientY
        } else {
            clientX = e.clientX
            clientY = e.clientY
        }

        // Map CSS pixels to canvas pixels (the card can be scaled down on small screens)
        const x = ((clientX - rect.left) / rect.width) * canvas.width
        const y = ((clientY - rect.top) / rect.height) * canvas.height

        // Scratch effect
        ctx.globalCompositeOperation = 'destination-out'
        ctx.beginPath()
        ctx.arc(x, y, 25, 0, Math.PI * 2)
        ctx.fill()

        // Check progress
        checkProgress()
    }

    const checkProgress = () => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (!canvas || !ctx) return

        // Only check every 10th scratch to save performance
        scratchCount.current += 1
        if (scratchCount.current % 10 !== 0) return

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const pixels = imageData.data
        let transparentPixels = 0

        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] === 0) transparentPixels++
        }

        const percent = transparentPixels / (pixels.length / 4)
        if (percent > 0.4) { // If 40% cleared
            setIsRevealed(true)
        }
    }

    return (
        <div className={styles.scratchContainer}>
            <div className={styles.cardWrapper} ref={wrapperRef}>
                <div className={styles.cardContent}>
                    <div>
                        <div className={styles.detailLabel}>LOZ CÂȘTIGĂTOR</div>
                        <h1 className={styles.prizeTitle}>JACKPOT!</h1>
                    </div>

                    <div className={styles.confetti}>🎉 💍 🥂</div>

                    <div className={styles.prizeDetails}>
                        <div>
                            <div className={styles.detailLabel}>PREMIUL: O NUNTĂ DE VIS</div>
                            <div className={styles.detailRow}>Ana & Andrei</div>
                        </div>
                        <div>
                            <div className={styles.detailLabel}>DATA EXTRAGERII</div>
                            <div className={styles.detailRow}>25 AUGUST 2026</div>
                        </div>
                        <div>
                            <div className={styles.detailLabel}>LOCAȚIA</div>
                            <div className={styles.detailRow}>Palatul Știrbei</div>
                        </div>
                    </div>

                    <button type="button" className={styles.ctaBtn}>
                        Vreau să particip!
                    </button>
                </div>

                <canvas
                    ref={canvasRef}
                    className={`${styles.canvas} ${isRevealed ? styles.hidden : ''}`}
                    onMouseMove={handleScratch}
                    onTouchStart={handleScratch}
                    onTouchMove={handleScratch}
                />
            </div>
            <UseTemplateCta templateId="scratch" />
        </div>
    )
}
