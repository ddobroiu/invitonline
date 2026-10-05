import Link from 'next/link'
import Image from 'next/image'
import InvitationDiscover from '@/components/InvitationDiscover'
import InvitationFlowDemo from '@/components/InvitationFlowDemo'
import {
  Crown,
  CheckCircle,
  MapPin,
  Link2,
  Check,
  ArrowRight,
  Music,
  Users,
  Infinity as InfinityIcon,
} from 'lucide-react'
import styles from './page.module.css'
import { TEMPLATES, TEMPLATE_THEMES, getTemplateTheme, getModelPreviewSrc } from '@/config/templates'
import type { Metadata } from 'next'
import { SITE_URL } from '@/config/legal'
import { INVITATION_PRICE } from '@/lib/stripe'
import { OG_BASE, jsonLdString } from '@/lib/seo'

// Single source for the price (cents in lib/stripe)
const PRICE_RON = INVITATION_PRICE / 100

export const metadata: Metadata = {
  title: { absolute: 'Invitații digitale pentru nuntă și botez | InvitOnline' },
  description: 'Creează invitații digitale interactive pentru nuntă, botez sau aniversare: 23 modele animate, confirmări RSVP online, hărți Google Maps și Waze. 99 lei per invitație.',
  alternates: { canonical: '/' },
  openGraph: {
    ...OG_BASE,
    title: 'InvitOnline - Invitații digitale pentru nuntă și botez',
    description: 'Invitații digitale interactive, cu confirmări RSVP online și hărți integrate. 99 lei per invitație, fără limită de invitați.',
    type: 'website',
    url: '/',
  },
}

const features = [
  {
    icon: Crown,
    title: 'Design Premium',
    text: 'Template-uri animate, create cu atenție la detalii, pentru un impact vizual de neuitat.',
  },
  {
    icon: CheckCircle,
    title: 'Confirmări Live',
    text: 'Vezi cine vine în timp real. Sistem RSVP complet, fără liste pe hârtie și telefoane.',
  },
  {
    icon: MapPin,
    title: 'Hărți Inteligente',
    text: 'Integrare cu Waze și Google Maps, ca oaspeții să ajungă direct la locație.',
  },
]

const showcase = TEMPLATES.slice(0, 6)

const included = [
  { icon: Link2, text: 'Link unic pentru invitația ta' },
  { icon: CheckCircle, text: 'Confirmări RSVP live' },
  { icon: Users, text: 'Listă de invitați completă' },
  { icon: MapPin, text: 'Hărți Google Maps & Waze' },
  { icon: Music, text: 'Muzică și video integrate' },
  { icon: InfinityIcon, text: 'Fără limită de invitați' },
]

const faqs = [
  {
    q: 'Cum primesc invitațiile oaspeții?',
    a: 'Primești un link unic pe care îl poți trimite pe WhatsApp, Messenger, SMS sau e-mail. Invitații îl deschid direct în browser, fără să instaleze nimic.',
  },
  {
    q: 'Pot modifica invitația după ce am plătit?',
    a: 'Da. Poți actualiza detaliile (ora, locația, programul) din contul tău, iar modificările apar imediat pentru toți cei care au link-ul.',
  },
  {
    q: 'Există o limită de invitați?',
    a: 'Nu. Prețul este per invitație (eveniment), iar link-ul poate fi trimis oricâtor persoane. Toate confirmările ajung în lista ta.',
  },
  {
    q: 'Cum văd cine a confirmat?',
    a: 'În panoul tău de control vezi în timp real cine a confirmat, câte persoane vin și eventualele mesaje.',
  },
  {
    q: 'Pot folosi invitațiile și pentru botez sau aniversare?',
    a: 'Desigur. Toate modelele se adaptează pentru nunți, botezuri, aniversări și petreceri, cu câmpuri specifice fiecărui tip de eveniment.',
  },
]

// Structured data mirrors only what is visible on this page: the priced offer and the FAQ below
const homeJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Product',
      '@id': `${SITE_URL}/#invitatie-premium`,
      name: 'Invitație Premium InvitOnline',
      description: 'Invitație digitală interactivă cu link unic, confirmări RSVP online, listă de invitați, hărți Google Maps și Waze, muzică și video. Plată unică per eveniment, fără limită de invitați.',
      brand: { '@id': `${SITE_URL}/#organization` },
      url: `${SITE_URL}/#preturi`,
      offers: {
        '@type': 'Offer',
        price: String(PRICE_RON),
        priceCurrency: 'RON',
        availability: 'https://schema.org/InStock',
        url: `${SITE_URL}/#preturi`,
        seller: { '@id': `${SITE_URL}/#organization` },
      },
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/#intrebari`,
      mainEntity: faqs.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
  ],
}

