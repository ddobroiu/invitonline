import Link from 'next/link'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import styles from './page.module.css'

// SEO-optimized blog articles about weddings and invitations
const articles = [
    {
        id: 'invitatii-digitale-vs-traditionale',
        title: 'Invitații Digitale vs Tradiționale: Ghidul Complet 2026',
        excerpt: 'Descoperă avantajele invitațiilor digitale față de cele clasice și de ce sunt alegerea perfectă pentru nunta ta modernă.',
        date: '15 Ianuarie 2026',
        readTime: '5 min',
        category: 'Tendințe Nunți',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop'
    },
    {
        id: 'cum-sa-alegi-modelul-perfect',
        title: 'Cum să Alegi Modelul Perfect de Invitație pentru Nunta Ta',
        excerpt: 'Ghid complet pentru alegerea designului ideal care reflectă personalitatea voastră și tema nunții.',
        date: '12 Ianuarie 2026',
        readTime: '7 min',
        category: 'Ghiduri',
        image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&auto=format&fit=crop'
    },
    {
        id: 'top-10-greseli-invitatii',
        title: 'Top 10 Greșeli de Evitat la Invitațiile de Nuntă',
        excerpt: 'Evită aceste greșeli comune și asigură-te că invitațiile tale sunt impecabile și memorabile.',
        date: '10 Ianuarie 2026',
        readTime: '6 min',
        category: 'Sfaturi',
        image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&auto=format&fit=crop'
    },
    {
        id: 'invitatii-eco-friendly',
        title: 'Invitații Eco-Friendly: Cum să Ai o Nuntă Sustenabilă',
        excerpt: 'Descoperă cum invitațiile digitale contribuie la protejarea mediului și la o nuntă mai verde.',
        date: '8 Ianuarie 2026',
        readTime: '5 min',
        category: 'Sustenabilitate',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop'
    },
    {
        id: 'eticheta-invitatiilor-nunta',
        title: 'Eticheta Invitațiilor de Nuntă: Ghid Complet',
        excerpt: 'Tot ce trebuie să știi despre formulările corecte, termenele și protocoalele invitațiilor de nuntă.',
        date: '5 Ianuarie 2026',
        readTime: '8 min',
        category: 'Eticheta',
        image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop'
    },
    {
        id: 'personalizare-invitatii-digitale',
        title: 'Cum să Personalizezi Invitațiile Digitale pentru Oaspeți',
        excerpt: 'Tehnici avansate de personalizare care vor face fiecare invitație să fie unică și specială.',
        date: '3 Ianuarie 2026',
        readTime: '6 min',
        category: 'Personalizare',
        image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&auto=format&fit=crop'
    },
    {
        id: 'timeline-perfect-invitatii',
        title: 'Timeline-ul Perfect: Când să Trimiți Invitațiile de Nuntă',
        excerpt: 'Planifică perfect momentul trimiterii invitațiilor pentru a avea confirmări la timp.',
        date: '1 Ianuarie 2026',
        readTime: '5 min',
        category: 'Planificare',
        image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&auto=format&fit=crop'
    },
    {
        id: 'invitatii-interactive-2026',
        title: 'Invitații Interactive: Viitorul Invitațiilor de Nuntă',
        excerpt: 'Explorează cele mai noi tendințe în invitații digitale interactive cu animații și elemente multimedia.',
        date: '28 Decembrie 2025',
        readTime: '7 min',
        category: 'Inovație',
        image: 'https://images.unsplash.com/photo-1519167758481-83f29da8c6b6?w=800&auto=format&fit=crop'
    },
    {
        id: 'buget-invitatii-nunta-2026',
        title: 'Bugetul pentru Invitații de Nuntă: Ghid Complet 2026',
        excerpt: 'Află cât costă invitațiile de nuntă în 2026 și cum să economisești până la 70% cu soluții digitale premium.',
        date: '20 Ianuarie 2026',
        readTime: '6 min',
        category: 'Buget',
        image: 'https://images.unsplash.com/photo-1633613286991-611fe299c4be?w=800&auto=format&fit=crop'
    },
    {
        id: 'invitatii-nunta-rustica',
        title: 'Invitații pentru Nunți Rustice: Idei și Inspirație',
        excerpt: 'Descoperă cele mai frumoase idei de invitații pentru nunți rustice, de la design-uri naturale la elemente boho-chic.',
        date: '18 Ianuarie 2026',
        readTime: '5 min',
        category: 'Stiluri',
        image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&auto=format&fit=crop'
    },
    {
        id: 'text-invitatie-nunta-exemple',
        title: '50+ Exemple de Texte pentru Invitații de Nuntă',
        excerpt: 'Colecție completă de texte și formulări pentru invitații de nuntă - de la formale la casual și creative.',
        date: '16 Ianuarie 2026',
        readTime: '10 min',
        category: 'Conținut',
        image: 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?w=800&auto=format&fit=crop'
    },
    {
        id: 'invitatii-botez-digitale',
        title: 'Invitații Digitale pentru Botez: Ghid Complet',
        excerpt: 'Tot ce trebuie să știi despre invitațiile digitale pentru botez - template-uri, texte și sfaturi practice.',
        date: '14 Ianuarie 2026',
        readTime: '7 min',
        category: 'Botez',
        image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&auto=format&fit=crop'
    },
    {
        id: 'culori-nunta-2026',
        title: 'Tendințe Culori pentru Nunți 2026: Palete Complete',
        excerpt: 'Descoperă cele mai populare combinații de culori pentru nunți în 2026 și cum să le integrezi în invitații.',
        date: '11 Ianuarie 2026',
        readTime: '6 min',
        category: 'Design',
        image: 'https://images.unsplash.com/photo-1523438097201-512ae7d59c44?w=800&auto=format&fit=crop'
    },
    {
        id: 'invitatii-nunta-iarna',
        title: 'Invitații pentru Nunți de Iarnă: Magia Sezonului Rece',
        excerpt: 'Idei magice pentru invitații de nuntă de iarnă - de la design-uri cu fulgi de nea la teme festive.',
        date: '9 Ianuarie 2026',
        readTime: '5 min',
        category: 'Sezonal',
        image: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800&auto=format&fit=crop'
    },
    {
        id: 'qr-code-invitatii-nunta',
        title: 'QR Code pe Invitații: Ghid Complet de Utilizare',
        excerpt: 'Cum să folosești coduri QR pe invitațiile de nuntă pentru confirmări rapide și experiențe interactive.',
        date: '7 Ianuarie 2026',
        readTime: '4 min',
        category: 'Tehnologie',
        image: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=800&auto=format&fit=crop'
    },
    {
        id: 'invitatii-nunta-la-mare',
        title: 'Invitații pentru Nunți la Mare: Stil Beach Wedding',
        excerpt: 'Inspirație pentru invitații de nuntă la mare - culori, teme nautice și elemente tropicale.',
        date: '4 Ianuarie 2026',
        readTime: '6 min',
        category: 'Destinații',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&auto=format&fit=crop'
    },
    {
        id: 'save-the-date-vs-invitatie',
        title: 'Save the Date vs Invitație: Diferențe și Când să Trimiți',
        excerpt: 'Înțelege diferențele dintre Save the Date și invitația oficială și când este momentul potrivit pentru fiecare.',
        date: '2 Ianuarie 2026',
        readTime: '5 min',
        category: 'Planificare',
        image: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&auto=format&fit=crop'
    },
    {
        id: 'invitatii-nunta-eleganta',
        title: 'Invitații pentru Nunți Elegante: Rafinament și Lux',
        excerpt: 'Ghid pentru crearea invitațiilor perfecte pentru nunți elegante - de la tipografie la detalii luxoase.',
        date: '30 Decembrie 2025',
        readTime: '7 min',
        category: 'Lux',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop'
    }
]

