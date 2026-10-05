'use client'

import { useState, type CSSProperties } from 'react'
import { ArrowDown, ArrowUpRight, Heart, Pause, Play, Plane } from 'lucide-react'
import RSVPModal from '@/components/RSVPModal'
import { InvitationDetails, type TemplateProps } from './InvitationParts'
import { mainNameParts, heroKicker, formatDateParts } from './heroText'
import { str } from './templateUtils'
import { useAudioPlayer } from './useAudioPlayer'
import shared from './CollectionTemplate.module.css'
import s from './ConceptTemplate.module.css'

export type Concept = 'classic' | 'classic-gold' | 'classic-minimal' | 'netflix' | 'boarding' | 'vinyl' | 'scratch' | 'passport' | 'news' | 'cinema' | 'festival' | 'vip' | 'story' | 'chat'
const labels: Record<Concept,string> = { classic:'MAISON', 'classic-gold':'CHAMPAGNE', 'classic-minimal':'PURE', netflix:'PREMIERE', boarding:'THE JOURNEY', vinyl:'ON RECORD', scratch:'LUCKY US', passport:'ANYWHERE TOGETHER', news:'THE SUNDAY EDIT', cinema:'THE FEATURE', festival:'DAYDREAM', vip:'PRIVATE CLUB', story:'IN FRAME', chat:'LOVE NOTES' }

