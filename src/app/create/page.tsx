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
import StoryTemplate from '@/components/templates/StoryTemplate'
import ChatTemplate from '@/components/templates/ChatTemplate'
import { Save, Zap, ChevronLeft, Palette, Info, ClipboardList, Settings2, Trash2, Plus, Heart, Baby, PartyPopper, Calendar, MapPin, Music, Video, Image as ImageIcon, Loader2, Building, Search, Monitor, Smartphone, Lock, Receipt, CreditCard } from 'lucide-react'
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
    const [selectedTemplate, setSelectedTemplate] = useState<'envelope' | 'netflix' | 'boarding' | 'vinyl' | 'scratch' | 'passport' | 'news' | 'cinema' | 'festival' | 'vip' | 'story' | 'chat'>(() => {
        const t = searchParams.get('template')
        const valid = ['envelope', 'netflix', 'boarding', 'vinyl', 'scratch', 'passport', 'news', 'cinema', 'festival', 'vip', 'story', 'chat']
        return (valid.includes(t || '') ? t : 'envelope') as any
    })

    const [previewMode, setPreviewMode] = useState<'pc' | 'mobile'>('pc')
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

    return (
        <div className={styles.container}>
            {/* Left Side: Editor */}
            <div className={styles.editorSection}>
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
                            <button
                                onClick={() => setSelectedTemplate('envelope')}
                                className={`${styles.templateBtn} ${selectedTemplate === 'envelope' ? styles.activeTemplate : ''}`}
                            >
                                <span style={{ fontSize: '1.2rem' }}>💌</span>
                                Plic 3D
                            </button>
                            <button
                                onClick={() => setSelectedTemplate('netflix')}
                                className={`${styles.templateBtn} ${selectedTemplate === 'netflix' ? styles.activeTemplate : ''}`}
                            >
                                <span style={{ fontSize: '1.2rem' }}>🎬</span>
                                Netflix
                            </button>
                            <button
                                onClick={() => setSelectedTemplate('boarding')}
                                className={`${styles.templateBtn} ${selectedTemplate === 'boarding' ? styles.activeTemplate : ''}`}
                            >
                                <span style={{ fontSize: '1.2rem' }}>✈️</span>
                                Avion
                            </button>
                            <button
                                onClick={() => setSelectedTemplate('vinyl')}
                                className={`${styles.templateBtn} ${selectedTemplate === 'vinyl' ? styles.activeTemplate : ''}`}
                            >
                                <span style={{ fontSize: '1.2rem' }}>💿</span>
                                Vinyl
                            </button>
                            <button
                                onClick={() => setSelectedTemplate('scratch')}
                                className={`${styles.templateBtn} ${selectedTemplate === 'scratch' ? styles.activeTemplate : ''}`}
                            >
                                <span style={{ fontSize: '1.2rem' }}>🎫</span>
                                Scratch
                            </button>
                            <button
                                onClick={() => setSelectedTemplate('passport')}
                                className={`${styles.templateBtn} ${selectedTemplate === 'passport' ? styles.activeTemplate : ''}`}
                            >
                                <span style={{ fontSize: '1.2rem' }}>🛂</span>
                                Pașaport
                            </button>
                            <button
                                onClick={() => setSelectedTemplate('news')}
                                className={`${styles.templateBtn} ${selectedTemplate === 'news' ? styles.activeTemplate : ''}`}
                            >
                                <span style={{ fontSize: '1.2rem' }}>📰</span>
                                Ziar
                            </button>
                            <button
                                onClick={() => setSelectedTemplate('cinema')}
                                className={`${styles.templateBtn} ${selectedTemplate === 'cinema' ? styles.activeTemplate : ''}`}
                            >
                                <span style={{ fontSize: '1.2rem' }}>🎬</span>
                                Cinema
                            </button>
                            <button
                                onClick={() => setSelectedTemplate('festival')}
                                className={`${styles.templateBtn} ${selectedTemplate === 'festival' ? styles.activeTemplate : ''}`}
                            >
                                <span style={{ fontSize: '1.2rem' }}>🎡</span>
                                Festival
                            </button>
                            <button
                                onClick={() => setSelectedTemplate('vip')}
                                className={`${styles.templateBtn} ${selectedTemplate === 'vip' ? styles.activeTemplate : ''}`}
                            >
                                <span style={{ fontSize: '1.2rem' }}>💳</span>
                                VIP Card
                            </button>
                            <button
                                onClick={() => setSelectedTemplate('story')}
                                className={`${styles.templateBtn} ${selectedTemplate === 'story' ? styles.activeTemplate : ''}`}
                            >
                                <span style={{ fontSize: '1.2rem' }}>📱</span>
                                Story
                            </button>
                            <button
                                onClick={() => setSelectedTemplate('chat')}
                                className={`${styles.templateBtn} ${selectedTemplate === 'chat' ? styles.activeTemplate : ''}`}
                            >
                                <span style={{ fontSize: '1.2rem' }}>💬</span>
                                Chat
                            </button>
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
                            <div className={styles.formGroup}>
                                <label className={styles.label}>DATA</label>
                                <input className={styles.input} name="date" value={formData.date} onChange={handleChange} placeholder="Ex: 15 Iunie" />
                            </div>
                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label className={styles.label}>TITLU / NUME</label>
                                <input className={styles.input} name="title" value={formData.title} onChange={handleChange} />
                            </div>
                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label className={styles.label}>LOCAȚIE (GOOGLE MAPS)</label>
                                <LocationPicker
                                    initialValue={formData.location}
                                    onLocationSelect={(address: string, url: string) => {
                                        setFormData(prev => ({ ...prev, location: address, locationUrl: url }))
                                    }}
                                />
                            </div>
                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label className={styles.label}>MESAJ PERSONALIZAT</label>
                                <textarea className={styles.input} name="message" value={formData.message} onChange={handleChange} rows={2} />
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
                            <div className={styles.phoneInner}>
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
                    ) : (
                        <div className={styles.pcMockup}>
                            <div className={styles.pcBrowserHeader}>
                                <div className={styles.dot}></div>
                                <div className={styles.dot}></div>
                                <div className={styles.dot}></div>
                            </div>
                            <div className={styles.pcContent}>
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
