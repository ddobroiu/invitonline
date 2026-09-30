import { PRICE_NOTE } from '@/config/legal'
import { EVENT_TYPES } from '@/config/templates'
import { INVITATION_PRICE } from '@/lib/stripe'
import { getSiteUrl } from '@/lib/utils'
import type { Message } from './send'
import type { EventInfo, RsvpCounts } from './snapshot'

/**
 * Textele e-mailurilor din ciclul de viata.
 *
 * Nimic inventat: doar ce face aplicatia azi (ciorne gratuite, activare cu plata unica per invitatie, link
 * unic, WhatsApp / copiere link din cont, RSVP in invitatie, e-mail la fiecare raspuns, lista invitatilor cu
 * export CSV, modificari fara cost la acelasi link, invitati nelimitati). Pretul vine din lib/stripe.ts.
 * Tot ce e personal (tipul, titlul, data, locatia, cifrele RSVP) vine din baza. Fara reduceri, fara graba,
 * fara marturii sau cifre de marketing.
 */

const site = () => getSiteUrl()

const lei = new Intl.NumberFormat('ro-RO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
export const priceLabel = () => `${lei.format(INVITATION_PRICE / 100)} lei`

const MARKETING_FOOTNOTE =
    'Primești acest e-mail pentru că ai un cont pe invitonline.ro. Te poți dezabona oricând, cu linkul de mai jos; contul și invitațiile tale rămân neatinse.'

/** Prenumele din „Nume”: primul cuvant, curatat. */
function firstName(name: string | null | undefined): string {
    return (name ?? '').trim().split(/\s+/)[0]?.slice(0, 40) ?? ''
}

function hello(name: string | null | undefined, text: string): string {
    const n = firstName(name)
    return n ? `${text}, ${n}!` : `${text}!`
}

/** „nunta”, „botezul”… pentru frazele de tipul „invitația de nuntă”. */
function typeWord(type: string): string {
    const label = EVENT_TYPES.find((t) => t.id === type)?.label
    if (type === 'corporate') return 'eveniment corporate'
    return label ? label.toLocaleLowerCase('ro-RO') : 'eveniment'
}

function titleOf(ev: EventInfo): string {
    return ev.title.trim().slice(0, 120) || 'invitația ta'
}

function plural(n: number, one: string, many: string): string {
    return n === 1 ? `${n} ${one}` : `${n} ${many}`
}

// ---------------------------------------------------------------- bun venit (la inregistrare)

export function welcomeMessage(name: string | null): Message {
    return {
        subject: 'Bun venit la InvitOnline',
        heading: hello(name, 'Bine ai venit'),
        paragraphs: [
            'Contul tău e gata. Iată drumul de la cont la invitația trimisă oaspeților:',
            '1. Alegi tipul evenimentului (nuntă, botez, aniversare, petrecere sau eveniment corporate) și un model.',
            '2. Completezi detaliile: numele, data, locația, mesajul. Vezi pe loc cum arată invitația pe telefon.',
            '3. O salvezi ca ciornă, gratuit, și o poți modifica oricât.',
            `4. Când ești mulțumit, o activezi: ${priceLabel()}, plată unică pe invitație, fără abonament și fără limită de invitați. Primești un link unic, pe care îl trimiți pe WhatsApp, SMS sau e-mail.`,
            'Confirmările de prezență (RSVP) le vezi în contul tău, pe măsură ce vin.',
        ],
        cta: { label: 'Creează prima invitație', url: `${site()}/create` },
        footnote:
            'Primești acest mesaj pentru că ți-ai creat un cont pe invitonline.ro. Dacă nu ai fost tu, răspunde la acest e-mail și ștergem contul.',
    }
}

// ---------------------------------------------------------------- fara nicio invitatie (ziua 1-4)

export function firstInvitationMessage(name: string | null): Message {
    return {
        subject: 'Prima ta invitație, în câțiva pași',
        heading: hello(name, 'Salut'),
        paragraphs: [
            'Ți-ai făcut contul, dar încă n-ai salvat nicio invitație.',
            'Un sfat: alege modelul care ți se potrivește și completează doar numele și data. Locația, mesajul și restul detaliilor le adaugi oricând: invitația rămâne ciornă, gratuit, până când decizi s-o activezi.',
            `Activarea costă ${priceLabel()} per invitație, plată unică. Și după activare poți modifica invitația fără cost; modificările apar imediat la același link.`,
        ],
        cta: { label: 'Alege un model', url: `${site()}/create` },
        footnote: MARKETING_FOOTNOTE,
    }
}

// ---------------------------------------------------------------- ciorna neactivata

export function draftReminderMessage(name: string | null, ev: EventInfo, checkoutStarted: boolean): Message {
    const title = titleOf(ev)
    const details = [ev.date.trim() && `pentru ${ev.date.trim().slice(0, 60)}`, ev.location.trim() && `la ${ev.location.trim().slice(0, 120)}`]
        .filter(Boolean)
        .join(', ')
    const paragraphs = [
        `Ai salvat invitația de ${typeWord(ev.type)} „${title}”${details ? `, ${details}` : ''}. Este încă ciornă: deocamdată doar tu o poți vedea.`,
        `Ca s-o poți trimite oaspeților, o activezi: ${priceLabel()}, plată unică pentru această invitație, fără abonament. Numărul de invitați este nelimitat.`,
        'După activare primești un link unic, pe care îl trimiți pe WhatsApp, Messenger, SMS sau e-mail. Invitații îl deschid direct în browser și își confirmă prezența din invitație; tu vezi răspunsurile în contul tău.',
        'Poți modifica detaliile și după activare, fără cost: modificările apar imediat la același link.',
    ]
    if (checkoutStarted) {
        paragraphs.push('Ai ajuns până la plată, dar ea nu s-a finalizat. Dacă ceva nu a mers sau ai o întrebare, răspunde la acest e-mail.')
    }
    paragraphs.push(
        'Dacă ai renunțat sau ai ales altă variantă, nu e nimic de făcut: ciorna rămâne în cont până o ștergi.',
        `${PRICE_NOTE}.`,
    )
    return {
        subject: ev.title.trim() ? `Invitația „${title}” te așteaptă` : 'Invitația ta te așteaptă',
        heading: hello(name, 'Ciorna ta e salvată'),
        paragraphs,
        cta: { label: 'Continuă invitația', url: `${site()}/create?id=${encodeURIComponent(ev.id)}` },
        footnote: MARKETING_FOOTNOTE,
    }
}

// ---------------------------------------------------------------- dupa plata (ziua 1)

export function postPurchaseMessage(name: string | null, ev: EventInfo, rsvp: RsvpCounts): Message {
    const title = titleOf(ev)
    const answered = rsvp.confirmed + rsvp.declined
    return {
        subject: `Cum trimiți invitația „${title}”`,
        heading: hello(name, 'Salut'),
        paragraphs: [
            `Invitația „${title}” e activă la linkul ei: ${site()}/invitatie/${ev.id}`,
            'Trimite-l direct oaspeților: în contul tău, „Copiază link” îl pune în clipboard, iar butonul WhatsApp deschide un mesaj gata scris. Merge la fel pe Messenger, SMS sau e-mail.',
            'Invitații își confirmă prezența din invitație, cu numărul de persoane și, dacă vor, un mesaj pentru voi. La fiecare răspuns nou primești un e-mail.',
            answered > 0
                ? `Până acum: ${plural(rsvp.confirmed, 'confirmare', 'confirmări')} (${plural(rsvp.persons, 'persoană', 'persoane')}) și ${plural(rsvp.declined, 'refuz', 'refuzuri')}.`
                : 'Încă n-a răspuns nimeni; e normal în primele zile după ce trimiți linkul.',
            'În „Lista invitați” poți adăuga manual oaspeții care îți răspund pe telefon, le poți schimba statusul și poți descărca lista (CSV), utilă pentru restaurant sau pentru așezarea la mese.',
            'Dacă se schimbă ora sau locația, editează invitația: modificarea apare imediat la același link, fără cost.',
        ],
        cta: { label: 'Deschide contul', url: `${site()}/dashboard` },
        footnote: MARKETING_FOOTNOTE,
    }
}

// ---------------------------------------------------------------- rezumat RSVP inainte de eveniment

export function rsvpSummaryMessage(name: string | null, ev: EventInfo, rsvp: RsvpCounts, daysLeft: number): Message {
    const title = titleOf(ev)
    const paragraphs = [
        `Mai sunt ${daysLeft} zile până la ${typeWord(ev.type)}: „${title}”${ev.date.trim() ? ` (${ev.date.trim().slice(0, 60)})` : ''}. Iată răspunsurile primite până acum:`,
        `Vin: ${plural(rsvp.confirmed, 'răspuns', 'răspunsuri')}, în total ${plural(rsvp.persons, 'persoană', 'persoane')}.`,
        `Nu pot veni: ${rsvp.declined}.`,
    ]
    if (rsvp.pending > 0) {
        paragraphs.push(`Fără răspuns încă: ${plural(rsvp.pending, 'invitat adăugat', 'invitați adăugați')} de tine în listă.`)
    }
    paragraphs.push(
        rsvp.confirmed + rsvp.declined === 0
            ? 'N-a răspuns încă nimeni prin invitație. Dacă n-ai trimis linkul, acum e momentul; dacă l-ai trimis, o reamintire pe WhatsApp ajută.'
            : 'Dacă mai aștepți răspunsuri, retrimite linkul celor care n-au confirmat.',
        'Lista completă, cu mesajele invitaților și exportul CSV (util pentru restaurant), e în contul tău, la „Lista invitați”.',
    )
    return {
        subject: `${daysLeft} zile până la „${title}”: confirmările de până acum`,
        heading: hello(name, 'Salut'),
        paragraphs,
        cta: { label: 'Vezi lista invitaților', url: `${site()}/dashboard` },
        footnote: MARKETING_FOOTNOTE,
    }
}

// ---------------------------------------------------------------- revenire (o singura data)

export function reengageMessage(name: string | null, drafts: number): Message {
    const paragraphs: string[] = []
    if (drafts > 0) {
        paragraphs.push(
            drafts === 1
                ? 'Ai o ciornă de invitație salvată în cont, unde ai lăsat-o.'
                : `Ai ${drafts} ciorne de invitații salvate în cont, unde le-ai lăsat.`,
        )
    } else {
        paragraphs.push('Contul tău InvitOnline e aici, unde l-ai lăsat.')
    }
    paragraphs.push(
        `Dacă ai un eveniment nou în plan (nuntă, botez, aniversare, petrecere sau eveniment corporate), pornești de la un model; ciorna e gratuită, iar activarea costă ${priceLabel()}, plată unică pe invitație.`,
        'Fără presiune. Acesta e singurul e-mail de acest fel pe care ți-l trimitem.',
    )
    return {
        subject: drafts > 0 ? 'Ciorna ta e unde ai lăsat-o' : 'Contul tău InvitOnline e unde l-ai lăsat',
        heading: hello(name, 'Salut din nou'),
        paragraphs,
        cta: drafts > 0 ? { label: 'Deschide contul', url: `${site()}/dashboard` } : { label: 'Creează o invitație', url: `${site()}/create` },
        footnote: MARKETING_FOOTNOTE,
    }
}