export default function ConceptTemplate({ concept, ...props }: TemplateProps & { concept: Concept }) {
    const [rsvp, setRsvp] = useState(false)
    const [revealed, setRevealed] = useState(false)
    const [storyIndex, setStoryIndex] = useState(0)
    const names = mainNameParts(props)
    const date = formatDateParts(props)
    const photo = str(props.photoUrl)
    const video = str(props.videoUrl)
    const message = str(props.message)
    const location = str(props.location)
    const initials = names.map(n => n.charAt(0)).join('')
    const player = useAudioPlayer(str(props.audioUrl))
    const longest = Math.max(...names.map(n=>n.length),1)
    const titleStyle = { '--name-scale': longest > 30 ? .55 : longest > 18 ? .72 : 1 } as CSSProperties
    const heading = <h1 className={s.names} style={titleStyle}>{names.map((n,i)=><span key={i}>{i>0 && <><i aria-hidden="true">&</i><span className="sr-only"> și </span></>}{n}</span>)}</h1>
    const dateLine = <div className={s.date}><span>{date.weekday}</span><strong>{date.numeric || date.text || 'SAVE THE DATE'}</strong></div>
    const image = <div className={s.photo}>{photo ? <img src={photo} alt={names.join(' și ')} /> : <span>{initials || '♡'}</span>}</div>
    const sound = player.hasAudio && <button className={s.sound} onClick={player.toggle} aria-label={player.isPlaying ? 'Pauză muzică' : 'Pornește muzica'}>{player.isPlaying ? <Pause size={16} /> : <Play size={16} />}<span>{player.isPlaying ? 'Se aude povestea noastră' : 'Ascultă povestea noastră'}</span></button>
    const openDetails = (event: React.MouseEvent<HTMLButtonElement>) => event.currentTarget.ownerDocument.getElementById('invitation-details')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
    return <div className={shared.root+' '+s.root+' '+s[concept]}><div className={shared.paper}>
        <header className={s.hero}>
            <div className={s.edition}><span>{labels[concept]}</span><span>{date.year || 'WITH LOVE'}</span></div>
            {concept === 'classic' && <><div className={s.maisonFrame} aria-hidden="true"/><div className={s.botanicalMark} aria-hidden="true">❦</div><p className={s.kicker}>{heroKicker(props)}</p>{heading}<div className={s.maisonPortrait}>{image}</div>{dateLine}<p className={s.location}>{location}</p></>}
            {concept === 'classic-gold' && <><span className={s.handwritten}>with love,</span><p className={s.kicker}>{heroKicker(props)}</p>{heading}<div className={s.goldRule}/>{dateLine}<p className={s.location}>{location}</p></>}
            {concept === 'classic-minimal' && <><p className={s.kicker}>{heroKicker(props)}</p>{heading}<div className={s.pureDate}><span>{date.day || '01'}</span><i>/</i><span>{date.month ? date.month.slice(0,3) : '♡'}</span></div><div className={s.pureFooter}><span>{date.year}</span><p>{location}</p><ArrowUpRight size={32}/></div></>}
            {concept === 'netflix' && <><div className={s.premierePhoto}>{image}</div><div className={s.redLine}/><p className={s.kicker}>O poveste originală. O singură premieră.</p>{heading}<span className={s.premiereLabel}>ÎN ROLURILE PRINCIPALE: NOI.</span>{dateLine}<p className={s.location}>{location}</p></>}
            {concept === 'boarding' && <><div className={s.journeyTop}><Plane size={24}/><span>ONE WAY TICKET<br/>TO A BEAUTIFUL BEGINNING</span></div><p className={s.kicker}>{heroKicker(props)}</p>{heading}<div className={s.route}><span>ACUM</span><i/><Heart size={20}/><i/><span>MEREU</span></div><div className={s.ticket}>{dateLine}<p className={s.location}>{location}</p><span className={s.barcode} aria-hidden="true"/><small>GATE 01 · ADMIT WITH LOVE</small></div></>}
            {concept === 'vinyl' && <><p className={s.kicker}>Our favourite track? Us.</p><div className={s.record+' '+(player.isPlaying ? s.spinning : '')}><div className={s.recordLabel}>{photo ? <img src={photo} alt=""/> : <span>{initials}</span>}<i/></div></div>{heading}<div className={s.track}><span>01 — A DAY TO REMEMBER</span><span>∞</span></div>{dateLine}{sound}</>}
            {concept === 'scratch' && <><p className={s.kicker}>Unele surprize schimbă totul.</p>{heading}<div className={s.revealCard}>{revealed ? <><span className={s.kicker}>SAVE THE DATE</span>{dateLine}<Heart size={23}/></> : <><span className={s.foilText}>A LITTLE<br/><i>surprise.</i></span><button onClick={()=>setRevealed(true)} className={s.revealButton}>Descoperă data <ArrowUpRight size={15}/></button></>}</div><p className={s.location}>{location}</p></>}
            {concept === 'passport' && <><p className={s.kicker}>Începe cea mai frumoasă călătorie</p>{heading}<div className={s.passportStamp}><span>DESTINATION</span><strong>FOREVER</strong><small>{date.numeric || date.text}</small></div><p className={s.location}>{location}</p></>}
            {concept === 'news' && <><div className={s.masthead}>The<br/><i>Sunday Edit.</i></div><div className={s.newsMeta}><span>EDIȚIE SPECIALĂ</span><span>{date.numeric || date.text}</span></div><p className={s.kicker}>{heroKicker(props)}</p>{heading}<div className={s.newsPhoto}>{image}<span>01 / THE START OF SOMETHING GOOD</span></div></>}
            {concept === 'cinema' && <><div className={s.filmPerforations} aria-hidden="true"/><p className={s.kicker}>A film by life. Starring us.</p><div className={s.filmPhoto}>{image}</div>{heading}<div className={s.credits}><span>O ZI DE NEUITAT</span><strong>{date.numeric || date.text}</strong><span>{location}</span></div></>}
            {concept === 'festival' && <><span className={s.festivalSticker}>GOOD<br/>TIMES<br/>ONLY ↗</span><p className={s.kicker}>You + us + one unforgettable night.</p>{heading}<div className={s.festivalPass}>{dateLine}<ArrowUpRight size={35}/></div><p className={s.location}>{location}</p>{sound}</>}
            {concept === 'vip' && <><p className={s.kicker}>Reserved for you.</p><div className={s.memberCard}><div className={s.memberTop}><span>PRIVATE<br/>CLUB</span></div><span className={s.memberInitials}>{initials}</span><div className={s.memberBottom}><span>MEMBER OF OUR STORY</span><span>№ 001</span></div></div>{heading}{dateLine}<p className={s.location}>{location}</p></>}
            {concept === 'story' && <><div className={s.storyBackdrop}>{image}</div><div className={s.storyShade}/><div className={s.storyProgress} role="group" aria-label="Capitole invitație">{['Noi','Ziua','Invitația'].map((label,i)=><button key={label} aria-label={label} aria-pressed={storyIndex===i} onClick={()=>setStoryIndex(i)}/>)}</div><div className={s.storyText}><span className={s.kicker}>CAPITOLUL 0{storyIndex+1}</span>{storyIndex===0 ? <><span className={s.handwritten}>This is us.</span>{heading}</> : storyIndex===1 ? <><h1 className={s.chapterTitle}>The day.</h1>{dateLine}<p>{location}</p></> : <><h1 className={s.chapterTitle}>Be there.</h1><p>{message}</p><button className={s.storyRsvp} onClick={()=>setRsvp(true)}>Confirmă prezența <ArrowUpRight size={18}/></button></>}<button className={s.nextChapter} onClick={()=>setStoryIndex((storyIndex+1)%3)}>Următorul capitol <ArrowUpRight size={18}/></button></div></>}
            {concept === 'chat' && <><p className={s.kicker}>Un mesaj, doar pentru tine.</p><div className={s.noteStack}><div className={s.noteBack}/><div className={s.notePaper}><Heart size={23} strokeWidth={1}/><span className={s.handwritten}>Dear you,</span>{heading}<p>Avem o zi specială.<br/>Și nu ar fi la fel fără tine.</p></div><span className={s.noteTape}/></div>{dateLine}<button className={s.reply} onClick={()=>setRsvp(true)}>Cu drag, vin! <Heart size={15}/></button>{sound}</>}
            <button className={s.scrollCue} onClick={openDetails} aria-label="Descoperă detaliile invitației"><span>TOATE DETALIILE</span><ArrowDown size={16}/></button>
        </header>
        <main id="invitation-details" className={shared.body}>
            {['classic-gold', 'classic-minimal', 'festival', 'vip'].includes(concept) && photo && <div className={shared.destinationPhoto}>{image}</div>}
            {message && <section className={shared.messageBlock}><span className={shared.sectionNumber}>THIS IS YOUR INVITATION</span><p className={shared.message}>{message}</p></section>}
            {video && ['netflix','story'].includes(concept) && <section className={s.videoSection}><span className={shared.sectionNumber}>POVESTEA ÎN MIȘCARE</span><video src={video} controls playsInline preload="none" poster={photo || undefined} aria-label="Videoclipul invitației"/></section>}
            <div className={shared.details}><InvitationDetails props={props} s={shared} titles={{program:'Planul zilei',location:'Ne vedem aici'}}/></div>
            <section className={shared.rsvpBlock}><span className={shared.sectionNumber}>O ZI MAI FRUMOASĂ CU TINE</span><h2>Îți păstrăm un loc.</h2><p>Spune-ne dacă vii. De restul ne ocupăm noi.</p><button className={shared.rsvpButton} onClick={()=>setRsvp(true)}>Confirmă prezența <ArrowUpRight size={18}/></button></section>
            <footer className={shared.signature}><span>{names.join(' & ')}</span><small>{date.numeric || date.text}</small></footer>
        </main>
    </div>{rsvp && <RSVPModal isOpen={rsvp} onClose={()=>setRsvp(false)} eventId={props.id}/>}</div>
}
