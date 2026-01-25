'use client'

import { useState } from 'react'
import styles from './page.module.css'

export default function DemoPage() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className={styles.container}>
            <div
                className={styles.envelopeWrapper}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className={`${styles.envelope} ${isOpen ? styles.open : ''}`}>
                    <div className={styles.front}></div>
                    <div className={styles.flap}></div>

                    <div className={styles.card}>
                        <h1 className={styles.names}>Ana & Andrei</h1>
                        <p className={styles.date}>25 AUGUST 2026</p>
                        <p className={styles.details}>
                            Te invităm să sărbătorești alături de noi<br />
                            la Palatul Știrbei, ora 18:00.
                        </p>
                        <button className={styles.button}>Confirmă Prezența</button>
                    </div>
                </div>
            </div>

            {!isOpen && <p className={styles.instruction}>Apasă pe plic pentru a deschide</p>}
        </div>
    )
}
