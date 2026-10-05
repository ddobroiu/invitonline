import { isEventType, isTemplateId, DEFAULT_TEMPLATE } from '@/config/templates'
import { parseDate } from '@/components/templates/templateUtils'

export type FieldErrors = Record<string, string>
export function isEmail(value: string): boolean {
    return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}
export function isContact(value: string): boolean {
    if (value.includes('@')) return isEmail(value)
    return /^[+()\d\s.-]+$/.test(value) && /^\+?\d{7,15}$/.test(value.replace(/[()\s.-]/g, ''))
}
export function isWebUrl(value: string): boolean {
    try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password } catch { return false }
}
export function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
}
export class ValidationError extends Error {}
export async function readJsonObject(req: Request): Promise<Record<string, unknown>> {
    let body: unknown
    try { body = await req.json() } catch { throw new ValidationError('Datele trimise nu sunt valide.') }
    if (!isRecord(body)) throw new ValidationError('Datele trimise nu sunt valide.')
    return body
}
export function validDate(value: string): boolean {
    const parsed = parseDate(value)
    const year = Number(parsed.year), day = Number(parsed.day)
    if (year < 1900 || year > 2200 || parsed.monthIndex < 0 || !day) return false
    const date = new Date(year, parsed.monthIndex, day)
    return date.getFullYear() === year && date.getMonth() === parsed.monthIndex && date.getDate() === day
}

const TEXT_LIMITS: Record<string, number> = {
    title: 200, date: 100, eventDateISO: 10, location: 300, message: 2000,
    brideName: 120, groomName: 120, childName: 120, celebrantName: 120,
    parentsBride: 300, parentsGroom: 300, godparents: 300, motherName: 120, fatherName: 120,
    godparentsBaptism: 300, dressCode: 300, specialInstructions: 2000, age: 3, theme: 200, host: 200,
    civilCeremonyTime: 5, civilCeremonyLoc: 300, religiousCeremonyTime: 5, religiousCeremonyLoc: 300,
    partyTime: 5, partyLoc: 300, churchTime: 5, churchLoc: 300, restaurantTime: 5, restaurantLoc: 300,
    rsvpDeadline: 100, locationUrl: 1000, photoUrl: 2000, audioUrl: 2000, videoUrl: 2000,
}

export function eventTemplateData(input: Record<string, unknown>) {
    const data: Record<string, string | string[] | { label: string; value: string }[]> = {}
    const columns = new Set(['title', 'date', 'location', 'locationUrl', 'message'])
    for (const key of Object.keys(TEXT_LIMITS)) {
        if (!columns.has(key) && typeof input[key] === 'string') data[key] = input[key].trim()
    }
    if (Array.isArray(input.customFields)) data.customFields = input.customFields.filter(isRecord).map(field => ({ label: String(field.label).trim(), value: String(field.value).trim() })).filter(field => field.label && field.value)
    if (Array.isArray(input.menuOptions)) data.menuOptions = input.menuOptions.map(option => String(option).trim())
    data.eventType = String(input.type ?? input.eventType ?? 'nunta')
    return data
}