export default function Home() {
  return (
    <div className={styles.main}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(homeJsonLd) }} />
      <div className={styles.bgLayer} aria-hidden="true">
        <div className={styles.orb1}></div>
        <div className={styles.orb2}></div>
      </div>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow}>Pentru momentele care contează</div>
          <h1 className={styles.heroTitle}>Povești frumoase.<br /> <em>Invitații pe măsură.</em></h1>
          <p className={styles.description}>Bilet de avion, pașaport, vinil sau o surpriză de răzuit. Alegi modelul, trimiți linkul, iar invitații confirmă direct. Tu vezi cine vine, în contul tău.</p>
          <div className={styles.buttonGroup}>
            <Link href="#modele" className={styles.primaryButton}>Descoperă colecția <ArrowRight size={18} /></Link>
            <Link href="/create" className={styles.secondaryBtn}>Creează invitația ta</Link>
          </div>
          <div className={styles.heroNote}><Check size={15} /> Fără limită de invitați <span>·</span> {PRICE_RON} lei / eveniment</div>
          <Link href="#cum-functioneaza" className={styles.flowJump}>Vezi cum funcționează, în 3 pași <ArrowRight size={14} /></Link>
        </div>
        <Link href="/templates/boarding" className={styles.heroArt} aria-label="Descoperă invitația Bilet de avion">
          <div className={styles.artCaption}>O invitație cu propria ei tematică</div>
          <div className={styles.heroModelBack} aria-hidden="true"><Image src={getModelPreviewSrc('passport')} alt="" width={390} height={650} sizes="240px" /></div>
          <div className={styles.heroModelCard}>
            <Image src={getModelPreviewSrc('boarding')} alt="Invitație în formă de bilet de avion, cu numele mirilor și programul zilei" width={390} height={650} sizes="(max-width: 760px) 260px, 285px" priority />
          </div>
          <div className={styles.artBadge}><CheckCircle size={19} /><span>Bilet către povestea voastră<small>Apasă și explorează invitația</small></span><ArrowRight size={17} /></div>
        </Link>
      </section>

      {/* TEMPLATE SHOWCASE */}
      <section className={styles.section} id="modele">
        <div className={styles.sectionHeader}>
          <span className={styles.kicker}>Începem cu cele mai surprinzătoare</span>
          <h2 className={styles.sectionTitle}>Modele care impresionează</h2>
          <p className={styles.sectionSubtitle}>
            Deschide un bilet de avion, răzuiește un loz sau pornește un vinil. Apasă pe un model și încearcă-l.
          </p>
        </div>
        <div className={styles.templateGrid}>
          {showcase.map((tpl) => (
            <Link
              key={tpl.id}
              href={`/templates/${tpl.id}`}
              className={styles.templateTile}
            >
              <div className={styles.showcasePreview}>
                <Image src={getModelPreviewSrc(tpl.id)} alt={`Previzualizare model ${tpl.name}`} width={390} height={650} sizes="(max-width: 760px) 45vw, (max-width: 1000px) 45vw, 380px" />
                <span className={styles.previewHint}>Deschide modelul <ArrowRight size={14} /></span>
              </div>
              <div className={styles.tplInfo}>
                <div>
                  <span className={styles.tplTag}>{TEMPLATE_THEMES.find(theme => theme.id === getTemplateTheme(tpl.id))?.label}</span>
                  <h3 className={styles.tplName}>{tpl.name}</h3>
                  <p className={styles.showcaseDescription}>{tpl.desc}</p>
                </div>
                <span className={styles.tplArrow}>
                  <ArrowRight size={18} />
                </span>
              </div>
            </Link>
          ))}
        </div>
        <div className={styles.centerRow}>
          <Link href="/demo" className={styles.secondaryBtn}>
            Vezi toate cele {TEMPLATES.length} modele <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <InvitationFlowDemo />

      {/* FEATURES */}
      <section className={styles.section}>
        <div className={styles.features}>
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className={`glass-panel ${styles.featureCard}`}>
              <div className={styles.iconWrapper}>
                <Icon size={28} />
              </div>
              <h3 className={styles.featureTitle}>{title}</h3>
              <p className={styles.featureText}>{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className={styles.section} id="preturi">
        <div className={styles.sectionHeader}>
          <span className={styles.kicker}>Preț transparent</span>
          <h2 className={styles.sectionTitle}>Un singur plan, totul inclus</h2>
          <p className={styles.sectionSubtitle}>Fără abonamente și fără costuri ascunse.</p>
        </div>
        <div className={styles.pricingCard}>
          <div className={styles.pricingBadge}>Cel mai ales</div>
          <h3 className={styles.planName}>Invitație Premium</h3>
          <div className={styles.price}>
            <span className={styles.priceValue}>{PRICE_RON} lei</span>
            <span className={styles.priceUnit}>/ invitație</span>
          </div>
          <p className={styles.priceNote}>Plată unică per eveniment · Preț final; furnizorul nu este plătitor de TVA</p>
          <ul className={styles.includedList}>
            {included.map(({ icon: Icon, text }) => (
              <li key={text}>
                <span className={styles.checkIcon}>
                  <Check size={14} strokeWidth={3} />
                </span>
                <Icon size={16} className={styles.includedIcon} aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>
          <Link href="/create" className={`btn-primary ${styles.btnLink} ${styles.fullWidth}`}>
            Creează invitația
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.section} id="intrebari">
        <div className={styles.sectionHeader}>
          <span className={styles.kicker}>Întrebări frecvente</span>
          <h2 className={styles.sectionTitle}>Ai întrebări? Avem răspunsuri.</h2>
        </div>
        <div className={styles.faqList}>
          {faqs.map((item) => (
            <details key={item.q} className={styles.faqItem}>
              <summary className={styles.faqQuestion}>{item.q}</summary>
              <p className={styles.faqAnswer}>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <InvitationDiscover />
      <section className={styles.section}>
        <div className={styles.finalCta}>
          <h2 className={styles.finalTitle}>Gata să-ți impresionezi invitații?</h2>
          <p className={styles.finalText}>
            Creează acum invitația digitală perfectă și trimite-o în câteva minute.
          </p>
          <div className={styles.buttonGroup}>
            <Link href="/create" className={`btn-primary ${styles.btnLink}`}>
              Începe Acum
            </Link>
            <Link href="/demo" className={styles.secondaryBtn}>
              Vezi Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
