'use client'

import { useState, useEffect } from 'react'
import styles from './ProcessAnimation.module.css'
import { Check, Lock, Palette, Info, CreditCard, Send, Smartphone, Crown, Rocket } from 'lucide-react'

export default function ProcessAnimation() {
    const [step, setStep] = useState(0)

    useEffect(() => {
        // Longer duration to allow reading the typing: 4s
        const timer = setInterval(() => {
            setStep((prev) => (prev + 1) % 4)
        }, 4500)
        return () => clearInterval(timer)
    }, [])

    return (
        <div className={`${styles.container} ${styles[`step${step}`]}`}>
            <div className={styles.orb1}></div>
            <div className={styles.orb2}></div>

            {/* --- TOP NAV --- */}
            <div className={styles.progressContainer}>
                {[
                    { label: 'Configurezi', icon: <Palette size={24} /> },
                    { label: 'Primești Link', icon: <Rocket size={24} /> },
                    { label: 'Trimiți', icon: <Send size={24} /> },
                    { label: 'Impresionezi', icon: <Crown size={24} /> },
                ].map((item, idx) => (
                    <div
                        key={idx}
                        className={`${styles.progressItem} ${step === idx ? styles.active : ''}`}
                        onClick={() => setStep(idx)}
                    >
                        <div className={styles.progressDot}>
                            {item.icon}
                        </div>
                        <div className={styles.progressLabel}>{item.label}</div>
                    </div>
                ))}
            </div>


            {/* --- 3D STAGE --- */}
            <div className={styles.stageWrapper}>

                {/* --- 1. LAPTOP (InvitOnline Website) --- */}
                <div className={styles.laptopGroup}>
                    <div className={styles.laptopBase}>
                        {/* Browser Header */}
                        <div className={styles.browserHeader}>
                            <div className={styles.dots}>
                                <div className={styles.dot}></div><div className={styles.dot}></div><div className={styles.dot}></div>
                            </div>
                            <div className={styles.urlBar}>
                                <Lock size={10} className={styles.secureIcon} /> invitonline.ro/create
                            </div>
                        </div>

                        {/* App Content */}
                        <div className={styles.appContainer}>
                            {/* Sidebar Mockup */}
                            <div className={styles.sidebar}>
                                <div style={{ color: '#fff', fontSize: '1rem', fontWeight: 'bold', marginBottom: '10px' }}>
                                    Invit<span style={{ color: '#d4af37' }}>Online</span>
                                </div>
                                <div className={styles.navItem}><Palette size={14} /> Design</div>
                                <div className={`${styles.navItem} ${styles.active}`}><Info size={14} /> Detalii</div>
                                <div className={styles.navItem}><CreditCard size={14} /> Finalizare</div>

                                <div style={{ marginTop: 'auto' }}>
                                    <div className={styles.skeletonLine} style={{ width: '60%' }}></div>
                                    <div className={styles.skeletonLine}></div>
                                </div>
                            </div>

                            {/* Main Form Area */}
                            <div className={styles.mainArea}>
                                <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '14px' }}>Configurează Invitația</h3>

                                <div className={styles.formGrid}>
                                    <div className={styles.fieldGroup}>
                                        <div className={styles.label}>Nume Mire & Mireasă</div>
                                        <div className={styles.inputBox}>
                                            {step === 0 && <div className={`${styles.typedText} ${styles.animate1}`}>Mihai & Teodora</div>}
                                        </div>
                                    </div>
                                    <div className={styles.fieldGroup}>
                                        <div className={styles.label}>Data Evenimentului</div>
                                        <div className={styles.inputBox}>
                                            {step === 0 && <div className={`${styles.typedText} ${styles.animate2}`}>25 August 2026</div>}
                                        </div>
                                    </div>
                                    <div className={styles.fieldGroup} style={{ gridColumn: 'span 2' }}>
                                        <div className={styles.label}>Locație</div>
                                        <div className={styles.inputBox}>
                                            {step === 0 && <div className={`${styles.typedText} ${styles.animate3}`}>Palatul Știrbei, București</div>}
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.generateBtn}>
                                    <Rocket size={16} /> GENERARE LINK
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- 2. LINK POPUP (Success) --- */}
                <div className={styles.linkPopup}>
                    <div className={styles.checkmark}>
                        <Check size={32} strokeWidth={4} />
                    </div>
                    <div style={{ color: 'white', fontSize: '14px' }}>Invitația ta este gata!</div>
                    <div className={styles.linkText}>invitonline.ro/nunta-ta</div>
                </div>

                {/* --- 3. PHONE (WhatsAPP + Invite) --- */}
                <div className={styles.phoneGroup}>
                    <div className={styles.phoneBody}>

                        {/* A. WhatsApp UI */}
                        <div className={styles.waHeader}>
                            <div className={styles.avatar}></div>
                            <div style={{ fontSize: '12px' }}>Grupul Familiei</div>
                        </div>
                        <div className={styles.waChat}>
                            <div className={`${styles.msg} ${styles.sent}`}>
                                Dragii noștri, vă așteptăm la nuntă! 🤵👰
                            </div>
                            <div className={`${styles.msg} ${styles.sent}`}>
                                <b style={{ color: '#0070f3' }}>invitonline.ro/nunta-ta</b>
                            </div>
                        </div>

                        {/* B. Invite UI (Reveal) */}
                        <div className={styles.inviteScreen}>
                            {/* 3D Envelope Animation Included Here */}
                            <div className={styles.envelope3d}>
                                <div className={styles.envFlap}></div>
                                <div className={styles.envBody}></div>
                                <div className={styles.envCard}>
                                    <div className={styles.cardSubtitle}>SAVE THE DATE</div>
                                    <div className={styles.cardTitle}>Mihai & Teodora</div>

                                    {/* Animated Button */}
                                    <div className={styles.rsvpBtn}>
                                        <div className="btnText">
                                            {step === 3 ? (
                                                <span className="animate-pulse">CONFIRMĂ PREZENȚA</span>
                                            ) : 'CONFIRMĂ'}
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.envFront}></div>

                                {/* Hands/Finger Interaction */}
                                {step === 3 && (
                                    <>
                                        <div className={styles.fingerTap}>👆</div>
                                        {/* Confetti Particles */}
                                        <div className={styles.confetti} style={{ '--tx': '-50px', '--ty': '-80px' } as any}></div>
                                        <div className={styles.confetti} style={{ '--tx': '50px', '--ty': '-90px' } as any}></div>
                                        <div className={styles.confetti} style={{ '--tx': '0px', '--ty': '-100px' } as any}></div>
                                    </>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

            </div>

            <p style={{ textAlign: 'center', color: '#666', marginTop: '20px', fontSize: '14px' }}>
                * Exeperiența reală de pe platforma InvitOnline.
            </p>
        </div>
    )
}
