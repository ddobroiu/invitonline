import styles from '@/app/templates/boarding-pass/page.module.css'

interface Props {
    title: string
    date: string
    location: string
    message: string
    eventType?: string
}

export default function BoardingPassTemplate({ title, date, location, message, eventType = 'nunta' }: Props) {
    let airline = 'AIR LOVE'
    let destination = 'WEDDING'

    if (eventType === 'botez') {
        airline = 'STORK AIR'
        destination = 'BAPTISM'
    } else if (eventType === 'aniversare') {
        airline = 'BIRTHDAY AIR'
        destination = 'PARTY'
    } else if (eventType === 'petrecere') {
        airline = 'PARTY JET'
        destination = 'EVENT'
    }

    return (
        <div className={styles.container} style={{ minHeight: '100%', padding: '10px' }}>
            <div className={styles.ticket} style={{ transform: 'scale(0.7)', transformOrigin: 'center' }}>

                <div className={styles.mainSection}>
                    <div className={styles.header}>
                        <span className={styles.airline}>{airline}</span>
                        <span className={styles.classType}>FIRST CLASS</span>
                    </div>

                    <div className={styles.route} style={{ fontSize: '1.8rem' }}>
                        <span>HOME</span>
                        <svg className={styles.planeIcon} width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                        </svg>
                        <span>{destination}</span>
                    </div>

                    <div className={styles.detailsGrid}>
                        <div>
                            <div className={styles.detailLabel}>PASAGERI</div>
                            <div className={styles.detailValue} style={{ fontSize: '0.9rem' }}>{title}</div>
                        </div>
                        <div>
                            <div className={styles.detailLabel}>DATA</div>
                            <div className={styles.detailValue} style={{ fontSize: '0.9rem' }}>{date}</div>
                        </div>
                        <div>
                            <div className={styles.detailLabel}>LOCAȚIE</div>
                            <div className={styles.detailValue} style={{ fontSize: '0.9rem' }}>{location}</div>
                        </div>
                    </div>
                    <div style={{ marginTop: '1rem', fontStyle: 'italic', fontSize: '0.8rem', color: '#666' }}>
                        "{message}"
                    </div>
                </div>

                <div className={styles.stubSection}>
                    <div className={styles.stubTitle}>BOARDING PASS</div>
                    <div className={styles.detailValue} style={{ marginBottom: '0.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                        {title}
                    </div>
                    <div className={styles.qrCode} style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignContent: 'center',
                        justifyContent: 'center',
                        padding: '5px',
                        width: '80px',
                        height: '80px'
                    }}>
                        <div style={{ width: '100%', height: '100%', background: `url('https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(title)}') no-repeat center/cover` }}></div>
                    </div>
                </div>

            </div>
        </div>
    )
}
