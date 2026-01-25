'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

// Import Template Components
import NetflixTemplate from '@/components/templates/NetflixTemplate'
import BoardingPassTemplate from '@/components/templates/BoardingPassTemplate'
import EnvelopeTemplate from '@/components/templates/EnvelopeTemplate'
import VinylTemplate from '@/components/templates/VinylTemplate'
import ScratchTemplate from '@/components/templates/ScratchTemplate'

export default function CreateEvent() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        title: 'Ana & Andrei',
        date: '25 AUGUST 2026',
        location: 'Palatul Știrbei',
        message: 'Te invităm să sărbătorești alături de noi acest moment special.',
        eventType: 'nunta' // Default
    })

    // State for selected template
    const [selectedTemplate, setSelectedTemplate] = useState<'envelope' | 'netflix' | 'boarding' | 'vinyl' | 'scratch'>('envelope')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target

        if (name === 'eventType') {
            let newTitle = ''
            let newMessage = ''

            switch (value) {
                case 'nunta':
                    newTitle = 'Ana & Andrei'
                    newMessage = 'Te invităm să sărbătorești alături de noi acest moment special.'
                    break
                case 'botez':
                    newTitle = 'David Ionuț'
                    newMessage = 'Vă invităm la creștinarea micuțului nostru.'
                    break
                case 'aniversare':
                    newTitle = 'Alex - 30 Ani'
                    newMessage = 'Te invităm la o super petrecere!'
                    break
                case 'petrecere':
                    newTitle = 'Summer Party'
                    newMessage = 'Let\'s party all night!'
                    break
                default:
                    newTitle = 'Eveniment Special'
                    newMessage = 'Te invităm la evenimentul nostru.'
            }

            setFormData({ ...formData, eventType: value, title: newTitle, message: newMessage })
        } else {
            setFormData({ ...formData, [name]: value })
        }
    }

    const handleGenerate = () => {
        // Save draft so we don't lose work
        localStorage.setItem('eventDraft', JSON.stringify({ ...formData, template: selectedTemplate }))

        const user = localStorage.getItem('user')
        if (!user) {
            router.push('/login')
        } else {
            router.push('/dashboard')
        }
    }

    return (
        <div className={styles.container}>
            {/* Left Side: Editor */}
            <div className={styles.editorSection}>
                <h1 className={styles.title}>Creează Evenimentul</h1>

                {/* Template Selector */}
                <div style={{ marginBottom: '2rem' }}>
                    <label className={styles.label} style={{ marginBottom: '1rem', display: 'block' }}>ALEGE DESIGN-UL</label>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => setSelectedTemplate('envelope')}
                            style={{
                                padding: '10px',
                                border: selectedTemplate === 'envelope' ? '2px solid #d4af37' : '1px solid #444',
                                background: selectedTemplate === 'envelope' ? '#222' : 'transparent',
                                color: 'white', cursor: 'pointer', borderRadius: '8px'
                            }}
                        >
                            Plic 3D
                        </button>
                        <button
                            onClick={() => setSelectedTemplate('netflix')}
                            style={{
                                padding: '10px',
                                border: selectedTemplate === 'netflix' ? '2px solid #e50914' : '1px solid #444',
                                background: selectedTemplate === 'netflix' ? '#222' : 'transparent',
                                color: 'white', cursor: 'pointer', borderRadius: '8px'
                            }}
                        >
                            Netflix
                        </button>
                        <button
                            onClick={() => setSelectedTemplate('boarding')}
                            style={{
                                padding: '10px',
                                border: selectedTemplate === 'boarding' ? '2px solid #e63946' : '1px solid #444',
                                background: selectedTemplate === 'boarding' ? '#222' : 'transparent',
                                color: 'white', cursor: 'pointer', borderRadius: '8px'
                            }}
                        >
                            Bilet Avion
                        </button>
                        <button
                            onClick={() => setSelectedTemplate('vinyl')}
                            style={{
                                padding: '10px',
                                border: selectedTemplate === 'vinyl' ? '2px solid #8e2de2' : '1px solid #444',
                                background: selectedTemplate === 'vinyl' ? '#222' : 'transparent',
                                color: 'white', cursor: 'pointer', borderRadius: '8px'
                            }}
                        >
                            Vinyl Retro
                        </button>
                        <button
                            onClick={() => setSelectedTemplate('scratch')}
                            style={{
                                padding: '10px',
                                border: selectedTemplate === 'scratch' ? '2px solid #FFD700' : '1px solid #444',
                                background: selectedTemplate === 'scratch' ? '#222' : 'transparent',
                                color: 'white', cursor: 'pointer', borderRadius: '8px'
                            }}
                        >
                            Loz în Plic
                        </button>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>TIP EVENIMENT</label>
                    <select
                        className={styles.input}
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleChange}
                        style={{ cursor: 'pointer' }}
                    >
                        <option value="nunta" style={{ color: 'black' }}>Nuntă</option>
                        <option value="botez" style={{ color: 'black' }}>Botez</option>
                        <option value="aniversare" style={{ color: 'black' }}>Aniversare</option>
                        <option value="petrecere" style={{ color: 'black' }}>Petrecere / Majorat</option>
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        {formData.eventType === 'nunta' ? 'NUME MIRI' :
                            formData.eventType === 'botez' ? 'NUME COPIL' :
                                formData.eventType === 'aniversare' ? 'NUME SĂRBĂTORIT' :
                                    'TITLU EVENIMENT'}
                    </label>
                    <input
                        className={styles.input}
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder={
                            formData.eventType === 'nunta' ? "Ex: Maria & Ion" :
                                formData.eventType === 'botez' ? "Ex: Alexandru Mihai" :
                                    formData.eventType === 'aniversare' ? "Ex: Alina - 30 Ani" :
                                        "Ex: Neon Party"
                        }
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>DATA EVENIMENTULUI</label>
                    <input
                        className={styles.input}
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        placeholder="Ex: 15 IUNIE 2025"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>LOCAȚIE</label>
                    <input
                        className={styles.input}
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Ex: Restaurant Central"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>MESAJ SCURT</label>
                    <input
                        className={styles.input}
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder={
                            formData.eventType === 'nunta' ? "Te invităm la nunta noastră..." :
                                formData.eventType === 'botez' ? "Vă invităm la creștinarea..." :
                                    "Te invităm să sărbătorești..."
                        }
                    />
                </div>

                <button className={styles.btnGenerate} onClick={handleGenerate}>
                    GENEREAZĂ LINK UNIC (20€)
                </button>
            </div>

            {/* Right Side: Live Preview */}
            <div className={styles.previewSection}>
                {selectedTemplate === 'envelope' && <EnvelopeTemplate {...formData} eventType={formData.eventType} />}
                {selectedTemplate === 'netflix' && <NetflixTemplate {...formData} eventType={formData.eventType} />}
                {selectedTemplate === 'boarding' && <BoardingPassTemplate {...formData} eventType={formData.eventType} />}
                {selectedTemplate === 'vinyl' && <VinylTemplate {...formData} eventType={formData.eventType} />}
                {selectedTemplate === 'scratch' && <ScratchTemplate {...formData} eventType={formData.eventType} />}
            </div>
        </div>
    )
}
