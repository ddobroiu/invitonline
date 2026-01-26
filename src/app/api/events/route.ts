import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { id, type, template, title, date, location, locationUrl, message, ...rest } = body

        let event;
        if (id) {
            // Update specific event
            event = await prisma.event.update({
                where: {
                    id,
                    userId: (session.user as any).id
                },
                data: {
                    type,
                    template,
                    title,
                    date,
                    location,
                    locationUrl,
                    message,
                    data: rest,
                }
            })
        } else {
            // Create new event
            event = await prisma.event.create({
                data: {
                    userId: (session.user as any).id,
                    type,
                    template,
                    title,
                    date,
                    location,
                    locationUrl,
                    message,
                    data: rest,
                }
            })
        }

        return NextResponse.json({ event }, { status: 201 })
    } catch (error) {
        console.error('Save Event Error:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const events = await prisma.event.findMany({
            where: { userId: (session.user as any).id },
            include: {
                _count: {
                    select: { guests: true }
                }
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
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ message: 'Missing id' }, { status: 400 })
        }

        await prisma.event.delete({
            where: {
                id,
                userId: (session.user as any).id
            }
        })

        return NextResponse.json({ message: 'Deleted' }, { status: 200 })
    } catch (error) {
        console.error('Delete Event Error:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}
