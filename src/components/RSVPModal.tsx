'use client'

import { useState } from 'react'

interface RSVPModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit?: (data: any) => void
    eventId?: string
}

export default function RSVPModal({ isOpen, onClose, onSubmit, eventId }: RSVPModalProps) {
    if (!isOpen) return null

    const [guestData, setGuestData] = useState({
        name: '',
        contact: '', // Email or Phone
        persons: 1,
        message: ''
    })

    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (eventId) {
            try {
                await fetch('/api/guests', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...guestData, eventId })
                })
            } catch (error) {
                console.error('RSVP Error:', error)
            }
        }

        if (onSubmit) onSubmit(guestData)
        setIsSubmitted(true)
    }

    if (isSubmitted) {
        return (
            <div style={overlayStyle}>
                <div style={modalStyle}>
                    <h2 style={{ color: '#d4af37', marginBottom: '1rem' }}>Mulțumim!</h2>
                    <p>Confirmarea a fost înregistrată.</p>
                    <p style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>{guestData.name}</p>
                    <div style={{ marginTop: '2rem' }}>
                        <button onClick={onClose} style={buttonStyle}>Închide</button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <button onClick={onClose} style={closeBtnStyle}>&times;</button>
                <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Confirmă Prezența</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={labelStyle}>Nume Complet</label>
                        <input
                            required
                            style={inputStyle}
                            type="text"
                            placeholder="Ex: Familia Popescu"
                            value={guestData.name}
                            onChange={(e) => setGuestData({ ...guestData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Email sau Telefon</label>
                        <input
                            required
                            style={inputStyle}
                            type="text"
                            placeholder="07xx... / email@yahoo.com"
                            value={guestData.contact}
                            onChange={(e) => setGuestData({ ...guestData, contact: e.target.value })}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Număr Persoane</label>
                        <select
                            style={inputStyle}
                            value={guestData.persons}
                            onChange={(e) => setGuestData({ ...guestData, persons: Number(e.target.value) })}
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                <option key={n} value={n}>{n} {n === 1 ? 'Persoană' : 'Persoane'}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={labelStyle}>Mesaj pentru Gazde (Opțional)</label>
                        <textarea
                            style={{ ...inputStyle, minHeight: '80px' }}
                            placeholder="Ex: Meniu vegetarian..."
                            value={guestData.message}
                            onChange={(e) => setGuestData({ ...guestData, message: e.target.value })}
                        />
                    </div>

                    <button type="submit" style={submitBtnStyle}>
                        TRIMITE CONFIRMAREA
                    </button>
                </form>
            </div>
        </div>
    )
}

// Simple inline styles for the modal
const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '20px'
}

const modalStyle: React.CSSProperties = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '15px',
    maxWidth: '400px',
    width: '100%',
    position: 'relative',
    color: '#333',
    boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
}

const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    color: '#555'
}

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '1rem',
    fontFamily: 'inherit'
}

const submitBtnStyle: React.CSSProperties = {
    backgroundColor: '#d4af37',
    color: 'white',
    border: 'none',
    padding: '12px',
    fontSize: '1rem',
    fontWeight: 'bold',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '1rem',
    transition: 'background 0.3s'
}

const closeBtnStyle: React.CSSProperties = {
    position: 'absolute',
    top: '10px',
    right: '15px',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#999'
}

const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    backgroundColor: '#333',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
}
