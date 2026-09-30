import { Resend } from 'resend';
import { appendFileSync } from 'node:fs';
import { alerta } from './alerts';
import prisma from './prisma';

/** Linkurile de dezabonare ale unui e-mail: pagina din subsol si adresa pentru un click (RFC 8058). */
export type Unsubscribe = { pageUrl: string; oneClickUrl: string };

/**
 * Jurnalul in tabelul EmailLog. `id` = randul rezervat dinainte (e-mailurile din ciclul de viata, vezi
 * lib/lifecycle/send.ts); fara el se scrie un rand nou (e-mailurile tranzactionale care cer jurnal).
 */
export type EmailLogTarget = { id?: string; kind: string; userId?: string | null; eventId?: string | null };

export type SendEmailResult = { success: boolean; id: string | null; data?: unknown; error?: unknown };

// Local development / e2e tests: EMAIL_DEV_LOG=<file> writes every e-mail there (JSON lines) instead of
// sending it. Ignored in production.
function devLog(entry: {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
    headers?: Record<string, string>;
}): boolean {
    const file = process.env.EMAIL_DEV_LOG;
    if (!file || process.env.NODE_ENV === 'production') return false;
    try {
        appendFileSync(file, JSON.stringify({ ...entry, at: new Date().toISOString() }) + '\n');
    } catch (err) {
        console.error('[email] dev log failed:', err);
    }
    return true;
}

let resendClient: Resend | null = null;

function getResend() {
    if (!process.env.RESEND_API_KEY) return null;
    if (!resendClient) resendClient = new Resend(process.env.RESEND_API_KEY);
    return resendClient;
}

function errorText(error: unknown): string {
    if (!error) return 'necunoscut';
    if (error instanceof Error) return error.message;
    if (typeof error === 'object' && 'message' in error) {
        const e = error as { name?: unknown; message?: unknown };
        return `${e.name ? `${String(e.name)}: ` : ''}${String(e.message)}`;
    }
    return String(error);
}

/** Scrie rezultatul in EmailLog. Nu arunca: jurnalul nu blocheaza niciodata trimiterea. */
async function writeLog(to: string | string[], log: EmailLogTarget, result: SendEmailResult) {
    const email = (Array.isArray(to) ? to[0] : to)?.trim().toLowerCase();
    if (!email) return;
    const error = result.success ? null : errorText(result.error).slice(0, 500);
    try {
        if (log.id) {
            // o trimitere esuata isi elibereaza cheia unica, ca sa poata fi reincercata
            await prisma.emailLog.update({
                where: { id: log.id },
                data: result.success ? { resendId: result.id, error: null } : { error, dedupeKey: null },
            });
        } else {
            await prisma.emailLog.create({
                data: {
                    email,
                    kind: log.kind,
                    userId: log.userId ?? null,
                    eventId: log.eventId ?? null,
                    resendId: result.id,
                    error,
                },
            });
        }
    } catch (err) {
        console.error('[email] jurnalul EmailLog nu a putut fi scris:', err);
    }
}

export const sendEmail = async ({
    to,
    subject,
    html,
    text,
    replyTo,
    unsubscribe,
    log,
}: {
    to: string | string[];
    subject: string;
    html: string;
    /** Varianta text simplu (recomandata la e-mailurile de marketing). */
    text?: string;
    replyTo?: string;
    /** Antetele List-Unsubscribe + List-Unsubscribe-Post (un click, RFC 8058). */
    unsubscribe?: Unsubscribe;
    log?: EmailLogTarget;
}): Promise<SendEmailResult> => {
    const headers: Record<string, string> | undefined = unsubscribe
        ? {
              'List-Unsubscribe': `<${unsubscribe.oneClickUrl}>`,
              'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          }
        : undefined;

    const finish = async (result: SendEmailResult) => {
        if (log) await writeLog(to, log, result);
        return result;
    };

    if (devLog({ to, subject, html, ...(text && { text }), ...(headers && { headers }) })) {
        return finish({ success: true, id: null, data: null });
    }
    const resend = getResend();
    if (!resend) {
        console.warn(`[email] RESEND_API_KEY lipsește — emailul "${subject}" nu a fost trimis.`);
        return finish({ success: false, id: null, error: 'Email not configured' });
    }

    try {
        const data = await resend.emails.send({
            from: process.env.EMAIL_FROM || 'Invitatii Online <contact@invitonline.ro>',
            to,
            subject,
            html,
            ...(text && { text }),
            ...(replyTo && { replyTo }),
            ...(headers && { headers }),
        });
        // Resend nu arunca la un e-mail refuzat: intoarce { error }
        if (data.error) {
            console.error('Error sending email:', data.error);
            void alerta('error', 'resend', `InvitOnline: un e-mail nu a plecat: ${data.error.name}: ${data.error.message}`);
            return finish({ success: false, id: null, error: data.error });
        }

        return finish({ success: true, id: data.data?.id ?? null, data });
    } catch (error) {
        console.error('Error sending email:', error);
        void alerta('error', 'resend', `InvitOnline: un e-mail nu a plecat: ${error instanceof Error ? error.message : String(error)}`);
        return finish({ success: false, id: null, error });
    }
};
