import styles from './LegalPage.module.css'
import { LEGAL_EFFECTIVE_DATE, LEGAL_VERSION_LABEL } from '@/config/legal'

export { styles as legalStyles }

export default function LegalPage({ title, children, showVersion = true }: { title: string, children: React.ReactNode, showVersion?: boolean }) {
    return (
        <article className={styles.container}>
            <h1 className={styles.title}>{title}</h1>
            {showVersion && (
                <p className={styles.meta}>Versiunea {LEGAL_VERSION_LABEL}, în vigoare de la {LEGAL_EFFECTIVE_DATE}</p>
            )}
            <div className={styles.content}>{children}</div>
        </article>
    )
}
