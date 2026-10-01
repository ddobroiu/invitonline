// Textul de la inregistrare pentru e-mailurile cu sfaturi, intr-un singur loc: formularele il afiseaza.
// Fara importuri de server — ajunge si in browser.
//
// Temeiul: Legea 506/2004 art. 12 alin. (2) — clientului care isi face cont i se pot trimite mesaje despre
// servicii similare, daca e informat la colectare (randul de mai jos, sub formular, si pentru „Continuă cu
// Google”) si i se ofera, clar si gratuit, posibilitatea de a refuza in fiecare mesaj (linkul de dezabonare).
// GDPR art. 6 alin. (1) lit. f) + art. 21 alin. (2)-(3). Fara bifa de refuz: orice cont nou are acordul
// (marketingOptOut false, marketingChoiceAt = momentul crearii), atat cu parola, cat si cu Google.

export const SIGNUP_MARKETING_NOTICE =
    'Îți putem trimite ocazional sfaturi și noutăți; te poți dezabona din orice e-mail.'
