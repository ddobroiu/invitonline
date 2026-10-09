// Meta Conversions API (server side), mirroring lib/tiktok-events.ts:
// - Purchase after a confirmed payment (lib/fulfill.ts, next to sendTikTokPurchase), event_id = Stripe Checkout
//   session id, the same id the browser pixel (app/checkout/success/page.tsx) and TikTok use;
// - CompleteRegistration when an account is created (api/register, Google sign-up), event_id = reg_<userId>.
// Sent ONLY when the visitor had accepted marketing cookies (cookie_consent, lib/consent.ts). For purchases that
// choice, plus the _fbp / _fbc cookies, travels in the Stripe session metadata (metaCheckoutMetadata; IP and user
// agent are reused from TikTok's tt_ip / tt_ua keys). No consent -> nothing is stored or sent.
// Personal data is SHA-256 hashed (email trimmed + lowercased, phone as E.164 digits without '+', external_id = user id).
// Never throws, 8 s timeout; errors are logged without the token, token/permission errors are reported to mydashboard.
// Docs: https://developers.facebook.com/docs/marketing-api/conversions-api
// Server only: imported from lib/fulfill.ts, lib/auth-google.ts and app/api routes.
import { createHash } from "node:crypto";
import { alerta } from "@/lib/alerts";
import { getCookieValue, hasMarketingConsent } from "@/lib/consent";
import { toE164 } from "@/lib/tiktok-events";

const GRAPH_VERSION: string = "v21.0";
const DEFAULT_PIXEL_ID: string = "1647428873689235";
const ALERT_PREFIX: string = "InvitOnline";

// Stripe metadata keys (values max 500 chars). IP / UA: TikTok's keys, stored under the same consent.
const META = { consent: "fb_consent", fbp: "fb_fbp", fbc: "fb_fbc", ip: "tt_ip", ua: "tt_ua" } as const;

export function metaPixelId(): string {
  return process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID || DEFAULT_PIXEL_ID;
}

function clean(value: string | null | undefined, max: number): string | undefined {
  let v: string = (value ?? "").trim();
  try { v = decodeURIComponent(v); } catch { /* keep raw */ }
  return v ? v.slice(0, max) : undefined;
}

type HeaderReader = { get(name: string): string | null };

function ipFrom(headers: HeaderReader): string | undefined {
  const forwarded: string | undefined = headers.get("x-forwarded-for")?.split(",")[0];
  return clean(forwarded ?? headers.get("x-real-ip"), 64);
}

/** Marketing consent, _fbp, _fbc, IP and user agent of the current request (cookie header + proxy headers). */
export interface MetaVisitor {
  marketing: boolean;
  fbp?: string;
  fbc?: string;
  ip?: string;
  userAgent?: string;
}

export function metaVisitorFromHeaders(headers: HeaderReader): MetaVisitor {
  const cookieHeader: string | null = headers.get("cookie");
  if (!hasMarketingConsent(cookieHeader)) return { marketing: false };
  return {
    marketing: true,
    fbp: clean(getCookieValue(cookieHeader, "_fbp"), 200),
    fbc: clean(getCookieValue(cookieHeader, "_fbc"), 500),
    ip: ipFrom(headers),
    userAgent: clean(headers.get("user-agent"), 500),
  };
}

/**
 * Metadata to put on the Stripe Checkout session. Empty without marketing consent.
 * IP / user agent are not duplicated here: tiktokCheckoutMetadata already stores them (tt_ip / tt_ua).
 */
export function metaCheckoutMetadata(input: { marketing: boolean; fbp?: string | null; fbc?: string | null }): Record<string, string> {
  if (!input.marketing) return {};
  const meta: Record<string, string> = { [META.consent]: "1" };
  const fbp = clean(input.fbp, 200);
  const fbc = clean(input.fbc, 500);
  if (fbp) meta[META.fbp] = fbp;
  if (fbc) meta[META.fbc] = fbc;
  return meta;
}

