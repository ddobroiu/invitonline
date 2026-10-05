'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Check, Monitor, Smartphone } from 'lucide-react'
import { EVENT_TYPES, TEMPLATES, TEMPLATE_THEMES, getTemplateTheme, type TemplateTheme, type EventTypeId } from '@/config/templates'
import { demoProps } from '@/lib/demo-data'
import TemplateRenderer from '@/components/TemplateRenderer'
import PreviewViewport from '@/components/PreviewViewport'
import InvitationDiscover from '@/components/InvitationDiscover'
import styles from './page.module.css'

type CatalogueFilter = 'all' | `event:${EventTypeId}` | `theme:${TemplateTheme}`

function ModelPreview({ id, name, type }: { id: string; name: string; type: EventTypeId }) {
    const ref = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        if (!ref.current) return
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) { setVisible(true); observer.disconnect() }
        }, { rootMargin: '180px' })
        observer.observe(ref.current)
        return () => observer.disconnect()
    }, [])
    return <div ref={ref} className={styles.preview}>
        {visible ? <PreviewViewport title={`Previzualizare ${name}`}><TemplateRenderer template={id} {...demoProps(type, 'standard')} /></PreviewViewport> : <div className={styles.placeholder}>Se pregătește invitația…</div>}
    </div>
}

export default function DemoPage() {
    const [selection, setSelection] = useState<CatalogueFilter>('all')
    const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile')
    const filter = selection.startsWith('event:') ? selection.slice(6) as EventTypeId : 'all'
    const theme = selection.startsWith('theme:') ? selection.slice(6) as TemplateTheme : 'all'
    const models = TEMPLATES.filter((t) => (filter === 'all' || t.suits.includes(filter)) && (theme === 'all' || getTemplateTheme(t.id) === theme))
    return <div className={styles.page}>
        <header className={styles.hero}>
            <span className={styles.eyebrow}>O invitație. O primă emoție.</span>
            <h1>Povestea voastră.<br /><em>O tematică pe măsură.</em></h1>
            <p>Bilet de avion, pașaport, disc de vinil sau prima pagină a unui ziar. Alege lumea invitației tale și completează-o cu povestea voastră.</p>
            <div className={styles.benefits}><span><Check size={15} /> Personalizare simplă</span><span><Check size={15} /> Confirmări online</span><span><Check size={15} /> Un link pentru toți</span></div>
        </header>
        <div className={styles.toolbar}>
            <div className={styles.catalogueFilter}>
                <label htmlFor="catalogue-filter">Alege modelele</label>
                <select id="catalogue-filter" value={selection} onChange={event => setSelection(event.target.value as CatalogueFilter)}>
                    <option value="all">Toate modelele</option>
                    <optgroup label="După eveniment">{EVENT_TYPES.map(type => <option key={type.id} value={`event:${type.id}`}>{type.label}</option>)}</optgroup>
                    <optgroup label="După tematică">{TEMPLATE_THEMES.map(theme => <option key={theme.id} value={`theme:${theme.id}`}>{theme.label}</option>)}</optgroup>
                </select>
            </div>
            <div className={styles.devices} role="group" aria-label="Format previzualizare">
                <button aria-label="Telefon" aria-pressed={device === 'mobile'} onClick={() => setDevice('mobile')}><Smartphone size={18} /></button>
                <button aria-label="Ecran mare" aria-pressed={device === 'desktop'} onClick={() => setDevice('desktop')}><Monitor size={18} /></button>
            </div>
        </div>
        <div className={styles.collectionHeading}><span aria-live="polite">{models.length} modele pentru povestea ta</span><span>Explorează și interacționează cu fiecare invitație</span></div>
        {models.length === 0 && <div className={styles.empty}><p>Nu avem încă un model pentru această selecție.</p><button onClick={() => setSelection('all')}>Vezi toate invitațiile</button></div>}
        <div className={`${styles.grid} ${device === 'desktop' ? styles.desktop : ''}`}>
            {models.map((t, index) => <article key={t.id} className={styles.card}>
                <div className={styles.stage}>
                    <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
                    {t.isNew && <span className={styles.newBadge}>Colecția nouă</span>}
                    <ModelPreview id={t.id} name={t.name} type={filter === 'all' ? t.suits[0] : filter} />
                </div>
                <div className={styles.cardInfo}>
                    <div><h2>{t.name}</h2><p>{t.desc}</p></div>
                    <div className={styles.cardActions}>
                        <Link className={styles.choose} href={`/create?template=${t.id}&tip=${filter === 'all' ? t.suits[0] : filter}`}>Personalizează <ArrowRight size={16} /></Link>
                        <Link className={styles.expand} href={`/templates/${t.id}?tip=${filter === 'all' ? t.suits[0] : filter}`} aria-label={`Deschide ${t.name} pe tot ecranul`}><ArrowUpRight size={20} /></Link>
                    </div>
                </div>
            </article>)}
        </div>
        <InvitationDiscover />
        <section className={styles.footer}><span className={styles.eyebrow}>Creată de tine. Păstrată în amintiri.</span><h2>Totul începe cu o invitație.</h2><Link href="/create">Creează invitația ta <ArrowRight size={18} /></Link></section>
    </div>
}
