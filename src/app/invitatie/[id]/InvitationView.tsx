'use client'

import TemplateRenderer, { eventToTemplateProps, type InvitationRecord } from '@/components/TemplateRenderer'
import styles from './page.module.css'

export default function InvitationView({ event }: { event: InvitationRecord }) {
    const props = eventToTemplateProps(event)
    return (
        <div className={styles.publicContainer}>
            <TemplateRenderer {...props} template={event.template} />
        </div>
    )
}
