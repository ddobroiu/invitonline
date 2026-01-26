'use client'

import { useState, useRef } from 'react'
import { Upload, X, Loader2, Image as ImageIcon, Check } from 'lucide-react'

interface ImageUploaderProps {
    currentUrl?: string
    onUploadComplete: (url: string) => void
    onRemove: () => void
    label?: string
}

export default function ImageUploader({ currentUrl, onUploadComplete, onRemove, label = "Imagine" }: ImageUploaderProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']

        if (!validImageTypes.includes(file.type)) {
            alert('Tip de fișier invalid. Te rog încarcă o imagine (JPG, PNG, WebP, GIF).')
            return
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024
        if (file.size > maxSize) {
            alert('Fișierul este prea mare. Mărimea maximă este 10MB.')
            return
        }

        setIsUploading(true)
        setUploadProgress(0)

        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('type', 'image')

            const response = await fetch('/api/upload-media', {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {
                throw new Error('Upload failed')
            }

            const data = await response.json()
            onUploadComplete(data.url)
            setUploadProgress(100)
        } catch (error) {
            console.error('Upload error:', error)
            alert('Eroare la încărcarea imaginii. Te rog încearcă din nou.')
        } finally {
            setIsUploading(false)
            setUploadProgress(0)
        }
    }

    return (
        <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '20px',
            marginTop: '15px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ImageIcon size={18} color="var(--accent)" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>
                        Încarcă {label}
                    </span>
                </div>
                {currentUrl && (
                    <button
                        onClick={onRemove}
                        style={{
                            background: 'rgba(255, 68, 68, 0.1)',
                            border: 'none',
                            color: '#ff4444',
                            cursor: 'pointer',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}
                    >
                        <X size={14} /> Șterge
                    </button>
                )}
            </div>

            {!currentUrl ? (
                <>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        style={{
                            width: '100%',
                            padding: '16px',
                            background: isUploading ? 'rgba(212, 175, 55, 0.1)' : 'rgba(212, 175, 55, 0.15)',
                            border: '2px dashed var(--accent)',
                            borderRadius: '8px',
                            color: 'var(--accent)',
                            cursor: isUploading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            transition: 'all 0.2s'
                        }}
                    >
                        {isUploading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Se încarcă... {uploadProgress > 0 && `${uploadProgress}%`}
                            </>
                        ) : (
                            <>
                                <Upload size={16} />
                                Selectează imagine
                            </>
                        )}
                    </button>
                    <p style={{ fontSize: '0.7rem', color: '#666', marginTop: '8px', textAlign: 'center' }}>
                        JPG, PNG, WebP (max 10MB)
                    </p>
                </>
            ) : (
                <div style={{
                    background: 'rgba(0, 255, 0, 0.05)',
                    border: '1px solid rgba(0, 255, 0, 0.2)',
                    borderRadius: '8px',
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <Check size={18} color="#00ff00" />
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.8rem', color: '#00ff00', margin: 0, marginBottom: '8px' }}>
                            Imagine încărcată cu succes
                        </p>
                        <img
                            src={currentUrl}
                            alt="Preview"
                            style={{
                                width: '100%',
                                maxHeight: '200px',
                                objectFit: 'contain',
                                borderRadius: '6px',
                                background: 'rgba(0,0,0,0.2)'
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