/** The same rules apply in the editor, persistence API and activation endpoint. */
export function validateEvent(input: Record<string, unknown>): FieldErrors {
    const errors: FieldErrors = {}
    const type = input.type ?? input.eventType ?? 'nunta'
    if (!isEventType(type)) errors.eventType = 'Alege un tip de eveniment valid.'
    if (!isTemplateId(input.template ?? DEFAULT_TEMPLATE)) errors.template = 'Alege un model valid.'
    for (const [key, max] of Object.entries(TEXT_LIMITS)) {
        const value = input[key]
        if (value !== undefined && value !== null && (typeof value !== 'string' || value.length > max)) errors[key] = `Folosește un text de maximum ${max} de caractere.`
    }
    for (const [key, label] of [['title', 'titlul invitației'], ['date', 'data evenimentului'], ['location', 'locația']] as const) {
        if (typeof input[key] !== 'string' || !input[key].trim()) errors[key] = `Completează ${label}.`
    }
    const iso = typeof input.eventDateISO === 'string' ? input.eventDateISO.trim() : ''
    const displayDate = typeof input.date === 'string' ? input.date.trim() : ''
    if (iso ? !/^\d{4}-\d{2}-\d{2}$/.test(iso) || !validDate(iso) : displayDate && !validDate(displayDate)) errors.date = 'Alege o dată calendaristică validă.'
    for (const key of ['locationUrl', 'photoUrl', 'audioUrl', 'videoUrl']) {
        if (typeof input[key] === 'string' && input[key].trim() && !isWebUrl(input[key].trim())) errors[key] = 'Folosește un link complet care începe cu https:// sau http://.'
    }
    for (const key of Object.keys(TEXT_LIMITS).filter(key => key.endsWith('Time'))) {
        if (input[key] && (typeof input[key] !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(input[key]))) errors[key] = 'Folosește o oră validă, de exemplu 19:30.'
    }
    if (input.age && (typeof input.age !== 'string' || !/^\d{1,3}$/.test(input.age) || Number(input.age) > 150)) errors.age = 'Vârsta trebuie să fie un număr între 0 și 150.'
    if (input.customFields !== undefined && (!Array.isArray(input.customFields) || input.customFields.length > 20 || input.customFields.some(field => !isRecord(field) || typeof field.label !== 'string' || typeof field.value !== 'string' || field.label.length > 120 || field.value.length > 1000 || Boolean(field.label.trim()) !== Boolean(field.value.trim())))) errors.customFields = 'Completează eticheta și valoarea fiecărui câmp; poți adăuga cel mult 20.'
    if (input.menuOptions !== undefined && (!Array.isArray(input.menuOptions) || input.menuOptions.length > 20 || input.menuOptions.some(option => typeof option !== 'string' || !option.trim() || option.length > 120))) errors.menuOptions = 'Opțiunile de meniu nu sunt valide.'
    return errors
}

export function validateGuest(input: Record<string, unknown>, requireContact = true): FieldErrors {
    const errors: FieldErrors = {}
    if (typeof input.name !== 'string' || input.name.trim().length < 2 || input.name.trim().length > 120) errors.name = 'Completează un nume între 2 și 120 de caractere.'
    const contact = typeof input.contact === 'string' ? input.contact.trim() : ''
    if ((requireContact || contact) && !isContact(contact)) errors.contact = 'Completează un email sau un număr de telefon valid.'
    if (input.contact !== undefined && typeof input.contact !== 'string') errors.contact = 'Completează un contact valid.'
    if (input.status !== undefined && !['pending', 'confirmed', 'declined'].includes(String(input.status))) errors.status = 'Alege un răspuns valid.'
    const persons = input.persons ?? 1
    if (input.status !== 'declined' && (typeof persons !== 'number' || !Number.isInteger(persons) || persons < 1 || persons > 20)) errors.persons = 'Numărul de persoane trebuie să fie întreg, între 1 și 20.'
    if (input.message !== undefined && (typeof input.message !== 'string' || input.message.length > 1000)) errors.message = 'Mesajul poate avea maximum 1000 de caractere.'
    return errors
}

export function validateRegistration(input: Record<string, unknown>): string | null {
    if (typeof input.email !== 'string' || !isEmail(input.email.trim())) return 'Adresa de email nu este validă.'
    if (typeof input.name !== 'string' || input.name.trim().length < 2 || input.name.trim().length > 120) return 'Completează un nume între 2 și 120 de caractere.'
    if (typeof input.password !== 'string' || input.password.length < 6 || input.password.length > 200) return 'Parola trebuie să aibă între 6 și 200 de caractere.'
    if (input.acceptTerms !== true) return 'Pentru a crea contul trebuie să accepți Termenii și condițiile.'
    return null
}

export const BILLING_LIMITS: Record<string, number> = { companyName: 200, cui: 20, regCom: 40, address: 300, city: 100, county: 100, bank: 100, iban: 40 }
export function validateBilling(input: Record<string, unknown>): string | null {
    for (const [field, max] of Object.entries(BILLING_LIMITS)) {
        if (input[field] !== undefined && input[field] !== null && (typeof input[field] !== 'string' || input[field].length > max)) return `Câmpul ${field} trebuie să fie text de maximum ${max} de caractere.`
    }
    if (typeof input.cui === 'string' && input.cui.trim() && !/^(RO\s*)?\d{2,10}$/i.test(input.cui.trim())) return 'CUI-ul trebuie să conțină între 2 și 10 cifre, cu prefixul RO opțional.'
    return null
}
