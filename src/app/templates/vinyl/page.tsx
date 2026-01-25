'use client'

import { useState } from 'react'
import styles from './page.module.css'

export default function VinylTemplate() {
    const [isPlaying, setIsPlaying] = useState(false)

    return (
        <div className={styles.container}>
            <div className={styles.playerCard}>
                <div className={styles.vinylWrapper}>
                    <div className={`${styles.vinyl} ${isPlaying ? styles.playing : ''}`}>
                        <div className={styles.label}>
                            <div style={{ transform: 'rotate(-45deg)' }}>
                                SIDE A<br />2026
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.trackInfo}>
                    <h1 className={styles.trackTitle}>Ana & Andrei</h1>
                    <p className={styles.artist}>The Wedding Album</p>

                    {isPlaying && (
                        <div className={styles.soundWave} style={{ justifyContent: 'center' }}>
                            <div className={styles.bar} style={{ animationDelay: '0s' }}></div>
                            <div className={styles.bar} style={{ animationDelay: '0.1s' }}></div>
                            <div className={styles.bar} style={{ animationDelay: '0.2s' }}></div>
                            <div className={styles.bar} style={{ animationDelay: '0.3s' }}></div>
                            <div className={styles.bar} style={{ animationDelay: '0.4s' }}></div>
                        </div>
                    )}
                </div>

                <div className={styles.controls}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#888" style={{ cursor: 'pointer' }}>
                        <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z" />
                    </svg>

                    <button className={styles.playBtn} onClick={() => setIsPlaying(!isPlaying)}>
                        {isPlaying ? (
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                            </svg>
                        ) : (
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '4px' }}>
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        )}
                    </button>

                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#888" style={{ cursor: 'pointer' }}>
                        <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
                    </svg>
                </div>

                <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: isPlaying ? '100%' : '0%', transition: 'width 20s linear' }}></div>
                </div>

                <div className={styles.details}>
                    <p>Te invităm să asculți începutul poveștii noastre.</p>
                    <p style={{ marginTop: '10px', fontWeight: 'bold' }}>25 AUGUST 2026 • PALATUL ȘTIRBEI</p>
                </div>
            </div>
        </div>
    )
}
