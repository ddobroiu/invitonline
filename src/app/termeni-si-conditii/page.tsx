import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPage, { legalStyles } from '@/components/legal/LegalPage'
import OperatorDetails from '@/components/legal/OperatorDetails'
import { ANPC_SAL_URL, ANPC_URL, COMPANY, LEGAL_EFFECTIVE_DATE, LEGAL_LINKS, PRICE_NOTE } from '@/config/legal'
import { INVITATION_PRICE } from '@/lib/stripe'

export const metadata: Metadata = {
    title: 'Termeni și condiții',
    description: 'Termenii și condițiile de utilizare a platformei InvitOnline pentru invitații digitale.',
    alternates: { canonical: LEGAL_LINKS.terms },
}

const price = `${INVITATION_PRICE / 100} €`

export default function TermsPage() {
    return (
        <LegalPage title="Termeni și condiții">
            <div className={legalStyles.box}>
                <p style={{ margin: 0 }}>
                    Pe scurt: creezi gratuit invitația, iar activarea ei costă <strong>{price} per invitație</strong> (plată unică, {PRICE_NOTE.charAt(0).toLowerCase() + PRICE_NOTE.slice(1)}).
                    Invitația este un conținut/serviciu digital furnizat imediat după plată; dacă soliciți furnizarea imediată și iei la
                    cunoștință pierderea dreptului de retragere, nu mai poți exercita dreptul de retragere de 14 zile după activare.
                </p>
            </div>

            <h2>1. Cine suntem</h2>
            <p>
                Platforma InvitOnline, disponibilă la adresa invitonline.ro (denumită în continuare „Platforma”), este operată de:
            </p>
            <OperatorDetails />
            <p>
                denumită în continuare „Furnizorul”, „noi”. Ne poți contacta oricând la adresa de email de mai sus; nu oferim asistență telefonică.
            </p>

            <h2>2. Definiții și acceptarea termenilor</h2>
            <ul>
                <li><strong>Utilizator / Client</strong> – persoana care își creează cont pe Platformă și creează sau cumpără o invitație (de regulă organizatorul/gazda evenimentului).</li>
                <li><strong>Consumator</strong> – Clientul persoană fizică care acționează în scopuri din afara activității sale comerciale, industriale, de producție, artizanale sau liberale.</li>
                <li><strong>Invitat</strong> – persoana care primește link-ul invitației și, eventual, trimite o confirmare de participare (RSVP).</li>
                <li><strong>Invitație</strong> – pagina web personalizată creată de Client pe baza unui model (șablon) al Platformei, accesibilă printr-un link unic.</li>
            </ul>
            <p>
                Prin crearea unui cont și/sau prin plasarea unei comenzi confirmi că ai citit și accepți acești Termeni și condiții, precum și{' '}
                <Link href={LEGAL_LINKS.privacy}>Politica de confidențialitate</Link> și <Link href={LEGAL_LINKS.cookies}>Politica de cookies</Link>.
                Pentru a-ți crea cont și a cumpăra servicii trebuie să ai cel puțin 18 ani și capacitate deplină de exercițiu.
            </p>

            <h2>3. Descrierea serviciului</h2>
            <p>Platforma îți permite să:</p>
            <ul>
                <li>alegi un model de invitație digitală (ex. plic 3D, stil „Netflix”, boarding pass, vinyl, scratch card etc.) și să îl personalizezi cu textele, datele și locația evenimentului;</li>
                <li>încarci fotografii (max. 10 MB/fișier), muzică (max. 50 MB/fișier) și video (max. 100 MB/fișier) care apar în invitație;</li>
                <li>salvezi gratuit invitația ca ciornă (draft) în contul tău;</li>
                <li>după activarea contra cost: primești un link unic al invitației, pe care îl poți trimite oricâtor persoane, colectezi confirmările de participare ale invitaților (nume, email sau telefon, număr de persoane, mesaj), primești notificări pe email la fiecare răspuns și gestionezi lista de invitați din cont;</li>
                <li>modifici invitația oricând, fără cost suplimentar; modificările apar imediat la același link.</li>
            </ul>
            <p>
                Invitațiile activate rămân accesibile la link-ul lor cât timp contul tău și invitația există pe Platformă. Poți șterge oricând o
                invitație din cont; ștergerea elimină definitiv și lista de invitați asociată.
            </p>

            <h2>4. Contul de utilizator</h2>
            <p>
                Contul se creează cu adresa de email, o parolă și, opțional, numele. Ești responsabil pentru păstrarea confidențialității parolei
                și pentru activitatea din contul tău. Ne anunți imediat la {COMPANY.email} dacă suspectezi o utilizare neautorizată. Poți solicita
                oricând ștergerea contului prin email; unele date (ex. facturile) le păstrăm pe durata impusă de lege, conform{' '}
                <Link href={LEGAL_LINKS.privacy}>Politicii de confidențialitate</Link>.
            </p>

            <h2>5. Prețuri și plată</h2>
            <ul>
                <li>Crearea contului și a ciornelor este gratuită.</li>
                <li>Activarea unei invitații costă <strong>{price}</strong> (euro), plată unică pe invitație (eveniment), fără abonament și fără reînnoire automată. Numărul de invitați este nelimitat.</li>
                <li><strong>{PRICE_NOTE}.</strong> Prețul afișat este prețul total pe care îl plătești.</li>
                <li>Plata se face online, prin procesatorul de plăți Stripe (pagina securizată Stripe Checkout). Nu stocăm datele cardului tău; acestea sunt prelucrate direct de Stripe. Eventualele comisioane de conversie valutară percepute de banca ta nu sunt controlate de noi.</li>
                <li>Contractul se încheie în momentul confirmării plății; invitația se activează automat imediat după confirmare.</li>
                <li>Ne rezervăm dreptul de a modifica prețurile pentru comenzile viitoare; prețul unei comenzi deja plătite nu se modifică.</li>
            </ul>

            <h2>6. Facturare</h2>
            <p>
                Pentru fiecare plată emitem automat o factură fiscală prin serviciul de facturare Oblio, pe baza datelor de facturare introduse de tine
                în pagina de plată Stripe (nume sau denumire firmă, adresă, cod fiscal – dacă este cazul). Factura se transmite în sistemul național
                RO e-Factura atunci când legea o cere și îți este trimisă pe email (link de descărcare). Furnizorul nu este plătitor de TVA,
                astfel încât factura nu conține TVA. Ești responsabil pentru corectitudinea datelor de facturare introduse.
            </p>

            <h2>7. Dreptul de retragere (consumatori)</h2>
            <p>
                Potrivit OUG nr. 34/2014, în calitate de consumator ai, în principiu, dreptul de a te retrage din contractul încheiat la distanță în termen de
                14 zile, fără a invoca vreun motiv. Invitația activată este un conținut digital care nu este livrat pe un suport material, respectiv un
                serviciu digital prestat integral imediat după plată. Prin urmare, <strong>conform art. 16 lit. m) și lit. a) din OUG nr. 34/2014,
                nu mai beneficiezi de dreptul de retragere</strong> dacă, înainte de plată, ți-ai exprimat acordul expres pentru începerea imediată a
                furnizării și ai luat la cunoștință că îți pierzi astfel dreptul de retragere. Acest acord se exprimă prin bifarea căsuței dedicate
                înainte de plată și îl confirmăm în emailul de confirmare a plății.
            </p>
            <p>
                Dacă, în mod excepțional, dreptul de retragere se aplică (de exemplu, nu a început furnizarea), îl poți exercita trimițând o declarație
                neechivocă la {COMPANY.email} în termen de 14 zile de la încheierea contractului; rambursarea se face în cel mult 14 zile, prin aceeași
                metodă de plată.
            </p>

            <h2>8. Rambursări și reclamații</h2>
            <ul>
                <li>Dacă plata a fost încasată de două ori sau invitația nu a putut fi activată din cauze care ne sunt imputabile și nu remediem problema într-un termen rezonabil, rambursăm integral suma plătită.</li>
                <li>Pentru orice problemă (ex. invitația nu funcționează conform descrierii) ne scrii la {COMPANY.email}. Răspundem în cel mult 30 de zile, de regulă mult mai repede.</li>
                <li>Aceste prevederi nu îți limitează drepturile legale privind conformitatea conținutului și serviciilor digitale (OUG nr. 141/2021): dacă invitația nu este conformă, ai dreptul la aducerea în conformitate, la reducerea proporțională a prețului sau la încetarea contractului, în condițiile legii.</li>
            </ul>

            <h2>9. Conținutul încărcat de tine</h2>
            <ul>
                <li>Păstrezi toate drepturile asupra textelor, fotografiilor, muzicii și clipurilor pe care le încarci. Ne acorzi o licență neexclusivă, gratuită, limitată la durata stocării, de a găzdui, stoca, redimensiona/optimiza și afișa acest conținut, exclusiv pentru a-ți furniza serviciul (inclusiv afișarea invitației persoanelor care au link-ul).</li>
                <li>Garantezi că deții drepturile necesare (drepturi de autor, drepturi conexe – inclusiv pentru muzică –, dreptul la imagine) asupra conținutului încărcat și că ai acordul persoanelor care apar în fotografii sau video (pentru minori – acordul părinților/tutorilor).</li>
                <li>Invitația este accesibilă oricui are link-ul. Tu decizi cui trimiți link-ul; nu include în invitație informații pe care nu dorești să le faci cunoscute destinatarilor.</li>
                <li>Este interzis conținutul ilegal, defăimător, obscen, care incită la ură sau violență, care încalcă drepturile altor persoane sau care conține programe malițioase, precum și folosirea Platformei pentru spam, phishing sau alte scopuri frauduloase.</li>
                <li>Putem elimina conținutul vădit ilegal sau contrar acestor termeni și putem suspenda ori închide contul în caz de încălcare gravă sau repetată, cu notificarea ta, cu excepția cazurilor în care legea ne interzice notificarea. Poți contesta decizia la {COMPANY.email}. Poți semnala orice conținut ilegal la aceeași adresă.</li>
            </ul>

            <h2>10. Datele invitaților – acord de prelucrare (art. 28 GDPR)</h2>
            <p>
                Datele pe care invitații le trimit prin formularul de confirmare al invitației tale (nume, email sau telefon, număr de persoane, răspuns,
                mesaj) sunt colectate în numele tău. Pentru aceste date <strong>tu (organizatorul) ești operator</strong>, iar noi acționăm ca{' '}
                <strong>persoană împuternicită</strong>. În această calitate:
            </p>
            <ul>
                <li>prelucrăm datele invitaților doar pentru a-ți furniza serviciul (afișarea formularului, stocarea răspunsurilor, afișarea listei în contul tău, trimiterea notificărilor către tine și a emailului de confirmare către invitat) și doar conform instrucțiunilor tale documentate, date prin folosirea funcționalităților Platformei;</li>
                <li>asigurăm confidențialitatea datelor; persoanele care au acces la ele sunt obligate să păstreze confidențialitatea;</li>
                <li>aplicăm măsuri tehnice și organizatorice adecvate (conexiune criptată HTTPS, acces pe bază de autentificare, parole stocate criptat, acces restricționat la baza de date);</li>
                <li>folosim sub-împuterniciții enumerați în Politica de confidențialitate (găzduire, email, stocare media); ne dai prin prezenta autorizare generală pentru aceștia și te vom informa despre schimbări prin actualizarea Politicii de confidențialitate, putând obiecta la {COMPANY.email};</li>
                <li>te asistăm, în măsura posibilului, în soluționarea cererilor invitaților privind drepturile lor și în îndeplinirea obligațiilor de securitate și de notificare a încălcărilor; te notificăm fără întârzieri nejustificate despre o încălcare a securității datelor care te privește;</li>
                <li>la ștergerea invitației sau a contului, datele invitaților se șterg; nu păstrăm copii, cu excepția celor impuse de lege și a copiilor de siguranță care se suprascriu în timp;</li>
                <li>îți punem la dispoziție informațiile necesare pentru a demonstra respectarea acestor obligații.</li>
            </ul>
            <p>
                În calitate de operator, îți revine obligația de a avea un temei legal pentru prelucrare, de a informa invitații și de a nu solicita prin
                invitație date de care nu ai nevoie. Recomandăm să nu soliciți prin câmpul de mesaj date privind sănătatea (ex. alergii) decât dacă sunt
                strict necesare și să ștergi lista de invitați după eveniment.
            </p>

            <h2>11. Utilizare acceptabilă și disponibilitate</h2>
            <p>
                Nu ai voie să încerci să accesezi neautorizat Platforma, să îi perturbi funcționarea, să extragi automat date sau să ocolești măsurile de
                securitate. Depunem eforturi rezonabile pentru ca Platforma să fie disponibilă permanent, dar pot exista întreruperi pentru mentenanță
                sau din cauze independente de noi (ex. furnizori de infrastructură). Îți recomandăm să păstrezi o copie proprie a materialelor încărcate.
            </p>

            <h2>12. Proprietate intelectuală</h2>
            <p>
                Modelele de invitații, designul, codul, textele și elementele grafice ale Platformei aparțin Furnizorului sau licențiatorilor săi.
                Poți folosi modelele doar prin intermediul Platformei, pentru invitațiile tale; nu le poți copia, revinde sau reproduce în afara ei.
            </p>

            <h2>13. Răspundere</h2>
            <p>
                Răspundem pentru furnizarea serviciului conform descrierii și legii. Nu răspundem pentru conținutul încărcat de utilizatori, pentru
                modul în care organizatorul folosește datele invitaților sau pentru întreruperi cauzate de forța majoră ori de furnizori terți,
                în limitele permise de lege. Pentru Clienții care nu sunt consumatori, răspunderea noastră totală este limitată la suma plătită pentru
                invitația în cauză. Nicio prevedere a acestor termeni nu exclude sau limitează răspunderea noastră pentru prejudiciile cauzate cu
                intenție sau din culpă gravă, pentru vătămarea vieții, integrității corporale sau sănătății și nici drepturile pe care legea le
                acordă consumatorilor.
            </p>

            <h2>14. Date personale și cookies</h2>
            <p>
                Prelucrarea datelor tale personale este descrisă în <Link href={LEGAL_LINKS.privacy}>Politica de confidențialitate</Link>, iar folosirea
                cookies în <Link href={LEGAL_LINKS.cookies}>Politica de cookies</Link>.
            </p>

            <h2>15. Legea aplicabilă și soluționarea litigiilor</h2>
            <p>
                Acești termeni sunt guvernați de legea română. Încercăm să soluționăm amiabil orice nemulțumire – scrie-ne la {COMPANY.email}.
                În lipsa unei înțelegeri, litigiile se soluționează de instanțele române competente; dacă ești consumator, poți sesiza și instanța de la
                domiciliul tău, iar protecția oferită de legislația obligatorie a statului tău de reședință nu este afectată.
            </p>
            <p>
                Consumatorii se pot adresa Autorității Naționale pentru Protecția Consumatorilor (<a href={ANPC_URL} target="_blank" rel="noopener noreferrer">ANPC</a>)
                și pot apela la procedurile de soluționare alternativă a litigiilor (SAL), conform OG nr. 38/2015 – detalii la{' '}
                <a href={ANPC_SAL_URL} target="_blank" rel="noopener noreferrer">anpc.ro/ce-este-sal</a>.
            </p>

            <h2>16. Modificarea termenilor</h2>
            <p>
                Putem actualiza acești termeni (de exemplu la schimbarea serviciului sau a legislației). Versiunea în vigoare și data de la care se aplică
                sunt afișate la începutul paginii. Modificările nu afectează comenzile deja plătite; pentru modificări importante te informăm prin email
                sau pe Platformă înainte de intrarea lor în vigoare. Continuarea utilizării după această dată înseamnă acceptarea noii versiuni; dacă nu
                ești de acord, poți înceta oricând utilizarea și poți solicita ștergerea contului.
            </p>
            <p>Versiunea curentă este în vigoare de la {LEGAL_EFFECTIVE_DATE}.</p>
        </LegalPage>
    )
}
