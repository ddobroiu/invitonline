export const MEDIA_TYPES: Record<string, readonly string[]> = {
    image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    audio: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/ogg'],
    video: ['video/mp4', 'video/webm'],
}
export const MEDIA_MAX_SIZE: Record<string, number> = { image: 10 * 1024 * 1024, audio: 50 * 1024 * 1024, video: 100 * 1024 * 1024 }
