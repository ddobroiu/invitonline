'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
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
import { Save, Zap, ChevronLeft, Palette, Info, ClipboardList, Settings2, Trash2, Plus, Heart, Baby, PartyPopper, Calendar, MapPin, Eye, Users, CheckCircle, Lock, Link as LinkIcon, Globe, Music, Film, Ticket, Receipt, CreditCard, Loader2, Building, Search } from 'lucide-react'
import LocationPicker from '@/components/LocationPicker'
import MediaUploader from '@/components/MediaUploader'
import ImageUploader from '@/components/ImageUploader'
import { signIn } from 'next-auth/react'
import BillingPanel from '@/components/dashboard/BillingPanel'

interface UserBilling {
    companyName?: string;
    cui?: string;
    regCom?: string;
    address?: string;
    city?: string;
    county?: string;
}

export default function CreateEvent() {
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



    // State for selected template
    const [selectedTemplate, setSelectedTemplate] = useState<'envelope' | 'netflix' | 'boarding' | 'vinyl' | 'scratch' | 'passport' | 'news' | 'cinema' | 'festival' | 'vip' | 'story'>('envelope')
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
                    <div className={styles.editorCard} style={{ animation: 'slideInLeft 0.4s ease' }}>
                        <label className={styles.label} style={{ marginBottom: '1.2rem', display: 'block' }}>ALEGE DESIGN-UL PREFERAT</label>
                        <div className={styles.templateGrid}>
                            <button
                                onClick={() => setSelectedTemplate('envelope')}
                                className={`${styles.templateBtn} ${selectedTemplate === 'envelope' ? styles.activeTemplate : ''}`}
                            >
                                <span style={{ fontSize: '1.5rem' }}>✉️</span>
                                Plic 3D
                            </button>
                            <button
                                onClick={() => setSelectedTemplate('netflix')}
                                className={`${styles.templateBtn} ${selectedTemplate === 'netflix' ? styles.activeTemplate : ''}`}
                            >
                                <span style={{ fontSize: '1.5rem' }}>🎬</span>
                                Netflix
                            </button>
                            <button
                                onClick={() => setSelectedTemplate('boarding')}
                                className={`${styles.templateBtn} ${selectedTemplate === 'boarding' ? styles.activeTemplate : ''}`}
                            >
                                <span style={{ fontSize: '1.5rem' }}>✈️</span>
                                Avion
                            </button>
                            <button
                                onClick={() => setSelectedTemplate('vinyl')}
                                className={`${styles.templateBtn} ${selectedTemplate === 'vinyl' ? styles.activeTemplate : ''}`}
                            >
                                <span style={{ fontSize: '1.5rem' }}>💿</span>
                                Vinyl
                            </button>
                            <button
                                onClick={() => setSelectedTemplate('scratch')}
                                className={`${styles.templateBtn} ${selectedTemplate === 'scratch' ? styles.activeTemplate : ''}`}
                            >
                                <span style={{ fontSize: '1.5rem' }}>🎫</span>
                                Scratch
                            </button>
                            <button
                                onClick={() => setSelectedTemplate('passport')}
                                className={`${styles.templateBtn} ${selectedTemplate === 'passport' ? styles.activeTemplate : ''}`}
                            >
                                <span style={{ fontSize: '1.5rem' }}>🛂</span>
                                Pașaport
                            </button>
                            <button
                                onClick={() => setSelectedTemplate('news')}
                                className={`${styles.templateBtn} ${selectedTemplate === 'news' ? styles.activeTemplate : ''}`}
                            >
                                <span style={{ fontSize: '1.5rem' }}>📰</span>
                                Ziar Vintage
                            </button>
                            <button
                                onClick={() => setSelectedTemplate('cinema')}
                                className={`${styles.templateBtn} ${selectedTemplate === 'cinema' ? styles.activeTemplate : ''}`}
                            >
                                <span style={{ fontSize: '1.5rem' }}>🎬</span>
                                Poster Film
                            </button>
                            <button
                                onClick={() => setSelectedTemplate('festival')}
                                className={`${styles.templateBtn} ${selectedTemplate === 'festival' ? styles.activeTemplate : ''}`}
                            >
                                <span style={{ fontSize: '1.5rem' }}>🎡</span>
                                Festival
                            </button>
                            <button
                                onClick={() => setSelectedTemplate('vip')}
                                className={`${styles.templateBtn} ${selectedTemplate === 'vip' ? styles.activeTemplate : ''}`}
                            >
                                <span style={{ fontSize: '1.5rem' }}>💳</span>
                                VIP Card
                            </button>
                            <button
                                onClick={() => setSelectedTemplate('story')}
                                className={`${styles.templateBtn} ${selectedTemplate === 'story' ? styles.activeTemplate : ''}`}
                            >
                                <span style={{ fontSize: '1.5rem' }}>📱</span>
                                Insta Story
                            </button>
                        </div>
                    </div>
                )}

                {/* --- STEP 1: CONFIGURARE (Merged Info & Details) --- */}
                {currentStep === 1 && (
                    <div className={styles.editorCard} style={{ animation: 'slideInLeft 0.4s ease' }}>
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
                                <input className={styles.input} name="title" value={formData.title} onChange={handleChange} style={{ fontSize: '1.2rem', padding: '1.3rem' }} />

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
                                <textarea className={styles.input} name="message" value={formData.message} onChange={handleChange} rows={2} style={{ fontSize: '1.1rem', padding: '1.2rem' }} />

                            </div>

                            {/* Removed old static fields. Use the custom fields below for family details. */}


                            {/* Dynamic Custom Fields */}
                            <div className={`${styles.formGroup} ${styles.fullWidth}`} style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <label className={styles.label} style={{ color: 'var(--accent)', margin: 0 }}>CÂMPURI PERSONALIZATE (MAX 3)</label>
                                    {formData.customFields.length < 3 && (
                                        <button
                                            type="button"
                                            onClick={addCustomField}
                                            style={{
                                                background: 'rgba(212, 175, 55, 0.1)',
                                                color: 'var(--accent)',
                                                border: '1px solid var(--accent)',
                                                borderRadius: '50%',
                                                width: '28px',
                                                height: '28px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(212, 175, 55, 0.2)'}
                                            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)'}
                                        >
                                            <Plus size={16} />
                                        </button>
                                    )}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {formData.customFields.map((field, idx) => (
                                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '8px', alignItems: 'center' }}>
                                            <input
                                                className={styles.input}
                                                placeholder="Etichetă (ex: Nași)"
                                                style={{ padding: '0.9rem', fontSize: '0.9rem' }}
                                                value={field.label}
                                                onChange={(e) => handleCustomFieldChange(idx, 'label', e.target.value)}
                                            />
                                            <input
                                                className={styles.input}
                                                placeholder="Valoare (ex: Maria & Ion)"
                                                style={{ padding: '0.9rem', fontSize: '0.9rem' }}
                                                value={field.value}
                                                onChange={(e) => handleCustomFieldChange(idx, 'value', e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeCustomField(idx)}
                                                style={{
                                                    background: 'rgba(255, 68, 68, 0.1)',
                                                    border: 'none',
                                                    color: '#ff4444',
                                                    cursor: 'pointer',
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}

                                    {formData.customFields.length === 0 && (
                                        <p style={{ fontSize: '0.8rem', color: '#666', fontStyle: 'italic' }}>
                                            Apasă pe butonul + pentru a adăuga câmpuri speciale (ex: Nași, Părinți, Dress Code).
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Media Upload Section - Only for Netflix and Vinyl */}
                            {(selectedTemplate === 'netflix' || selectedTemplate === 'vinyl' || selectedTemplate === 'festival' || selectedTemplate === 'story') && (
                                <div className={`${styles.formGroup} ${styles.fullWidth}`} style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                                    <label className={styles.label} style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>
                                        {selectedTemplate === 'netflix' ? '🎬 MEDIA PENTRU NETFLIX' :
                                            selectedTemplate === 'festival' ? '🎵 MEDIA PENTRU FESTIVAL' :
                                                selectedTemplate === 'story' ? '🎥 VIDEO PENTRU STORY' : '🎵 MEDIA PENTRU VINYL'}
                                    </label>
                                    <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '1rem' }}>
                                        {selectedTemplate === 'netflix'
                                            ? 'Încarcă un video care va fi afișat în invitația ta Netflix (opțional)'
                                            : selectedTemplate === 'story' ? 'Încarcă un video vertical pentru fundal'
                                                : 'Încarcă un fișier audio care va fi redat în invitația ta (opțional)'}
                                    </p>

                                    {(selectedTemplate === 'netflix' || selectedTemplate === 'story') && (
                                        <MediaUploader
                                            type="video"
                                            currentUrl={formData.videoUrl}
                                            onUploadComplete={(url) => setFormData(prev => ({ ...prev, videoUrl: url }))}
                                            onRemove={() => setFormData(prev => ({ ...prev, videoUrl: '' }))}
                                        />
                                    )}

                                    {(selectedTemplate === 'vinyl' || selectedTemplate === 'festival') && (
                                        <MediaUploader
                                            type="audio"
                                            currentUrl={formData.audioUrl}
                                            onUploadComplete={(url) => setFormData(prev => ({ ...prev, audioUrl: url }))}
                                            onRemove={() => setFormData(prev => ({ ...prev, audioUrl: '' }))}
                                        />
                                    )}
                                </div>
                            )}

                            {/* Image Upload Section */}
                            {(selectedTemplate === 'passport' || selectedTemplate === 'news' || selectedTemplate === 'cinema' || selectedTemplate === 'scratch' || selectedTemplate === 'vip' || selectedTemplate === 'story') && (
                                <div className={`${styles.formGroup} ${styles.fullWidth}`} style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                                    <label className={styles.label} style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>
                                        📸 FOTOGRAFIE PERSONALIZATĂ
                                    </label>
                                    <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '1rem' }}>
                                        {selectedTemplate === 'passport' ? 'Încarcă o fotografie care va apărea în zona de fotografie a pașaportului' :
                                            selectedTemplate === 'news' ? 'Încarcă o fotografie care va apărea în articolul de ziar' :
                                                selectedTemplate === 'cinema' ? 'Încarcă o imagine pentru posterul filmului' :
                                                    selectedTemplate === 'vip' ? 'Încarcă o imagine care va apărea ca fundal pe cardul VIP' :
                                                        selectedTemplate === 'story' ? 'Încarcă o imagine de fundal (dacă nu ai video)' :
                                                            'Încarcă o imagine care va apărea sub zona răzuibilă ca surpriză'}
                                    </p>

                                    <ImageUploader
                                        currentUrl={formData.photoUrl}
                                        onUploadComplete={(url) => setFormData(prev => ({ ...prev, photoUrl: url }))}
                                        onRemove={() => setFormData(prev => ({ ...prev, photoUrl: '' }))}
                                        label={
                                            selectedTemplate === 'passport' ? 'Fotografie Pașaport' :
                                                selectedTemplate === 'news' ? 'Fotografie Articol' :
                                                    selectedTemplate === 'cinema' ? 'Poster Film' :
                                                        selectedTemplate === 'vip' ? 'Fundal Card' :
                                                            selectedTemplate === 'story' ? 'Fundal Foto' : 'Premiu Ascuns'
                                        }
                                    />
                                </div>
                            )}

                        </div>
                    </div>
                )}


                {/* --- STEP 2: EXTRA & SAVE --- */}
                {currentStep === 2 && (
                    <div className={styles.editorCard} style={{ animation: 'slideInLeft 0.4s ease' }}>

                        {/* 1. AUTH GATE */}
                        {status === 'unauthenticated' && (
                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                                    <Lock size={32} color="var(--accent)" style={{ marginBottom: '10px' }} />
                                    <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: '#fff' }}>1. Autentificare</h2>
                                    <p style={{ fontSize: '0.9rem', color: '#888', marginTop: '5px' }}>Pentru a salva invitația ta premium</p>
                                </div>

                                {authError && <div style={{ color: '#ff4444', fontSize: '0.8rem', textAlign: 'center', marginBottom: '10px' }}>{authError}</div>}

                                <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {authMode === 'register' && (
                                        <input
                                            className={styles.input}
                                            placeholder="Nume Complet"
                                            value={authData.name}
                                            onChange={e => setAuthData({ ...authData, name: e.target.value })}
                                            required
                                        />
                                    )}
                                    <input
                                        className={styles.input}
                                        type="email"
                                        placeholder="Email"
                                        value={authData.email}
                                        onChange={e => setAuthData({ ...authData, email: e.target.value })}
                                        required
                                    />
                                    <input
                                        className={styles.input}
                                        type="password"
                                        placeholder="Parolă"
                                        value={authData.password}
                                        onChange={e => setAuthData({ ...authData, password: e.target.value })}
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={isAuthLoading}
                                        style={{ background: 'var(--accent)', color: 'black', padding: '12px', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px' }}
                                    >
                                        {isAuthLoading ? 'Se procesează...' : (authMode === 'login' ? 'Intră în Cont' : 'Creează Cont')}
                                    </button>
                                </form>

                                <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: '#888' }}>
                                    {authMode === 'login' ? 'Nu ai cont?' : 'Ai deja cont?'}
                                    <span
                                        onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                                        style={{ color: 'var(--accent)', cursor: 'pointer', marginLeft: '5px', fontWeight: 'bold' }}
                                    >
                                        {authMode === 'login' ? 'Înregistrează-te' : 'Autentifică-te'}
                                    </span>
                                </div>

                                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '20px', paddingTop: '15px' }}>
                                    <button
                                        onClick={() => handleSave(false)}
                                        className={styles.btnSecondary}
                                        style={{ width: '100%', fontSize: '0.8rem' }}
                                    >
                                        Salvează local și continuă mai târziu
                                    </button>
                                </div>
                            </div>
                        )}



                        {/* 2. BILLING GATE (If logged in but info missing) */}
                        {status === 'authenticated' && !isFetchingBilling && !userBilling?.companyName && (
                            <div style={{ padding: '0', borderRadius: '24px' }}>
                                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                    <Receipt size={32} color="var(--accent)" style={{ marginBottom: '10px' }} />
                                    <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: '#fff' }}>2. Date de Facturare</h2>
                                    <p style={{ fontSize: '0.9rem', color: '#888', marginTop: '5px' }}>Neceseare pentru a genera factura fiscală</p>
                                </div>
                                <BillingPanel
                                    hideHistory={true}
                                    hideStatus={true}
                                    onSaveSuccess={() => {
                                        fetchBilling();
                                        handleSave(true);
                                    }}
                                    buttonText="Activează Invitația - 20€ (Stripe)"
                                />
                                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                                    <button
                                        onClick={() => handleSave(false)}
                                        className={styles.btnSecondary}
                                    >
                                        <Save size={16} /> Salvează ca Draft
                                    </button>
                                </div>
                            </div>
                        )}





                        {/* 3. FINAL ACTIONS (Only if billing is complete) */}
                        {status === 'authenticated' && !isFetchingBilling && userBilling?.companyName && (
                            <>
                                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                    <Zap size={32} color="var(--accent)" style={{ marginBottom: '10px' }} />
                                    <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: '#fff' }}>3. Finalizare & Activare</h2>
                                    <p style={{ fontSize: '0.9rem', color: '#888', marginTop: '5px' }}>Lansează-ți invitația către oaspeți</p>
                                </div>

                                <div className={styles.formGroup} style={{ marginBottom: '1.5rem' }}>
                                    <label className={styles.label}>DRESS CODE (OPȚIONAL)</label>
                                    <input className={styles.input} name="dressCode" value={formData.dressCode} onChange={handleChange} placeholder="Ex: Black Tie" />
                                </div>

                                {(formData.eventType === 'aniversare' || formData.eventType === 'petrecere') && (
                                    <div className={styles.inputGrid}>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Vârstă</label>
                                            <input className={styles.input} name="age" value={formData.age} onChange={handleChange} />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Tematică</label>
                                            <input className={styles.input} name="theme" value={formData.theme} onChange={handleChange} />
                                        </div>
                                    </div>
                                )}

                                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '15px', marginTop: '1rem' }}>
                                    <button
                                        className={styles.btnSecondary}
                                        onClick={() => handleSave(false)}
                                        disabled={isSaving}
                                    >
                                        {isSaving ? 'SALVARE...' : <><Save size={18} /> SALVEAZĂ DRAFT</>}
                                    </button>
                                    <button
                                        className={styles.btnGenerate}
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: 0 }}
                                        onClick={() => handleSave(true)}
                                        disabled={isSaving}
                                    >
                                        {isSaving ? 'SE PROCESEAZĂ...' : <><Zap size={18} /> ACTIVARE PRO (STRIPE)</>}
                                    </button>
                                </div>

                                <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#555', marginTop: '15px' }}>
                                    * Activarea include găzduire nelimitată, link personalizat și confirmări în timp real.
                                </p>
                            </>
                        )}


                        {status === 'authenticated' && isFetchingBilling && (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <Loader2 className="animate-spin" size={32} color="var(--accent)" />
                                <p style={{ marginTop: '10px', color: '#888' }}>Se verifică datele tale...</p>
                            </div>
                        )}
                    </div>
                )
                }


                {/* Navigation Buttons Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '1rem' }}>
                    <button
                        onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                        disabled={currentStep === 0}
                        style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #333', borderRadius: '10px', color: '#888', cursor: 'pointer', opacity: currentStep === 0 ? 0.3 : 1 }}
                    >
                        Înapoi
                    </button>
                    {currentStep < steps.length - 1 && (
                        <button
                            onClick={() => setCurrentStep(prev => prev + 1)}
                            style={{ padding: '10px 30px', background: 'var(--accent)', border: 'none', borderRadius: '10px', color: 'black', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                            Pasul Următor
                        </button>
                    )}
                </div>
            </div >

            {/* Right Side: Live Preview */}
            < div className={styles.previewSection} >
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
            </div >
        </div >
    )
}
