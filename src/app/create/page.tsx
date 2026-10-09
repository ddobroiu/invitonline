'use client'

import { useState, useEffect, Suspense, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession, signIn } from 'next-auth/react'
import styles from './page.module.css'
import TemplateRenderer, { CENTERED_TEMPLATES } from '@/components/TemplateRenderer'
import PreviewViewport from '@/components/PreviewViewport'
import { TEMPLATES as CATALOGUE, DEFAULT_TEMPLATE, EVENT_TYPES, isEventType, TEMPLATE_THEMES, getTemplateTheme, type TemplateTheme } from '@/config/templates'
import LocationPicker from '@/components/LocationPicker'
import MediaUploader from '@/components/MediaUploader'
import ImageUploader from '@/components/ImageUploader'
import CheckoutConsent, { CHECKOUT_CONSENT_REQUIRED } from '@/components/legal/CheckoutConsent'
import RegisterTermsConsent from '@/components/legal/RegisterTermsConsent'
import RegisterMarketingNotice from '@/components/legal/RegisterMarketingNotice'
import GoogleSignInButton from '@/components/auth/GoogleSignInButton'
import { PRICE_NOTE } from '@/config/legal'
import { TIKTOK_CURRENCY, trackTikTok } from '@/lib/tiktok'
import { META_CONTENT_ID, META_CURRENCY, META_INVITATION_VALUE, trackMeta } from '@/lib/meta'
import { trackGa } from '@/lib/ga'
import { validateEvent, validateRegistration } from '@/lib/validation'
import {
    Zap, Palette, Info, Trash2, Plus, Music, Video, Image as ImageIcon, Monitor, Smartphone, Lock, CreditCard,
    MailOpen, Clapperboard, Plane, Disc, Ticket, Globe, Newspaper, Film, Tent, Crown, MessageCircle, Flower2, Gem,
    Minus, LayoutTemplate, SlidersHorizontal, Eye, X, Loader2, Check, ChevronLeft, ChevronRight
} from 'lucide-react'

type TemplateId = string

const LEGACY_TEMPLATES: { id: TemplateId, name: string, icon: React.ReactNode, features: ('photo' | 'video' | 'audio')[] }[] = [
    { id: 'classic', name: 'Classic Floral', icon: <Flower2 size={28} strokeWidth={1.5} />, features: ['photo'] },
    { id: 'classic-gold', name: 'Classic Gold', icon: <Gem size={28} strokeWidth={1.5} />, features: ['photo'] },
    { id: 'classic-minimal', name: 'Minimalist', icon: <Minus size={28} strokeWidth={1.5} />, features: ['photo'] },
    { id: 'envelope', name: 'Plic 3D', icon: <MailOpen size={28} strokeWidth={1.5} />, features: ['photo'] },
    { id: 'netflix', name: 'Netflix', icon: <Clapperboard size={28} strokeWidth={1.5} />, features: ['video', 'photo'] },
    { id: 'boarding', name: 'Avion', icon: <Plane size={28} strokeWidth={1.5} />, features: ['photo'] },
    { id: 'vinyl', name: 'Vinyl', icon: <Disc size={28} strokeWidth={1.5} />, features: ['audio', 'photo'] },
    { id: 'scratch', name: 'Scratch', icon: <Ticket size={28} strokeWidth={1.5} />, features: ['photo'] },
    { id: 'passport', name: 'Pașaport', icon: <Globe size={28} strokeWidth={1.5} />, features: ['photo'] },
    { id: 'news', name: 'Ziar', icon: <Newspaper size={28} strokeWidth={1.5} />, features: ['photo'] },
    { id: 'cinema', name: 'Cinema', icon: <Film size={28} strokeWidth={1.5} />, features: ['photo'] },
    { id: 'festival', name: 'Festival', icon: <Tent size={28} strokeWidth={1.5} />, features: ['audio', 'photo'] },
    { id: 'vip', name: 'VIP Card', icon: <Crown size={28} strokeWidth={1.5} />, features: ['photo'] },
    { id: 'story', name: 'Story', icon: <Smartphone size={28} strokeWidth={1.5} />, features: ['video', 'photo'] },
    { id: 'chat', name: 'Chat', icon: <MessageCircle size={28} strokeWidth={1.5} />, features: ['audio', 'photo'] },
]
const TEMPLATES = CATALOGUE.map(t => ({ ...t, icon: LEGACY_TEMPLATES.find(old => old.id === t.id)?.icon || <LayoutTemplate size={28} strokeWidth={1.5} /> }))
const TEMPLATE_IDS = TEMPLATES.map(t => t.id) as string[]

const DEFAULTS_BY_TYPE: Record<string, { title: string, message: string }> = {
    nunta: { title: 'Ana & Andrei', message: 'Te invităm să sărbătorești alături de noi începutul poveștii noastre.' },
    botez: { title: 'David', message: 'Vă invităm cu drag la botezul micuțului nostru.' },
    aniversare: { title: 'Alex - 30 de ani', message: 'Te invit să sărbătorim împreună o nouă aniversare!' },
    corporate: { title: 'Gala de excelență', message: 'Vă invităm la o seară dedicată ideilor și oamenilor care ne inspiră.' },
    petrecere: { title: 'Summer Party', message: 'Hai la o petrecere de neuitat!' },
}

