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
    // Extra
    parentsGroom?: string
    parentsBride?: string
    godparents?: string
    motherName?: string
    fatherName?: string
    godparentsBaptism?: string
    civilCeremonyTime?: string
    religiousCeremonyTime?: string
    partyTime?: string
    churchTime?: string
    restaurantTime?: string
}


export default function NewspaperTemplate(props: NewspaperTemplateProps) {
    const today = new Date().toLocaleDateString('ro-RO', { year: 'numeric', month: 'long', day: 'numeric' })
    const eventYear = props.date.match(/\d{4}/)?.[0] || '2025'

    return (
        <div className={styles.paperWrapper}>
            <div className={styles.newspaper}>
                {/* Header Meta */}
                <div className={styles.headerMeta}>
                    <div className={styles.weatherBox}>
                        <span style={{ fontWeight: 'bold' }}>METEO:</span> IUBIRE MAXIMĂ & SOARE
                    </div>
                    <div className={styles.editionInfo}>
                        NR. 1 • VOL. {new Date().getFullYear()} • EDIȚIE LIMITATĂ
                    </div>
                    <div className={styles.priceBox}>
                        PREȚ: UN ZÂMBET
                    </div>
                </div>

                {/* Masthead */}
                <div className={styles.masthead}>
                    <h1>The {props.eventType ? props.eventType.charAt(0).toUpperCase() + props.eventType.slice(1) : 'Wedding'} Times</h1>
                    <div className={styles.slogan}>"Ziarul oficial al celor mai frumoase povești de dragoste"</div>
                </div>

                <div style={{ borderBottom: '2px solid #222', marginBottom: '2px' }}></div>
                <div style={{ borderBottom: '1px solid #222', marginBottom: '15px' }}></div>

                {/* Main Headline */}
                <div className={styles.mainHeadline}>
                    {props.title}: EVENIMENTUL DECENIULUI A FOST CONFIRMAT!
                </div>

                <div className={styles.subHeadline}>
                    <em>Surse exclusive confirmă data de {props.date} ca fiind "cea mai importantă zi din istorie".</em>
                </div>

                <div className={styles.articleBody}>
                    <div className={styles.firstColumn}>
                        <div className={styles.eventPhotoContainer}>
                            {props.photoUrl ? (
                                <img
                                    src={props.photoUrl}
                                    alt="Event Photo"
                                    className={styles.actualPhoto}
                                />
                            ) : (
                                <div className={styles.placeholderPhoto}>
                                    {props.eventType === 'nunta' && <Heart size={50} strokeWidth={1} />}
                                    {props.eventType === 'botez' && <Baby size={50} strokeWidth={1} />}
                                    {!props.eventType && <PartyPopper size={50} strokeWidth={1} />}
                                </div>
                            )}
                            <div className={styles.stamp}>EXCLUSIVE</div>
                            <div className={styles.photoCaption}>▲ FIG 1. Protagoniștii acestui eveniment istoric.</div>
                        </div>

                        <p className={styles.articleText}>
                            <span className={styles.dropCap}>D</span>intr-o mare de evenimente mondene, unul singur strălucește cu adevărat.
                            Redacția noastră a aflat că <strong>{props.title}</strong> au decis să își unească destinele într-o ceremonie fastuoasă.
                            Locația aleasă, <strong>{props.location}</strong>, va deveni centrul universului pentru o noapte.
                        </p>
                    </div>

                    <div className={styles.secondColumn}>
                        <div className={styles.leadStory}>
                            <h3>DETALIILE SCANDALOS DE FRUMOASE</h3>
                            <p>
                                Deși s-a încercat păstrarea secretului, reporterii noștri au aflat totul.
                                Pregătirile sunt în toi, iar lista de invitați include cele mai importante persoane din viața cuplului.
                            </p>
                            <div className={styles.quoteBox}>
                                "{props.message || 'Vă așteptăm să scriem istorie împreună!'}"
                            </div>
                        </div>

                        {/* Info Grid - Replaces old list */}
                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <div className={styles.infoLabel}>DATA</div>
                                <div className={styles.infoValue}>{props.date}</div>
                            </div>
                            <div className={styles.infoItem}>
                                <div className={styles.infoLabel}>LOCAȚIE</div>
                                <div className={styles.infoValue}>{props.location.split(',')[0]}</div>
                            </div>
                            <div className={styles.infoItem}>
                                <div className={styles.infoLabel}>MEMO</div>
                                <div className={styles.infoValue}>Dress Code: {props.dressCode || 'Elegant'}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ads Section */}
                <div className={styles.classifiedsTitle}>MICĂ PUBLICITATE & ANUNȚURI</div>
                <div className={styles.classifiedsGrid}>
                    {(props.parentsGroom || props.parentsBride) && (
                        <div className={styles.classifiedBox}>
                            <h4>PĂRINȚI</h4>
                            <p>{props.parentsGroom}</p>
                            <p>{props.parentsBride}</p>
                        </div>
                    )}
                    {(props.godparents || props.godparentsBaptism) && (
                        <div className={styles.classifiedBox}>
                            <h4>NAȘI SPIRITUALI</h4>
                            <p>{props.godparents || props.godparentsBaptism}</p>
                        </div>
                    )}
                    {(props.civilCeremonyTime || props.religiousCeremonyTime || props.partyTime) && (
                        <div className={styles.classifiedBox}>
                            <h4>PROGRAM</h4>
                            {props.civilCeremonyTime && <p>Civilă: {props.civilCeremonyTime}</p>}
                            {props.religiousCeremonyTime && <p>Religioasă: {props.religiousCeremonyTime}</p>}
                            {props.partyTime && <p>Petrecere: {props.partyTime}</p>}
                        </div>
                    )}
                    {props.customFields && props.customFields.map((field, i) => (
                        field.label && field.value && (
                            <div key={i} className={styles.classifiedBox}>
                                <h4>{field.label.toUpperCase()}</h4>
                                <p>{field.value}</p>
                            </div>
                        )
                    ))}
                    <div className={styles.classifiedBox} style={{ background: '#222', color: '#f4ecd8' }}>
                        <h4 style={{ color: '#f4ecd8', borderColor: '#f4ecd8' }}>RSVP</h4>
                        <p>Vă rugăm confirmați prezența.</p>
                        <p>Termen limită: Imediat.</p>
                    </div>
                </div>

                <div className={styles.footerBar}>
                    INVITATII ONLINE NEWS GROUP © {new Date().getFullYear()} • TIPĂRIT ÎN INIMA TA
                </div>

                {/* RSVP COUPON */}
                <div className={styles.rsvpWrapper}>
                    <div className={styles.cutLine}>
                        <span>✂</span> -------------------------------------------------------------
                    </div>
                    <div className={styles.rsvpCoupon}>
                        <div className={styles.rsvpHeader}>TALON DE CONFIRMARE</div>
                        <div className={styles.rsvpContent}>
                            <p>DA, doresc să iau parte la acest eveniment istoric!</p>
                            <p style={{ fontSize: '0.7rem', marginTop: '5px' }}>Vă rugăm să ne onorați cu prezența.</p>

                            <button className={styles.rsvpButton}>
                                CONFIRMĂ PREZENȚA
                            </button>

                            <div style={{ fontSize: '0.6rem', marginTop: '8px', fontStyle: 'italic' }}>
                                *Prin completarea acestui talon, sunteți de acord să vă distrați.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