export function metaConsentFromMetadata(metadata: Record<string, string> | null | undefined): boolean {
  return metadata?.[META.consent] === "1";
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/** Phone for Meta: E.164 digits without '+' (e.g. 40722123456); undefined when unusable. */
export function metaPhone(phone: string | null | undefined): string | undefined {
  return toE164(phone)?.slice(1);
}

export interface MetaEvent {
  eventName: string;
  eventId: string;
  eventTime?: number;
  eventSourceUrl?: string;
  email?: string | null;
  phone?: string | null;
  externalId?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  fbp?: string | null;
  fbc?: string | null;
  customData?: Record<string, unknown>;
}

/** The request body without the access token (exported for tests). */
export function buildMetaPayload(e: MetaEvent): Record<string, unknown> {
  const user: Record<string, unknown> = {};
  const email: string | undefined = e.email?.trim().toLowerCase();
  if (email) user.em = [sha256(email)];
  const phone: string | undefined = metaPhone(e.phone);
  if (phone) user.ph = [sha256(phone)];
  if (e.externalId) user.external_id = [sha256(String(e.externalId))];
  if (e.ip) user.client_ip_address = e.ip;
  if (e.userAgent) user.client_user_agent = e.userAgent;
  if (e.fbp) user.fbp = e.fbp;
  if (e.fbc) user.fbc = e.fbc;

  const event: Record<string, unknown> = {
    event_name: e.eventName,
    event_time: e.eventTime ?? Math.floor(Date.now() / 1000),
    event_id: e.eventId,
    action_source: "website",
    user_data: user,
  };
  if (e.eventSourceUrl) event.event_source_url = e.eventSourceUrl;
  if (e.customData && Object.keys(e.customData).length) event.custom_data = e.customData;

  const body: Record<string, unknown> = { data: [event] };
  const testCode: string | undefined = process.env.META_TEST_EVENT_CODE;
  if (testCode) body.test_event_code = testCode;
  return body;
}

function isAuthError(status: number, code: number | undefined, type: string, message: string): boolean {
  return status === 401 || status === 403 || code === 190 || code === 10 || code === 200 || (code === 100 && /pixel|dataset/i.test(message))
    || type === "OAuthException" || /access[ _-]?token|permission/i.test(message);
}

/**
 * Sends one event. No-op without META_CAPI_TOKEN or without marketing consent.
 * Resolves to true when Meta accepted it. Never throws.
 */
export async function sendMetaEvent(e: MetaEvent & { marketing: boolean }): Promise<boolean> {
  const token: string | undefined = process.env.META_CAPI_TOKEN;
  if (!token || !e.marketing) return false;
  try {
    const res: Response = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${encodeURIComponent(metaPixelId())}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...buildMetaPayload(e), access_token: token }),
      signal: AbortSignal.timeout(8000),
    });
    const data = (await res.json().catch(() => null)) as
      { events_received?: number; error?: { code?: number; type?: string; message?: string } } | null;
    if (res.ok && !data?.error) return true;
    const err = data?.error;
    const message: string = `HTTP ${res.status}, code ${err?.code ?? "?"}: ${err?.message ?? ""}`;
    console.error(`[meta-capi] ${e.eventName} rejected:`, e.eventId, message);
    if (isAuthError(res.status, err?.code, err?.type ?? "", err?.message ?? "")) {
      void alerta("error", "meta-capi", `${ALERT_PREFIX}: Meta Conversions API a refuzat token-ul/pixelul (${message})`);
    }
  } catch (error: unknown) {
    console.error(`[meta-capi] ${e.eventName} failed:`, e.eventId, error instanceof Error ? error.message : error);
  }
  return false;
}

export interface MetaPurchase {
  // Stripe Checkout session id (same as the browser eventID and TikTok event_id)
  eventId: string;
  value: number;
  currency: string;
  contentIds: string[];
  pageUrl?: string;
  email?: string | null;
  phone?: string | null;
  externalId?: string | null;
  // Stripe session metadata (fb_consent, fb_fbp, fb_fbc, tt_ip, tt_ua)
  metadata?: Record<string, string> | null;
  eventTime?: number;
}

/** Purchase, once per order (after the fulfilment claim succeeded). No-op without consent saved on the session. */
export function sendMetaPurchase(p: MetaPurchase): Promise<boolean> {
  const m: Record<string, string> = p.metadata ?? {};
  return sendMetaEvent({
    marketing: metaConsentFromMetadata(p.metadata),
    eventName: "Purchase",
    eventId: p.eventId,
    eventTime: p.eventTime,
    eventSourceUrl: p.pageUrl,
    email: p.email,
    phone: p.phone,
    externalId: p.externalId,
    ip: m[META.ip],
    userAgent: m[META.ua],
    fbp: m[META.fbp],
    fbc: m[META.fbc],
    customData: {
      value: Math.round(p.value * 100) / 100,
      currency: p.currency.toUpperCase(),
      content_ids: p.contentIds,
      contents: p.contentIds.map((id) => ({ id, quantity: 1 })),
      content_type: "product",
      order_id: p.eventId,
    },
  });
}

/** CompleteRegistration after an account was created; event_id reg_<userId> matches the browser event. */
export function sendMetaRegistration(input: {
  visitor: MetaVisitor;
  userId: string;
  email: string;
  method: "email" | "google";
  pageUrl?: string;
}): Promise<boolean> {
  const v = input.visitor;
  return sendMetaEvent({
    marketing: v.marketing,
    eventName: "CompleteRegistration",
    eventId: `reg_${input.userId}`,
    eventSourceUrl: input.pageUrl,
    email: input.email,
    externalId: input.userId,
    ip: v.ip,
    userAgent: v.userAgent,
    fbp: v.fbp,
    fbc: v.fbc,
    customData: { content_name: "Cont InvitOnline", status: input.method },
  });
}
