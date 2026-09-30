// Sample data for template previews (/demo, /templates/[id], landing page, editor defaults, tests).
// Everything here is clearly fictional example content shown as "exemplu"; no real people or events.
//
// Photo sources (license recorded, hotlinked from the providers' CDNs):
// - Wedding: Unsplash photo 1519741497674-611481863552 (Unsplash License, free for commercial use)
// - Video: MDN "flower.mp4" (CC0, interactive-examples.mdn.mozilla.net/media/cc0-videos/)
import type { EventTypeId } from '@/config/templates'

export type DemoCase = 'standard' | 'lung' | 'fara-foto' | 'multe' | 'minim'
export const DEMO_CASES: DemoCase[] = ['standard', 'lung', 'fara-foto', 'multe', 'minim']

export const DEMO_PHOTO_WEDDING = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=900'
export const DEMO_VIDEO = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'

type Props = Record<string, unknown>

const BASE: Record<EventTypeId, Props> = {
    nunta: {
        eventType: 'nunta',
        title: 'Mihai & Teodora',
        brideName: 'Teodora',
        groomName: 'Mihai',
        date: '12 Iulie 2027',
        eventDateISO: '2027-07-12',
        location: 'Domeniul cu Cireși, București',
        message: 'Vă invităm cu drag să fiți alături de noi în ziua în care ne unim destinele.',
        parentsGroom: 'Gheorghe & Maria Ionescu',
        parentsBride: 'Constantin & Viorica Stanciu',
        godparents: 'Radu & Elena Popescu',
        civilCeremonyTime: '14:00',
        civilCeremonyLoc: 'Primăria Sectorului 1, București',
        religiousCeremonyTime: '16:30',
        religiousCeremonyLoc: 'Biserica Sf. Elefterie',
        partyTime: '19:30',
        partyLoc: 'Domeniul cu Cireși',
        dressCode: 'Elegant',
        photoUrl: DEMO_PHOTO_WEDDING,
        videoUrl: DEMO_VIDEO,
        rsvpDeadline: '1 Iunie 2027',
        menuOptions: ['Standard', 'Vegetarian', 'Copii'],
        customFields: [{ label: 'Confirmări până la', value: '1 Iunie' }],
    },
    botez: {
        eventType: 'botez',
        title: 'Ilinca',
        childName: 'Ilinca',
        date: '5 Septembrie 2027',
        eventDateISO: '2027-09-05',
        location: 'Restaurant Grădina Verde, Cluj-Napoca',
        message: 'Cu inimile pline de bucurie, vă invităm la botezul fetiței noastre.',
        motherName: 'Andreea',
        fatherName: 'Vlad',
        godparentsBaptism: 'Ioana & Radu Marin',
        churchTime: '12:00',
        churchLoc: 'Biserica Sf. Petru și Pavel',
        restaurantTime: '14:30',
        restaurantLoc: 'Restaurant Grădina Verde',
        rsvpDeadline: '15 August 2027',
        menuOptions: ['Standard', 'Vegetarian', 'Copii'],
        customFields: [],
    },
    aniversare: {
        eventType: 'aniversare',
        title: 'Sofia împlinește 6 ani',
        celebrantName: 'Sofia',
        age: '6',
        date: '14 Mai 2027',
        eventDateISO: '2027-05-14',
        location: 'Loc de joacă Arlechino, Iași',
        message: 'Vino la petrecere! Avem tort, jocuri și multe surprize.',
        partyTime: '16:00',
        host: 'Familia Radu',
        rsvpDeadline: '7 Mai 2027',
        customFields: [],
    },
    petrecere: {
        eventType: 'petrecere',
        title: 'Andrei — 18 ani',
        celebrantName: 'Andrei',
        age: '18',
        date: '20 Noiembrie 2027',
        eventDateISO: '2027-11-20',
        location: 'Clubul Floreasca, București',
        message: 'Majoratul meu, o singură dată. Te aștept să sărbătorim cum se cuvine!',
        partyTime: '20:00',
        theme: 'Black & Gold',
        dressCode: 'Elegant — negru și auriu',
        rsvpDeadline: '10 Noiembrie 2027',
        customFields: [],
    },
    corporate: {
        eventType: 'corporate',
        title: 'Gala anuală 2027',
        celebrantName: 'Exemplu SRL',
        date: '9 Decembrie 2027',
        eventDateISO: '2027-12-09',
        location: 'Sala Mare, Hotel Central, Timișoara',
        message: 'Vă invităm la seara în care celebrăm împreună rezultatele anului și echipa care le-a făcut posibile.',
        partyTime: '18:30',
        dressCode: 'Business formal',
        agenda: '18:30 — Primirea invitaților\n19:15 — Cuvânt de deschidere\n20:00 — Cina\n21:30 — Premiile anului',
        rsvpDeadline: '1 Decembrie 2027',
        menuOptions: ['Standard', 'Vegetarian'],
        customFields: [{ label: 'Parcare', value: 'Gratuită, în parcarea hotelului' }],
    },
}

