import Link from 'next/link'
import styles from './UseTemplateCta.module.css'

/** Floating call-to-action shown on the standalone template preview pages. */
export default function UseTemplateCta({ templateId }: { templateId: string }) {
    return (
        <div className={styles.bar}>
            <Link href="/demo" className={styles.secondary}>
                Toate modelele
            </Link>
            <Link href={`/create?template=${templateId}`} className={styles.primary}>
                Folosește acest model →
            </Link>
        </div>
    )
}
