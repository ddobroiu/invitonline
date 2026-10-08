# InvitOnline

Invitații digitale pentru nunți, botezuri, aniversări, petreceri și evenimente corporate. Colecția cuprinde 23 de modele, grupate pe tematici: călătorii, muzică, cinema, hârtie, interactive și elegante.

Editorul oferă previzualizare pe telefon și desktop, salvează invitațiile în PostgreSQL și permite modificarea lor după activare. Invitațiile active au link public, RSVP, hărți Google Maps/Waze, listă de invitați și export CSV. Fotografiile, muzica și videoclipurile sunt disponibile în modelele care le acceptă.

## Pornire locală

1. Instalează dependențele cu `npm install`.
2. Copiază `.env.example` în `.env.local` și configurează baza de date, secretul de autentificare și adresele site-ului.
3. Rulează `npm run dev` și deschide http://localhost:3000. Dacă folosești baza inclusă pe `127.0.0.1:54329`, comanda o pornește automat și aplică migrările înainte să pornească site-ul. Datele existente se păstrează în `.local-db`.
4. Pentru alt port, rulează `npm run dev -- --port 3015`. Adresa locală de autentificare se aliniază automat cu portul ales. Baza inclusă pornită de această comandă se închide odată cu site-ul; o bază deja pornită separat rămâne deschisă.

Stripe activează invitațiile după plata confirmată. Cloudinary gestionează fișierele, Resend trimite emailurile, iar Oblio emite facturile din datele colectate la plata Stripe. Google OAuth este opțional. Configurările sunt descrise în `.env.example`; fără configurarea unui serviciu, aplicația afișează un mesaj de indisponibilitate.

## Verificări

- `npm run typecheck` — verificarea tipurilor.
- `npm run lint -- --quiet` — erori ESLint.
- `npm run test:unit` — reguli pentru formulare și API.
- `npm run test:e2e` — cont, editor, acces, activare, RSVP, CSV și pagini responsive. Folosește baze de date temporare, cu serviciile externe dezactivate. Porturi implicite: 3016, 54330 și 54331.
- `node scripts/check-thematic.mjs http://localhost:3000` — verificarea modelelor și a interacțiunilor în browser.
- `node scripts/check-seo.mjs http://localhost:3000` — pagini SEO, canonical, sitemap, date structurate, imagini sociale și aspect responsive.
- `node --env-file=.env.local --import tsx scripts/audit-auth.ts` — verifică accesul la baza de date, coloanele și migrările lipsă, fără a afișa datele conturilor.
- `node --env-file=.env.local scripts/check-login.mjs http://localhost:3015` — verifică autentificarea pe baza locală inclusă cu un cont temporar, eliminat la final. Nu trimite emailuri.
- `node --env-file=.env.local --import tsx scripts/audit-payments.ts` — audit Stripe și probe webhook fără tranzacții: încasări activate, endpoint și semnături, sesiuni recente. Nu afișează chei sau date de clienți. Pe Node 24/Windows, folosește `node --use-system-ca` dacă mediul cere certificatele sistemului.
- `npm run build` — build de producție; `npm start` îl servește local.

Testele locale nu confirmă plățile, emailurile, încărcările sau facturile reale. Aceste integrări trebuie verificate în mediul configurat înainte de publicare.

Aplicația folosește Next.js 16, React 19, TypeScript, Prisma/PostgreSQL și CSS Modules. Fonturile sunt livrate local, cu licențele în `src/assets/fonts`.

Paginile publice pentru evenimente și tematici sunt definite în `src/config/invitation-landings.ts`. Sunt generate static, au conținut distinct, linkuri către modele și ghiduri, canonical propriu, BreadcrumbList/Service și imagini pentru distribuire. Sitemap-ul se actualizează din aceeași listă. Previzualizările modelelor se pot reface cu `node scripts/capture-models.mjs http://localhost:3000`.

## IndexNow (Bing / ChatGPT)
Cheia IndexNow e constanta `INDEXNOW_KEY` din `scripts/indexnow-submit.mjs` și e servită la `/<cheie>.txt` (fișierul din `public/`).
`node scripts/indexnow-submit.mjs` doar numără adresele din sitemap; `--days 3` păstrează doar cele schimbate recent (după `lastmod`); `--send` le trimite la api.indexnow.org (loturi de 10.000).
Rulează `--send` numai după deploy: scriptul verifică întâi că fișierul cheii e live pe site.
