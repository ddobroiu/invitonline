// Transactional e-mails (Romanian). All user values are escaped. Sent through lib/resend.ts.
import { COMPANY, PRICE_NOTE } from '@/config/legal'
import { escapeHtml } from '@/lib/utils'

const GOLD = '#b8962e'

export function emailLayout(title: string, body: string): string {
    return `<!doctype html><html lang="ro"><body style="margin:0;padding:0;background:#f5f2ec;">
<div style="max-width:560px;margin:0 auto;padding:28px 18px;font-family:Arial,Helvetica,sans-serif;color:#2b2b2b;line-height:1.55;">
  <div style="font-family:Georgia,serif;font-size:22px;color:#111;margin-bottom:18px;">InvitOnline</div>
  <div style="background:#ffffff;border-radius:14px;padding:26px 22px;border:1px solid #eee4d3;">
    <h1 style="font-family:Georgia,serif;font-size:22px;margin:0 0 14px;color:#111;">${escapeHtml(title)}</h1>
    ${body}
  </div>
  <p style="font-size:12px;color:#8a8375;margin-top:18px;">InvitOnline este operat de ${escapeHtml(COMPANY.name)}, CUI ${escapeHtml(COMPANY.cui)}. Întrebări: <a href="mailto:${COMPANY.email}" style="color:${GOLD};">${COMPANY.email}</a></p>
</div></body></html>`
}

export function button(href: string, label: string): string {
    return `<p style="margin:22px 0;"><a href="${escapeHtml(href)}" style="display:inline-block;background:#111;color:#fff;padding:12px 22px;border-radius:10px;text-decoration:none;font-weight:bold;">${escapeHtml(label)}</a></p>`
}

export function loginLinkEmail(link: string): { subject: string; html: string } {
    return {
        subject: 'Linkul tău de intrare în InvitOnline',
        html: emailLayout('Intră în cont', `
            <p>Ai cerut un link de intrare în InvitOnline. Apasă butonul de mai jos (linkul e valabil 30 de minute și merge o singură dată):</p>
            ${button(link, 'Intră în cont')}
            <p style="font-size:13px;color:#666;">Dacă nu ai cerut tu acest link, ignoră mesajul: fără el nu se poate intra în cont.</p>
            <p style="font-size:12px;color:#999;word-break:break-all;">${escapeHtml(link)}</p>`),
    }
}

export function resetPasswordEmail(link: string): { subject: string; html: string } {
    return {
        subject: 'Resetarea parolei InvitOnline',
        html: emailLayout('Setează o parolă nouă', `
            <p>Am primit o cerere de resetare a parolei pentru contul tău. Linkul e valabil 60 de minute și merge o singură dată:</p>
            ${button(link, 'Setează parola nouă')}
            <p style="font-size:13px;color:#666;">Dacă nu ai cerut tu resetarea, ignoră mesajul: parola rămâne neschimbată.</p>`),
    }
}

export function paymentConfirmationEmail(input: {
    name: string
    title: string
    inviteUrl: string
    qrUrl?: string | null
    invoiceUrl?: string | null
    termsVersion: string
    termsUrl: string
    dashboardUrl: string
    amountLabel: string
}): { subject: string; html: string } {
    const wa = `https://wa.me/?text=${encodeURIComponent(`Ești invitat: ${input.title}! Deschide invitația și confirmă prezența aici: ${input.inviteUrl}`)}`
    return {
        subject: 'Plata a fost confirmată: invitația ta este activă',
        html: emailLayout('Invitația ta este activă', `
            <p>Bună, ${escapeHtml(input.name || 'și mulțumim')}!</p>
            <p>Am primit plata (${escapeHtml(input.amountLabel)}) și invitația „<strong>${escapeHtml(input.title)}</strong>” este publicată. O poți trimite oaspeților:</p>
            <p style="background:#faf6ea;border-left:4px solid ${GOLD};padding:12px 14px;border-radius:8px;word-break:break-all;"><a href="${escapeHtml(input.inviteUrl)}" style="color:#111;">${escapeHtml(input.inviteUrl)}</a></p>
            ${button(input.inviteUrl, 'Deschide invitația')}
            <p><a href="${escapeHtml(wa)}" style="color:#128c7e;font-weight:bold;">Trimite pe WhatsApp</a> · <a href="${escapeHtml(input.dashboardUrl)}" style="color:${GOLD};font-weight:bold;">Confirmările în contul tău</a></p>
            ${input.qrUrl ? `<p style="margin-top:18px;">Codul QR al invitației (îl poți tipări pe plicuri sau afișa la eveniment):</p><img src="${escapeHtml(input.qrUrl)}" width="180" height="180" alt="Cod QR invitație" style="display:block;border:1px solid #eee;border-radius:8px;" />` : ''}
            ${input.invoiceUrl ? `<p style="margin-top:18px;">Factura fiscală: <a href="${escapeHtml(input.invoiceUrl)}" style="color:${GOLD};font-weight:bold;">descarcă factura (PDF)</a></p>` : '<p style="margin-top:18px;font-size:13px;color:#666;">Factura fiscală o găsești în contul tău, la „Facturare”, imediat ce este emisă.</p>'}
            <p style="font-size:12px;color:#777;margin-top:20px;">Înainte de plată ai fost de acord cu Termenii și condițiile (versiunea ${escapeHtml(input.termsVersion)}) și ai cerut furnizarea imediată a serviciului digital, luând la cunoștință că, odată cu începerea executării, îți pierzi dreptul de retragere de 14 zile (OUG 34/2014, art. 16 lit. a și m). Termenii: <a href="${escapeHtml(input.termsUrl)}" style="color:${GOLD};">${escapeHtml(input.termsUrl)}</a>. ${escapeHtml(PRICE_NOTE)}.</p>`),
    }
}
