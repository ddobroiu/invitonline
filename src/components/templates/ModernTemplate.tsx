'use client'

// Modern Minimal — editorial typography (Bodoni Moda + Manrope), warm paper white, hairlines.
// Layout switches with container queries, so the editor's phone preview looks like a real phone.
import { useState } from 'react'
import { Bodoni_Moda, Manrope } from 'next/font/google'
import RSVPModal from '@/components/RSVPModal'
import styles from './ModernTemplate.module.css'
import { InvitationDetails, type TemplateProps } from './InvitationParts'
import { heroKicker, mainNameParts, formatDateParts } from './heroText'
import { str } from './templateUtils'

const display = Bodoni_Moda({ subsets: ['latin', 'latin-ext'], style: ['normal', 'italic'], weight: ['400', '500'], display: 'swap', variable: '--modern-display' })
const sans = Manrope({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '700'], display: 'swap', variable: '--modern-sans' })

export default function ModernTemplate(props: TemplateProps) {
    const [showRSVP, setShowRSVP] = useState(false)
    const names = mainNameParts(props)
    const date = formatDateParts(props)
    const photo = str(props.photoUrl)
    const message = str(props.message)
    const initials = names.map((n) => n.charAt(0).toLocaleUpperCase('ro-RO')).filter(Boolean).join(' & ')

    return (
        <div className={`${styles.root} ${display.variable} ${sans.variable}`}>
            <div className={styles.page}>
                <header className={`${styles.hero} ${photo ? styles.heroWithPhoto : ''}`}>
                    <div className={styles.heroText}>
                        <p className={styles.kicker}>{heroKicker(props)}</p>
                        <h1 className={styles.names}>
                            {names.map((n, i) => (
                                <span key={`${n}-${i}`} className={styles.name}>
                                    {i > 0 && <span className={styles.amp} aria-hidden="true">&amp;</span>}
                                    {i > 0 && <span className="sr-only"> și </span>}
                                    {n}
                                </span>
                            ))}
                        </h1>
                        {(date.numeric || date.text) && (
                            <p className={styles.date}>
                                {date.weekday && <span className={styles.weekday}>{date.weekday}</span>}
                                <span className={styles.dateMain}>{date.numeric || date.text}</span>
                            </p>
                        )}
                        {str(props.location) && <p className={styles.place}>{str(props.location).split(',')[0]}</p>}
                    </div>
                    {photo ? (
                        <div className={styles.photoWrap}>
                            <img className={styles.photo} src={photo} alt={names.join(' și ') || 'Fotografie'} />
                        </div>
                    ) : (
                        <div className={styles.monogram} aria-hidden="true">
                            <span>{initials || '♡'}</span>
                        </div>
                    )}
                </header>

                <main className={styles.body}>
                    {message && <p className={styles.message}>{message}</p>}
                    <InvitationDetails s={styles} props={props} />
                    <div className={styles.rsvpWrap}>
                        <button type="button" className={styles.rsvpButton} onClick={() => setShowRSVP(true)}>
                            Confirmă prezența
                        </button>
                    </div>
                    <p className={styles.signature}>{names.join(' & ')}</p>
                </main>
            </div>

            {showRSVP && <RSVPModal isOpen={showRSVP} onClose={() => setShowRSVP(false)} eventId={props.id} />}
        </div>
    )
}
