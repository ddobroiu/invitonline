'use client'

import { useState } from 'react'
import styles from './page.module.css'

export default function NetflixTemplate() {
    const [showRSVP, setShowRSVP] = useState(false)

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
                        <span>1 Season</span>
                        <span>Romance</span>
                    </div>

                    <p className={styles.description}>
                        În rolurile principale: Ana și Andrei. O poveste de dragoste care a început cu un simplu "Salut" și continuă cu un "Da" hotărât. Nu rata episodul special de la Palatul Știrbei.
                    </p>

                    <div className={styles.buttons}>
                        <button className={styles.playBtn} onClick={() => setShowRSVP(true)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            Confirmă
                        </button>
                        <button className={styles.infoBtn}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
                                <path d="M11 7h2v2h-2zm0 4h2v6h-2z" />
                            </svg>
                            Detalii
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '-100px', position: 'relative', zIndex: 10 }}>
                <h3 className={styles.rowTitle}>Episoade & Detalii</h3>
                <div className={styles.row}>

                    <div className={styles.episode}>
                        <div className={styles.epImg}>
                            <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3" alt="Ceremonia" />
                        </div>
                        <div className={styles.epInfo}>
                            <div className={styles.epTitle}>1. Cununia Religioasă</div>
                            <div className={styles.epDesc}>Ora 16:00 • Biserica Sf. Nicolae. Momentul solemn.</div>
                        </div>
                    </div>

                    <div className={styles.episode}>
                        <div className={styles.epImg}>
                            <img src="https://images.unsplash.com/photo-1519225468359-299651df6250?ixlib=rb-4.0.3" alt="Petrecerea" />
                        </div>
                        <div className={styles.epInfo}>
                            <div className={styles.epTitle}>2. Marea Petrecere</div>
                            <div className={styles.epDesc}>Ora 19:00 • Palatul Știrbei. Distracție până în zori.</div>
                        </div>
                    </div>

                    <div className={styles.episode}>
                        <div className={styles.epImg}>
                            <img src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?ixlib=rb-4.0.3" alt="Locatie" />
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
                        <span className={styles.close} onClick={() => setShowRSVP(false)}>&times;</span>
                        <h2 style={{ marginBottom: '1rem' }}>Confirmă Prezența</h2>
                        <p style={{ color: '#aaa', marginBottom: '2rem' }}>Te așteptăm cu drag să fii parte din distribuție!</p>
                        <input
                            type="text"
                            placeholder="Numele Tău"
                            style={{ width: '100%', padding: '10px', marginBottom: '10px', background: '#333', border: 'none', color: 'white' }}
                        />
                        <button className={styles.playBtn} style={{ width: '100%', justifyContent: 'center' }}>
                            Trimite
                        </button>
                    </div>
                </div>
            )}

        </div>
    )
}
