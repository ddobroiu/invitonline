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

import { Sparkles, ArrowRight, Monitor, Smartphone, Search } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function DemoPage() {
    const [currentTime, setCurrentTime] = useState('09:41')

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date()
            setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
        }, 1000)
        return () => clearInterval(timer)
    }, [])
    const demoProps = {
        id: 'demo-event',
        title: 'Mihai & Teodora',
        date: '12 IULIE 2026',
        location: 'Domeniul cu Cireși, București',
        locationUrl: 'https://maps.app.goo.gl/W67fU7L8K1X5H7Z26',
        message: 'Dragostea noastră este o poveste pe care vrem să o împărtășim cu voi. Vă așteptăm cu drag să sărbătorim împreună!',
        eventType: 'nunta',
        // protagonists
        groomName: 'Mihai Ionescu',
        brideName: 'Teodora Stanciu',
        // Wedding extra
        godparents: 'Fam. Radu & Elena Popescu',
        parentsGroom: 'Gheorghe & Maria Ionescu',
        parentsBride: 'Constantin & Viorica Stanciu',
        civilCeremonyTime: '14:00',
        civilCeremonyLoc: 'Primăria București',
        religiousCeremonyTime: '16:30',
        religiousCeremonyLoc: 'Biserica Sf. Elefterie',
        partyTime: '19:30',
        partyLoc: 'Salonul Imperial',
        dressCode: 'Black Tie Optional',
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        photoUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600',
        customFields: [
            { label: 'Confirmări până la', value: '1 Iunie' },
            { label: 'Meniu', value: 'Tradițional & Gourmet' }
        ]
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

                        <div className={styles.templatePreviewArea}>
                            {/* PC Mockup */}
                            <div className={styles.pcView}>
                                <div className={styles.viewLabel}>Experiență Desktop</div>
                                <div className={styles.pcFrame}>
                                    <div className={styles.pcBrowserHeader}>
                                        <div className={styles.dot}></div>
                                        <div className={styles.dot}></div>
                                        <div className={styles.dot}></div>
                                    </div>
                                    <div className={`${styles.pcContent} ${['envelope', 'vinyl', 'scratch', 'vip', 'passport'].includes(tpl.id) ? styles.centeredScaler : ''}`}>
                                        <div className={styles.pcInner}>
                                            <div className={styles.scalerPC}>
                                                <tpl.component {...demoProps} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Mockup */}
                            <div className={styles.mobileView}>
                                <div className={styles.viewLabel}>Vizualizare Mobil</div>
                                <div className={styles.phoneFrame}>
                                    <div className={styles.statusBar}>
                                        <div className={styles.time}>{currentTime}</div>
                                        <div className={styles.statusIcons}>
                                            <Search size={12} strokeWidth={3} />
                                            <div style={{ display: 'flex', gap: '2px' }}>
                                                <div style={{ width: '2px', height: '4px', background: '#fff' }}></div>
                                                <div style={{ width: '2px', height: '6px', background: '#fff' }}></div>
                                                <div style={{ width: '2px', height: '8px', background: '#fff' }}></div>
                                                <div style={{ width: '2px', height: '10px', background: 'rgba(255,255,255,0.3)' }}></div>
                                            </div>
                                            <div style={{ width: '18px', height: '9px', border: '1px solid #fff', borderRadius: '2px', position: 'relative', display: 'flex', alignItems: 'center', padding: '1px' }}>
                                                <div style={{ width: '80%', height: '100%', background: '#fff', borderRadius: '1px' }}></div>
                                                <div style={{ position: 'absolute', right: '-3px', width: '2px', height: '4px', background: '#fff', borderRadius: '0 1px 1px 0' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.homeBar}></div>
                                    <div className={`${styles.phoneInner} ${['envelope', 'vinyl', 'scratch', 'vip', 'passport', 'boarding'].includes(tpl.id) ? styles.centeredScaler : ''}`}>
                                        <div className={styles.mobileInner}>
                                            <div className={styles.scalerMobile}>
                                                <tpl.component {...demoProps} />
                                            </div>
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
