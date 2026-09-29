import type { Metadata } from 'next'

// Standalone demo pages with sample data; the indexable catalogue is /demo
export const metadata: Metadata = {
    title: 'Model demonstrativ',
    robots: { index: false, follow: false },
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return children
}
