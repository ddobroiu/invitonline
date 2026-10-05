import type { EventTypeId } from './templates'

export interface InvitationLanding {
    slug: string
    label: string
    title: string
    description: string
    heading: string
    eyebrow: string
    intro: string
    eventType: EventTypeId
    models: string[]
    sections: { title: string; text: string }[]
    checklistTitle: string
    checklist: string[]
    sampleTitle: string
    sample: string
    faq: { question: string; answer: string }[]
    related: string[]
    guide: { href: string; label: string }
}

export const INVITATION_LANDINGS: InvitationLanding[] = [
    {
        slug: 'invitatii-online', label: 'Invitații online', title: 'Invitații online personalizate pentru evenimentul tău',
        description: 'Alege invitații online pentru nuntă, botez, aniversare sau petrecere. 23 de modele, personalizare, RSVP și link de distribuit. Activare: 99 lei.',
        heading: 'Invitații online, cu o poveste care vă seamănă.', eyebrow: 'Un eveniment. Un link. O primă emoție.',
        intro: 'O invitație online adună într-un singur loc mesajul, data, programul și indicațiile către locație. Oaspeții o deschid pe telefon și îți răspund direct, iar tu păstrezi confirmările în cont. Începe cu tipul evenimentului, apoi alege o tematică potrivită oamenilor pe care îi inviți.',
        eventType: 'nunta', models: ['modern', 'boarding', 'envelope'],
        sections: [
            { title: 'Alege după eveniment, apoi după stil', text: 'Pentru o nuntă contează numele mirilor și programul ceremoniilor. Pentru un botez, numele copilului, părinților și nașilor. La o aniversare poți pune în prim-plan sărbătoritul, iar pentru un eveniment corporate, gazda și agenda. Editorul schimbă câmpurile în funcție de eveniment; aspectul îl alegi din colecția de modele.' },
            { title: 'Invitație digitală sau invitație tipărită?', text: 'Formatul digital este util când vrei să trimiți repede toate informațiile și să actualizezi o oră sau o adresă după distribuire. O invitație tipărită poate rămâne un obiect de păstrat. Le poți combina: oferi o felicitare fizică și folosești linkul online pentru program, navigare și confirmarea prezenței. InvitOnline creează pagini digitale, nu un serviciu de tipărire.' },
            { title: 'Ce primește fiecare invitat', text: 'Invitatul deschide același link public în browser, fără să instaleze o aplicație și fără să își creeze cont. Poate consulta detaliile și trimite un răspuns cu numele, emailul sau telefonul și numărul de persoane. În contul organizatorului apar confirmările și mesajele; lista poate fi exportată în CSV pentru organizare.' },
        ],
        checklistTitle: 'Pregătește detaliile înainte de personalizare',
        checklist: ['Numele persoanelor sau al gazdei și un mesaj de bun venit.', 'Data, locația și orele principale din program.', 'O fotografie potrivită modelului ales, dacă vrei să o folosești.', 'Un termen pentru confirmări și orice instrucțiune utilă oaspeților.'],
        sampleTitle: 'Un mesaj simplu, bun pentru început',
        sample: 'Te invităm să ne fii alături la un moment important pentru noi. Ne întâlnim pe 12 iulie 2027, la ora 19:00, în București. Programul și indicațiile către locație sunt în invitație. Confirmă-ne prezența până pe 1 iulie, ca să pregătim seara pentru toți cei dragi.',
        faq: [
            { question: 'Cât costă o invitație online?', answer: 'Activarea unui eveniment costă 99 lei, prin plată unică. Poți explora modelele, personaliza invitația și salva un draft înainte de plată. Linkul devine disponibil oaspeților după confirmarea plății.' },
            { question: 'Cum trimit invitația pe WhatsApp?', answer: 'Copiază linkul invitației active din cont și trimite-l într-un mesaj pe WhatsApp. Poți folosi același link în Messenger, SMS sau email; platforma nu trimite automat mesaje în locul tău.' },
            { question: 'Pot schimba detaliile după distribuire?', answer: 'Da. Actualizezi invitația din cont și salvezi modificările. Adresa invitației rămâne aceeași, iar oaspeții văd informațiile noi când o deschid din nou.' },
        ],
        related: ['invitatii-nunta', 'invitatii-botez', 'invitatii-aniversare', 'invitatii-petrecere', 'invitatii-corporate', 'invitatie-bilet-avion', 'invitatie-pasaport', 'invitatie-ziar', 'invitatie-vinil'],
        guide: { href: '/blog/invitatii-digitale-vs-traditionale', label: 'Invitații digitale și tradiționale: ce diferă' },
    },
    {
        slug: 'invitatii-nunta', label: 'Invitații de nuntă', title: 'Invitații de nuntă online cu modele originale și RSVP',
        description: 'Personalizează invitații de nuntă online: elegante, plic interactiv sau bilet de avion. Program, hartă și confirmări RSVP într-un singur link. 99 lei.',
        heading: 'Invitații de nuntă pentru începutul poveștii voastre.', eyebrow: 'Pentru ziua în care spuneți „da”',
        intro: 'Invitația de nuntă anunță mai mult decât o dată: le arată oaspeților cum va fi ziua voastră. Poate fi o scrisoare caldă, un portret elegant sau un bilet către o nouă călătorie. Alegeți modelul, completați programul și trimiteți un link în care toate detaliile rămân ușor de găsit.',
        eventType: 'nunta', models: ['modern', 'envelope', 'boarding'],
        sections: [
            { title: 'Un program clar pentru o zi cu mai multe opriri', text: 'Cununia civilă, ceremonia religioasă și petrecerea pot avea loc la ore și adrese diferite. Folosiți câmpurile de program pentru a le separa, în loc să ascundeți toate informațiile într-un paragraf lung. Menționați locația principală și verificați linkul hărții înainte de distribuire. O schimbare de oră poate fi salvată ulterior în aceeași invitație.' },
            { title: 'Cum alegi modelul de nuntă', text: 'Un model editorial, precum Vow, pune fotografia și numele în prim-plan. Plicul Love Letter creează un mic moment de descoperire. Biletul de avion se potrivește unei povești despre călătorii, iar pașaportul continuă aceeași temă într-un format de carnet. Alegeți o compoziție în care mesajul vostru se citește bine pe telefon, apoi testați previzualizarea.' },
            { title: 'Confirmările care ajută la organizarea mesei', text: 'Formularul RSVP strânge numele, contactul și numărul de persoane pentru fiecare răspuns. Organizatorul vede în cont cine a confirmat sau a refuzat și poate exporta lista. Dacă folosiți opțiuni de meniu, scrieți denumiri clare. Răspunsurile sunt un punct de plecare pentru lista de la restaurant; verificați separat cu oaspeții orice detaliu care are nevoie de clarificare.' },
        ],
        checklistTitle: 'Ce să incluzi în invitația de nuntă',
        checklist: ['Numele mirilor, părinților și nașilor, în forma în care vreți să apară.', 'Data și programul cununiei civile, religioase și al petrecerii.', 'Numele locațiilor și adresa pentru navigare.', 'Termenul de confirmare, ținuta și instrucțiuni de acces sau parcare.'],
        sampleTitle: 'Exemplu de text pentru invitația de nuntă',
        sample: 'Ana și Andrei vă invită să le fiți alături la începutul unei noi povești. Pe 12 iulie 2027, ne întâlnim la ceremonia religioasă, la ora 16:30, apoi sărbătorim împreună de la ora 19:00. Ne-ar bucura să ne confirmați prezența până pe 1 iulie. Cu drag, vă așteptăm!',
        faq: [
            { question: 'Pot trece separat cele trei momente ale nunții?', answer: 'Da. Editorul pentru nuntă are câmpuri pentru cununia civilă, ceremonia religioasă și petrecere, fiecare cu oră și locație. Completează doar momentele pe care vrei să le afișezi.' },
            { question: 'Pot adăuga o fotografie cu noi?', answer: 'Da, modelele prezentate aici acceptă fotografii. Încarcă fotografia în editor și verifică în previzualizare încadrarea și lizibilitatea numelor.' },
            { question: 'Invitații pot confirma pentru un cuplu sau o familie?', answer: 'Da. La confirmare pot alege un număr de persoane între 1 și 20 pentru răspunsul lor. Nu există o limită a numărului de oaspeți cărora le poți trimite linkul evenimentului.' },
        ], related: ['invitatie-bilet-avion', 'invitatie-pasaport', 'invitatie-ziar'],
        guide: { href: '/blog/cum-sa-alegi-modelul-perfect', label: 'Cum alegi modelul potrivit evenimentului' },
    },
    {
        slug: 'invitatii-botez', label: 'Invitații de botez', title: 'Invitații de botez online, personalizate cu fotografie',
        description: 'Creează invitații de botez online cu numele copilului, fotografie, părinți și nași. Programul bisericii și restaurantului, hartă și RSVP. 99 lei.',
        heading: 'Invitații de botez pentru o minune mică.', eyebrow: 'Primul lui eveniment. O amintire de familie.',
        intro: 'O fotografie, numele copilului și o invitație scrisă cu drag sunt suficiente pentru a anunța un botez. Alege un model delicat sau o scrisoare interactivă, apoi adaugă detaliile pentru biserică și restaurant. Familia și prietenii primesc tot ce au nevoie într-un singur link.',
        eventType: 'botez', models: ['botez-delicat', 'boho', 'envelope'],
        sections: [
            { title: 'Numele copilului, în centrul invitației', text: 'Modelul Luna folosește o compoziție cu lună și tonuri de lavandă; Botanica aduce forme organice și verde măsliniu. În ambele, fotografia poate personaliza invitația fără să aglomereze mesajul. Alegeți un cadru luminos, în care chipul se vede bine, și verificați cum arată fotografia în model înainte de a distribui linkul.' },
            { title: 'Două locații, explicate separat', text: 'Păstrați distincte ora slujbei și ora întâlnirii la restaurant. Un invitat care ajunge doar la petrecere trebuie să găsească repede informația care îl privește. Editorul pentru botez are câmpuri pentru biserică și restaurant, împreună cu numele părinților și nașilor. Puteți adăuga într-un câmp suplimentar detalii despre parcare, acces sau un punct de întâlnire.' },
            { title: 'Un mesaj care sună ca voi', text: 'Puteți scrie invitația în vocea părinților sau din perspectiva copilului. Dacă alegeți un ton jucăuș, păstrați data și programul foarte clare. Un mesaj scurt se citește bine pe telefon și lasă fotografia să respire. Încheiați cu termenul până la care vă ajută să primiți confirmările, pentru a organiza locurile la masă.' },
        ], checklistTitle: 'Detalii utile pentru o invitație de botez',
        checklist: ['Numele copilului și fotografia pe care doriți să o folosiți.', 'Numele părinților și ale nașilor.', 'Biserica, restaurantul și orele celor două momente.', 'Data-limită pentru răspuns și instrucțiunile utile familiilor invitate.'],
        sampleTitle: 'Exemplu de text pentru botez',
        sample: 'Sunt Sofia și vă invit la primul meu eveniment de familie! Împreună cu părinții mei, Ana și Andrei, și nașii mei, vă aștept pe 12 iulie 2027. Ne întâlnim la biserică la ora 14:00, apoi continuăm sărbătoarea la restaurant de la ora 16:00. Spuneți-ne până pe 1 iulie dacă ne veți fi alături.',
        faq: [
            { question: 'Pot personaliza invitația fără o fotografie?', answer: 'Da. Fotografia este opțională. Poți completa numele copilului, mesajul și programul, apoi verifica modelul în previzualizare înainte de activare.' },
            { question: 'Pot pune numele ambilor părinți și ale nașilor?', answer: 'Da. Selectează Botez în editor pentru a vedea câmpurile copilului, mamei, tatălui și nașilor. Pentru alte informații poți folosi câmpurile suplimentare.' },
            { question: 'Cum actualizez restaurantul dacă se schimbă?', answer: 'Deschizi invitația din cont, modifici locația și programul, apoi salvezi. Linkul distribuit rămâne același; anunță-i și prin mesaj pe cei care au citit deja vechea adresă.' },
        ], related: ['invitatii-aniversare', 'invitatii-nunta', 'invitatii-online'],
        guide: { href: '/blog/personalizare-invitatii-digitale', label: 'Ghid pentru personalizarea invitației digitale' },
    },
    {
        slug: 'invitatii-aniversare', label: 'Invitații de aniversare', title: 'Invitații de aniversare online pentru copii și adulți',
        description: 'Invitații de aniversare personalizate: confetti, vinil sau stil minimalist. Adaugă numele, vârsta, fotografia, locația și confirmările. 99 lei.',
        heading: 'Invitații de aniversare cu personalitatea sărbătoritului.', eyebrow: 'Încă un an. Un motiv bun de sărbătoare.',
        intro: 'De la o zi de naștere cu confetti la o aniversare însoțită de muzica preferată, invitația poate porni de la lucrurile care îl reprezintă pe sărbătorit. Completează numele, vârsta și locul petrecerii, apoi trimite un link ușor de deschis și de confirmat.',
        eventType: 'aniversare', models: ['kids', 'vinyl', 'classic-minimal'],
        sections: [
            { title: 'Pentru copii: vesel, dar ușor de urmărit', text: 'Confetti Club folosește forme decupate și un aspect de poster de petrecere. În mesaj, explică părinților ora de sosire, locul întâlnirii și orice detaliu despre acces. Dacă vrei să primești confirmări pentru copil și însoțitor, spune clar cum să completeze numărul de persoane. Păstrează instrucțiunile practice separate de mesajul aniversar.' },
            { title: 'Pentru adulți: de la discret la muzical', text: 'Pure este potrivit pentru un mesaj scurt și o compoziție aerisită. Discul nostru transformă fotografia într-o etichetă de vinil și poate reda un fișier audio încărcat de organizator. Muzica pornește la interacțiunea oaspetelui, în acord cu comportamentul browserului; invitația rămâne lizibilă și fără sunet.' },
            { title: 'Folosește confirmările pentru pregătiri', text: 'Numărul de persoane ajută la rezervarea mesei, pregătirea porțiilor și organizarea activităților. Menționează un termen de răspuns în invitație și consultă lista din cont. Pentru o petrecere mică, poți trimite un mesaj personal împreună cu linkul, astfel încât invitația digitală să completeze tonul familiar al evenimentului.' },
        ], checklistTitle: 'Ce le spui oaspeților la o aniversare',
        checklist: ['Numele sărbătoritului și vârsta, dacă vrei să fie afișată.', 'Data, ora și locul întâlnirii.', 'Tematica, ținuta sau activitatea pregătită.', 'Cum să confirme numărul de persoane și până când ai nevoie de răspuns.'],
        sampleTitle: 'Exemplu de mesaj pentru o zi de naștere',
        sample: 'Mihai împlinește 30 de ani și vrea să-i sărbătorească alături de voi! Ne vedem pe 12 iulie 2027, de la ora 19:00, pentru o seară cu muzică, povești și oameni dragi. Ținuta: relaxată, cu chef de petrecere. Confirmă până pe 1 iulie câte persoane vin cu tine.',
        faq: [
            { question: 'Invitațiile sunt potrivite și pentru copii?', answer: 'Da. Poți selecta Aniversare și alege un model jucăuș precum Confetti Club. Mesajul și instrucțiunile pentru părinți se personalizează în editor.' },
            { question: 'Trebuie să afișez vârsta?', answer: 'Nu. Vârsta este opțională. Dacă o completezi, folosește un număr între 0 și 150; poți păstra doar numele și mesajul aniversar.' },
            { question: 'Pot folosi o melodie în invitație?', answer: 'Da, în modelele care acceptă audio, precum Discul nostru. Încarci un fișier MP3, WAV sau OGG de maximum 50 MB; oaspetele pornește redarea din invitație.' },
        ], related: ['invitatie-vinil', 'invitatii-petrecere', 'invitatii-botez'],
        guide: { href: '/blog/personalizare-invitatii-digitale', label: 'Cum personalizezi textul și imaginile' },
    },
    {
        slug: 'invitatii-petrecere', label: 'Invitații de petrecere', title: 'Invitații de petrecere online: festival, VIP și cinema',
        description: 'Creează invitații online pentru petreceri tematice: Festival Pass, Card VIP sau afiș cinema. Program, ținută și RSVP pentru oaspeți. 99 lei.',
        heading: 'Invitații de petrecere care dau tonul serii.', eyebrow: 'O temă bună începe înainte de petrecere.',
        intro: 'Un afiș de festival, un card VIP sau o premieră de film: alege o invitație care explică din prima atmosfera petrecerii. Completează ora de sosire, locația și ținuta, apoi urmărește confirmările din cont. Oaspeții primesc un singur link pentru toate detaliile.',
        eventType: 'petrecere', models: ['festival', 'vip', 'netflix'],
        sections: [
            { title: 'Festival, cinema sau acces VIP?', text: 'Festival Pass pune în prim-plan data și ritmul petrecerii, cu posibilitatea de a adăuga muzică. Card VIP are un aspect de card de membru, potrivit unei seri cu un mesaj scurt și un cod vestimentar clar. Premiere folosește limbajul unui afiș cinematografic și acceptă fotografie sau video. Alege tema care descrie evenimentul pe care chiar îl pregătești.' },
            { title: 'Ținuta și programul fac parte din invitație', text: 'Dacă petrecerea are o temă, explică ce presupune pentru oaspeți: o culoare, un accesoriu sau un stil de ținută. Evită instrucțiunile vagi dacă pregătirea cere efort. Poți folosi câmpurile suplimentare pentru un program al serii, o regulă de acces ori punctul de întâlnire și poți păstra locația principală conectată la hartă.' },
            { title: 'O invitație tematică nu este un sistem de bilete', text: 'Designul poate arăta ca un permis de festival sau un card VIP, dar InvitOnline gestionează invitații și confirmări, nu vânzarea biletelor către participanți sau scanarea accesului la intrare. Dacă evenimentul are astfel de cerințe, organizează-le separat și descrie în mesaj pașii pe care oaspeții trebuie să îi urmeze.' },
        ], checklistTitle: 'Detalii care pregătesc atmosfera',
        checklist: ['Numele petrecerii și cine o organizează.', 'Ora de sosire, locația și indicațiile de acces.', 'Tematica și codul vestimentar, explicate concret.', 'Termenul de confirmare și informații despre însoțitori.'],
        sampleTitle: 'Exemplu de text pentru o petrecere tematică',
        sample: 'Ai un loc rezervat la Summer Night! Pe 12 iulie 2027, de la ora 19:00, ne întâlnim pentru o seară cu muzică și prieteni. Vino cu un accesoriu în nuanțe de verde și cu chef de dans. Adresa și indicațiile sunt în invitație. Confirmă până pe 1 iulie numărul de persoane care vin.',
        faq: [
            { question: 'Pot pune un videoclip în invitația petrecerii?', answer: 'Da, în modelele care acceptă video, precum Premiere. Încarcă un fișier MP4 sau WebM de maximum 100 MB și verifică redarea în previzualizare.' },
            { question: 'Cardul VIP validează accesul la intrare?', answer: 'Nu. Este o tematică vizuală pentru invitația digitală. Platforma oferă RSVP și lista de invitați, fără un sistem de scanare sau validare a biletelor.' },
            { question: 'Pot adăuga instrucțiuni despre ținută?', answer: 'Da. Completează câmpul pentru ținută și, dacă este nevoie, instrucțiunile speciale sau câmpurile suplimentare din editor.' },
        ], related: ['invitatie-vinil', 'invitatii-aniversare', 'invitatii-corporate'],
        guide: { href: '/blog/cum-sa-alegi-modelul-perfect', label: 'Cum alegi o tematică potrivită' },
    },
    {
        slug: 'invitatii-corporate', label: 'Invitații corporate', title: 'Invitații corporate online pentru evenimente și gale',
        description: 'Invitații corporate personalizate pentru gale, întâlniri și petreceri de companie. Gazdă, program, locație și confirmări online. 99 lei per eveniment.',
        heading: 'Invitații corporate, clare de la primul mesaj.', eyebrow: 'Pentru oamenii care construiesc împreună.',
        intro: 'La un eveniment de companie, invitația trebuie să explice repede cine invită, de ce vă întâlniți și cum se desfășoară ziua. Alege o compoziție de afiș contemporan, un model de gală sau un card VIP și păstrează informațiile practice în prim-plan.',
        eventType: 'corporate', models: ['corporate', 'gala', 'vip'],
        sections: [
            { title: 'Gazda și scopul evenimentului', text: 'Folosește titlul pentru numele întâlnirii, iar câmpul gazdei pentru companie sau echipă. În mesaj, explică scopul evenimentului în câteva propoziții: o întâlnire de echipă, o aniversare a companiei ori o seară cu partenerii. Un invitat ar trebui să poată decide dacă informația îl privește fără să parcurgă un text foarte lung.' },
            { title: 'O agendă pe care o poți actualiza', text: 'Adaugă ora de sosire și locația principală, apoi folosește câmpurile suplimentare pentru recepție, prezentări, cină sau programul serii. Dacă agenda se schimbă, salvează modificările în invitația existentă. Adresa rămâne aceeași. Anunță separat participanții despre schimbările importante, pentru ca ei să redeschidă informațiile actualizate.' },
            { title: 'Confirmări simple pentru organizator', text: 'Invitații trimit răspunsul în browser, iar lista din cont ajută la pregătirea locurilor și a recepției. Exportul CSV poate fi folosit în foaia de organizare a echipei. Platforma nu este un sistem de înscriere la conferințe cu conturi de participanți sau acreditări; pentru o întâlnire cu RSVP simplu, linkul păstrează pașii scurți.' },
        ], checklistTitle: 'Ce să pregătești pentru un eveniment de companie',
        checklist: ['Numele evenimentului, compania gazdă și scopul întâlnirii.', 'Data, intervalul de sosire și agenda principală.', 'Locația, indicațiile de acces și ținuta recomandată.', 'Termenul de confirmare și o instrucțiune clară despre însoțitori.'],
        sampleTitle: 'Exemplu de invitație corporate',
        sample: 'Echipa Example vă invită la The Gathering, o seară dedicată parteneriatelor și proiectelor care ne aduc împreună. Ne întâlnim pe 12 iulie 2027, de la ora 18:30, în București. Ținută recomandată: smart casual. Vă rugăm să confirmați până pe 1 iulie. Agenda și adresa sunt disponibile în invitație.',
        faq: [
            { question: 'Pot personaliza invitația pentru o gală?', answer: 'Da. Modelul After Dark folosește o compoziție în burgund și accente aurii. Completează titlul, gazda, programul și ținuta în editorul pentru evenimente corporate.' },
            { question: 'Pot exporta participanții confirmați?', answer: 'Poți exporta lista de invitați în CSV din cont. Lista conține și statusul răspunsurilor, astfel încât să poți pregăti evidența participanților în instrumentul folosit de echipă.' },
            { question: 'Datele din cont se folosesc automat pe factura plății?', answer: 'Pentru factura activării, confirmă datele de facturare cerute în pagina de plată Stripe. Datele pe care le salvezi în cont sunt păstrate acolo; plata colectează separat informațiile necesare facturii.' },
        ], related: ['invitatii-petrecere', 'invitatii-aniversare', 'invitatii-online'],
        guide: { href: '/blog/personalizare-invitatii-digitale', label: 'Personalizarea detaliilor din invitație' },
    },
    {
        slug: 'invitatie-bilet-avion', label: 'Invitație bilet de avion', title: 'Invitație bilet de avion pentru nuntă | Boarding pass',
        description: 'O invitație de nuntă ca un bilet de avion: nume de pasageri, rută, program, QR și RSVP. Personalizează modelul boarding pass online. Activare: 99 lei.',
        heading: 'O invitație bilet de avion către povestea voastră.', eyebrow: 'Îmbarcarea începe cu o invitație.',
        intro: 'Pentru doi oameni care iubesc călătoriile, nunta poate începe cu un boarding pass. Numele devin pasageri, locul petrecerii devine destinația, iar programul apare ca un itinerar. Modelul Bilet de avion păstrează toate informațiile unei invitații într-un format care se recunoaște imediat.',
        eventType: 'nunta', models: ['boarding', 'passport', 'riviera'],
        sections: [
            { title: 'Cum arată un boarding pass digital', text: 'Invitația folosește coduri de plecare și destinație, o linie de zbor, numele pasagerilor și un talon în partea laterală sau de jos, în funcție de ecran. Data, locația și orele reale rămân ușor de citit. Aspectul amintește de un bilet de îmbarcare, dar mesajul și detaliile sunt ale evenimentului vostru, fără legătură cu o companie aeriană.' },
            { title: 'Transformă programul într-un itinerar', text: 'Completează programul cununiei și al petrecerii în editor, apoi verifică ordinea orelor în previzualizare. Părinții și nașii pot apărea în secțiunea echipajului, iar câmpurile suplimentare pot include termenul de confirmare sau informații de acces. Dacă ai o poveste despre o călătorie importantă, spune-o în mesaj, în două sau trei propoziții.' },
            { title: 'Link, hartă și QR pentru aceeași invitație', text: 'Oaspeții primesc linkul public după activarea invitației. Modelul include un cod QR către pagina invitației, butoane de navigare și formular RSVP. QR-ul deschide invitația; nu validează accesul la eveniment și nu este un bilet de transport. Pentru distribuirea pe telefon, linkul trimis direct rămâne cel mai scurt pas.' },
        ], checklistTitle: 'Pregătește călătoria din invitație',
        checklist: ['Numele mirilor, care vor apărea ca pasageri.', 'Data și locația reală a evenimentului.', 'Orele ceremoniilor și ale petrecerii, ca itinerar.', 'O fotografie și un mesaj inspirat dintr-o călătorie a voastră.'],
        sampleTitle: 'Exemplu de text cu tematică de călătorie',
        sample: 'Ana și Andrei vă invită la îmbarcare pentru cea mai frumoasă călătorie a lor. Destinația: o viață împreună. Plecarea: 12 iulie 2027. După ceremonia de la ora 16:30, ne întâlnim la petrecere de la ora 19:00. Confirmați până pe 1 iulie dacă ocupați locurile rezervate în povestea noastră.',
        faq: [
            { question: 'Pot folosi biletul de avion și pentru o petrecere?', answer: 'Da. Modelul Bilet de avion este recomandat pentru nunți și petreceri. Poți schimba tipul evenimentului în editor și completa detaliile potrivite.' },
            { question: 'Este un bilet de avion care se tipărește?', answer: 'Modelul de aici este o invitație digitală care se deschide în browser. InvitOnline nu oferă, prin acest model, un fișier pregătit pentru tipar sau un bilet de transport.' },
            { question: 'Ce face codul QR?', answer: 'Codul QR duce către pagina invitației. În demo duce către previzualizarea modelului; într-o invitație salvată duce către linkul ei, disponibil public după activare.' },
        ], related: ['invitatie-pasaport', 'invitatii-nunta', 'invitatie-ziar'],
        guide: { href: '/blog/cum-sa-alegi-modelul-perfect', label: 'Cum alegi un model care spune povestea voastră' },
    },
    {
        slug: 'invitatie-pasaport', label: 'Invitație pașaport', title: 'Invitație pașaport de nuntă, personalizată online',
        description: 'Invitație de nuntă tip pașaport, cu copertă interactivă, fotografie și detaliile evenimentului. Alege o tematică de călătorie cu RSVP online. 99 lei.',
        heading: 'Un pașaport pentru următorul capitol împreună.', eyebrow: 'Povestea voastră, fără granițe.',
        intro: 'Invitația pașaport este pentru poveștile care au trecut prin aeroporturi, orașe și destinații împărțite. Oaspetele deschide coperta și descoperă fotografia, numele și detaliile nunții. Este un mic gest interactiv înainte de întâlnirea din ziua evenimentului.',
        eventType: 'nunta', models: ['passport', 'boarding', 'riviera'],
        sections: [
            { title: 'O copertă care se deschide', text: 'Modelul Pașaport pornește cu o copertă verde și un format de carnet. La o atingere, invitația dezvăluie pagina cu fotografia și informațiile. Verifică în demo această interacțiune înainte de a alege modelul. În editor poți schimba fotografia și textele, în timp ce identitatea vizuală a pașaportului rămâne coerentă.' },
            { title: 'Fotografia și numele ca pagină de identitate', text: 'Alege o fotografie cu voi în care ambele chipuri se văd bine și păstrează numele în forma pe care o folosiți în invitațiile către familie. Poți lega mesajul de primul vostru drum împreună, de locul cererii în căsătorie sau de o destinație care vă reprezintă. Nu este nevoie să inventezi o călătorie: un gând despre viitor păstrează tema la fel de bine.' },
            { title: 'Călătoria este tema, programul rămâne precis', text: 'Păstrează vizibile datele practice: ziua, orele, biserica, restaurantul și termenul de răspuns. Modelul folosește detalii inspirate de pagini și vize, dar oaspeții nu trebuie să ghicească informațiile reale. Linkul de navigare și confirmarea RSVP completează tematica cu pași simpli pentru cei care participă.' },
        ], checklistTitle: 'Ce completezi în invitația pașaport',
        checklist: ['Numele mirilor și o fotografie potrivită formatului.', 'Un mesaj despre începutul călătoriei împreună.', 'Programul real al nunții și adresele locațiilor.', 'Nașii, părinții și termenul pentru confirmări.'],
        sampleTitle: 'Exemplu de text pentru pașaportul nunții',
        sample: 'Am adunat amintiri în multe locuri, iar acum pornim către o nouă destinație: căsnicia. Ana și Andrei vă invită pe 12 iulie 2027 să le fiți alături la începutul acestei călătorii. Programul și locurile de întâlnire sunt în pașaportul nostru. Confirmați până pe 1 iulie dacă veniți cu noi.',
        faq: [
            { question: 'Coperta pașaportului este interactivă?', answer: 'Da. Oaspetele o deschide prin atingere sau click pentru a vedea interiorul invitației. Poți testa deschiderea și închiderea în previzualizarea modelului.' },
            { question: 'Pașaportul și biletul de avion sunt același model?', answer: 'Nu. Pașaportul are copertă și pagină interioară; Bilet de avion folosește un format de boarding pass cu rută și talon. Ambele sunt în tematica de călătorie.' },
            { question: 'Este potrivit pentru o nuntă în alt oraș?', answer: 'Da. Completează locațiile și programul real. Dacă oaspeții au nevoie de informații despre acces sau punctul de întâlnire, adaugă-le în mesaj ori în câmpurile suplimentare.' },
        ], related: ['invitatie-bilet-avion', 'invitatii-nunta', 'invitatie-ziar'],
        guide: { href: '/blog/personalizare-invitatii-digitale', label: 'Idei pentru personalizarea mesajului' },
    },
    {
        slug: 'invitatie-ziar', label: 'Invitație ziar', title: 'Invitație de nuntă tip ziar: știrea voastră, online',
        description: 'Creează o invitație de nuntă tip ziar, cu titlu de prima pagină, fotografie și program. Model original, link de distribuit și RSVP online. 99 lei.',
        heading: 'Invitație ziar: voi sunteți știrea cea mare.', eyebrow: 'Ediție specială. O singură poveste.',
        intro: 'Anunțați nunta ca pe o știre de prima pagină. Modelul Ziarul nostru folosește titluri, coloane și fotografie pentru un mesaj care poate fi elegant sau plin de umor. În spatele aspectului editorial, oaspeții găsesc data, locația și confirmarea prezenței.',
        eventType: 'nunta', models: ['news', 'modern', 'cinema'],
        sections: [
            { title: 'Un titlu bun în loc de un mesaj lung', text: 'Pornește de la o propoziție care rezumă anunțul: „Ana și Andrei spun da” sau „Se pregătește cea mai frumoasă ediție”. Apoi adaugă mesajul vostru în câteva fraze. Un titlu scurt se așază mai bine pe telefon și lasă programul să fie văzut fără să concureze cu povestea.' },
            { title: 'Fotografia face legătura cu voi', text: 'Alege un portret în care numele și chipurile se recunosc ușor. Modelul folosește o compoziție de ziar, cu contrast între titluri și text. Poți scrie într-un ton de redacție sau poți păstra o invitație clasică în interiorul acestei forme. Nu ai nevoie de o poveste inventată: detaliile reale ale relației voastre sunt un punct de plecare mai bun.' },
            { title: 'Ediție digitală, cu informații actualizabile', text: 'Ziarul este o pagină online, nu o publicație tipărită. Îl distribui ca link, iar programul se poate modifica din cont dacă apare o schimbare. Oaspeții au acces la butoanele de navigare și la formularul RSVP. Pentru o aniversare, același limbaj editorial poate pune în prim-plan sărbătoritul și povestea petrecerii.' },
        ], checklistTitle: 'Pregătește prima pagină',
        checklist: ['Un titlu scurt pentru anunțul principal.', 'Fotografia și numele persoanelor sărbătorite.', 'Mesajul, data, programul și locul evenimentului.', 'Termenul pentru confirmări și detaliile utile cititorilor-invitați.'],
        sampleTitle: 'Exemplu de text în stil de ziar',
        sample: 'Știrea zilei: Ana și Andrei spun „da”! Pe 12 iulie 2027, povestea lor primește un capitol nou, iar familia și prietenii sunt invitați să fie martori. Ceremonia începe la 16:30, urmată de o seară de sărbătoare de la 19:00. Redacția așteaptă confirmările până pe 1 iulie.',
        faq: [
            { question: 'Pot scrie propriul titlu de ziar?', answer: 'Da. Titlul și mesajul se personalizează în editor. Alege un titlu ușor de citit și verifică în previzualizare cum se așază pe telefon.' },
            { question: 'Modelul este potrivit și pentru aniversări?', answer: 'Da. Ziarul nostru este recomandat pentru nunți și aniversări. Selectează tipul de eveniment pentru a completa numele și detaliile potrivite.' },
            { question: 'Primesc un PDF pentru tipărire?', answer: 'Această ofertă este pentru o invitație digitală deschisă prin link. Nu include un PDF pregătit pentru tipografie; toate detaliile și RSVP-ul sunt în pagina online.' },
        ], related: ['invitatii-nunta', 'invitatii-aniversare', 'invitatie-bilet-avion'],
        guide: { href: '/blog/cum-sa-alegi-modelul-perfect', label: 'Cum alegi între un model clasic și unul tematic' },
    },
    {
        slug: 'invitatie-vinil', label: 'Invitație vinil', title: 'Invitație vinil cu fotografie și muzică, personalizată',
        description: 'O invitație digitală ca un disc de vinil: fotografie pe etichetă, muzică la atingere și RSVP. Pentru nuntă, aniversare sau petrecere. Activare: 99 lei.',
        heading: 'Invitație vinil, pe ritmul vostru.', eyebrow: 'O fotografie. O melodie. O amintire.',
        intro: 'Dacă o melodie spune ceva despre voi, invitația poate începe de acolo. Modelul Discul nostru pune fotografia pe eticheta unui vinil și îi invită pe oaspeți să pornească muzica. Este o tematică potrivită pentru o nuntă, o aniversare sau o petrecere cu personalitate.',
        eventType: 'nunta', models: ['vinyl', 'festival', 'chat'],
        sections: [
            { title: 'O fotografie pe eticheta discului', text: 'Alege un cadru în care subiectul rămâne vizibil într-o încadrare circulară. Fotografia devine parte din discul animat, iar numele și mesajul rămân în pagina invitației. Înainte de activare, verifică modelul pe telefon: un portret simplu poate fi mai ușor de recunoscut decât o imagine cu multe persoane sau detalii.' },
            { title: 'Cum funcționează muzica în browser', text: 'Încarcă un fișier audio MP3, WAV sau OGG de maximum 50 MB. Oaspetele pornește muzica din invitație, printr-o atingere sau un click; redarea automată cu sunet poate fi blocată de browser. Dacă nu adaugi audio, păstrezi aspectul de vinil și toate detaliile evenimentului. Folosește un fișier pe care ai dreptul să îl distribui.' },
            { title: 'De la vinil la afiș de festival', text: 'Pentru o atmosferă intimă și un mesaj personal, vinilul pune accent pe fotografia și melodia voastră. Pentru o petrecere cu energie de scenă, Festival Pass folosește aspectul unui afiș și acceptă, la rândul lui, audio. Poți compara cele două în demo înainte de a decide. Formularul RSVP și linkurile de navigare rămân utile indiferent de temă.' },
        ], checklistTitle: 'Pregătește invitația muzicală',
        checklist: ['O fotografie care se citește bine într-un cerc.', 'Un fișier audio compatibil, dacă vrei să adaugi muzică.', 'Numele, mesajul, data și programul evenimentului.', 'Locația și termenul până la care aștepți confirmările.'],
        sampleTitle: 'Exemplu de text pentru invitația vinil',
        sample: 'Povestea noastră are o coloană sonoră, iar pe 12 iulie 2027 vrem să o ascultăm alături de voi. Ana și Andrei vă invită la o seară cu oameni dragi, muzică și un început nou. Programul și locația sunt în invitație. Apăsați play și confirmați până pe 1 iulie dacă ne veți fi alături.',
        faq: [
            { question: 'Muzica pornește automat?', answer: 'Redarea se pornește prin interacțiunea oaspetelui. Browserele pot bloca sunetul automat, de aceea invitația oferă control pentru pornire și oprire.' },
            { question: 'Ce fișiere audio pot încărca?', answer: 'MP3, WAV și OGG, de maximum 50 MB. Alege un fișier pe care ai dreptul să îl folosești și verifică redarea în previzualizare.' },
            { question: 'Pot folosi modelul pentru o aniversare?', answer: 'Da. Discul nostru este recomandat pentru nunți, aniversări și petreceri. Selectează tipul în editor pentru câmpurile potrivite evenimentului.' },
        ], related: ['invitatii-aniversare', 'invitatii-petrecere', 'invitatii-nunta'],
        guide: { href: '/blog/personalizare-invitatii-digitale', label: 'Cum personalizezi fotografia și mesajul' },
    },
]

export function getInvitationLanding(slug: string) {
    return INVITATION_LANDINGS.find(page => page.slug === slug)
}
