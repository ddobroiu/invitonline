import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.orb1}></div>
      <div className={styles.orb2}></div>

      <section className={styles.hero}>
        <h1 className="hero-title animate-fade-in">Viitorul Evenimentelor Tale</h1>
        <p className={`${styles.description} animate-fade-in delay-1`}>
          Lasă hârtia în urmă. Trimite invitații digitale interactive, elegante și memorabile.
          <br />Pentru nunți, botezuri și momente unice.
        </p>
        <div className={`${styles.buttonGroup} animate-fade-in delay-2`}>
          <Link href="/create">
            <button className="btn-primary">Începe Acum</button>
          </Link>
          <Link href="/demo">
            <button className={styles.secondaryBtn}>Vezi Demo</button>
          </Link>
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

      <footer className={styles.footer}>
        &copy; {new Date().getFullYear()} Spectra Events.
      </footer>
    </main>
  )
}
