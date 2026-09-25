import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/auth'

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    try {
        const event = await prisma.event.findUnique({ where: { id } })
        if (!event) {
            return NextResponse.json({ message: 'Not found' }, { status: 404 })
        }

        // Public only once paid; the owner can always preview
        if (!event.isPaid && (await getCurrentUserId()) !== event.userId) {
            return NextResponse.json({ message: 'Payment required' }, { status: 402 })
        }

        const { stripeSessionId: _s, userId: _u, ...publicEvent } = event
        return NextResponse.json({ event: publicEvent })
    } catch (error) {
        console.error('Get invitation error:', error)
        return NextResponse.json({ message: 'Error' }, { status: 500 })
    }
}
