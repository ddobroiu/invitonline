import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    try {
        const event = await prisma.event.findUnique({
            where: { id },
        })

        if (!event) {
            return NextResponse.json({ message: 'Not found' }, { status: 404 })
        }

        // Only allow viewing if PAID
        if (!event.isPaid) {
            return NextResponse.json({ message: 'Payment required' }, { status: 402 })
        }

        return NextResponse.json({ event })
    } catch (error) {
        return NextResponse.json({ message: 'Error' }, { status: 500 })
    }
}
