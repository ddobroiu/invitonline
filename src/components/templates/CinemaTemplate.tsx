'use client'

import styles from './CinemaTemplate.module.css'
import { Film, Clapperboard, Star, Play, Heart, Baby, PartyPopper } from 'lucide-react'

interface CinemaTemplateProps {
    title: string
    date: string
    location: string
    message?: string
    eventType?: string
    id?: string
    groomName?: string
    brideName?: string
    childName?: string
    celebrantName?: string
    age?: string
    parentsBride?: string
    parentsGroom?: string
    godparents?: string
    godparentsBaptism?: string
    motherName?: string
    fatherName?: string
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
    customFields?: { label: string, value: string }[]
    photoUrl?: string
}


export default function CinemaTemplate({
    id, title, date, location, locationUrl, message, eventType = 'nunta',
    groomName, brideName, childName, celebrantName,
    godparents, godparentsBaptism, parentsGroom, parentsBride,
    motherName, fatherName, birthDate, childAge,
    civilCeremonyTime, civilCeremonyLoc, religiousCeremonyTime, religiousCeremonyLoc,
    partyTime, partyLoc, churchTime, churchLoc, restaurantTime, restaurantLoc,
    age, partyType, theme, specialInstructions, dressCode,
    customFields, photoUrl
}: any) {
    const titleParts = title.split('&')
    const mainNames = titleParts.length > 1 ? `${titleParts[0]} & ${titleParts[1]}` : title

    return (
        <div className={styles.cinemaWrapper}>
            <div className={styles.poster}>
                <div className={styles.topText}>PRODUCȚIA ANULUI PREZINTĂ</div>

                <h1 className={styles.mainTitle}>{mainNames}</h1>

                <div className={styles.comingSoon}>
                    PREMIERA: {date}
                </div>

                <div className={styles.photoArea}>
                    {photoUrl ? (
                        <div className={styles.posterImage} style={{
                            width: '100%',
                            height: '100%',
                            backgroundImage: `url(${photoUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: '4px',
                            boxShadow: '0 0 20px rgba(0,0,0,0.5)'
                        }} />
                    ) : (
                        <div className={styles.iconCircle}>
                            {eventType === 'nunta' && <Heart size={80} color="#e50914" strokeWidth={1} />}
                            {eventType === 'botez' && <Baby size={80} color="#e50914" strokeWidth={1} />}
                            {eventType !== 'nunta' && eventType !== 'botez' && <PartyPopper size={80} color="#e50914" strokeWidth={1} />}
                        </div>
                    )}
                </div>

                <div className={styles.locationTag}>
                    FILMAT LA: {location.split(',')[0]}
                </div>

                <div className={styles.credits}>
                    <div className={styles.creditLine}>
                        <span>ÎN ROLURILE PRINCIPALE: {mainNames}</span>
                        {(childName || celebrantName) && <span style={{ marginLeft: '10px' }}>• {childName || celebrantName}</span>}
                    </div>
                    <div className={styles.creditLine}>
                        {groomName && <span style={{ marginRight: '15px' }}>MIRE: {groomName.toUpperCase()}</span>}
                        {brideName && <span style={{ marginRight: '15px' }}>MIREASĂ: {brideName.toUpperCase()}</span>}
                        {parentsGroom && <span style={{ marginRight: '15px' }}>PRODUS DE: {parentsGroom.toUpperCase()}</span>}
                        {parentsBride && <span style={{ marginRight: '15px' }}>CO-PRODUS DE: {parentsBride.toUpperCase()}</span>}
                        {(godparents || godparentsBaptism) && <span style={{ marginRight: '15px' }}>NAȘI: {(godparents || godparentsBaptism || '').toUpperCase()}</span>}
                    </div>

                    <div className={styles.creditLine} style={{ color: '#aaa', fontSize: '0.65rem' }}>
                        {civilCeremonyTime && <span style={{ marginRight: '15px' }}>CIVILĂ: {civilCeremonyTime}</span>}
                        {religiousCeremonyTime && <span style={{ marginRight: '15px' }}>RELIGIOASĂ: {religiousCeremonyTime}</span>}
                        {partyTime && <span style={{ marginRight: '15px' }}>PETRECERE: {partyTime}</span>}
                        {churchTime && <span style={{ marginRight: '15px' }}>BISERICĂ: {churchTime}</span>}
                        {restaurantTime && <span style={{ marginRight: '15px' }}>LOCAL: {restaurantTime}</span>}
                    </div>

                    <div className={styles.creditLine}>
                        {customFields && customFields.map((field: any, i: number) => (
                            field.label && field.value && (
                                <span key={i} style={{ marginRight: '15px' }}>{field.label.toUpperCase()}: {field.value.toUpperCase()}</span>
                            )
                        ))}
                    </div>

                    <div className={styles.creditLine}>
                        <span>REGIA: DESTINUL</span>
                    </div>

                    <div className={styles.creditLine} style={{ marginTop: '10px', color: '#888' }}>
                        {message}
                    </div>
                </div>

                <div className={styles.footer}>
                    RATED G - FOR GUARANTEED FUN | CC | Dolby Digital
                </div>
            </div>
        </div>
    )
}
