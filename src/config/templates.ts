// Single source for the invitation templates: editor, catalogue (/demo), landing page, API validation,
// public preview pages (/templates/[id]) and tests all read this list.

export type EventTypeId = 'nunta' | 'botez' | 'aniversare' | 'petrecere' | 'corporate'
export type TemplateFeature = 'photo' | 'video' | 'audio'
export type TemplateTheme = 'travel' | 'music' | 'cinema' | 'paper' | 'playful' | 'elegant'

export const TEMPLATE_THEMES: { id: TemplateTheme; label: string }[] = [
    { id: 'travel', label: 'Călătorie' },
    { id: 'music', label: 'Muzică & festival' },
    { id: 'cinema', label: 'Film & poveste' },
    { id: 'paper', label: 'Scrisori & ziar' },
    { id: 'playful', label: 'Joacă & surprize' },
    { id: 'elegant', label: 'Elegant & clasic' },
]

const THEMATIC_TEMPLATES: Record<string, TemplateTheme> = {
    boarding: 'travel', passport: 'travel', riviera: 'travel',
    vinyl: 'music', festival: 'music',
    netflix: 'cinema', cinema: 'cinema', story: 'cinema', nocturne: 'cinema',
    envelope: 'paper', news: 'paper', chat: 'paper',
    scratch: 'playful', kids: 'playful', 'botez-delicat': 'playful',
}

export function getTemplateTheme(id: string): TemplateTheme {
    return THEMATIC_TEMPLATES[id] || 'elegant'
}

export interface TemplateInfo {
    id: string
    name: string
    /** One line for cards and the catalogue */
    desc: string
    /** Event types the design is made for (every template renders every type) */
    suits: EventTypeId[]
    features: TemplateFeature[]
    /** A card centered on the page (vs. a full-height scrolling layout) */
    centered: boolean
    /** Added in the 2026 autumn collection */
    isNew?: boolean
}

export const EVENT_TYPES: { id: EventTypeId; label: string }[] = [
    { id: 'nunta', label: 'Nuntă' },
    { id: 'botez', label: 'Botez' },
    { id: 'aniversare', label: 'Aniversare' },
    { id: 'petrecere', label: 'Petrecere' },
    { id: 'corporate', label: 'Corporate' },
]

export const FEATURED_TEMPLATE_IDS = ['boarding', 'passport', 'scratch', 'vinyl', 'envelope', 'netflix'] as const

