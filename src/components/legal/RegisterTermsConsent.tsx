'use client'

import Link from 'next/link'
import { useId } from 'react'
import { LEGAL_LINKS } from '@/config/legal'

// Acceptarea termenilor la crearea contului (obligatorie, nebifata implicit)
export default function RegisterTermsConsent({ checked, onChange }: { checked: boolean, onChange: (v: boolean) => void }) {
    const id = useId()
    const link: React.CSSProperties = { color: 'var(--accent)', textDecoration: 'underline' }
    return (
        <label htmlFor={id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', textAlign: 'left', fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--site-muted)', cursor: 'pointer', margin: '4px 0 12px' }}>
            <input
                id={id}
                type="checkbox"
                required
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                style={{ marginTop: '3px', flexShrink: 0, width: '16px', height: '16px' }}
            />
            <span>
                Am cel puțin 18 ani și sunt de acord cu{' '}
                <Link href={LEGAL_LINKS.terms} target="_blank" style={link}>Termenii și condițiile</Link>. Am luat la cunoștință{' '}
                <Link href={LEGAL_LINKS.privacy} target="_blank" style={link}>Politica de confidențialitate</Link>.
            </span>
        </label>
    )
}
