'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import styles from './page.module.css'

import EnvelopeTemplate from '@/components/templates/EnvelopeTemplate'
import NetflixTemplate from '@/components/templates/NetflixTemplate'
import BoardingPassTemplate from '@/components/templates/BoardingPassTemplate'
import VinylTemplate from '@/components/templates/VinylTemplate'
import ScratchTemplate from '@/components/templates/ScratchTemplate'
import PassportTemplate from '@/components/templates/PassportTemplate'
import NewspaperTemplate from '@/components/templates/NewspaperTemplate'
import CinemaTemplate from '@/components/templates/CinemaTemplate'
import FestivalTemplate from '@/components/templates/FestivalTemplate'
import { Search, Plus, Trash2, Mail, Phone, User as UserIcon, Heart, Baby, PartyPopper, Calendar, MapPin, Eye, Users, CheckCircle, Lock, Link as LinkIcon, Receipt, CreditCard, Zap } from 'lucide-react'
import BillingPanel from '@/components/dashboard/BillingPanel'

export default function Dashboard() {
    const router = useRouter()
    const { data: session, status } = useSession()

    const [events, setEvents] = useState<any[]>([])
    const [selectedEvent, setSelectedEvent] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [guests, setGuests] = useState<any[]>([])
    const [newGuest, setNewGuest] = useState({ name: '', email: '' })
    const [searchQuery, setSearchQuery] = useState('')

    const fetchAllContent = async () => {
        try {
            const res = await fetch('/api/events')
            if (res.ok) {
                const data = await res.json()
                if (data.events) {
                    const transformedEvents = data.events.map((ev: any) => ({
                        ...ev.data,
                        id: ev.id,
                        title: ev.title,
                        date: ev.date,
                        location: ev.location,
                        template: ev.template,
                        message: ev.message,
                        isPaid: ev.isPaid,
                        type: ev.type,
                        _count: ev._count
                    }))
                    setEvents(transformedEvents)
                    if (transformedEvents.length > 0 && !selectedEvent) {
                        setSelectedEvent(transformedEvents[0])
                    } else if (transformedEvents.length === 0) {
                        setSelectedEvent(null)
                    }
                }
            }
        } catch (error) {
            console.error('Fetch error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        } else if (status === 'authenticated') {
            fetchAllContent()
        }
    }, [status, router])

    useEffect(() => {
        if (selectedEvent?.id) {
            fetchGuests()
        }
    }, [selectedEvent])

    const fetchGuests = async () => {
        if (!selectedEvent?.id) return
        try {
            const res = await fetch(`/api/guests?eventId=${selectedEvent.id}`)
            if (res.ok) {
                const data = await res.json()
                setGuests(data.guests || [])
            }
        } catch (error) {
            console.error('Fetch guests error:', error)
        }
    }

    const [activeTab, setActiveTab] = useState('overview')

    const handleAddGuest = async () => {
        if (!newGuest.name || !selectedEvent?.id) return
        try {
            const res = await fetch('/api/guests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newGuest, eventId: selectedEvent.id })
            })
            if (res.ok) {
                fetchGuests()
                setNewGuest({ name: '', email: '' })
            }
        } catch (error) {
            console.error('Add guest error:', error)
        }
    }

    const handleDeleteGuest = async (id: string) => {
        try {
            const res = await fetch(`/api/guests?id=${id}`, { method: 'DELETE' })
            if (res.ok) fetchGuests()
        } catch (error) {
            console.error('Delete guest error:', error)
        }
    }

    const handleDeleteEvent = async (id: string) => {
        if (!confirm('Ești sigur că vrei să ștergi această invitație? Această acțiune este permanentă.')) return
        try {
            const res = await fetch(`/api/events?id=${id}`, { method: 'DELETE' })
            if (res.ok) {
                if (selectedEvent?.id === id) {
                    setSelectedEvent(null)
                }
                fetchAllContent()
            }
        } catch (error) {
            console.error('Delete event error:', error)
        }
    }

    const handleUpdateEvent = async (field: string, value: string) => {
        const updated = { ...selectedEvent, [field]: value }
        setSelectedEvent(updated)

        try {
            await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: updated.id,
                    ...updated,
                    template: updated.template,
                    type: updated.type || 'nunta'
                })
            })
        } catch (error) {
            console.error('Failed to sync with DB:', error)
        }
    }

    const handlePayment = async () => {
        if (!selectedEvent?.id) return
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventId: selectedEvent.id })
            })
            if (res.ok) {
                const { url } = await res.json()
                window.location.href = url
            }
        } catch (error) {
            console.error('Payment error:', error)
        }
    }

    if (status === 'loading' || isLoading) return <div className={styles.dashboardContainer} style={{ justifyContent: 'center', alignItems: 'center' }}>Loading...</div>

    if (events.length === 0) {
        return (
            <div className={styles.dashboardContainer} style={{ flexDirection: 'column', gap: '30px', justifyContent: 'center', alignItems: 'center' }}>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem' }}>Bun venit!</h1>
                <p style={{ color: '#888' }}>Încă nu ai creat nicio invitație.</p>
                <button
                    onClick={() => router.push('/create')}
                    style={{ padding: '15px 40px', background: 'var(--accent)', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    Creează Prima Invitație
                </button>
            </div>
        )
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'guests':
                return (
                    <section className={styles.guestSection}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 className={styles.sectionTitle} style={{ margin: 0 }}>Lista de Invitați: <span style={{ color: 'var(--accent)' }}>{selectedEvent?.title || '...'}</span></h2>
                            <div style={{ fontSize: '0.8rem', color: '#888', background: 'rgba(255,255,255,0.05)', padding: '5px 12px', borderRadius: '20px' }}>
                                {guests.length} {guests.length === 1 ? 'invitat' : 'invitați'} total
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '25px', padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                            <div style={{ flex: 1, minWidth: '200px' }}>
                                <label style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', marginBottom: '5px', display: 'block' }}>Adaugă Invitat Nou</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input
                                        placeholder="Nume"
                                        style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', flex: 1 }}
                                        value={newGuest.name}
                                        onChange={e => setNewGuest({ ...newGuest, name: e.target.value })}
                                    />
                                    <input
                                        placeholder="Email / Telefon"
                                        style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', flex: 1 }}
                                        value={newGuest.email}
                                        onChange={e => setNewGuest({ ...newGuest, email: e.target.value })}
                                    />
                                    <button
                                        onClick={handleAddGuest}
                                        style={{ padding: '10px 20px', background: 'var(--accent)', color: 'black', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}
                                    >
                                        <Plus size={18} /> Adaugă
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div style={{ position: 'relative', marginBottom: '20px' }}>
                            <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                            <input
                                placeholder="Caută după nume, email sau telefon..."
                                style={{ width: '100%', padding: '12px 12px 12px 45px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.9rem' }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <table className={styles.guestList}>
                            <thead>
                                <tr>
                                    <th>Nume</th>
                                    <th>Email / Telefon</th>
                                    <th>Status</th>
                                    <th>Acțiuni</th>
                                </tr>
                            </thead>
                            <tbody>
                                {guests.filter(g =>
                                    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    g.email.toLowerCase().includes(searchQuery.toLowerCase())
                                ).map((guest, index) => (
                                    <tr key={index}>
                                        <td style={{ fontWeight: '600' }}>{guest.name}</td>
                                        <td style={{ opacity: 0.8 }}>{guest.email}</td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${styles[guest.status]}`}>
                                                {guest.status === 'confirmed' ? 'Confirmat' : 'În Așteptare'}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleDeleteGuest(guest.id)}
                                                style={{ color: '#ff4444', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                                            >
                                                <Trash2 size={16} /> Șterge
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {guests.filter(g =>
                                    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    g.contact.toLowerCase().includes(searchQuery.toLowerCase())
                                ).length === 0 && (
                                        <tr>
                                            <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                                                Niciun rezultat găsit pentru "{searchQuery}"
                                            </td>
                                        </tr>
                                    )}
                            </tbody>
                        </table>
                    </section>
                )
            case 'preview':
                if (!selectedEvent) return <div>Selectează o invitație pentru previzualizare</div>
                return (
                    <>
                        <h2 className={styles.sectionTitle} style={{ marginBottom: '1rem' }}>Previzualizare Live: <span style={{ color: 'var(--accent)' }}>{selectedEvent.title}</span></h2>
                        <div className={styles.previewContainer}>
                            {selectedEvent.template === 'envelope' && <EnvelopeTemplate id={selectedEvent.id} {...selectedEvent} />}
                            {selectedEvent.template === 'netflix' && <NetflixTemplate id={selectedEvent.id} {...selectedEvent} />}
                            {selectedEvent.template === 'boarding' && <BoardingPassTemplate id={selectedEvent.id} {...selectedEvent} />}
                            {selectedEvent.template === 'vinyl' && <VinylTemplate id={selectedEvent.id} {...selectedEvent} />}
                            {selectedEvent.template === 'scratch' && <ScratchTemplate id={selectedEvent.id} {...selectedEvent} />}
                            {selectedEvent.template === 'passport' && <PassportTemplate id={selectedEvent.id} {...selectedEvent} />}
                            {selectedEvent.template === 'news' && <NewspaperTemplate id={selectedEvent.id} {...selectedEvent} />}
                            {selectedEvent.template === 'cinema' && <CinemaTemplate id={selectedEvent.id} {...selectedEvent} />}
                            {selectedEvent.template === 'festival' && <FestivalTemplate id={selectedEvent.id} {...selectedEvent} />}
                        </div>
                    </>
                )
            case 'billing':
                return <BillingPanel selectedEvent={selectedEvent} handlePayment={handlePayment} />

            default: // overview
                return (
                    <div className={styles.eventGrid}>
                        {events.map((ev) => (
                            <div
                                key={ev.id}
                                className={`${styles.invitationCard} ${selectedEvent?.id === ev.id ? styles.activeCard : ''}`}
                                onClick={() => {
                                    setSelectedEvent(ev)
                                    setActiveTab('overview')
                                }}
                            >
                                <div className={styles.cardHeader}>
                                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                        <div className={styles.cardIcon}>
                                            {ev.type === 'nunta' && <Heart size={24} />}
                                            {ev.type === 'botez' && <Baby size={24} />}
                                            {ev.type === 'party' && <PartyPopper size={24} />}
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleDeleteEvent(ev.id)
                                            }}
                                            style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', padding: '5px', opacity: 0.5, transition: 'opacity 0.2s' }}
                                            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                                            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.5')}
                                            title="Șterge Invitație"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <span className={`${styles.typeBadge} ${!ev.isPaid ? styles.draftBadge : ''}`}>
                                        {ev.isPaid ? 'Premium' : 'Draft'}
                                    </span>
                                </div>
                                <div className={styles.cardBody}>
                                    <h3>{ev.title}</h3>
                                    <div className={styles.cardDetails}>
                                        <span><Calendar size={12} style={{ marginRight: '5px' }} /> {ev.date}</span>
                                        <span><MapPin size={12} style={{ marginRight: '5px' }} /> {ev.location}</span>
                                    </div>
                                </div>
                                <div className={styles.cardFooter} style={{ flexWrap: 'wrap', gap: '10px' }}>
                                    <div className={styles.guestBadge}>
                                        <Users size={14} />
                                        <span>{ev._count?.guests || 0} Invitați</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {!ev.isPaid ? (
                                            <button
                                                className={styles.shareButton}
                                                style={{ padding: '6px 12px', fontSize: '0.75rem', background: '#fff', color: '#000' }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setSelectedEvent(ev)
                                                    handlePayment()
                                                }}
                                            >
                                                <Lock size={12} style={{ marginRight: '5px' }} /> Activează (20€)
                                            </button>
                                        ) : (
                                            <button
                                                className={styles.shareButton}
                                                style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    navigator.clipboard.writeText(`${window.location.origin}/invitatie/${ev.id}`)
                                                    alert('Link copiat!')
                                                }}
                                            >
                                                <LinkIcon size={12} style={{ marginRight: '5px' }} /> Copiază Link
                                            </button>
                                        )}
                                        <button
                                            className={styles.shareButton}
                                            style={{ padding: '6px 12px', fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', color: '#fff' }}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setActiveTab('preview')
                                                setSelectedEvent(ev)
                                            }}
                                        >
                                            <Eye size={14} style={{ marginRight: '5px' }} /> Vezi
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div
                            className={styles.invitationCard}
                            style={{ border: '2px dashed rgba(255,255,255,0.1)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
                            onClick={() => router.push('/create')}
                        >
                            <div>
                                <div style={{ marginBottom: '10px', color: '#444' }}><Plus size={40} /></div>
                                <div style={{ color: '#666', fontWeight: 'bold' }}>Creează Invitație Nouă</div>
                            </div>
                        </div>
                    </div>
                )
        }
    }

    return (
        <div className={styles.dashboardContainer}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>INVITONLINE</div>

                <h3 style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '1px' }}>Invitațiile Mele</h3>
                <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {events.map((ev) => (
                        <div
                            key={ev.id}
                            onClick={() => setSelectedEvent(ev)}
                            style={{
                                padding: '12px',
                                borderRadius: '10px',
                                border: '1px solid',
                                borderColor: selectedEvent?.id === ev.id ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                                background: selectedEvent?.id === ev.id ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.02)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                position: 'relative'
                            }}
                        >
                            <div style={{ fontWeight: 'bold', color: selectedEvent?.id === ev.id ? 'var(--accent)' : 'white', fontSize: '0.9rem' }}>{ev.title}</div>
                            <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                {ev.type} • {ev.date}
                            </div>
                            {ev._count && (
                                <div style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: selectedEvent?.id === ev.id ? 'var(--accent)' : '#333',
                                    color: selectedEvent?.id === ev.id ? 'black' : '#888',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    fontSize: '0.65rem',
                                    fontWeight: '900'
                                }}>
                                    {ev._count.guests}
                                </div>
                            )}
                        </div>
                    ))}
                    <button
                        onClick={() => router.push('/create')}
                        style={{ marginTop: '10px', padding: '8px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px dashed #444', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                        + Creează Nouă
                    </button>
                </div>

                <nav>
                    <div
                        className={`${styles.navItem} ${activeTab === 'overview' ? styles.activeNav : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Galeria Mea
                    </div>
                    <div
                        className={`${styles.navItem} ${activeTab === 'preview' ? styles.activeNav : ''}`}
                        onClick={() => setActiveTab('preview')}
                    >
                        Previzualizare
                    </div>
                    <div
                        className={`${styles.navItem} ${activeTab === 'guests' ? styles.activeNav : ''}`}
                        onClick={() => setActiveTab('guests')}
                    >
                        Lista Invitați
                    </div>
                    <div
                        className={`${styles.navItem} ${activeTab === 'billing' ? styles.activeNav : ''}`}
                        onClick={() => setActiveTab('billing')}
                    >
                        Facturare & Plată
                    </div>
                </nav>
            </aside>

            <main className={styles.mainContent}>
                <header className={styles.header}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <h1 className={styles.eventTitle}>{selectedEvent?.title || 'Selectează o invitație'}</h1>
                            {selectedEvent && (
                                <>
                                    {selectedEvent.isPaid ? (
                                        <span style={{ background: 'var(--accent)', color: 'black', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '900' }}>PREMIUM</span>
                                    ) : (
                                        <span style={{ background: '#333', color: '#888', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '900' }}>DRAFT</span>
                                    )}
                                </>
                            )}
                        </div>
                        {selectedEvent && (
                            <p className={styles.eventDate}>{selectedEvent.date} • {selectedEvent.location}</p>
                        )}
                    </div>
                </header>

                {renderContent()}
            </main>
        </div>
    )
}
