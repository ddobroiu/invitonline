// Autentificarea cu Google: ce au comun browserul si serverul. Fara importuri de server — ajunge si in browser.

/**
 * Cookie scurt pus in browser cand utilizatorul a bifat acordul cu Termenii inainte de „Continuă cu Google”.
 * Serverul creeaza un cont nou cu Google doar daca il gaseste (valoarea = versiunea Termenilor acceptati);
 * pentru conturile existente nu conteaza.
 */
export const GOOGLE_TERMS_COOKIE = 'io_google_terms'
export const GOOGLE_TERMS_COOKIE_MAX_AGE = 15 * 60

/** Codurile din /login?error=… (ale noastre si cele standard NextAuth) si mesajul afisat. */
export function googleErrorMessage(code: string | null): string {
    switch (code) {
        case null:
        case '':
            return ''
        case 'GoogleTerms':
            return 'Nu ai încă un cont cu această adresă. Ca să-l creezi cu Google, bifează acordul cu Termenii și condițiile, apoi apasă din nou „Continuă cu Google”.'
        case 'GoogleUnverified':
            return 'Adresa de e-mail a contului Google nu este verificată de Google. Verific-o în contul Google sau folosește e-mail și parolă.'
        case 'GoogleOtherAccount':
            return 'Contul InvitOnline cu această adresă este legat deja de alt cont Google. Intră cu acel cont Google sau cu e-mail și parolă.'
        case 'OAuthSignin':
        case 'OAuthCallback':
        case 'OAuthCreateAccount':
        case 'Callback':
        case 'AccessDenied':
        case 'Configuration':
        case 'Default':
            return 'Autentificarea cu Google nu a reușit. Încearcă din nou sau folosește e-mail și parolă.'
        default:
            return ''
    }
}
