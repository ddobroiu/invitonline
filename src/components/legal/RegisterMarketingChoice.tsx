'use client'

import { useId } from 'react'
import { SIGNUP_MARKETING_NOTICE, SIGNUP_OPT_OUT_LABEL } from '@/lib/lifecycle/consent'

// E-mailurile cu sfaturi la crearea contului (Legea 506/2004 art. 12 alin. 2): informarea si, gratuit,
// posibilitatea de a refuza chiar aici. Bifa e de refuz si e nebifata implicit.
export default function RegisterMarketingChoice({ optOut, onChange }: { optOut: boolean, onChange: (v: boolean) => void }) {
    const id = useId()
    return (
        <div style={{ textAlign: 'left', fontSize: '0.8rem', lineHeight: 1.5, color: '#999', margin: '0 0 12px' }}>
            <p style={{ margin: '0 0 6px' }}>{SIGNUP_MARKETING_NOTICE}</p>
            <label htmlFor={id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', color: '#bbb', cursor: 'pointer' }}>
                <input
                    id={id}
                    type="checkbox"
                    checked={optOut}
                    onChange={(e) => onChange(e.target.checked)}
                    style={{ marginTop: '3px', flexShrink: 0, width: '16px', height: '16px' }}
                />
                <span>{SIGNUP_OPT_OUT_LABEL}</span>
            </label>
        </div>
    )
}
