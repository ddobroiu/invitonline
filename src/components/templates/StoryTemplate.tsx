'use client'

import { useState, useEffect, useRef } from 'react'
import styles from './StoryTemplate.module.css'
import RSVPModal from '@/components/RSVPModal'
import { Heart, MapPin, Calendar, Clock, Volume2, VolumeX, ChevronRight, CheckCircle } from 'lucide-react'

interface Props {
    id?: string
    title: string
    date: string
    location: string
    locationUrl?: string
    message: string
    eventType?: string
    videoUrl?: string // Background Video
    photoUrl?: string // Background Image if no video
    customFields?: { label: string, value: string }[]

    // Extra props
    civilCeremonyTime?: string
    religiousCeremonyTime?: string
    partyTime?: string
}

export default function StoryTemplate(props: Props) {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [progress, setProgress] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const [isMuted, setIsMuted] = useState(true)
    const [showRSVP, setShowRSVP] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)

    const SLIDE_DURATION = 5000 // 5 seconds per slide
    const TOTAL_SLIDES = 3

    // Progress Timer
    useEffect(() => {
        if (isPaused || showRSVP) return

        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    if (currentSlide < TOTAL_SLIDES - 1) {
                        setCurrentSlide(c => c + 1)
                        return 0
                    } else {
                        // Loop back to start or pause at end? Let's loop.
                        setCurrentSlide(0)
                        return 0
                    }
                }
                return prev + (100 / (SLIDE_DURATION / 100))
            })
        }, 100)

        return () => clearInterval(interval)
    }, [currentSlide, isPaused, showRSVP])


    // Video Control
    useEffect(() => {
        if (videoRef.current) {
            if (isPaused || showRSVP) {
                videoRef.current.pause()
            } else {
                videoRef.current.play().catch(e => console.log('Autoplay blocked', e))
            }
        }
    }, [isPaused, showRSVP])

    const handleNext = () => {
        if (currentSlide < TOTAL_SLIDES - 1) {
            setCurrentSlide(curr => curr + 1)
            setProgress(0)
        } else {
            setCurrentSlide(0) // Loop
            setProgress(0)
        }
    }

    const handlePrev = () => {
        if (currentSlide > 0) {
            setCurrentSlide(curr => curr - 1)
            setProgress(0)
        }
    }

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsMuted(!isMuted)
        if (videoRef.current) {
            videoRef.current.muted = !isMuted
        }
    }

    // --- RENDER CONTENT BASED ON SLIDE ---
    const renderContent = () => {
        switch (currentSlide) {
            case 0:
                return (
                    <div className={styles.slideContent}>
                        <div className={styles.tag}>SAVE THE DATE</div>
                        <h1 className={styles.title} style={{ marginTop: '20px' }}>{props.title}</h1>
                        <h2 className={styles.subtitle}>{props.date}</h2>
                        <div style={{ fontSize: '3rem', marginTop: '20px' }}>
                            {props.eventType === 'nunta' ? '💍' : props.eventType === 'botez' ? '👶' : '🎉'}
                        </div>
                    </div>
                )
            case 1:
                return (
                    <div className={styles.slideContent}>
                        <h2 className={styles.subtitle} style={{ fontSize: '1.5rem', fontWeight: 800 }}>DETALIILE EVENIMENTULUI</h2>

                        <div className={styles.detailsBox}>
                            <div className={styles.detailRow}>
                                <Calendar size={20} color="#ffde59" />
                                <span>{props.date}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <MapPin size={20} color="#ffde59" />
                                <span>{props.location}</span>
                            </div>
                            <div className={styles.detailRow} style={{ alignItems: 'flex-start' }}>
                                <Clock size={20} color="#ffde59" style={{ marginTop: '3px' }} />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    {props.civilCeremonyTime && <div>Civilă: {props.civilCeremonyTime}</div>}
                                    {props.religiousCeremonyTime && <div>Religioasă: {props.religiousCeremonyTime}</div>}
                                    {props.partyTime && <div>Petrecere: {props.partyTime}</div>}
                                </div>
                            </div>
                        </div>

                        <p style={{ fontStyle: 'italic', opacity: 0.9 }}>"{props.message}"</p>
                    </div>
                )
            case 2:
                return (
                    <div className={styles.slideContent}>
                        <h1 className={styles.title}>Te așteptăm!</h1>
                        <p>Te rugăm să confirmi prezența.</p>

                        <button className={styles.rsvpButton} onClick={() => setShowRSVP(true)}>
                            RSVP ACUM <ChevronRight size={20} />
                        </button>

                        {props.locationUrl && (
                            <button
                                className={styles.rsvpButton}
                                style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', marginTop: '10px' }}
                                onClick={() => window.open(props.locationUrl, '_blank')}
                            >
                                Vezi Locația (Maps)
                            </button>
                        )}
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className={styles.storyContainer}>
            <div className={styles.mobileFrame}>

                {/* 1. MEDIA LAYER */}
                <div className={styles.mediaLayer}>
                    {props.videoUrl ? (
                        <video
                            ref={videoRef}
                            src={props.videoUrl}
                            className={styles.bgVideo}
                            playsInline
                            loop
                            muted={isMuted}
                            autoPlay
                        />
                    ) : (
                        <div
                            className={styles.bgImage}
                            style={{
                                backgroundImage: `url(${props.photoUrl || 'https://images.unsplash.com/photo-1511285560982-1351cdeb9821?q=80&w=1000&auto=format&fit=crop'})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                width: '100%',
                                height: '100%'
                            }}
                        />
                    )}
                    <div className={styles.overlay}></div>
                </div>

                {/* 2. UI LAYER */}
                <div className={styles.contentLayer}>

                    {/* Progress Bars */}
                    <div className={styles.progressContainer}>
                        {[0, 1, 2].map(idx => (
                            <div key={idx} className={styles.progressBar}>
                                <div
                                    className={`${styles.progressFill} ${idx < currentSlide ? styles.completed : ''}`}
                                    style={{ width: idx === currentSlide ? `${progress}%` : (idx < currentSlide ? '100%' : '0%') }}
                                ></div>
                            </div>
                        ))}
                    </div>

                    {/* Header */}
                    <div className={styles.headerInfo}>
                        <div className={styles.avatar}>
                            {props.title.charAt(0)}
                        </div>
                        <div>
                            <div className={styles.userName}>{props.title.split('&')[0].trim()}</div>
                            <div className={styles.timeAgo}>Acum 2 minute</div>
                        </div>
                    </div>

                    {/* Sound Toggle */}
                    {props.videoUrl && (
                        <div className={styles.soundIndicator} onClick={toggleMute}>
                            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                            {isMuted ? 'OFF' : 'ON'}
                        </div>
                    )}

                    {/* Slide Content */}
                    <div style={{ marginTop: 'auto', width: '100%' }}>
                        {renderContent()}
                    </div>

                </div>

                {/* 3. CLICK ZONES */}
                <div
                    className={`${styles.navZone} ${styles.leftZone}`}
                    onClick={handlePrev}
                    onMouseDown={() => setIsPaused(true)}
                    onMouseUp={() => setIsPaused(false)}
                    onTouchStart={() => setIsPaused(true)}
                    onTouchEnd={() => setIsPaused(false)}
                />
                <div
                    className={`${styles.navZone} ${styles.rightZone}`}
                    onClick={handleNext}
                    onMouseDown={() => setIsPaused(true)}
                    onMouseUp={() => setIsPaused(false)}
                    onTouchStart={() => setIsPaused(true)}
                    onTouchEnd={() => setIsPaused(false)}
                />

                <RSVPModal
                    isOpen={showRSVP}
                    onClose={() => setShowRSVP(false)}
                    eventId={props.id}
                />

            </div>
        </div>
    )
}
