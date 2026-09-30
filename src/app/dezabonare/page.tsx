import type { Metadata } from 'next'
import Link from 'next/link'
import { COMPANY } from '@/config/legal'
import styles from './page.module.css'

export const metadata: Metadata = {
    title: 'Dezabonare',
    robots: { index: false, follow: false },
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Pagina din linkul „Dezabonează-te” din e-mailuri. Nu dezaboneaza la simpla deschidere (scanerele de linkuri
 * deschid tot): cere un click pe buton — un formular obisnuit, fara JavaScript, catre /api/dezabonare.
 */
export default async function DezabonarePage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
    const params = await searchParams
    const id = typeof params.id === 'string' && UUID.test(params.id) ? params.id : null
    const done = params.gata === '1'
    const failed = params.eroare === '1'

    return (
        <section className={styles.wrap}>
            <div className={styles.card}>
                {done ? (
                    <>
                        <h1 className={styles.title}>Gata, te-ai dezabonat.</h1>
                        <p className={styles.text}>
                            Nu mai primești e-mailuri cu sfaturi și noutăți de la InvitOnline. Contul și invitațiile tale rămân neatinse;
                            vei primi doar mesajele strict necesare, precum confirmarea unei plăți sau notificarea unui răspuns nou la invitație.
                        </p>
                        <Link href="/" className={styles.back}>Înapoi la InvitOnline</Link>
                    </>
                ) : failed || !id ? (
                    <>
                        <h1 className={styles.title}>Linkul nu mai merge.</h1>
                        <p className={styles.text}>
                            Folosește linkul de dezabonare dintr-un e-mail primit de la noi sau scrie-ne la{' '}
                            <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> și te scoatem noi din listă.
                        </p>
                    </>
                ) : (
                    <>
                        <h1 className={styles.title}>Te dezabonezi?</h1>
                        <p className={styles.text}>
                            Nu vei mai primi e-mailuri cu sfaturi și noutăți de la InvitOnline. Contul și invitațiile tale rămân neatinse.
                        </p>
                        <form method="post" action="/api/dezabonare">
                            <input type="hidden" name="id" value={id} />
                            <input type="hidden" name="from" value="page" />
                            <button type="submit" className={styles.button}>Da, dezabonează-mă</button>
                        </form>
                        <Link href="/" className={styles.back}>M-am răzgândit</Link>
                    </>
                )}
            </div>
        </section>
    )
}
