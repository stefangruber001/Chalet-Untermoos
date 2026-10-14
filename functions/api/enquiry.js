/**
 * Cloudflare Pages Function – POST /api/enquiry
 * Validates the enquiry and emails it to the hosts via Resend (https://resend.com).
 * Environment (Pages → Settings → Variables and secrets):
 *   RESEND_API_KEY  secret, required
 *   ENQUIRY_TO      recipient, e.g. sonja.ruprechter@icloud.com
 *   ENQUIRY_FROM    verified sender, e.g. "Untermoos <anfrage@ferienhaus-untermoos.at>"
 * No data is stored here; the guest's address is set as Reply-To so the hosts answer directly.
 */
const MAX_BYTES = 20_000;
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/;
const ALLOWED_HOSTS = ['www.ferienhaus-untermoos.at', 'ferienhaus-untermoos.at'];

const clean = (v, max = 200) => String(v ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max);
const int = (v, min, max) => {
  const n = Number.parseInt(String(v), 10);
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
};
const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });

function originAllowed(request) {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  try {
    const host = new URL(origin).hostname;
    return ALLOWED_HOSTS.includes(host) || host.endsWith('.pages.dev') || host === 'localhost';
  } catch {
    return false;
  }
}

export async function onRequestPost({ request, env }) {
  if (!originAllowed(request)) return json(403, { ok: false, error: 'origin' });
  const length = Number(request.headers.get('content-length') || 0);
  if (length > MAX_BYTES) return json(413, { ok: false, error: 'size' });

  let d;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BYTES) return json(413, { ok: false, error: 'size' });
    d = JSON.parse(raw);
  } catch {
    return json(400, { ok: false, error: 'json' });
  }

  // Honeypot: bots fill the hidden "company" field – accept silently, send nothing.
  if (clean(d.company)) return json(200, { ok: true });

  const lang = d.lang === 'en' ? 'en' : 'de';
  const name = clean(d.name, 120);
  const email = clean(d.email, 254);
  const phone = clean(d.phone, 40);
  const arrival = clean(d.arrival, 10);
  const departure = clean(d.departure, 10);
  const adults = int(d.adults, 1, 10);
  const children = int(d.children, 0, 9);
  const dogs = int(d.dogs, 0, 2);
  const occasion = clean(d.occasion, 80);
  const extras = Array.isArray(d.extras) ? d.extras.slice(0, 8).map((x) => clean(x, 80)).filter(Boolean) : [];
  const message = clean(d.message, 4000);
  const total = d.estimate && Number.isFinite(Number(d.estimate.total)) ? Math.round(Number(d.estimate.total)) : null;
  const nights = d.estimate && int(d.estimate.nights, 1, 120);

  const problems = [];
  if (!name) problems.push('name');
  if (!EMAIL.test(email)) problems.push('email');
  if (!ISO.test(arrival) || !ISO.test(departure) || departure <= arrival) problems.push('dates');
  if (adults === null || children === null || dogs === null || adults + children > 10) problems.push('guests');
  if (d.consent !== 'on' && d.consent !== true) problems.push('consent');
  if (problems.length) return json(422, { ok: false, error: 'invalid', fields: problems });

  if (!env.RESEND_API_KEY || !env.ENQUIRY_TO || !env.ENQUIRY_FROM) return json(503, { ok: false, error: 'not-configured' });

  const fmtDate = (s) => s.split('-').reverse().join('.');
  const eur = (n) => new Intl.NumberFormat('de-AT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
  const lines = [
    `Neue Anfrage über ferienhaus-untermoos.at (${lang.toUpperCase()})`,
    '',
    `Zeitraum:   ${fmtDate(arrival)} – ${fmtDate(departure)}${nights ? ` (${nights} Nächte)` : ''}`,
    `Gäste:      ${adults} ab 15 Jahren, ${children} Kinder unter 15, ${dogs} Hund(e)`,
    `Anlass:     ${occasion || '–'}`,
    `Wünsche:    ${extras.length ? extras.join(', ') : '–'}`,
    `Richtpreis: ${total !== null ? `${eur(total)} (unverbindlich, laut Rechner)` : '–'}`,
    '',
    `Name:       ${name}`,
    `E-Mail:     ${email}`,
    `Telefon:    ${phone || '–'}`,
    '',
    'Nachricht:',
    message || '–',
    '',
    '— Antworten Sie einfach auf diese E-Mail, die Antwort geht direkt an den Gast.',
  ];

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: env.ENQUIRY_FROM,
      to: env.ENQUIRY_TO.split(',').map((s) => s.trim()).filter(Boolean),
      reply_to: email,
      subject: `Anfrage ${fmtDate(arrival)}–${fmtDate(departure)} · ${adults + children} Gäste · ${name}`,
      text: lines.join('\n'),
    }),
  });
  if (!res.ok) return json(502, { ok: false, error: 'mail' });
  return json(200, { ok: true });
}

