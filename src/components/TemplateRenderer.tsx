'use client'

import type { ComponentType } from 'react'
import dynamic from 'next/dynamic'
import { TEMPLATES } from '@/config/templates'
import { isRecord } from '@/lib/validation'

// Shared design systems load only when a design from that collection is requested.
const CollectionTemplate = dynamic(() => import('@/components/templates/CollectionTemplate'))
const ConceptTemplate = dynamic(() => import('@/components/templates/ConceptTemplate'))
const EnvelopeTemplate = dynamic(() => import('@/components/templates/EnvelopeTemplate'))
const BoardingPassTemplate = dynamic(() => import('@/components/templates/BoardingPassTemplate'))
const PassportTemplate = dynamic(() => import('@/components/templates/PassportTemplate'))
const NewspaperTemplate = dynamic(() => import('@/components/templates/NewspaperTemplate'))
const VinylTemplate = dynamic(() => import('@/components/templates/VinylTemplate'))
const ScratchTemplate = dynamic(() => import('@/components/templates/ScratchTemplate'))
const ChatTemplate = dynamic(() => import('@/components/templates/ChatTemplate'))
import type { CollectionTheme } from '@/components/templates/CollectionTemplate'
import type { Concept } from '@/components/templates/ConceptTemplate'

const collection = (theme: CollectionTheme): ComponentType<Record<string, unknown>> => {
    function Design(props: Record<string, unknown>) { return <CollectionTemplate {...props} designTheme={theme} /> }
    return Design
}
const concept = (design: Concept): ComponentType<Record<string, unknown>> => {
    function Design(props: Record<string, unknown>) { return <ConceptTemplate {...props} concept={design} /> }
    return Design
}
export const TEMPLATE_COMPONENTS: Record<string, ComponentType<Record<string, unknown>>> = {
    modern: collection('modern'), boho: collection('boho'), 'botez-delicat': collection('botez-delicat'),
    kids: collection('kids'), gala: collection('gala'), corporate: collection('corporate'),
    riviera: collection('riviera'), nocturne: collection('nocturne'), envelope: EnvelopeTemplate,
    classic: concept('classic'), 'classic-gold': concept('classic-gold'), 'classic-minimal': concept('classic-minimal'),
    netflix: concept('netflix'), boarding: BoardingPassTemplate, vinyl: VinylTemplate, scratch: ScratchTemplate,
    passport: PassportTemplate, news: NewspaperTemplate, cinema: concept('cinema'), festival: concept('festival'),
    vip: concept('vip'), story: concept('story'), chat: ChatTemplate,
}

// Templates that are a card centered on the page (vs. full-height scrolling layouts)
export const CENTERED_TEMPLATES = TEMPLATES.filter((t) => t.centered).map((t) => t.id)

/**
 * Converts an Event row from the API into the flat props the templates expect.
 */
export interface InvitationRecord {
    id: string
    template: string
    title: string
    date: string
    location: string
    locationUrl?: string | null
    message?: string | null
    type: string
    data?: unknown
}
export function eventToTemplateProps(event: InvitationRecord) {
    const data = isRecord(event.data) ? event.data : {}
    return {
        ...data,
        id: event.id,
        title: event.title || '',
        date: event.date || '',
        location: event.location || '',
        locationUrl: event.locationUrl || '',
        message: event.message || '',
        template: event.template,
        eventType: event.type || data.eventType || 'nunta',
        type: event.type || data.eventType || 'nunta',
    }
}

export default function TemplateRenderer({ template, ...props }: { template: string } & Record<string, unknown>) {
    const Component = TEMPLATE_COMPONENTS[template] || TEMPLATE_COMPONENTS.modern
    return <Component {...props} />
}