const LONG_TEXT = 'Suntem nespus de fericiți să vă anunțăm că, după o poveste frumoasă care a început într-o dimineață ploioasă de toamnă, ne-am hotărât să ne unim destinele. Ne-ar bucura enorm să fiți alături de noi, să dansăm, să râdem și să ne amintim împreună de toate momentele care ne-au adus până aici. Vă mulțumim din suflet!'

/** Demo props for a template preview: event type + edge case. */
export function demoProps(type: EventTypeId = 'nunta', variant: DemoCase = 'standard'): Props {
    const base: Props = { ...BASE[type] }
    switch (variant) {
        case 'lung':
            return {
                ...base,
                title: type === 'nunta' ? 'Maria-Magdalena Ștefănescu-Brâncoveanu & Constantin-Alexandru Țăranu-Vlădescu' : `${String(base.title)} — o sărbătoare lungă cu nume foarte lungi și diacritice: ăâîșț ĂÂÎȘȚ`,
                brideName: 'Maria-Magdalena Ștefănescu-Brâncoveanu',
                groomName: 'Constantin-Alexandru Țăranu-Vlădescu',
                childName: 'Ana-Maria-Ștefania Ionescu-Dobrogeanu',
                celebrantName: 'Alexandru-Ștefan Țepeș-Brâncoveanu',
                location: 'Complexul Hotelier „Palatul Regal al Grădinilor Suspendate”, Strada Mihail Kogălniceanu nr. 145, Sectorul 5, București',
                message: LONG_TEXT,
                parentsGroom: 'Gheorghe-Ștefan & Maria-Magdalena Țăranu-Vlădescu',
                parentsBride: 'Constantin-Alexandru & Viorica-Elisabeta Ștefănescu-Brâncoveanu',
                godparents: 'Radu-Mihai & Elena-Cristina Popescu-Dumitrescu',
                civilCeremonyLoc: 'Oficiul de Stare Civilă al Primăriei Sectorului 5, Sala Mare de Festivități',
                religiousCeremonyLoc: 'Catedrala Mitropolitană „Sfinții Împărați Constantin și Elena”',
                partyLoc: 'Salonul Imperial al Complexului Hotelier „Palatul Regal”',
                dressCode: 'Black tie — ținută de seară elegantă, rochii lungi și costume închise la culoare',
                customFields: [
                    { label: 'Cazare pentru invitații din afara orașului', value: 'Hotelul Central, cod de rezervare NUNTA2027, tarif preferențial până la 1 iunie' },
                    { label: 'Transport', value: 'Autocar de la Piața Unirii la ora 13:15 și retur după miezul nopții' },
                ],
            }
        case 'fara-foto':
            return { ...base, photoUrl: '', videoUrl: '', audioUrl: '' }
        case 'multe':
            return {
                ...base,
                agenda: base.agenda || '13:30 — Sosirea invitaților\n14:00 — Ceremonia\n16:00 — Sesiune foto\n19:30 — Cina festivă\n22:00 — Tortul\n23:00 — Petrecerea continuă',
                customFields: [
                    { label: 'Confirmări până la', value: String(base.rsvpDeadline || '1 Iunie') },
                    { label: 'Cazare', value: 'Hotel Central, cod NUNTA' },
                    { label: 'Parcare', value: 'Gratuită, la intrarea principală' },
                ],
                menuOptions: ['Standard', 'Vegetarian', 'Vegan', 'Copii', 'Fără gluten'],
            }
        case 'minim':
            return {
                eventType: type,
                title: base.title,
                date: base.date,
                location: base.location,
                message: '',
                customFields: [],
            }
        default:
            return base
    }
}

export function isDemoCase(v: unknown): v is DemoCase {
    return typeof v === 'string' && (DEMO_CASES as string[]).includes(v)
}
