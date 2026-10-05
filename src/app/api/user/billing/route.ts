import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { readJsonObject, validateBilling, ValidationError, BILLING_LIMITS } from '@/lib/validation';

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

        const body = await readJsonObject(request);
        const error = validateBilling(body);
        if (error) throw new ValidationError(error);
        const data = Object.fromEntries(Object.keys(BILLING_LIMITS).map(key => [key, typeof body[key] === 'string' ? body[key].trim() || null : null]));

        // Only billing fields are returned (never the password hash)
        const billing = await prisma.user.update({
            where: { email: session.user.email },
            data,
            select: BILLING_FIELDS,
        });

        return NextResponse.json(billing);
    } catch (error) {
        if (error instanceof ValidationError) return NextResponse.json({ error: error.message }, { status: 400 });
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
