'use client'

import styles from './page.module.css'
import UseTemplateCta from '../UseTemplateCta'

export default function BoardingPassPage() {
    return (
        <div className={styles.container}>
            <div className={styles.ticket}>

                <div className={styles.mainSection}>
                    <div className={styles.header}>
                        <span className={styles.airline}>AIR LOVE</span>
                        <span className={styles.classType}>FIRST CLASS</span>
                    </div>

                    <div className={styles.route}>
                        <span>HOME</span>
                        <svg className={styles.planeIcon} width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                        </svg>
                        <span>NONSTOP</span>
                    </div>

                    <div className={styles.detailsGrid}>
                        <div>
                            <div className={styles.detailLabel}>PASAGERI</div>
                            <div className={styles.detailValue}>TU & PARTENER</div>
                        </div>
                        <div>
                            <div className={styles.detailLabel}>DATA</div>
                            <div className={styles.detailValue}>25 AUG 26</div>
                        </div>
                        <div>
                            <div className={styles.detailLabel}>ORA</div>
                            <div className={styles.detailValue}>16:00</div>
                        </div>
                        <div>
                            <div className={styles.detailLabel}>DESTINAȚIE</div>
                            <div className={styles.detailValue}>PALATUL ȘTIRBEI</div>
                        </div>
                        <div>
                            <div className={styles.detailLabel}>POARTA</div>
                            <div className={styles.detailValue}>A1</div>
                        </div>
                        <div>
                            <div className={styles.detailLabel}>LOC</div>
                            <div className={styles.detailValue}>VIP</div>
                        </div>
                    </div>
                </div>

                <div className={styles.stubSection}>
                    <div className={styles.stubTitle}>BOARDING PASS</div>
                    <div className={`${styles.detailValue} ${styles.stubNames}`}>
                        Ana & Andrei
                    </div>
                    <div className={styles.qrCode}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https%3A%2F%2Finvitonline.ro"
                            alt="Cod QR invitație"
                            width={90}
                            height={90}
                        />
                    </div>
                </div>

            </div>
            <UseTemplateCta templateId="boarding" />
        </div>
    )
}
