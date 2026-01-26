import Link from 'next/link'
import styles from './page.module.css'
import EnvelopeAnimation from '@/components/home/EnvelopeAnimation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'InvitOnline - Invitații Digitale Premium pentru Nunți, Botezuri & Evenimente',
  description: 'Creează invitații digitale interactive și elegante în doar câteva minute. Template-uri premium animate, confirmări RSVP live, hărți integrate. Soluția modernă pentru evenimente memorabile.',
  keywords: 'invitații digitale, invitații nuntă online, invitații botez digitale, invitații electronice, invitații interactive, RSVP online, invitații premium, invitații moderne, invitații animate',
  openGraph: {
    title: 'InvitOnline - Invitații Digitale Premium',
    description: 'Creează invitații digitale interactive pentru evenimente memorabile',
    type: 'website',
  },
}

export default function Home() {
  return (
    <div className={styles.main}>
      <div className={styles.orb1}></div>
      <div className={styles.orb2}></div>

      <section className={styles.hero}>
        <h1 className="hero-title animate-fade-in">Viitorul Evenimentelor Tale</h1>
        <p className={`${styles.description} animate-fade-in delay-1`}>
          Lasă hârtia în urmă. Trimite invitații digitale interactive, elegante și memorabile.
          <br />Pentru nunți, botezuri și momente unice.
        </p>
        <div className={`${styles.buttonGroup} animate-fade-in delay-2`} style={{ marginBottom: '4rem' }}>
          <Link href="/create">
            <button className="btn-primary">Începe Acum</button>
          </Link>
          <Link href="/demo">
            <button className={styles.secondaryBtn}>Vezi Demo</button>
          </Link>
        </div>

        <div className="animate-fade-in delay-3">
          <EnvelopeAnimation />
        </div>
      </section>

      <section className={styles.features}>
        <div className={`glass-panel ${styles.featureCard} animate-fade-in delay-3`}>
          <h3 className={styles.featureTitle}>Design Premium</h3>
          <p className={styles.featureText}>
            Template-uri animate create de designeri de top pentru un impact vizual wow.
          </p>
        </div>
        <div className={`glass-panel ${styles.featureCard} animate-fade-in delay-3`}>
          <h3 className={styles.featureTitle}>Confirmări Live</h3>
          <p className={styles.featureText}>
            Vezi cine vine în timp real. Sistem avansat de RSVP fără liste pe hârtie.
          </p>
        </div>
        <div className={`glass-panel ${styles.featureCard} animate-fade-in delay-3`}>
          <h3 className={styles.featureTitle}>Hărți Inteligente</h3>
          <p className={styles.featureText}>
            Integrare cu Waze și Google Maps pentru ca oaspeții să ajungă direct la locație.
          </p>
        </div>
      </section>


    </div>
  )
}
