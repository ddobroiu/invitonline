'use client'

// Botez Delicat — pastel sky, soft clouds and moon (own SVG). Quicksand + Dancing Script (latin-ext).
import { useId, useState } from 'react'
import { Dancing_Script, Quicksand } from 'next/font/google'
import RSVPModal from '@/components/RSVPModal'
import styles from './BotezDelicatTemplate.module.css'
import { InvitationDetails, type TemplateProps } from './InvitationParts'
import { heroKicker, mainNameParts, formatDateParts } from './heroText'
import { str } from './templateUtils'

const sans = Quicksand({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600', '700'], display: 'swap', variable: '--bd-sans' })
const script = Dancing_Script({ subsets: ['latin', 'latin-ext'], weight: ['500', '700'], display: 'swap', variable: '--bd-script' })

function Cloud({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 200 80" aria-hidden="true" focusable="false">
            <path d="M30 70 C 8 70, 6 44, 28 42 C 26 22, 56 14, 68 30 C 78 8, 118 8, 124 34 C 140 22, 168 30, 164 50 C 188 50, 192 70, 170 70 Z" fill="#ffffff" opacity="0.92" />
        </svg>
    )
}

function Moon() {
    const gid = `bd-moon-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
    return (
        <svg viewBox="0 0 120 120" className={styles.moon} aria-hidden="true" focusable="false">
            <defs>
                <radialGradient id={gid} cx="40%" cy="35%" r="70%">
                    <stop offset="0%" stopColor="#fff6d8" />
                    <stop offset="100%" stopColor="#f3d98f" />
                </radialGradient>
            </defs>
            <path d="M78 18 A 44 44 0 1 0 100 88 A 36 36 0 1 1 78 18 Z" fill={`url(#${gid})`} />
            <circle cx="58" cy="54" r="3" fill="#e9c874" opacity="0.6" />
            <circle cx="46" cy="76" r="4" fill="#e9c874" opacity="0.5" />
        </svg>
    )
}

export default function BotezDelicatTemplate(props: TemplateProps) {
    const [showRSVP, setShowRSVP] = useState(false)
    const names = mainNameParts(props)
    const date = formatDateParts(props)
    const photo = str(props.photoUrl)
    const message = str(props.message)

    return (
        <div className={`${styles.root} ${sans.variable} ${script.variable}`}>
            <div className={styles.sky} aria-hidden="true">
                <Cloud className={`${styles.cloud} ${styles.cloud1}`} />
                <Cloud className={`${styles.cloud} ${styles.cloud2}`} />
                <Cloud className={`${styles.cloud} ${styles.cloud3}`} />
            </div>
            <div className={styles.page}>
                <header className={styles.hero}>
                    <p className={styles.kicker}>{heroKicker(props)}</p>
                    <div className={styles.portrait}>
                        {photo ? <img className={styles.photo} src={photo} alt={names[0] || 'Fotografie'} /> : <Moon />}
                    </div>
                    <h1 className={styles.names}>{names.join(' & ')}</h1>
                    {(date.day || date.text) && (
                        <p className={styles.date}>
                            {date.weekday && <span>{date.weekday}, </span>}
                            {date.day && date.month ? `${date.day} ${date.month} ${date.year}` : date.text}
                        </p>
                    )}
                </header>

                <main className={styles.body}>
                    {message && <p className={styles.message}>{message}</p>}
                    <div className={styles.cards}>
                        <InvitationDetails
                            s={styles}
                            props={props}
                            titles={{ family: str(props.eventType) === 'botez' ? 'Părinții' : undefined, godparents: 'Nașii' }}
                            countdownLabel="Mai sunt"
                        />
                    </div>
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
