'use client'

import styles from './page.module.css'
import EnvelopeTemplate from '@/components/templates/EnvelopeTemplate'
import NetflixTemplate from '@/components/templates/NetflixTemplate'
import BoardingPassTemplate from '@/components/templates/BoardingPassTemplate'
import VinylTemplate from '@/components/templates/VinylTemplate'
import ScratchTemplate from '@/components/templates/ScratchTemplate'
import { Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function DemoPage() {
    const demoProps = {
        title: 'Mihai & Teodora',
        date: '12 IULIE 2026',
        location: 'Domeniul cu Cireși, București',
        locationUrl: 'https://maps.app.goo.gl/W67fU7L8K1X5H7Z26',
        message: 'Dragostea noastră este o poveste pe care vrem să o împărtășim cu voi. Vă așteptăm cu drag să sărbătorim împreună!',
        eventType: 'nunta',
        // Extra Details
        godparents: 'Fam. Ionescu Radu & Elena',
        parentsGroom: 'Gheorghe & Maria',
        parentsBride: 'Constantin & Viorica',
        civilCeremonyTime: '14:00',
        religiousCeremonyTime: '16:30',
        partyTime: '19:30',
    }

    const templates = [
        { id: 'envelope', name: 'Plic 3D de Lux', component: EnvelopeTemplate, desc: 'O deschidere magică pentru o nuntă clasică.' },
        { id: 'netflix', name: 'Cinematic Netflix', component: NetflixTemplate, desc: 'Transformă evenimentul tău într-un serial de succes.' },
        { id: 'boarding', name: 'Boarding Pass Premium', component: BoardingPassTemplate, desc: 'Pregătește-ți invitații pentru o călătorie de neuitat.' },
        { id: 'vinyl', name: 'Vintage Vinyl Record', component: VinylTemplate, desc: 'Pentru iubitorii de muzică și stil retro-chic.' },
        { id: 'scratch', name: 'Loz Norocos (Scratch)', component: ScratchTemplate, desc: 'O experiență interactivă cu premiu garantat.' },
    ]

    return (
        <div className={styles.demoPage}>
            {/* Hero Header */}
            <header className={styles.hero}>
                <div className={styles.heroBadge}><Sparkles size={16} /> Modele 2026</div>
                <h1 className={styles.heroTitle}>Alege Design-ul <span className={styles.goldText}>Perfect</span></h1>
                <p className={styles.heroSubtitle}>Toate modelele noastre sunt complet interactive și optimizate pentru orice dispozitiv.</p>
            </header>

            {/* Template Showcase */}
            <div className={styles.showcaseGrid}>
                {templates.map((tpl) => (
                    <div key={tpl.id} className={styles.templateCard}>
                        <div className={styles.templateHeader}>
                            <div>
                                <h3 className={styles.templateName}>{tpl.name}</h3>
                                <p className={styles.templateDesc}>{tpl.desc}</p>
                            </div>
                            <Link href="/create" className={styles.useBtn}>
                                Personalizează <ArrowRight size={16} />
                            </Link>
                        </div>

                        <div className={styles.templatePreviewFrame}>
                            <tpl.component {...demoProps} />
                        </div>
                    </div>
                ))}
            </div>

            <footer className={styles.demoFooter}>
                <h2>Gata să-ți creezi propria invitație?</h2>
                <Link href="/create" className={styles.finalCta}>Începe Acum Gratuit</Link>
            </footer>
        </div>
    )
}
