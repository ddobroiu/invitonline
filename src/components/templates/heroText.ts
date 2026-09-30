// Hero texts for the 2026 templates: the line above the names, the names, the date.
import { getMainNames, parseDate, splitNames, str } from './templateUtils'

type P = Record<string, unknown>

/** Short line above the names, by event type. */
export function heroKicker(p: P): string {
    const type = str(p.eventType) || 'nunta'
    const age = str(p.age)
    switch (type) {
        case 'botez': return 'Te invităm la botez'
        case 'aniversare': return age ? `Aniversare · ${age} ${Number(age) === 1 ? 'an' : 'ani'}` : 'Te invităm la aniversare'
        case 'petrecere': return age ? `Petrecere · ${age} ani` : 'Te invităm la petrecere'
        case 'corporate': return str(p.celebrantName) ? `${str(p.celebrantName)} vă invită` : 'Invitație'
        default: return 'Ne căsătorim'
    }
}

/** The names, split on "&" for weddings (1 or 2 parts); other events keep the title whole. */
export function mainNameParts(p: P): string[] {
    const names = getMainNames({
        eventType: p.eventType, title: p.title, groomName: p.groomName, brideName: p.brideName,
        childName: p.childName, celebrantName: p.celebrantName,
    })
    const type = str(p.eventType) || 'nunta'
    if (type === 'nunta') return splitNames(names).slice(0, 2)
    return [names || 'Invitație']
}

/** "12.07.2027" + weekday, or the free text when it can't be parsed. */
export function formatDateParts(p: P): { numeric: string; weekday: string; text: string; day: string; month: string; year: string } {
    const d = parseDate(p.date)
    const text = str(p.date)
    if (d.day && d.monthIndex >= 0 && d.year) {
        return {
            numeric: `${d.day.padStart(2, '0')} · ${String(d.monthIndex + 1).padStart(2, '0')} · ${d.year}`,
            weekday: d.weekday,
            text,
            day: d.day,
            month: d.month,
            year: d.year,
        }
    }
    return { numeric: '', weekday: '', text, day: d.day, month: d.month, year: d.year }
}
