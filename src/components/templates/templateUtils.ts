// Shared, defensive helpers for invitation templates.
// Every prop coming from the editor form may be an empty string or undefined.

export type EventType = 'nunta' | 'botez' | 'aniversare' | 'petrecere' | string

export interface CustomField {
    label: string
    value: string
}

/** Always returns a (trimmed) string, never undefined/null. */
export function str(v: unknown): string {
    if (v === null || v === undefined) return ''
    return String(v).trim()
}

/** Upper-cases safely (Romanian locale keeps diacritics correct). */
export function upper(v: unknown): string {
    return str(v).toLocaleUpperCase('ro-RO')
}

/** First segment of a comma-separated location ("Restaurant X, Str. Y" -> "Restaurant X"). */
export function shortLocation(location: unknown): string {
    return str(location).split(',')[0].trim()
}

/** Map link: explicit locationUrl, else a Google Maps search for the location, else ''. */
export function getMapUrl(location?: unknown, locationUrl?: unknown): string {
    const url = str(locationUrl)
    if (url) return url
    const loc = str(location)
    if (!loc) return ''
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc)}`
}

/** Waze link for a location (only when there is a location text). */
export function getWazeUrl(location?: unknown): string {
    const loc = str(location)
    if (!loc) return ''
    return `https://waze.com/ul?q=${encodeURIComponent(loc)}&navigate=yes`
}

const RO_MONTHS = ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie']
const RO_DAYS = ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă']

export interface ParsedDate {
    day: string        // "25" or ''
    month: string      // "August" or ''
    year: string       // "2026" or ''
    weekday: string    // "Marți" or '' when the date can't be computed
    monthIndex: number // 0-11 or -1
}

/**
 * Loosely parses free-text dates like "25 AUGUST 2026", "25.08.2026", "2026-08-25".
 * Never throws; missing parts are empty strings.
 */
export function parseDate(date: unknown): ParsedDate {
    const text = str(date)
    const out: ParsedDate = { day: '', month: '', year: '', weekday: '', monthIndex: -1 }
    if (!text) return out

    const lower = text.toLocaleLowerCase('ro-RO')
    const iso = lower.match(/(\d{4})-(\d{1,2})-(\d{1,2})/)
    const numeric = lower.match(/(\d{1,2})[./-](\d{1,2})[./-](\d{4})/)
    if (iso) {
        out.year = iso[1]; out.monthIndex = Number(iso[2]) - 1; out.day = String(Number(iso[3]))
    } else if (numeric) {
        out.day = String(Number(numeric[1])); out.monthIndex = Number(numeric[2]) - 1; out.year = numeric[3]
    } else {
        const normalized = lower.normalize('NFD').replace(/[̀-ͯ]/g, '')
        out.monthIndex = RO_MONTHS.findIndex((m) => normalized.includes(m) || normalized.includes(m.slice(0, 3) + '.'))
        if (out.monthIndex === -1) {
            const en = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
            out.monthIndex = en.findIndex((m) => normalized.includes(m))
        }
        out.year = lower.match(/\b(\d{4})\b/)?.[1] || ''
        out.day = lower.match(/\b(\d{1,2})\b/)?.[1] || ''
    }
    if (out.monthIndex < 0 || out.monthIndex > 11) out.monthIndex = -1
    if (out.monthIndex >= 0) {
        const m = RO_MONTHS[out.monthIndex]
        out.month = m.charAt(0).toUpperCase() + m.slice(1)
    }
    if (out.day && out.year && out.monthIndex >= 0) {
        const d = new Date(Number(out.year), out.monthIndex, Number(out.day))
        if (!isNaN(d.getTime()) && d.getDate() === Number(out.day)) out.weekday = RO_DAYS[d.getDay()]
    }
    return out
}

/** Only fields with both a label and a value. */
export function validCustomFields(customFields: unknown): CustomField[] {
    if (!Array.isArray(customFields)) return []
    return customFields.filter(
        (f): f is CustomField => !!f && !!str((f as CustomField).label) && !!str((f as CustomField).value)
    )
}

