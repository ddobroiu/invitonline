'use client'

import styles from './page.module.css'
import EnvelopeTemplate from '@/components/templates/EnvelopeTemplate'
import NetflixTemplate from '@/components/templates/NetflixTemplate'
import BoardingPassTemplate from '@/components/templates/BoardingPassTemplate'
import VinylTemplate from '@/components/templates/VinylTemplate'
import ScratchTemplate from '@/components/templates/ScratchTemplate'
import PassportTemplate from '@/components/templates/PassportTemplate'
import NewspaperTemplate from '@/components/templates/NewspaperTemplate'
import CinemaTemplate from '@/components/templates/CinemaTemplate'
import FestivalTemplate from '@/components/templates/FestivalTemplate'
import VipCardTemplate from '@/components/templates/VipCardTemplate'
import StoryTemplate from '@/components/templates/StoryTemplate'
import ChatTemplate from '@/components/templates/ChatTemplate'

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
        { id: 'envelope', name: 'Plic 3D de Lux', component: EnvelopeTemplate, desc: 'O deschidere magică și clasică.', features: ['photo'] },
        { id: 'netflix', name: 'Cinematic Netflix', component: NetflixTemplate, desc: 'Evenimentul tău ca un serial de succes.', features: ['video', 'photo'] },
        { id: 'boarding', name: 'Boarding Pass', component: BoardingPassTemplate, desc: 'Invitație tip bilet de avion.', features: ['photo'] },
        { id: 'vinyl', name: 'Vinyl Record', component: VinylTemplate, desc: 'Stil retro cu muzică de fundal.', features: ['audio', 'photo'] },
        { id: 'scratch', name: 'Loz Norocos', component: ScratchTemplate, desc: 'Interactiv: răzuiește surpriza.', features: ['photo'] },
        { id: 'passport', name: 'Pașaport VIP', component: PassportTemplate, desc: 'Perfect pentru nunți destinație.', features: ['photo'] },
        { id: 'news', name: 'The Wedding Times', component: NewspaperTemplate, desc: 'Anunță evenimentul ca o știre.', features: ['photo'] },
        { id: 'cinema', name: 'Film Poster', component: CinemaTemplate, desc: 'Voi sunteți vedetele filmului.', features: ['photo'] },
        { id: 'festival', name: 'Summer Festival', component: FestivalTemplate, desc: 'Pentru petreceri electrizante.', features: ['audio', 'photo'] },
        { id: 'vip', name: 'VIP Access Card', component: VipCardTemplate, desc: 'Un card exclusivist 3D.', features: ['photo'] },
        { id: 'story', name: 'Insta Story', component: StoryTemplate, desc: 'Format vertical, modern, video.', features: ['video', 'photo'] },
        { id: 'chat', name: 'Love Chat', component: ChatTemplate, desc: 'O conversație modernă.', features: ['audio', 'photo', 'video'] },
    ]

    const getBadge = (type: string) => {
        switch (type) {
            case 'video': return (
                <div style={{
                    background: 'rgba(229, 9, 20, 0.15)',
                    color: '#ff6b6b',
                    border: '1px solid rgba(229, 9, 20, 0.3)',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    letterSpacing: '0.5px'
                }}>
                    🎥 VIDEO
                </div>
            );
            case 'audio': return (
                <div style={{
                    background: 'rgba(29, 185, 84, 0.15)',
                    color: '#1ed760',
                    border: '1px solid rgba(29, 185, 84, 0.3)',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    letterSpacing: '0.5px'
                }}>
                    🎵 AUDIO
                </div>
            );
            case 'photo': return (
                <div style={{
                    background: 'rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    letterSpacing: '0.5px'
                }}>
                    📷 FOTO
                </div>
            );
            default: return null;
        }
    }

    return (
        <div className={styles.demoPage}>
            {/* Hero Header */}
            <header className={styles.hero}>
                <div className={styles.heroBadge}><Sparkles size={16} /> Colecția 2026</div>
                <h1 className={styles.heroTitle}>Alege Design-ul <span className={styles.goldText}>Perfect</span></h1>
                <p className={styles.heroSubtitle}>Toate modelele noastre sunt complet interactive și optimizate pentru orice dispozitiv.</p>
            </header>

            {/* Template Showcase */}
            <div className={styles.showcaseGrid}>
                {templates.map((tpl) => (
                    <div key={tpl.id} className={styles.templateCard}>
                        {/* Header Section */}
                        <div className={styles.templateHeader}>
                            <div>
                                <h3 className={styles.templateName}>{tpl.name}</h3>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '12px 0' }}>
                                    {tpl.features.map(f => (
                                        <div key={f}>
                                            {getBadge(f)}
                                        </div>
                                    ))}
                                </div>

                                <p className={styles.templateDesc}>{tpl.desc}</p>
                            </div>
                            <Link href={`/create?template=${tpl.id}`} className={styles.useBtn}>
                                Personalizează <ArrowRight size={16} />
                            </Link>
                        </div>

                        {/* Dual Preview Area */}
                        <div className={styles.templatePreviewArea}>

                            {/* PC Mockup */}
                            <div className={styles.pcView}>
                                <div className={styles.viewLabel}>Desktop Experience</div>
                                <div className={styles.pcFrame}>
                                    <div className={styles.pcBrowserHeader}>
                                        <div className={styles.dot}></div>
                                        <div className={styles.dot}></div>
                                        <div className={styles.dot}></div>
                                    </div>
                                    <div className={styles.pcContent}>
                                        <div className={styles.previewScaler}>
                                            <tpl.component {...demoProps} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Mockup */}
                            <div className={styles.mobileView}>
                                <div className={styles.viewLabel}>Mobile View</div>
                                <div className={styles.phoneFrame}>
                                    <div className={styles.phoneInner}>
                                        <div className={styles.previewScaler}>
                                            <tpl.component {...demoProps} />
                                        </div>
                                    </div>
                                </div>
                            </div>

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
