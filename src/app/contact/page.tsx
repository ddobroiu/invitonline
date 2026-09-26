import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPage from '@/components/legal/LegalPage'
import OperatorDetails from '@/components/legal/OperatorDetails'
import { ANPC_SAL_URL, ANPC_URL, COMPANY, LEGAL_LINKS } from '@/config/legal'

export const metadata: Metadata = {
    title: 'Contact',
    description: 'Date de contact și de identificare ale operatorului InvitOnline.',
    alternates: { canonical: LEGAL_LINKS.contact },
}

export default function ContactPage() {
    return (
        <LegalPage title="Contact" showVersion={false}>
            <p>
                Pentru întrebări, suport, reclamații sau cereri privind datele personale ne scrii la{' '}
                <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>. Nu oferim suport telefonic.
            </p>

            <h2>Date de identificare</h2>
            <OperatorDetails />

            <h2>Protecția consumatorilor</h2>
            <p>
                <a href={ANPC_URL} target="_blank" rel="noopener noreferrer">Autoritatea Națională pentru Protecția Consumatorilor (ANPC)</a> ·{' '}
                <a href={ANPC_SAL_URL} target="_blank" rel="noopener noreferrer">ANPC – SAL (Soluționarea alternativă a litigiilor)</a>
            </p>

            <h2>Documente</h2>
            <ul>
                <li><Link href={LEGAL_LINKS.terms}>Termeni și condiții</Link></li>
                <li><Link href={LEGAL_LINKS.privacy}>Politica de confidențialitate</Link></li>
                <li><Link href={LEGAL_LINKS.cookies}>Politica de cookies</Link></li>
            </ul>
        </LegalPage>
    )
}
