import Link from 'next/link'
import { Calendar, Clock, ArrowLeft, ArrowRight } from 'lucide-react'
import styles from './page.module.css'
import { additionalArticles } from './additionalArticles'

// Full article content database
const articlesContent: Record<string, {
    title: string
    date: string
    readTime: string
    category: string
    image: string
    content: string[]
    relatedLinks: { text: string; href: string }[]
}> = {
    'personalizare-invitatii-digitale': {
        title: 'Cum să Personalizezi Invitațiile Digitale pentru Oaspeți',
        date: '3 Ianuarie 2026',
        readTime: '6 min',
        category: 'Personalizare',
        image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200&auto=format&fit=crop',
        content: [
            'Invitațiile digitale au revoluționat modul în care comunicăm cu oaspeții noștri la evenimente importante. Spre deosebire de invitațiile tradiționale pe hârtie, cele digitale oferă posibilități nelimitate de personalizare care pot transforma o simplă invitație într-o experiență memorabilă.',
            '## De ce este importantă personalizarea?',
            'Personalizarea invitațiilor nu este doar despre estetic - este despre crearea unei conexiuni emoționale cu fiecare invitat. Când cineva primește o invitație care pare să fie creată special pentru el, sentimentul de apreciere și importanță crește semnificativ.',
            '## 1. Personalizarea Numelui și Mesajului',
            'Cel mai simplu și mai eficient mod de personalizare este utilizarea numelui invitatului în mesaj. În loc de un generic "Dragă invitat", folosește "Dragă Maria și Ion". Acest detaliu mic face o diferență uriașă în percepția invitației.',
            'Poți merge și mai departe adăugând mesaje personalizate pentru grupuri diferite de invitați: familie apropiată, prieteni din copilărie, colegi de serviciu. Fiecare grup poate primi un mesaj adaptat relației voastre.',
            '## 2. Template-uri Adaptate la Preferințe',
            'InvitOnline oferă o varietate de template-uri premium care pot fi personalizate în funcție de stilul fiecărui invitat. De exemplu:',
            '- **Template Netflix** pentru cinefili și pasionații de seriale',
            '- **Template Vinyl** pentru iubitorii de muzică',
            '- **Template Boarding Pass** pentru cei care adoră să călătorească',
            '- **Template Envelope** pentru cei care preferă eleganța clasică',
            'Alegerea template-ului potrivit pentru fiecare invitat arată că ai pus gândire în invitație.',
            '## 3. Culori și Teme Personalizate',
            'Fiecare invitație poate avea propria paletă de culori. Poți alege:',
            '- Culorile preferate ale invitatului',
            '- Culori care reflectă tema nunții sau evenimentului',
            '- Combinații care se potrivesc cu sezonul (pasteluri pentru primăvară, tonuri calde pentru toamnă)',
            '## 4. Conținut Multimedia Personalizat',
            'Invitațiile digitale permit adăugarea de:',
            '- **Fotografii speciale** cu invitatul (amintiri comune, momente memorabile)',
            '- **Video-uri personalizate** cu mesaje directe',
            '- **Playlist-uri muzicale** create special pentru fiecare grup de invitați',
            '- **Hărți interactive** cu indicații personalizate din zona lor',
            '## 5. Informații Relevante pentru Fiecare Invitat',
            'Nu toți invitații au nevoie de aceleași informații. Personalizează conținutul:',
            '- Pentru invitații din afara orașului: adaugă recomandări de cazare',
            '- Pentru familii cu copii: include informații despre facilitățile pentru cei mici',
            '- Pentru invitații VIP: detalii despre programul special',
            '## 6. Limbă și Ton Adaptat',
            'Tonul invitației poate varia:',
            '- **Formal** pentru invitații oficiali sau vârstnici',
            '- **Casual și prietenos** pentru prieteni apropiați',
            '- **Playful și amuzant** pentru grupul de la facultate',
            '## Instrumente și Platforme',
            'InvitOnline oferă toate instrumentele necesare pentru personalizare avansată:',
            '- Editor drag-and-drop intuitiv',
            '- Bibliotecă vastă de fonturi și elemente grafice',
            '- Sistem de variabile pentru personalizare automată',
            '- Preview în timp real pentru fiecare invitat',
            '## Concluzie',
            'Personalizarea invitațiilor digitale nu trebuie să fie complicată sau consumatoare de timp. Cu instrumentele potrivite, poți crea sute de invitații unice în câteva ore, fiecare fiind perfect adaptată destinatarului său.',
            'Investiția în personalizare se va reflecta în rata de confirmare și în entuziasmul invitaților tăi. O invitație personalizată spune "Ești important pentru noi" - și asta face toată diferența.'
        ],
        relatedLinks: [
            { text: 'Vezi Toate Template-urile', href: '/demo' },
            { text: 'Creează Invitația Ta Acum', href: '/create' }
        ]
    },
    'invitatii-digitale-vs-traditionale': {
        title: 'Invitații Digitale vs Tradiționale: Ghidul Complet 2026',
        date: '15 Ianuarie 2026',
        readTime: '5 min',
        category: 'Tendințe Nunți',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop',
        content: [
            'În era digitală, alegerea între invitații tradiționale pe hârtie și cele digitale devine din ce în ce mai relevantă. Ambele opțiuni au avantajele lor, dar tendințele din 2026 arată o creștere semnificativă a preferinței pentru invitațiile digitale.',
            '## Avantajele Invitațiilor Digitale',
            '### 1. Cost-Eficiență',
            'Invitațiile digitale elimină costurile de tipărire, hârtie premium, plicuri și timbre. Pentru o nuntă cu 200 de invitați, economiile pot ajunge la peste 2000€.',
            '### 2. Viteză de Livrare',
            'Trimite invitații instant, indiferent de locația invitaților. Nu mai există întârzieri poștale sau invitații pierdute.',
            '### 3. Tracking și Confirmări',
            'Vezi în timp real cine a deschis invitația și cine a confirmat prezența. Sistemul automat de RSVP simplifică organizarea.',
            '### 4. Personalizare Nelimitată',
            'Modifică detaliile oricând, adaugă animații, video-uri, hărți interactive și multe altele.',
            '### 5. Eco-Friendly',
            'Zero deșeuri de hârtie, zero emisii de transport. Perfect pentru cuplurile conștiente de mediu.',
            '## Avantajele Invitațiilor Tradiționale',
            '### 1. Tangibilitate',
            'Unii invitați apreciază să aibă ceva fizic pe care să-l păstreze ca amintire.',
            '### 2. Formalitate',
            'Pentru evenimente foarte formale, invitațiile pe hârtie pot părea mai potrivite.',
            '### 3. Accesibilitate pentru Vârstnici',
            'Persoanele în vârstă pot fi mai confortabile cu formatul tradițional.',
            '## Verdictul 2026',
            'Tendința clară este către digital, cu peste 65% dintre cupluri alegând invitații digitale. Soluția hibridă - digitale pentru majoritatea invitaților și câteva tradiționale pentru persoane selecte - devine din ce în ce mai populară.',
            'Indiferent de alegere, important este ca invitația să reflecte personalitatea voastră și să comunice eficient detaliile evenimentului.'
        ],
        relatedLinks: [
            { text: 'Explorează Template-uri Digitale', href: '/demo' },
            { text: 'Începe să Creezi', href: '/create' }
        ]
    },
    'cum-sa-alegi-modelul-perfect': {
        title: 'Cum să Alegi Modelul Perfect de Invitație pentru Nunta Ta',
        date: '12 Ianuarie 2026',
        readTime: '7 min',
        category: 'Ghiduri',
        image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200&auto=format&fit=crop',
        content: [
            'Alegerea modelului perfect de invitație este o decizie importantă care setează tonul pentru întreaga nuntă. Invitația este primul contact al oaspeților cu evenimentul vostru și trebuie să reflecte perfect stilul și personalitatea voastră ca și cuplu.',
            '## Înțelege Tema Nunții',
            'Primul pas în alegerea invitației este să aveți claritate asupra temei nunții. Fie că este vorba de o nuntă rustică, elegantă, modernă sau vintage, invitația trebuie să fie în armonie cu această viziune.',
            '## Tipuri de Template-uri Disponibile',
            '### Template Netflix',
            'Perfect pentru cuplurile care iubesc filmele și serialele. Acest design inovator transformă invitația într-o experiență cinematică, cu layout similar platformei de streaming.',
            '### Template Envelope Clasic',
            'Pentru cei care apreciază eleganța tradițională cu un twist modern. Animația de deschidere a plicului adaugă un element de surpriză.',
            '### Template Boarding Pass',
            'Ideal pentru cuplurile care iubesc să călătorească sau pentru nunți destinate. Designul de bilet de avion este original și memorabil.',
            '### Template Vinyl',
            'Pentru melomani și iubitorii de muzică retro. Designul de disc de vinil rotativ este perfect pentru nunți cu tematică muzicală.',
            '## Factori de Luat în Considerare',
            '### 1. Personalitatea Voastră',
            'Alegeți un design care vă reprezintă ca și cuplu. Dacă sunteți persoane playful și creative, optați pentru ceva neconvențional.',
            '### 2. Vârsta Invitaților',
            'Luați în considerare demografia invitaților. Pentru un public mai tânăr, designuri moderne și interactive funcționează excelent.',
            '### 3. Sezonul Nunții',
            'Culorile și elementele vizuale pot reflecta sezonul - pasteluri pentru primăvară, tonuri calde pentru toamnă.',
            '## Personalizare și Branding',
            'Indiferent de template-ul ales, asigurați-vă că îl personalizați cu:',
            '- Culorile voastre preferate',
            '- Fonturi care vă plac',
            '- Fotografii personale',
            '- Mesaje unice',
            '## Testare și Feedback',
            'Înainte de a trimite invitațiile, cereți feedback de la câțiva prieteni apropiați. Ei pot observa detalii pe care le-ați ratat.',
            '## Concluzie',
            'Alegerea modelului perfect este o combinație între stil personal, practicitate și creativitate. Cu InvitOnline, aveți libertatea să experimentați cu diferite template-uri până găsiți cel care vă reprezintă perfect.'
        ],
        relatedLinks: [
            { text: 'Explorează Toate Modelele', href: '/demo' },
            { text: 'Începe Personalizarea', href: '/create' }
        ]
    },
    'top-10-greseli-invitatii': {
        title: 'Top 10 Greșeli de Evitat la Invitațiile de Nuntă',
        date: '10 Ianuarie 2026',
        readTime: '6 min',
        category: 'Sfaturi',
        image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&auto=format&fit=crop',
        content: [
            'Invitațiile de nuntă sunt mai mult decât simple anunțuri - ele sunt prima impresie pe care o lăsați oaspeților. Evitarea acestor greșeli comune vă va asigura că invitațiile voastre sunt impecabile.',
            '## 1. Trimiterea Prea Târzie',
            'Regula de aur: trimiteți invitațiile cu 6-8 săptămâni înainte de nuntă. Pentru nunți destinate, extindeți la 3 luni.',
            '## 2. Informații Incomplete',
            'Asigurați-vă că includeți:',
            '- Data și ora exactă',
            '- Locația completă cu adresă',
            '- Dress code (dacă există)',
            '- Deadline pentru confirmare',
            '- Informații de contact',
            '## 3. Greșeli de Ortografie',
            'Verificați de 3 ori numele invitaților și toate detaliile. O greșeală de ortografie poate fi jenantă și neprofesională.',
            '## 4. Design Prea Complicat',
            'Mai simplu este adesea mai bine. Un design încărcat poate distrage de la informațiile importante.',
            '## 5. Lipsa Instrucțiunilor RSVP',
            'Faceți procesul de confirmare cât mai simplu posibil. Cu invitații digitale, includeți un buton direct de confirmare.',
            '## 6. Ignorarea Accesibilității',
            'Asigurați-vă că textul este lizibil:',
            '- Contrast suficient între text și fundal',
            '- Font size adecvat (minim 12pt)',
            '- Evitați fonturile prea decorative pentru text lung',
            '## 7. Uitarea Detaliilor Logistice',
            'Includeți informații despre:',
            '- Parcare disponibilă',
            '- Opțiuni de cazare',
            '- Transport organizat',
            '- Restricții alimentare',
            '## 8. Ton Nepotrivit',
            'Tonul invitației trebuie să se potrivească cu stilul nunții. O nuntă formală necesită limbaj formal.',
            '## 9. Lipsa Testării',
            'Pentru invitații digitale, testați pe diferite dispozitive și browsere înainte de trimitere.',
            '## 10. Neglijarea Follow-up-ului',
            'Pregătiți un sistem de urmărire pentru confirmări și trimiteți reminder-e politicoase celor care nu au răspuns.',
            '## Concluzie',
            'Evitând aceste greșeli comune, vă asigurați că invitațiile voastre sunt profesionale, clare și memorabile. InvitOnline vă ajută să evitați automat multe dintre aceste capcane prin template-uri optimizate și sisteme automate de tracking.'
        ],
        relatedLinks: [
            { text: 'Vezi Template-uri Profesionale', href: '/demo' },
            { text: 'Creează Invitația Perfectă', href: '/create' }
        ]
    },
    'invitatii-eco-friendly': {
        title: 'Invitații Eco-Friendly: Cum să Ai o Nuntă Sustenabilă',
        date: '8 Ianuarie 2026',
        readTime: '5 min',
        category: 'Sustenabilitate',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&auto=format&fit=crop',
        content: [
            'În era conștientizării ecologice, din ce în ce mai multe cupluri aleg să aibă nunți sustenabile. Invitațiile digitale sunt primul pas important către un eveniment eco-friendly.',
            '## Impactul Invitațiilor Tradiționale',
            'O nuntă medie cu 200 de invitați folosește:',
            '- Aproximativ 400 foi de hârtie (invitații + plicuri)',
            '- 200 timbre (transport cu emisii CO2)',
            '- Cerneală și materiale de tipărire',
            '- Ambalaje plastice',
            'Toate acestea ajung, de obicei, la gunoi după eveniment.',
            '## Avantajele Invitațiilor Digitale',
            '### Zero Deșeuri',
            'Nicio hârtie, niciun plastic, niciun deșeu fizic. Impactul asupra mediului este practic zero.',
            '### Reducerea Emisiilor',
            'Eliminați complet emisiile de CO2 generate de transportul poștal tradițional.',
            '### Economie de Resurse',
            'Nu se consumă apă, energie sau materii prime în producție.',
            '## Alte Practici Eco-Friendly pentru Nunta Ta',
            '### Decorațiuni Reutilizabile',
            'Optați pentru decorațiuni care pot fi refolosite sau închiriate.',
            '### Meniu Local și Sezonier',
            'Alegeți furnizori locali și ingrediente de sezon pentru a reduce amprenta de carbon.',
            '### Donații în Loc de Cadouri',
            'Încurajați invitații să facă donații către cauze de mediu în loc de cadouri fizice.',
            '## Comunicarea Valorilor Eco',
            'Folosiți invitația digitală pentru a comunica angajamentul vostru față de mediu:',
            '- Explicați de ce ați ales invitații digitale',
            '- Împărtășiți alte inițiative eco ale nunții',
            '- Inspirați invitații să facă alegeri sustenabile',
            '## Calcularea Impactului',
            'Pentru o nuntă cu 200 invitați, alegând invitații digitale economisiți:',
            '- ~8 kg de hârtie',
            '- ~50 kg CO2 din transport',
            '- ~200 litri de apă folosită în producție',
            '## Concluzie',
            'Invitațiile digitale nu sunt doar o alegere modernă și convenabilă - sunt o declarație despre valorile voastre și grija față de planeta noastră. Fiecare decizie eco contează, iar invitațiile sunt un început perfect.'
        ],
        relatedLinks: [
            { text: 'Descoperă Soluții Digitale', href: '/demo' },
            { text: 'Începe Nunta Verde', href: '/create' }
        ]
    },
    'eticheta-invitatiilor-nunta': {
        title: 'Eticheta Invitațiilor de Nuntă: Ghid Complet',
        date: '5 Ianuarie 2026',
        readTime: '8 min',
        category: 'Eticheta',
        image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&auto=format&fit=crop',
        content: [
            'Eticheta invitațiilor de nuntă poate părea complicată, dar urmând câteva reguli de bază, vă veți asigura că totul este perfect și respectuos.',
            '## Formulări Corecte',
            '### Pentru Nunți Formale',
            '"Doamna și Domnul [Prenume Nume] au onoarea de a vă invita la cununia religioasă a fiicei/fiului lor..."',
            '### Pentru Nunți Semi-Formale',
            '"[Prenume] și [Prenume] vă invită cu drag la nunta lor..."',
            '### Pentru Nunți Casual',
            '"Hai să sărbătorim dragostea! [Prenume] și [Prenume] se căsătoresc..."',
            '## Adresarea Invitaților',
            '### Cupluri Căsătorite',
            '"Domnul și Doamna Ion Popescu" sau "Maria și Ion Popescu"',
            '### Cupluri Necăsătorite',
            'Nume separate pe linii diferite, în ordine alfabetică',
            '### Familii cu Copii',
            '"Familia Popescu" sau listați fiecare membru',
            '### Invitați Single',
            'Includeți "+1" doar dacă permiteți un însoțitor',
            '## Timeline-ul Invitațiilor',
            '### Save the Date',
            'Trimiteți cu 6-12 luni înainte (opțional, dar recomandat pentru nunți mari)',
            '### Invitația Principală',
            '6-8 săptămâni înainte pentru nunți locale',
            '3 luni înainte pentru nunți destinate',
            '### Reminder',
            '2 săptămâni înainte pentru cei care nu au confirmat',
            '## Informații Esențiale',
            'Orice invitație trebuie să includă:',
            '- Numele complete ale mirilor',
            '- Data și ora exactă',
            '- Locația (cu adresă completă)',
            '- Dress code (dacă există)',
            '- Detalii RSVP (deadline și modalitate)',
            '- Informații de contact',
            '## Situații Speciale',
            '### Nunți cu Tematică',
            'Explicați clar tema și așteptările legate de ținută sau participare.',
            '### Nunți Destinate',
            'Includeți informații detaliate despre:',
            '- Opțiuni de cazare',
            '- Transport local',
            '- Activități planificate',
            '- Informații despre destinație',
            '### Nunți Intime',
            'Fiți sinceri despre dimensiunea evenimentului și de ce ați ales o listă restrânsă.',
            '## Gestionarea Situațiilor Delicate',
            '### Copii la Nuntă',
            'Dacă nu permiteți copii, comunicați politicos: "Din păcate, din cauza limitărilor de spațiu, evenimentul este destinat doar adulților."',
            '### Restricții Alimentare',
            'Includeți o secțiune pentru preferințe alimentare în formularul RSVP.',
            '### Cadouri',
            'Dacă preferați bani sau donații, comunicați discret, nu pe invitație principală.',
            '## Eticheta Digitală',
            'Pentru invitații digitale:',
            '- Trimiteți la ore decente (9-18)',
            '- Personalizați fiecare invitație',
            '- Asigurați-vă că linkurile funcționează',
            '- Oferiți opțiuni de contact multiple',
            '## Concluzie',
            'Eticheta invitațiilor este despre respect și considerație față de invitați. Urmând aceste ghiduri, vă asigurați că toată lumea se simte apreciată și bine informată.'
        ],
        relatedLinks: [
            { text: 'Template-uri Elegante', href: '/demo' },
            { text: 'Creează cu Stil', href: '/create' }
        ]
    },
    'timeline-perfect-invitatii': {
        title: 'Timeline-ul Perfect: Când să Trimiți Invitațiile de Nuntă',
        date: '1 Ianuarie 2026',
        readTime: '5 min',
        category: 'Planificare',
        image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&auto=format&fit=crop',
        content: [
            'Timing-ul perfect pentru trimiterea invitațiilor poate face diferența între o rată mare de participare și confuzie. Iată ghidul complet pentru planificarea invitațiilor.',
            '## 12-9 Luni Înainte: Save the Date',
            'Pentru nunți mari sau destinate, trimiteți un Save the Date simplu:',
            '- Anunțați data și locația aproximativă',
            '- Permiteți invitaților să își planifice calendarul',
            '- Nu este obligatoriu să includeți toate detaliile',
            '## 6-8 Săptămâni Înainte: Invitația Oficială',
            'Acesta este momentul ideal pentru majoritatea nunților:',
            '### De Ce Acest Timing?',
            '- Suficient timp pentru invitați să își facă planuri',
            '- Nu prea devreme ca să uite',
            '- Timp adecvat pentru confirmări',
            '### Ce Să Includeți',
            '- Toate detaliile complete ale evenimentului',
            '- Informații despre cazare și transport',
            '- Deadline clar pentru RSVP (3-4 săptămâni înainte)',
            '- Link către website-ul nunții (dacă există)',
            '## 3 Luni Înainte: Nunți Destinate',
            'Pentru nunți în străinătate sau locații îndepărtate:',
            '- Invitații au nevoie de timp pentru:',
            '  - Rezervări de zbor',
            '  - Cazare',
            '  - Cereri de concediu',
            '  - Planificare bugetară',
            '## 4 Săptămâni Înainte: Deadline RSVP',
            'Setați deadline-ul pentru confirmări la 3-4 săptămâni înainte:',
            '- Timp suficient pentru ajustări finale',
            '- Posibilitate de a contacta cei care nu au răspuns',
            '- Timp pentru furnizori să primească numărul final',
            '## 2 Săptămâni Înainte: Follow-up',
            'Pentru invitații care nu au confirmat:',
            '- Trimiteți un reminder politicos',
            '- Folosiți un ton prietenos, nu insistent',
            '- Oferiți modalități simple de confirmare',
            '## 1 Săptămână Înainte: Detalii Finale',
            'Trimiteți un email/mesaj final cu:',
            '- Reminder despre dată și oră',
            '- Informații de ultimă oră',
            '- Număr de contact pentru ziua nunții',
            '- Link către playlist sau alte surprize',
            '## Cazuri Speciale',
            '### Nunți Intime (sub 50 invitați)',
            'Puteți trimite cu 4-6 săptămâni înainte, dar nu mai puțin.',
            '### Nunți de Vară',
            'Trimiteți mai devreme (10 săptămâni) - vara este sezon aglomerat.',
            '### Nunți de Iarnă',
            'Luați în considerare sărbătorile - evitați trimiterea în perioada Crăciunului.',
            '## Avantajele Invitațiilor Digitale',
            'Cu InvitOnline, timeline-ul devine mai flexibil:',
            '- Trimitere instantanee',
            '- Modificări în timp real',
            '- Tracking automat al confirmărilor',
            '- Reminder-e automate',
            '## Checklist Timeline',
            '- [ ] 12 luni: Save the Date (opțional)',
            '- [ ] 8 săptămâni: Invitații oficiale',
            '- [ ] 4 săptămâni: Deadline RSVP',
            '- [ ] 2 săptămâni: Follow-up non-responders',
            '- [ ] 1 săptămână: Detalii finale',
            '## Concluzie',
            'Un timeline bine planificat reduce stresul și asigură o rată mare de participare. Cu invitații digitale, aveți flexibilitatea de a ajusta și comunica eficient în fiecare etapă.'
        ],
        relatedLinks: [
            { text: 'Începe Planificarea', href: '/create' },
            { text: 'Vezi Exemple', href: '/demo' }
        ]
    },
    'invitatii-interactive-2026': {
        title: 'Invitații Interactive: Viitorul Invitațiilor de Nuntă',
        date: '28 Decembrie 2025',
        readTime: '7 min',
        category: 'Inovație',
        image: 'https://images.unsplash.com/photo-1519167758481-83f29da8c6b6?w=1200&auto=format&fit=crop',
        content: [
            'Tehnologia transformă invitațiile de nuntă din simple anunțuri în experiențe interactive memorabile. Descoperă ce aduce viitorul în 2026 și dincolo.',
            '## Ce Sunt Invitațiile Interactive?',
            'Invitațiile interactive depășesc textul static, oferind:',
            '- Animații și tranziții fluide',
            '- Elemente clickabile și explorabile',
            '- Conținut multimedia integrat',
            '- Experiențe personalizate pentru fiecare invitat',
            '## Tendințe 2026',
            '### 1. Animații 3D',
            'Template-uri cu elemente tridimensionale care reacționează la mișcarea mouse-ului sau înclinarea telefonului.',
            '### 2. Video Background',
            'Fundal video personalizat cu momente speciale ale cuplului, creând o atmosferă cinematică.',
            '### 3. Gamification',
            'Transformarea confirmării într-un mini-joc sau experiență interactivă:',
            '- Scratch cards digitale',
            '- Puzzle-uri de dezvăluit detalii',
            '- Quiz-uri despre cuplu',
            '### 4. Realitate Augmentată (AR)',
            'Scanează invitația cu telefonul și vezi:',
            '- Modele 3D ale locației',
            '- Avataruri animate ale mirilor',
            '- Preview virtual al decorațiunilor',
            '## Elemente Interactive Populare',
            '### Countdown Timer',
            'Numărătoare inversă live până la ziua nunții, creând anticipare.',
            '### Hărți Interactive',
            'Integrare Google Maps cu:',
            '- Direcții personalizate',
            '- Puncte de interes apropiate',
            '- Opțiuni de transport',
            '### Galerii Foto Dinamice',
            'Slideshow-uri automate cu fotografii ale cuplului, cu muzică de fundal.',
            '### RSVP Inteligent',
            'Formulare care se adaptează:',
            '- Întrebări diferite pentru familii vs. single',
            '- Sugestii automate de meniu bazate pe preferințe',
            '- Integrare calendar automată',
            '## Personalizare Avansată',
            '### Conținut Dinamic',
            'Fiecare invitat vede o versiune unică:',
            '- Mesaje personalizate',
            '- Fotografii relevante pentru relația cu invitatul',
            '- Recomandări specifice (cazare, transport)',
            '### Multi-limbă Automată',
            'Detectare automată a limbii preferate și afișare în limba respectivă.',
            '### Dark/Light Mode',
            'Invitații pot alege tema vizuală preferată.',
            '## Integrări Smart',
            '### Calendar Sync',
            'Buton "Add to Calendar" care funcționează cu:',
            '- Google Calendar',
            '- Apple Calendar',
            '- Outlook',
            '### Social Media',
            'Partajare ușoară pe platforme sociale cu preview personalizat.',
            '### Playlist Colaborativ',
            'Invitații pot sugera melodii pentru nuntă direct din invitație.',
            '## Tehnologii Emergente',
            '### AI-Generated Content',
            'Inteligență artificială care:',
            '- Generează poezii personalizate',
            '- Creează artwork unic',
            '- Sugerează mesaje bazate pe relație',
            '### Voice Messages',
            'Mesaje audio de la miri integrate în invitație.',
            '### Live Updates',
            'Notificări push pentru:',
            '- Schimbări de program',
            '- Informații de ultimă oră',
            '- Surprize planificate',
            '## Considerații Tehnice',
            '### Performanță',
            'Invitațiile interactive trebuie să fie:',
            '- Rapide de încărcat (sub 3 secunde)',
            '- Optimizate pentru mobil',
            '- Funcționale pe conexiuni slabe',
            '### Accesibilitate',
            'Asigurați-vă că elementele interactive sunt:',
            '- Accesibile pentru persoane cu dizabilități',
            '- Funcționale fără JavaScript',
            '- Compatibile cu screen readers',
            '## Viitorul Apropiat',
            'În următorii ani vom vedea:',
            '- Integrare cu asistenti vocali (Alexa, Google)',
            '- Experiențe VR pentru preview-ul locației',
            '- Blockchain pentru invitații NFT unice',
            '- Biometrie pentru confirmare securizată',
            '## Concluzie',
            'Invitațiile interactive nu sunt doar despre tehnologie - sunt despre crearea unei experiențe memorabile care începe cu mult înainte de ziua nunții. InvitOnline vă oferă acces la cele mai noi tehnologii, făcând viitorul accesibil astăzi.'
        ],
        relatedLinks: [
            { text: 'Explorează Template-uri Interactive', href: '/demo' },
            { text: 'Creează Experiența Ta', href: '/create' }
        ]
    },
    'buget-invitatii-nunta-2026': {
        title: 'Bugetul pentru Invitații de Nuntă: Ghid Complet 2026',
        date: '20 Ianuarie 2026',
        readTime: '6 min',
        category: 'Buget',
        image: 'https://images.unsplash.com/photo-1633613286991-611fe299c4be?w=1200&auto=format&fit=crop',
        content: [
            'Planificarea bugetului pentru invitații de nuntă poate părea copleșitoare, dar cu informațiile corecte, poți lua decizii inteligente care să economisească bani fără a compromite calitatea.',
            '## Costurile Invitațiilor Tradiționale în 2026',
            'Pentru o nuntă cu 200 de invitați, costurile tradiționale includ:',
            '- **Design și tipărire**: 800-2000 RON',
            '- **Hârtie premium**: 400-800 RON',
            '- **Plicuri**: 200-400 RON',
            '- **Timbre**: 400 RON (2 RON/plic)',
            '- **Extras (rezerve)**: 200-300 RON',
            '**Total estimat: 2000-3900 RON**',
            '## Costurile Invitațiilor Digitale',
            'Cu InvitOnline, pentru aceeași nuntă:',
            '- **Abonament Premium**: 299 RON (invitații nelimitate)',
            '- **Personalizare avansată**: Inclusă',
            '- **Tracking și RSVP**: Inclusă',
            '- **Modificări nelimitate**: Inclusă',
            '**Total: 299 RON - Economie de 70-90%!**',
            '## Unde Merg Banii la Invitații Tradiționale?',
            '### Design Grafic',
            'Designerii cer 300-800 RON pentru un concept personalizat.',
            '### Tipărire',
            'Costurile variază în funcție de:',
            '- Calitatea hârtiei (80-300 g/m²)',
            '- Finisaje speciale (folio, embosare)',
            '- Cantitate (prețul pe bucată scade la volume mari)',
            '### Distribuție',
            'Timbrele și transportul adaugă costuri semnificative, mai ales pentru invitați din alte orașe.',
            '## Cum să Economisești la Invitații',
            '### 1. Alege Digital',
            'Cea mai mare economie vine din trecerea la digital. Economisești 70-90% față de tradițional.',
            '### 2. Simplifică Designul',
            'Designuri complexe cu multe culori costă mai mult la tipărire.',
            '### 3. Comandă Exact Cât Ai Nevoie',
            'Cu invitații digitale, nu mai trebuie să comanzi extra pentru rezerve.',
            '### 4. Elimină Intermediarii',
            'Platforme ca InvitOnline elimină costurile de designer, tipograf și distribuție.',
            '## Investiții Care Merită',
            'Chiar dacă economisești la invitații, unele investiții merită:',
            '- **Template premium**: Designuri profesionale care impresionează',
            '- **Personalizare avansată**: Fiecare invitat primește ceva unic',
            '- **Sistem RSVP automat**: Economisește timp și reduce stresul',
            '## Calculatorul de Buget',
            'Folosește această formulă simplă:',
            '**Buget Invitații = (Număr Invitați × Cost/Invitație) + Costuri Fixe**',
            'Pentru digital: (200 × 0) + 299 = 299 RON',
            'Pentru tradițional: (200 × 10) + 900 = 2900 RON',
            '## Concluzie',
            'În 2026, invitațiile digitale nu sunt doar o alternativă - sunt alegerea inteligentă pentru cuplurile care vor să economisească fără compromisuri. Cu economii de peste 2500 RON, poți investi acești bani în alte aspecte ale nunții.'
        ],
        relatedLinks: [
            { text: 'Vezi Prețuri și Pachete', href: '/create' },
            { text: 'Calculează Economiile', href: '/demo' }
        ]
    },
    'text-invitatie-nunta-exemple': {
        title: '50+ Exemple de Texte pentru Invitații de Nuntă',
        date: '16 Ianuarie 2026',
        readTime: '10 min',
        category: 'Conținut',
        image: 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?w=1200&auto=format&fit=crop',
        content: [
            'Găsirea cuvintelor perfecte pentru invitația de nuntă poate fi provocatoare. Iată o colecție completă de texte și formulări pentru orice stil de nuntă.',
            '## Texte Formale',
            '### Varianta Clasică',
            '"Doamna și Domnul [Nume Părinți Mireasă] împreună cu Doamna și Domnul [Nume Părinți Mire] au onoarea de a vă invita la cununia religioasă a copiilor lor [Nume Mireasă] și [Nume Mire], care va avea loc în data de [Data], ora [Ora], la [Locație]."',
            '### Varianta Elegantă',
            '"Cu bucurie în suflet vă invităm să fiți alături de noi în cea mai importantă zi din viața noastră. [Nume] și [Nume] își unesc destinele în fața lui Dumnezeu pe data de [Data] la [Locație]."',
            '## Texte Semi-Formale',
            '### Varianta Caldă',
            '"Dragii noștri, ne-am găsit sufletul pereche și vrem să împărtășim această bucurie cu voi! Vă invităm cu drag la nunta noastră pe [Data] la [Locație]."',
            '### Varianta Prietenoasă',
            '"Hai să sărbătorim dragostea! [Nume] și [Nume] vă invită să fiți martori ai începutului călătoriei lor împreună. [Data], [Ora], [Locație]."',
            '## Texte Casual și Creative',
            '### Varianta Playful',
            '"Plot twist: Ne căsătorim! 🎉 Și vrem să fii acolo când spunem DA! [Data] @ [Locație]. Dress code: Fabulos!"',
            '### Varianta Romantică',
            '"Povestea noastră de dragoste începe un nou capitol, și tu ești invitat să fii parte din el. Alătură-te nouă pe [Data] când ne promitem veșnicia."',
            '## Texte pentru Situații Speciale',
            '### A Doua Căsătorie',
            '"Cu experiența vieții și cu inimi pline de speranță, [Nume] și [Nume] vă invită să celebrați alături de ei începutul unei noi călătorii."',
            '### Nuntă Intimă',
            '"Am ales să ne căsătorim într-un cadru intim, înconjurați doar de cei mai dragi oameni. Tu ești unul dintre ei. Te așteptăm pe [Data]."',
            '### Nuntă Destinație',
            '"Aventura continuă! Ne căsătorim în [Destinație] și vrem să fii acolo! Pregătește-ți bagajele pentru [Data]. Detalii complete în invitație."',
            '## Formulări pentru RSVP',
            '### Formal',
            '"Vă rugăm să confirmați prezența până pe [Data] la [Contact]."',
            '### Casual',
            '"Spune-ne dacă vii! Confirmă până pe [Data] aici: [Link]"',
            '### Cu Umor',
            '"Ajută-ne să știm câte farfurii să punem pe masă! Confirmă până pe [Data] 😊"',
            '## Texte pentru Informații Suplimentare',
            '### Dress Code',
            '"Dress code: Elegant / Semi-formal / Casual chic / Beach formal"',
            '### Copii',
            '"Din păcate, din cauza limitărilor de spațiu, evenimentul este destinat doar adulților."',
            'SAU',
            '"Copiii sunt bineveniti! Vom avea colț special de joacă pentru cei mici."',
            '### Cadouri',
            '"Prezența voastră este cel mai frumos cadou. Dacă doriți totuși să ne oferiți ceva, un plic ar fi apreciat pentru începutul călătoriei noastre împreună."',
            '## Concluzie',
            'Alegerea textului potrivit depinde de personalitatea voastră și de tonul pe care vreți să-l dați nunții. Nu există răspuns greșit - important este să fie autentic și să vă reprezinte.'
        ],
        relatedLinks: [
            { text: 'Personalizează Textul Tău', href: '/create' },
            { text: 'Vezi Template-uri', href: '/demo' }
        ]
    },
    ...additionalArticles
}

