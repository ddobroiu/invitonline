'use client'

import { useState } from 'react'
import styles from './page.module.css'
import UseTemplateCta from '../UseTemplateCta'

export default function NetflixPage() {
    const [showRSVP, setShowRSVP] = useState(false)
    const [sent, setSent] = useState(false)
    const [name, setName] = useState('')

    return (
        <div className={styles.netflixContainer}>
            <div className={styles.hero}>
                <div className={styles.heroContent}>
                    <div className={styles.nSeries}>SERIES</div>
                    <h1 className={styles.title}>NUNTA NOASTRĂ</h1>

                    <div className={styles.meta}>
                        <span className={styles.match}>99% Match</span>
                        <span>2026</span>
                        <span className={styles.age}>18+</span>
                        <span>1 Sezon</span>
                        <span>Romantic</span>
                    </div>

                    <p className={styles.description}>
                        În rolurile principale: Ana și Andrei. O poveste de dragoste care a început cu un simplu „Salut” și continuă cu un „Da” hotărât. Nu rata episodul special de la Palatul Știrbei.
                    </p>

                    <div className={styles.buttons}>
                        <button type="button" className={styles.playBtn} onClick={() => setShowRSVP(true)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            Confirmă
                        </button>
                        <button
                            type="button"
                            className={styles.infoBtn}
                            onClick={() => document.getElementById('episoade')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
                                <path d="M11 7h2v2h-2zm0 4h2v6h-2z" />
                            </svg>
                            Detalii
                        </button>
                    </div>
                </div>
            </div>

            <div id="episoade" className={styles.episodes}>
                <h3 className={styles.rowTitle}>Episoade & Detalii</h3>
                <div className={styles.row}>

                    <div className={styles.episode}>
                        <div className={styles.epImg}>
                            <img loading="lazy" src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=75" alt="Ceremonia" />
                        </div>
                        <div className={styles.epInfo}>
                            <div className={styles.epTitle}>1. Cununia Religioasă</div>
                            <div className={styles.epDesc}>Ora 16:00 • Biserica Sf. Nicolae. Momentul solemn.</div>
                        </div>
                    </div>

                    <div className={styles.episode}>
                        <div className={styles.epImg}>
                            <img loading="lazy" src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=75" alt="Petrecerea" />
                        </div>
                        <div className={styles.epInfo}>
                            <div className={styles.epTitle}>2. Marea Petrecere</div>
                            <div className={styles.epDesc}>Ora 19:00 • Palatul Știrbei. Distracție până în zori.</div>
                        </div>
                    </div>

                    <div className={styles.episode}>
                        <div className={styles.epImg}>
                            <img loading="lazy" src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=75" alt="Locație" />
                        </div>
                        <div className={styles.epInfo}>
                            <div className={styles.epTitle}>3. Informații Utile</div>
                            <div className={styles.epDesc}>Cod vestimentar: Black Tie. Parcare asigurată.</div>
                        </div>
                    </div>

                </div>
            </div>

            {showRSVP && (
                <div className={styles.modalOverlay} onClick={() => setShowRSVP(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <button type="button" className={styles.close} onClick={() => setShowRSVP(false)} aria-label="Închide">&times;</button>
                        <h2 className={styles.modalTitle}>Confirmă Prezența</h2>
                        {sent ? (
                            <p className={styles.modalText}>Mulțumim, {name || 'dragă invitat'}! Aceasta este o previzualizare — în invitația reală confirmarea ajunge direct la miri.</p>
                        ) : (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    setSent(true)
                                }}
                            >
                                <p className={styles.modalText}>Te așteptăm cu drag să fii parte din distribuție!</p>
                                <input
                                    type="text"
                                    placeholder="Numele tău"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={styles.modalInput}
                                    required
                                />
                                <button type="submit" className={`${styles.playBtn} ${styles.modalSubmit}`}>
                                    Trimite
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}

            <UseTemplateCta templateId="netflix" />
        </div>
    )
}
