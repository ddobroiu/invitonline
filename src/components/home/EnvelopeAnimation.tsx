'use client'

import { useState, useRef, useEffect } from 'react'
import styles from './EnvelopeAnimation.module.css'
import { Check, MousePointerClick } from 'lucide-react'

export default function EnvelopeAnimation() {
    const [isOpen, setIsOpen] = useState(false)
    const [particles, setParticles] = useState<Array<{ id: number, x: number, y: number, color: string }>>([])
    const containerRef = useRef<HTMLDivElement>(null)

    // Handle interaction (click/touch)
    const toggleEnvelope = () => {
        if (!isOpen) {
            triggerConfetti()
        }
        setIsOpen(!isOpen)
    }

    const triggerConfetti = () => {
        const newParticles = []
        const colors = ['#d4af37', '#ffd700', '#ffffff', '#f0e68c']

        for (let i = 0; i < 40; i++) {
            newParticles.push({
                id: i,
                x: (Math.random() - 0.5) * 300, // Spread X
                y: (Math.random() - 1) * 300, // Spread Y (Upwards)
                color: colors[Math.floor(Math.random() * colors.length)]
            })
        }
        setParticles(newParticles)

        // Cleanup particles after animation
        setTimeout(() => setParticles([]), 2000)
    }

    // 3D Parallax Effect on Hover
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isOpen || !containerRef.current) return

        const { left, top, width, height } = containerRef.current.getBoundingClientRect()
        const x = (e.clientX - left) / width - 0.5
        const y = (e.clientY - top) / height - 0.5

        // Subtle rotation based on mouse position
        containerRef.current.style.transform = `rotateY(${x * 20}deg) rotateX(${-y * 20}deg) scale(1.05)`
    }

    const handleMouseLeave = () => {
        if (isOpen || !containerRef.current) return
        containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg) scale(1)`
    }

    return (
        <div className={styles.scene}>
            <div className={styles.glow}></div>

            {/* Particles Layer */}
            {particles.map((p) => (
                <div
                    key={p.id}
                    className={styles.particle}
                    style={{
                        backgroundColor: p.color,
                        transform: `translate(${p.x}px, ${p.y}px)`,
                        opacity: 0,
                        transition: `all ${1 + Math.random()}s cubic-bezier(0, 1, 0.5, 1)`,
                    }}
                    ref={el => {
                        if (el) {
                            // Trigger reflow to start transition
                            requestAnimationFrame(() => {
                                el.style.opacity = '1'
                                el.style.transform = `translate(${p.x * 1.5}px, ${p.y * 1.5 + 100}px) scale(0)`
                            })
                        }
                    }}
                ></div>
            ))}

            <div
                className={`${styles.envelopeWrapper} ${isOpen ? styles.open : ''}`}
                onClick={toggleEnvelope}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                ref={containerRef}
            >
                {/* Back of Envelope */}
                <div className={styles.back}></div>

                {/* The Inner Card (Invitation) */}
                <div className={styles.card}>
                    <div className={styles.cardBg}></div>
                    <div className={styles.cardContent}>
                        <div className={styles.cardTitle}>Andrei & Maria</div>
                        <p className={styles.cardText}>
                            VĂ INVITĂM LA NUNTA NOASTRĂ<br />
                            <span style={{ color: '#d4af37', fontWeight: 'bold' }}>24 AUGUST 2026</span>
                        </p>
                        <button className={styles.cardBtn}>CONFIRMĂ PREZENȚA</button>
                    </div>
                </div>

                {/* Front Pockets */}
                <div className={styles.front}></div>

                {/* The Flap */}
                <div className={styles.flap}>
                    <div className={styles.seal}>
                        <Check size={14} strokeWidth={4} />
                    </div>
                </div>
            </div>

            {!isOpen && (
                <div className={styles.pulseInstruction}>
                    <MousePointerClick size={16} />
                    Apasă pentru a deschide
                </div>
            )}
        </div>
    )
}
