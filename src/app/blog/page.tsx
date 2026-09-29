import Link from 'next/link'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import { OG_BASE } from '@/lib/seo'
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
        category: 'Etichetă',
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
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop'
    },
    {
        id: 'buget-invitatii-nunta-2026',
        title: 'Bugetul pentru Invitații de Nuntă: Ghid Complet 2026',
        excerpt: 'Află cât costă invitațiile de nuntă în 2026 și cât poți economisi alegând invitații digitale.',
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
    },
    {
        id: 'materiale-print-nunta-euprint',
        title: 'Materiale Print Premium pentru Nuntă cu EuPrint.ro',
        excerpt: 'Descoperă cum EuPrint.ro te ajută să creezi materiale print perfecte pentru nuntă - meniuri, place cards, numere de masă și multe altele.',
        date: '26 Ianuarie 2026',
        readTime: '6 min',
        category: 'Servicii',
        image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&auto=format&fit=crop'
    },
    {
        id: 'bannere-nunta-adbanner',
        title: 'Bannere și Decorațiuni pentru Nuntă cu AdBanner.ro',
        excerpt: 'Transformă locația nunții cu bannere personalizate, roll-up-uri și decorațiuni de la AdBanner.ro - vizibilitate perfectă pentru evenimentul tău.',
        date: '25 Ianuarie 2026',
        readTime: '5 min',
        category: 'Decorațiuni',
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop'
    },
    {
        id: 'gadgeturi-personalizate-nunta-shopprint',
        title: 'Cadouri Personalizate pentru Invitați cu ShopPrint.ro',
        excerpt: 'Idei creative de cadouri personalizate pentru invitații de nuntă - căni, tricouri, pixuri și multe altele de pe ShopPrint.ro.',
        date: '24 Ianuarie 2026',
        readTime: '7 min',
        category: 'Cadouri',
        image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&auto=format&fit=crop'
    },
    {
        id: 'tablouri-canvas-nunta-prynt',
        title: 'Tablouri Canvas Personalizate pentru Nuntă cu Prynt.ro',
        excerpt: 'Creează amintiri de neuitat cu tablouri canvas personalizate de la Prynt.ro - perfecte pentru decorațiuni și cadouri.',
        date: '23 Ianuarie 2026',
        readTime: '5 min',
        category: 'Decorațiuni',
        image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&auto=format&fit=crop'
    },
    {
        id: 'lista-invitati-bazadate',
        title: 'Gestionarea Listei de Invitați cu BazaDate.ro',
        excerpt: 'Organizează perfect lista de invitați, confirmările și comunicarea cu ajutorul platformei BazaDate.ro - eficiență maximă.',
        date: '22 Ianuarie 2026',
        readTime: '6 min',
        category: 'Organizare',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop'
    },
    {
        id: 'facturare-nunta-chatbill',
        title: 'Gestionarea Bugetului de Nuntă cu ChatBill.ro',
        excerpt: 'Ține evidența cheltuielilor și facturilor pentru nuntă cu ChatBill.ro - organizare financiară simplă și eficientă.',
        date: '21 Ianuarie 2026',
        readTime: '5 min',
        category: 'Buget',
        image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&auto=format&fit=crop'
    },
    {
        id: 'site-nunta-eweb',
        title: 'Site Personalizat pentru Nuntă cu E-Web.ro',
        excerpt: 'Creează un site web spectaculos pentru nunta ta cu E-Web.ro - informații pentru invitați, confirmare online și galerie foto.',
        date: '20 Ianuarie 2026',
        readTime: '7 min',
        category: 'Digital',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop'
    },
    {
        id: 'randari-3d-locatie-nunta',
        title: 'Vizualizare 3D a Locației de Nuntă cu Randari3D.ro',
        excerpt: 'Vezi cum va arăta locația nunții înainte de marele eveniment cu randări 3D fotorealiste de la Randari3D.ro.',
        date: '19 Ianuarie 2026',
        readTime: '6 min',
        category: 'Planificare',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop'
    },
    {
        id: 'planificare-vizuala-visionboard',
        title: 'Planificarea Vizuală a Nunții cu VisionBoard.ro',
        excerpt: 'Organizează toate detaliile nunții într-un singur loc cu VisionBoard.ro - moodboard-uri, timeline și task-uri.',
        date: '18 Ianuarie 2026',
        readTime: '5 min',
        category: 'Organizare',
        image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&auto=format&fit=crop'
    },
    {
        id: 'tablouri-decorative-tablou-net',
        title: 'Decorațiuni Artistice pentru Nuntă cu Tablou.net',
        excerpt: 'Transformă locația nunții cu tablouri canvas și artă decorativă de la Tablou.net - atmosferă unică și memorabilă.',
        date: '17 Ianuarie 2026',
        readTime: '6 min',
        category: 'Decorațiuni',
        image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&auto=format&fit=crop'
    },
    {
        id: 'management-date-sheet',
        title: 'Organizarea Datelor pentru Nuntă cu Sheet.ro',
        excerpt: 'Gestionează bugetul, lista de invitați și toate detaliile nunții cu Sheet.ro - rapoarte clare și organizare perfectă.',
        date: '16 Ianuarie 2026',
        readTime: '5 min',
        category: 'Organizare',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop'
    },
    {
        id: 'video-nunta-mp5',
        title: 'Producție Video Profesională pentru Nuntă cu MP5.ro',
        excerpt: 'Creează un video spectaculos al nunții tale cu serviciile profesionale de la MP5.ro - amintiri cinematografice.',
        date: '15 Ianuarie 2026',
        readTime: '7 min',
        category: 'Video',
        image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop'
    },
    {
        id: 'ai-personalizare-invitatii-ai365',
        title: 'Personalizare Inteligentă a Invitațiilor cu AI365.ro',
        excerpt: 'Folosește inteligența artificială de la AI365.ro pentru a crea texte personalizate și design unic pentru invitațiile tale.',
        date: '14 Ianuarie 2026',
        readTime: '6 min',
        category: 'Tehnologie',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop'
    },
    {
        id: 'nunta-cu-copii-kidmy',
        title: 'Organizarea Nunții Family-Friendly cu KidMy.ro',
        excerpt: 'Sfaturi și soluții pentru o nuntă perfectă cu copii, cu ajutorul platformei KidMy.ro - distracție pentru toată familia.',
        date: '13 Ianuarie 2026',
        readTime: '8 min',
        category: 'Familie',
        image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&auto=format&fit=crop'
    },
    {
        id: 'ecosistem-complet-nunta',
        title: 'Ecosistem Complet pentru Organizarea Nunții Tale',
        excerpt: 'Descoperă cum să folosești toate platformele integrate - de la invitații digitale la materiale print și servicii digitale.',
        date: '12 Ianuarie 2026',
        readTime: '10 min',
        category: 'Ghiduri',
        image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&auto=format&fit=crop'
    },
    {
        id: 'materiale-premium-prynt-nunta',
        title: 'Materiale Print Premium pentru Evenimente cu Prynt.ro',
        excerpt: 'Calitate superioară pentru invitații printate, meniuri și toate materialele de nuntă cu serviciile premium Prynt.ro.',
        date: '11 Ianuarie 2026',
        readTime: '6 min',
        category: 'Print',
        image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&auto=format&fit=crop'
    },
    {
        id: 'promovare-nunta-anuntul',
        title: 'Promovarea Serviciilor de Nuntă cu Anuntul.net',
        excerpt: 'Dacă oferi servicii pentru nunți, descoperă cum Anuntul.net te ajută să ajungi la viitorii miri.',
        date: '10 Ianuarie 2026',
        readTime: '5 min',
        category: 'Business',
        image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&auto=format&fit=crop'
    },
    {
        id: 'semnalistica-nunta-adbanner',
        title: 'Semnalistică și Direcționare pentru Nuntă cu AdBanner.ro',
        excerpt: 'Ghidează invitații perfect cu semnalistică profesională de la AdBanner.ro - de la parcare la sala de evenimente.',
        date: '9 Ianuarie 2026',
        readTime: '5 min',
        category: 'Organizare',
        image: 'https://images.unsplash.com/photo-1511578194003-00c80e42dc9b?w=800&auto=format&fit=crop'
    },
    {
        id: 'pachete-complete-nunta-2026',
        title: 'Pachete Complete pentru Nunta Perfectă în 2026',
        excerpt: 'Ghid complet: cum să combini invitațiile digitale cu materiale print, decorațiuni și servicii digitale pentru nunta ideală.',
        date: '8 Ianuarie 2026',
        readTime: '12 min',
        category: 'Ghiduri',
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop'
    },
    {
        id: 'buget-optimizat-nunta-servicii',
        title: 'Cum să Optimizezi Bugetul de Nuntă cu Servicii Integrate',
        excerpt: 'Cum reduci cheltuielile de nuntă folosind platforme integrate - de la invitații la decorațiuni.',
        date: '7 Ianuarie 2026',
        readTime: '9 min',
        category: 'Buget',
        image: 'https://images.unsplash.com/photo-1633613286991-611fe299c4be?w=800&auto=format&fit=crop'
    }
]

export const metadata: Metadata = {
    title: 'Blog: ghiduri pentru invitații de nuntă și botez',
    description: 'Ghiduri și sfaturi despre invitații de nuntă și botez: invitații digitale vs tipărite, texte pentru invitații, etichetă, calendar de trimitere, buget și tendințe 2026.',
    alternates: { canonical: '/blog' },
    openGraph: {
        ...OG_BASE,
        title: 'Blog InvitOnline: ghiduri pentru invitații de nuntă și botez',
        description: 'Ghiduri și sfaturi despre invitații, planificarea nunții și tendințe 2026.',
        type: 'website',
        url: '/blog',
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
