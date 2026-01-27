'use client'

import { useState, useEffect, Suspense, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession, signIn } from 'next-auth/react'
import styles from './page.module.css'

// Import Template Components
import NetflixTemplate from '@/components/templates/NetflixTemplate'
import BoardingPassTemplate from '@/components/templates/BoardingPassTemplate'
import EnvelopeTemplate from '@/components/templates/EnvelopeTemplate'
import VinylTemplate from '@/components/templates/VinylTemplate'
import ScratchTemplate from '@/components/templates/ScratchTemplate'
import PassportTemplate from '@/components/templates/PassportTemplate'
import NewspaperTemplate from '@/components/templates/NewspaperTemplate'
import CinemaTemplate from '@/components/templates/CinemaTemplate'
import FestivalTemplate from '@/components/templates/FestivalTemplate'
import VipCardTemplate from '@/components/templates/VipCardTemplate'
import ClassicTemplate from '@/components/templates/ClassicTemplate'
import ClassicGoldTemplate from '@/components/templates/ClassicGoldTemplate'
import ClassicMinimalTemplate from '@/components/templates/ClassicMinimalTemplate'
import StoryTemplate from '@/components/templates/StoryTemplate'
import ChatTemplate from '@/components/templates/ChatTemplate'
import { Save, Zap, ChevronLeft, Palette, Info, ClipboardList, Settings2, Trash2, Plus, Heart, Baby, PartyPopper, Calendar, MapPin, Music, Video, Image as ImageIcon, Loader2, Building, Search, Monitor, Smartphone, Lock, Receipt, CreditCard, MailOpen, Clapperboard, Plane, Disc, Ticket, Globe, Newspaper, Film, Tent, Crown, MessageCircle, Flower2, Gem, Minus } from 'lucide-react'
import LocationPicker from '@/components/LocationPicker'
import MediaUploader from '@/components/MediaUploader'
import ImageUploader from '@/components/ImageUploader'
import BillingPanel from '@/components/dashboard/BillingPanel'

interface UserBilling {
    companyName?: string;
    cui?: string;
    regCom?: string;
    address?: string;
    city?: string;
    county?: string;
}

