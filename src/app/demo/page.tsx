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
import ClassicTemplate from '@/components/templates/ClassicTemplate'
import ClassicGoldTemplate from '@/components/templates/ClassicGoldTemplate'
import ClassicMinimalTemplate from '@/components/templates/ClassicMinimalTemplate'
import { Sparkles, ArrowRight, Search, Video, Music, Camera } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect, useRef, type ComponentType, type ReactNode } from 'react'

const demoProps = {
    // No id: RSVP in the demo is simulated instead of being sent to the API
    title: 'Mihai & Teodora',
    date: '12 Iulie 2026',
    eventDateISO: '2026-07-12',
    location: 'Domeniul cu Cireși, București',
    locationUrl: 'https://maps.google.com/?q=Domeniul+cu+Cire%C8%99i+Bucure%C8%99ti',
    message: 'Dragostea noastră este o poveste pe care vrem să o împărtășim cu voi. Vă așteptăm cu drag să sărbătorim împreună!',
    eventType: 'nunta' as const,
    groomName: 'Mihai Ionescu',
    brideName: 'Teodora Stanciu',
    godparents: 'Fam. Radu & Elena Popescu',
    parentsGroom: 'Gheorghe & Maria Ionescu',
    parentsBride: 'Constantin & Viorica Stanciu',
    civilCeremonyTime: '14:00',
    civilCeremonyLoc: 'Primăria Sectorului 1, București',
    religiousCeremonyTime: '16:30',
    religiousCeremonyLoc: 'Biserica Sf. Elefterie',
    partyTime: '19:30',
    partyLoc: 'Salonul Imperial',
    dressCode: 'Black Tie Optional',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    photoUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600',
    customFields: [
        { label: 'Confirmări până la', value: '1 Iunie' },
        { label: 'Meniu', value: 'Tradițional & Gourmet' },
    ],
}

type DemoProps = typeof demoProps
type Feature = 'photo' | 'video' | 'audio'

// Template components have slightly different prop interfaces; all accept the demo props at runtime.
const asTemplate = (component: unknown) => component as ComponentType<DemoProps>

const templates: {
    id: string
    name: string
    component: ComponentType<DemoProps>
    desc: string
    features: Feature[]
    centered?: boolean
}[] = [
    { id: 'classic', name: 'Classic Floral', component: asTemplate(ClassicTemplate), desc: 'Eleganță atemporală cu motive florale.', features: ['photo'], centered: true },
    { id: 'classic-gold', name: 'Classic Gold', component: asTemplate(ClassicGoldTemplate), desc: 'Lux regal cu detalii aurii.', features: ['photo'], centered: true },
    { id: 'classic-minimal', name: 'Minimalist', component: asTemplate(ClassicMinimalTemplate), desc: 'Modern, curat, alb-negru.', features: ['photo'], centered: true },
    { id: 'envelope', name: 'Plic 3D de Lux', component: asTemplate(EnvelopeTemplate), desc: 'O deschidere magică și clasică.', features: ['photo'], centered: true },
    { id: 'netflix', name: 'Cinematic Netflix', component: asTemplate(NetflixTemplate), desc: 'Evenimentul tău ca un serial de succes.', features: ['video', 'photo'] },
    { id: 'boarding', name: 'Boarding Pass', component: asTemplate(BoardingPassTemplate), desc: 'Invitație tip bilet de avion.', features: ['photo'] },
    { id: 'vinyl', name: 'Vinyl Record', component: asTemplate(VinylTemplate), desc: 'Stil retro cu muzică de fundal.', features: ['audio', 'photo'], centered: true },
    { id: 'scratch', name: 'Loz Norocos', component: asTemplate(ScratchTemplate), desc: 'Interactiv: răzuiește surpriza.', features: ['photo'], centered: true },
    { id: 'passport', name: 'Pașaport VIP', component: asTemplate(PassportTemplate), desc: 'Perfect pentru nunți în destinații exotice.', features: ['photo'], centered: true },
    { id: 'news', name: 'The Wedding Times', component: asTemplate(NewspaperTemplate), desc: 'Anunță evenimentul ca pe o știre de primă pagină.', features: ['photo'] },
    { id: 'cinema', name: 'Film Poster', component: asTemplate(CinemaTemplate), desc: 'Voi sunteți vedetele filmului.', features: ['photo'] },
    { id: 'festival', name: 'Summer Festival', component: asTemplate(FestivalTemplate), desc: 'Pentru petreceri electrizante.', features: ['audio', 'photo'] },
    { id: 'vip', name: 'VIP Access Card', component: asTemplate(VipCardTemplate), desc: 'Un card exclusivist 3D.', features: ['photo'], centered: true },
    { id: 'story', name: 'Insta Story', component: asTemplate(StoryTemplate), desc: 'Format vertical, modern, cu video.', features: ['video', 'photo'] },
    { id: 'chat', name: 'Love Chat', component: asTemplate(ChatTemplate), desc: 'O conversație modernă.', features: ['audio', 'photo'] },
]

