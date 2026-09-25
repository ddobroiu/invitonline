import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/auth'

const TEMPLATES = ['classic', 'classic-gold', 'classic-minimal', 'envelope', 'netflix', 'boarding', 'vinyl', 'scratch', 'passport', 'news', 'cinema', 'festival', 'vip', 'story', 'chat']

export async function POST(req: Request) {
    try {
        const userId = await getCurrentUserId()
        if (!userId) {
            return NextResponse.json({ message: 'Trebuie să fii autentificat.' }, { status: 401 })
        }

        const body = await req.json()
        // Columns and server-controlled fields are pulled out; everything else is template data
        const {
            id, type, eventType, template, title, date, location, locationUrl, message,
            isPaid: _isPaid, _count, userId: _userId, guests: _guests, createdAt: _c, updatedAt: _u,
            ...rest
        } = body

        const eventData = {
            type: String(type || eventType || 'nunta'),
            template: TEMPLATES.includes(template) ? template : 'classic',
            title: String(title || '').trim().slice(0, 200),
            date: String(date || '').trim().slice(0, 100),
            location: String(location || '').trim().slice(0, 300),
            locationUrl: locationUrl ? String(locationUrl).slice(0, 1000) : null,
            message: message ? String(message).slice(0, 2000) : null,
            data: { ...rest, eventType: String(type || eventType || 'nunta') },
        }

        if (!eventData.title) {
            return NextResponse.json({ message: 'Titlul invitației este obligatoriu.' }, { status: 400 })
        }

        let event
        if (id) {
            const existing = await prisma.event.findUnique({ where: { id } })
            if (!existing || existing.userId !== userId) {
                return NextResponse.json({ message: 'Invitația nu a fost găsită.' }, { status: 404 })
            }
            event = await prisma.event.update({ where: { id }, data: eventData })
        } else {
            event = await prisma.event.create({ data: { ...eventData, userId } })
        }

        return NextResponse.json({ event }, { status: id ? 200 : 201 })
    } catch (error) {
        console.error('Save Event Error:', error)
        return NextResponse.json({ message: 'Eroare la salvarea invitației.' }, { status: 500 })
    }
}

// All events of the user, or a single one with ?id=
export async function GET(req: Request) {
    try {
        const userId = await getCurrentUserId()
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const id = new URL(req.url).searchParams.get('id')
        if (id) {
            const event = await prisma.event.findUnique({ where: { id } })
            if (!event || event.userId !== userId) {
                return NextResponse.json({ message: 'Not found' }, { status: 404 })
            }
            return NextResponse.json({ event })
        }

        const events = await prisma.event.findMany({
            where: { userId },
            include: {
                _count: { select: { guests: true } },
                guests: { select: { status: true, persons: true } },
            },
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json({ events }, { status: 200 })
    } catch (error) {
        console.error('Get Events Error:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    try {
        const userId = await getCurrentUserId()
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const id = new URL(req.url).searchParams.get('id')
        if (!id) {
            return NextResponse.json({ message: 'Missing id' }, { status: 400 })
        }

        const event = await prisma.event.findUnique({ where: { id } })
        if (!event || event.userId !== userId) {
            return NextResponse.json({ message: 'Not found' }, { status: 404 })
        }

        // Keep order history for invoicing; detach it from the event
        await prisma.$transaction([
            prisma.order.updateMany({ where: { eventId: id }, data: { eventId: null } }),
            prisma.event.delete({ where: { id } }),
        ])

        return NextResponse.json({ message: 'Deleted' }, { status: 200 })
    } catch (error) {
        console.error('Delete Event Error:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}
