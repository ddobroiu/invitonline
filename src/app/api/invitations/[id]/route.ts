import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const event = await prisma.event.findUnique({
            where: { id: params.id },
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
