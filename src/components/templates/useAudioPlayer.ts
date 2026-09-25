'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Small audio player hook for templates.
 * The <audio> object is created imperatively, so it is always paused and released
 * on unmount or when `src` changes (no orphaned music after leaving the page/preview).
 */
export function useAudioPlayer(src?: string, loop = true) {
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)

    useEffect(() => {
        if (!src) return
        const audio = new Audio(src)
        audio.loop = loop
        audio.preload = 'none'
        const onPlay = () => setIsPlaying(true)
        const onPause = () => setIsPlaying(false)
        audio.addEventListener('play', onPlay)
        audio.addEventListener('pause', onPause)
        audio.addEventListener('ended', onPause)
        audioRef.current = audio
        return () => {
            audio.pause()
            audio.removeEventListener('play', onPlay)
            audio.removeEventListener('pause', onPause)
            audio.removeEventListener('ended', onPause)
            audio.removeAttribute('src')
            audio.load()
            if (audioRef.current === audio) audioRef.current = null
            setIsPlaying(false)
        }
    }, [src, loop])

    const play = useCallback(() => {
        const audio = audioRef.current
        if (!audio) return
        audio.play().catch(() => setIsPlaying(false))
    }, [])

    const pause = useCallback(() => {
        audioRef.current?.pause()
    }, [])

    const toggle = useCallback(() => {
        const audio = audioRef.current
        if (!audio) return
        if (audio.paused) {
            audio.play().catch(() => setIsPlaying(false))
        } else {
            audio.pause()
        }
    }, [])

    return { isPlaying, play, pause, toggle, audioRef, hasAudio: !!src }
}
