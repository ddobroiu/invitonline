'use client'

import { useState, useEffect, useRef } from 'react'
import styles from './StoryTemplate.module.css'
import RSVPModal from '@/components/RSVPModal'
import { MapPin, Calendar, Clock, Volume2, VolumeX, ChevronRight, Navigation, RotateCcw } from 'lucide-react'
import {
    str, getMapUrl, getWazeUrl, getMainNames, splitNames, getSchedule, getGodparents, getParents,
    validCustomFields, CustomField,
} from './templateUtils'

interface Props {
    id?: string
    title?: string
    date?: string
    location?: string
    locationUrl?: string
    message?: string
    eventType?: string
    videoUrl?: string // Background video
    photoUrl?: string // Background image if no video
    customFields?: CustomField[]
    groomName?: string
    brideName?: string
    childName?: string
    celebrantName?: string
    age?: string
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
    parentsGroom?: string
    parentsBride?: string
    godparents?: string
    godparentsBaptism?: string
    motherName?: string
    fatherName?: string
    specialInstructions?: string
    dressCode?: string
}

const SLIDE_DURATION = 5000 // ms per slide
const TICK = 100
const TOTAL_SLIDES = 3

export default function StoryTemplate(props: Props) {
    const {
        id, date, location, locationUrl, message, eventType = 'nunta',
        specialInstructions, dressCode, customFields, videoUrl, photoUrl,
    } = props

    // Slide + progress live in one state object so the timer updater stays pure.
    const [{ slide: currentSlide, progress }, setStory] = useState({ slide: 0, progress: 0 })
    const [isPaused, setIsPaused] = useState(false)
    const [isMuted, setIsMuted] = useState(true)
    const [showRSVP, setShowRSVP] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)

    const names = getMainNames(props)
    const nameParts = splitNames(names)
    const mapUrl = getMapUrl(location, locationUrl)
    const wazeUrl = getWazeUrl(location)
    const schedule = getSchedule(props)
    const godparentsText = getGodparents(props)
    const parents = getParents(props)
    const fields = validCustomFields(customFields)

    // Progress timer: advances slides automatically and stops on the last (RSVP) slide.
    useEffect(() => {
        if (isPaused || showRSVP) return
        const step = (100 * TICK) / SLIDE_DURATION
        const interval = setInterval(() => {
            setStory((st) => {
                const next = st.progress + step
                if (next < 100) return { ...st, progress: next }
                if (st.slide < TOTAL_SLIDES - 1) return { slide: st.slide + 1, progress: 0 }
                return st.progress === 100 ? st : { ...st, progress: 100 }
            })
        }, TICK)
        return () => clearInterval(interval)
    }, [isPaused, showRSVP])

    // Video playback follows pause / RSVP state.
    useEffect(() => {
        const video = videoRef.current
        if (!video) return
        if (isPaused || showRSVP) {
            video.pause()
        } else {
            video.play().catch(() => { /* autoplay may be blocked; ignore */ })
        }
    }, [isPaused, showRSVP, videoUrl])

    useEffect(() => {
        if (videoRef.current) videoRef.current.muted = isMuted
    }, [isMuted, videoUrl])

    // On the last (RSVP) slide a tap does nothing, so guests are not thrown back to the start.
    const handleNext = () => {
        setStory((st) => (st.slide < TOTAL_SLIDES - 1 ? { slide: st.slide + 1, progress: 0 } : st))
    }

    const restart = () => setStory({ slide: 0, progress: 0 })

    const handlePrev = () => {
        setStory((st) => ({ slide: st.slide > 0 ? st.slide - 1 : 0, progress: 0 }))
    }

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsMuted((m) => !m)
    }

    const pauseHandlers = {
        onPointerDown: () => setIsPaused(true),
        onPointerUp: () => setIsPaused(false),
        onPointerLeave: () => setIsPaused(false),
        onPointerCancel: () => setIsPaused(false),
    }

    const emoji = eventType === 'botez' ? '👶' : eventType === 'aniversare' ? '🎂' : eventType === 'petrecere' ? '🎉' : '💍'

    const renderContent = () => {
        switch (currentSlide) {
            case 0:
                return (
                    <div className={styles.slideContent}>
                        <div className={styles.tag}>SAVE THE DATE</div>
                        <h1 className={styles.title}>
                            {nameParts.length === 2 ? (
                                <>
                                    <span className={styles.namePart}>{nameParts[0]}</span>
                                    {' '}<span className={styles.amp}>&</span>{' '}
                                    <span className={styles.namePart}>{nameParts[1]}</span>
                                </>
                            ) : (names || 'Invitație')}
                        </h1>
                        {str(date) && <h2 className={styles.subtitle}>{str(date)}</h2>}
                        <div className={styles.emoji}>{emoji}</div>
                        <div className={styles.tapHint}>Atinge ecranul pentru a continua <ChevronRight size={14} /></div>
                    </div>
                )
            case 1:
                return (
                    <div className={styles.slideContent}>
                        <h2 className={`${styles.subtitle} ${styles.sectionHeading}`}>Program & detalii</h2>

                        <div className={styles.detailsBox}>
                            {str(date) && (
                                <div className={styles.detailRow}>
                                    <Calendar size={18} color="#ffde59" />
                                    <span>{str(date)}</span>
                                </div>
                            )}
                            {str(location) && (
                                <div className={styles.detailRow}>
                                    <MapPin size={18} color="#ffde59" />
                                    <span>{str(location)}</span>
                                </div>
                            )}

                            {schedule.length > 0 && (
                                <div className={styles.detailRow}>
                                    <Clock size={18} color="#ffde59" />
                                    <div className={styles.scheduleList}>
                                        {schedule.map((s) => (
                                            <div key={s.key}>
                                                <strong>{s.label}</strong>{s.time && ` · ${s.time}`}
                                                {s.loc && <div className={styles.scheduleLoc}>{s.loc}</div>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {(parents.length > 0 || godparentsText || fields.length > 0 || str(dressCode)) && (
                                <div className={styles.castBox}>
                                    {parents.length > 0 && <div><strong>Părinți:</strong> {parents.join(' și ')}</div>}
                                    {godparentsText && <div><strong>Nași:</strong> {godparentsText}</div>}
                                    {fields.map((f, i) => (
                                        <div key={`${f.label}-${i}`}><strong>{f.label}:</strong> {f.value}</div>
                                    ))}
                                    {str(dressCode) && <div><strong>Ținută:</strong> {str(dressCode)}</div>}
                                </div>
                            )}
                        </div>

                        {str(message) && <p className={styles.message}>„{str(message)}”</p>}
                        {str(specialInstructions) && <p className={styles.message}>{str(specialInstructions)}</p>}
                    </div>
                )
            case 2:
                return (
                    <div className={styles.slideContent}>
                        <h1 className={styles.title}>Te așteptăm!</h1>
                        <p className={styles.lead}>Te rugăm să confirmi prezența.</p>

                        {(str(date) || str(location)) && (
                            <div className={styles.summary}>
                                {str(date) && <div><Calendar size={15} color="#ffde59" /> <span>{str(date)}</span></div>}
                                {str(location) && <div><MapPin size={15} color="#ffde59" /> <span>{str(location)}</span></div>}
                            </div>
                        )}

                        <button className={styles.rsvpButton} onClick={() => setShowRSVP(true)}>
                            Confirmă Prezența <ChevronRight size={20} />
                        </button>

                        {mapUrl && (
                            <div className={styles.mapRow}>
                                <a
                                    className={`${styles.rsvpButton} ${styles.ghostButton}`}
                                    href={mapUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <MapPin size={16} /> Vezi harta
                                </a>
                                {wazeUrl && (
                                    <a
                                        className={`${styles.rsvpButton} ${styles.ghostButton}`}
                                        href={wazeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Navigation size={16} /> Waze
                                    </a>
                                )}
                            </div>
                        )}

                        <button type="button" className={styles.replayButton} onClick={restart}>
                            <RotateCcw size={14} /> Revezi povestea
                        </button>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className={styles.storyContainer}>
            {/* Blurred backdrop, only visible around the device frame on wide screens */}
            <div
                className={styles.backdrop}
                style={photoUrl ? { backgroundImage: `url("${photoUrl}")` } : undefined}
                aria-hidden="true"
            />
            <div className={styles.mobileFrame}>

                {/* 1. MEDIA LAYER */}
                <div className={styles.mediaLayer}>
                    {videoUrl ? (
                        <video
                            key={videoUrl}
                            ref={videoRef}
                            src={videoUrl}
                            className={styles.bgVideo}
                            playsInline
                            loop
                            muted
                            autoPlay
                            poster={photoUrl || undefined}
                        />
                    ) : (
                        <div
                            className={styles.bgImage}
                            style={{
                                backgroundImage: `url("${photoUrl || 'https://images.unsplash.com/photo-1511285560982-1351cdeb9821?q=80&w=1000&auto=format&fit=crop'}")`,
                            }}
                        />
                    )}
                    <div className={styles.overlay}></div>
                </div>

                {/* 2. TAP ZONES (below the UI layer so buttons stay clickable) */}
                <div className={`${styles.navZone} ${styles.leftZone}`} onClick={handlePrev} {...pauseHandlers} />
                <div className={`${styles.navZone} ${styles.rightZone}`} onClick={handleNext} {...pauseHandlers} />

                {/* 3. UI LAYER */}
                <div className={styles.contentLayer}>
                    <div className={styles.progressContainer}>
                        {Array.from({ length: TOTAL_SLIDES }, (_, idx) => (
                            <div key={idx} className={styles.progressBar}>
                                <div
                                    className={styles.progressFill}
                                    style={{ width: idx === currentSlide ? `${progress}%` : (idx < currentSlide ? '100%' : '0%') }}
                                ></div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.headerInfo}>
                        <div className={styles.avatar}>
                            {photoUrl ? (
                                <img src={photoUrl} alt="" className={styles.avatarImg} />
                            ) : (names.charAt(0).toUpperCase() || '♥')}
                        </div>
                        <div style={{ minWidth: 0 }}>
                            <div className={styles.userName}>{names || 'Invitație'}</div>
                            <div className={styles.timeAgo}>acum 2 minute</div>
                        </div>
                        {videoUrl && (
                            <button type="button" className={styles.soundIndicator} onClick={toggleMute} aria-label={isMuted ? 'Pornește sunetul' : 'Oprește sunetul'}>
                                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                                {isMuted ? 'OFF' : 'ON'}
                            </button>
                        )}
                    </div>

                    <div className={styles.slideArea}>
                        {renderContent()}
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
