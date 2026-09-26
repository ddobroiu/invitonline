import { COMPANY, COMPANY_ADDRESS_LINE } from '@/config/legal'

export default function OperatorDetails() {
    return (
        <ul>
            <li><strong>Denumire:</strong> {COMPANY.name}</li>
            <li><strong>CUI:</strong> {COMPANY.cui} ({COMPANY.vatStatus})</li>
            <li><strong>Nr. Reg. Com.:</strong> {COMPANY.regCom} (EUID: {COMPANY.euid})</li>
            <li><strong>Sediul social:</strong> {COMPANY_ADDRESS_LINE}</li>
            <li><strong>Email:</strong> <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></li>
        </ul>
    )
}
