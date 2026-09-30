// Single source for the invitation templates: editor, catalogue (/demo), landing page, API validation,
// public preview pages (/templates/[id]) and tests all read this list.

export type EventTypeId = 'nunta' | 'botez' | 'aniversare' | 'petrecere' | 'corporate'
export type TemplateFeature = 'photo' | 'video' | 'audio'

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

export const EVENT_TYPES: { id: EventTypeId; label: string; emoji: string }[] = [
    { id: 'nunta', label: 'Nuntă', emoji: '💍' },
    { id: 'botez', label: 'Botez', emoji: '👶' },
    { id: 'aniversare', label: 'Aniversare', emoji: '🎂' },
    { id: 'petrecere', label: 'Petrecere', emoji: '🎉' },
    { id: 'corporate', label: 'Corporate', emoji: '🏢' },
]

export const TEMPLATES: TemplateInfo[] = [
    // New collection first: they are the most refined designs
    { id: 'modern', name: 'Modern Minimal', desc: 'Tipografie editorială, mult spațiu alb, linii fine.', suits: ['nunta', 'aniversare', 'corporate'], features: ['photo'], centered: false, isNew: true },
    { id: 'boho', name: 'Boho Floral', desc: 'Tonuri de teracotă și salvie, flori și pampas desenate.', suits: ['nunta', 'botez'], features: ['photo'], centered: false, isNew: true },
    { id: 'botez-delicat', name: 'Botez Delicat', desc: 'Pastel, nori și steluțe, pentru primul eveniment al celui mic.', suits: ['botez'], features: ['photo'], centered: false, isNew: true },
    { id: 'kids', name: 'Petrecere Copii', desc: 'Baloane, confetti și culori vesele pentru aniversări de copii.', suits: ['aniversare', 'petrecere'], features: ['photo'], centered: false, isNew: true },
    { id: 'gala', name: 'Gala Art Deco', desc: 'Negru și șampanie, ornamente art deco: majorat, gală, aniversare.', suits: ['aniversare', 'petrecere', 'corporate', 'nunta'], features: ['photo'], centered: false, isNew: true },
    { id: 'corporate', name: 'Corporate', desc: 'Curat și profesionist: agendă, locație, confirmare.', suits: ['corporate', 'petrecere'], features: ['photo'], centered: false, isNew: true },

    { id: 'classic', name: 'Classic Floral', desc: 'Eleganță atemporală cu motive florale.', suits: ['nunta', 'botez'], features: ['photo'], centered: true },
    { id: 'classic-gold', name: 'Classic Gold', desc: 'Lux regal cu detalii aurii.', suits: ['nunta', 'aniversare'], features: ['photo'], centered: true },
    { id: 'classic-minimal', name: 'Minimalist', desc: 'Modern, curat, alb-negru.', suits: ['nunta', 'botez', 'aniversare'], features: ['photo'], centered: true },
    { id: 'envelope', name: 'Plic 3D', desc: 'O deschidere animată, ca o scrisoare adevărată.', suits: ['nunta', 'botez', 'aniversare'], features: ['photo'], centered: true },
    { id: 'netflix', name: 'Cinematic Netflix', desc: 'Evenimentul vostru ca un serial de succes.', suits: ['nunta', 'aniversare', 'petrecere'], features: ['video', 'photo'], centered: false },
    { id: 'boarding', name: 'Boarding Pass', desc: 'Invitație tip bilet de avion.', suits: ['nunta', 'petrecere'], features: ['photo'], centered: false },
    { id: 'vinyl', name: 'Vinyl Record', desc: 'Stil retro, cu muzica voastră (pornește la atingere).', suits: ['nunta', 'aniversare', 'petrecere'], features: ['audio', 'photo'], centered: true },
    { id: 'scratch', name: 'Loz Norocos', desc: 'Interactiv: invitații răzuiesc ca să afle data.', suits: ['nunta', 'botez', 'aniversare'], features: ['photo'], centered: true },
    { id: 'passport', name: 'Pașaport', desc: 'Pentru nunți cu temă de călătorie.', suits: ['nunta'], features: ['photo'], centered: true },
    { id: 'news', name: 'Ziarul Nunții', desc: 'Anunțul ca o știre de primă pagină.', suits: ['nunta', 'aniversare'], features: ['photo'], centered: false },
    { id: 'cinema', name: 'Film Poster', desc: 'Voi sunteți vedetele filmului.', suits: ['nunta', 'aniversare', 'petrecere'], features: ['photo'], centered: false },
    { id: 'festival', name: 'Summer Festival', desc: 'Pentru petreceri cu energie de festival.', suits: ['petrecere', 'aniversare'], features: ['audio', 'photo'], centered: false },
    { id: 'vip', name: 'VIP Card', desc: 'Un card de acces exclusivist.', suits: ['petrecere', 'aniversare', 'corporate'], features: ['photo'], centered: true },
    { id: 'story', name: 'Insta Story', desc: 'Format vertical, ca un story, cu video.', suits: ['nunta', 'aniversare', 'petrecere'], features: ['video', 'photo'], centered: false },
    { id: 'chat', name: 'Love Chat', desc: 'Invitația ca o conversație pe telefon.', suits: ['nunta', 'aniversare'], features: ['audio', 'photo'], centered: false },
]

export const TEMPLATE_IDS: string[] = TEMPLATES.map((t) => t.id)
export const DEFAULT_TEMPLATE = 'modern'

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
