// Calendar links, countdown maths and agenda parsing shared by the invitation templates.
// Pure functions (no React), unit-tested in tests/unit/event-extras.test.ts.
import { parseDate, str, getSchedule } from './templateUtils'

/** "YYYY-MM-DD" of the event: the editor's ISO date, else parsed from the free-text date; '' if unknown. */
export function eventDateISO(p: { eventDateISO?: unknown; date?: unknown }): string {
    const iso = str(p.eventDateISO)
    if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso
    const d = parseDate(p.date)
    if (!d.day || !d.year || d.monthIndex < 0) return ''
    return `${d.year}-${String(d.monthIndex + 1).padStart(2, '0')}-${d.day.padStart(2, '0')}`
}

/** First "HH:MM" of the program (ceremony, party...), '' when no time was given. */
export function firstTime(p: Record<string, unknown>): string {
    const times = getSchedule(p).map((s) => s.time).filter((t) => /^\d{1,2}:\d{2}$/.test(t))
    if (times.length) return times.sort((a, b) => a.padStart(5, '0').localeCompare(b.padStart(5, '0')))[0]
    const party = str(p.partyTime)
    return /^\d{1,2}:\d{2}$/.test(party) ? party : ''
}

export interface CalendarEvent {
    title: string
    dateISO: string // YYYY-MM-DD
    time?: string // HH:MM (local time, Romania); empty = all-day
    hours?: number // duration when a time is given (default 6)
    location?: string
    details?: string
}

function pad(n: number) {
    return String(n).padStart(2, '0')
}

/** Floating local date-times (no Z): calendars show them at the given hour in the viewer's zone, as on the invitation. */
function stamps(ev: CalendarEvent): { start: string; end: string; allDay: boolean } | null {
    const m = ev.dateISO.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (!m) return null
    const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])]
    const t = (ev.time || '').match(/^(\d{1,2}):(\d{2})$/)
    if (!t) {
        const next = new Date(Date.UTC(y, mo - 1, d + 1))
        return {
            start: `${y}${pad(mo)}${pad(d)}`,
            end: `${next.getUTCFullYear()}${pad(next.getUTCMonth() + 1)}${pad(next.getUTCDate())}`,
            allDay: true,
        }
    }
    const start = new Date(Date.UTC(y, mo - 1, d, Number(t[1]), Number(t[2])))
    const end = new Date(start.getTime() + (ev.hours ?? 6) * 3600_000)
    const fmt = (x: Date) => `${x.getUTCFullYear()}${pad(x.getUTCMonth() + 1)}${pad(x.getUTCDate())}T${pad(x.getUTCHours())}${pad(x.getUTCMinutes())}00`
    return { start: fmt(start), end: fmt(end), allDay: false }
}

export function googleCalendarUrl(ev: CalendarEvent): string {
    const s = stamps(ev)
    if (!s) return ''
    const q = new URLSearchParams({ action: 'TEMPLATE', text: ev.title, dates: `${s.start}/${s.end}` })
    if (!s.allDay) q.set('ctz', 'Europe/Bucharest')
    if (ev.location) q.set('location', ev.location)
    if (ev.details) q.set('details', ev.details)
    return `https://calendar.google.com/calendar/render?${q.toString()}`
}

function icsEscape(v: string): string {
    return v.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n')
}

/** iCalendar file (Apple Calendar, Outlook, Android) for the event. */
export function icsContent(ev: CalendarEvent, uid = 'invitatie'): string {
    const s = stamps(ev)
    if (!s) return ''
    const now = new Date()
    const dtstamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}00Z`
    const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//InvitOnline//Invitatie//RO',
        'CALSCALE:GREGORIAN',
        'BEGIN:VEVENT',
        `UID:${uid}@invitonline.ro`,
        `DTSTAMP:${dtstamp}`,
        s.allDay ? `DTSTART;VALUE=DATE:${s.start}` : `DTSTART;TZID=Europe/Bucharest:${s.start}`,
        s.allDay ? `DTEND;VALUE=DATE:${s.end}` : `DTEND;TZID=Europe/Bucharest:${s.end}`,
        `SUMMARY:${icsEscape(ev.title)}`,
        ...(ev.location ? [`LOCATION:${icsEscape(ev.location)}`] : []),
        ...(ev.details ? [`DESCRIPTION:${icsEscape(ev.details)}`] : []),
        'END:VEVENT',
        'END:VCALENDAR',
    ]
    return lines.join('\r\n') + '\r\n'
}

/** Calendar event built from template props; null when the date is unknown. */
export function calendarEventFromProps(p: Record<string, unknown>): CalendarEvent | null {
    const dateISO = eventDateISO(p)
    if (!dateISO) return null
    return {
        title: str(p.title) || 'Invitație',
        dateISO,
        time: firstTime(p),
        location: str(p.location),
        details: str(p.message),
    }
}

/** Whole days/hours/minutes until the event start (Romanian local time approximated by the browser clock). */
export function countdownParts(targetISO: string, time: string, now: Date = new Date()): { days: number; hours: number; minutes: number } | null {
    const m = targetISO.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (!m) return null
    const t = time.match(/^(\d{1,2}):(\d{2})$/)
    const target = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), t ? Number(t[1]) : 0, t ? Number(t[2]) : 0)
    const diff = target.getTime() - now.getTime()
    if (!(diff > 0)) return null
    const minutes = Math.floor(diff / 60_000)
    return { days: Math.floor(minutes / 1440), hours: Math.floor((minutes % 1440) / 60), minutes: minutes % 60 }
}

export interface AgendaItem {
    time: string
    text: string
}

/** "18:30 — Primirea invitaților" lines (dash, en/em dash or colon after the hour); lines without an hour keep time ''. */
export function parseAgenda(agenda: unknown): AgendaItem[] {
    return str(agenda)
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean)
        .slice(0, 20)
        .map((line) => {
            const m = line.match(/^(\d{1,2}[:.]\d{2})\s*(?:[-–—:|]\s*)?(.*)$/)
            return m ? { time: m[1].replace('.', ':'), text: m[2].trim() } : { time: '', text: line }
        })
        .filter((i) => i.text || i.time)
}

/** Menu options configured by the organizer (max 8, trimmed, unique). */
export function menuOptions(v: unknown): string[] {
    if (!Array.isArray(v)) return []
    return [...new Set(v.map((x) => str(x).slice(0, 40)).filter(Boolean))].slice(0, 8)
}
