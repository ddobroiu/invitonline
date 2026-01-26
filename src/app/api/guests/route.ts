import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
    try {
        const { eventId, name, contact, persons, message } = await req.json()

        if (!eventId || !name || !contact) {
            return NextResponse.json({ message: 'Missing fields' }, { status: 400 })
        }

        const guest = await prisma.guest.create({
            data: {
                eventId,
                name,
                contact,
                persons: Number(persons) || 1,
                message,
                status: 'pending'
            }
        })

        // Send RSVP Notifications
        try {
            const { sendEmail } = await import('@/lib/resend')

            // Get event and owner details
            const event = await prisma.event.findUnique({
                where: { id: eventId },
                include: { user: true }
            })

            if (event) {
                // --- To Organizer ---
                await sendEmail({
                    to: event.user.email,
                    subject: `📩 Nou RSVP: ${name}`,
                    html: `
                        <div style="font-family: sans-serif; color: #333;">
                            <h2>Nou răspuns primit!</h2>
                            <p><strong>Nume:</strong> ${name}</p>
                            <p><strong>Persoane:</strong> ${persons}</p>
                            <p><strong>Contact:</strong> ${contact}</p>
                            ${message ? `<p><strong>Mesaj:</strong> "${message}"</p>` : ''}
                            <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;"/>
                            <p>Poți vedea lista completă de invitați în <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" style="color: #d4af37; font-weight: bold;">Tabloul tău de Bord</a>.</p>
                        </div>
                    `
                })

                // --- To Guest (If email) ---
                if (contact.includes('@')) {
                    await sendEmail({
                        to: contact,
                        subject: `Confirmare Răspuns: ${event.title}`,
                        html: `
                            <div style="font-family: sans-serif; color: #333;">
                                <h3>Bună, ${name}!</h3>
                                <p>Îți mulțumim pentru răspunsul transmis către <strong>${event.title}</strong>.</p>
                                <p>Răspunsul tău a fost înregistrat cu succes.</p>
                                <p>Te așteptăm cu drag!</p>
                            </div>
                        `
                    })
                }
            }
        } catch (emailErr) {
            console.error('RSVP Notification email failed:', emailErr)
        }

        return NextResponse.json({ guest }, { status: 201 })
    } catch (error) {
        console.error('Create Guest Error:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const eventId = searchParams.get('eventId')

        if (!eventId) {
            return NextResponse.json({ message: 'Missing eventId' }, { status: 400 })
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

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ message: 'Missing id' }, { status: 400 })
        }

        await prisma.guest.delete({
            where: { id }
        })

        return NextResponse.json({ message: 'Deleted' }, { status: 200 })
    } catch (error) {
        console.error('Delete Guest Error:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}
