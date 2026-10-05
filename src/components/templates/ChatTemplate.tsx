'use client'

import { useState, useEffect, useRef } from 'react'
import styles from './ChatTemplate.module.css'
import RSVPModal from '@/components/RSVPModal'
import { ChevronLeft, ChevronsDown, Play, Pause, Mic, Phone, Video, MoreVertical, Smile, Paperclip, MapPin, Send } from 'lucide-react'
import { useAudioPlayer } from './useAudioPlayer'
import {
    str, getMapUrl, getWazeUrl, getMainNames, getSchedule, getParents, getGodparents,
    validCustomFields, CustomField,
} from './templateUtils'

interface ChatTemplateProps {
    id?: string
    title?: string
    date?: string
    location?: string
    locationUrl?: string
    message?: string
    eventType?: string
    audioUrl?: string
    photoUrl?: string
    groomName?: string
    brideName?: string
    childName?: string
    celebrantName?: string
    age?: string
    civilCeremonyTime?: string
    civilCeremonyLoc?: string
    religiousCeremonyTime?: string
    religiousCeremonyLoc?: string
    partyTime?: string
    partyLoc?: string
    churchTime?: string
    churchLoc?: string
    restaurantTime?: string
    restaurantLoc?: string
    specialInstructions?: string
    dressCode?: string
    parentsGroom?: string
    parentsBride?: string
    godparents?: string
    godparentsBaptism?: string
    motherName?: string
    fatherName?: string
    customFields?: CustomField[]
}

type MessageType = 'text' | 'image' | 'audio' | 'location'

interface ScriptMessage {
    key: string
    type: MessageType
    content: string
    delay: number
}

function nowTime() {
    return new Date().toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })
}

