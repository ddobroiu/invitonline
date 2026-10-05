import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, ArrowUpRight, Check, MapPin, Users, Link2 } from 'lucide-react'
import { INVITATION_LANDINGS, getInvitationLanding } from '@/config/invitation-landings'
import { getTemplate, getModelPreviewSrc } from '@/config/templates'
import { SITE_URL, PRICE_NOTE } from '@/config/legal'
import { INVITATION_PRICE, INVITATION_CURRENCY } from '@/lib/stripe'
import { OG_BASE, jsonLdString } from '@/lib/seo'
import styles from './page.module.css'

type Props = { params: Promise<{ slug: string }> }
export const dynamicParams = false
export function generateStaticParams() { return INVITATION_LANDINGS.map(({ slug }) => ({ slug })) }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const page = getInvitationLanding(slug)
    if (!page) return { title: 'Pagina nu există', robots: { index: false, follow: false } }
    return {
        title: page.title, description: page.description,
        alternates: { canonical: `/${slug}` },
        openGraph: { ...OG_BASE, type: 'website', title: page.title, description: page.description, url: `/${slug}`, images: [{ url: `/${slug}/opengraph-image`, width: 1200, height: 630, alt: page.label }] },
        twitter: { card: 'summary_large_image', title: page.title, description: page.description, images: [`/${slug}/opengraph-image`] },
    }
}