const badgeInfo: Record<Feature, { label: string; className: string; icon: ReactNode }> = {
    video: { label: 'Video', className: styles.badgeVideo, icon: <Video size={12} /> },
    audio: { label: 'Audio', className: styles.badgeAudio, icon: <Music size={12} /> },
    photo: { label: 'Foto', className: styles.badgePhoto, icon: <Camera size={12} /> },
}

/** Mounts heavy template previews only when they approach the viewport (and only if visible). */
function LazyMount({ children, minHeight }: { children: ReactNode; minHeight?: number }) {
    const ref = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el || visible) return
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    setVisible(true)
                    observer.disconnect()
                }
            },
            { rootMargin: '400px 0px' }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [visible])

    return (
        <div ref={ref} className={styles.lazyMount} style={minHeight ? { minHeight } : undefined}>
            {visible ? children : <div className={styles.previewPlaceholder} />}
        </div>
    )
}

/** Isolated clock so the whole page doesn't re-render every tick. */
function PhoneClock() {
    const [time, setTime] = useState('09:41')

    useEffect(() => {
        const update = () => {
            const now = new Date()
            setTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`)
        }
        update()
        const timer = setInterval(update, 30000)
        return () => clearInterval(timer)
    }, [])

    return <div className={styles.time}>{time}</div>
}

export default function DemoPage() {
    return (
        <div className={styles.demoPage}>
            <header className={styles.hero}>
                <div className={styles.heroBadge}><Sparkles size={16} /> Colecția 2026</div>
                <h1 className={styles.heroTitle}>Alege Design-ul <span className={styles.goldText}>Perfect</span></h1>
                <p className={styles.heroSubtitle}>
                    Toate cele {templates.length} modele sunt complet interactive și optimizate pentru orice dispozitiv.
                </p>
                <nav className={styles.quickNav} aria-label="Salt rapid la model">
                    {templates.map((tpl) => (
                        <a key={tpl.id} href={`#${tpl.id}`} className={styles.quickNavItem}>
                            {tpl.name}
                        </a>
                    ))}
                </nav>
            </header>

            <div className={styles.showcaseGrid}>
                {templates.map((tpl, index) => {
                    const Template = tpl.component
                    return (
                        <section key={tpl.id} id={tpl.id} className={styles.templateCard}>
                            <div className={styles.templateHeader}>
                                <div className={styles.templateHeaderText}>
                                    <span className={styles.templateIndex}>
                                        {String(index + 1).padStart(2, '0')} / {templates.length}
                                    </span>
                                    <h2 className={styles.templateName}>{tpl.name}</h2>
                                    <div className={styles.badges}>
                                        {tpl.features.map((f) => (
                                            <span key={f} className={`${styles.badge} ${badgeInfo[f].className}`}>
                                                {badgeInfo[f].icon} {badgeInfo[f].label}
                                            </span>
                                        ))}
                                    </div>
                                    <p className={styles.templateDesc}>{tpl.desc}</p>
                                </div>
                                <Link href={`/create?template=${tpl.id}`} className={styles.useBtn}>
                                    Personalizează <ArrowRight size={16} />
                                </Link>
                            </div>

                            <div className={styles.templatePreviewArea}>
                                {/* PC Mockup (hidden on small screens) */}
                                <div className={styles.pcView}>
                                    <div className={styles.viewLabel}>Experiență Desktop</div>
                                    <div className={styles.pcFrame}>
                                        <div className={styles.pcBrowserHeader}>
                                            <div className={styles.dot}></div>
                                            <div className={styles.dot}></div>
                                            <div className={styles.dot}></div>
                                            <div className={styles.pcUrl}>invitonline.ro/mihai-teodora</div>
                                        </div>
                                        <div className={`${styles.pcContent} ${tpl.centered ? styles.centeredScaler : ''}`}>
                                            <div className={styles.pcInner}>
                                                <div className={styles.scalerPC}>
                                                    <LazyMount>
                                                        <Template {...demoProps} />
                                                    </LazyMount>
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
                                            <PhoneClock />
                                            <div className={styles.statusIcons}>
                                                <Search size={12} strokeWidth={3} />
                                                <div className={styles.signal}>
                                                    <span></span><span></span><span></span><span></span>
                                                </div>
                                                <div className={styles.battery}>
                                                    <div className={styles.batteryLevel}></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.homeBar}></div>
                                        <div className={`${styles.phoneInner} ${tpl.centered ? styles.centeredScaler : ''}`}>
                                            <div className={styles.mobileInner}>
                                                <div className={styles.scalerMobile}>
                                                    <LazyMount>
                                                        <Template {...demoProps} />
                                                    </LazyMount>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )
                })}
            </div>

            <footer className={styles.demoFooter}>
                <h2 className={styles.footerTitle}>Gata să-ți creezi propria invitație?</h2>
                <p className={styles.footerText}>Alege modelul preferat și personalizează-l în câteva minute. 20 € per invitație (preț final; furnizorul nu este plătitor de TVA), fără limită de invitați.</p>
                <Link href="/create" className={styles.finalCta}>Începe Acum</Link>
            </footer>
        </div>
    )
}
