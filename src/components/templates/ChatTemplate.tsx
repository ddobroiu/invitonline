'use client'

import { useState, useEffect, useRef } from 'react'
import styles from './ChatTemplate.module.css'
import RSVPModal from '@/components/RSVPModal'
import { ChevronLeft, Play, Pause, MapPin, Mic, Send, Image as ImageIcon, Phone, Video, MoreVertical, Smile, Paperclip } from 'lucide-react'

interface Props {
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
    partyTime?: string
    // Extra
    parentsGroom?: string
    parentsBride?: string
    godparents?: string
    motherName?: string
    fatherName?: string
    godparentsBaptism?: string
    civilCeremonyTime?: string
}

type MessageType = 'text' | 'image' | 'audio' | 'location'

interface Message {
    id: number
    type: MessageType
    content: string
    sender: 'system' | 'me' | 'them'
    timestamp: string
}

export default function ChatTemplate(props: Props) {
    const [messages, setMessages] = useState<Message[]>([])
    const [isTyping, setIsTyping] = useState(false)
    const [showActions, setShowActions] = useState(false)
    const [showRSVP, setShowRSVP] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const audioRef = useRef<HTMLAudioElement>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Scriptul conversației
    const script = [
        { type: 'text', content: `Salut! 👋`, delay: 800 },
        { type: 'text', content: props.message || `Avem o veste mare!`, delay: 1500 },
        { type: 'text', content: `Ne căsătorim pe ${props.date}! 💍🎉`, delay: 1500 },
        props.photoUrl ? { type: 'image', content: props.photoUrl, delay: 1000 } : null,
        { type: 'location', content: props.location, delay: 1200 },
        props.audioUrl ? { type: 'audio', content: props.audioUrl, delay: 1000 } : null,

        (props.godparents || props.parentsGroom) ? {
            type: 'text',
            content: `✨ Cu binecuvântarea nașilor ${props.godparents || ''} ${(props.godparents && props.parentsGroom) ? 'și a părinților' : ''} ${props.parentsGroom || ''}`,
            delay: 1500
        } : null,

        { type: 'text', content: `Te așteptăm cu drag! Ce zici, poți ajunge?`, delay: 1000 }
    ].filter(Boolean) as { type: MessageType, content: string, delay: number }[]

    useEffect(() => {
        let timeout: NodeJS.Timeout
        let msgIndex = 0

        const playNextMessage = () => {
            if (msgIndex >= script.length) {
                setShowActions(true)
                return
            }

            setIsTyping(true)
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })

            // Typing duration logic
            const typingTime = 1000 + Math.random() * 500

            timeout = setTimeout(() => {
                setIsTyping(false)

                const msgData = script[msgIndex]
                const newMsg: Message = {
                    id: Date.now(),
                    type: msgData.type,
                    content: msgData.content,
                    sender: 'left', // THEM = Left in WhatsApp
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                } as any // TS hack for sender type string mismatch if any

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
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
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
                        {props.photoUrl ? (
                            <img src={props.photoUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : props.title.charAt(0)}
                    </div>
                    <div className={styles.headerInfo}>
                        <div className={styles.chatTitle}>{props.title}</div>
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
                <div className={styles.messagesList}>
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
                                        {props.locationUrl && (
                                            <div style={{ color: '#007aff', fontSize: '0.8rem', marginTop: '5px', cursor: 'pointer' }} onClick={() => window.open(props.locationUrl, '_blank')}>
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

                    <div ref={messagesEndRef} style={{ height: '10px' }} />
                </div>

                {/* ACTION ZONE (Floating above footer) */}
                {showActions && (
                    <div className={`${styles.actionZone} ${styles.visible}`}>
                        <button className={`${styles.whatsappBtn} ${styles.primary}`} onClick={() => setShowRSVP(true)}>
                            DA, Confirm! 🥂
                        </button>
                        <button className={styles.whatsappBtn} onClick={() => alert('Sperăm să poți ajunge data viitoare!')}>
                            Nu pot 😢
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
                    eventId={props.id}
                />

            </div>
        </div>
    )
}
