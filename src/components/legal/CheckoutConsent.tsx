'use client'

import Link from 'next/link'
import { useId } from 'react'
import { LEGAL_LINKS } from '@/config/legal'

// Acordul obligatoriu inainte de plata (OUG 34/2014, art. 16 lit. a si m). Nebifat implicit.
export default function CheckoutConsent({ checked, onChange, dark = true }: { checked: boolean, onChange: (v: boolean) => void, dark?: boolean }) {
    const id = useId()
    return (
        <label htmlFor={id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', textAlign: 'left', fontSize: '0.85rem', lineHeight: 1.5, color: dark ? '#bbb' : '#444', cursor: 'pointer', margin: '12px 0' }}>
            <input
                id={id}
                type="checkbox"
                required
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                style={{ marginTop: '3px', flexShrink: 0, width: '16px', height: '16px' }}
            />
            <span>
                Sunt de acord cu{' '}
                <Link href={LEGAL_LINKS.terms} target="_blank" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Termenii și condițiile</Link>{' '}
                și solicit furnizarea imediată a conținutului/serviciului digital. Iau la cunoștință că, odată cu începerea executării, îmi pierd
                dreptul de retragere de 14 zile (OUG 34/2014, art. 16 lit. a și m).
            </span>
        </label>
    )
}

export const CHECKOUT_CONSENT_REQUIRED = 'Bifează acordul privind Termenii și condițiile și furnizarea imediată pentru a continua la plată.'
