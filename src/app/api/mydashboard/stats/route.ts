import { timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'
import { statsMydashboard } from '@/lib/stats'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * Statisticile aplicatiei pentru mydashboard.ro (contractul din mydashboard.ro/lib/app-stats.ts).
 * Antet: x-stats-token = MYDASHBOARD_STATS_TOKEN = HMAC-SHA256(CRON_SECRET din mydashboard, 'stats:invitonline').
 * Fara variabila, endpoint-ul nu exista (404).
 */
export async function GET(request: Request) {
    const expected = process.env.MYDASHBOARD_STATS_TOKEN || ''
    if (!expected) return NextResponse.json({ error: 'not found' }, { status: 404 })
    const given = Buffer.from(request.headers.get('x-stats-token') || '')
    const wanted = Buffer.from(expected)
    if (given.length !== wanted.length || !timingSafeEqual(given, wanted)) {
        return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }
    try {
        return NextResponse.json(await statsMydashboard(), { headers: { 'Cache-Control': 'no-store' } })
    } catch (e) {
        console.error('[mydashboard/stats]', e)
        return NextResponse.json({ error: 'Eroare' }, { status: 500 })
    }
}
