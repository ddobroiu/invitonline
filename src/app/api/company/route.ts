import { NextResponse } from 'next/server';
import { searchCompanyByCUI } from '@/lib/anaf';
import { getCurrentUserId } from '@/lib/auth';

export async function GET(request: Request) {
    if (!(await getCurrentUserId())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const cui = (searchParams.get('cui') || '').replace(/\D/g, '');

    if (!cui || cui.length > 10) {
        return NextResponse.json({ error: 'CUI is required' }, { status: 400 });
    }

    try {
        const data = await searchCompanyByCUI(cui);

        if (!data) {
            return NextResponse.json({ error: 'Compania nu a fost gasita sau CUI invalid' }, { status: 404 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Company lookup error:', error);
        return NextResponse.json({ error: 'Căutarea nu este disponibilă momentan.' }, { status: 502 });
    }
}
