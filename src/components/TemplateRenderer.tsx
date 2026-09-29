'use client'

import type { ComponentType } from 'react'
import dynamic from 'next/dynamic'

// One chunk per template: an invitation page downloads only the template it uses (still server-rendered)
const EnvelopeTemplate = dynamic(() => import('@/components/templates/EnvelopeTemplate'))
const NetflixTemplate = dynamic(() => import('@/components/templates/NetflixTemplate'))
const BoardingPassTemplate = dynamic(() => import('@/components/templates/BoardingPassTemplate'))
const VinylTemplate = dynamic(() => import('@/components/templates/VinylTemplate'))
const ScratchTemplate = dynamic(() => import('@/components/templates/ScratchTemplate'))
const PassportTemplate = dynamic(() => import('@/components/templates/PassportTemplate'))
const NewspaperTemplate = dynamic(() => import('@/components/templates/NewspaperTemplate'))
const CinemaTemplate = dynamic(() => import('@/components/templates/CinemaTemplate'))
const FestivalTemplate = dynamic(() => import('@/components/templates/FestivalTemplate'))
const ChatTemplate = dynamic(() => import('@/components/templates/ChatTemplate'))
const StoryTemplate = dynamic(() => import('@/components/templates/StoryTemplate'))
const VipCardTemplate = dynamic(() => import('@/components/templates/VipCardTemplate'))
const ClassicTemplate = dynamic(() => import('@/components/templates/ClassicTemplate'))
const ClassicGoldTemplate = dynamic(() => import('@/components/templates/ClassicGoldTemplate'))
const ClassicMinimalTemplate = dynamic(() => import('@/components/templates/ClassicMinimalTemplate'))

export const TEMPLATE_COMPONENTS: Record<string, ComponentType<any>> = {
    'classic': ClassicTemplate,
    'classic-gold': ClassicGoldTemplate,
    'classic-minimal': ClassicMinimalTemplate,
    'envelope': EnvelopeTemplate,
    'netflix': NetflixTemplate,
    'boarding': BoardingPassTemplate,
    'vinyl': VinylTemplate,
    'scratch': ScratchTemplate,
    'passport': PassportTemplate,
    'news': NewspaperTemplate,
    'cinema': CinemaTemplate,
    'festival': FestivalTemplate,
    'vip': VipCardTemplate,
    'story': StoryTemplate,
    'chat': ChatTemplate,
}

// Templates that are a card centered on the page (vs. full-height scrolling layouts)
export const CENTERED_TEMPLATES = ['classic', 'classic-gold', 'classic-minimal', 'envelope', 'vinyl', 'scratch', 'vip', 'passport']

/**
 * Converts an Event row from the API into the flat props the templates expect.
 */
export function eventToTemplateProps(event: any) {
    const data = (event?.data && typeof event.data === 'object') ? event.data : {}
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

export default function TemplateRenderer({ template, ...props }: { template: string } & Record<string, any>) {
    const Component = TEMPLATE_COMPONENTS[template] || ClassicTemplate
    return <Component {...props} />
}
