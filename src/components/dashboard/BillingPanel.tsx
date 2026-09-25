'use client'

import { useState, useEffect, useCallback } from 'react'
import { Loader2, Receipt, Download, CheckCircle, AlertCircle } from 'lucide-react'
import styles from '@/app/dashboard/page.module.css'

interface BillingInfo {
    billingType: 'individual' | 'company'
    companyName: string // Full name or company name
    cui: string
    regCom: string
    address: string
    city: string
    county: string
}

interface Order {
    id: string
    amount: number
    currency: string
    status: string
    invoiceLink: string | null
    invoiceSeries: string | null
    invoiceNumber: string | null
    createdAt: string
    event?: {
        title: string
    }
}

const EMPTY: BillingInfo = {
    billingType: 'company',
    companyName: '',
    cui: '',
    regCom: '',
    address: '',
    city: '',
    county: '',
}

export default function BillingPanel({
    hideHistory = false,
    onSaveSuccess,
    buttonText = 'Salvează datele',
}: {
    hideHistory?: boolean
    onSaveSuccess?: () => void
    buttonText?: string
}) {
    const [billingInfo, setBillingInfo] = useState<BillingInfo>(EMPTY)
    const [savedInfo, setSavedInfo] = useState<BillingInfo>(EMPTY)
    const [transactions, setTransactions] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSearching, setIsSearching] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [searchError, setSearchError] = useState('')
    const [lastLookup, setLastLookup] = useState('')
    const [status, setStatus] = useState<{ type: 'ok' | 'error', text: string } | null>(null)

    const fetchBillingInfo = useCallback(async () => {
        try {
            const res = await fetch('/api/user/billing')
            if (res.ok) {
                const data = await res.json()
                if (data && (data.companyName || data.cui)) {
                    const info: BillingInfo = {
                        billingType: data.cui ? 'company' : 'individual',
                        companyName: data.companyName || '',
                        cui: data.cui || '',
                        regCom: data.regCom || '',
                        address: data.address || '',
                        city: data.city || '',
                        county: data.county || '',
                    }
                    setBillingInfo(info)
                    setSavedInfo(info)
                    setLastLookup(info.cui)
                }
            }
        } catch (error) {
            console.error('Fetch billing error:', error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    const fetchTransactions = useCallback(async () => {
        try {
            const res = await fetch('/api/user/orders')
            if (res.ok) {
                const data = await res.json()
                setTransactions(data.transactions || [])
            }
        } catch (error) {
            console.error('Fetch transactions error:', error)
        }
    }, [])

    useEffect(() => {
        fetchBillingInfo()
        if (!hideHistory) fetchTransactions()
    }, [hideHistory, fetchBillingInfo, fetchTransactions])

    const set = (patch: Partial<BillingInfo>) => {
        setBillingInfo(prev => ({ ...prev, ...patch }))
        setStatus(null)
    }

    const handleCuiLookup = async () => {
        const cui = billingInfo.cui.replace(/\D/g, '')
        if (!cui || cui === lastLookup.replace(/\D/g, '')) return
        setLastLookup(billingInfo.cui)
        setIsSearching(true)
        setSearchError('')
        try {
            const res = await fetch(`/api/company?cui=${encodeURIComponent(cui)}`)
            if (res.ok) {
                const data = await res.json()
                setBillingInfo(prev => ({
                    ...prev,
                    companyName: data.companyName || prev.companyName,
                    regCom: data.regCom || prev.regCom,
                    address: data.address || prev.address,
                    city: data.city && data.city !== '-' ? data.city : prev.city,
                    county: data.county && data.county !== '-' ? data.county : prev.county,
                }))
            } else {
                setSearchError('Nu am găsit firma automat. Completează datele manual.')
            }
        } catch {
            setSearchError('Căutarea automată nu este disponibilă acum. Completează datele manual.')
        } finally {
            setIsSearching(false)
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        setStatus(null)
        const isCompany = billingInfo.billingType === 'company'
        const payload = {
            ...billingInfo,
            cui: isCompany ? billingInfo.cui.trim() : '',
            regCom: isCompany ? billingInfo.regCom.trim() : '',
        }
        try {
            const res = await fetch('/api/user/billing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            if (res.ok) {
                const saved = { ...payload }
                setBillingInfo(saved)
                setSavedInfo(saved)
                setStatus({ type: 'ok', text: 'Datele de facturare au fost salvate.' })
                onSaveSuccess?.()
            } else {
                setStatus({ type: 'error', text: 'Nu am putut salva datele. Încearcă din nou.' })
            }
        } catch {
            setStatus({ type: 'error', text: 'Eroare de rețea. Verifică conexiunea și încearcă din nou.' })
        } finally {
            setIsSaving(false)
        }
    }

    const handleReset = () => {
        setBillingInfo(savedInfo)
        setSearchError('')
        setStatus(null)
    }

    if (isLoading) {
        return <div className={styles.billingLoading}><Loader2 className="animate-spin" color="var(--accent)" /></div>
    }

    const isCompany = billingInfo.billingType === 'company'
    const isDirty = JSON.stringify(billingInfo) !== JSON.stringify(savedInfo)

    return (
        <section className={`${styles.billingSection} ${hideHistory ? styles.billingSingle : ''}`}>
            <form className={styles.billingCard} onSubmit={handleSave}>
                <h2 className={styles.billingTitle}>Detalii facturare</h2>
                <p className={styles.billingHint}>Folosim aceste date pentru factura emisă la activarea invitației.</p>

                <div className={styles.segmented} role="group" aria-label="Tip facturare">
                    <button
                        type="button"
                        aria-pressed={isCompany}
                        className={isCompany ? styles.segmentActive : ''}
                        onClick={() => set({ billingType: 'company' })}
                    >
                        Persoană juridică
                    </button>
                    <button
                        type="button"
                        aria-pressed={!isCompany}
                        className={!isCompany ? styles.segmentActive : ''}
                        onClick={() => { set({ billingType: 'individual' }); setSearchError('') }}
                    >
                        Persoană fizică
                    </button>
                </div>

                <div className={styles.billingFields}>
                    {isCompany && (
                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="billing-cui">CUI / CIF</label>
                            <div className={styles.inputWithIcon}>
                                <input
                                    id="billing-cui"
                                    className={styles.input}
                                    value={billingInfo.cui}
                                    inputMode="numeric"
                                    onChange={(e) => { set({ cui: e.target.value }); setSearchError('') }}
                                    onBlur={handleCuiLookup}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleCuiLookup() } }}
                                    placeholder="Ex: RO12345678"
                                />
                                {isSearching && <Loader2 size={18} className="animate-spin" />}
                            </div>
                            {searchError
                                ? <span className={styles.fieldWarning}><AlertCircle size={13} /> {searchError}</span>
                                : <span className={styles.fieldHint}>Completăm automat datele firmei din ANAF.</span>}
                        </div>
                    )}

                    <div className={`${styles.billingRow} ${isCompany ? styles.billingRowWide : ''}`}>
                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="billing-name">{isCompany ? 'Denumire firmă' : 'Nume și prenume'}</label>
                            <input
                                id="billing-name"
                                className={styles.input}
                                value={billingInfo.companyName}
                                onChange={(e) => set({ companyName: e.target.value })}
                                placeholder={isCompany ? 'Ex: Firma Mea SRL' : 'Ex: Andrei Popescu'}
                                autoComplete={isCompany ? 'organization' : 'name'}
                            />
                        </div>
                        {isCompany && (
                            <div className={styles.formGroup}>
                                <label className={styles.label} htmlFor="billing-regcom">Nr. Reg. Com.</label>
                                <input
                                    id="billing-regcom"
                                    className={styles.input}
                                    value={billingInfo.regCom}
                                    onChange={(e) => set({ regCom: e.target.value })}
                                    placeholder="J40/..."
                                />
                            </div>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="billing-address">Adresă</label>
                        <input
                            id="billing-address"
                            className={styles.input}
                            value={billingInfo.address}
                            onChange={(e) => set({ address: e.target.value })}
                            placeholder="Stradă, număr, bloc..."
                            autoComplete="street-address"
                        />
                    </div>

                    <div className={styles.billingRow}>
                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="billing-city">Localitate</label>
                            <input
                                id="billing-city"
                                className={styles.input}
                                value={billingInfo.city}
                                onChange={(e) => set({ city: e.target.value })}
                                placeholder="Ex: București"
                                autoComplete="address-level2"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="billing-county">Județ</label>
                            <input
                                id="billing-county"
                                className={styles.input}
                                value={billingInfo.county}
                                onChange={(e) => set({ county: e.target.value })}
                                placeholder="Ex: Ilfov"
                                autoComplete="address-level1"
                            />
                        </div>
                    </div>

                    {status && (
                        <p className={status.type === 'ok' ? styles.statusOk : styles.statusError} role="status">
                            {status.type === 'ok' ? <CheckCircle size={16} /> : <AlertCircle size={16} />} {status.text}
                        </p>
                    )}

                    <div className={styles.billingActions}>
                        <button type="button" className={styles.linkBtn} onClick={handleReset} disabled={!isDirty || isSaving}>
                            Anulează modificările
                        </button>
                        <button type="submit" className={styles.primaryBtn} disabled={isSaving}>
                            {isSaving ? <Loader2 size={18} className="animate-spin" /> : null}
                            {isSaving ? 'Se salvează...' : buttonText}
                        </button>
                    </div>
                </div>
            </form>

            {!hideHistory && (
                <div className={styles.billingCard}>
                    <div className={styles.billingHistoryHead}>
                        <Receipt size={20} color="var(--accent)" />
                        <h2 className={styles.billingTitle}>Istoric facturi</h2>
                    </div>

                    {transactions.length === 0 ? (
                        <p className={styles.billingEmpty}>Încă nu ai nicio factură emisă. Facturile apar aici după activarea unei invitații.</p>
                    ) : (
                        <div className={styles.tableWrap}>
                            <table className={styles.invoiceTable}>
                                <thead>
                                    <tr>
                                        <th>Dată</th>
                                        <th>Detalii</th>
                                        <th>Sumă</th>
                                        <th>Factură</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map(tx => (
                                        <tr key={tx.id}>
                                            <td className={styles.muted}>{new Date(tx.createdAt).toLocaleDateString('ro-RO')}</td>
                                            <td className={styles.guestName}>{tx.event?.title || 'Activare invitație'}</td>
                                            <td><strong>{tx.amount} {tx.currency?.toUpperCase()}</strong></td>
                                            <td>
                                                {tx.invoiceLink ? (
                                                    <a href={tx.invoiceLink} target="_blank" rel="noopener noreferrer" className={styles.invoiceLink}>
                                                        <Download size={14} /> PDF
                                                    </a>
                                                ) : (
                                                    <span className={styles.muted}>—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </section>
    )
}
