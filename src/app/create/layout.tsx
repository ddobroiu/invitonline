import type { Metadata } from 'next'

// Private page: kept out of search results (also sent as X-Robots-Tag, see next.config.ts)
export const metadata: Metadata = {
    title: 'Creează invitația',
    robots: { index: false, follow: false },
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return children
}
