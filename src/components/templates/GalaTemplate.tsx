'use client'

// Gala Art Deco — black and champagne, stepped deco frame and sunburst (own SVG).
// Marcellus + Poiret One + Jost (next/font, latin-ext).
import { useId, useState } from 'react'
import { Jost, Marcellus, Poiret_One } from 'next/font/google'
import RSVPModal from '@/components/RSVPModal'
import styles from './GalaTemplate.module.css'
import { InvitationDetails, type TemplateProps } from './InvitationParts'
import { heroKicker, mainNameParts, formatDateParts } from './heroText'
import { firstTime } from './eventExtras'
import { str } from './templateUtils'

const roman = Marcellus({ subsets: ['latin', 'latin-ext'], weight: '400', display: 'swap', variable: '--gala-roman' })
const deco = Poiret_One({ subsets: ['latin', 'latin-ext'], weight: '400', display: 'swap', variable: '--gala-deco' })
const sans = Jost({ subsets: ['latin', 'latin-ext'], weight: ['300', '400', '500'], display: 'swap', variable: '--gala-sans' })

function Sunburst() {
    // unique per instance: the same template can appear twice on a page (desktop + phone previews)
    const gid = `gala-gold-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
    return (
        <svg className={styles.sunburst} viewBox="0 0 240 120" aria-hidden="true" focusable="false">
            <defs>
                <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#f3e2b3" />
                    <stop offset="50%" stopColor="#c9a45c" />
                    <stop offset="100%" stopColor="#8f6f33" />
                </linearGradient>
            </defs>
            {Array.from({ length: 13 }, (_, i) => {
                const a = Math.PI - (i * Math.PI) / 12
                const x = 120 + Math.cos(a) * 110
                const y = 118 - Math.sin(a) * 110
                return <line key={i} x1="120" y1="118" x2={x} y2={y} stroke={`url(#${gid})`} strokeWidth={i % 2 ? 0.8 : 1.6} />
            })}
            <path d="M60 118 A 60 60 0 0 1 180 118" stroke={`url(#${gid})`} strokeWidth="1.6" fill="#0c0c0e" />
            <path d="M80 118 A 40 40 0 0 1 160 118" stroke={`url(#${gid})`} strokeWidth="1" fill="none" />
        </svg>
    )
}

function Divider() {
    return (
        <svg className={styles.divider} viewBox="0 0 200 20" aria-hidden="true" focusable="false">
            <line x1="0" y1="10" x2="84" y2="10" stroke="#c9a45c" strokeWidth="1" />
            <line x1="116" y1="10" x2="200" y2="10" stroke="#c9a45c" strokeWidth="1" />
            <path d="M100 2 L108 10 L100 18 L92 10 Z" fill="none" stroke="#c9a45c" strokeWidth="1.2" />
            <path d="M100 6 L104 10 L100 14 L96 10 Z" fill="#c9a45c" />
        </svg>
    )
}

export default function GalaTemplate(props: TemplateProps) {
    const [showRSVP, setShowRSVP] = useState(false)
    const names = mainNameParts(props)
    const date = formatDateParts(props)
    const time = firstTime(props)
    const photo = str(props.photoUrl)
    const message = str(props.message)

    return (
        <div className={`${styles.root} ${roman.variable} ${deco.variable} ${sans.variable}`}>
            <div className={styles.page}>
                <div className={styles.frame}>
                    <span className={`${styles.corner} ${styles.tl}`} aria-hidden="true" />
                    <span className={`${styles.corner} ${styles.tr}`} aria-hidden="true" />
                    <span className={`${styles.corner} ${styles.bl}`} aria-hidden="true" />
                    <span className={`${styles.corner} ${styles.br}`} aria-hidden="true" />

                    <header className={styles.hero}>
                        <Sunburst />
                        <p className={styles.kicker}>{heroKicker(props)}</p>
                        {photo && (
                            <div className={styles.photoFrame}>
                                <img className={styles.photo} src={photo} alt={names.join(' și ') || 'Fotografie'} />
                            </div>
                        )}
                        <h1 className={styles.names}>
                            {names.map((n, i) => (
                                <span key={`${n}-${i}`} className={styles.name}>
                                    {i > 0 && <span className={styles.amp} aria-hidden="true">&amp;</span>}
                                    {i > 0 && <span className="sr-only"> și </span>}
                                    <span className={styles.nameText}>{n}</span>
                                </span>
                            ))}
                        </h1>
                        {(date.day || date.text) && (
                            <div className={styles.dateBox}>
                                {date.day && date.month ? (
                                    <>
                                        <span className={styles.dateSide}>{date.weekday || date.month}</span>
                                        <span className={styles.dateDay}>{date.day}</span>
                                        <span className={styles.dateSide}>{date.weekday ? `${date.month} ${date.year}` : date.year}</span>
                                    </>
                                ) : (
                                    <span className={styles.dateSide}>{date.text}</span>
                                )}
                            </div>
                        )}
                        {time && <p className={styles.time}>ora {time}</p>}
                    </header>

                    <main className={styles.body}>
                        {message && <p className={styles.message}>{message}</p>}
                        <Divider />
                        <InvitationDetails s={styles} props={props} divider={<Divider />} countdownLabel="Cortina se ridică în" />
                        <div className={styles.rsvpWrap}>
                            <button type="button" className={styles.rsvpButton} onClick={() => setShowRSVP(true)}>
                                Confirmă prezența
                            </button>
                        </div>
                    </main>
                </div>
            </div>
            {showRSVP && <RSVPModal isOpen={showRSVP} onClose={() => setShowRSVP(false)} eventId={props.id} />}
        </div>
    )
}