export default function ChatTemplate(props: ChatTemplateProps) {
    const {
        id, date, location, locationUrl, message, eventType = 'nunta',
        age, specialInstructions, dressCode, audioUrl, photoUrl, customFields,
    } = props

    const [shown, setShown] = useState(1)
    const [isTyping, setIsTyping] = useState(false)
    const [showRSVP, setShowRSVP] = useState(false)
    const { isPlaying, toggle: handleAudioPlay } = useAudioPlayer(audioUrl, false)
    const listRef = useRef<HTMLDivElement>(null)
    const [timestamps, setTimestamps] = useState<string[]>([])

    const names = getMainNames(props)
    const dateText = str(date)
    const mapUrl = getMapUrl(location, locationUrl)
    const wazeUrl = getWazeUrl(location)
    const schedule = getSchedule(props)
    const parents = getParents(props)
    const godparentsText = getGodparents(props)
    const fields = validCustomFields(customFields)

    const announce = (() => {
        const when = dateText ? ` pe ${dateText}` : ''
        switch (eventType) {
            case 'botez': return `Îl/o creștinăm pe ${str(props.childName) || names || 'micuțul nostru'}${when}!`
            case 'aniversare': return `Sărbătorim ${str(age) ? `${str(age)} ani` : 'o aniversare'}${when}!`
            case 'petrecere': return `Facem o petrecere${when}!`
            default: return `Ne căsătorim${when}!`
        }
    })()

    const extras = [
        str(dressCode) ? `Ținută: ${str(dressCode)}` : '',
        str(specialInstructions),
        ...fields.map((f) => `${f.label}: ${f.value}`),
    ].filter(Boolean)

    // Conversation script — rebuilt on every render, so edits in the editor show up live.
    const script: ScriptMessage[] = ([
        { key: 'hi', type: 'text', content: 'Salut!', delay: 600 },
        { key: 'msg', type: 'text', content: str(message) || 'Avem o veste mare!', delay: 700 },
        { key: 'announce', type: 'text', content: announce, delay: 1100 },
        photoUrl ? { key: 'photo', type: 'image', content: photoUrl, delay: 1000 } : null,
        str(location) ? { key: 'location', type: 'location', content: str(location), delay: 900 } : null,
        audioUrl ? { key: 'audio', type: 'audio', content: audioUrl, delay: 800 } : null,
        godparentsText ? { key: 'godparents', type: 'text', content: `Alături de nașii: ${godparentsText}`, delay: 800 } : null,
        parents.length ? { key: 'parents', type: 'text', content: `Alături de părinți: ${parents.join(' și ')}`, delay: 800 } : null,
        schedule.length ? {
            key: 'schedule',
            type: 'text',
            content: `Program:\n${schedule.map((s) => `• ${s.label}${s.time ? ` – ${s.time}` : ''}${s.loc ? `, ${s.loc}` : ''}`).join('\n')}`,
            delay: 800,
        } : null,
        extras.length ? { key: 'extras', type: 'text', content: extras.join('\n'), delay: 1300 } : null,
        { key: 'bye', type: 'text', content: 'Te așteptăm cu drag! Ce zici, poți ajunge?', delay: 1000 },
    ] as (ScriptMessage | null)[]).filter((m): m is ScriptMessage => m !== null)

    const scriptLength = script.length
    const lastDelay = shown > 0 ? (script[Math.min(shown, scriptLength) - 1]?.delay ?? 1000) : 1000
    const finished = shown >= scriptLength

    // Reveal messages one by one; every timer is cleaned up.
    useEffect(() => {
        if (shown >= scriptLength) return
        let typingTimer: ReturnType<typeof setTimeout> | undefined
        const waitTimer = setTimeout(() => {
            setIsTyping(true)
            typingTimer = setTimeout(() => {
                const stamp = nowTime()
                setTimestamps((t) => { const next = [...t]; next[shown] = stamp; return next })
                setIsTyping(false)
                setShown((s) => s + 1)
            }, 700 + Math.random() * 400)
        }, lastDelay)
        return () => {
            clearTimeout(waitTimer)
            if (typingTimer) clearTimeout(typingTimer)
            setIsTyping(false)
        }
    }, [shown, scriptLength, lastDelay])

    useEffect(() => {
        const el = listRef.current
        if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    }, [shown, isTyping])

    const visible = script.slice(0, shown)

    // Lets impatient guests reveal the whole conversation at once.
    const showAll = () => {
        const stamp = nowTime()
        setTimestamps((t) => script.map((_, i) => t[i] || stamp))
        setIsTyping(false)
        setShown(scriptLength)
    }

    return (
        <div className={styles.chatContainer}>
            <div className={styles.mobileScreen}>

                <div className={styles.header}>
                    <ChevronLeft className={styles.backBtn} size={24} />
                    <div className={styles.avatar}>
                        {photoUrl ? (
                            <img src={photoUrl} alt="" className={styles.avatarImg} />
                        ) : (names.charAt(0).toUpperCase() || '♥')}
                    </div>
                    <div className={styles.headerInfo}>
                        <div className={styles.chatTitle}>{names || 'Invitație'}</div>
                        <div className={styles.status}>
                            {isTyping ? 'scrie...' : 'online'}
                        </div>
                    </div>
                    <div className={styles.headerIcons}>
                        <Video size={20} />
                        <Phone size={20} />
                        <MoreVertical size={20} />
                    </div>
                </div>

                <div className={styles.messagesList} ref={listRef}>
                    <div className={styles.systemNote}>
                        Un mesaj special de la noi, pentru tine.
                    </div>

                    {visible.map((msg, i) => (
                        <div key={msg.key} className={`${styles.messageRow} ${styles.left}`}>
                            <div className={styles.bubble}>
                                {msg.type === 'text' && <span className={styles.text}>{msg.content}</span>}

                                {msg.type === 'image' && (
                                    <img src={msg.content} alt="Fotografie" className={styles.chatImage} />
                                )}

                                {msg.type === 'audio' && (
                                    <div className={styles.audioBubble}>
                                        <button className={styles.playBtn} onClick={handleAudioPlay} aria-label={isPlaying ? 'Pauză' : 'Redă'}>
                                            {isPlaying ? <Pause size={16} fill="white" /> : <Play size={16} fill="white" style={{ marginLeft: '2px' }} />}
                                        </button>
                                        <div className={styles.audioWave}>
                                            <div className={`${styles.audioProgress} ${isPlaying ? styles.playing : ''}`}></div>
                                        </div>
                                    </div>
                                )}

                                {msg.type === 'location' && (
                                    <div className={styles.locationBubble}>
                                        <div className={styles.locationCard}><MapPin size={26} /></div>
                                        <div className={styles.locationTitle}>Locația evenimentului</div>
                                        <div>{msg.content}</div>
                                        <div className={styles.mapLinks}>
                                            {mapUrl && <a href={mapUrl} target="_blank" rel="noopener noreferrer">Vezi harta</a>}
                                            {wazeUrl && <a href={wazeUrl} target="_blank" rel="noopener noreferrer">Waze</a>}
                                        </div>
                                    </div>
                                )}

                                <div className={styles.metaRow}>
                                    <span className={styles.timeStamp}>{timestamps[i] || ''}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className={styles.typing}>
                            <div className={styles.dot}></div>
                            <div className={styles.dot}></div>
                            <div className={styles.dot}></div>
                        </div>
                    )}
                </div>

                {!finished && shown > 0 && (
                    <button type="button" className={styles.skipBtn} onClick={showAll}>
                        Vezi toată invitația <ChevronsDown size={14} />
                    </button>
                )}

                {finished && (
                    <div className={styles.actionZone}>
                        <button
                            className={styles.whatsappBtn}
                            onClick={() => setShowRSVP(true)}
                        >
                            Da, confirm prezența!
                        </button>
                    </div>
                )}

                {/* The input bar is a shortcut: it reveals the conversation, then opens the RSVP form. */}
                <button
                    type="button"
                    className={styles.footer}
                    onClick={() => (finished ? setShowRSVP(true) : showAll())}
                    aria-label="Răspunde la invitație"
                >
                    <Smile size={22} color="#888" />
                    <span className={styles.fakeInput}>{finished ? 'Răspunde la invitație…' : 'Mesaj'}</span>
                    <Paperclip size={20} color="#888" />
                    <span className={styles.micBtn}>
                        {finished ? <Send size={18} color="white" /> : <Mic size={20} color="white" />}
                    </span>
                </button>
            </div>

            {showRSVP && (
                <RSVPModal
                    isOpen={showRSVP}
                    onClose={() => setShowRSVP(false)}
                    eventId={id}
                />
            )}
        </div>
    )
}
