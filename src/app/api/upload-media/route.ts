import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'
import { getCurrentUserId } from '@/lib/auth'
import { alerta, faraCredite } from '@/lib/alerts'
import { MEDIA_TYPES, MEDIA_MAX_SIZE } from '@/config/media'

export async function POST(request: NextRequest) {
    try {
        if (!(await getCurrentUserId())) {
            return NextResponse.json({ error: 'Autentifică-te pentru a încărca fișiere.' }, { status: 401 })
        }

        const formData = await request.formData()
        const file = formData.get('file')
        const typeParam = String(formData.get('type') || 'image')
        const type = typeParam
        if (!Object.hasOwn(MEDIA_TYPES, type)) return NextResponse.json({ error: 'Tip de fișier invalid.' }, { status: 400 })

        if (!(file instanceof File)) {
            return NextResponse.json({ error: 'Niciun fișier trimis.' }, { status: 400 })
        }
        if (!file.size) return NextResponse.json({ error: 'Fișierul este gol.' }, { status: 400 })
        if (file.size > MEDIA_MAX_SIZE[type]) {
            return NextResponse.json({ error: 'Fișierul este prea mare.' }, { status: 413 })
        }
        if (!MEDIA_TYPES[type].includes(file.type)) {
            return NextResponse.json({ error: 'Tip de fișier invalid.' }, { status: 400 })
        }

        const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env
        if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) return NextResponse.json({ error: 'Încărcarea fișierelor este momentan indisponibilă. Poți păstra invitația și reveni mai târziu.' }, { status: 503 })
        cloudinary.config({ cloud_name: CLOUDINARY_CLOUD_NAME, api_key: CLOUDINARY_API_KEY, api_secret: CLOUDINARY_API_SECRET })

        const buffer = Buffer.from(await file.arrayBuffer())

        // Cloudinary stores audio under the 'video' resource type
        const resourceType: 'image' | 'video' = type === 'image' ? 'image' : 'video'
        const transformation = type === 'image'
            ? [{ quality: 'auto', fetch_format: 'auto' }, { width: 1600, height: 1600, crop: 'limit' }]
            : type === 'video' ? [{ quality: 'auto' }] : undefined

        const result = await new Promise<UploadApiResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: resourceType, folder: `invitonline/${type}`, transformation },
                (error, res) => (error || !res ? reject(error) : resolve(res))
            )
            uploadStream.end(buffer)
        })

        return NextResponse.json({ success: true, url: result.secure_url, publicId: result.public_id })
    } catch (error) {
        console.error('Upload error:', error)
        // cota Cloudinary depasita -> alerta; celelalte erori de upload nu sunt alerte
        const text = (error as { message?: string } | null)?.message ?? String(error)
        if (faraCredite(error) || /quota|limit/i.test(text)) {
            void alerta('credits', 'cloudinary', `InvitOnline: Cloudinary refuza incarcarile (cota/limita atinsa) - pozele/muzica/video nu se mai pot incarca: ${text}`)
        }
        return NextResponse.json({ error: 'Încărcarea a eșuat. Încearcă din nou.' }, { status: 500 })
    }
}
