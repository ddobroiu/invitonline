'use client'

import styles from './NewspaperTemplate.module.css'
import { Heart, Baby, PartyPopper, Calendar, MapPin, Search } from 'lucide-react'

interface NewspaperTemplateProps {
    title: string
    date: string
    location: string
    message?: string
    eventType?: string
    id?: string
    dressCode?: string
    customFields?: { label: string, value: string }[]
    photoUrl?: string
}


export default function NewspaperTemplate(props: NewspaperTemplateProps) {
    const today = new Date().toLocaleDateString('ro-RO', { year: 'numeric', month: 'long', day: 'numeric' })
    const eventYear = props.date.match(/\d{4}/)?.[0] || '2025'

    return (
        <div className={styles.paperWrapper}>
            <div className={styles.newspaper}>
                {/* Top Banner */}
                <div className={styles.topBar}>
                    <span>EDIȚIE SPECIALĂ</span>
                    <span>{today}</span>
                    <span>GRATUIT</span>
                </div>

                {/* Masthead */}
                <div className={styles.masthead}>
                    <h1>THE {props.eventType?.toUpperCase() || 'EVENT'} TIMES</h1>
                </div>

                {/* Main Content Area */}
                <div className={styles.mainHeadline}>
                    {props.title}: Cel Mai Așteptat Eveniment al Anului {eventYear}!
                </div>

                <div className={styles.subHeadline}>
                    "O zi care va rămâne în istorie" - relatează organizatorii.
                </div>

                <div className={styles.articleBody}>
                    <div className={styles.firstColumn}>
                        <p className={styles.articleText}>
                            <span className={styles.dropCap}>D</span>upa luni de pregătiri intense și așteptare,
                            celebrul cuplu format din {props.title} a anunțat în sfârșit marea veste.
                            În data de {props.date}, lumea întreagă își va îndrepta atenția către această sărbătoare unică.
                        </p>

                        <div className={styles.eventPhoto}>
                            {props.photoUrl ? (
                                <img
                                    src={props.photoUrl}
                                    alt="Event Photo"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderRadius: '4px'
                                    }}
                                />
                            ) : (
                                <>
                                    {props.eventType === 'nunta' && <Heart size={60} strokeWidth={1} color="#222" />}
                                    {props.eventType === 'botez' && <Baby size={60} strokeWidth={1} color="#222" />}
                                    {props.eventType !== 'nunta' && props.eventType !== 'botez' && <PartyPopper size={60} strokeWidth={1} color="#222" />}
                                </>
                            )}
                        </div>
                        <div className={styles.caption}>
                            ▲ Foto: Imagine din timpul pregătirilor pentru ziua de {props.date}.
                        </div>
                    </div>

                    <div className={styles.secondColumn}>
                        <p className={styles.articleText} style={{ fontWeight: '600' }}>
                            Locația secretă a fost dezvăluită: {props.location}!
                        </p>
                        <p className={styles.articleText}>
                            Invitații sunt sfătuiți să își rezerve locul cât mai curând posibil.
                            Sursele noastre spun că petrecerea va fi una legendară.
                        </p>

                        <div className={styles.detailsBox}>
                            <div className={styles.detailItem}>
                                <Calendar size={14} style={{ marginRight: '5px' }} /> {props.date}
                            </div>
                            <div className={styles.detailItem}>
                                <MapPin size={14} style={{ marginRight: '5px' }} /> {props.location.split(',')[0]}
                            </div>
                        </div>

                        <p className={styles.articleText} style={{ marginTop: '15px', fontStyle: 'italic' }}>
                            "{props.message}"
                        </p>
                    </div>

                    {/* Dynamic Custom Fields Section */}
                    <div style={{ gridColumn: 'span 2', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginTop: '20px', borderTop: '2px solid #222', borderBottom: '2px solid #222', padding: '10px 0' }}>
                        {props.customFields && props.customFields.map((field, i) => (
                            field.label && field.value && (
                                <div key={i} className={styles.adBox} style={{ border: 'none' }}>
                                    <div className={styles.adTitle}>{field.label}</div>
                                    <div className={styles.adText}>{field.value}</div>
                                </div>
                            )
                        ))}
                    </div>

                    {/* Lower Advertisement Section */}
                    <div className={styles.advertisement}>

                        <div className={styles.adBox}>
                            <div className={styles.adTitle}>Dress Code</div>
                            <div className={styles.adText}>{props.dressCode || 'Ținută Elegantă / Full Glam'}</div>
                        </div>
                        <div className={styles.adBox}>
                            <div className={styles.adTitle}>RSVP Urgent</div>
                            <div className={styles.adText}>Confirmați participarea în cel mai scurt timp!</div>
                        </div>
                    </div>

                    <div style={{ gridColumn: 'span 2', textAlign: 'center', marginTop: '30px', borderTop: '1px solid #222', paddingTop: '10px' }}>
                        <div style={{ fontSize: '0.6rem', color: '#666' }}>
                            © Toate drepturile rezervate. InvitatiiOnline.ro News Network
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
