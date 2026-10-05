'use client'

import { useState, type CSSProperties } from 'react'
import { ArrowDown, ArrowUpRight, Check, Play } from 'lucide-react'
import RSVPModal from '@/components/RSVPModal'
import { InvitationDetails, type TemplateProps } from './InvitationParts'
import { mainNameParts, heroKicker, formatDateParts } from './heroText'
import { str } from './templateUtils'
import styles from './CollectionTemplate.module.css'

export type CollectionTheme = 'modern' | 'boho' | 'botez-delicat' | 'kids' | 'gala' | 'corporate' | 'riviera' | 'nocturne'
const labels: Record<CollectionTheme, string> = { modern: 'VOW / THE WEDDING EDITION', boho: 'BOTANICA / GROWING TOGETHER', 'botez-delicat': 'LUNA / A LITTLE WONDER', kids: 'CONFETTI CLUB / LET’S CELEBRATE', gala: 'AFTER DARK / A NIGHT TO REMEMBER', corporate: 'THE GATHERING / PEOPLE & IDEAS', riviera: 'RIVIERA / MOMENTS IN THE SUN', nocturne: 'ÉTERNITÉ / OUR STORY BEGINS' }

function BotanicalArt() {
    return <svg className={styles.botanicalArt} viewBox="0 0 300 440" fill="none" aria-hidden="true"><path d="M140 430C90 310 230 215 125 30M125 30C150 82 183 54 171 19C153 4 133 10 125 30ZM140 397C55 400 10 351 43 326C76 318 112 352 140 397ZM143 321C219 326 282 282 263 258C216 242 169 280 143 321ZM159 240C98 241 48 205 66 181C102 168 142 203 159 240ZM151 147C215 155 252 109 230 91C196 86 166 121 151 147Z" stroke="currentColor" strokeWidth="1.3"/><path d="M78 430C27 272 84 142 29 94M29 94C4 56 45 32 55 55C59 75 39 86 29 94M68 296C23 281 3 232 19 221C39 214 62 267 68 296M67 216C106 195 135 160 117 145C91 149 72 189 67 216" stroke="currentColor" strokeWidth="1"/></svg>
}

function Names({ names }: { names: string[] }) {
    const longest = Math.max(...names.map(n => n.length), 1)
    const style = { '--name-scale': longest > 32 ? .55 : longest > 20 ? .68 : longest > 13 ? .8 : 1 } as CSSProperties
    return <h1 className={styles.names} style={style}>{names.map((name, i) => <span className={styles.name} key={i}>{i > 0 && <><i className={styles.amp} aria-hidden="true">&</i><span className="sr-only"> și </span></>}{name}</span>)}</h1>
}

