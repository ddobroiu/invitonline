'use client'

import { useEffect, useId, useState } from 'react'
import { createPortal } from 'react-dom'

interface RSVPModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit?: (data: any) => void
    eventId?: string
}

const initialData = { name: '', contact: '', persons: 1, message: '', attending: true }

export default function RSVPModal({ isOpen, onClose, onSubmit, eventId }: RSVPModalProps) {
    const [guestData, setGuestData] = useState(initialData)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isSending, setIsSending] = useState(false)
    const [error, setError] = useState('')
    const [mounted, setMounted] = useState(false)
    const uid = useId()
    const fid = (name: string) => `${uid}-${name}`

    useEffect(() => setMounted(true), [])

    // Close on Escape
    useEffect(() => {
        if (!isOpen) return
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [isOpen, onClose])

    if (!isOpen || !mounted) return null

    const handleClose = () => {
        if (isSubmitted) {
            setGuestData(initialData)
            setIsSubmitted(false)
        }
        setError('')
        onClose()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // Without an event id we're in a preview/demo: simulate success
        if (eventId) {
            setIsSending(true)
            try {
                const res = await fetch('/api/guests', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        eventId,
                        name: guestData.name,
                        contact: guestData.contact,
                        persons: guestData.attending ? guestData.persons : 0,
                        message: guestData.message,
                        status: guestData.attending ? 'confirmed' : 'declined',
                    })
                })
                if (!res.ok) {
                    const data = await res.json().catch(() => ({}))
                    setError(data.message || 'Nu am putut trimite răspunsul. Încearcă din nou.')
                    return
                }
            } catch {
                setError('Problemă de conexiune. Încearcă din nou.')
                return
            } finally {
                setIsSending(false)
            }
        }

        onSubmit?.(guestData)
        setIsSubmitted(true)
    }

    const modal = (
        <div style={overlayStyle} onClick={handleClose}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby={fid('title')}>
                <button type="button" onClick={handleClose} style={closeBtnStyle} aria-label="Închide">&times;</button>

                {isSubmitted ? (
                    <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{guestData.attending ? '🎉' : '💌'}</div>
                        <h2 id={fid('title')} style={titleStyle}>Mulțumim, {guestData.name}!</h2>
                        <p style={{ color: '#555', marginTop: '0.5rem' }}>
                            {guestData.attending
                                ? 'Confirmarea ta a fost înregistrată. Abia așteptăm să ne vedem!'
                                : 'Răspunsul tău a fost înregistrat. Ne pare rău că nu poți ajunge.'}
                        </p>
                        {!eventId && (
                            <p style={{ color: '#999', fontSize: '0.8rem', marginTop: '1rem' }}>
                                (Previzualizare — în invitația reală răspunsul ajunge la organizator.)
                            </p>
                        )}
                        <button type="button" onClick={handleClose} style={{ ...submitBtnStyle, marginTop: '1.5rem' }}>Închide</button>
                    </div>
                ) : (
                    <>
                        <h2 id={fid('title')} style={titleStyle}>Confirmă prezența</h2>
                        <p style={{ color: '#777', fontSize: '0.9rem', margin: '0.25rem 0 1.25rem' }}>Te rugăm să ne anunți dacă vei fi alături de noi.</p>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                {[true, false].map((val) => (
                                    <button
                                        key={String(val)}
                                        type="button"
                                        aria-pressed={guestData.attending === val}
                                        onClick={() => setGuestData({ ...guestData, attending: val })}
                                        style={{
                                            ...choiceStyle,
                                            borderColor: guestData.attending === val ? '#b8962e' : '#ddd',
                                            background: guestData.attending === val ? '#fbf6e6' : '#fff',
                                            color: guestData.attending === val ? '#7a5f12' : '#666',
                                        }}
                                    >
                                        {val ? '✓ Particip' : '✕ Nu pot ajunge'}
                                    </button>
                                ))}
                            </div>

                            <div>
                                <label style={labelStyle} htmlFor={fid('name')}>Nume complet</label>
                                <input
                                    id={fid('name')}
                                    required
                                    autoComplete="name"
                                    style={inputStyle}
                                    type="text"
                                    placeholder="Ex: Familia Popescu"
                                    value={guestData.name}
                                    onChange={(e) => setGuestData({ ...guestData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label style={labelStyle} htmlFor={fid('contact')}>Email sau telefon</label>
                                <input
                                    id={fid('contact')}
                                    required
                                    style={inputStyle}
                                    type="text"
                                    placeholder="07xx xxx xxx / email@exemplu.ro"
                                    value={guestData.contact}
                                    onChange={(e) => setGuestData({ ...guestData, contact: e.target.value })}
                                />
                            </div>

                            {guestData.attending && (
                                <div>
                                    <label style={labelStyle} htmlFor={fid('persons')}>Număr persoane</label>
                                    <select
                                        id={fid('persons')}
                                        style={inputStyle}
                                        value={guestData.persons}
                                        onChange={(e) => setGuestData({ ...guestData, persons: Number(e.target.value) })}
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                            <option key={n} value={n}>{n} {n === 1 ? 'persoană' : 'persoane'}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label style={labelStyle} htmlFor={fid('message')}>Mesaj pentru gazde (opțional)</label>
                                <textarea
                                    id={fid('message')}
                                    style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }}
                                    placeholder="Ex: meniu vegetarian, venim cu un copil..."
                                    value={guestData.message}
                                    onChange={(e) => setGuestData({ ...guestData, message: e.target.value })}
                                />
                            </div>

                            {error && <p role="alert" style={{ color: '#c62828', fontSize: '0.85rem' }}>{error}</p>}

                            <button type="submit" style={{ ...submitBtnStyle, opacity: isSending ? 0.7 : 1 }} disabled={isSending}>
                                {isSending ? 'Se trimite...' : 'Trimite răspunsul'}
                            </button>
                            <p style={{ color: '#888', fontSize: '0.72rem', lineHeight: 1.45, margin: 0 }}>
                                Răspunsul tău ajunge la organizatorul evenimentului (operatorul datelor); InvitOnline îl stochează în numele acestuia.
                                Te rugăm să nu incluzi informații despre sănătate (ex. alergii) decât dacă sunt necesare.{' '}
                                <a href="/politica-de-confidentialitate" target="_blank" rel="noopener noreferrer" style={{ color: '#7a5f12', textDecoration: 'underline' }}>Politica de confidențialitate</a>
                            </p>
                        </form>
                    </>
                )}
            </div>
        </div>
    )

    // Portal to body so the modal isn't clipped by template containers or transforms
    return createPortal(modal, document.body)
}

const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.75)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '16px',
    overflowY: 'auto',
}

const modalStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    padding: '2rem 1.5rem 1.5rem',
    borderRadius: '20px',
    maxWidth: '420px',
    width: '100%',
    position: 'relative',
    color: '#333',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    fontFamily: 'var(--font-body), system-ui, sans-serif',
    margin: 'auto',
}

const titleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading), Georgia, serif',
    fontSize: '1.6rem',
    color: '#222',
}

const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '0.35rem',
    fontWeight: 600,
    fontSize: '0.8rem',
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
}

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px 12px',
    borderRadius: '10px',
    border: '1px solid #ddd',
    fontSize: '1rem',
    fontFamily: 'inherit',
    color: '#222',
    background: '#fafafa',
}

const choiceStyle: React.CSSProperties = {
    padding: '12px 8px',
    borderRadius: '12px',
    border: '2px solid #ddd',
    fontWeight: 700,
    fontSize: '0.9rem',
    cursor: 'pointer',
    fontFamily: 'inherit',
}

const submitBtnStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: '#b8962e',
    color: '#fff',
    border: 'none',
    padding: '14px',
    fontSize: '1rem',
    fontWeight: 700,
    borderRadius: '12px',
    cursor: 'pointer',
    marginTop: '0.5rem',
    fontFamily: 'inherit',
}

const closeBtnStyle: React.CSSProperties = {
    position: 'absolute',
    top: '10px',
    right: '14px',
    background: 'none',
    border: 'none',
    fontSize: '1.8rem',
    lineHeight: 1,
    cursor: 'pointer',
    color: '#999',
}
