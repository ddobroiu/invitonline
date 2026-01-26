'use client'

import React, { useState } from 'react'
import styles from './VipCardPremium.module.css'
import { Wifi, Aperture } from 'lucide-react'

export default function VipCardPremium() {
    const [isFlipped, setIsFlipped] = useState(false)

    return (
        <div className={styles.container}>
            <div
                className={styles.card}
                onClick={() => setIsFlipped(!isFlipped)}
                style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
            >
                {/* --- FRONT --- */}
                <div className={`${styles.face} ${styles.front}`}>
                    <div className={styles.header}>
                        <div className={styles.brand}>ACCES VIP</div>
                        <Wifi color="rgba(255,255,255,0.6)" size={28} />
                    </div>

                    <div className={styles.chip}></div>

                    <div className={styles.number}>
                        0000 2026 GOLD 8888
                    </div>

                    <div className={styles.holderGroup}>
                        <div>
                            <div className={styles.label}>TITULAR</div>
                            <div className={styles.value}>MIHAI & TEODORA</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div className={styles.label}>DATA</div>
                            <div className={styles.value}>12 IUL 26</div>
                        </div>
                    </div>
                </div>

                {/* --- BACK --- */}
                <div className={`${styles.face} ${styles.back}`}>
                    <div className={styles.stripe}></div>

                    <div className={styles.signatureSection}>
                        <div className={styles.signature}>Mihai & Teodora</div>
                        <div className={styles.cvv}>2026</div>
                    </div>

                    <div className={styles.info}>
                        Acest card oferă <span className={styles.goldenText}>Acces Exclusiv</span> la Nunta Anului.
                        <br /><br />
                        Vă așteptăm cu drag să sărbătorim împreună!
                        <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center' }}>
                            <Aperture color="#d4af37" size={32} />
                        </div>
                    </div>
                </div>
            </div>

            <p style={{ color: '#888', marginTop: '30px', fontFamily: 'sans-serif' }}>
                Apasă pentru a întoarce
            </p>
        </div>
    )
}
