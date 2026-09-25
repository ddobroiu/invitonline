import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const BILLING_FIELDS = {
    companyName: true,
    cui: true,
    regCom: true,
    address: true,
    city: true,
    county: true,
    bank: true,
    iban: true,
} as const;

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const clean = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '') || null;

        // Only billing fields are returned (never the password hash)
        const billing = await prisma.user.update({
            where: { email: session.user.email },
            data: {
                companyName: clean(body.companyName),
                cui: clean(body.cui, 20),
                regCom: clean(body.regCom, 40),
                address: clean(body.address, 300),
                city: clean(body.city, 100),
                county: clean(body.county, 100),
                bank: clean(body.bank, 100),
                iban: clean(body.iban, 40),
            },
            select: BILLING_FIELDS,
        });

        return NextResponse.json(billing);
    } catch (error) {
        console.error('Save billing error:', error);
        return NextResponse.json({ error: 'Nu am putut salva datele de facturare.' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: BILLING_FIELDS,
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error('Get billing error:', error);
        return NextResponse.json({ error: 'Eroare de server.' }, { status: 500 });
    }
}