export default async function InvitationLandingPage({ params }: Props) {
    const { slug } = await params
    const page = getInvitationLanding(slug)
    if (!page) notFound()
    const price = INVITATION_PRICE / 100
    const hero = getTemplate(page.models[0])!
    const start = `/create?template=${hero.id}&tip=${page.eventType}`
    const related = page.related.map(getInvitationLanding).filter(item => item !== undefined)
    const jsonLd = {
        '@context': 'https://schema.org', '@graph': [
            { '@type': 'BreadcrumbList', itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'InvitOnline', item: SITE_URL },
                ...(slug === 'invitatii-online' ? [] : [{ '@type': 'ListItem', position: 2, name: 'Invitații online', item: `${SITE_URL}/invitatii-online` }]),
                { '@type': 'ListItem', position: slug === 'invitatii-online' ? 2 : 3, name: page.label, item: `${SITE_URL}/${slug}` },
            ] },
            { '@type': 'Service', name: page.label, description: page.description, url: `${SITE_URL}/${slug}`, serviceType: 'Personalizare și activare invitație digitală', provider: { '@id': `${SITE_URL}/#organization` }, areaServed: { '@type': 'Country', name: 'România' }, offers: { '@type': 'Offer', price, priceCurrency: INVITATION_CURRENCY.toUpperCase(), url: `${SITE_URL}/${slug}#pret`, description: 'Plată unică pentru activarea unei invitații digitale, per eveniment.' } },
        ],
    }
    return <div className={styles.page}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
        <nav className={styles.breadcrumbs} aria-label="Fir de navigare"><Link href="/">Acasă</Link><span aria-hidden="true">/</span>{slug !== 'invitatii-online' && <><Link href="/invitatii-online">Invitații online</Link><span aria-hidden="true">/</span></>}<span aria-current="page">{page.label}</span></nav>
        <section className={styles.hero}>
            <div className={styles.heroCopy}>
                <span className={styles.eyebrow}>{page.eyebrow}</span>
                <h1>{page.heading}</h1>
                <p>{page.intro}</p>
                <div className={styles.actions}><Link href={start} className={styles.primary}>Personalizează invitația <ArrowRight size={18} /></Link><a href="#modele" className={styles.secondary}>Descoperă modelele</a></div>
                <div className={styles.benefits}><span><Link2 size={15} /> Un link pentru oaspeți</span><span><Users size={15} /> Confirmări RSVP</span><span><MapPin size={15} /> Hartă și navigare</span></div>
            </div>
            <div className={styles.heroVisual} style={{ '--preview-tone': slug.includes('botez') ? '#e9e3f0' : slug.includes('vinil') ? '#e9ddd0' : '#e5e9df' } as CSSProperties}>
                <span className={styles.visualLabel}>Din colecția InvitOnline</span>
                <Link href={`/templates/${hero.id}?tip=${page.eventType}`} className={styles.heroPreview} aria-label={`Deschide previzualizarea ${hero.name}`}>
                    <Image src={getModelPreviewSrc(hero.id)} alt={`Modelul ${hero.name}, exemplu de invitație digitală`} width={390} height={650} sizes="(max-width: 760px) 82vw, 340px" priority />
                </Link>
                <Link className={styles.visualCaption} href={`/templates/${hero.id}?tip=${page.eventType}`}>{hero.name}<span>Vezi invitația <ArrowUpRight size={17} /></span></Link>
            </div>
        </section>
        <section className={styles.section} id="modele">
            <div className={styles.sectionHead}><div><span className={styles.eyebrow}>Alege primul detaliu al poveștii</span><h2>Modele de explorat</h2></div><Link href="/demo">Toată colecția <ArrowUpRight size={18} /></Link></div>
            <div className={styles.modelGrid}>{page.models.map(id => {
                const model = getTemplate(id)!
                const type = model.suits.includes(page.eventType) ? page.eventType : model.suits[0]
                return <article key={id} className={styles.modelCard}>
                    <Link href={`/templates/${id}?tip=${type}`} className={styles.modelImage} aria-label={`Vezi modelul ${model.name}`}><Image src={getModelPreviewSrc(id)} alt={`Previzualizare invitație ${model.name}`} width={390} height={650} sizes="(max-width: 600px) 90vw, (max-width: 900px) 45vw, 350px" /></Link>
                    <div className={styles.modelCopy}><h3>{model.name}</h3><p>{model.desc}</p><Link href={`/create?template=${id}&tip=${type}`}>Personalizează modelul <ArrowRight size={17} /></Link></div>
                </article>
            })}</div>
        </section>
        <section className={styles.editorial} aria-label={`Ghid pentru ${page.label.toLowerCase()}`}>
            <div className={styles.content}>{page.sections.map((section, i) => <section key={section.title} className={styles.articleSection}><span className={styles.sectionNumber}>0{i + 1}</span><h2>{section.title}</h2><p>{section.text}</p></section>)}</div>
            <aside className={styles.checklist}><span className={styles.eyebrow}>Înainte să începi</span><h2>{page.checklistTitle}</h2><ul>{page.checklist.map(item => <li key={item}><Check size={17} /><span>{item}</span></li>)}</ul><Link href={start}>Deschide editorul <ArrowRight size={17} /></Link></aside>
        </section>
        <section className={styles.sample}><span className={styles.eyebrow}>Cuvinte cu care poți începe</span><h2>{page.sampleTitle}</h2><blockquote>{page.sample}</blockquote><p>Exemplul este fictiv. Înlocuiește numele, data și programul cu detaliile evenimentului tău.</p></section>
        <section className={styles.process}><div><span className={styles.eyebrow}>De la idee la oaspeți</span><h2>Trei pași, o invitație personală.</h2></div><ol><li><span>01</span><h3>Personalizezi</h3><p>Alegi modelul și completezi numele, mesajul, data și locația. Verifici previzualizarea.</p></li><li><span>02</span><h3>Salvezi și activezi</h3><p>Creezi contul, salvezi invitația și o activezi prin plata unică de {price} lei.</p></li><li><span>03</span><h3>Trimiți linkul</h3><p>Distribui invitația pe WhatsApp, SMS sau email și urmărești răspunsurile în cont.</p></li></ol></section>
        <section className={styles.offer} id="pret"><div><span className={styles.eyebrow}>Un preț pentru întregul eveniment</span><h2>{price} lei <small>/ invitație</small></h2><p>Plată unică. Personalizare, link public, RSVP și exportul listei de invitați. Poți salva un draft înainte de plată.</p><span className={styles.priceNote}>{PRICE_NOTE}.</span></div><Link href={start} className={styles.primary}>Creează invitația ta <ArrowRight size={18} /></Link></section>
        <section className={styles.faq}><span className={styles.eyebrow}>Detaliile contează</span><h2>Întrebări despre {page.label.toLowerCase()}</h2>{page.faq.map(item => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</section>
        <section className={styles.related}><div className={styles.sectionHead}><div><span className={styles.eyebrow}>Mai multe idei pentru eveniment</span><h2>Continuă să explorezi</h2></div></div><div className={styles.relatedGrid}>{related.map(item => <Link key={item.slug} href={`/${item.slug}`}><span>{item.label}</span><ArrowUpRight size={20} /></Link>)}</div><Link className={styles.guide} href={page.guide.href}>{page.guide.label} <ArrowRight size={17} /></Link></section>
    </div>
}
