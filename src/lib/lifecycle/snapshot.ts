/**
 * Ce stim despre o invitatie, pentru e-mailurile personalizate: tipul, titlul (numele), data, locatia si
 * cifrele RSVP. Doar numaratori — niciodata numele, adresele sau mesajele invitatilor: invitatii nu sunt
 * destinatari de marketing, iar datele lor raman in contul organizatorului.
 */

export interface EventInfo {
    id: string
    type: string
    title: string
    /** data afisata, asa cum a scris-o organizatorul (ex. „25 August 2026”) */
    date: string
    /** data din editor (AAAA-LL-ZZ), daca exista; din ea se calculeaza zilele pana la eveniment */
    dateISO: string | null
    location: string
}

export interface RsvpCounts {
    confirmed: number
    /** persoanele din raspunsurile „vin” */
    persons: number
    declined: number
    /** invitati adaugati de organizator, fara raspuns */
    pending: number
}

type EventRow = { id: string; type: string; title: string; date: string; location: string; data: unknown }

export function eventInfo(e: EventRow): EventInfo {
    const raw = e.data && typeof e.data === 'object' ? (e.data as Record<string, unknown>).eventDateISO : null
    const dateISO = typeof raw === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : null
    return { id: e.id, type: e.type, title: e.title, date: e.date || '', dateISO, location: e.location || '' }
}

export function rsvpCounts(guests: { status: string; persons: number }[]): RsvpCounts {
    const confirmed = guests.filter((g) => g.status === 'confirmed')
    return {
        confirmed: confirmed.length,
        persons: confirmed.reduce((sum, g) => sum + (g.persons || 0), 0),
        declined: guests.filter((g) => g.status === 'declined').length,
        pending: guests.filter((g) => g.status === 'pending').length,
    }
}

/** Data de azi in Romania, AAAA-LL-ZZ. */
export function todayRo(now: number): string {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Bucharest', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now)
}

/** Ora din Romania (0-23). */
export function hourRo(now: number): number {
    const h = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Bucharest', hour: '2-digit', hourCycle: 'h23' }).format(now)
    return Number(h)
}

/** Zile intregi de azi (Romania) pana la data invitatiei; null fara data din editor. */
export function daysUntil(ev: EventInfo, now: number): number | null {
    if (!ev.dateISO) return null
    const target = Date.parse(`${ev.dateISO}T00:00:00Z`)
    const today = Date.parse(`${todayRo(now)}T00:00:00Z`)
    if (Number.isNaN(target)) return null
    return Math.round((target - today) / 86_400_000)
}
