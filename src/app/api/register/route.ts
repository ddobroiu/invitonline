import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
    try {
        const { email, password, name } = await req.json()

        if (!email || !password) {
            return NextResponse.json(
                { message: 'Email and password are required' },
                { status: 400 }
            )
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json(
                { message: 'User already exists' },
                { status: 409 }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name
            }
        })

        // Send Welcome Email
        try {
            const { sendEmail } = await import('@/lib/resend')
            await sendEmail({
                to: email,
                subject: 'Bun venit la Invitatii Online! 💌',
                html: `
                    <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #d4af37;">Bună, ${name || 'utilizator nou'}!</h1>
                        <p>Ne bucurăm să te avem alături de noi.</p>
                        <p>Contul tău a fost creat cu succes. Acum poți începe să creezi invitații digitale premium pentru evenimentele tale speciale.</p>
                        <div style="margin: 30px 0;">
                            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/create" style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Creează Prima Invitație</a>
                        </div>
                        <p>Dacă ai întrebări, suntem aici să te ajutăm.</p>
                        <p>O zi minunată,<br/>Echipa Invitatii Online</p>
                    </div>
                `
            })
        } catch (emailErr) {
            console.error('Welcome email failed:', emailErr)
        }

        return NextResponse.json(
            { message: 'User created', userId: user.id },
            { status: 201 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
}
