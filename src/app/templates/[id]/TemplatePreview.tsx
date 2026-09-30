'use client'

import Link from 'next/link'
import TemplateRenderer from '@/components/TemplateRenderer'
import styles from '../UseTemplateCta.module.css'
import viewStyles from '@/app/invitatie/[id]/page.module.css'

export default function TemplatePreview({
    templateId,
    templateName,
    type,
    types,
    showCta,
    props,
}: {
    templateId: string
    templateName: string
    type: string
    types: { id: string; label: string }[]
    showCta: boolean
    props: Record<string, unknown>
}) {
    return (
        <>
            <div className={viewStyles.publicContainer}>
                {/* No id: the RSVP form in a preview is simulated and sends nothing */}
                <TemplateRenderer template={templateId} {...props} id={undefined} />
                {showCta && <div className={styles.spacer} aria-hidden="true" />}
            </div>
            {showCta && (
                <div className={styles.bar} role="region" aria-label={`Exemplu: modelul ${templateName}`}>
                    {types.length > 1 && (
                        <div className={styles.types}>
                            {types.map((t) => (
                                <Link
                                    key={t.id}
                                    href={`/templates/${templateId}?tip=${t.id}`}
                                    className={t.id === type ? styles.typeActive : styles.type}
                                    aria-current={t.id === type ? 'page' : undefined}
                                    replace
                                    scroll={false}
                                >
                                    {t.label}
                                </Link>
                            ))}
                        </div>
                    )}
                    <div className={styles.actions}>
                        <Link href="/demo" className={styles.secondary}>
                            Toate modelele
                        </Link>
                        <Link href={`/create?template=${templateId}&tip=${type}`} className={styles.primary}>
                            Folosește modelul →
                        </Link>
                    </div>
                </div>
            )}
        </>
    )
}
