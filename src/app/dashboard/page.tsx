'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

export default function Dashboard() {
    const router = useRouter()

    const [eventDetails, setEventDetails] = useState({
        title: 'Nunta Ana & Andrei',
        date: '25 AUGUST 2026',
        location: 'PALATUL ȘTIRBEI'
    })

    useEffect(() => {
        // Simple auth check
        const user = localStorage.getItem('user')
        if (!user) {
            router.push('/login')
        } else {
            // Check for draft
            const draft = localStorage.getItem('eventDraft')
            if (draft) {
                const parsed = JSON.parse(draft)
                setEventDetails({
                    title: parsed.title,
                    date: parsed.date.toUpperCase(),
                    location: parsed.location.toUpperCase()
                })
            }
        }
    }, [router])

    const guests = [
        { name: 'Popescu Ion', email: 'ion@example.com', status: 'confirmed', date: 'Acum 2 ore' },
        { name: 'Maria Ionescu', email: 'maria@example.com', status: 'pending', date: '-' },
        { name: 'George Vasile', email: 'george@example.com', status: 'declined', date: 'Ieri' },
        { name: 'Elena Dumitrescu', email: 'elena@example.com', status: 'confirmed', date: 'Acum 1 zi' },
    ]

    return (
        <div className={styles.dashboardContainer}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>SPECTRA</div>
                <nav>
                    <div className={`${styles.navItem} ${styles.activeNav}`}>Prezentare Generală</div>
                    <div className={styles.navItem}>
                        <a href="/templates/netflix" style={{ textDecoration: 'none', color: 'inherit' }}>Preview Netflix</a>
                    </div>
                    <div className={styles.navItem}>
                        <a href="/templates/boarding-pass" style={{ textDecoration: 'none', color: 'inherit' }}>Preview Avion</a>
                    </div>
                    <div className={styles.navItem}>Lista Invitați</div>
                    <div className={styles.navItem}>Design & Text</div>
                    <div className={styles.navItem}>Setări</div>
                </nav>
            </aside>

            <main className={styles.mainContent}>
                <header className={styles.header}>
                    <div>
                        <h1 className={styles.eventTitle}>{eventDetails.title}</h1>
                        <p className={styles.eventDate}>{eventDetails.date} • {eventDetails.location}</p>
                    </div>
                    <button className={styles.shareButton}>
                        Copiază Link Invitație
                    </button>
                </header>

                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>150</div>
                        <div className={styles.statLabel}>Invitați Total</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>82</div>
                        <div className={styles.statLabel}>Confirmat</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>65</div>
                        <div className={styles.statLabel}>În Așteptare</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>3</div>
                        <div className={styles.statLabel}>Refuzat</div>
                    </div>
                </div>

                <section className={styles.guestSection}>
                    <h2 className={styles.sectionTitle}>Ultimele Confirmări</h2>
                    <table className={styles.guestList}>
                        <thead>
                            <tr>
                                <th>Nume</th>
                                <th>Email / Telefon</th>
                                <th>Status</th>
                                <th>Răspuns</th>
                            </tr>
                        </thead>
                        <tbody>
                            {guests.map((guest, index) => (
                                <tr key={index}>
                                    <td>{guest.name}</td>
                                    <td>{guest.email}</td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${styles[guest.status]}`}>
                                            {guest.status === 'confirmed' ? 'Confirmat' :
                                                guest.status === 'declined' ? 'Refuzat' : 'În Așteptare'}
                                        </span>
                                    </td>
                                    <td>{guest.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    )
}
