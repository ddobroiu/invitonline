import { BriefcaseBusiness, CalendarDays, Church, HeartHandshake, Music, type LucideIcon } from 'lucide-react'
import { isEventType, type EventTypeId } from '@/config/templates'

const ICONS: Record<EventTypeId, LucideIcon> = {
    nunta: HeartHandshake,
    botez: Church,
    aniversare: CalendarDays,
    petrecere: Music,
    corporate: BriefcaseBusiness,
}

export default function EventTypeIcon({ type, size = 22, className }: { type: string; size?: number; className?: string }) {
    const Icon = ICONS[isEventType(type) ? type : 'nunta']
    return <Icon size={size} strokeWidth={1.6} className={className} aria-hidden="true" focusable="false" />
}
