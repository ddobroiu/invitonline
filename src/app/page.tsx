import Link from 'next/link'
import {
  Crown,
  CheckCircle,
  MapPin,
  Palette,
  Link2,
  Send,
  Check,
  ArrowRight,
  Music,
  Users,
  Infinity as InfinityIcon,
  Sparkles,
} from 'lucide-react'
import styles from './page.module.css'
import ProcessAnimation from '@/components/home/ProcessAnimation'
import type { Metadata } from 'next'
import { SITE_URL } from '@/config/legal'
import { INVITATION_PRICE } from '@/lib/stripe'
import { OG_BASE, jsonLdString } from '@/lib/seo'

// Single source for the price (cents in lib/stripe)
const PRICE_EUR = INVITATION_PRICE / 100

export const metadata: Metadata = {
  title: { absolute: 'Invitații digitale pentru nuntă și botez | InvitOnline' },
  description: 'Creează invitații digitale interactive pentru nuntă, botez sau aniversare: 15 modele animate, confirmări RSVP online, hărți Google Maps și Waze. 20 € per invitație.',
  alternates: { canonical: '/' },
  openGraph: {
    ...OG_BASE,
    title: 'InvitOnline - Invitații digitale pentru nuntă și botez',
    description: 'Invitații digitale interactive, cu confirmări RSVP online și hărți integrate. 20 € per invitație, fără limită de invitați.',
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

const steps = [
  {
    icon: Palette,
    title: 'Alegi modelul',
    text: 'Selectezi unul dintre cele 15 template-uri și completezi detaliile evenimentului: nume, dată, locație, program.',
  },
  {
    icon: Link2,
    title: 'Primești link-ul',
    text: 'După finalizare, invitația ta primește un link unic, gata de trimis, care arată perfect pe orice telefon.',
  },
  {
    icon: Send,
    title: 'Trimiți și urmărești',
    text: 'O distribui pe WhatsApp, Facebook sau e-mail și urmărești confirmările în timp real din contul tău.',
  },
]

const showcase = [
  { id: 'classic-gold', name: 'Classic Gold', tag: 'Elegant', variant: 'tplGold' },
  { id: 'envelope', name: 'Plic 3D de Lux', tag: 'Interactiv', variant: 'tplEnvelope' },
  { id: 'netflix', name: 'Cinematic Netflix', tag: 'Video', variant: 'tplNetflix' },
  { id: 'boarding', name: 'Boarding Pass', tag: 'Călătorie', variant: 'tplBoarding' },
  { id: 'vinyl', name: 'Vinyl Record', tag: 'Muzică', variant: 'tplVinyl' },
  { id: 'scratch', name: 'Loz Norocos', tag: 'Surpriză', variant: 'tplScratch' },
] as const

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
    a: 'În panoul tău de control vezi în timp real cine a confirmat, câte persoane vin și eventualele mesaje sau preferințe de meniu.',
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
        price: String(PRICE_EUR),
        priceCurrency: 'EUR',
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

      {/* HERO */}
      <section className={styles.hero}>
        <div className={`${styles.eyebrow} animate-fade-in`}>
          <Sparkles size={14} /> Invitații digitale premium
        </div>
        <h1 className={`hero-title ${styles.heroTitle} animate-fade-in`}>Viitorul Evenimentelor Tale</h1>
        <p className={`${styles.description} animate-fade-in delay-1`}>
          Lasă hârtia în urmă. Trimite invitații digitale interactive, elegante și memorabile
          pentru nunți, botezuri și momente unice.
        </p>
        <div className={`${styles.buttonGroup} animate-fade-in delay-2`}>
          <Link href="/create" className={`btn-primary ${styles.btnLink}`}>
            Începe Acum
          </Link>
          <Link href="/demo" className={styles.secondaryBtn}>
            Vezi Demo
          </Link>
        </div>

        <div className={`${styles.processWrap} animate-fade-in delay-3`}>
          <ProcessAnimation />
        </div>
      </section>

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

      {/* HOW IT WORKS */}
      <section className={styles.section} id="cum-functioneaza">
        <div className={styles.sectionHeader}>
          <span className={styles.kicker}>Simplu și rapid</span>
          <h2 className={styles.sectionTitle}>Cum funcționează</h2>
          <p className={styles.sectionSubtitle}>De la idee la invitația trimisă în mai puțin de 10 minute.</p>
        </div>
        <ol className={styles.steps}>
          {steps.map(({ icon: Icon, title, text }, idx) => (
            <li key={title} className={styles.step}>
              <div className={styles.stepNumber}>{idx + 1}</div>
              <div className={styles.stepIcon}>
                <Icon size={22} />
              </div>
              <h3 className={styles.stepTitle}>{title}</h3>
              <p className={styles.stepText}>{text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* TEMPLATE SHOWCASE */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.kicker}>Colecția 2026</span>
          <h2 className={styles.sectionTitle}>Modele care impresionează</h2>
          <p className={styles.sectionSubtitle}>
            15 template-uri interactive, de la clasic și elegant până la cinematic și jucăuș.
          </p>
        </div>
        <div className={styles.templateGrid}>
          {showcase.map((tpl) => (
            <Link
              key={tpl.id}
              href={`/create?template=${tpl.id}`}
              className={styles.templateTile}
            >
              <div className={`${styles.tplPreview} ${styles[tpl.variant]}`}>
                <span className={styles.tplMonogram}>M &amp; T</span>
              </div>
              <div className={styles.tplInfo}>
                <div>
                  <span className={styles.tplTag}>{tpl.tag}</span>
                  <h3 className={styles.tplName}>{tpl.name}</h3>
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
            Vezi toate cele 15 modele <ArrowRight size={18} />
          </Link>
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
            <span className={styles.priceValue}>{PRICE_EUR} €</span>
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