function CreateEventContent() {
    const router = useRouter()
    const { data: session, status } = useSession()
    const [isSaving, setIsSaving] = useState(false)
    const [userBilling, setUserBilling] = useState<UserBilling | null>(null)
    const [isFetchingBilling, setIsFetchingBilling] = useState(false)

    // Auth Form State (Simplified)
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
    const [authData, setAuthData] = useState({ email: '', password: '', name: '' })
    const [authError, setAuthError] = useState('')
    const [isAuthLoading, setIsAuthLoading] = useState(false)

    // Effect to fetch billing info if logged in
    useEffect(() => {
        if (status === 'authenticated') {
            fetchBilling()
        }
    }, [status])


    const fetchBilling = async () => {
        setIsFetchingBilling(true)
        try {
            const res = await fetch('/api/user/billing')
            if (res.ok) {
                const data = await res.json()
                setUserBilling(data)
            }
        } catch (error) {
            console.error('Error fetching billing:', error)
        } finally {
            setIsFetchingBilling(false)
        }
    }

    const handleAuthSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setAuthError('')
        setIsAuthLoading(true)

        if (authMode === 'login') {
            const res = await signIn('credentials', {
                email: authData.email,
                password: authData.password,
                redirect: false
            })
            if (res?.error) setAuthError('Email sau parolă incorectă')
        } else {
            try {
                const res = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(authData)
                })
                if (res.ok) {
                    await signIn('credentials', {
                        email: authData.email,
                        password: authData.password,
                        redirect: false
                    })
                } else {
                    const data = await res.json()
                    setAuthError(data.message || 'Eroare la înregistrare')
                }
            } catch (err) {
                setAuthError('Eroare tehnică')
            }
        }
        setIsAuthLoading(false)
    }

    const [formData, setFormData] = useState({
        title: 'Ana & Andrei',
        date: '25 AUGUST 2026',
        location: 'Palatul Știrbei',
        locationUrl: '',
        message: 'Te invităm să sărbătorești alături de noi acest moment special.',
        eventType: 'nunta',
        // Common
        dressCode: '',
        // Toggle Flags
        showWeddingExtras: false,
        showBaptismExtras: false,
        showPartyExtras: false,
        // Wedding
        groomName: '',
        brideName: '',
        parentsGroom: '',
        parentsBride: '',
        godparents: '',
        civilCeremonyTime: '',
        civilCeremonyLoc: '',
        religiousCeremonyTime: '',
        religiousCeremonyLoc: '',
        partyTime: '',
        partyLoc: '',
        // Baptism
        childName: '',
        motherName: '',
        fatherName: '',
        godparentsBaptism: '',
        birthDate: '',
        childAge: '',
        churchTime: '',
        churchLoc: '',
        restaurantTime: '',
        restaurantLoc: '',
        // Anniversary
        celebrantName: '',
        age: '',
        partyType: '',
        host: '',
        theme: '',
        specialInstructions: '',
        // Billing Info
        billingType: 'persoana_fizica', // persoana_fizica or persoana_juridica
        billingName: '',
        billingCui: '',
        billingAddress: '',
        billingCity: '',
        // Media URLs
        audioUrl: '',
        videoUrl: '',
        photoUrl: '',
        // Dynamic Fields
        customFields: [] as { label: string, value: string }[]
    })

    const searchParams = useSearchParams()

    // State for selected template
    const [selectedTemplate, setSelectedTemplate] = useState<'classic' | 'classic-gold' | 'classic-minimal' | 'envelope' | 'netflix' | 'boarding' | 'vinyl' | 'scratch' | 'passport' | 'news' | 'cinema' | 'festival' | 'vip' | 'story' | 'chat'>(() => {
        const t = searchParams.get('template')
        const valid = ['classic', 'classic-gold', 'classic-minimal', 'envelope', 'netflix', 'boarding', 'vinyl', 'scratch', 'passport', 'news', 'cinema', 'festival', 'vip', 'story', 'chat']
        return (valid.includes(t || '') ? t : 'classic') as any
    })

    const [previewMode, setPreviewMode] = useState<'pc' | 'mobile'>('pc')

    // Detect mobile device
    useEffect(() => {
        const checkMobile = () => {
            if (window.innerWidth < 900) {
                setPreviewMode('mobile')
            } else {
                setPreviewMode('pc')
            }
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const [currentStep, setCurrentStep] = useState(0)
    const steps = [
        { name: 'Design', icon: <Palette size={16} /> },
        { name: 'Configurare', icon: <Info size={16} /> },
        { name: 'Finalizare', icon: <CreditCard size={16} /> }
    ]

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement
        const isChecked = (e.target as HTMLInputElement).checked

        setFormData(prev => {
            // Checkbox handling
            if (type === 'checkbox') {
                return { ...prev, [name]: isChecked }
            }
            // 1. Handle Event Type Change (Set Defaults)
            if (name === 'eventType') {
                let newTitle = ''
                let newMessage = ''

                switch (value) {
                    case 'nunta':
                        newTitle = 'Ana & Andrei'
                        newMessage = 'Te invităm să sărbătorești alături de noi acest moment special.'
                        break
                    case 'botez':
                        newTitle = 'David Ionuț'
                        newMessage = 'Vă invităm la creștinarea micuțului nostru.'
                        break
                    case 'aniversare':
                        newTitle = 'Alex - 30 Ani'
                        newMessage = 'Te invităm la o super petrecere!'
                        break
                    case 'petrecere':
                        newTitle = 'Summer Party'
                        newMessage = 'Let\'s party all night!'
                        break
                    default:
                        newTitle = 'Eveniment Special'
                        newMessage = 'Te invităm la evenimentul nostru.'
                }
                return { ...prev, eventType: value, title: newTitle, message: newMessage }
            }

            // 2. Handle Specific Fields Syncing to Title
            const updated = { ...prev, [name]: value }

            if (updated.eventType === 'nunta' && (name === 'groomName' || name === 'brideName')) {
                const g = name === 'groomName' ? value : updated.groomName
                const b = name === 'brideName' ? value : updated.brideName
                if (g || b) updated.title = `${g || 'Mire'} & ${b || 'Mireasă'}`
            }
            else if (updated.eventType === 'botez' && name === 'childName') {
                updated.title = value
            }
            else if ((updated.eventType === 'aniversare' || updated.eventType === 'petrecere') && name === 'celebrantName') {
                updated.title = value
            }

            return updated
        })
    }

    const handleCustomFieldChange = (index: number, key: 'label' | 'value', value: string) => {
        setFormData(prev => {
            const newFields = [...prev.customFields]
            newFields[index] = { ...newFields[index], [key]: value }
            return { ...prev, customFields: newFields }
        })
    }

    const addCustomField = () => {
        setFormData(prev => ({
            ...prev,
            customFields: [...prev.customFields, { label: '', value: '' }].slice(0, 3)
        }))
    }

    const removeCustomField = (index: number) => {
        setFormData(prev => ({
            ...prev,
            customFields: prev.customFields.filter((_, i) => i !== index)
        }))
    }

    const handleSave = async (shouldPay: boolean = false) => {
        if (status !== 'authenticated') {
            // Save draft locally before redirecting
            localStorage.setItem('eventDraft', JSON.stringify({ ...formData, template: selectedTemplate }))
            router.push('/login?callbackUrl=/create')
            return
        }

        setIsSaving(true)
        try {
            const res = await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    template: selectedTemplate,
                    type: formData.eventType
                })
            })

            if (res.ok) {
                const data = await res.json()
                localStorage.removeItem('eventDraft')

                if (shouldPay) {
                    // Immediately trigger payment
                    const checkoutRes = await fetch('/api/checkout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ eventId: data.event.id })
                    })

                    if (checkoutRes.ok) {
                        const { url } = await checkoutRes.json()
                        window.location.href = url
                        return
                    }
                }

                // If not paying or payment fails, go to dashboard
                router.push('/dashboard')
            } else {
                alert('Eroare la salvarea evenimentului.')
            }
        } catch (error) {
            console.error(error)
            alert('Eroare de rețea.')
        }
        setIsSaving(false)
    }

    const [currentTime, setCurrentTime] = useState('')

    useEffect(() => {
        const updateTime = () => {
            const now = new Date()
            setCurrentTime(now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0'))
        }
        updateTime()
        const timer = setInterval(updateTime, 10000)
        return () => clearInterval(timer)
    }, [])

    return (
        <div className={styles.container}>
            {/* ... rest of editor section ... */}
            <div className={styles.editorSection}>
                {/* (Step nav and content already here) */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h1 className={styles.title}>Configurează</h1>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '5px 12px', borderRadius: '20px', fontSize: '0.7rem', color: '#888' }}>
                        PAS {currentStep + 1} DIN {steps.length}
                    </div>
                </div>

                {/* Step Navigation Bar */}
                <div className={styles.stepNav}>
                    {steps.map((step, idx) => (
                        <div
                            key={idx}
                            className={`${styles.stepTab} ${currentStep === idx ? styles.activeTab : ''}`}
                            onClick={() => setCurrentStep(idx)}
                        >
                            <div style={{ marginBottom: '4px' }}>{step.icon}</div>
                            {step.name}
                        </div>
                    ))}
                </div>

                {/* --- STEP 0: DESIGN --- */}
                {currentStep === 0 && (
                    <div className={`${styles.editorCard} ${styles.scrollArea}`} style={{ animation: 'slideInLeft 0.4s ease' }}>
                        <label className={styles.label} style={{ marginBottom: '1.2rem', display: 'block' }}>ALEGE DESIGN-UL PREFERAT</label>
                        <div className={styles.templateGrid}>

                            {/* Helper to get badges for editor grid */}
                            {(() => {
                                const templateData = [
                                    { id: 'classic', name: 'Classic Floral', icon: <Flower2 size={32} strokeWidth={1.5} />, features: ['photo'] },
                                    { id: 'classic-gold', name: 'Classic Gold', icon: <Gem size={32} strokeWidth={1.5} />, features: ['photo'] },
                                    { id: 'classic-minimal', name: 'Minimalist', icon: <Minus size={32} strokeWidth={1.5} />, features: ['photo'] },
                                    { id: 'envelope', name: 'Plic 3D', icon: <MailOpen size={32} strokeWidth={1.5} />, features: ['photo'] },
                                    { id: 'netflix', name: 'Netflix', icon: <Clapperboard size={32} strokeWidth={1.5} />, features: ['video', 'photo'] },
                                    { id: 'boarding', name: 'Avion', icon: <Plane size={32} strokeWidth={1.5} />, features: ['photo'] },
                                    { id: 'vinyl', name: 'Vinyl', icon: <Disc size={32} strokeWidth={1.5} />, features: ['audio', 'photo'] },
                                    { id: 'scratch', name: 'Scratch', icon: <Ticket size={32} strokeWidth={1.5} />, features: ['photo'] },
                                    { id: 'passport', name: 'Pașaport', icon: <Globe size={32} strokeWidth={1.5} />, features: ['photo'] },
                                    { id: 'news', name: 'Ziar', icon: <Newspaper size={32} strokeWidth={1.5} />, features: ['photo'] },
                                    { id: 'cinema', name: 'Cinema', icon: <Film size={32} strokeWidth={1.5} />, features: ['photo'] },
                                    { id: 'festival', name: 'Festival', icon: <Tent size={32} strokeWidth={1.5} />, features: ['audio', 'photo'] },
                                    { id: 'vip', name: 'VIP Card', icon: <Crown size={32} strokeWidth={1.5} />, features: ['photo'] },
                                    { id: 'story', name: 'Story', icon: <Smartphone size={32} strokeWidth={1.5} />, features: ['video', 'photo'] },
                                    { id: 'chat', name: 'Chat', icon: <MessageCircle size={32} strokeWidth={1.5} />, features: ['audio', 'photo'] }
                                ];

                                return templateData.map(tpl => (
                                    <button
                                        key={tpl.id}
                                        onClick={() => setSelectedTemplate(tpl.id as any)}
                                        className={`${styles.templateBtn} ${selectedTemplate === tpl.id ? styles.activeTemplate : ''}`}
                                    >
                                        <div style={{ marginBottom: '6px', color: selectedTemplate === tpl.id ? 'var(--accent)' : '#ccc' }}>
                                            {tpl.icon}
                                        </div>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{tpl.name}</span>

                                        <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                                            {tpl.features.includes('video') && (
                                                <div style={{
                                                    background: 'rgba(255, 107, 107, 0.15)',
                                                    padding: '4px 6px',
                                                    borderRadius: '6px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '3px',
                                                    border: '1px solid rgba(255, 107, 107, 0.3)'
                                                }}>
                                                    <Video size={10} color="#ff6b6b" />
                                                    <span style={{ fontSize: '0.6rem', color: '#ff6b6b', fontWeight: 800 }}>VIDEO</span>
                                                </div>
                                            )}
                                            {tpl.features.includes('audio') && (
                                                <div style={{
                                                    background: 'rgba(30, 215, 96, 0.15)',
                                                    padding: '4px 6px',
                                                    borderRadius: '6px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '3px',
                                                    border: '1px solid rgba(30, 215, 96, 0.3)'
                                                }}>
                                                    <Music size={10} color="#1ed760" />
                                                    <span style={{ fontSize: '0.6rem', color: '#1ed760', fontWeight: 800 }}>AUDIO</span>
                                                </div>
                                            )}
                                            {tpl.features.includes('photo') && (
                                                <div style={{
                                                    background: 'rgba(56, 189, 248, 0.15)',
                                                    padding: '4px 6px',
                                                    borderRadius: '6px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '3px',
                                                    border: '1px solid rgba(56, 189, 248, 0.3)'
                                                }}>
                                                    <ImageIcon size={10} color="#38bdf8" />
                                                    <span style={{ fontSize: '0.6rem', color: '#38bdf8', fontWeight: 800 }}>FOTO</span>
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                ));
                            })()}
                        </div>
                    </div>
                )}

                {/* --- STEP 1: CONFIGURARE --- */}
                {currentStep === 1 && (
                    <div className={`${styles.editorCard} ${styles.scrollArea}`} style={{ animation: 'slideInLeft 0.4s ease' }}>
                        <div className={styles.inputGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>TIP EVENIMENT</label>
                                <select className={styles.input} name="eventType" value={formData.eventType} onChange={handleChange}>
                                    <option value="nunta">Nuntă</option>
                                    <option value="botez">Botez</option>
                                    <option value="aniversare">Aniversare</option>
                                    <option value="petrecere">Petrecere</option>
                                </select>
                            </div>

                            {/* Custom Fields */}
                            <div className={`${styles.formGroup} ${styles.fullWidth}`} style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                                <label className={styles.label} style={{ color: 'var(--accent)', marginBottom: '15px', display: 'block' }}>CÂMPURI PERSONALIZATE (MAX 3)</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {formData.customFields.map((field, idx) => (
                                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '8px', alignItems: 'center' }}>
                                            <input
                                                className={styles.input}
                                                placeholder="Etichetă (ex: Nași)"
                                                value={field.label}
                                                onChange={(e) => handleCustomFieldChange(idx, 'label', e.target.value)}
                                            />
                                            <input
                                                className={styles.input}
                                                placeholder="Valoare"
                                                value={field.value}
                                                onChange={(e) => handleCustomFieldChange(idx, 'value', e.target.value)}
                                            />
                                            <button type="button" onClick={() => removeCustomField(idx)} style={{ background: 'rgba(255, 68, 68, 0.1)', border: 'none', color: '#ff4444', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    {formData.customFields.length < 3 && (
                                        <button type="button" onClick={addCustomField} className={styles.btnSecondary} style={{ width: '100%', border: '2px dashed rgba(255,255,255,0.1)', background: 'transparent' }}>
                                            <Plus size={18} /> ADAUGĂ CÂMP
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* CONFIGURARE MEDIA (FOTO/VIDEO/AUDIO) - Moved to bottom & Optional */}
                            {['story', 'netflix', 'chat', 'festival', 'vinyl', 'classic'].includes(selectedTemplate) && (
                                <div className={`${styles.formGroup} ${styles.fullWidth}`} style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                                    <details style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', overflow: 'hidden' }}>
                                        <summary style={{ padding: '15px', cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', color: 'var(--accent)' }}>
                                            <ImageIcon size={18} /> MEDIA & FIȘIERE (OPȚIONAL) <ChevronLeft size={16} style={{ transform: 'rotate(-90deg)', marginLeft: 'auto' }} />
                                        </summary>

                                        <div style={{ padding: '20px', paddingTop: '0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                            {/* FOTO MAIN / AVATAR */}
                                            <div className={styles.formGroup}>
                                                <ImageUploader
                                                    onUploadComplete={(url) => setFormData(prev => ({ ...prev, photoUrl: url }))}
                                                    currentUrl={formData.photoUrl}
                                                    onRemove={() => setFormData(prev => ({ ...prev, photoUrl: '' }))}
                                                    label={selectedTemplate === 'vinyl' ? 'COPERTĂ DISC (POZĂ)' :
                                                        selectedTemplate === 'chat' ? 'AVATAR CUPLU (POZĂ)' :
                                                            selectedTemplate === 'story' ? 'FOTO FUNDAL (dacă nu pui video)' : 'POZĂ PRINCIPALĂ'}
                                                />
                                            </div>

                                            {/* VIDEO */}
                                            {['story', 'netflix'].includes(selectedTemplate) && (
                                                <div className={styles.formGroup}>
                                                    <MediaUploader
                                                        type="video"
                                                        onUploadComplete={(url) => setFormData(prev => ({ ...prev, videoUrl: url }))}
                                                        currentUrl={formData.videoUrl}
                                                        onRemove={() => setFormData(prev => ({ ...prev, videoUrl: '' }))}
                                                    />
                                                </div>
                                            )}

                                            {/* AUDIO */}
                                            {['vinyl', 'festival', 'chat'].includes(selectedTemplate) && (
                                                <div className={styles.formGroup}>
                                                    <MediaUploader
                                                        type="audio"
                                                        onUploadComplete={(url) => setFormData(prev => ({ ...prev, audioUrl: url }))}
                                                        currentUrl={formData.audioUrl}
                                                        onRemove={() => setFormData(prev => ({ ...prev, audioUrl: '' }))}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </details>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* --- STEP 2: PLATA --- */}
                {currentStep === 2 && (
                    <div className={`${styles.editorCard} ${styles.scrollArea}`} style={{ animation: 'slideInLeft 0.4s ease' }}>
                        {status === 'unauthenticated' ? (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <Lock size={32} color="var(--accent)" style={{ marginBottom: '10px' }} />
                                <h3>Autentificare Necesara</h3>
                                <p style={{ color: '#888', fontSize: '0.9rem' }}>Conectează-te pentru a salva invitația.</p>
                                <button onClick={() => setAuthMode('login')} className={styles.btnGenerate} style={{ width: '100%', marginTop: '20px' }}>LOGHEAZĂ-TE</button>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center' }}>
                                <Zap size={32} color="var(--accent)" style={{ marginBottom: '10px' }} />
                                <h3>Finalizare Invitație</h3>
                                <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '20px' }}>Activează invitația ta premium și trimite-o oaspeților.</p>
                                <button onClick={() => handleSave(true)} className={styles.btnGenerate} style={{ width: '100%' }}>
                                    {isSaving ? 'SE PROCESEAZĂ...' : 'ACTIVEAZĂ PROFESIONAL (20€)'}
                                </button>
                                <button onClick={() => handleSave(false)} className={styles.btnSecondary} style={{ width: '100%', marginTop: '10px' }}>
                                    SALVEAZĂ CA DRAFT
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Footer Nav */}
                <div className={styles.cardFooter} style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                    <button onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))} disabled={currentStep === 0} className={styles.btnSecondary}>Înapoi</button>
                    {currentStep < steps.length - 1 && (
                        <button onClick={() => setCurrentStep(prev => prev + 1)} className={styles.btnGenerate}>Pasul Următor</button>
                    )}
                </div>
            </div>

            {/* Right Side: Preview */}
            <div className={styles.previewSection}>
                {/* Switcher */}
                <div className={styles.previewSwitcher}>
                    <button
                        className={`${styles.switchBtn} ${previewMode === 'pc' ? styles.activeSwitch : ''}`}
                        onClick={() => setPreviewMode('pc')}
                    >
                        <Monitor size={18} />
                    </button>
                    <button
                        className={`${styles.switchBtn} ${previewMode === 'mobile' ? styles.activeSwitch : ''}`}
                        onClick={() => setPreviewMode('mobile')}
                    >
                        <Smartphone size={18} />
                    </button>
                </div>

                <div className={`${styles.previewContainer} ${previewMode === 'mobile' ? styles.mobileMode : styles.pcMode}`}>
                    {previewMode === 'mobile' ? (
                        <div className={styles.phoneFrame}>
                            <div className={styles.statusBar}>
                                <div className={styles.time}>{currentTime}</div>
                                <div className={styles.statusIcons}>
                                    <Search size={12} strokeWidth={3} />
                                    <div style={{ display: 'flex', gap: '2px' }}>
                                        <div style={{ width: '2px', height: '4px', background: '#fff' }}></div>
                                        <div style={{ width: '2px', height: '6px', background: '#fff' }}></div>
                                        <div style={{ width: '2px', height: '8px', background: '#fff' }}></div>
                                        <div style={{ width: '2px', height: '10px', background: 'rgba(255,255,255,0.3)' }}></div>
                                    </div>
                                    <div style={{ width: '18px', height: '9px', border: '1px solid #fff', borderRadius: '2px', position: 'relative', display: 'flex', alignItems: 'center', padding: '1px' }}>
                                        <div style={{ width: '80%', height: '100%', background: '#fff', borderRadius: '1px' }}></div>
                                        <div style={{ position: 'absolute', right: '-3px', width: '2px', height: '4px', background: '#fff', borderRadius: '0 1px 1px 0' }}></div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.homeBar}></div>
                            <div className={`${styles.phoneInner} ${['classic', 'classic-gold', 'classic-minimal', 'envelope', 'vinyl', 'scratch', 'vip', 'passport'].includes(selectedTemplate) ? styles.centeredScaler : ''}`}>
                                <div className={styles.scalerContent}>
                                    {selectedTemplate === 'classic' && <ClassicTemplate {...formData} eventType={formData.eventType} />}
                                    {selectedTemplate === 'classic-gold' && <ClassicGoldTemplate {...formData} eventType={formData.eventType} />}
                                    {selectedTemplate === 'classic-minimal' && <ClassicMinimalTemplate {...formData} eventType={formData.eventType} />}
                                    {selectedTemplate === 'envelope' && <EnvelopeTemplate {...formData} eventType={formData.eventType} />}
                                    {selectedTemplate === 'netflix' && <NetflixTemplate {...formData} eventType={formData.eventType} />}
                                    {selectedTemplate === 'boarding' && <BoardingPassTemplate {...formData} eventType={formData.eventType} />}
                                    {selectedTemplate === 'vinyl' && <VinylTemplate {...formData} eventType={formData.eventType} />}
                                    {selectedTemplate === 'scratch' && <ScratchTemplate {...formData} eventType={formData.eventType} />}
                                    {selectedTemplate === 'passport' && <PassportTemplate {...formData} eventType={formData.eventType} />}
                                    {selectedTemplate === 'news' && <NewspaperTemplate {...formData} eventType={formData.eventType} />}
                                    {selectedTemplate === 'cinema' && <CinemaTemplate {...formData} eventType={formData.eventType} />}
                                    {selectedTemplate === 'festival' && <FestivalTemplate {...formData} eventType={formData.eventType} />}
                                    {selectedTemplate === 'vip' && <VipCardTemplate {...formData} eventType={formData.eventType} />}
                                    {selectedTemplate === 'story' && <StoryTemplate {...formData} eventType={formData.eventType} />}
                                    {selectedTemplate === 'chat' && <ChatTemplate {...formData} eventType={formData.eventType} />}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.pcMockup}>
                            <div className={styles.pcBrowserHeader}>
                                <div className={styles.dot}></div>
                                <div className={styles.dot}></div>
                                <div className={styles.dot}></div>
                            </div>
                            <div className={`${styles.pcContent} ${['classic', 'classic-gold', 'classic-minimal', 'envelope', 'vinyl', 'scratch', 'vip', 'passport'].includes(selectedTemplate) ? styles.centeredScaler : ''}`}>
                                <div className={styles.pcInner}>
                                    <div className={styles.scalerContent}>
                                        {selectedTemplate === 'classic' && <ClassicTemplate {...formData} eventType={formData.eventType} />}
                                        {selectedTemplate === 'classic-gold' && <ClassicGoldTemplate {...formData} eventType={formData.eventType} />}
                                        {selectedTemplate === 'classic-minimal' && <ClassicMinimalTemplate {...formData} eventType={formData.eventType} />}
                                        {selectedTemplate === 'envelope' && <EnvelopeTemplate {...formData} eventType={formData.eventType} />}
                                        {selectedTemplate === 'netflix' && <NetflixTemplate {...formData} eventType={formData.eventType} />}
                                        {selectedTemplate === 'boarding' && <BoardingPassTemplate {...formData} eventType={formData.eventType} />}
                                        {selectedTemplate === 'vinyl' && <VinylTemplate {...formData} eventType={formData.eventType} />}
                                        {selectedTemplate === 'scratch' && <ScratchTemplate {...formData} eventType={formData.eventType} />}
                                        {selectedTemplate === 'passport' && <PassportTemplate {...formData} eventType={formData.eventType} />}
                                        {selectedTemplate === 'news' && <NewspaperTemplate {...formData} eventType={formData.eventType} />}
                                        {selectedTemplate === 'cinema' && <CinemaTemplate {...formData} eventType={formData.eventType} />}
                                        {selectedTemplate === 'festival' && <FestivalTemplate {...formData} eventType={formData.eventType} />}
                                        {selectedTemplate === 'vip' && <VipCardTemplate {...formData} eventType={formData.eventType} />}
                                        {selectedTemplate === 'story' && <StoryTemplate {...formData} eventType={formData.eventType} />}
                                        {selectedTemplate === 'chat' && <ChatTemplate {...formData} eventType={formData.eventType} />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function CreateEvent() {
    return (
        <Suspense fallback={<div className="p-20 text-white">Loading...</div>}>
            <CreateEventContent />
        </Suspense>
    )
}
