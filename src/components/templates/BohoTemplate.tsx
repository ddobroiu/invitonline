'use client'

// Boho Floral — terracotta, sage and sand; arched photo with hand-drawn pampas, eucalyptus and dried
// flowers (own SVG). Cormorant Garamond + Parisienne (next/font, latin-ext).
import { useState } from 'react'
import { Cormorant_Garamond, Parisienne } from 'next/font/google'
import RSVPModal from '@/components/RSVPModal'
import styles from './BohoTemplate.module.css'
import { InvitationDetails, type TemplateProps } from './InvitationParts'
import { heroKicker, mainNameParts, formatDateParts } from './heroText'
import { str } from './templateUtils'

const serif = Cormorant_Garamond({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600'], style: ['normal', 'italic'], display: 'swap', variable: '--boho-serif' })
const script = Parisienne({ subsets: ['latin', 'latin-ext'], weight: '400', display: 'swap', variable: '--boho-script' })

/** Pampas plume + eucalyptus + dried flowers; mirrored for the right side. */
function Bouquet({ className }: { className?: string }) {
    const plume = (x: number, y: number, len: number, angle: number, key: string) => (
        <g key={key} transform={`translate(${x} ${y}) rotate(${angle})`}>
            <path d={`M0 0 C 4 ${-len * 0.4}, -3 ${-len * 0.75}, 2 ${-len}`} stroke="#b89a74" strokeWidth="1.4" fill="none" />
            {Array.from({ length: 16 }, (_, i) => {
                const t = (i + 2) / 18
                const py = -len * t
                const w = 9 + Math.sin(t * Math.PI) * 11
                return (
                    <g key={i} stroke="#dcc6a4" strokeWidth="1.1" strokeLinecap="round" opacity={0.9}>
                        <path d={`M0 ${py} q ${-w * 0.6} ${-4} ${-w} ${-10}`} fill="none" />
                        <path d={`M0 ${py} q ${w * 0.6} ${-4} ${w} ${-10}`} fill="none" />
                    </g>
                )
            })}
        </g>
    )
    return (
        <svg className={className} viewBox="0 0 220 220" aria-hidden="true" focusable="false">
            {plume(110, 210, 170, -28, 'p1')}
            {plume(118, 212, 150, -8, 'p2')}
            {/* eucalyptus */}
            <g transform="translate(96 214) rotate(-58)">
                <path d="M0 0 C 20 -40, 30 -80, 36 -130" stroke="#7d8f6c" strokeWidth="1.6" fill="none" />
                {[0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map((t, i) => (
                    <g key={i}>
                        <circle cx={6 + t * 30 - 9} cy={-t * 130} r={8 - t * 3} fill="#9fb08c" opacity="0.9" />
                        <circle cx={6 + t * 30 + 9} cy={-t * 130 - 6} r={7 - t * 3} fill="#b3c2a1" opacity="0.9" />
                    </g>
                ))}
            </g>
            {/* dried flowers */}
            <g>
                <circle cx="132" cy="150" r="14" fill="#c9825f" />
                <circle cx="132" cy="150" r="8" fill="#b86b4b" />
                <circle cx="132" cy="150" r="3" fill="#7a3f27" />
                <circle cx="104" cy="168" r="10" fill="#e3b79a" />
                <circle cx="104" cy="168" r="4" fill="#b86b4b" />
                <circle cx="150" cy="178" r="7" fill="#efd8c4" />
                <g fill="#c9825f">
                    <circle cx="80" cy="150" r="2.4" />
                    <circle cx="86" cy="142" r="2.4" />
                    <circle cx="74" cy="140" r="2.4" />
                </g>
            </g>
        </svg>
    )
}

/** Boho rainbow arcs, shown in the arch when there is no photo. */
function Rainbow() {
    const arcs = ['#b86b4b', '#d9a07f', '#e8cdb0', '#9fb08c']
    return (
        <svg viewBox="0 0 200 120" className={styles.rainbow} aria-hidden="true" focusable="false">
            {arcs.map((c, i) => (
                <path key={c} d={`M ${20 + i * 16} 118 A ${80 - i * 16} ${80 - i * 16} 0 0 1 ${180 - i * 16} 118`} stroke={c} strokeWidth="13" fill="none" strokeLinecap="round" />
            ))}
            <circle cx="100" cy="112" r="10" fill="#f0c98f" />
        </svg>
    )
}

function Sprig() {
    return (
        <svg className={styles.sprig} viewBox="0 0 160 24" aria-hidden="true" focusable="false">
            <path d="M8 12 H152" stroke="#c9b08f" strokeWidth="1" />
            {[40, 60, 100, 120].map((x, i) => (
                <ellipse key={x} cx={x} cy={i % 2 ? 7 : 17} rx="7" ry="3" transform={`rotate(${i % 2 ? -25 : 25} ${x} ${i % 2 ? 7 : 17})`} fill="#9fb08c" />
            ))}
            <circle cx="80" cy="12" r="4" fill="#b86b4b" />
        </svg>
    )
}

export default function BohoTemplate(props: TemplateProps) {
    const [showRSVP, setShowRSVP] = useState(false)
    const names = mainNameParts(props)
    const date = formatDateParts(props)
    const photo = str(props.photoUrl)
    const message = str(props.message)

    return (
        <div className={`${styles.root} ${serif.variable} ${script.variable}`}>
            <div className={styles.page}>
                <header className={styles.hero}>
                    <p className={styles.kicker}>{heroKicker(props)}</p>
                    <div className={styles.archWrap}>
                        <div className={styles.arch}>
                            {photo ? <img className={styles.photo} src={photo} alt={names.join(' și ') || 'Fotografie'} /> : <Rainbow />}
                        </div>
                        <Bouquet className={`${styles.bouquet} ${styles.bouquetLeft}`} />
                        <Bouquet className={`${styles.bouquet} ${styles.bouquetRight}`} />
                    </div>
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
                        date.day && date.month ? (
                            <p className={styles.dateRow}>
                                <span className={styles.dateSide}>{date.weekday || date.month}</span>
                                <span className={styles.dateDay}>{date.day}</span>
                                <span className={styles.dateSide}>{date.weekday ? `${date.month} ${date.year}` : date.year}</span>
                            </p>
                        ) : (
                            <p className={styles.dateText}>{date.text}</p>
                        )
                    )}
                </header>

                <main className={styles.body}>
                    {message && <p className={styles.message}>{message}</p>}
                    <Sprig />
                    <InvitationDetails s={styles} props={props} divider={<Sprig />} />
                    <div className={styles.rsvpWrap}>
                        <button type="button" className={styles.rsvpButton} onClick={() => setShowRSVP(true)}>
                            Confirmă prezența
                        </button>
                    </div>
                    <p className={styles.signature}>Cu drag, {names.join(' & ')}</p>
                </main>
            </div>
            {showRSVP && <RSVPModal isOpen={showRSVP} onClose={() => setShowRSVP(false)} eventId={props.id} />}
        </div>
    )
}
