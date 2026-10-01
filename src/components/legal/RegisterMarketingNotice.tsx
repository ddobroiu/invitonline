import { SIGNUP_MARKETING_NOTICE } from '@/lib/lifecycle/consent'

// E-mailurile cu sfaturi la crearea contului (Legea 506/2004 art. 12 alin. 2): doar informarea, fara bifa.
// Refuzul, gratuit si cu un click, e linkul de dezabonare din fiecare e-mail (/dezabonare).
export default function RegisterMarketingNotice() {
    return (
        <p style={{ textAlign: 'left', fontSize: '0.8rem', lineHeight: 1.5, color: '#999', margin: '0 0 12px' }}>
            {SIGNUP_MARKETING_NOTICE}
        </p>
    )
}
