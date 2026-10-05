'use client'

// Petrecere Copii — balloons, confetti and bright colors (own SVG). Fredoka + Nunito (latin-ext).
import { useState } from 'react'
import { Fredoka, Nunito } from 'next/font/google'
import { CalendarDays, Clock, MapPin, PartyPopper } from 'lucide-react'
import RSVPModal from '@/components/RSVPModal'
import styles from './KidsPartyTemplate.module.css'
import { InvitationDetails, type TemplateProps } from './InvitationParts'
import { mainNameParts, formatDateParts } from './heroText'
import { firstTime } from './eventExtras'
import { getSchedule, str } from './templateUtils'

const round = Fredoka({ subsets: ['latin', 'latin-ext'], weight: ['500', '600', '700'], display: 'swap', variable: '--kids-round' })
const sans = Nunito({ subsets: ['latin', 'latin-ext'], weight: ['400', '600', '700', '800'], display: 'swap', variable: '--kids-sans' })

const COLORS = ['#ff6b6b', '#ffb020', '#2bb3a3', '#5b8def', '#b36bf0']

function Balloon({ color, className }: { color: string; className?: string }) {
    return (
        <svg className={className} viewBox="0 0 60 140" aria-hidden="true" focusable="false">
            <path d="M30 70 C 26 90, 36 104, 28 138" stroke="#9aa3b5" strokeWidth="1.2" fill="none" />
            <ellipse cx="30" cy="34" rx="24" ry="30" fill={color} />
            <path d="M26 64 L34 64 L30 70 Z" fill={color} />
            <ellipse cx="21" cy="22" rx="5" ry="9" fill="#fff" opacity="0.35" transform="rotate(-20 21 22)" />
        </svg>
    )
}

export default function KidsPartyTemplate(props: TemplateProps) {
    const [showRSVP, setShowRSVP] = useState(false)
    const name = mainNameParts(props).join(' & ')
    const celebrant = str(props.celebrantName) || str(props.childName) || name
    const date = formatDateParts(props)
    const time = firstTime(props)
    const photo = str(props.photoUrl)
    const message = str(props.message)
    const age = str(props.age)
    const location = str(props.location)
    const letters = Array.from(celebrant)

    return (
        <div className={`${styles.root} ${round.variable} ${sans.variable}`}>
            <Balloon color="#ff6b6b" className={`${styles.balloon} ${styles.b1}`} />
            <Balloon color="#ffb020" className={`${styles.balloon} ${styles.b2}`} />
            <Balloon color="#5b8def" className={`${styles.balloon} ${styles.b3}`} />
            <div className={styles.page}>
                <header className={styles.hero}>
                    <p className={styles.kicker}>Hai la petrecere!</p>
                    <div className={styles.badge}>
                        {photo ? (
                            <img className={styles.photo} src={photo} alt={celebrant || 'Fotografie'} />
                        ) : (
                            <span className={styles.age} aria-label={age ? `${age} ani` : undefined}>{age || <PartyPopper size={48} strokeWidth={1.5} aria-hidden="true" />}</span>
                        )}
                        {photo && age && <span className={styles.ageSticker}>{age}</span>}
                    </div>
                    <h1 className={styles.title} aria-label={str(props.title) || celebrant}>
                        <span aria-hidden="true" className={styles.letters}>
                            {letters.map((ch, i) => (
                                <span key={i} style={{ color: ch.trim() ? COLORS[i % COLORS.length] : undefined }}>{ch}</span>
                            ))}
                        </span>
                    </h1>
                    {age && <p className={styles.subtitle}>împlinește {age} {Number(age) === 1 ? 'an' : 'ani'}</p>}
                </header>

                <div className={styles.tickets}>
                    {(date.day || date.text) && (
                        <div className={`${styles.ticket} ${styles.tCoral}`}>
                            <CalendarDays size={22} aria-hidden="true" />
                            <span className={styles.ticketLabel}>Când</span>
                            <span className={styles.ticketValue}>{date.day && date.month ? `${date.day} ${date.month}` : date.text}</span>
                            {date.weekday && <span className={styles.ticketSub}>{date.weekday}</span>}
                        </div>
                    )}
                    {time && (
                        <div className={`${styles.ticket} ${styles.tTeal}`}>
                            <Clock size={22} aria-hidden="true" />
                            <span className={styles.ticketLabel}>La ora</span>
                            <span className={styles.ticketValue}>{time}</span>
                        </div>
                    )}
                    {location && (
                        <div className={`${styles.ticket} ${styles.tBlue}`}>
                            <MapPin size={22} aria-hidden="true" />
                            <span className={styles.ticketLabel}>Unde</span>
                            <span className={styles.ticketValue}>{location.split(',')[0]}</span>
                        </div>
                    )}
                </div>

                <main className={styles.body}>
                    {message && <p className={styles.message}>{message}</p>}
                    <InvitationDetails s={styles} props={props} skip={getSchedule(props).length <= 1 ? ['program'] : []} titles={{ location: 'Cum ajungi' }} countdownLabel="Mai sunt doar" />
                    <div className={styles.rsvpWrap}>
                        <button type="button" className={styles.rsvpButton} onClick={() => setShowRSVP(true)}>
                            Confirmă prezența
                        </button>
                    </div>
                </main>
            </div>
            {showRSVP && <RSVPModal isOpen={showRSVP} onClose={() => setShowRSVP(false)} eventId={props.id} />}
        </div>
    )
}
