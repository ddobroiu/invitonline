'use client'

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import styles from './page.module.css'
import TemplateRenderer, { CENTERED_TEMPLATES, eventToTemplateProps, type InvitationRecord } from '@/components/TemplateRenderer'
import { validateGuest } from '@/lib/validation'
import BillingPanel from '@/components/dashboard/BillingPanel'
import TypeIcon from '@/components/EventTypeIcon'
import CheckoutConsent from '@/components/legal/CheckoutConsent'
import { PRICE_NOTE } from '@/config/legal'
import {
    Search, Plus, Trash2, Mail, Calendar, MapPin, Eye, Users, Lock, Link as LinkIcon,
    Pencil, Download, ExternalLink, Loader2, CheckCircle2, XCircle, Clock, LayoutGrid, Receipt, MessageCircle
} from 'lucide-react'

type Tab = 'overview' | 'guests' | 'preview' | 'billing'
interface Guest { id: string; eventId: string; name: string; contact: string; persons: number; status: string; message: string | null; createdAt: string }
interface EventSummary extends InvitationRecord { isPaid: boolean; guests: Pick<Guest, 'status' | 'persons'>[]; _count: { guests: number } }

const TYPE_LABELS: Record<string, string> = { nunta: 'Nuntă', botez: 'Botez', aniversare: 'Aniversare', petrecere: 'Petrecere', corporate: 'Corporate' }
const STATUS_LABELS: Record<string, string> = { confirmed: 'Confirmat', declined: 'Refuzat', pending: 'În așteptare' }

function guestStats(guests: { status: string, persons: number }[]) {
    const confirmed = guests.filter(g => g.status === 'confirmed')
    return {
        total: guests.length,
        confirmed: confirmed.length,
        persons: confirmed.reduce((sum, g) => sum + (g.persons || 0), 0),
        declined: guests.filter(g => g.status === 'declined').length,
        pending: guests.filter(g => g.status === 'pending').length,
    }
}

function DashboardContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { data: session, status } = useSession()

    const [events, setEvents] = useState<EventSummary[]>([])
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [guests, setGuests] = useState<Guest[]>([])
    const [loadError, setLoadError] = useState('')
    const [addingGuest, setAddingGuest] = useState(false)
    const [guestsLoading, setGuestsLoading] = useState(false)
    const [newGuest, setNewGuest] = useState({ name: '', contact: '', persons: 1 })
    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState<Tab>('overview')
    const [toast, setToast] = useState('')
    const [payingId, setPayingId] = useState<string | null>(null)
    // Invitatia pentru care cerem acordul inainte de plata (OUG 34/2014)
    const [consentFor, setConsentFor] = useState<string | null>(null)
    const [checkoutConsent, setCheckoutConsent] = useState(false)

    const selectedEvent = events.find(e => e.id === selectedId) || null

    const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const showToast = useCallback((msg: string) => {
        if (toastTimer.current) clearTimeout(toastTimer.current)
        setToast(msg)
        toastTimer.current = setTimeout(() => setToast(''), 4000)
    }, [])
    useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current) }, [])

    const fetchEvents = useCallback(async () => {
        try {
            const res = await fetch('/api/events')
            if (res.ok) {
                const data = await res.json()
                const list: EventSummary[] = data.events || []
                setLoadError('')
                setEvents(list)
                setSelectedId(prev => (prev && list.some(e => e.id === prev)) ? prev : list[0]?.id ?? null)
            } else setLoadError('Nu am putut încărca invitațiile. Încearcă din nou.')
        } catch (error) {
            console.error('Fetch error:', error)
            setLoadError('Nu am putut încărca invitațiile. Verifică conexiunea.')
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/login?callbackUrl=/dashboard')
        else if (status === 'authenticated') fetchEvents()
    }, [status, router, fetchEvents])

    useEffect(() => {
        if (searchParams.get('canceled')) showToast('Plata a fost anulată. Invitația a rămas salvată ca draft.')
    }, [searchParams, showToast])

    const fetchGuests = useCallback(async (eventId: string, quiet = false, signal?: AbortSignal) => {
        if (!quiet) setGuestsLoading(true)
        try {
            const res = await fetch(`/api/guests?eventId=${encodeURIComponent(eventId)}`, { signal })
            if (res.ok) {
                const data = await res.json()
                if (!signal?.aborted) setGuests(data.guests || [])
            } else showToast('Nu am putut încărca lista de invitați.')
        } catch (error) {
            if (!signal?.aborted) { console.error('Fetch guests error:', error); showToast('Nu am putut încărca lista de invitați. Verifică conexiunea.') }
        } finally {
            if (!signal?.aborted) setGuestsLoading(false)
        }
    }, [showToast])

    useEffect(() => {
        const controller = new AbortController()
        setGuests([])
        if (selectedId) fetchGuests(selectedId, false, controller.signal)
        return () => controller.abort()
    }, [selectedId, fetchGuests])

    useEffect(() => {
        if (status !== 'authenticated') return
        const controller = new AbortController()
        const refresh = () => { if (!document.hidden) { void fetchEvents(); if (selectedId) void fetchGuests(selectedId, true, controller.signal) } }
        const timer = setInterval(refresh, 15000)
        document.addEventListener('visibilitychange', refresh)
        return () => { clearInterval(timer); document.removeEventListener('visibilitychange', refresh); controller.abort() }
    }, [status, selectedId, fetchEvents, fetchGuests])

    const inviteUrl = (id: string) => `${typeof window !== 'undefined' ? window.location.origin : ''}/invitatie/${id}`

    const copyLink = async (id: string) => {
        try {
            await navigator.clipboard.writeText(inviteUrl(id))
            showToast('Link copiat! Îl poți trimite invitaților.')
        } catch {
            showToast(inviteUrl(id))
        }
    }

    const shareWhatsApp = (ev: EventSummary) => {
        const text = `Ești invitat: ${ev.title}! Deschide invitația și confirmă prezența aici: ${inviteUrl(ev.id)}`
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
    }

    const handlePayment = (eventId: string) => {
        setCheckoutConsent(false)
        setConsentFor(eventId)
    }

    const startPayment = async (eventId: string) => {
        if (!checkoutConsent) return
        setConsentFor(null)
        setPayingId(eventId)
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventId, consent: true })
            })
            const data = await res.json().catch(() => ({}))
            if (res.ok && data.url) {
                window.location.href = data.url
                return
            }
            showToast(data.message || 'Plata nu a putut fi inițiată.')
        } catch {
            showToast('Eroare de rețea.')
        }
        setPayingId(null)
    }

    const handleDeleteEvent = async (id: string) => {
        if (!confirm('Ești sigur că vrei să ștergi această invitație? Lista de invitați va fi ștearsă definitiv.')) return
        try {
            const res = await fetch(`/api/events?id=${id}`, { method: 'DELETE' })
            if (res.ok) {
                showToast('Invitația a fost ștearsă.')
                fetchEvents()
            } else {
                showToast('Nu am putut șterge invitația.')
            }
        } catch {
            showToast('Eroare de rețea.')
        }
    }

    const handleAddGuest = async (e: React.FormEvent) => {
        e.preventDefault()
        if (addingGuest || !selectedId) return
        const errors = validateGuest(newGuest, false)
        if (Object.keys(errors).length) { showToast(Object.values(errors)[0]); return }
        setAddingGuest(true)
        try {
            const res = await fetch('/api/guests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newGuest, eventId: selectedId })
            })
            if (res.ok) {
                setNewGuest({ name: '', contact: '', persons: 1 })
                fetchGuests(selectedId)
                fetchEvents()
            } else {
                const data = await res.json().catch(() => ({}))
                showToast(data.message || 'Nu am putut adăuga invitatul.')
            }
        } catch {
            showToast('Eroare de rețea.')
        } finally { setAddingGuest(false) }
    }

    const handleGuestStatus = async (id: string, newStatus: string) => {
        const res = await fetch('/api/guests', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status: newStatus })
        }).catch(() => null)
        if (!res?.ok) { showToast('Nu am putut actualiza răspunsul invitatului.'); return }
        const data = await res.json()
        setGuests(prev => prev.map(guest => guest.id === id ? data.guest : guest))
        fetchEvents()
    }

    const handleDeleteGuest = async (id: string) => {
        if (!confirm('Ștergi acest invitat din listă?')) return
        const res = await fetch(`/api/guests?id=${id}`, { method: 'DELETE' }).catch(() => null)
        if (res?.ok && selectedId) {
            fetchGuests(selectedId)
            fetchEvents()
        }
    }

    const exportCsv = () => {
        if (!selectedEvent) return
        const rows = [['Nume', 'Contact', 'Persoane', 'Status', 'Mesaj', 'Data']]
        guests.forEach(g => rows.push([g.name, g.contact, String(g.persons), STATUS_LABELS[g.status] || g.status, g.message || '', new Date(g.createdAt).toLocaleString('ro-RO')]))
        const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
        const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `invitati-${selectedEvent.title.replace(/[^\w-]+/g, '_')}.csv`
        a.click()
        URL.revokeObjectURL(url)
    }

    const filteredGuests = useMemo(() => {
        const q = searchQuery.trim().toLowerCase()
        if (!q) return guests
        return guests.filter(g => g.name?.toLowerCase().includes(q) || g.contact?.toLowerCase().includes(q))
    }, [guests, searchQuery])

    const stats = guestStats(guests)

    if (status === 'loading' || (status === 'authenticated' && isLoading)) {
        return <div className={styles.centerScreen}><Loader2 className="animate-spin" size={32} color="var(--accent)" /></div>
    }
    if (status === 'unauthenticated') return null
    if (loadError && events.length === 0) return <div className={styles.centerScreen}><div className={styles.emptyState}><h1>Nu am putut încărca invitațiile</h1><p role="alert">{loadError}</p><button className={styles.primaryBtn} onClick={() => { setIsLoading(true); void fetchEvents() }}>Încearcă din nou</button></div></div>

    if (events.length === 0) {
        return (
            <div className={styles.centerScreen}>
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}><Mail size={48} strokeWidth={1.5} aria-hidden="true" /></div>
                    <h1>Bun venit{session?.user?.name ? `, ${session.user.name}` : ''}!</h1>
                    <p>Încă nu ai creat nicio invitație. Alege un model și personalizează-l în câteva minute.</p>
                    <button className={styles.primaryBtn} onClick={() => router.push('/create')}>
                        <Plus size={18} /> Creează prima invitație
                    </button>
                </div>
            </div>
        )
    }

    const renderOverview = () => (
        <div className={styles.eventGrid}>
            {events.map((ev) => {
                const s = guestStats(ev.guests || [])
                return (
                    <div
                        key={ev.id}
                        className={`${styles.invitationCard} ${selectedId === ev.id ? styles.activeCard : ''}`}
                        onClick={() => setSelectedId(ev.id)}
                        onKeyDown={(e) => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); setSelectedId(ev.id) } }}
                        role="button"
                        tabIndex={0}
                        aria-pressed={selectedId === ev.id}
                    >
                        <div className={styles.cardHeader}>
                            <div className={styles.cardIcon}><TypeIcon type={ev.type} /></div>
                            <span className={`${styles.typeBadge} ${!ev.isPaid ? styles.draftBadge : ''}`}>
                                {ev.isPaid ? 'Activă' : 'Draft'}
                            </span>
                        </div>
                        <div className={styles.cardBody}>
                            <span className={styles.cardType}>{TYPE_LABELS[ev.type] || ev.type}</span>
                            <h3>{ev.title}</h3>
                            <div className={styles.cardDetails}>
                                {ev.date && <span><Calendar size={13} /> {ev.date}</span>}
                                {ev.location && <span><MapPin size={13} /> {ev.location}</span>}
                            </div>
                        </div>
                        <div className={styles.miniStats}>
                            <span><CheckCircle2 size={14} /> {s.confirmed} {s.confirmed === 1 ? 'confirmare' : 'confirmări'}</span>
                            <span><Users size={14} /> {s.persons} {s.persons === 1 ? 'persoană' : 'persoane'}</span>
                        </div>
                        <div className={styles.cardActions} onClick={(e) => e.stopPropagation()}>
                            {ev.isPaid ? (
                                <>
                                    <button className={styles.actionPrimary} onClick={() => copyLink(ev.id)}><LinkIcon size={14} /> Copiază link</button>
                                    <button className={styles.actionWhatsapp} onClick={() => shareWhatsApp(ev)} aria-label="Trimite pe WhatsApp"><MessageCircle size={14} /></button>
                                </>
                            ) : (
                                <button className={styles.actionPrimary} onClick={() => handlePayment(ev.id)} disabled={payingId === ev.id}>
                                    {payingId === ev.id ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />} Activează (99 lei)
                                </button>
                            )}
                            <button className={styles.actionGhost} onClick={() => router.push(`/create?id=${ev.id}`)} aria-label="Editează"><Pencil size={14} /></button>
                            <a className={styles.actionGhost} href={`/invitatie/${ev.id}`} target="_blank" rel="noopener noreferrer" aria-label="Deschide invitația"><ExternalLink size={14} /></a>
                            <button className={styles.actionDanger} onClick={() => handleDeleteEvent(ev.id)} aria-label="Șterge"><Trash2 size={14} /></button>
                        </div>
                    </div>
                )
            })}
            <button className={styles.newCard} onClick={() => router.push('/create')}>
                <Plus size={36} />
                <span>Creează invitație nouă</span>
            </button>
        </div>
    )

    const renderGuests = () => (
        <section>
            <div className={styles.statsGrid}>
                <div className={styles.statCard}><div className={styles.statValue}>{stats.confirmed}</div><div className={styles.statLabel}><CheckCircle2 size={14} /> Confirmări</div></div>
                <div className={styles.statCard}><div className={styles.statValue}>{stats.persons}</div><div className={styles.statLabel}><Users size={14} /> Persoane</div></div>
                <div className={styles.statCard}><div className={styles.statValue}>{stats.pending}</div><div className={styles.statLabel}><Clock size={14} /> În așteptare</div></div>
                <div className={styles.statCard}><div className={styles.statValue}>{stats.declined}</div><div className={styles.statLabel}><XCircle size={14} /> Refuzuri</div></div>
            </div>

            <div className={styles.panel}>
                <form className={styles.addGuestForm} onSubmit={handleAddGuest}>
                    <input className={styles.input} placeholder="Nume invitat" value={newGuest.name} onChange={e => setNewGuest({ ...newGuest, name: e.target.value })} required />
                    <input className={styles.input} placeholder="Email / telefon (opțional)" value={newGuest.contact} onChange={e => setNewGuest({ ...newGuest, contact: e.target.value })} />
                    <select className={styles.input} value={newGuest.persons} onChange={e => setNewGuest({ ...newGuest, persons: Number(e.target.value) })} aria-label="Număr persoane">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n} pers.</option>)}
                    </select>
                    <button type="submit" className={styles.primaryBtn} disabled={addingGuest}><Plus size={16} /> {addingGuest ? 'Se adaugă…' : 'Adaugă'}</button>
                </form>

                <div className={styles.toolbar}>
                    <div className={styles.searchBox}>
                        <Search size={16} />
                        <input placeholder="Caută după nume sau contact..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <button className={styles.secondaryBtn} onClick={exportCsv} disabled={guests.length === 0}><Download size={16} /> Export CSV</button>
                </div>

                <div className={styles.tableWrap}>
                    <table className={styles.guestList}>
                        <thead>
                            <tr>
                                <th>Nume</th>
                                <th>Contact</th>
                                <th>Pers.</th>
                                <th>Status</th>
                                <th>Mesaj</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredGuests.map((guest) => (
                                <tr key={guest.id}>
                                    <td className={styles.guestName}>{guest.name}</td>
                                    <td className={styles.muted}>{guest.contact || '—'}</td>
                                    <td>{guest.persons}</td>
                                    <td>
                                        <select
                                            className={`${styles.statusSelect} ${styles[guest.status] || ''}`}
                                            value={guest.status}
                                            onChange={(e) => handleGuestStatus(guest.id, e.target.value)}
                                        >
                                            <option value="confirmed">Confirmat</option>
                                            <option value="pending">În așteptare</option>
                                            <option value="declined">Refuzat</option>
                                        </select>
                                    </td>
                                    <td className={styles.messageCell} title={guest.message || ''}>{guest.message || '—'}</td>
                                    <td>
                                        <button className={styles.iconDanger} onClick={() => handleDeleteGuest(guest.id)} aria-label="Șterge invitatul">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {!guestsLoading && filteredGuests.length === 0 && (
                                <tr>
                                    <td colSpan={6} className={styles.emptyRow}>
                                        {searchQuery
                                            ? `Niciun rezultat pentru „${searchQuery}”`
                                            : selectedEvent?.isPaid
                                                ? 'Încă nu ai răspunsuri. Trimite link-ul invitației și confirmările apar aici automat.'
                                                : 'Activează invitația ca să primești confirmări de la invitați.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )

    const renderPreview = () => {
        if (!selectedEvent) return null
        const props = eventToTemplateProps(selectedEvent)
        const centered = CENTERED_TEMPLATES.includes(selectedEvent.template)
        return (
            <div className={styles.previewWrap}>
                <div className={styles.previewPhone}>
                    <div className={`${styles.previewScroll} ${centered ? styles.previewCentered : ''}`}>
                        <TemplateRenderer key={selectedEvent.id} {...props} template={selectedEvent.template} id={undefined} />
                    </div>
                </div>
                <div className={styles.previewActions}>
                    <p>Așa vor vedea invitații tăi invitația pe telefon.</p>
                    <button className={styles.primaryBtn} onClick={() => router.push(`/create?id=${selectedEvent.id}`)}><Pencil size={16} /> Editează</button>
                    <a className={styles.secondaryBtn} href={`/invitatie/${selectedEvent.id}`} target="_blank" rel="noopener noreferrer"><ExternalLink size={16} /> Deschide pe tot ecranul</a>
                </div>
            </div>
        )
    }

    const tabs: { id: Tab, label: string, icon: React.ReactNode }[] = [
        { id: 'overview', label: 'Invitațiile mele', icon: <LayoutGrid size={18} /> },
        { id: 'guests', label: 'Lista invitați', icon: <Users size={18} /> },
        { id: 'preview', label: 'Previzualizare', icon: <Eye size={18} /> },
        { id: 'billing', label: 'Facturare', icon: <Receipt size={18} /> },
    ]

    return (
        <div className={styles.dashboardContainer}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarSection}>
                    <h3 className={styles.sidebarTitle}>Invitațiile mele</h3>
                    <div className={styles.eventList}>
                        {events.map((ev) => (
                            <button
                                key={ev.id}
                                onClick={() => setSelectedId(ev.id)}
                                className={`${styles.eventListItem} ${selectedId === ev.id ? styles.eventListItemActive : ''}`}
                            >
                                <span className={styles.eventListTitle}>{ev.title}</span>
                                <span className={styles.eventListMeta}>{TYPE_LABELS[ev.type] || ev.type} • {ev.isPaid ? 'Activă' : 'Draft'}</span>
                                <span className={styles.eventListCount}>{ev._count?.guests ?? 0}</span>
                            </button>
                        ))}
                    </div>
                    <button className={styles.newBtn} onClick={() => router.push('/create')}><Plus size={14} /> Invitație nouă</button>
                </div>

                <nav className={styles.nav}>
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            className={`${styles.navItem} ${activeTab === t.id ? styles.activeNav : ''}`}
                            onClick={() => setActiveTab(t.id)}
                        >
                            {t.icon} <span>{t.label}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            <div className={styles.mainContent}>
                {(activeTab === 'guests' || activeTab === 'preview') && events.length > 1 && (
                    <select
                        className={`${styles.input} ${styles.mobileEventSelect}`}
                        value={selectedId || ''}
                        onChange={(e) => setSelectedId(e.target.value)}
                        aria-label="Alege invitația"
                    >
                        {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
                    </select>
                )}
                {(activeTab === 'guests' || activeTab === 'preview') && selectedEvent && (
                    <header className={styles.header}>
                        <div>
                            <div className={styles.titleRow}>
                                <h1 className={styles.eventTitle}>{selectedEvent.title}</h1>
                                <span className={selectedEvent.isPaid ? styles.pillActive : styles.pillDraft}>
                                    {selectedEvent.isPaid ? 'ACTIVĂ' : 'DRAFT'}
                                </span>
                            </div>
                            <p className={styles.eventDate}>{[selectedEvent.date, selectedEvent.location].filter(Boolean).join(' • ')}</p>
                        </div>
                        {selectedEvent.isPaid ? (
                            <div className={styles.headerActions}>
                                <button className={styles.secondaryBtn} onClick={() => copyLink(selectedEvent.id)}><LinkIcon size={16} /> Copiază link</button>
                                <button className={styles.whatsappBtn} onClick={() => shareWhatsApp(selectedEvent)}><MessageCircle size={16} /> WhatsApp</button>
                            </div>
                        ) : (
                            <button className={styles.primaryBtn} onClick={() => handlePayment(selectedEvent.id)} disabled={payingId === selectedEvent.id}>
                                <Lock size={16} /> Activează (99 lei)
                            </button>
                        )}
                    </header>
                )}
                {activeTab === 'billing' && (
                    <header className={styles.header}>
                        <div>
                            <h1 className={styles.eventTitle}>Facturare</h1>
                            <p className={styles.eventDate}>Datele pentru factură și istoricul plăților</p>
                        </div>
                    </header>
                )}
                {activeTab === 'overview' && (
                    <header className={styles.header}>
                        <div>
                            <h1 className={styles.eventTitle}>Bun venit{session?.user?.name ? `, ${session.user.name}` : ''}!</h1>
                            <p className={styles.eventDate}>Gestionează invitațiile și confirmările</p>
                        </div>
                    </header>
                )}

                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'guests' && renderGuests()}
                {activeTab === 'preview' && renderPreview()}
                {activeTab === 'billing' && <BillingPanel />}
            </div>

            {toast && <div className={styles.toast}>{toast}</div>}
            {consentFor && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="checkout-consent-title"
                    onClick={() => setConsentFor(null)}
                    onKeyDown={(e) => { if (e.key === 'Escape') setConsentFor(null) }}
                    style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
                >
                    <div onClick={(e) => e.stopPropagation()} style={{ background: '#111', border: '1px solid #333', borderRadius: '16px', padding: '20px', maxWidth: '460px', width: '100%', color: '#ddd' }}>
                        <h2 id="checkout-consent-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: '#fff', marginBottom: '6px' }}>Activează invitația – 99 lei</h2>
                        <p style={{ fontSize: '0.85rem', color: '#999' }}>{PRICE_NOTE}. Plata se face securizat prin Stripe.</p>
                        <CheckoutConsent checked={checkoutConsent} onChange={setCheckoutConsent} />
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                            <button type="button" className={styles.secondaryBtn} onClick={() => setConsentFor(null)}>Renunță</button>
                            <button type="button" className={styles.primaryBtn} disabled={!checkoutConsent} style={{ opacity: checkoutConsent ? 1 : 0.5 }} onClick={() => startPayment(consentFor)}>
                                <Lock size={16} /> Continuă la plată
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function Dashboard() {
    return (
        <Suspense fallback={null}>
            <DashboardContent />
        </Suspense>
    )
}