export const metadata = {
    title: 'Blog Nunți & Invitații | Ghiduri Complete, Sfaturi & Tendințe 2026',
    description: 'Descoperă articole SEO despre invitații de nuntă digitale, tendințe 2026, sfaturi de planificare, eticheta invitațiilor și ghiduri complete pentru evenimentul tău perfect. Peste 50+ articole de specialitate.',
    keywords: 'blog nunți, ghid invitații nuntă, sfaturi planificare nuntă, tendințe nunți 2026, invitații digitale ghid, eticheta nunții, timeline nuntă, invitații eco-friendly',
    openGraph: {
        title: 'Blog InvitOnline - Ghiduri & Sfaturi pentru Nunți Perfecte',
        description: 'Articole de specialitate despre invitații, planificare nunți și tendințe 2026',
        type: 'website',
    },
}

export default function BlogPage() {
    return (
        <div className={styles.container}>
            <div className={styles.hero}>
                <h1 className={styles.title}>Blog & Resurse</h1>
                <p className={styles.subtitle}>
                    Ghiduri, tendințe și sfaturi pentru invitații perfecte
                </p>
            </div>

            <div className={styles.articlesGrid}>
                {articles.map((article) => (
                    <Link
                        key={article.id}
                        href={`/blog/${article.id}`}
                        className={styles.articleCard}
                    >
                        <div
                            className={styles.articleImage}
                            style={{ backgroundImage: `url(${article.image})` }}
                        >
                            <span className={styles.category}>{article.category}</span>
                        </div>
                        <div className={styles.articleContent}>
                            <h2 className={styles.articleTitle}>{article.title}</h2>
                            <p className={styles.articleExcerpt}>{article.excerpt}</p>
                            <div className={styles.articleMeta}>
                                <span className={styles.metaItem}>
                                    <Calendar size={14} />
                                    {article.date}
                                </span>
                                <span className={styles.metaItem}>
                                    <Clock size={14} />
                                    {article.readTime}
                                </span>
                            </div>
                            <div className={styles.readMore}>
                                Citește mai mult <ArrowRight size={16} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
