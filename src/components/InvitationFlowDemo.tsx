'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, CheckCheck, Send, RotateCcw, Users, LayoutDashboard } from 'lucide-react'
import styles from './InvitationFlowDemo.module.css'

export default function InvitationFlowDemo() {
    const [step, setStep] = useState<0 | 1 | 2>(0)
    const guestRef = useRef<HTMLLIElement>(null)
    const platformRef = useRef<HTMLLIElement>(null)
    const advance = (nextStep: 1 | 2) => {
        setStep(nextStep)
        if (window.matchMedia('(max-width: 760px)').matches) {
            const target = nextStep === 1 ? guestRef : platformRef
            target.current?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
        }
    }
    const sent = step >= 1
    const confirmed = step === 2
    return <section className={styles.section} id="cum-functioneaza" aria-labelledby="flow-title">
        <div className={styles.heading}><span className={styles.kicker}>De la un mesaj la lista de invitați</span><h2 id="flow-title">Trimiți. Ei confirmă.<br /><em>Tu vezi cine vine.</em></h2><p>Personalizezi și activezi invitația, apoi distribui linkul. Oaspeții confirmă fără cont, iar răspunsurile ajung în platforma ta.</p></div>
        <div className={styles.demoHeading}><span className={styles.demoLabel}>Încearcă exemplul de mai jos</span><button type="button" onClick={() => setStep(0)} disabled={step === 0} className={styles.reset}><RotateCcw size={14} /> Reia exemplul</button></div>
        <ol className={styles.flow}>
            <li className={`${styles.card} ${step === 0 ? styles.active : ''}`}>
                <div className={styles.cardHeading}><span className={styles.number}>01</span><span className={styles.who}>Tu, organizatorul</span></div>
                <h3>Trimiți linkul invitației</h3><p className={styles.description}>Îl copiezi din cont și îl trimiți pe WhatsApp, Messenger, SMS sau email.</p>
                <div className={styles.message}><span className={styles.messageTo}>Mesaj către Maria</span><p>Bună, Maria! Ne-ar bucura să ne fii alături la nunta noastră. Deschide invitația și spune-ne dacă vii.</p><span className={styles.exampleLink}>invitonline.ro/invitatie/exemplu</span><span className={styles.delivery}>{sent ? <><CheckCheck size={14} /> Invitație trimisă în exemplu</> : 'Linkul este gata de trimis'}</span></div>
                <button className={styles.action} type="button" disabled={sent} onClick={() => advance(1)}>{sent ? <><Check size={16} /> Trimisă</> : <><Send size={16} /> Trimite invitația</>}</button>
            </li>
            <li ref={guestRef} className={`${styles.card} ${step === 1 ? styles.active : ''}`}>
                <div className={styles.cardHeading}><span className={styles.number}>02</span><span className={styles.who}>Oaspetele</span></div>
                <h3>Deschide și confirmă</h3><p className={styles.description}>Citește invitația în browser și completează răspunsul. Fără aplicație, fără cont.</p>
                <div className={styles.guestPreview}><span className={styles.invitationLabel}>Ana & Andrei</span><span className={styles.invitationDate}>12 iulie 2027 · București</span><div className={styles.guestFields}><div><span>Nume</span><strong>Maria Ionescu</strong></div><div><span>Număr persoane</span><strong>2 persoane</strong></div></div><span className={styles.guestHint}>{confirmed ? 'Răspunsul a fost trimis. Mulțumim!' : sent ? 'Maria a deschis invitația. Acum poate confirma.' : 'Trimite mai întâi invitația din primul pas.'}</span></div>
                <button className={styles.action} type="button" disabled={!sent || confirmed} onClick={() => advance(2)}>{confirmed ? <><Check size={16} /> Prezență confirmată</> : <><Check size={16} /> Confirmă prezența</>}</button>
            </li>
            <li ref={platformRef} className={`${styles.card} ${confirmed ? styles.active : ''}`}>
                <div className={styles.cardHeading}><span className={styles.number}>03</span><span className={styles.who}>Contul tău</span></div>
                <h3>Vezi răspunsul în platformă</h3><p className={styles.description}>Ai numele, numărul de persoane și statusul într-o singură listă, pe care o poți exporta.</p>
                <div className={styles.platform}><div className={styles.platformHeader}><LayoutDashboard size={15} /><span>Lista invitați · Ana & Andrei</span></div><div className={styles.stats}><div><span>Răspunsuri</span><strong>{confirmed ? '1' : '0'}</strong></div><div><span>Persoane confirmate</span><strong>{confirmed ? '2' : '0'}</strong></div></div><div className={styles.guestRow}><span className={styles.avatar}>MI</span><div><strong>Maria Ionescu</strong><span>{confirmed ? '2 persoane' : 'Niciun răspuns încă'}</span></div><span className={`${styles.status} ${confirmed ? styles.confirmed : ''}`}>{confirmed ? 'Confirmat' : 'În așteptare'}</span></div><div className={styles.platformNote}><Users size={14} /> Confirmările se actualizează automat în cont.</div></div>
                <div className={styles.result} role="status" aria-live="polite">{confirmed ? 'Gata! Maria a confirmat, iar tu știi că vin 2 persoane.' : sent ? 'Invitația a ajuns la Maria. Așteptăm confirmarea din pasul 2.' : 'Apasă „Trimite invitația” pentru a vedea întregul parcurs.'}</div>
            </li>
        </ol>
        <div className={styles.bottom}><p>Demonstrație cu date fictive. La evenimentul tău, răspunsurile reale apar în cont după ce invitații confirmă.</p><Link href="/create">Creează propria invitație <ArrowRight size={17} /></Link></div>
    </section>
}