export default function CollectionTemplate({ designTheme: theme, ...props }: TemplateProps & { designTheme: CollectionTheme }) {
    const [rsvp, setRsvp] = useState(false)
    const [celebrate, setCelebrate] = useState(false)
    const names = theme === 'corporate' ? [str(props.title) || 'The Gathering'] : mainNameParts(props)
    const date = formatDateParts(props)
    const photo = str(props.photoUrl)
    const location = str(props.location)
    const message = str(props.message)
    const age = str(props.age)
    const initials = names.map(n => n.charAt(0)).join(' & ')
    const dateText = date.numeric || date.text
    const dateLine = <div className={styles.dateLine}><span>{date.weekday || 'SAVE THE DATE'}</span><strong>{dateText || 'Data urmează'}</strong></div>
    const portrait = <div className={styles.portrait}>{photo ? <img src={photo} alt={names.join(' și ')} /> : <span className={styles.monogram}>{initials}</span>}</div>
    const openDetails = (event: React.MouseEvent<HTMLButtonElement>) => event.currentTarget.ownerDocument.getElementById('invitation-details')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })

    return <div className={styles.root + ' ' + styles[theme]}>
        <div className={styles.paper}>
            <header className={styles.hero}>
                <div className={styles.edition}><span>{labels[theme].split(' / ')[0]}</span><span>{date.year || 'INVITAȚIE'}</span></div>
                {theme === 'modern' && <>
                    <div className={styles.modernHeading}><p className={styles.kicker}>{heroKicker(props)}</p><Names names={names} /></div>
                    <div className={styles.editorialPhoto}>{portrait}<span className={styles.photoCaption}>The beginning of everything.</span></div>
                    <div className={styles.heroFoot}>{dateLine}<span className={styles.smallPlace}>{location}</span></div>
                </>}
                {theme === 'boho' && <>
                    <BotanicalArt /><p className={styles.kicker}>{heroKicker(props)}</p><Names names={names} />
                    <div className={styles.botanicPhoto}>{portrait}<span className={styles.roundSeal}>with love<br />& joy</span></div>
                    {dateLine}<p className={styles.smallPlace}>{location}</p>
                </>}
                {theme === 'botez-delicat' && <>
                    <div className={styles.moonScene} aria-hidden="true"><div className={styles.moon} /><span className={styles.orbit} /></div>
                    <p className={styles.kicker}>{heroKicker(props)}</p><span className={styles.littleIntro}>O minune mică.<br /><i>O iubire infinită.</i></span><Names names={names} />
                    {photo && <div className={styles.babyPhoto}>{portrait}</div>}
                    {dateLine}<p className={styles.smallPlace}>{location}</p>
                </>}
                {theme === 'kids' && <>
                    <p className={styles.kicker}>Ești pe lista de distracție!</p><div className={styles.partyArtwork} aria-hidden="true"><span className={styles.partyBackdrop} /><span className={styles.partyAge}>{age || 'YAY!'}</span><span className={styles.partySticker}>LET’S<br />PARTY!</span><i className={styles.squiggle}>〰</i></div>
                    <Names names={names} /><p className={styles.partySub}>{age ? 'ani de zâmbete. O petrecere de neuitat.' : 'O zi mare. Cu oamenii preferați.'}</p>
                    <div className={styles.partyTicket}>{dateLine}<span className={styles.ticketArrow}>↗</span></div>
                    <button className={styles.confettiButton} onClick={() => setCelebrate(v => !v)} aria-pressed={celebrate}><Play size={16} /> Dă startul bucuriei</button>
                    {celebrate && <div className={styles.confetti} aria-hidden="true">{Array.from({ length: 14 }, (_, i) => <i key={i} style={{ '--i': i } as CSSProperties} />)}</div>}
                </>}
                {theme === 'gala' && <>
                    <div className={styles.goldOrbit} aria-hidden="true"><i /><i /><i /></div><p className={styles.kicker}>{heroKicker(props)}</p><span className={styles.nightIntro}>You’re invited.</span><Names names={names} />
                    <div className={styles.galaDate}><span>{date.day || '01'}</span><div>{date.month}<br />{date.year}</div></div><p className={styles.smallPlace}>{location}</p>
                </>}
                {theme === 'corporate' && <>
                    <div className={styles.corporateTag}><span className={styles.liveDot} /> {str(props.host) || 'LET’S MAKE IT HAPPEN'}</div><Names names={names} />
                    <div className={styles.sculpture} aria-hidden="true"><span /><span /><span /><span /></div><div className={styles.corporateFooter}>{dateLine}<ArrowUpRight size={54} strokeWidth={1} /></div>
                </>}
                {theme === 'riviera' && <>
                    <div className={styles.tileBorder} aria-hidden="true" /><p className={styles.kicker}>{heroKicker(props)}</p><Names names={names} />
                    <span className={styles.rivieraPhrase}>la vita è più bella, insieme.</span>
                    <div className={styles.rivieraDate}>{date.day || '♡'}<span>{date.month} {date.year}</span></div><p className={styles.smallPlace}>{location}</p>
                    <div className={styles.waves} aria-hidden="true" />
                </>}
                {theme === 'nocturne' && <>
                    {photo && <img className={styles.cinemaPhoto} src={photo} alt="" />}
                    <div className={styles.cinemaShade} /><div className={styles.cinemaContent}><p className={styles.kicker}>{heroKicker(props)}</p><span className={styles.filmNote}>a once in a lifetime kind of love</span><Names names={names} />{dateLine}<p className={styles.smallPlace}>{location}</p></div>
                </>}
                <button className={styles.scrollCue} onClick={openDetails} aria-label="Descoperă detaliile invitației"><span>POVESTEA CONTINUĂ</span><ArrowDown size={16} /></button>
            </header>
            <main id="invitation-details" className={styles.body}>
                {message && <section className={styles.messageBlock}><span className={styles.sectionNumber}>01 / INVITAȚIA</span><p className={styles.message}>{message}</p></section>}
                {theme === 'riviera' && photo && <div className={styles.destinationPhoto}>{portrait}</div>}
                {['kids', 'gala', 'corporate'].includes(theme) && photo && <div className={styles.destinationPhoto}>{portrait}</div>}
                <div className={styles.details}><InvitationDetails props={props} s={styles} titles={{ program: 'Planul zilei', location: 'Ne vedem aici', details: 'Micile detalii' }} /></div>
                <section className={styles.rsvpBlock}><span className={styles.sectionNumber}>UN LOC PĂSTRAT PENTRU TINE</span><h2>Vii alături de noi?</h2><p>Abia așteptăm să împărțim acest moment cu tine.</p><button className={styles.rsvpButton} onClick={() => setRsvp(true)}>Confirmă prezența <ArrowUpRight size={19} /></button><span className={styles.rsvpHint}><Check size={12} /> Răspunsul tău ajunge direct la gazde</span></section>
                <footer className={styles.signature}><span>{names.join(' & ')}</span><small>{dateText}</small></footer>
            </main>
        </div>
        {rsvp && <RSVPModal isOpen={rsvp} onClose={() => setRsvp(false)} eventId={props.id} />}
    </div>
}
