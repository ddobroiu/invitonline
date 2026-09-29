import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { OG_BASE } from '@/lib/seo'
import type { ReactNode } from 'react'
import { Calendar, Clock, ArrowLeft, ArrowRight } from 'lucide-react'
import styles from './page.module.css'
import { articlesContent, articleDateISO } from './articles'
import { BRAND, SITE_URL } from '@/config/legal'

type PageProps = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export async function generateStaticParams() {
    return Object.keys(articlesContent).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params
    const article = articlesContent[slug]
    if (!article) return { title: 'Articol negăsit', robots: { index: false } }
    const description = articleDescription(article.content)
    const published = articleDateISO(article.date)
    return {
        // Brand suffix comes from the root title template
        title: article.title,
        description,
        alternates: { canonical: `/blog/${slug}` },
        openGraph: {
            ...OG_BASE,
            title: article.title,
            description,
            type: 'article',
            url: `/blog/${slug}`,
            ...(published ? { publishedTime: published } : {}),
            images: [{ url: article.image, alt: article.title }],
        },
        twitter: {
            card: 'summary_large_image',
            title: article.title,
            description,
            images: [article.image],
        },
    }
}

/** First plain paragraph, cut at a word boundary to ~160 characters. */
function articleDescription(content: string[]): string | undefined {
    const text = content.find((p) => !/^(#|-|\*\*)/.test(p))?.replace(/\*\*/g, '')
    if (!text) return undefined
    if (text.length <= 160) return text
    const cut = text.slice(0, 157)
    return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.\s-]+$/, '')}…`
}

/** Renders **bold** segments inside a paragraph. */
function renderInline(text: string): ReactNode[] {
    return text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
            ? <strong key={i}>{part.slice(2, -2)}</strong>
            : part
    )
}

/** Converts the simple markdown-like content array into blocks, grouping consecutive list items into <ul>. */
function renderContent(content: string[]) {
    const blocks: ReactNode[] = []
    let list: string[] = []

    const flushList = (key: number) => {
        if (list.length === 0) return
        blocks.push(
            <ul key={`ul-${key}`} className={styles.list}>
                {list.map((item, j) => (
                    <li key={j} className={styles.listItem}>{renderInline(item)}</li>
                ))}
            </ul>
        )
        list = []
    }

    content.forEach((paragraph, index) => {
        if (paragraph.startsWith('- ')) {
            list.push(paragraph.slice(2))
            return
        }
        flushList(index)
        if (paragraph.startsWith('### ')) {
            blocks.push(<h3 key={index} className={styles.subheading}>{renderInline(paragraph.slice(4))}</h3>)
        } else if (paragraph.startsWith('## ')) {
            blocks.push(<h2 key={index} className={styles.heading}>{renderInline(paragraph.slice(3))}</h2>)
        } else {
            blocks.push(<p key={index} className={styles.paragraph}>{renderInline(paragraph)}</p>)
        }
    })
    flushList(content.length)
    return blocks
}

export default async function ArticlePage({ params }: PageProps) {
    const { slug } = await params
    const article = articlesContent[slug]

    if (!article) {
        notFound()
    }

    const published = articleDateISO(article.date)
    const url = `${SITE_URL}/blog/${slug}`
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'BlogPosting',
                '@id': `${url}#article`,
                headline: article.title,
                description: articleDescription(article.content),
                image: article.image,
                ...(published ? { datePublished: published } : {}),
                inLanguage: 'ro-RO',
                mainEntityOfPage: url,
                author: { '@type': 'Organization', name: BRAND, url: SITE_URL },
                publisher: { '@id': `${SITE_URL}/#organization` },
            },
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Acasă', item: SITE_URL },
                    { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
                    { '@type': 'ListItem', position: 3, name: article.title, item: url },
                ],
            },
        ],
    }

    return (
        <div className={styles.container}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
            />
            <Link href="/blog" className={styles.backLink}>
                <ArrowLeft size={20} /> Înapoi la Blog
            </Link>

            <article className={styles.article}>
                <div
                    className={styles.heroImage}
                    style={{ backgroundImage: `url(${article.image})` }}
                >
                    <div className={styles.heroOverlay}>
                        <span className={styles.category}>{article.category}</span>
                        <h1 className={styles.title}>{article.title}</h1>
                        <div className={styles.meta}>
                            <span className={styles.metaItem}>
                                <Calendar size={16} />
                                {article.date}
                            </span>
                            <span className={styles.metaItem}>
                                <Clock size={16} />
                                {article.readTime}
                            </span>
                        </div>
                    </div>
                </div>

                <div className={styles.content}>
                    {renderContent(article.content)}
                </div>

                <div className={styles.cta}>
                    <h3 className={styles.ctaTitle}>Gata să Creezi Invitația Ta Perfectă?</h3>
                    <div className={styles.ctaButtons}>
                        {article.relatedLinks.map((link, index) => {
                            const className = index === 0 ? styles.ctaSecondary : styles.ctaPrimary
                            const isExternal = /^https?:\/\//.test(link.href)
                            return isExternal ? (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className={className}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {link.text}
                                    <ArrowRight size={18} />
                                </a>
                            ) : (
                                <Link key={link.href} href={link.href} className={className}>
                                    {link.text}
                                    <ArrowRight size={18} />
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </article>
        </div>
    )
}
