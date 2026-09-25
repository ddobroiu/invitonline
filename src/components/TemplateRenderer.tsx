'use client'

import type { ComponentType } from 'react'
import EnvelopeTemplate from '@/components/templates/EnvelopeTemplate'
import NetflixTemplate from '@/components/templates/NetflixTemplate'
import BoardingPassTemplate from '@/components/templates/BoardingPassTemplate'
import VinylTemplate from '@/components/templates/VinylTemplate'
import ScratchTemplate from '@/components/templates/ScratchTemplate'
import PassportTemplate from '@/components/templates/PassportTemplate'
import NewspaperTemplate from '@/components/templates/NewspaperTemplate'
import CinemaTemplate from '@/components/templates/CinemaTemplate'
import FestivalTemplate from '@/components/templates/FestivalTemplate'
import ChatTemplate from '@/components/templates/ChatTemplate'
import StoryTemplate from '@/components/templates/StoryTemplate'
import VipCardTemplate from '@/components/templates/VipCardTemplate'
import ClassicTemplate from '@/components/templates/ClassicTemplate'
import ClassicGoldTemplate from '@/components/templates/ClassicGoldTemplate'
import ClassicMinimalTemplate from '@/components/templates/ClassicMinimalTemplate'

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
