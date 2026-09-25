import { Resend } from 'resend';

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

        return { success: true, data };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
};