const TEMPLATE_COLLECTION: TemplateInfo[] = [
    { id: 'riviera', name: 'Riviera', desc: 'Cobalt, soare și hârtie crem. O poveste cu aer mediteraneean.', suits: ['nunta', 'aniversare', 'petrecere'], features: ['photo'], centered: false, isNew: true },
    { id: 'nocturne', name: 'Éternité', desc: 'Fotografie pe tot ecranul, lumină și o compoziție cinematografică.', suits: ['nunta', 'aniversare'], features: ['photo'], centered: false, isNew: true },
    { id: 'modern', name: 'Vow', desc: 'Editorial asimetric, fotografie în arc și tipografie expresivă.', suits: ['nunta', 'aniversare', 'corporate'], features: ['photo'], centered: false, isNew: true },
    { id: 'boho', name: 'Botanica', desc: 'Verde măsliniu, ilustrații botanice și un portret organic.', suits: ['nunta', 'botez'], features: ['photo'], centered: false, isNew: true },
    { id: 'botez-delicat', name: 'Luna', desc: 'O lună sculpturală și tonuri de lavandă pentru o minune mică.', suits: ['botez'], features: ['photo'], centered: false, isNew: true },
    { id: 'kids', name: 'Confetti Club', desc: 'Un poster de petrecere, cu forme decupate și confetti interactive.', suits: ['aniversare', 'petrecere'], features: ['photo'], centered: false, isNew: true },
    { id: 'gala', name: 'After Dark', desc: 'Burgund, orbite aurii și o invitație pentru o seară specială.', suits: ['petrecere', 'corporate', 'nunta', 'aniversare'], features: ['photo'], centered: false, isNew: true },
    { id: 'corporate', name: 'The Gathering', desc: 'Verde profund, accente lime și tipografie de afiș contemporan.', suits: ['corporate', 'petrecere'], features: ['photo'], centered: false, isNew: true },

    { id: 'classic', name: 'Maison', desc: 'O invitație de colecție, cu detalii fine și un portret oval.', suits: ['nunta', 'botez'], features: ['photo'], centered: true },
    { id: 'classic-gold', name: 'Champagne', desc: 'Fildeș, accente calde și o compoziție tipografică rafinată.', suits: ['nunta', 'aniversare'], features: ['photo'], centered: true },
    { id: 'classic-minimal', name: 'Pure', desc: 'Alb cald, contrast tipografic și o dată imposibil de trecut cu vederea.', suits: ['nunta', 'botez', 'aniversare'], features: ['photo'], centered: true },
    { id: 'envelope', name: 'Love Letter', desc: 'Un plic verde salvie care se deschide într-o scrisoare personală.', suits: ['nunta', 'botez', 'aniversare'], features: ['photo'], centered: true },
    { id: 'netflix', name: 'Premiere', desc: 'Povestea voastră într-un afiș cinematografic original.', suits: ['nunta', 'aniversare', 'petrecere'], features: ['video', 'photo'], centered: false },
    { id: 'boarding', name: 'Bilet de avion', desc: 'Un boarding pass cu rută, pasageri, poartă de îmbarcare și talon detașabil.', suits: ['nunta', 'petrecere'], features: ['photo'], centered: false },
    { id: 'vinyl', name: 'Discul nostru', desc: 'Un disc de vinil cu fotografia voastră pe etichetă și muzică la o atingere.', suits: ['nunta', 'aniversare', 'petrecere'], features: ['audio', 'photo'], centered: true },
    { id: 'scratch', name: 'Lozul norocos', desc: 'Răzuiește suprafața aurie și descoperă invitația ascunsă dedesubt.', suits: ['nunta', 'botez', 'aniversare'], features: ['photo'], centered: true },
    { id: 'passport', name: 'Pașaport', desc: 'O copertă de pașaport care se deschide spre fotografia și vizele poveștii voastre.', suits: ['nunta'], features: ['photo'], centered: true },
    { id: 'news', name: 'Ziarul nostru', desc: 'Prima pagină a unui ziar: titluri, fotografie, coloane și știrea cea mare.', suits: ['nunta', 'aniversare'], features: ['photo'], centered: false },
    { id: 'cinema', name: 'Pelicula noastră', desc: 'Cadre de film, fotografie alb-negru și distribuția unei zile de neuitat.', suits: ['nunta', 'aniversare', 'petrecere'], features: ['photo'], centered: false },
    { id: 'festival', name: 'Festival Pass', desc: 'Un afiș de festival cu permis de acces, dată și muzica petrecerii.', suits: ['petrecere', 'aniversare'], features: ['audio', 'photo'], centered: false },
    { id: 'vip', name: 'Card VIP', desc: 'Un card de membru cu inițiale, număr de acces și un loc rezervat pentru tine.', suits: ['petrecere', 'aniversare', 'corporate'], features: ['photo'], centered: true },
    { id: 'story', name: 'In Frame', desc: 'Trei capitole interactive pentru o singură poveste.', suits: ['nunta', 'aniversare', 'petrecere'], features: ['video', 'photo'], centered: false },
    { id: 'chat', name: 'Mesaj pentru tine', desc: 'O conversație animată, cu mesaje, fotografii și răspuns direct la invitație.', suits: ['nunta', 'aniversare'], features: ['audio', 'photo'], centered: false },
]

const featuredRank = new Map<string, number>(FEATURED_TEMPLATE_IDS.map((id, index) => [id, index]))
// Keep the most distinctive themes first in the homepage, catalogue and editor.
export const TEMPLATES: TemplateInfo[] = [...TEMPLATE_COLLECTION].sort((a, b) => (featuredRank.get(a.id) ?? FEATURED_TEMPLATE_IDS.length) - (featuredRank.get(b.id) ?? FEATURED_TEMPLATE_IDS.length))
export const TEMPLATE_IDS: string[] = TEMPLATES.map((t) => t.id)
export const DEFAULT_TEMPLATE = 'modern'
export const MODEL_PREVIEW_VERSION = '2'

// A new URL makes the refreshed previews visible even when older images were cached.
export function getModelPreviewSrc(id: string): string {
    return `/images/models/${id}-v${MODEL_PREVIEW_VERSION}.jpg`
}

export function getTemplate(id: string | null | undefined): TemplateInfo | undefined {
    return TEMPLATES.find((t) => t.id === id)
}

export function isTemplateId(id: unknown): id is string {
    return typeof id === 'string' && TEMPLATE_IDS.includes(id)
}

export function isCentered(id: string): boolean {
    return getTemplate(id)?.centered ?? false
}

export function isEventType(id: unknown): id is EventTypeId {
    return typeof id === 'string' && EVENT_TYPES.some((t) => t.id === id)
}
