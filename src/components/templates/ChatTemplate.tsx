'use client'

import { useState, useEffect, useRef } from 'react'
import styles from './ChatTemplate.module.css'
import RSVPModal from '@/components/RSVPModal'
import { ChevronLeft, Play, Pause, MapPin, Mic, Send, Image as ImageIcon, Phone, Video, MoreVertical, Smile, Paperclip } from 'lucide-react'

interface ChatTemplateProps {
    id?: string
    title: string
    date: string
    location: string
    locationUrl?: string
    message: string
    eventType?: string
    audioUrl?: string
    photoUrl?: string
    // Extra props
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
    birthDate?: string
    childAge?: string
    partyType?: string
    theme?: string
    specialInstructions?: string
    dressCode?: string
    // Extra
    parentsGroom?: string
    parentsBride?: string
    godparents?: string
    godparentsBaptism?: string
    motherName?: string
    fatherName?: string
}

type MessageType = 'text' | 'image' | 'audio' | 'location'

interface Message {
    id: number
    type: MessageType
    content: string
    sender: 'system' | 'me' | 'them'
    timestamp: string
}

export default function ChatTemplate({
    id, title, date, location, locationUrl, message, eventType = 'nunta',
    groomName, brideName, childName, celebrantName, age,
    godparents, godparentsBaptism, parentsGroom, parentsBride,
    motherName, fatherName, civilCeremonyTime, civilCeremonyLoc, religiousCeremonyTime, religiousCeremonyLoc,
    partyTime, partyLoc, churchTime, churchLoc, restaurantTime, restaurantLoc,
    birthDate, childAge, partyType, theme, specialInstructions, dressCode,
    audioUrl, photoUrl
}: ChatTemplateProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [isTyping, setIsTyping] = useState(false)
    const [showActions, setShowActions] = useState(false)
    const [showRSVP, setShowRSVP] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const audioRef = useRef<HTMLAudioElement>(null)
    const listRef = useRef<HTMLDivElement>(null)
    const initialized = useRef(false)

    const scrollToBottom = () => {
        if (listRef.current) {
            listRef.current.scrollTo({
                top: listRef.current.scrollHeight,
                behavior: 'smooth'
            })
        }
    }

    // Scriptul conversației
    const script = [
        { type: 'text', content: `Salut! 👋`, delay: 800 },
        { type: 'text', content: message || `Avem o veste mare!`, delay: 1500 },
        { type: 'text', content: `Ne ${eventType === 'botez' ? 'vedem la botezul lui' : 'căsătorim pe'} ${date}! 💍🎉`, delay: 1500 },
        photoUrl ? { type: 'image', content: photoUrl, delay: 1000 } : null,
        { type: 'location', content: location, delay: 1200 },
        audioUrl ? { type: 'audio', content: audioUrl, delay: 1000 } : null,

        (groomName || brideName || childName || celebrantName) ? {
            type: 'text',
            content: `Protagonisti: ${[groomName, brideName, childName, celebrantName].filter(Boolean).join(' & ')}`,
            delay: 1000
        } : null,

        (godparents || godparentsBaptism) ? {
            type: 'text',
            content: `✨ Cu nașii: ${godparents || godparentsBaptism}`,
            delay: 1200
        } : null,

        (parentsGroom || parentsBride || motherName || fatherName) ? {
            type: 'text',
            content: `Alături de părinți: ${[parentsGroom, parentsBride, motherName, fatherName].filter(Boolean).join(' & ')}`,
            delay: 1200
        } : null,

        (civilCeremonyTime || religiousCeremonyTime || partyTime || churchTime || restaurantTime) ? {
            type: 'text',
            content: `Program: ${[
                civilCeremonyTime ? `Civilă ${civilCeremonyTime}${civilCeremonyLoc ? ` la ${civilCeremonyLoc}` : ''}` : '',
                religiousCeremonyTime ? `Religioasă ${religiousCeremonyTime}${religiousCeremonyLoc ? ` la ${religiousCeremonyLoc}` : ''}` : '',
                churchTime ? `Biserică ${churchTime}${churchLoc ? ` la ${churchLoc}` : ''}` : '',
                partyTime ? `Petrecere ${partyTime}${partyLoc ? ` la ${partyLoc}` : ''}` : '',
                restaurantTime ? `Restaurant ${restaurantTime}${restaurantLoc ? ` la ${restaurantLoc}` : ''}` : ''
            ].filter(Boolean).join(' | ')}`,
            delay: 1500
        } : null,

        (age || birthDate || childAge || partyType || theme || specialInstructions || dressCode) ? {
            type: 'text',
            content: `Detalii suplimentare: ${[
                age ? `Vârsta: ${age}` : '',
                birthDate ? `Data nașterii: ${birthDate}` : '',
                childAge ? `Vârsta copilului: ${childAge}` : '',
                partyType ? `Tip petrecere: ${partyType}` : '',
                theme ? `Tematică: ${theme}` : '',
                specialInstructions ? `Instrucțiuni speciale: ${specialInstructions}` : '',
                dressCode ? `Dress code: ${dressCode}` : ''
            ].filter(Boolean).join(' | ')}`,
            delay: 1500
        } : null,

        { type: 'text', content: `Te așteptăm cu drag! Ce zici, poți ajunge?`, delay: 1000 }
    ].filter(Boolean) as { type: MessageType, content: string, delay: number }[]

    useEffect(() => {
        if (initialized.current) return
        initialized.current = true

        let timeout: NodeJS.Timeout
        let msgIndex = 0

        const playNextMessage = () => {
            if (msgIndex >= script.length) {
                setShowActions(true)
                return
            }

            setIsTyping(true)
            scrollToBottom()

            // Typing duration logic
            const typingTime = 1000 + Math.random() * 500

            timeout = setTimeout(() => {
                setIsTyping(false)

                const msgData = script[msgIndex]
                const newMsg: Message = {
                    id: Date.now(),
                    type: msgData.type,
                    content: msgData.content,
                    sender: 'them', // THEM = Left in WhatsApp
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }

                setMessages(prev => [...prev, newMsg])

                // Wait before next
                setTimeout(() => {
                    msgIndex++
                    playNextMessage()
                }, msgData.delay)

            }, typingTime)
        }

        setTimeout(playNextMessage, 1000)
        return () => clearTimeout(timeout)
    }, [])

    // Scroll to bottom whenever messages change
    useEffect(() => {
        scrollToBottom()
    }, [messages, isTyping])

    const handleAudioPlay = () => {
        if (!audioRef.current) return
        if (isPlaying) {
            audioRef.current.pause()
            setIsPlaying(false)
        } else {
            audioRef.current.play()
            setIsPlaying(true)
        }
    }

    return (
        <div className={styles.chatContainer}>
            <div className={styles.mobileScreen}>

                {/* WHATSAPP HEADER */}
                <div className={styles.header}>
                    <ChevronLeft className={styles.backBtn} size={24} />
                    <div className={styles.avatar}>
                        {photoUrl ? (
                            <img src={photoUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : title.charAt(0)}
                    </div>
                    <div className={styles.headerInfo}>
                        <div className={styles.chatTitle}>{title}</div>
                        <div className={styles.status}>
                            {isTyping ? 'typing...' : 'online'}
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <Video size={20} />
                        <Phone size={20} />
                        <MoreVertical size={20} />
                    </div>
                </div>

                {/* MESSAGES AREA */}
                <div className={styles.messagesList} ref={listRef}>
                    <div style={{ textAlign: 'center', background: 'rgba(225,245,254,0.9)', padding: '5px 10px', borderRadius: '8px', fontSize: '0.75rem', color: '#555', alignSelf: 'center', marginBottom: '15px', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
                        Messages are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them.
                    </div>

                    {messages.map(msg => (
                        <div key={msg.id} className={`${styles.messageRow} ${styles.left}`}>
                            <div className={styles.bubble}>
                                {/* TEXT */}
                                {msg.type === 'text' && msg.content}

                                {/* IMAGE */}
                                {msg.type === 'image' && (
                                    <img src={msg.content} alt="Event" className={styles.chatImage} />
                                )}

                                {/* AUDIO */}
                                {msg.type === 'audio' && (
                                    <div className={styles.audioBubble}>
                                        <button className={styles.playBtn} onClick={handleAudioPlay}>
                                            {isPlaying ? <Pause size={16} fill="white" /> : <Play size={16} fill="white" style={{ marginLeft: '2px' }} />}
                                        </button>
                                        <div className={styles.audioWave}>
                                            <div className={styles.audioProgress} style={{ width: isPlaying ? '50%' : '0%', animation: isPlaying ? 'pulse 1s infinite' : 'none' }}></div>
                                        </div>
                                        <audio ref={audioRef} src={msg.content} onEnded={() => setIsPlaying(false)} />
                                    </div>
                                )}

                                {/* LOCATION */}
                                {msg.type === 'location' && (
                                    <div className={styles.locationBubble}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px' }}>📍 Locație:</div>
                                        <div>{msg.content}</div>
                                        {locationUrl && (
                                            <div style={{ color: '#007aff', fontSize: '0.8rem', marginTop: '5px', cursor: 'pointer' }} onClick={() => window.open(locationUrl, '_blank')}>
                                                Vezi pe Hartă
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className={styles.metaRow}>
                                    <span className={styles.timeStamp}>{msg.timestamp}</span>
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

                {/* ACTION ZONE (Floating above footer) */}
                {showActions && (
                    <div className={`${styles.actionZone} ${styles.visible}`} style={{ justifyContent: 'center' }}>
                        <button
                            className={`${styles.whatsappBtn} ${styles.primary}`}
                            onClick={() => setShowRSVP(true)}
                            style={{ width: '80%', textAlign: 'center', justifyContent: 'center', display: 'flex' }}
                        >
                            DA, Confirm Prezența! 🥂
                        </button>
                    </div>
                )}

                {/* WHATSAPP FOOTER (Fake Input) */}
                <div className={styles.footer}>
                    <Smile size={24} color="#888" />
                    <Paperclip size={24} color="#888" style={{ marginLeft: '10px' }} />
                    <div className={styles.fakeInput}>
                        Type a message
                    </div>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#075e54', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Mic size={20} color="white" />
                    </div>
                </div>

                <RSVPModal
                    isOpen={showRSVP}
                    onClose={() => setShowRSVP(false)}
                    eventId={id}
                />

            </div>
        </div>
    )
}
