'use client'

// Building blocks shared by the 2026 templates (modern, boho, botez-delicat, kids, gala, corporate):
// the content sections are the same, each template brings its own hero, typography, colors and ornaments
// through the CSS module classes it passes in `s`.
import { Fragment, useEffect, useState, type ReactNode } from 'react'
import { CalendarPlus, MapPin, Navigation } from 'lucide-react'
import {
    str, getMapUrl, getWazeUrl, getSchedule, getParents, getGodparents, validCustomFields, isWedding,
} from './templateUtils'
import { calendarEventFromProps, countdownParts, eventDateISO, firstTime, googleCalendarUrl, icsContent, parseAgenda } from './eventExtras'

type S = Record<string, string | undefined>
const cx = (...c: (string | undefined | false)[]) => c.filter(Boolean).join(' ')

// Câmpurile comune declarate explicit (tipurile din templateUtils / eventExtras sunt „slabe” și cer măcar un câmp comun)
export type TemplateProps = Record<string, unknown> & { id?: string; eventType?: unknown; eventDateISO?: unknown; date?: unknown }

/** Days / hours / minutes until the event (client only, refreshed every 30 s; hidden after the date). */
export function Countdown({ props, s, label = 'Până la eveniment' }: { props: TemplateProps; s: S; label?: string }) {
    const dateISO = eventDateISO(props)
    const time = firstTime(props)
    const [parts, setParts] = useState<ReturnType<typeof countdownParts>>(null)
    useEffect(() => {
        const tick = () => setParts(countdownParts(dateISO, time))
        tick()
        const t = setInterval(tick, 30_000)
        return () => clearInterval(t)
    }, [dateISO, time])
    if (!parts) return null
    const units: [number, string, string][] = [
        [parts.days, 'zi', 'zile'],
        [parts.hours, 'oră', 'ore'],
        [parts.minutes, 'minut', 'minute'],
    ]
    return (
        <div className={s.countdown} role="timer" aria-label={`${label}: ${parts.days} zile, ${parts.hours} ore, ${parts.minutes} minute`}>
            {label && <div className={s.countdownLabel}>{label}</div>}
            <div className={s.countdownRow}>
                {units.map(([n, one, many]) => (
                    <div key={many} className={s.countdownUnit}>
                        <span className={s.countdownNum}>{n}</span>
                        <span className={s.countdownText}>{n === 1 ? one : many}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

/** Google Maps + Waze + calendar (Google link and .ics for Apple/Outlook). */
export function EventLinks({ props, s }: { props: TemplateProps; s: S }) {
    const location = str(props.location)
    const mapUrl = getMapUrl(location, props.locationUrl)
    const wazeUrl = getWazeUrl(location)
    const cal = calendarEventFromProps(props)
    const gcal = cal ? googleCalendarUrl(cal) : ''

    const downloadIcs = () => {
        if (!cal) return
        const blob = new Blob([icsContent(cal, str(props.id) || 'previzualizare')], { type: 'text/calendar;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'invitatie.ics'
        document.body.appendChild(a)
        a.click()
        a.remove()
        setTimeout(() => URL.revokeObjectURL(url), 1000)
    }

    if (!mapUrl && !wazeUrl && !cal) return null
    return (
        <div className={s.links}>
            {mapUrl && (
                <a className={s.link} href={mapUrl} target="_blank" rel="noopener noreferrer">
                    <MapPin size={16} aria-hidden="true" /> Google Maps
                </a>
            )}
            {wazeUrl && (
                <a className={s.link} href={wazeUrl} target="_blank" rel="noopener noreferrer">
                    <Navigation size={16} aria-hidden="true" /> Waze
                </a>
            )}
            {gcal && (
                <a className={s.link} href={gcal} target="_blank" rel="noopener noreferrer">
                    <CalendarPlus size={16} aria-hidden="true" /> Google Calendar
                </a>
            )}
            {cal && (
                <button type="button" className={s.link} onClick={downloadIcs}>
                    <CalendarPlus size={16} aria-hidden="true" /> Apple / Outlook
                </button>
            )}
        </div>
    )
}

interface DetailsOptions {
    s: S
    props: TemplateProps
    /** Rendered between sections (an ornament) */
    divider?: ReactNode
    /** Titles, overridable per template */
    titles?: Partial<Record<'family' | 'godparents' | 'program' | 'agenda' | 'details' | 'location', string>>
    /** Sections not to render here (the template shows them elsewhere) */
    skip?: ('family' | 'program' | 'agenda' | 'details' | 'location' | 'countdown')[]
    countdownLabel?: string
}

/** Family, program, agenda, practical details, location with map/calendar links and countdown. */
export function InvitationDetails({ s, props, divider, titles = {}, skip = [], countdownLabel }: DetailsOptions) {
    const wedding = isWedding(props.eventType)
    const parents = getParents(props)
    const godparents = getGodparents(props)
    const schedule = getSchedule(props)
    const agenda = parseAgenda(props.agenda)
    const fields = validCustomFields(props.customFields)
    const dress = str(props.dressCode)
    const extra = str(props.specialInstructions)
    const host = str(props.host)
    const theme = str(props.theme)
    const location = str(props.location)

    const sections: { key: string; node: ReactNode }[] = []

    if (!skip.includes('family') && (parents.length || godparents)) {
        sections.push({
            key: 'family',
            node: (
                <section className={cx(s.section, s.family)}>
                    {parents.length > 0 && (
                        <>
                            <h3 className={s.sectionTitle}>{titles.family || (wedding ? 'Alături de părinții' : 'Cu drag, părinții')}</h3>
                            {parents.map((p) => <p key={p} className={s.sectionText}>{p}</p>)}
                        </>
                    )}
                    {godparents && (
                        <>
                            <h3 className={cx(s.sectionTitle, parents.length > 0 && s.sectionTitleNext)}>{titles.godparents || 'și nașii'}</h3>
                            <p className={cx(s.sectionText, s.accentText)}>{godparents}</p>
                        </>
                    )}
                </section>
            ),
        })
    }

    if (!skip.includes('program') && schedule.length) {
        sections.push({
            key: 'program',
            node: (
                <section className={cx(s.section, s.program)}>
                    <h3 className={s.sectionTitle}>{titles.program || 'Programul'}</h3>
                    <ol className={s.schedule}>
                        {schedule.map((i) => (
                            <li key={i.key} className={s.scheduleItem}>
                                {i.time && <span className={s.scheduleTime}>{i.time}</span>}
                                <span className={s.scheduleBody}>
                                    <span className={s.scheduleLabel}>{i.label}</span>
                                    {i.loc && <span className={s.scheduleLoc}>{i.loc}</span>}
                                </span>
                            </li>
                        ))}
                    </ol>
                </section>
            ),
        })
    }

    if (!skip.includes('agenda') && agenda.length) {
        sections.push({
            key: 'agenda',
            node: (
                <section className={cx(s.section, s.agendaSection)}>
                    <h3 className={s.sectionTitle}>{titles.agenda || 'Agenda serii'}</h3>
                    <ol className={s.schedule}>
                        {agenda.map((i, idx) => (
                            <li key={`${i.time}-${idx}`} className={s.scheduleItem}>
                                {i.time && <span className={s.scheduleTime}>{i.time}</span>}
                                <span className={s.scheduleBody}>
                                    <span className={s.scheduleLabel}>{i.text}</span>
                                </span>
                            </li>
                        ))}
                    </ol>
                </section>
            ),
        })
    }

    const detailRows: { label: string; value: string }[] = [
        ...(dress ? [{ label: 'Ținută', value: dress }] : []),
        ...(theme ? [{ label: 'Tema', value: theme }] : []),
        ...(host ? [{ label: 'Gazde', value: host }] : []),
        ...fields.map((f) => ({ label: f.label, value: f.value })),
        ...(str(props.rsvpDeadline) ? [{ label: 'Confirmați până la', value: str(props.rsvpDeadline) }] : []),
    ]
    if (!skip.includes('details') && (detailRows.length || extra)) {
        sections.push({
            key: 'details',
            node: (
                <section className={cx(s.section, s.detailsSection)}>
                    <h3 className={s.sectionTitle}>{titles.details || 'Bine de știut'}</h3>
                    {detailRows.length > 0 && (
                        <dl className={s.fieldGrid}>
                            {detailRows.map((r, i) => (
                                <div key={`${r.label}-${i}`} className={s.field}>
                                    <dt className={s.fieldLabel}>{r.label}</dt>
                                    <dd className={s.fieldValue}>{r.value}</dd>
                                </div>
                            ))}
                        </dl>
                    )}
                    {extra && <p className={cx(s.sectionText, s.note)}>{extra}</p>}
                </section>
            ),
        })
    }

    if (!skip.includes('location') && location) {
        sections.push({
            key: 'location',
            node: (
                <section className={cx(s.section, s.locationSection)}>
                    <h3 className={s.sectionTitle}>{titles.location || 'Locația'}</h3>
                    <p className={s.locationText}>{location}</p>
                    <EventLinks props={props} s={s} />
                </section>
            ),
        })
    }

    return (
        <>
            {sections.map((sec, i) => (
                <Fragment key={sec.key}>
                    {i > 0 && divider}
                    {sec.node}
                </Fragment>
            ))}
            {!skip.includes('countdown') && <Countdown props={props} s={s} label={countdownLabel} />}
        </>
    )
}