export async function generateStaticParams() {
    return Object.keys(articlesContent).map((slug) => ({
        slug: slug,
    }))
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const article = articlesContent[slug]

    if (!article) {
        return (
            <div className={styles.container}>
                <div className={styles.notFound}>
                    <h1>Articol negăsit</h1>
                    <p>Slug: {slug}</p>
                    <Link href="/blog" className={styles.backLink}>
                        <ArrowLeft size={20} /> Înapoi la Blog
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
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
                    {article.content.map((paragraph, index) => {
                        if (paragraph.startsWith('## ')) {
                            return <h2 key={index} className={styles.heading}>{paragraph.replace('## ', '')}</h2>
                        } else if (paragraph.startsWith('### ')) {
                            return <h3 key={index} className={styles.subheading}>{paragraph.replace('### ', '')}</h3>
                        } else if (paragraph.startsWith('- ')) {
                            return <li key={index} className={styles.listItem}>{paragraph.replace('- ', '')}</li>
                        } else {
                            return <p key={index} className={styles.paragraph}>{paragraph}</p>
                        }
                    })}
                </div>

                <div className={styles.cta}>
                    <h3 className={styles.ctaTitle}>Gata să Creezi Invitația Ta Perfectă?</h3>
                    <div className={styles.ctaButtons}>
                        {article.relatedLinks.map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                className={index === 0 ? styles.ctaSecondary : styles.ctaPrimary}
                            >
                                {link.text}
                                <ArrowRight size={18} />
                            </Link>
                        ))}
                    </div>
                </div>
            </article>
        </div>
    )
}
