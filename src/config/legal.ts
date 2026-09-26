// Date legale ale operatorului si versiunea documentelor legale.
// Sursa unica pentru footer, pagina de contact, paginile legale, JSON-LD si consimtamantul la plata.

export const LEGAL_VERSION = '2026-09-26'
export const LEGAL_VERSION_LABEL = '1.0'
export const LEGAL_EFFECTIVE_DATE = '26.09.2026'

export const COMPANY = {
    name: 'CULOAREA DIN VIAȚA SA S.R.L.',
    cui: '44820819',
    vatStatus: 'neplătitor de TVA',
    regCom: 'J2021001108100',
    euid: 'ROONRC.J2021001108100',
    address: {
        street: 'Sat Topliceni nr. 214, Com. Topliceni',
        locality: 'Topliceni',
        county: 'Buzău',
        postalCode: '127630',
        country: 'România',
        countryCode: 'RO',
    },
    email: 'contact@invitonline.ro',
} as const

export const COMPANY_ADDRESS_LINE = `${COMPANY.address.street}, jud. ${COMPANY.address.county}, ${COMPANY.address.postalCode}, ${COMPANY.address.country}`

export const BRAND = 'InvitOnline'
export const SITE_URL = 'https://invitonline.ro'

// Mentiune de pret: societatea nu este platitoare de TVA, preturile afisate sunt finale
export const PRICE_NOTE = 'Preț final; furnizorul nu este plătitor de TVA'

export const LEGAL_LINKS = {
    terms: '/termeni-si-conditii',
    privacy: '/politica-de-confidentialitate',
    cookies: '/politica-cookies',
    contact: '/contact',
} as const

export const ANPC_URL = 'https://anpc.ro'
export const ANPC_SAL_URL = 'https://anpc.ro/ce-este-sal/'
export const ANSPDCP_URL = 'https://www.dataprotection.ro'
