'use client'

import { useState } from 'react'
import demoStyles from '@/app/demo/page.module.css'

interface Props {
    title: string
    date: string
    location: string
    message: string
    eventType?: string
}

export default function EnvelopeTemplate({ title, date, location, message, eventType = 'nunta' }: Props) {
    const [isOpen, setIsOpen] = useState(true)

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <div
                className={demoStyles.envelopeWrapper}
                onClick={() => setIsOpen(!isOpen)}
                style={{ transform: 'scale(0.8)' }}
            >
                <div className={`${demoStyles.envelope} ${isOpen ? demoStyles.open : ''}`}>
                    <div className={demoStyles.front}></div>
                    <div className={demoStyles.flap}></div>

                    <div className={demoStyles.card}>
                        <h1 className={demoStyles.names} style={{ fontSize: '1.5rem' }}>{title}</h1>
                        <p className={demoStyles.date}>{date}</p>
                        <p className={demoStyles.details}>
                            {message}
                            <br />
                            <strong>{location}</strong>
                        </p>
                        <button className={demoStyles.button}>Confirmă Prezența</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
