import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File
        const type = formData.get('type') as string // 'audio', 'video', or 'image'

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Determine resource type and folder
        let resourceType: 'image' | 'video' = 'image'
        let folder = 'invitonline/images'
        let transformation: any = undefined

        if (type === 'audio' || type === 'video') {
            resourceType = 'video' // Cloudinary uses 'video' for both audio and video
            folder = `invitonline/${type}`
            if (type === 'video') {
                transformation = [{ quality: 'auto', fetch_format: 'auto' }]
            }
        } else if (type === 'image') {
            resourceType = 'image'
            folder = 'invitonline/images'
            transformation = [
                { quality: 'auto', fetch_format: 'auto' },
                { width: 1200, height: 1200, crop: 'limit' }
            ]
        }

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: resourceType,
                    folder: folder,
                    transformation: transformation
                },
                (error, result) => {
                    if (error) reject(error)
                    else resolve(result)
                }
            )
            uploadStream.end(buffer)
        })

        const uploadResult = result as any

        return NextResponse.json({
            success: true,
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id
        })

    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json(
            { error: 'Upload failed', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}
