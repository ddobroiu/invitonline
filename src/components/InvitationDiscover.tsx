import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import styles from './InvitationDiscover.module.css'

// Small navigation list: shared with client-side catalogue without shipping landing-page articles.
const events = [['invitatii-nunta', 'Nuntă'], ['invitatii-botez', 'Botez'], ['invitatii-aniversare', 'Aniversare'], ['invitatii-petrecere', 'Petrecere'], ['invitatii-corporate', 'Corporate']]
const themes = [['invitatie-bilet-avion', 'Bilet de avion'], ['invitatie-pasaport', 'Pașaport'], ['invitatie-ziar', 'Ziar'], ['invitatie-vinil', 'Vinil']]
export default function InvitationDiscover() {
    return <section className={styles.section}>
        <div className={styles.heading}><div><span>Pentru fiecare fel de sărbătoare</span><h2>O idee bună pentru invitația ta.</h2></div><Link href="/invitatii-online">Ghidul invitațiilor online <ArrowUpRight size={17} /></Link></div>
        <div className={styles.groups}><div><h3>Alege evenimentul</h3><nav aria-label="Invitații după eveniment">{events.map(([slug, label]) => <Link key={slug} href={`/${slug}`}>{label}<ArrowUpRight size={15} /></Link>)}</nav></div><div><h3>Explorează tematicile</h3><nav aria-label="Ghiduri pentru tematici">{themes.map(([slug, label]) => <Link key={slug} href={`/${slug}`}>{label}<ArrowUpRight size={15} /></Link>)}</nav></div></div>
    </section>
}
