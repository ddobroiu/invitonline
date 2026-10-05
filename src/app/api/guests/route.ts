import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/auth'
import { escapeHtml, getSiteUrl } from '@/lib/utils'
import { readJsonObject, validateGuest, ValidationError } from '@/lib/validation'

const STATUSES = ['pending', 'confirmed', 'declined']

// Returns the event only if it belongs to the current user
async function getOwnedEvent(eventId: string) {
    const userId = await getCurrentUserId()
    if (!userId) return null
    const event = await prisma.event.findUnique({ where: { id: eventId } })
    return event && event.userId === userId ? event : null
}

// Public RSVP from an invitation, or a guest added manually by the organizer
export async function POST(req: Request) {
    try {
        const body = await readJsonObject(req)
        const inputErrors = validateGuest(body, false)
        if (typeof body.eventId !== 'string' || !body.eventId.trim()) inputErrors.eventId = 'Invitația nu este validă.'
        if (Object.keys(inputErrors).length) return NextResponse.json({ message: Object.values(inputErrors)[0], errors: inputErrors }, { status: 400 })
        const eventId = String(body.eventId || '')
        const name = String(body.name || '').trim().slice(0, 120)
        const contact = String(body.contact || '').trim().slice(0, 120)
        const message = body.message ? String(body.message).trim().slice(0, 1000) : null
        const requestedStatus = typeof body.status === 'string' && STATUSES.includes(body.status) ? body.status : 'confirmed'
        const persons = requestedStatus === 'declined' ? 0 : Math.min(Math.max(Number(body.persons) || 1, 1), 20)

        if (!eventId || !name) {
            return NextResponse.json({ message: 'Numele este obligatoriu.' }, { status: 400 })
        }

        const event = await prisma.event.findUnique({ where: { id: eventId }, include: { user: true } })
        if (!event) {
            return NextResponse.json({ message: 'Invitația nu există.' }, { status: 404 })
        }

        const isOwner = (await getCurrentUserId()) === event.userId
        if (!isOwner && !event.isPaid) {
            return NextResponse.json({ message: 'Invitația nu este activată.' }, { status: 403 })
        }
        const errors = validateGuest(body, !isOwner)
        if (!isOwner && requestedStatus === 'pending') errors.status = 'Alege dacă participi sau nu poți ajunge.'
        if (Object.keys(errors).length) return NextResponse.json({ message: Object.values(errors)[0], errors }, { status: 400 })

        const guest = await prisma.guest.create({
            data: {
                eventId,
                name,
                contact,
                persons,
                message,
                // Guests added by the organizer wait for an answer; RSVPs carry their answer
                status: isOwner && !body.status ? 'pending' : requestedStatus,
                respondedAt: isOwner && !body.status ? null : new Date(),
            }
        })

        if (!isOwner) {
            try {
                const { sendEmail } = await import('@/lib/resend')
                const answer = guest.status === 'declined' ? 'Nu poate participa' : `Confirmă (${persons} ${persons === 1 ? 'persoană' : 'persoane'})`

                await sendEmail({
                    to: event.user.email,
                    subject: `Răspuns nou: ${name} — ${event.title}`,
                    html: `
                        <div style="font-family: sans-serif; color: #333;">
                            <h2>Răspuns nou primit!</h2>
                            <p><strong>Nume:</strong> ${escapeHtml(name)}</p>
                            <p><strong>Răspuns:</strong> ${escapeHtml(answer)}</p>
                            <p><strong>Contact:</strong> ${escapeHtml(contact)}</p>
                            ${message ? `<p><strong>Mesaj:</strong> „${escapeHtml(message)}”</p>` : ''}
                            <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;"/>
                            <p>Vezi lista completă în <a href="${getSiteUrl(req)}/dashboard" style="color: #d4af37; font-weight: bold;">contul tău</a>.</p>
                        </div>
                    `
                })

                if (contact.includes('@')) {
                    await sendEmail({
                        to: contact,
                        subject: `Confirmare răspuns: ${event.title}`,
                        html: `
                            <div style="font-family: sans-serif; color: #333;">
                                <h3>Bună, ${escapeHtml(name)}!</h3>
                                <p>Îți mulțumim pentru răspunsul transmis pentru <strong>${escapeHtml(event.title)}</strong>.</p>
                                <p>Răspunsul tău a fost înregistrat cu succes.</p>
                            </div>
                        `
                    })
                }
            } catch (emailErr) {
                console.error('RSVP notification email failed:', emailErr)
            }
        }

        return NextResponse.json({ guest }, { status: 201 })
    } catch (error) {
        if (error instanceof ValidationError) return NextResponse.json({ message: error.message }, { status: 400 })
        console.error('Create Guest Error:', error)
        return NextResponse.json({ message: 'Eroare de server. Încearcă din nou.' }, { status: 500 })
    }
}

export async function GET(req: Request) {
    try {
        const eventId = new URL(req.url).searchParams.get('eventId')
        if (!eventId) {
            return NextResponse.json({ message: 'Missing eventId' }, { status: 400 })
        }
        if (!(await getOwnedEvent(eventId))) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const guests = await prisma.guest.findMany({
            where: { eventId },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ guests }, { status: 200 })
    } catch (error) {
        console.error('Get Guests Error:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}

// Organizer changes a guest's status
export async function PATCH(req: Request) {
    try {
        const { id, status } = await readJsonObject(req)
        if (typeof id !== 'string' || !id || typeof status !== 'string' || !STATUSES.includes(status)) {
            return NextResponse.json({ message: 'Date invalide' }, { status: 400 })
        }

        const guest = await prisma.guest.findUnique({ where: { id } })
        if (!guest || !(await getOwnedEvent(guest.eventId))) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const updated = await prisma.guest.update({ where: { id }, data: { status, persons: status === 'declined' ? 0 : Math.max(guest.persons, 1), respondedAt: status === 'pending' ? null : new Date() } })
        return NextResponse.json({ guest: updated })
    } catch (error) {
        if (error instanceof ValidationError) return NextResponse.json({ message: error.message }, { status: 400 })
        console.error('Update Guest Error:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    try {
        const id = new URL(req.url).searchParams.get('id')
        if (!id) {
            return NextResponse.json({ message: 'Missing id' }, { status: 400 })
        }

        const guest = await prisma.guest.findUnique({ where: { id } })
        if (!guest || !(await getOwnedEvent(guest.eventId))) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        await prisma.guest.delete({ where: { id } })
        return NextResponse.json({ message: 'Deleted' }, { status: 200 })
    } catch (error) {
        console.error('Delete Guest Error:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}
