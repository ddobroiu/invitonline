import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPage, { legalStyles } from '@/components/legal/LegalPage'
import OperatorDetails from '@/components/legal/OperatorDetails'
import { ANSPDCP_URL, COMPANY, LEGAL_LINKS } from '@/config/legal'

export const metadata: Metadata = {
    title: 'Politica de confidențialitate',
    description: 'Cum prelucrează InvitOnline datele personale ale utilizatorilor și ale invitaților.',
    alternates: { canonical: LEGAL_LINKS.privacy },
}

export default function PrivacyPage() {
    return (
        <LegalPage title="Politica de confidențialitate">
            <p>
                Această politică explică, conform art. 13 și 14 din Regulamentul (UE) 2016/679 (GDPR), ce date personale prelucrăm atunci când
                folosești InvitOnline, în ce scop, pe ce temei, cui le transmitem, cât timp le păstrăm și ce drepturi ai.
            </p>

            <h2>1. Operatorul</h2>
            <OperatorDetails />
            <p>
                Nu am numit un responsabil cu protecția datelor (DPO). Pentru orice întrebare sau cerere privind datele personale ne scrii la{' '}
                <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
            </p>

            <h2>2. Rolurile noastre: operator și persoană împuternicită</h2>
            <ul>
                <li><strong>Pentru datele utilizatorilor</strong> (organizatorii care își fac cont și cumpără invitații) și pentru datele vizitatorilor site-ului, suntem <strong>operator</strong>.</li>
                <li>
                    <strong>Pentru datele invitaților</strong> (persoanele care deschid o invitație și trimit o confirmare de participare), <strong>operatorul
                    este organizatorul evenimentului</strong> care a creat invitația, iar noi acționăm ca <strong>persoană împuternicită</strong> (art. 28 GDPR),
                    prelucrând aceste date doar pentru a-i furniza organizatorului serviciul. Dacă ești invitat și vrei să îți exerciți drepturile,
                    adresează-te în primul rând organizatorului; îl vom sprijini, iar dacă ne scrii direct, îi transmitem cererea.
                </li>
                <li>Pentru securitatea Platformei, prevenirea abuzurilor și obligațiile legale proprii rămânem operator independent.</li>
            </ul>

            <h2>3. Ce date prelucrăm, în ce scop și pe ce temei</h2>
            <div className={legalStyles.tableWrap}>
                <table>
                    <thead>
                        <tr><th>Date</th><th>Scop</th><th>Temei legal</th></tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Cont: email, parolă (stocată doar criptat/hash), nume (opțional), data acceptării termenilor</td>
                            <td>Crearea și administrarea contului, autentificare, emailuri legate de cont</td>
                            <td>Art. 6 alin. (1) lit. b) – executarea contractului</td>
                        </tr>
                        <tr>
                            <td>Intrarea cu Google („Continuă cu Google”), doar dacă o alegi: de la Google Ireland Ltd. primim adresa de email și confirmarea că Google a verificat-o, numele, fotografia de profil și identificatorul contului Google. Nu primim parola Google și nu avem acces la alte date din contul Google</td>
                            <td>Crearea contului sau intrarea în cont fără parolă; dacă există deja un cont InvitOnline cu aceeași adresă de email (verificată de Google), îl legăm de contul Google, ca să intri în același cont</td>
                            <td>Art. 6 alin. (1) lit. b) – executarea contractului (crearea și accesul la cont, la cererea ta)</td>
                        </tr>
                        <tr>
                            <td>Conținutul invitației: tipul și titlul evenimentului, data, locația, mesaje, nume (ex. miri, părinți, copilul botezat), fotografii, muzică, video încărcate</td>
                            <td>Crearea, găzduirea și afișarea invitației persoanelor care au link-ul</td>
                            <td>Art. 6 alin. (1) lit. b) – contract (pentru datele terților incluse în invitație, organizatorul răspunde de temeiul legal)</td>
                        </tr>
                        <tr>
                            <td>Plăți și facturare: nume/denumire, adresă de facturare, cod fiscal (dacă e cazul), email, sumă, monedă, identificatorul plății; datele cardului sunt prelucrate exclusiv de Stripe</td>
                            <td>Încasarea plății, emiterea și transmiterea facturii (inclusiv RO e-Factura), evidența contabilă</td>
                            <td>Art. 6 alin. (1) lit. b) – contract; art. 6 alin. (1) lit. c) – obligații legale (Legea contabilității nr. 82/1991, Codul fiscal)</td>
                        </tr>
                        <tr>
                            <td>Date de facturare salvate opțional în cont (denumire firmă, CUI, Reg. Com., adresă, bancă, IBAN); verificarea CUI în baza de date publică ANAF</td>
                            <td>Precompletarea datelor de facturare</td>
                            <td>Art. 6 alin. (1) lit. b) – contract</td>
                        </tr>
                        <tr>
                            <td>Dovada consimțământului la plată (data, versiunea termenilor, renunțarea la dreptul de retragere)</td>
                            <td>Dovedirea respectării OUG 34/2014</td>
                            <td>Art. 6 alin. (1) lit. c) – obligație legală și lit. f) – interes legitim (apărarea în caz de litigiu)</td>
                        </tr>
                        <tr>
                            <td>Mesajele trimise nouă pe email</td>
                            <td>Răspuns la solicitări, suport, reclamații</td>
                            <td>Art. 6 alin. (1) lit. b) – contract / demersuri precontractuale; lit. f) – interes legitim</td>
                        </tr>
                        <tr>
                            <td>Emailuri cu sfaturi despre contul și invitațiile tale (titularii de cont): emailul, numele, data creării contului, starea invitațiilor (ciornă / activată, tipul, titlul, data, locația), data plății, numărul de răspunsuri RSVP (doar cifre), jurnalul emailurilor trimise și al dezabonărilor</td>
                            <td>Pași de început, amintirea unei ciorne neactivate, sfaturi după activare, rezumatul confirmărilor înainte de eveniment, un singur email de revenire după o perioadă lungă de inactivitate; cel mult unul la 48 de ore. Invitații care răspund la o invitație nu primesc astfel de emailuri</td>
                            <td>Art. 6 alin. (1) lit. f) – interes legitim, cu art. 12 alin. (2) din Legea nr. 506/2004 (servicii similare, pentru clienții care și-au făcut cont): poți refuza gratuit la crearea contului (bifa „Nu vreau emailuri cu sfaturi și noutăți”) și oricând, cu un click, din linkul de dezabonare din fiecare email. Conturilor create cu Google, unde această alegere nu s-a putut face, nu le trimitem astfel de emailuri (doar emailul de bun venit)</td>
                        </tr>
                        <tr>
                            <td>Date tehnice: adresă IP, tip de browser, jurnale de server, cookies strict necesare de sesiune și securitate</td>
                            <td>Funcționarea și securitatea Platformei, prevenirea fraudelor și abuzurilor, diagnosticarea erorilor</td>
                            <td>Art. 6 alin. (1) lit. f) – interes legitim (securitate); art. 4 alin. (5^1) din Legea nr. 506/2004 pentru cookies strict necesare</td>
                        </tr>
                        <tr>
                            <td>Statistici de trafic: identificator pseudonim de vizitator și de sesiune, pagini vizitate, sursa vizitei (referrer, parametri UTM), lățimea ecranului; legătura cu plata (identificatorul vizitatorului transmis în metadatele plății Stripe)</td>
                            <td>Măsurarea audienței și a eficienței surselor de trafic</td>
                            <td>Art. 6 alin. (1) lit. a) – consimțământ (cookies analitice), pe care îl poți retrage oricând din „Setări cookies”</td>
                        </tr>
                        <tr>
                            <td>Date de marketing: identificatori pseudonimi TikTok (cookie-urile _ttp și tt_ttclid), pagini vizitate, evenimente (ex. inițierea plății, plata finalizată – valoare, monedă, identificatorul comenzii), adresă IP și browser; la o plată confirmată, trimise de pe serverul nostru (TikTok Events API), și emailul, telefonul și identificatorul contului, criptate ireversibil (SHA-256)</td>
                            <td>Măsurarea eficienței reclamelor și afișarea de reclame relevante (retargeting)</td>
                            <td>Art. 6 alin. (1) lit. a) – consimțământ (cookies de marketing), pe care îl poți retrage oricând din „Setări cookies”</td>
                        </tr>
                        <tr>
                            <td><strong>Date ale invitaților</strong> (în calitate de împuternicit): nume, email sau telefon, răspuns (particip / nu particip), număr de persoane, mesaj opțional pentru gazde</td>
                            <td>Colectarea confirmărilor pentru organizator, afișarea listei în contul lui, notificarea organizatorului pe email și trimiterea unui email de confirmare invitatului (dacă a indicat o adresă de email)</td>
                            <td>Temeiul este stabilit de organizator (operator), de regulă interesul legitim de a organiza evenimentul sau demersurile solicitate de invitat; noi prelucrăm conform art. 28 GDPR</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p>
                <strong>Date sensibile.</strong> Nu solicităm date privind sănătatea sau alte categorii speciale de date (art. 9 GDPR). Câmpul „Mesaj
                pentru gazde” este liber; te rugăm să nu incluzi în el informații despre sănătate (ex. alergii, afecțiuni) decât dacă sunt strict
                necesare organizatorului și accepți ca acesta să le primească. Organizatorii nu ar trebui să ceară astfel de informații prin invitație.
            </p>
            <p>
                <strong>Copii.</strong> Serviciul se adresează persoanelor de peste 18 ani. Invitațiile pot conține date despre copii (ex. la botez) doar
                dacă sunt introduse de părinți/tutori sau cu acordul acestora; organizatorul răspunde de acest lucru.
            </p>
            <p>
                Nu luăm decizii bazate exclusiv pe prelucrare automată, inclusiv crearea de profiluri, care să producă efecte juridice asupra ta sau
                să te afecteze în mod similar.
            </p>

            <h2>4. Este obligatoriu să ne furnizezi datele?</h2>
            <p>
                Emailul și parola (sau, la alegere, intrarea cu Google) sunt necesare pentru crearea contului; datele de facturare sunt necesare pentru emiterea facturii (obligație legală);
                fără ele nu îți putem furniza serviciul. Numele, datele de facturare salvate în cont și consimțământul pentru cookies analitice și de marketing sunt
                opționale. Pentru invitați, numele și un mod de contact sunt cerute de formular pentru ca organizatorul să poată identifica răspunsul.
            </p>

            <h2>5. Cui transmitem datele</h2>
            <p>Nu vindem datele personale. Le transmitem doar furnizorilor necesari serviciului (persoane împuternicite) și autorităților, când legea o cere:</p>
            <div className={legalStyles.tableWrap}>
                <table>
                    <thead>
                        <tr><th>Destinatar</th><th>Rol / date</th><th>Localizare și garanții</th></tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Hetzner Online GmbH</td>
                            <td>Găzduirea aplicației și a bazei de date (toate datele stocate)</td>
                            <td>Centre de date în Germania / Finlanda (UE)</td>
                        </tr>
                        <tr>
                            <td>Stripe Payments Europe Ltd. (și Stripe, Inc.)</td>
                            <td>Procesarea plăților; colectarea datelor de facturare; prevenirea fraudei (Stripe acționează parțial ca operator independent)</td>
                            <td>Irlanda (UE); transferuri către SUA în baza EU-US Data Privacy Framework și a clauzelor contractuale standard (SCC)</td>
                        </tr>
                        <tr>
                            <td>Oblio Software S.R.L.</td>
                            <td>Emiterea facturilor și transmiterea lor în RO e-Factura</td>
                            <td>România (UE)</td>
                        </tr>
                        <tr>
                            <td>ANAF</td>
                            <td>Sistemul RO e-Factura (facturi); interogarea bazei publice de date a contribuabililor la introducerea unui CUI</td>
                            <td>România – autoritate publică, în baza obligațiilor legale</td>
                        </tr>
                        <tr>
                            <td>Resend (Plus Five Five, Inc.)</td>
                            <td>Trimiterea emailurilor tranzacționale (bun venit, confirmare plată și factură, notificări RSVP către organizator, confirmare către invitat) și a emailurilor cu sfaturi către titularii de cont</td>
                            <td>SUA – EU-US Data Privacy Framework și/sau clauze contractuale standard</td>
                        </tr>
                        <tr>
                            <td>Cloudinary Ltd.</td>
                            <td>Stocarea, optimizarea și livrarea fotografiilor, muzicii și clipurilor încărcate în invitații</td>
                            <td>Infrastructură în afara SEE (SUA / Israel) – clauze contractuale standard; Israel beneficiază de decizie de adecvare</td>
                        </tr>
                        <tr>
                            <td>Google (Google Ireland Ltd. / Google LLC)</td>
                            <td>Completarea automată a locației evenimentului (Google Maps Places) în editorul de invitații; Google primește textul căutat și adresa IP</td>
                            <td>Irlanda / SUA – EU-US Data Privacy Framework și clauze contractuale standard</td>
                        </tr>
                        <tr>
                            <td>Google Ireland Ltd. (Sign in with Google)</td>
                            <td>Autentificarea cu contul Google, doar dacă alegi „Continuă cu Google”: Google află că intri în InvitOnline și ne transmite datele de profil de mai sus. Google acționează ca operator independent pentru contul tău Google (vezi politica de confidențialitate Google)</td>
                            <td>Irlanda / SUA – EU-US Data Privacy Framework și clauze contractuale standard</td>
                        </tr>
                        <tr>
                            <td>mydashboard.ro (operat de aceeași societate)</td>
                            <td>Statistici interne de trafic (doar cu consimțământ) și alerte tehnice de funcționare</td>
                            <td>Serviciu intern, găzduit în UE</td>
                        </tr>
                        <tr>
                            <td>Google Ireland Ltd. (Google Analytics 4)</td>
                            <td>Statistici agregate de trafic (doar cu consimțământ pentru cookies analitice), cu adresa IP anonimizată</td>
                            <td>Irlanda / SUA – EU-US Data Privacy Framework și clauze contractuale standard</td>
                        </tr>
                        <tr>
                            <td>TikTok Technology Limited (TikTok Pixel)</td>
                            <td>Măsurarea eficienței reclamelor și retargeting, inclusiv plățile confirmate trimise de pe serverul nostru (TikTok Events API), cu emailul, telefonul și identificatorul contului criptate SHA-256 (doar cu consimțământ pentru cookies de marketing)</td>
                            <td>Irlanda; posibile transferuri în afara UE – clauze contractuale standard</td>
                        </tr>
                        <tr>
                            <td>Contabil / auditori, avocați, autorități și instanțe</td>
                            <td>Îndeplinirea obligațiilor legale, apărarea drepturilor</td>
                            <td>România</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p>
                <strong>Organizatorul evenimentului</strong> vede în contul său și primește pe email răspunsurile invitaților. Invitația (inclusiv
                fotografiile, numele și locația) poate fi văzută de oricine are link-ul ei.
            </p>

            <h2>6. Transferuri în afara SEE</h2>
            <p>
                Unii furnizori (Stripe, Resend, Cloudinary, Google) pot prelucra date în SUA sau în alte țări din afara Spațiului Economic European.
                Aceste transferuri au loc doar cu garanții adecvate: decizia de adecvare a Comisiei Europene privind EU-US Data Privacy Framework
                (pentru furnizorii certificați), decizii de adecvare pentru alte state sau clauzele contractuale standard adoptate de Comisia Europeană.
                Poți solicita o copie a garanțiilor la {COMPANY.email}.
            </p>

            <h2>7. Cât timp păstrăm datele</h2>
            <ul>
                <li><strong>Contul și invitațiile</strong>: cât timp contul este activ; la cererea de ștergere a contului le ștergem în cel mult 30 de zile.</li>
                <li><strong>Datele invitaților</strong>: până când organizatorul le șterge (individual, prin ștergerea invitației sau a contului). Recomandăm organizatorilor să le șteargă după eveniment.</li>
                <li><strong>Fișierele media</strong>: până la ștergerea invitației sau a contului; copiile din infrastructura furnizorilor se elimină conform ciclurilor lor tehnice.</li>
                <li><strong>Facturi și documente financiar-contabile</strong> (inclusiv evidența comenzilor): 10 ani de la încheierea exercițiului financiar, conform Legii nr. 82/1991.</li>
                <li><strong>Dovada consimțământului la plată</strong>: împreună cu comanda, pe durata termenului de prescripție și a păstrării documentelor contabile.</li>
                <li><strong>Jurnalul emailurilor automate</strong>: cât timp contul este activ. <strong>Lista adreselor dezabonate</strong>: cât timp e nevoie ca să-ți respectăm alegerea (ca să nu primești din nou emailuri dacă îți refaci contul).</li>
                <li><strong>Emailurile de suport</strong>: până la 3 ani de la ultima corespondență, cu excepția celor necesare pentru apărarea unui drept.</li>
                <li><strong>Jurnale tehnice (loguri)</strong>: de regulă până la 90 de zile, dacă nu sunt necesare pentru investigarea unui incident.</li>
                <li><strong>Statistici de trafic</strong>: identificatorul de vizitator expiră după 12 luni; datele statistice pot fi păstrate agregat.</li>
            </ul>

            <h2>8. Drepturile tale</h2>
            <p>În condițiile GDPR, ai următoarele drepturi:</p>
            <ul>
                <li>dreptul de <strong>acces</strong> la date și de a primi o copie a lor;</li>
                <li>dreptul la <strong>rectificare</strong> a datelor inexacte;</li>
                <li>dreptul la <strong>ștergere</strong> („dreptul de a fi uitat”), cu excepția datelor pe care legea ne obligă să le păstrăm;</li>
                <li>dreptul la <strong>restricționarea</strong> prelucrării;</li>
                <li>dreptul la <strong>portabilitatea</strong> datelor furnizate de tine, într-un format structurat;</li>
                <li>dreptul de <strong>opoziție</strong> față de prelucrările bazate pe interesul legitim și, oricând și fără justificare, față de emailurile cu sfaturi și noutăți (linkul de dezabonare din fiecare email);</li>
                <li>dreptul de a-ți <strong>retrage consimțământul</strong> oricând (ex. din „Setări cookies”), fără a afecta legalitatea prelucrării anterioare;</li>
                <li>dreptul de a nu face obiectul unei decizii bazate <strong>exclusiv pe prelucrare automată</strong>.</li>
            </ul>
            <p>
                Cererile se trimit la <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>. Răspundem în cel mult o lună (termen care poate fi
                prelungit cu încă două luni pentru cereri complexe, cu informarea ta). Putem cere informații suplimentare pentru a-ți confirma identitatea.
            </p>
            <p>
                Ai dreptul să depui o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP),
                B-dul G-ral. Gheorghe Magheru nr. 28-30, sector 1, București, <a href={ANSPDCP_URL} target="_blank" rel="noopener noreferrer">www.dataprotection.ro</a>.
            </p>

            <h2>9. Securitate</h2>
            <p>
                Folosim conexiuni criptate (HTTPS), stocăm parolele doar sub formă de hash (bcrypt), restricționăm accesul la baza de date și la
                conturile furnizorilor și limităm accesul la date la persoanele care au nevoie de el. Nicio metodă de transmitere sau stocare nu este
                complet sigură; în cazul unei încălcări a securității care prezintă risc, vom notifica ANSPDCP și, după caz, persoanele vizate, conform legii.
            </p>

            <h2>10. Cookies</h2>
            <p>
                Cookies analitice și de marketing (ex. TikTok Pixel) se folosesc doar cu consimțământul tău, pe care îl poți retrage oricând din „Setări cookies”.
                Detalii despre cookies și tehnologiile similare găsești în <Link href={LEGAL_LINKS.cookies}>Politica de cookies</Link>.
            </p>

            <h2>11. Modificări</h2>
            <p>
                Putem actualiza această politică; versiunea și data intrării în vigoare sunt afișate la începutul paginii. Pentru modificări importante
                te informăm pe Platformă sau prin email.
            </p>
        </LegalPage>
    )
}
