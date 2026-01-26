'use client'

import styles from './CinemaTemplate.module.css'
import { Film, Clapperboard, Star, Play, Heart, Baby, PartyPopper } from 'lucide-react'

interface CinemaTemplateProps {
    title: string
    date: string
    location: string
    message?: string
    eventType?: string
    parentsBride?: string
    parentsGroom?: string
    godparents?: string
    customFields?: { label: string, value: string }[]
    photoUrl?: string
}


export default function CinemaTemplate(props: CinemaTemplateProps) {
    const titleParts = props.title.split('&')
    const mainNames = titleParts.length > 1 ? `${titleParts[0]} & ${titleParts[1]}` : props.title

    return (
        <div className={styles.cinemaWrapper}>
            <div className={styles.poster}>
                <div className={styles.topText}>PRODUCȚIA ANULUI PREZINTĂ</div>

                <h1 className={styles.mainTitle}>{mainNames}</h1>

                <div className={styles.comingSoon}>
                    PREMIERA: {props.date}
                </div>

                <div className={styles.photoArea}>
                    {props.photoUrl ? (
                        <div className={styles.posterImage} style={{
                            width: '100%',
                            height: '100%',
                            backgroundImage: `url(${props.photoUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: '4px',
                            boxShadow: '0 0 20px rgba(0,0,0,0.5)'
                        }} />
                    ) : (
                        <div className={styles.iconCircle}>
                            {props.eventType === 'nunta' && <Heart size={80} color="#e50914" strokeWidth={1} />}
                            {props.eventType === 'botez' && <Baby size={80} color="#e50914" strokeWidth={1} />}
                            {props.eventType !== 'nunta' && props.eventType !== 'botez' && <PartyPopper size={80} color="#e50914" strokeWidth={1} />}
                        </div>
                    )}
                </div>

                <div className={styles.locationTag}>
                    FILMAT LA: {props.location.split(',')[0]}
                </div>

                <div className={styles.credits}>
                    <div className={styles.creditLine}>
                        <span>ÎN ROLURILE PRINCIPALE: {mainNames}</span>
                    </div>
                    <div className={styles.creditLine}>
                        {props.parentsGroom && <span style={{ marginRight: '15px' }}>PRODUS DE (P. Mire): {props.parentsGroom.toUpperCase()}</span>}
                        {props.parentsBride && <span style={{ marginRight: '15px' }}>CO-PRODUS DE (P. Mireasă): {props.parentsBride.toUpperCase()}</span>}
                        {props.godparents && <span style={{ marginRight: '15px' }}>DISTRIBUIT DE (Nași): {props.godparents.toUpperCase()}</span>}

                        {props.customFields && props.customFields.map((field, i) => (
                            field.label && field.value && (
                                <span key={i} style={{ marginRight: '15px' }}>{field.label.toUpperCase()}: {field.value.toUpperCase()}</span>
                            )
                        ))}
                    </div>
                    <div className={styles.creditLine}>
                        <span>REGIA: DESTINUL</span>
                    </div>

                    <div className={styles.creditLine} style={{ marginTop: '10px', color: '#888' }}>
                        {props.message}
                    </div>
                </div>

                <div className={styles.footer}>
                    RATED G - FOR GUARANTEED FUN | CC | Dolby Digital
                </div>
            </div>
        </div>
    )
}
