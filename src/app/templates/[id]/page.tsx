import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { EVENT_TYPES, getTemplate, isEventType, TEMPLATES } from '@/config/templates'
import { demoProps, isDemoCase } from '@/lib/demo-data'
import TemplatePreview from './TemplatePreview'

// Live preview of a template with example data, full screen exactly as guests see an invitation.
// ?tip=<event type> switches the example (nunta, botez, aniversare, petrecere, corporate);
// ?caz=<lung|fara-foto|multe|minim> renders edge cases (used by the layout audit); ?cta=0 hides the bar.
export function generateStaticParams() {
    return TEMPLATES.map((t) => ({ id: t.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params
    const tpl = getTemplate(id)
    return {
        title: tpl ? `Model ${tpl.name} — exemplu` : 'Model demonstrativ',
        robots: { index: false, follow: false },
    }
}

export default async function TemplateDemoPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>
    searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
    const { id } = await params
    const tpl = getTemplate(id)
    if (!tpl) notFound()
    const sp = await searchParams
    const tipParam = typeof sp.tip === 'string' ? sp.tip : ''
    const cazParam = typeof sp.caz === 'string' ? sp.caz : ''
    const type = isEventType(tipParam) ? tipParam : tpl.suits[0]
    const variant = isDemoCase(cazParam) ? cazParam : 'standard'

    return (
        <TemplatePreview
            templateId={tpl.id}
            templateName={tpl.name}
            type={type}
            types={EVENT_TYPES.filter((t) => tpl.suits.includes(t.id)).map((t) => ({ id: t.id, label: t.label }))}
            showCta={sp.cta !== '0'}
            props={demoProps(type, variant)}
        />
    )
}
