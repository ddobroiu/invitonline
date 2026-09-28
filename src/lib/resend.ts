import { Resend } from 'resend';
import { alerta } from './alerts';

let resendClient: Resend | null = null;

function getResend() {
    if (!process.env.RESEND_API_KEY) return null;
    if (!resendClient) resendClient = new Resend(process.env.RESEND_API_KEY);
    return resendClient;
}

export const sendEmail = async ({
    to,
    subject,
    html,
}: {
    to: string | string[];
    subject: string;
    html: string;
}) => {
    const resend = getResend();
    if (!resend) {
        console.warn(`[email] RESEND_API_KEY lipsește — emailul "${subject}" nu a fost trimis.`);
        return { success: false, error: 'Email not configured' };
    }

    try {
        const data = await resend.emails.send({
            from: process.env.EMAIL_FROM || 'Invitatii Online <contact@invitonline.ro>',
            to,
            subject,
            html,
        });
        // Resend nu arunca la un e-mail refuzat: intoarce { error }
        if (data.error) {
            console.error('Error sending email:', data.error);
            void alerta('error', 'resend', `InvitOnline: un e-mail nu a plecat: ${data.error.name}: ${data.error.message}`);
            return { success: false, error: data.error };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error sending email:', error);
        void alerta('error', 'resend', `InvitOnline: un e-mail nu a plecat: ${error instanceof Error ? error.message : String(error)}`);
        return { success: false, error };
    }
};
