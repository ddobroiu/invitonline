import styles from '@/app/templates/netflix/page.module.css'

interface Props {
    title: string
    date: string
    location: string
    message: string
    eventType?: string
}

export default function NetflixTemplate({ title, date, location, message, eventType = 'nunta' }: Props) {
    let seriesTitle = 'NUNTA SERIES'
    let genre = 'Romance'
    let ageRating = '12+'
    let mainTitle = 'NUNTA NOASTRĂ'

    if (eventType === 'botez') {
        seriesTitle = 'BOTEZUL'
        genre = 'Family'
        ageRating = 'All'
        mainTitle = 'BOTEZUL LUI'
    } else if (eventType === 'aniversare') {
        seriesTitle = 'BIRTHDAY'
        genre = 'Documentary'
        ageRating = '10+'
        mainTitle = 'LA MULTI ANI!'
    } else if (eventType === 'petrecere') {
        seriesTitle = 'PARTY'
        genre = 'Reality TV'
        ageRating = '18+'
        mainTitle = 'MEGA PARTY'
    }

    return (
        <div className={styles.netflixContainer} style={{ minHeight: '100%', overflow: 'hidden', transformOrigin: 'top left' }}>
            <div className={styles.hero} style={{ height: '100%' }}>
                <div className={styles.heroContent} style={{ marginTop: '20px', transform: 'scale(0.8)', transformOrigin: 'top left' }}>
                    <div className={styles.nSeries}>{seriesTitle}</div>
                    <h1 className={styles.title} style={{ fontSize: '3rem' }}>{eventType === 'botez' || eventType === 'aniversare' ? mainTitle + ' ' + title : title}</h1>

                    <div className={styles.meta}>
                        <span className={styles.match}>99% Match</span>
                        <span>{date.split(' ').pop()}</span>
                        <span className={styles.age}>{ageRating}</span>
                        <span>1 Season</span>
                        <span>{genre}</span>
                    </div>

                    <p className={styles.description} style={{ fontSize: '1rem' }}>
                        {message} <br />
                        <strong>Locație: {location}</strong> • <strong>Din: {date}</strong>
                    </p>

                    <div className={styles.buttons}>
                        <button className={styles.playBtn}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            Confirmă
                        </button>
                        <button className={styles.infoBtn}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
                                <path d="M11 7h2v2h-2zm0 4h2v6h-2z" />
                            </svg>
                            Detalii
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
