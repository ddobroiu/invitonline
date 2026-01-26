'use client'

import { useState, useEffect } from 'react'
import { Search, Loader2, CheckCircle, Receipt, Download, Building, User as UserIcon } from 'lucide-react'
import styles from '@/app/dashboard/page.module.css'

interface BillingInfo {
    billingType: 'individual' | 'company';
    companyName: string; // Full Name or Firm Name
    cui: string;
    regCom: string;
    address: string;
    city: string;
    county: string;
}

interface Order {
    id: string;
    amount: number;
    currency: string;
    status: string;
    invoiceLink: string | null;
    invoiceSeries: string | null;
    invoiceNumber: string | null;
    createdAt: string;
    event?: {
        title: string;
    }
}

export default function BillingPanel({
    selectedEvent,
    handlePayment,
    hideHistory = false,
    hideStatus = false,
    onSaveSuccess,
    buttonText = 'Salvează și Continuă'
}: {
    selectedEvent?: any,
    handlePayment?: () => void,
    hideHistory?: boolean,
    hideStatus?: boolean,
    onSaveSuccess?: () => void,
    buttonText?: string
}) {
    const [billingInfo, setBillingInfo] = useState<BillingInfo>({
        billingType: 'company',
        companyName: '',
        cui: '',
        regCom: '',
        address: '',
        city: '',
        county: ''
    })

    const [transactions, setTransactions] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSearching, setIsSearching] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [searchError, setSearchError] = useState('')

    useEffect(() => {
        fetchBillingInfo()
        if (!hideHistory) fetchTransactions()
    }, [hideHistory])

    const fetchBillingInfo = async () => {
        try {
            const res = await fetch('/api/user/billing')
            if (res.ok) {
                const data = await res.json()
                if (data && (data.companyName || data.cui)) {
                    setBillingInfo(prev => ({
                        ...prev,
                        ...data,
                        billingType: data.cui ? 'company' : 'individual'
                    }))
                }
            }
        } catch (error) {
            console.error('Fetch billing error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchTransactions = async () => {
        try {
            const res = await fetch('/api/user/orders')
            if (res.ok) {
                const data = await res.json()
                setTransactions(data.transactions || [])
            }
        } catch (error) {
            console.error('Fetch transactions error:', error)
        }
    }

    const handleCuiLookup = async () => {
        if (!billingInfo.cui) return
        setIsSearching(true)
        setSearchError('')
        try {
            const res = await fetch(`/api/company?cui=${billingInfo.cui}`)
            if (res.ok) {
                const data = await res.json()
                setBillingInfo(prev => ({
                    ...prev,
                    companyName: data.companyName,
                    regCom: data.regCom,
                    address: data.address,
                    city: data.city,
                    county: data.county
                }))
            } else {
                setSearchError('CUI-ul nu a fost găsit.')
            }
        } catch (error) {
            setSearchError('Eroare la căutare.')
        } finally {
            setIsSearching(false)
        }
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const res = await fetch('/api/user/billing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(billingInfo)
            })
            if (res.ok) {
                if (onSaveSuccess) onSaveSuccess()
                else alert('Salvat cu succes!')
            }
        } catch (error) {
            alert('Eroare la salvare.')
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) return <div style={{ padding: '40px', textAlign: 'center' }}><Loader2 className="animate-spin" style={{ margin: '0 auto', color: '#d4af37' }} /></div>

    const colorPrimary = '#d4af37'

    return (
        <section className={styles.billingSection} style={{ padding: 0 }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: hideHistory ? '1fr' : '1fr 1.2fr',
                gap: '30px'
            }}>

                {/* Left Column: Form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className={styles.invitationCard} style={{
                        background: '#0f0f12',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '24px',
                        padding: '30px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                        height: 'auto'
                    }}>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '25px', color: '#fff' }}>Detalii Facturare</h2>

                        {/* Toggle Container */}
                        <div style={{
                            display: 'flex',
                            background: 'rgba(255,255,255,0.04)',
                            borderRadius: '10px',
                            padding: '4px',
                            marginBottom: '25px',
                            border: '1px solid rgba(255,255,255,0.03)'
                        }}>
                            <button
                                type="button"
                                onClick={() => setBillingInfo({ ...billingInfo, billingType: 'company' })}
                                style={{
                                    flex: 1, padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer',
                                    background: billingInfo.billingType === 'company' ? colorPrimary : 'transparent',
                                    color: '#fff', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s'
                                }}
                            >
                                Persoană Juridică
                            </button>
                            <button
                                type="button"
                                onClick={() => setBillingInfo({ ...billingInfo, billingType: 'individual' })}
                                style={{
                                    flex: 1, padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer',
                                    background: billingInfo.billingType === 'individual' ? colorPrimary : 'transparent',
                                    color: '#fff', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s'
                                }}
                            >
                                Persoană Fizică
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                            {/* Juridica specific: CUI */}
                            {billingInfo.billingType === 'company' && (
                                <div className={styles.formGroup}>
                                    <label className={styles.label} style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '6px' }}>CUI / CIF</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            className={styles.input}
                                            value={billingInfo.cui}
                                            onChange={(e) => setBillingInfo({ ...billingInfo, cui: e.target.value })}
                                            onBlur={handleCuiLookup}
                                            placeholder="Introdu CUI pentru autocompletare"
                                            style={{
                                                width: '100%',
                                                background: 'rgba(0,0,0,0.2)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '12px',
                                                padding: '14px 16px',
                                                color: '#fff',
                                                fontSize: '1rem',
                                                outline: 'none'
                                            }}
                                        />
                                        {isSearching && <Loader2 size={18} className="animate-spin" style={{ position: 'absolute', right: '12px', top: '15px', color: colorPrimary }} />}
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '6px' }}>
                                        Introducerea CUI-ului va completa automat datele firmei.
                                    </p>
                                </div>
                            )}

                            {/* Name / Firm Name */}
                            <div style={{ display: 'grid', gridTemplateColumns: billingInfo.billingType === 'company' ? '1.5fr 1fr' : '1fr', gap: '15px' }}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label} style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '6px' }}>
                                        {billingInfo.billingType === 'company' ? 'Denumire Firmă' : 'Nume și Prenume'}
                                    </label>
                                    <input
                                        className={styles.input}
                                        value={billingInfo.companyName}
                                        onChange={(e) => setBillingInfo({ ...billingInfo, companyName: e.target.value })}
                                        style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px', color: '#fff', fontSize: '1rem' }}
                                    />
                                </div>
                                {billingInfo.billingType === 'company' && (
                                    <div className={styles.formGroup}>
                                        <label className={styles.label} style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '6px' }}>Reg. Com.</label>
                                        <input
                                            className={styles.input}
                                            value={billingInfo.regCom}
                                            onChange={(e) => setBillingInfo({ ...billingInfo, regCom: e.target.value })}
                                            placeholder="J40/..."
                                            style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px', color: '#fff', fontSize: '1rem' }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Address */}
                            <div className={styles.formGroup}>
                                <label className={styles.label} style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '6px' }}>Adresa</label>
                                <input
                                    className={styles.input}
                                    value={billingInfo.address}
                                    onChange={(e) => setBillingInfo({ ...billingInfo, address: e.target.value })}
                                    placeholder="Stradă, număr, bloc..."
                                    style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px', color: '#fff', fontSize: '1rem' }}
                                />
                            </div>

                            {/* City / County */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label} style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '6px' }}>Localitate</label>
                                    <input
                                        className={styles.input}
                                        value={billingInfo.city}
                                        onChange={(e) => setBillingInfo({ ...billingInfo, city: e.target.value })}
                                        style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px', color: '#fff', fontSize: '1rem' }}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label} style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '6px' }}>Județ</label>
                                    <input
                                        className={styles.input}
                                        value={billingInfo.county}
                                        onChange={(e) => setBillingInfo({ ...billingInfo, county: e.target.value })}
                                        style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px', color: '#fff', fontSize: '1rem' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '10px' }}>
                                <button type="button" style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '0.9rem' }}>Anulează</button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    style={{
                                        padding: '14px 30px',
                                        background: colorPrimary,
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        fontWeight: 700,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        fontSize: '0.95rem',
                                        boxShadow: '0 10px 20px rgba(212, 175, 55, 0.2)'
                                    }}
                                >
                                    {isSaving ? <Loader2 size={20} className="animate-spin" /> : buttonText}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Invoices List */}
                {!hideHistory && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className={styles.invitationCard} style={{
                            background: '#0a0a0c',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '24px',
                            padding: '25px',
                            height: '100%'
                        }}>
                            <div style={{ padding: '0 0 20px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Receipt size={20} color={colorPrimary} />
                                    <span style={{ fontWeight: 700, color: '#fff' }}>Istoric Facturi</span>
                                </div>
                            </div>

                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                    <thead>
                                        <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <th style={{ padding: '12px 10px', color: '#555', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem' }}>Dată</th>
                                            <th style={{ padding: '12px 10px', color: '#555', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem' }}>Detalii</th>
                                            <th style={{ padding: '12px 10px', color: '#555', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem' }}>Sumă</th>
                                            <th style={{ padding: '12px 10px', color: '#555', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem' }}>Factură</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#444' }}>
                                                    Încă nu ai nicio factură emisă.
                                                </td>
                                            </tr>
                                        ) : (
                                            transactions.map(tx => (
                                                <tr key={tx.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                                    <td style={{ padding: '15px 10px', color: '#888' }}>
                                                        {new Date(tx.createdAt).toLocaleDateString('ro-RO')}
                                                    </td>
                                                    <td style={{ padding: '15px 10px' }}>
                                                        <div style={{ fontWeight: 600, color: '#ddd' }}>{tx.event?.title || 'Activare'}</div>
                                                    </td>
                                                    <td style={{ padding: '15px 10px', fontWeight: 700, color: '#fff' }}>
                                                        {tx.amount} {tx.currency}
                                                    </td>
                                                    <td style={{ padding: '15px 10px' }}>
                                                        {tx.invoiceLink ? (
                                                            <a
                                                                href={tx.invoiceLink}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                style={{ display: 'flex', alignItems: 'center', gap: '5px', color: colorPrimary, textDecoration: 'none', fontWeight: 700 }}
                                                            >
                                                                <Download size={14} /> PDF
                                                            </a>
                                                        ) : (
                                                            <span style={{ color: '#444' }}>-</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}
