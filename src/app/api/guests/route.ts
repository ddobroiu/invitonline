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
