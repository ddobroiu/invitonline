'use client'

// Corporate — clean and professional: navy header, key facts, agenda timeline. Plus Jakarta Sans (latin-ext).
import { useState } from 'react'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { CalendarDays, Clock, MapPin, Shirt } from 'lucide-react'
import RSVPModal from '@/components/RSVPModal'
import styles from './CorporateTemplate.module.css'
import { InvitationDetails, type TemplateProps } from './InvitationParts'
import { formatDateParts, mainNameParts } from './heroText'
import { firstTime } from './eventExtras'
import { eventLabel, str } from './templateUtils'

const sans = Plus_Jakarta_Sans({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600', '700', '800'], display: 'swap', variable: '--corp-sans' })

export default function CorporateTemplate(props: TemplateProps) {
    const [showRSVP, setShowRSVP] = useState(false)
    const type = str(props.eventType)
    const organizer = type === 'corporate' ? str(props.celebrantName) || str(props.host) : ''
    const title = mainNameParts(props).join(' & ')
    const date = formatDateParts(props)
    const time = firstTime(props)
    const location = str(props.location)
    const dress = str(props.dressCode)
    const photo = str(props.photoUrl)
    const message = str(props.message)

    const facts = [
        (date.day || date.text) && { icon: <CalendarDays size={20} />, label: 'Data', value: date.day && date.month ? `${date.day} ${date.month} ${date.year}` : date.text, sub: date.weekday },
        time && { icon: <Clock size={20} />, label: 'Ora', value: time, sub: '' },
        location && { icon: <MapPin size={20} />, label: 'Locația', value: location.split(',')[0], sub: location.split(',').slice(1).join(',').trim() },
        dress && { icon: <Shirt size={20} />, label: 'Ținută', value: dress, sub: '' },
    ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string; sub: string }[]

    return (
        <div className={`${styles.root} ${sans.variable}`}>
            <header className={styles.header}>
                <div className={styles.headerInner}>
                    <p className={styles.organizer}>{organizer || eventLabel(type)}</p>
                    <span className={styles.pill}>Invitație</span>
                    <h1 className={styles.title}>{title}</h1>
                    {message && <p className={styles.lead}>{message}</p>}
                </div>
            </header>

            <div className={styles.page}>
                {photo && (
                    <div className={styles.banner}>
                        <img className={styles.photo} src={photo} alt={title || 'Fotografie'} />
                    </div>
                )}

                {facts.length > 0 && (
                    <dl className={styles.facts}>
                        {facts.map((f) => (
                            <div key={f.label} className={styles.fact}>
                                <span className={styles.factIcon} aria-hidden="true">{f.icon}</span>
                                <dt className={styles.factLabel}>{f.label}</dt>
                                <dd className={styles.factValue}>
                                    {f.value}
                                    {f.sub && <span className={styles.factSub}>{f.sub}</span>}
                                </dd>
                            </div>
                        ))}
                    </dl>
                )}

                <main className={styles.body}>
                    <InvitationDetails
                        s={styles}
                        props={{ ...props, dressCode: '' }}
                        titles={{ agenda: 'Agenda', program: 'Program', details: 'Informații utile', location: 'Cum ajungeți' }}
                        countdownLabel="Evenimentul începe în"
                    />
                    <div className={styles.rsvpBox}>
                        <p className={styles.rsvpText}>
                            {str(props.rsvpDeadline) ? `Vă rugăm să confirmați participarea până la ${str(props.rsvpDeadline)}.` : 'Vă rugăm să confirmați participarea.'}
                        </p>
                        <button type="button" className={styles.rsvpButton} onClick={() => setShowRSVP(true)}>
                            Confirmă participarea
                        </button>
                    </div>
                </main>
            </div>
            {showRSVP && <RSVPModal isOpen={showRSVP} onClose={() => setShowRSVP(false)} eventId={props.id} />}
        </div>
    )
}