const MONTHS = ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie']

function formatDate(iso: string) {
    const [y, m, d] = iso.split('-').map(Number)
    if (!y || !m || !d) return ''
    return `${d} ${MONTHS[m - 1]} ${y}`
}

const initialFormData = {
    eventType: 'nunta',
    title: 'Ana & Andrei',
    date: '',
    eventDateISO: '',
    location: 'Palatul Știrbei, Buftea',
    locationUrl: '',
    message: DEFAULTS_BY_TYPE.nunta.message,
    dressCode: '',
    specialInstructions: '',
    // Wedding
    brideName: 'Ana',
    groomName: 'Andrei',
    parentsBride: '',
    parentsGroom: '',
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
    churchTime: '',
    churchLoc: '',
    restaurantTime: '',
    restaurantLoc: '',
    // Birthday / party
    celebrantName: '',
    age: '',
    theme: '',
    host: '',
    // Media
    photoUrl: '',
    audioUrl: '',
    videoUrl: '',
    customFields: [] as { label: string, value: string }[],
}

type FormData = typeof initialFormData

const DRAFT_KEY = 'eventDraft'

const steps = [
    { name: 'Design', icon: <Palette size={16} /> },
    { name: 'Detalii', icon: <Info size={16} /> },
    { name: 'Extra', icon: <SlidersHorizontal size={16} /> },
    { name: 'Finalizare', icon: <CreditCard size={16} /> },
]

function Field({ label, children, full, hint, htmlFor }: { label: string, children: React.ReactNode, full?: boolean, hint?: string, htmlFor?: string }) {
    return (
        <div className={`${styles.formGroup} ${full ? styles.fullWidth : ''}`}>
            {htmlFor ? <label className={styles.label} htmlFor={htmlFor}>{label}</label> : <span className={styles.label}>{label}</span>}
            {children}
            {hint && <span className={styles.hint}>{hint}</span>}
        </div>
    )
}

function CreateEventContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { status } = useSession()

    const editId = searchParams.get('id')
    const [eventId, setEventId] = useState<string | null>(editId)
    const [isPaid, setIsPaid] = useState(false)
    const [formData, setFormData] = useState<FormData>(() => {
        const type = searchParams.get('tip')
        if (!isEventType(type)) return initialFormData
        return { ...initialFormData, eventType: type, ...(DEFAULTS_BY_TYPE[type] || {}), ...(type !== 'nunta' ? { brideName: '', groomName: '' } : {}) }
    })
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>(() => {
        const t = searchParams.get('template') || ''
        return (TEMPLATE_IDS.includes(t) ? t : DEFAULT_TEMPLATE) as TemplateId
    })
    const [titleTouched, setTitleTouched] = useState(false)
    const [templateTheme, setTemplateTheme] = useState<TemplateTheme | 'all'>('all')
    const [currentStep, setCurrentStep] = useState(0)
    const [previewMode, setPreviewMode] = useState<'pc' | 'mobile'>('mobile')
    const [showMobilePreview, setShowMobilePreview] = useState(false)
    const [isLoadingEvent, setIsLoadingEvent] = useState(!!editId)
    const [isSaving, setIsSaving] = useState(false)
    const [saveError, setSaveError] = useState('')
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [currentTime, setCurrentTime] = useState('')
    const hydrated = useRef(false)

    // Inline auth (final step)
    const [authMode, setAuthMode] = useState<'login' | 'register'>('register')
    const [authData, setAuthData] = useState({ email: '', password: '', name: '' })
    const [authError, setAuthError] = useState('')
    const [isAuthLoading, setIsAuthLoading] = useState(false)
    const [acceptTerms, setAcceptTerms] = useState(false)
    const [checkoutConsent, setCheckoutConsent] = useState(false)

    // Load the event being edited, or restore an unsaved draft
    useEffect(() => {
        if (editId) {
            if (status !== 'authenticated') {
                if (status === 'unauthenticated') router.push(`/login?callbackUrl=${encodeURIComponent(`/create?id=${editId}`)}`)
                return
            }
            fetch(`/api/events?id=${editId}`)
                .then(res => res.ok ? res.json() : Promise.reject(res))
                .then(({ event }) => {
                    const data = event.data || {}
                    setFormData(prev => ({
                        ...prev,
                        ...data,
                        eventType: event.type || data.eventType || 'nunta',
                        title: event.title || '',
                        date: event.date || '',
                        location: event.location || '',
                        locationUrl: event.locationUrl || '',
                        message: event.message || '',
                        customFields: Array.isArray(data.customFields) ? data.customFields : [],
                    }))
                    if (TEMPLATE_IDS.includes(event.template)) setSelectedTemplate(event.template)
                    setIsPaid(!!event.isPaid)
                    setTitleTouched(true)
                    setCurrentStep(1)
                })
                .catch(() => setSaveError('Nu am putut încărca invitația.'))
                .finally(() => {
                    setIsLoadingEvent(false)
                    hydrated.current = true
                })
            return
        }

        if (hydrated.current) return
        hydrated.current = true
        try {
            const raw = localStorage.getItem(DRAFT_KEY)
            if (raw) {
                const { template, ...draft } = JSON.parse(raw)
                setFormData(prev => ({ ...prev, ...draft }))
                setTitleTouched(true)
                if (!searchParams.get('template') && TEMPLATE_IDS.includes(template)) setSelectedTemplate(template)
                // Intoarcerea de la „Continuă cu Google”: direct la pasul final, cu ciorna restaurata
                if (searchParams.get('pas') === 'final') setCurrentStep(3)
            }
        } catch { /* ignore corrupt draft */ }
    }, [editId, status, router, searchParams])

    // Autosave draft locally while creating a new invitation
    useEffect(() => {
        if (eventId || !hydrated.current) return
        const t = setTimeout(() => {
            try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...formData, template: selectedTemplate })) } catch { /* storage full/blocked */ }
        }, 400)
        return () => clearTimeout(t)
    }, [formData, selectedTemplate, eventId])

    useEffect(() => {
        // Only switch when crossing the breakpoint, so a manual PC/phone choice survives other resizes
        let wasNarrow: boolean | null = null
        const checkWidth = () => {
            const narrow = window.innerWidth < 1100
            if (narrow !== wasNarrow) setPreviewMode(narrow ? 'mobile' : 'pc')
            wasNarrow = narrow
        }
        checkWidth()
        window.addEventListener('resize', checkWidth)
        return () => window.removeEventListener('resize', checkWidth)
    }, [])

    useEffect(() => {
        const updateTime = () => {
            const now = new Date()
            setCurrentTime(now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0'))
        }
        updateTime()
        const timer = setInterval(updateTime, 10000)
        return () => clearInterval(timer)
    }, [])

    // Lock page scroll while the mobile preview overlay is open
    useEffect(() => {
        document.body.style.overflow = showMobilePreview ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [showMobilePreview])

    // Keep ?template= in sync so a reload (or shared link) keeps the chosen design
    const selectTemplate = (id: TemplateId) => {
        setSelectedTemplate(id)
        if (!eventId) {
            const url = new URL(window.location.href)
            url.searchParams.set('template', id)
            window.history.replaceState(window.history.state, '', url.toString())
        }
    }

    const buildTitle = (d: FormData) => {
        if (d.eventType === 'nunta') {
            if (d.brideName || d.groomName) return `${d.brideName || 'Mireasa'} & ${d.groomName || 'Mirele'}`
        } else if (d.eventType === 'botez') {
            if (d.childName) return d.childName
        } else if (d.celebrantName) {
            return d.age ? `${d.celebrantName} - ${d.age} ani` : d.celebrantName
        }
        return d.title
    }

    const update = (patch: Partial<FormData>) => {
        setFormData(prev => {
            const next = { ...prev, ...patch }
            if (!titleTouched) next.title = buildTitle(next)
            return next
        })
        setErrors(prev => {
            const copy = { ...prev }
            Object.keys(patch).forEach(k => delete copy[k])
            return copy
        })
    }

    const changeField = (name: string, value: string) => {
        if (name === 'title') {
            setTitleTouched(true)
            setFormData(prev => ({ ...prev, title: value }))
            setErrors(prev => ({ ...prev, title: '' }))
            return
        }
        if (name === 'eventType') {
            const defaults = DEFAULTS_BY_TYPE[value] || DEFAULTS_BY_TYPE.nunta
            const isDefaultMessage = Object.values(DEFAULTS_BY_TYPE).some(d => d.message === formData.message)
            setTitleTouched(false)
            setFormData(prev => {
                const next = { ...prev, eventType: value, message: isDefaultMessage || !prev.message ? defaults.message : prev.message }
                next.title = buildTitle(next) === prev.title ? defaults.title : buildTitle(next)
                return next
            })
            return
        }
        update({ [name]: value } as Partial<FormData>)
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => changeField(e.target.name, e.target.value)

    const input = (name: keyof FormData, placeholder = '', type = 'text') => (
        <input
            id={`f-${name}`}
            className={`${styles.input} ${errors[name] ? styles.inputError : ''}`}
            aria-invalid={!!errors[name] || undefined}
            name={name}
            type={type}
            placeholder={placeholder}
            value={formData[name] as string}
            onChange={handleChange}
        />
    )

    const handleCustomFieldChange = (index: number, key: 'label' | 'value', value: string) => {
        setFormData(prev => {
            const newFields = [...prev.customFields]
            newFields[index] = { ...newFields[index], [key]: value }
            return { ...prev, customFields: newFields }
        })
    }

    const validate = () => {
        const errs = validateEvent({ ...formData, template: selectedTemplate })
        setErrors(errs)
        const ok = Object.keys(errs).length === 0
        if (!ok) {
            // Bring the first problem into view once the details step is rendered
            setTimeout(() => {
                const el = document.querySelector<HTMLElement>('[aria-invalid="true"]')
                el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                el?.focus({ preventScroll: true })
            }, 60)
        }
        return ok
    }

    const goToStep = (step: number) => {
        // Details must be valid before the final step
        if (step === 3 && !validate()) {
            setCurrentStep(1)
            return
        }
        setCurrentStep(step)
    }

    const handleSave = async (shouldPay: boolean) => {
        if (isSaving) return
        if (!validate()) {
            setCurrentStep(1)
            return
        }
        if (status !== 'authenticated') return
        if (shouldPay && !isPaid && !checkoutConsent) {
            setSaveError(CHECKOUT_CONSENT_REQUIRED)
            return
        }

        setIsSaving(true)
        setSaveError('')
        try {
            const res = await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    id: eventId || undefined,
                    template: selectedTemplate,
                    type: formData.eventType,
                })
            })

            const data = await res.json().catch(() => ({}))
            if (!res.ok) {
                if (data.errors) { setErrors(data.errors); setCurrentStep(1) }
                setSaveError(data.message || 'Eroare la salvarea invitației.')
                return
            }

            setEventId(data.event.id)
            try { localStorage.removeItem(DRAFT_KEY) } catch { /* ignore */ }

            if (shouldPay && !isPaid) {
                // TikTok InitiateCheckout (no-op without marketing consent)
                trackTikTok('InitiateCheckout', {
                    currency: TIKTOK_CURRENCY,
                    content_type: 'product',
                    contents: [{ content_id: 'invitatie_premium', content_name: 'Invitație premium', quantity: 1 }],
                })
                // Meta InitiateCheckout (no-op without marketing consent)
                trackMeta('InitiateCheckout', {
                    value: META_INVITATION_VALUE,
                    currency: META_CURRENCY,
                    content_ids: [META_CONTENT_ID],
                    content_type: 'product',
                    num_items: 1,
                })
                const checkoutRes = await fetch('/api/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ eventId: data.event.id, consent: checkoutConsent })
                })
                const checkout = await checkoutRes.json().catch(() => ({}))
                if (checkoutRes.ok && checkout.url) {
                    window.location.href = checkout.url
                    return
                }
                setSaveError(`${checkout.message || 'Plata nu a putut fi inițiată.'} Invitația a fost salvată ca draft în contul tău.`)
                return
            }

            router.push('/dashboard')
        } catch (error) {
            console.error(error)
            setSaveError('Eroare de rețea. Verifică conexiunea și încearcă din nou.')
        } finally {
            setIsSaving(false)
        }
    }

    const handleAuthSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (isAuthLoading) return
        if (authMode === 'register') {
            const message = validateRegistration({ ...authData, acceptTerms })
            if (message) { setAuthError(message); return }
        }
        setAuthError('')
        setIsAuthLoading(true)
        try {
            if (authMode === 'register') {
                const res = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...authData, acceptTerms })
                })
                const data = await res.json().catch(() => ({}))
                if (!res.ok) {
                    setAuthError(data.message || 'Eroare la înregistrare')
                    return
                }
                // Cont nou: GA4 sign_up + Meta CompleteRegistration (eventID reg_<userId>, ca la Conversions API)
                trackGa('sign_up', { method: 'email' })
                if (typeof data.userId === 'string') trackMeta('CompleteRegistration', { content_name: 'Cont InvitOnline', status: 'email' }, `reg_${data.userId}`)
            }
            const res = await signIn('credentials', { email: authData.email, password: authData.password, redirect: false })
            if (res?.error) setAuthError('Email sau parolă incorectă')
        } catch {
            setAuthError('Eroare de rețea. Încearcă din nou.')
        } finally {
            setIsAuthLoading(false)
        }
    }

    const template = TEMPLATES.find(t => t.id === selectedTemplate)!
    const previewProps = { ...formData, id: undefined }
    const isCentered = CENTERED_TEMPLATES.includes(selectedTemplate)

    const preview = (
        <TemplateRenderer key={selectedTemplate} template={selectedTemplate} {...previewProps} />
    )

    const phonePreview = (
        <div className={styles.phoneFrame}>
            <div className={styles.statusBar}>
                <div>{currentTime}</div>
                <div className={styles.statusIcons}>
                    <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end' }}>
                        {[4, 6, 8, 10].map((h, i) => <div key={h} style={{ width: '2px', height: `${h}px`, background: i === 3 ? 'rgba(255,255,255,0.3)' : '#fff' }} />)}
                    </div>
                    <div className={styles.battery}><div /></div>
                </div>
            </div>
            <div className={styles.homeBar}></div>
            <div className={`${styles.phoneInner} ${isCentered ? styles.centeredScaler : ''}`}>
                <PreviewViewport title="Invitația ta pe telefon">{preview}</PreviewViewport>
            </div>
        </div>
    )

    if (isLoadingEvent) {
        return (
            <div className={styles.loadingScreen}>
                <Loader2 className="animate-spin" size={32} color="var(--accent)" />
                <p>Se încarcă invitația...</p>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.editorSection}>
                <div className={styles.editorHeader}>
                    <div>
                        <h1 className={styles.title}>{eventId ? 'Editează invitația' : 'Creează invitația'}</h1>
                        <p className={styles.subtitle}>Model ales: <strong>{template.name}</strong></p>
                    </div>
                    <div className={styles.stepCounter}>PAS {currentStep + 1} / {steps.length}</div>
                </div>

                <div className={styles.stepNav}>
                    {steps.map((step, idx) => (
                        <button
                            type="button"
                            key={step.name}
                            className={`${styles.stepTab} ${currentStep === idx ? styles.activeTab : ''} ${idx < currentStep ? styles.doneTab : ''}`}
                            onClick={() => goToStep(idx)}
                        >
                            {idx < currentStep ? <Check size={16} /> : step.icon}
                            {step.name}
                        </button>
                    ))}
                </div>

                {/* STEP 0: DESIGN */}
                {currentStep === 0 && (
                    <div className={styles.editorCard}>
                        <h2 className={styles.cardTitle}>Alege designul preferat</h2>
                        <p className={styles.cardText}>Poți schimba modelul oricând — datele tale rămân.</p>
                        <div className={styles.themeFilters} role="group" aria-label="Tematica invitației">
                            <button type="button" aria-pressed={templateTheme === 'all'} onClick={() => setTemplateTheme('all')}>Toate tematicile</button>
                            {TEMPLATE_THEMES.map(theme => <button type="button" key={theme.id} aria-pressed={templateTheme === theme.id} onClick={() => setTemplateTheme(theme.id)}>{theme.label}</button>)}
                        </div>
                        <div className={styles.templateGrid}>
                            {TEMPLATES.filter(tpl => templateTheme === 'all' || getTemplateTheme(tpl.id) === templateTheme).map(tpl => (
                                <button
                                    type="button"
                                    key={tpl.id}
                                    onClick={() => selectTemplate(tpl.id)}
                                    aria-pressed={selectedTemplate === tpl.id}
                                    className={`${styles.templateBtn} ${selectedTemplate === tpl.id ? styles.activeTemplate : ''}`}
                                >
                                    <div className={styles.templateIcon}>{tpl.icon}</div>
                                    <span className={styles.templateName}>{tpl.name}</span>
                                    <div className={styles.featureBadges}>
                                        {tpl.features.includes('video') && <span className={`${styles.badge} ${styles.badgeVideo}`}><Video size={10} /> VIDEO</span>}
                                        {tpl.features.includes('audio') && <span className={`${styles.badge} ${styles.badgeAudio}`}><Music size={10} /> AUDIO</span>}
                                        {tpl.features.includes('photo') && <span className={`${styles.badge} ${styles.badgePhoto}`}><ImageIcon size={10} /> FOTO</span>}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* STEP 1: DETAILS */}
                {currentStep === 1 && (
                    <div className={styles.editorCard}>
                        {Object.keys(errors).length > 0 && <div className={styles.errorBox} role="alert"><strong>Verifică detaliile invitației:</strong><ul>{Object.entries(errors).map(([key, message]) => <li key={key}>{message}</li>)}</ul></div>}
                        <h2 className={styles.cardTitle}>Detaliile evenimentului</h2>
                        <div className={styles.inputGrid}>
                            <Field label="Tip eveniment" full>
                                <div className={styles.typeSwitch} role="group" aria-label="Tip eveniment">
                                    {EVENT_TYPES.map(({ id: value, label }) => (
                                        <button
                                            type="button"
                                            key={value}
                                            className={`${styles.typeBtn} ${formData.eventType === value ? styles.typeBtnActive : ''}`}
                                            aria-pressed={formData.eventType === value}
                                            onClick={() => changeField('eventType', value)}
                                        >
                                            {formData.eventType === value && <Check className={styles.typeSelectedMark} size={12} strokeWidth={2} aria-hidden="true" />}
                                            <span>{label}</span>
                                        </button>
                                    ))}
                                </div>
                            </Field>

                            {formData.eventType === 'nunta' && (
                                <>
                                    <Field label="Mireasa" htmlFor="f-brideName">{input('brideName', 'Ex: Ana')}</Field>
                                    <Field label="Mirele" htmlFor="f-groomName">{input('groomName', 'Ex: Andrei')}</Field>
                                </>
                            )}
                            {formData.eventType === 'botez' && (
                                <Field label="Numele copilului" full htmlFor="f-childName">{input('childName', 'Ex: David')}</Field>
                            )}
                            {(formData.eventType === 'aniversare' || formData.eventType === 'petrecere') && (
                                <>
                                    <Field label={formData.eventType === 'aniversare' ? 'Sărbătoritul / sărbătorita' : 'Gazda'} htmlFor="f-celebrantName">{input('celebrantName', 'Ex: Alex')}</Field>
                                    {formData.eventType === 'aniversare'
                                        ? <Field label="Vârsta (opțional)" htmlFor="f-age">{input('age', 'Ex: 30')}</Field>
                                        : <Field label="Tema (opțional)" htmlFor="f-theme">{input('theme', 'Ex: Retro 80s')}</Field>}
                                </>
                            )}

                            <Field label="Titlul invitației" full hint="Se completează automat din nume, dar îl poți schimba." htmlFor="f-title">
                                {input('title', 'Ex: Ana & Andrei')}
                                {errors.title && <span className={styles.errorText}>{errors.title}</span>}
                            </Field>

                            <Field label="Data evenimentului" htmlFor="f-eventDateISO">
                                <input
                                    id="f-eventDateISO"
                                    type="date"
                                    aria-invalid={!!errors.date || undefined}
                                    className={`${styles.input} ${errors.date ? styles.inputError : ''}`}
                                    value={formData.eventDateISO}
                                    onChange={(e) => update({ eventDateISO: e.target.value, date: formatDate(e.target.value) })}
                                />
                                {errors.date && <span className={styles.errorText}>{errors.date}</span>}
                            </Field>
                            <Field label="Cum apare data" htmlFor="f-date">{input('date', 'Ex: 25 August 2026')}</Field>

                            <Field label="Locația principală" full htmlFor="f-location">
                                <LocationPicker
                                    id="f-location"
                                    invalid={!!errors.location}
                                    value={formData.location}
                                    onChange={(address, url) => update({ location: address, locationUrl: url })}
                                />
                                {errors.location && <span className={styles.errorText}>{errors.location}</span>}
                            </Field>

                            <Field label="Mesajul invitației" full htmlFor="f-message">
                                <textarea
                                    id="f-message"
                                    className={styles.input}
                                    name="message"
                                    rows={3}
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Un mesaj scurt pentru invitați"
                                />
                            </Field>

                            {formData.eventType === 'nunta' && (
                                <>
                                    <div className={styles.sectionDivider}>Familie</div>
                                    <Field label="Părinții miresei" htmlFor="f-parentsBride">{input('parentsBride', 'Ex: Maria & Ion Popescu')}</Field>
                                    <Field label="Părinții mirelui" htmlFor="f-parentsGroom">{input('parentsGroom', 'Ex: Elena & Mihai Ionescu')}</Field>
                                    <Field label="Nașii" full htmlFor="f-godparents">{input('godparents', 'Ex: Ioana & Radu Dumitrescu')}</Field>

                                    <div className={styles.sectionDivider}>Program</div>
                                    <Field label="Cununia civilă — ora" htmlFor="f-civilCeremonyTime">{input('civilCeremonyTime', '', 'time')}</Field>
                                    <Field label="Cununia civilă — locul" htmlFor="f-civilCeremonyLoc">{input('civilCeremonyLoc', 'Ex: Primăria Sector 1')}</Field>
                                    <Field label="Cununia religioasă — ora" htmlFor="f-religiousCeremonyTime">{input('religiousCeremonyTime', '', 'time')}</Field>
                                    <Field label="Cununia religioasă — locul" htmlFor="f-religiousCeremonyLoc">{input('religiousCeremonyLoc', 'Ex: Biserica Sf. Nicolae')}</Field>
                                    <Field label="Petrecerea — ora" htmlFor="f-partyTime">{input('partyTime', '', 'time')}</Field>
                                    <Field label="Petrecerea — locul" htmlFor="f-partyLoc">{input('partyLoc', 'Ex: Restaurant Grand')}</Field>
                                </>
                            )}

                            {formData.eventType === 'botez' && (
                                <>
                                    <div className={styles.sectionDivider}>Familie</div>
                                    <Field label="Mama" htmlFor="f-motherName">{input('motherName', 'Ex: Maria')}</Field>
                                    <Field label="Tata" htmlFor="f-fatherName">{input('fatherName', 'Ex: Andrei')}</Field>
                                    <Field label="Nașii" full htmlFor="f-godparentsBaptism">{input('godparentsBaptism', 'Ex: Ioana & Radu')}</Field>

                                    <div className={styles.sectionDivider}>Program</div>
                                    <Field label="Slujba — ora" htmlFor="f-churchTime">{input('churchTime', '', 'time')}</Field>
                                    <Field label="Slujba — biserica" htmlFor="f-churchLoc">{input('churchLoc', 'Ex: Biserica Sf. Maria')}</Field>
                                    <Field label="Petrecerea — ora" htmlFor="f-restaurantTime">{input('restaurantTime', '', 'time')}</Field>
                                    <Field label="Petrecerea — restaurantul" htmlFor="f-restaurantLoc">{input('restaurantLoc', 'Ex: Restaurant Grand')}</Field>
                                </>
                            )}

                            {(formData.eventType === 'aniversare' || formData.eventType === 'petrecere') && (
                                <>
                                    <div className={styles.sectionDivider}>Program</div>
                                    <Field label="Ora de început" htmlFor="f-partyTime">{input('partyTime', '', 'time')}</Field>
                                    <Field label="Organizator (opțional)" htmlFor="f-host">{input('host', 'Ex: Familia Popescu')}</Field>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* STEP 2: EXTRA */}
                {currentStep === 2 && (
                    <div className={styles.editorCard}>
                        <h2 className={styles.cardTitle}>Fotografii, muzică și detalii</h2>
                        <p className={styles.cardText}>Totul este opțional — adaugă doar ce vrei.</p>

                        <div className={styles.mediaStack}>
                            {status === 'authenticated' ? (
                                <>
                                    <ImageUploader
                                        onUploadComplete={(url) => update({ photoUrl: url })}
                                        currentUrl={formData.photoUrl}
                                        onRemove={() => update({ photoUrl: '' })}
                                        label={selectedTemplate === 'vinyl' ? 'copertă disc' : selectedTemplate === 'chat' ? 'avatar' : 'fotografie'}
                                    />
                                    {template.features.includes('video') && (
                                        <MediaUploader
                                            type="video"
                                            onUploadComplete={(url) => update({ videoUrl: url })}
                                            currentUrl={formData.videoUrl}
                                            onRemove={() => update({ videoUrl: '' })}
                                        />
                                    )}
                                    {template.features.includes('audio') && (
                                        <MediaUploader
                                            type="audio"
                                            onUploadComplete={(url) => update({ audioUrl: url })}
                                            currentUrl={formData.audioUrl}
                                            onRemove={() => update({ audioUrl: '' })}
                                        />
                                    )}
                                </>
                            ) : (
                                <div className={styles.infoBox}>
                                    <Lock size={16} /> Pentru a încărca fotografii, video sau muzică, creează-ți un cont în pasul „Finalizare”. Datele completate se păstrează.
                                </div>
                            )}
                        </div>

                        <div className={styles.inputGrid} style={{ marginTop: '1.5rem' }}>
                            <Field label="Dress code (opțional)" full htmlFor="f-dressCode">{input('dressCode', 'Ex: Elegant / Black tie')}</Field>
                            <Field label="Informații suplimentare (opțional)" full htmlFor="f-specialInstructions">
                                <textarea
                                    id="f-specialInstructions"
                                    className={styles.input}
                                    name="specialInstructions"
                                    rows={2}
                                    value={formData.specialInstructions}
                                    onChange={handleChange}
                                    placeholder="Ex: Vă rugăm să confirmați până la 1 august."
                                />
                            </Field>

                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <span className={styles.label}>Câmpuri personalizate (max. 3)</span>
                                <div className={styles.customFields}>
                                    {formData.customFields.map((field, idx) => (
                                        <div key={idx} className={styles.customFieldRow}>
                                            <input
                                                className={styles.input}
                                                placeholder="Etichetă (ex: Cazare)"
                                                aria-label={`Etichetă câmp ${idx + 1}`}
                                                value={field.label}
                                                onChange={(e) => handleCustomFieldChange(idx, 'label', e.target.value)}
                                            />
                                            <input
                                                className={styles.input}
                                                placeholder="Valoare"
                                                aria-label={`Valoare câmp ${idx + 1}`}
                                                value={field.value}
                                                onChange={(e) => handleCustomFieldChange(idx, 'value', e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                className={styles.iconBtnDanger}
                                                aria-label="Șterge câmpul"
                                                onClick={() => setFormData(prev => ({ ...prev, customFields: prev.customFields.filter((_, i) => i !== idx) }))}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    {formData.customFields.length < 3 && (
                                        <button
                                            type="button"
                                            className={styles.addFieldBtn}
                                            onClick={() => setFormData(prev => ({ ...prev, customFields: [...prev.customFields, { label: '', value: '' }] }))}
                                        >
                                            <Plus size={18} /> Adaugă câmp
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 3: FINISH */}
                {currentStep === 3 && (
                    <div className={styles.editorCard}>
                        {status === 'loading' ? (
                            <div style={{ textAlign: 'center', padding: '2rem' }}><Loader2 className="animate-spin" color="var(--accent)" /></div>
                        ) : status === 'unauthenticated' ? (
                            <>
                                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                                    <Lock size={28} color="var(--accent)" />
                                    <h2 className={styles.cardTitle} style={{ marginTop: '0.5rem' }}>Salvează-ți invitația</h2>
                                    <p className={styles.cardText}>Creează un cont gratuit (durează 10 secunde). Tot ce ai completat se păstrează.</p>
                                </div>
                                <div className={styles.authTabs}>
                                    <button type="button" className={authMode === 'register' ? styles.authTabActive : ''} onClick={() => { setAuthMode('register'); setAuthError('') }}>Cont nou</button>
                                    <button type="button" className={authMode === 'login' ? styles.authTabActive : ''} onClick={() => { setAuthMode('login'); setAuthError('') }}>Am deja cont</button>
                                </div>
                                <form onSubmit={handleAuthSubmit} className={styles.authForm}>
                                    {authMode === 'register' && (
                                        <input className={styles.input} aria-label="Nume" placeholder="Nume" autoComplete="name" value={authData.name} onChange={e => setAuthData({ ...authData, name: e.target.value })} />
                                    )}
                                    <input className={styles.input} type="email" required aria-label="Email" placeholder="Email" autoComplete="email" value={authData.email} onChange={e => setAuthData({ ...authData, email: e.target.value })} />
                                    <input className={styles.input} type="password" required aria-label="Parolă" minLength={authMode === 'register' ? 6 : undefined} placeholder={authMode === 'register' ? 'Parolă (minim 6 caractere)' : 'Parolă'} autoComplete={authMode === 'register' ? 'new-password' : 'current-password'} value={authData.password} onChange={e => setAuthData({ ...authData, password: e.target.value })} />
                                    {authMode === 'register' && <RegisterTermsConsent checked={acceptTerms} onChange={setAcceptTerms} />}
                                    {authMode === 'register' && <RegisterMarketingNotice />}
                                    {authError && <p className={styles.errorText}>{authError}</p>}
                                    <button type="submit" className={styles.btnGenerate} disabled={isAuthLoading}>
                                        {isAuthLoading ? 'Se procesează...' : authMode === 'register' ? 'Creează cont și continuă' : 'Intră în cont'}
                                    </button>
                                </form>
                                <GoogleSignInButton
                                    callbackUrl="/create?pas=final"
                                    termsAccepted={authMode === 'register' && acceptTerms}
                                    requireTerms={authMode === 'register'}
                                    onBlocked={setAuthError}
                                />
                            </>
                        ) : (
                            <div style={{ textAlign: 'center' }}>
                                <Zap size={28} color="var(--accent)" />
                                <h2 className={styles.cardTitle} style={{ marginTop: '0.5rem' }}>{isPaid ? 'Salvează modificările' : 'Activează invitația'}</h2>

                                {isPaid ? (
                                    <p className={styles.cardText}>Invitația este deja activă. Modificările apar imediat la link-ul trimis oaspeților.</p>
                                ) : (
                                    <div className={styles.priceCard}>
                                        <div className={styles.price}>99 lei<span> / invitație</span></div>
                                        <p style={{ fontSize: '0.8rem', color: '#999', margin: '4px 0 8px' }}>{PRICE_NOTE}.</p>
                                        <ul>
                                            <li><Check size={14} /> Link unic, fără limită de invitați</li>
                                            <li><Check size={14} /> Confirmări RSVP live + notificări pe email</li>
                                            <li><Check size={14} /> Listă de invitați în contul tău</li>
                                            <li><Check size={14} /> Modificări nelimitate oricând</li>
                                        </ul>
                                    </div>
                                )}

                                {!isPaid && <CheckoutConsent checked={checkoutConsent} onChange={(v) => { setCheckoutConsent(v); if (v) setSaveError('') }} />}

                                {saveError && <p className={styles.errorBox}>{saveError}</p>}

                                <button type="button" onClick={() => handleSave(!isPaid)} className={styles.btnGenerate} style={{ width: '100%' }} disabled={isSaving}>
                                    {isSaving ? 'Se procesează...' : isPaid ? 'Salvează modificările' : 'Plătește și activează (99 lei)'}
                                </button>
                                {!isPaid && (
                                    <button type="button" onClick={() => handleSave(false)} className={styles.btnSecondary} style={{ width: '100%', marginTop: '10px' }} disabled={isSaving}>
                                        Salvează ca draft (plătești mai târziu)
                                    </button>
                                )}
                                <p className={styles.secureNote}><Lock size={12} /> Plată securizată prin Stripe</p>
                            </div>
                        )}
                    </div>
                )}

                <div className={styles.cardFooter}>
                    <button type="button" onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))} disabled={currentStep === 0} className={styles.btnSecondary}>
                        <ChevronLeft size={16} /> Înapoi
                    </button>
                    {currentStep < steps.length - 1 && (
                        <button type="button" onClick={() => goToStep(currentStep + 1)} className={styles.btnGenerate}>
                            Pasul următor <ChevronRight size={16} style={{ verticalAlign: 'middle' }} />
                        </button>
                    )}
                </div>
            </div>

            {/* Desktop preview */}
            <div className={styles.previewSection}>
                <div className={styles.previewSwitcher}>
                    <button type="button" aria-label="Previzualizare desktop" className={`${styles.switchBtn} ${previewMode === 'pc' ? styles.activeSwitch : ''}`} onClick={() => setPreviewMode('pc')}>
                        <Monitor size={18} />
                    </button>
                    <button type="button" aria-label="Previzualizare telefon" className={`${styles.switchBtn} ${previewMode === 'mobile' ? styles.activeSwitch : ''}`} onClick={() => setPreviewMode('mobile')}>
                        <Smartphone size={18} />
                    </button>
                </div>

                <div className={`${styles.previewContainer} ${previewMode === 'mobile' ? styles.mobileMode : styles.pcMode}`}>
                    {previewMode === 'mobile' ? phonePreview : (
                        <div className={styles.pcMockup}>
                            <div className={styles.pcBrowserHeader}>
                                <div className={styles.dot}></div>
                                <div className={styles.dot}></div>
                                <div className={styles.dot}></div>
                                <div className={styles.urlBar}>invitonline.ro/invitatie/…</div>
                            </div>
                            <div className={`${styles.pcContent} ${isCentered ? styles.centeredScaler : ''}`}>
                                <PreviewViewport title="Invitația ta pe ecran mare">{preview}</PreviewViewport>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile: floating preview button + full-screen preview */}
            <button type="button" className={styles.floatingPreviewBtn} onClick={() => setShowMobilePreview(true)}>
                <Eye size={18} /> Previzualizare
            </button>
            {showMobilePreview && (
                <div className={styles.mobilePreviewOverlay}>
                    <div className={styles.mobilePreviewBar}>
                        <span>Previzualizare · {template.name}</span>
                        <button type="button" aria-label="Închide" onClick={() => setShowMobilePreview(false)}><X size={22} /></button>
                    </div>
                    <div className={`${styles.mobilePreviewBody} ${isCentered ? styles.centeredScaler : ''}`}>
                        <div className={styles.scalerContent}>{preview}</div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function CreateEvent() {
    return (
        <Suspense fallback={null}>
            <CreateEventContent />
        </Suspense>
    )
}
