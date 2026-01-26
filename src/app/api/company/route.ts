import { NextResponse } from 'next/server';
import { searchCompanyByCUI } from '@/lib/anaf';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const cui = searchParams.get('cui');

    if (!cui) {
        return NextResponse.json({ error: 'CUI is required' }, { status: 400 });
    }

    try {
        const data = await searchCompanyByCUI(cui);

        if (!data) {
            return NextResponse.json({ error: 'Compania nu a fost gasita sau CUI invalid' }, { status: 404 });
        }

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
