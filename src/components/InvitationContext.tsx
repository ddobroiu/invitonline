'use client'

import { createContext, useContext } from 'react'

// What the RSVP form needs beyond the template props: set by the public invitation page
// (personal guest link ?g=<token>) and by previews. Templates don't need to know about it.
export interface InvitationContextValue {
    /** Personal link token of a guest added by the organizer (answer updates that guest) */
    guestToken?: string
    /** Name of that guest, to prefill the form */
    guestName?: string
    /** Persons allowed for that guest (prefill) */
    guestPersons?: number
    /** The guest already answered (shown in the form) */
    guestStatus?: string
}

const InvitationContext = createContext<InvitationContextValue>({})

export function InvitationProvider({ value, children }: { value: InvitationContextValue; children: React.ReactNode }) {
    return <InvitationContext.Provider value={value}>{children}</InvitationContext.Provider>
}

export function useInvitation(): InvitationContextValue {
    return useContext(InvitationContext)
}
