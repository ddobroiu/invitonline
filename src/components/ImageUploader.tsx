'use client'

import { useState, useRef } from 'react'
import { Upload, X, Loader2, Image as ImageIcon, Check } from 'lucide-react'
import { MEDIA_TYPES, MEDIA_MAX_SIZE } from '@/config/media'

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
    const [error, setError] = useState('')

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setError('')

        // Validate file type
        const validImageTypes = MEDIA_TYPES.image

        if (!validImageTypes.includes(file.type)) {
            setError('Tip de fișier invalid. Te rog încarcă o imagine (JPG, PNG, WebP, GIF).')
            return
        }

        // Validate file size (max 10MB)
        const maxSize = MEDIA_MAX_SIZE.image
        if (file.size > maxSize) {
            setError('Fișierul este prea mare. Mărimea maximă este 10MB.')
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

            const data = await response.json().catch(() => ({}))
            if (!response.ok) {
                throw new Error(data.error || 'Upload failed')
            }

            onUploadComplete(data.url)
            setUploadProgress(100)
        } catch (error) {
            console.error('Upload error:', error)
            const msg = error instanceof Error && error.message !== 'Upload failed' ? error.message : ''
            setError(msg || 'Eroare la încărcarea imaginii. Te rog încearcă din nou.')
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
            marginTop: '0'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ImageIcon size={18} color="var(--accent)" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--site-ink)' }}>
                        Încarcă {label}
                    </span>
                </div>
                {currentUrl && (
                    <button
                        type="button"
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
                        accept={MEDIA_TYPES.image.join(',')}
                        onChange={(e) => { handleFileSelect(e); e.target.value = '' }}
                        style={{ display: 'none' }}
                    />
                    <button
                        type="button"
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
                    {error && (
                        <p role="alert" style={{ fontSize: '0.8rem', color: '#fca5a5', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: '8px', padding: '8px 12px', marginTop: '10px', textAlign: 'center' }}>
                            {error}
                        </p>
                    )}
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
                        <p style={{ fontSize: '0.8rem', color: '#28603c', margin: 0, marginBottom: '8px' }}>
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