export function isWedding(eventType?: unknown): boolean {
    const t = str(eventType)
    return t === '' || t === 'nunta'
}

/** Romanian label for the event type. */
export function eventLabel(eventType?: unknown): string {
    switch (str(eventType)) {
        case 'botez': return 'Botez'
        case 'aniversare': return 'Aniversare'
        case 'petrecere': return 'Petrecere'
        default: return 'Nuntă'
    }
}

interface NameProps {
    eventType?: unknown
    title?: unknown
    groomName?: unknown
    brideName?: unknown
    childName?: unknown
    celebrantName?: unknown
}

/**
 * The main names/title to display, depending on event type.
 * The editor keeps `title` in sync with the names, so the title wins; names are the fallback.
 */
export function getMainNames(p: NameProps): string {
    const type = str(p.eventType)
    const title = str(p.title)
    if (title) return title
    if (type === 'botez') return str(p.childName)
    if (type === 'aniversare' || type === 'petrecere') return str(p.celebrantName)
    const groom = str(p.groomName)
    const bride = str(p.brideName)
    if (groom && bride) return `${groom} & ${bride}`
    return groom || bride
}

/** Splits names on "&" (wedding couples). Returns 1 or 2 non-empty parts. */
export function splitNames(names: unknown): string[] {
    const parts = str(names).split('&').map((s) => s.trim()).filter(Boolean)
    return parts.length ? parts : ['']
}

export interface ScheduleItem {
    key: string
    label: string
    time: string
    loc: string
}

interface ScheduleProps {
    eventType?: unknown
    civilCeremonyTime?: unknown
    civilCeremonyLoc?: unknown
    religiousCeremonyTime?: unknown
    religiousCeremonyLoc?: unknown
    partyTime?: unknown
    partyLoc?: unknown
    churchTime?: unknown
    churchLoc?: unknown
    restaurantTime?: unknown
    restaurantLoc?: unknown
}

/** Event-aware program items (only those with a time or a location). */
export function getSchedule(p: ScheduleProps): ScheduleItem[] {
    const type = str(p.eventType)
    const raw: ScheduleItem[] =
        type === 'botez'
            ? [
                { key: 'church', label: 'Slujba de botez', time: str(p.churchTime), loc: str(p.churchLoc) },
                { key: 'restaurant', label: 'Petrecerea', time: str(p.restaurantTime), loc: str(p.restaurantLoc) },
            ]
            : type === 'aniversare' || type === 'petrecere'
                ? [
                    { key: 'party', label: 'Petrecerea', time: str(p.partyTime), loc: str(p.partyLoc) },
                    { key: 'restaurant', label: 'Restaurant', time: str(p.restaurantTime), loc: str(p.restaurantLoc) },
                ]
                : [
                    { key: 'civil', label: 'Cununia civilă', time: str(p.civilCeremonyTime), loc: str(p.civilCeremonyLoc) },
                    { key: 'religious', label: 'Cununia religioasă', time: str(p.religiousCeremonyTime), loc: str(p.religiousCeremonyLoc) },
                    { key: 'party', label: 'Petrecerea', time: str(p.partyTime), loc: str(p.partyLoc) },
                ]
    return raw.filter((i) => i.time || i.loc)
}

interface FamilyProps {
    eventType?: unknown
    parentsGroom?: unknown
    parentsBride?: unknown
    godparents?: unknown
    godparentsBaptism?: unknown
    motherName?: unknown
    fatherName?: unknown
}

/** Parents text depending on event type. */
export function getParents(p: FamilyProps): string[] {
    if (str(p.eventType) === 'botez') {
        const parents = [str(p.motherName), str(p.fatherName)].filter(Boolean)
        return parents.length ? [parents.join(' & ')] : []
    }
    return [str(p.parentsGroom), str(p.parentsBride)].filter(Boolean)
}

/** Godparents text depending on event type. */
export function getGodparents(p: FamilyProps): string {
    if (str(p.eventType) === 'botez') return str(p.godparentsBaptism) || str(p.godparents)
    return str(p.godparents) || str(p.godparentsBaptism)
}
