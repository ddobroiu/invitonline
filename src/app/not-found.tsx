import Link from 'next/link'
import type { Metadata } from 'next'
import styles from './not-found.module.css'

export const metadata: Metadata = {
    title: 'Pagina nu a fost găsită',
}

export default function NotFound() {
    return (
        <section className={styles.wrap}>
            <div className={styles.glow} aria-hidden="true" />
            <p className={styles.code}>404</p>
            <h1 className={styles.title}>Pagina nu a fost găsită</h1>
            <p className={styles.text}>
                Link-ul pe care l-ai urmat nu mai există sau a fost scris greșit.
                Te putem ajuta să ajungi unde voiai.
            </p>
            <div className={styles.actions}>
                <Link href="/" className={styles.primary}>Înapoi acasă</Link>
                <Link href="/demo" className={styles.secondary}>Vezi modelele</Link>
            </div>
        </section>
    )
}
