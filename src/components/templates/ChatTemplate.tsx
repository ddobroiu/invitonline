'use client'

import { useState, useEffect, useRef } from 'react'
import styles from './ChatTemplate.module.css'
import RSVPModal from '@/components/RSVPModal'
import { ChevronLeft, Play, Pause, MapPin, Mic, Send, Image as ImageIcon } from 'lucide-react'

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
}

type MessageType = 'text' | 'image' | 'audio' | 'location'

interface Message {
    id: number
    type: MessageType
    content: string
    sender: 'system' | 'me' | 'them' // them = miri, me = invitat (pt reply-uri viitoare)
    timestamp: string
}

export default function ChatTemplate(props: Props) {
    const [messages, setMessages] = useState<Message[]>([])
    const [isTyping, setIsTyping] = useState(false)
    const [showActions, setShowActions] = useState(false)
    const [showRSVP, setShowRSVP] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const audioRef = useRef<HTMLAudioElement>(null)
    const chatEndRef = useRef<HTMLDivElement>(null)

    // Scriptul conversației
    const script = [
        { type: 'text', content: `Salut! 👋`, delay: 800 },
        { type: 'text', content: props.message || `Avem o veste mare pentru tine!`, delay: 1500 },
        { type: 'text', content: `Ne-ar plăcea enorm să fii alături de noi la ${props.eventType || 'evenimentul nostru'}! 💍🎉`, delay: 1500 },
        props.photoUrl ? { type: 'image', content: props.photoUrl, delay: 1000 } : null,
        { type: 'text', content: `Data: ${props.date}`, delay: 1200 },
        { type: 'location', content: props.location, delay: 1000 },
        props.audioUrl ? { type: 'audio', content: props.audioUrl, delay: 1000 } : null,
        { type: 'text', content: `Te așteptăm cu drag! Ce zici? 👇`, delay: 1000 }
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

            // Scroll to bottom when typing starts
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })

            // Typing duration (randomized slightly)
            const typingTime = 800 + Math.random() * 500

            timeout = setTimeout(() => {
                setIsTyping(false)

                const msgData = script[msgIndex]
                const newMsg: Message = {
                    id: Date.now(),
                    type: msgData.type,
                    content: msgData.content,
                    sender: 'them',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }

                setMessages(prev => [...prev, newMsg])

                // Wait before starting next typing
                setTimeout(() => {
                    msgIndex++
                    playNextMessage()
                }, msgData.delay)

            }, typingTime)
        }

        // Start delay
        setTimeout(playNextMessage, 1000)

        return () => clearTimeout(timeout)
    }, []) // Run once on mount

    // Auto-scroll logic
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
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

                {/* Header */}
                <div className={styles.header}>
                    <ChevronLeft className={styles.backBtn} size={24} />
                    <div className={styles.avatar}>
                        {props.title.charAt(0)}
                    </div>
                    <div className={styles.headerInfo}>
                        <div className={styles.chatTitle}>{props.title.split('&')[0]} & {props.title.split('&')[1] || 'Noi'}</div>
                        <div className={`${styles.status} ${isTyping ? 'online' : ''}`}>
                            {isTyping ? 'scrie...' : 'Online'}
                        </div>
                    </div>
                </div>

                {/* Messages List */}
                <div className={styles.messagesList}>
                    <div style={{ textAlign: 'center', color: '#999', fontSize: '0.7rem', margin: '10px 0' }}>Iti scriu azi</div>

                    {messages.map(msg => (
                        <div key={msg.id} className={`${styles.messageRow} ${msg.sender === 'me' ? styles.right : styles.left}`}>
                            <div className={`${styles.bubble} ${msg.type === 'image' ? styles.imageBubble : ''}`}>

                                {/* TEXT MSG */}
                                {msg.type === 'text' && msg.content}

                                {/* IMAGE MSG */}
                                {msg.type === 'image' && (
                                    <img src={msg.content} alt="Event" className={styles.chatImage} />
                                )}

                                {/* AUDIO MSG */}
                                {msg.type === 'audio' && (
                                    <div className={styles.audioBubble}>
                                        <button className={styles.playBtn} onClick={handleAudioPlay}>
                                            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                                        </button>
                                        <div className={styles.audioWave}>
                                            <div className={styles.audioProgress} style={{ width: isPlaying ? '50%' : '0%', animation: isPlaying ? 'pulse 1s infinite' : 'none' }}></div>
                                        </div>
                                        <audio ref={audioRef} src={msg.content} onEnded={() => setIsPlaying(false)} />
                                    </div>
                                )}

                                {/* LOCATION MSG */}
                                {msg.type === 'location' && (
                                    <div className={styles.locationBubble}>
                                        <div className={styles.mapPreview} style={{
                                            background: `url('https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(msg.content)}&zoom=14&size=400x200&sensor=false') center/cover no-repeat, #eee url('https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Google_Maps_icon_%282020%29.svg/1200px-Google_Maps_icon_%282020%29.svg.png') center/30% no-repeat`
                                        }}>
                                            <MapPin className={styles.mapPin} size={30} fill="#ea4335" />
                                        </div>
                                        <div style={{ fontWeight: 'bold' }}>{msg.content}</div>
                                        {props.locationUrl && (
                                            <a
                                                href={props.locationUrl}
                                                target="_blank"
                                                style={{ color: '#007aff', fontSize: '0.8rem', display: 'block', marginTop: '5px' }}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                Deschide în Hărți
                                            </a>
                                        )}
                                    </div>
                                )}

                                <div className={styles.timeStamp}>{msg.timestamp}</div>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className={`${styles.messageRow} ${styles.left}`}>
                            <div className={styles.typing}>
                                <div className={styles.dot}></div>
                                <div className={styles.dot}></div>
                                <div className={styles.dot}></div>
                            </div>
                        </div>
                    )}

                    <div ref={chatEndRef} />
                </div>

                {/* Footer Actions */}
                {showActions && (
                    <div className={styles.footer} style={{ animation: 'slideIn 0.5s ease' }}>
                        <button className={`${styles.actionBtn} ${styles.primary}`} onClick={() => setShowRSVP(true)}>
                            Vin cu Drag! 🥂
                        </button>
                        <button className={styles.actionBtn} onClick={() => alert('Te rugăm să răspunzi la RSVP!')}>
                            Îmi pare rău 😢
                        </button>
                        {props.locationUrl && (
                            <button className={styles.actionBtn} onClick={() => window.open(props.locationUrl, '_blank')}>
                                📍 Harta
                            </button>
                        )}
                    </div>
                )}

                {/* RSVP Modal */}
                <RSVPModal
                    isOpen={showRSVP}
                    onClose={() => setShowRSVP(false)}
                    eventId={props.id}
                />

            </div>
        </div>
    )
}
