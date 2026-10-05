import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/auth'

import { TEMPLATE_IDS as TEMPLATES, DEFAULT_TEMPLATE } from '@/config/templates'
import { readJsonObject, validateEvent, eventTemplateData, ValidationError } from '@/lib/validation'

export async function POST(req: Request) {
    try {
        const userId = await getCurrentUserId()
        if (!userId) {
            return NextResponse.json({ message: 'Trebuie să fii autentificat.' }, { status: 401 })
        }

        const body = await readJsonObject(req)
        const errors = validateEvent(body)
        if (Object.keys(errors).length) return NextResponse.json({ message: Object.values(errors)[0], errors }, { status: 400 })
        if (body.id !== undefined && (typeof body.id !== 'string' || !body.id)) throw new ValidationError('Identificatorul invitației nu este valid.')
        const { type, eventType, title, date, location, locationUrl, message } = body
        const id = typeof body.id === 'string' ? body.id : undefined
        const template = typeof body.template === 'string' ? body.template : DEFAULT_TEMPLATE

        const eventData = {
            type: String(type || eventType || 'nunta'),
            template: TEMPLATES.includes(template) ? template : DEFAULT_TEMPLATE,
            title: String(title || '').trim().slice(0, 200),
            date: String(date || '').trim().slice(0, 100),
            location: String(location || '').trim().slice(0, 300),
            locationUrl: locationUrl ? String(locationUrl).slice(0, 1000) : null,
            message: message ? String(message).slice(0, 2000) : null,
            data: eventTemplateData(body),
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
        if (error instanceof ValidationError) return NextResponse.json({ message: error.message }, { status: 400 })
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
