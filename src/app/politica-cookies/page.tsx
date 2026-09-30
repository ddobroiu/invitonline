import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPage, { legalStyles } from '@/components/legal/LegalPage'
import CookieSettingsButton from '@/components/legal/CookieSettingsButton'
import { COMPANY, LEGAL_LINKS } from '@/config/legal'
import { CONSENT_COOKIE } from '@/lib/consent'

export const metadata: Metadata = {
    title: 'Politica de cookies',
    description: 'Ce cookies și tehnologii similare folosește InvitOnline și cum îți poți schimba opțiunile.',
    alternates: { canonical: LEGAL_LINKS.cookies },
}

export default function CookiesPage() {
    return (
        <LegalPage title="Politica de cookies">
            <p>
                Această politică explică ce cookies și tehnologii similare (ex. stocarea locală din browser – localStorage) folosește site-ul
                invitonline.ro, operat de {COMPANY.name}, conform Legii nr. 506/2004 și GDPR.
            </p>

            <h2>1. Ce sunt cookies</h2>
            <p>
                Cookies sunt fișiere mici pe care un site le salvează în browserul tău. Unele sunt strict necesare pentru funcționarea site-ului;
                altele (ex. analitice) se folosesc doar cu acordul tău.
            </p>

            <h2>2. Categorii</h2>
            <ul>
                <li><strong>Strict necesare</strong> – autentificare, securitate, memorarea alegerii tale privind cookies, salvarea ciornei invitației. Nu necesită consimțământ și nu pot fi dezactivate din banner.</li>
                <li><strong>Analitice</strong> – statistici de trafic prin serviciul intern mydashboard.ro și prin Google Analytics 4 (Google Ireland Limited). Se activează doar dacă îți dai acordul.</li>
                <li><strong>Marketing / reclame</strong> – TikTok Pixel (TikTok Technology Limited, Irlanda), pentru măsurarea eficienței reclamelor și afișarea de reclame relevante (retargeting). Se activează doar dacă îți dai acordul pentru această categorie. Tot numai cu acest acord (dat înainte de plată), după o plată confirmată serverul nostru trimite direct către TikTok (TikTok Events API) valoarea, moneda, identificatorul comenzii, emailul, telefonul și identificatorul contului criptate ireversibil (SHA-256), adresa IP, browserul și identificatorii _ttp și tt_ttclid, ca plata să poată fi atribuită reclamei; fără acord nu trimitem nimic.</li>
            </ul>

            <h2>3. Lista cookies și a elementelor stocate</h2>
            <div className={legalStyles.tableWrap}>
                <table>
                    <thead>
                        <tr><th>Nume</th><th>Tip</th><th>Categorie</th><th>Scop</th><th>Durată</th></tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>next-auth.session-token / __Secure-next-auth.session-token</td>
                            <td>Cookie first-party (HttpOnly)</td>
                            <td>Strict necesar</td>
                            <td>Menține autentificarea în cont</td>
                            <td>Până la deconectare, max. 30 de zile</td>
                        </tr>
                        <tr>
                            <td>next-auth.csrf-token / __Host-next-auth.csrf-token</td>
                            <td>Cookie first-party (HttpOnly)</td>
                            <td>Strict necesar</td>
                            <td>Protecție împotriva atacurilor CSRF la autentificare</td>
                            <td>Sesiune</td>
                        </tr>
                        <tr>
                            <td>next-auth.callback-url / __Secure-next-auth.callback-url</td>
                            <td>Cookie first-party</td>
                            <td>Strict necesar</td>
                            <td>Revenirea pe pagina corectă după autentificare</td>
                            <td>Sesiune</td>
                        </tr>
                        <tr>
                            <td>{CONSENT_COOKIE}</td>
                            <td>Cookie first-party</td>
                            <td>Strict necesar</td>
                            <td>Memorează alegerea ta privind cookies (categorii acceptate, data)</td>
                            <td>6 luni</td>
                        </tr>
                        <tr>
                            <td>eventDraft</td>
                            <td>localStorage</td>
                            <td>Strict necesar</td>
                            <td>Păstrează în browser ciorna invitației până o salvezi în cont</td>
                            <td>Până la salvare sau ștergerea datelor din browser</td>
                        </tr>
                        <tr>
                            <td>_md_vid</td>
                            <td>Cookie first-party + localStorage</td>
                            <td>Analitic</td>
                            <td>Identificator pseudonim de vizitator (mydashboard.ro): numărarea vizitatorilor unici și legarea vizitei de o plată</td>
                            <td>12 luni</td>
                        </tr>
                        <tr>
                            <td>_md_sid, _md_last</td>
                            <td>localStorage</td>
                            <td>Analitic</td>
                            <td>Identificator de sesiune și momentul ultimei activități (o vizită nouă începe după 30 de minute de inactivitate)</td>
                            <td>Până la ștergerea datelor din browser sau retragerea acordului</td>
                        </tr>
                        <tr>
                            <td>_ga</td>
                            <td>Cookie first-party (Google Analytics)</td>
                            <td>Analitic</td>
                            <td>Identificator pseudonim de vizitator, pentru statistici agregate de trafic (Google Analytics 4, cu IP anonimizat)</td>
                            <td>2 ani</td>
                        </tr>
                        <tr>
                            <td>_ga_*</td>
                            <td>Cookie first-party (Google Analytics)</td>
                            <td>Analitic</td>
                            <td>Păstrează starea sesiunii în Google Analytics 4</td>
                            <td>2 ani</td>
                        </tr>
                        <tr>
                            <td>_ttp</td>
                            <td>Cookie (TikTok Pixel – TikTok Technology Limited, Irlanda)</td>
                            <td>Marketing</td>
                            <td>Identificator pseudonim pentru măsurarea eficienței reclamelor TikTok și retargeting; datele pot fi transferate în afara UE (ex. în baza clauzelor contractuale standard)</td>
                            <td>~13 luni</td>
                        </tr>
                        <tr>
                            <td>_tt_enable_cookie</td>
                            <td>Cookie (TikTok Pixel – TikTok Technology Limited, Irlanda)</td>
                            <td>Marketing</td>
                            <td>Indică faptul că browserul acceptă cookies pentru TikTok Pixel (măsurarea reclamelor)</td>
                            <td>~13 luni</td>
                        </tr>
                        <tr>
                            <td>tt_ttclid</td>
                            <td>Cookie first-party (invitonline.ro)</td>
                            <td>Marketing</td>
                            <td>Identificatorul de click din linkul unei reclame TikTok (ttclid), trimis la TikTok după o plată confirmată, pentru atribuirea plății reclamei</td>
                            <td>30 de zile</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p>
                <strong>Servicii terțe.</strong> Plata se face pe pagina Stripe Checkout (checkout.stripe.com), unde Stripe poate folosi propriile cookies
                necesare pentru plată și prevenirea fraudei, conform politicii Stripe. În editorul de invitații, dacă este activă completarea automată a
                locației, se încarcă serviciul Google Maps, care primește adresa IP și textul căutat. Fișierele media din invitații sunt livrate de
                Cloudinary. Fonturile sunt găzduite pe serverele noastre.
            </p>

            <h2>4. Cum îți schimbi opțiunile</h2>
            <p>
                La prima vizită îți cerem acordul prin bannerul de cookies (Accept toate / Refuză / Setări). Poți schimba oricând alegerea din
                linkul „Setări cookies” din subsolul paginii sau de aici:
            </p>
            <p><CookieSettingsButton /></p>
            <p>
                Dacă retragi acordul pentru cookies analitice, oprim tracker-ul și Google Analytics și ștergem identificatorii _md_vid, _md_sid, _md_last, _ga și _ga_*. Dacă retragi acordul pentru cookies de marketing, oprim TikTok Pixel (revocarea consimțământului) și ștergem cookie-urile _ttp, _tt_enable_cookie și tt_ttclid. Poți, de asemenea,
                șterge sau bloca cookies din setările browserului; blocarea celor strict necesare poate împiedica autentificarea.
            </p>

            <h2>5. Mai multe informații</h2>
            <p>
                Detalii despre prelucrarea datelor personale găsești în <Link href={LEGAL_LINKS.privacy}>Politica de confidențialitate</Link>.
                Întrebări: <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
            </p>
        </LegalPage>
    )
}
