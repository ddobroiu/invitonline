import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSiteUrl } from '@/lib/utils'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * Dezabonarea, fara cont: cheia e id-ul e-mailului primit (uuid aleator, EmailLog.id), din linkul din subsol
 * sau din antetul List-Unsubscribe.
 *
 * POST — un click din clientul de e-mail (RFC 8058, corpul `List-Unsubscribe=One-Click`) sau butonul de pe
 * /dezabonare. GET nu schimba nimic (scanerele de linkuri deschid tot), doar duce la pagina de confirmare.
 */

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function GET(request: Request) {
    const id = new URL(request.url).searchParams.get('id') ?? ''
    const target = new URL('/dezabonare', getSiteUrl(request))
    if (UUID.test(id)) target.searchParams.set('id', id)
    return NextResponse.redirect(target, 303)
}

export async function POST(request: Request) {
    const url = new URL(request.url)
    let id = url.searchParams.get('id') ?? ''
    let fromPage = false

    const type = request.headers.get('content-type') ?? ''
    if (type.includes('application/x-www-form-urlencoded') || type.includes('multipart/form-data')) {
        const form = await request.formData().catch(() => null)
        const formId = form?.get('id')
        if (typeof formId === 'string' && formId) id = formId
        fromPage = form?.get('from') === 'page'
    }

    const site = getSiteUrl(request)
    const fail = (status: number, error: string) =>
        fromPage ? NextResponse.redirect(new URL('/dezabonare?eroare=1', site), 303) : NextResponse.json({ error }, { status })

    if (!UUID.test(id)) return fail(400, 'Link invalid')

    const log = await prisma.emailLog.findUnique({ where: { id }, select: { email: true } })
    if (!log) return fail(404, 'Link necunoscut')

    const email = log.email.trim().toLowerCase()
    const now = new Date()
    await prisma.$transaction([
        prisma.emailUnsubscribe.upsert({ where: { email }, create: { email, emailLogId: id }, update: {} }),
        prisma.user.updateMany({
            where: { email: { equals: email, mode: 'insensitive' }, marketingOptOut: false },
            data: { marketingOptOut: true, marketingChoiceAt: now },
        }),
    ])

    return fromPage ? NextResponse.redirect(new URL('/dezabonare?gata=1', site), 303) : NextResponse.json({ ok: true })
}
