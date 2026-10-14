import { SEASONS, RULES, seasonFor } from '../data/rates';

type Dict = Record<string, any>;
const DAY = 86_400_000;
const iso = (d: Date) => d.toISOString().slice(0, 10);
const parse = (s: string) => (s ? new Date(`${s}T00:00:00Z`) : null);

export function initEnquiry() {
  const form = document.querySelector<HTMLFormElement>('[data-enquiry]');
  if (!form) return;
  const T: Dict = JSON.parse(document.querySelector('[data-enquiry-i18n]')?.textContent || '{}');
  const de = T.lang === 'de';
  const money = new Intl.NumberFormat(de ? 'de-AT' : 'en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  const money2 = new Intl.NumberFormat(de ? 'de-AT' : 'en-GB', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const dateFmt = new Intl.DateTimeFormat(de ? 'de-AT' : 'en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' });
  const $ = <T extends Element>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel)!;
  const field = (name: string) => form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement;

  const arrival = field('arrival') as HTMLInputElement;
  const departure = field('departure') as HTMLInputElement;
  const todayIso = iso(new Date(Date.now() - new Date().getTimezoneOffset() * 60_000));
  arrival.min = todayIso;
  departure.min = todayIso;

  const out = {
    total: $('[data-est-total]'), summary: $('[data-est-summary]'), lines: $('[data-est-lines]'),
    warn: $<HTMLElement>('[data-est-warn]'), inline: $('[data-est-inline]'), error: $<HTMLElement>('[data-error]'),
  };

  let last: Dict | null = null;

  function compute() {
    const a = parse(arrival.value), d = parse(departure.value);
    if (a && (!d || d <= a)) {
      departure.min = iso(new Date(a.getTime() + DAY));
      if (d && d <= a) departure.value = '';
    }
    const adults = Number(field('adults').value), children = Number(field('children').value), dogs = Number(field('dogs').value);
    out.warn.hidden = true;
    if (adults + children > 10) { out.warn.hidden = false; out.warn.textContent = T.guestsMax; }
    if (!a || !d || d <= a) {
      out.total.textContent = '–'; out.summary.textContent = T.pick; out.lines.innerHTML = ''; out.inline.textContent = ''; last = null;
      return;
    }
    const nights = Math.round((d.getTime() - a.getTime()) / DAY);
    let base = 0;
    const bySeason = new Map<string, { n: number; sum: number }>();
    for (let i = 0; i < nights; i++) {
      const key = seasonFor(iso(new Date(a.getTime() + i * DAY)));
      const s = SEASONS[key];
      base += s.rate;
      const e = bySeason.get(key) ?? { n: 0, sum: 0 };
      e.n++; e.sum += s.rate; bySeason.set(key, e);
    }
    const arrivalSeason = SEASONS[seasonFor(iso(a))];
    const minNights = Math.max(arrivalSeason.minNights, RULES.absoluteMinNights);
    const monthsAhead = (a.getTime() - Date.now()) / (DAY * 30.44);
    const early = monthsAhead >= RULES.earlyBird.monthsAhead ? RULES.earlyBird.discount : 0;
    const long = nights >= RULES.longStay.fromNights ? RULES.longStay.discount : 0;
    const discRate = Math.max(early, long);
    const discount = Math.round(base * discRate);
    const shortStay = nights < RULES.shortStay.belowNights ? RULES.shortStay.surcharge : 0;
    const dogFee = dogs * nights * RULES.dogPerNight;
    const tax = adults * nights * RULES.touristTax;
    const total = base - discount + shortStay + dogFee + tax;

    const rows: [string, string][] = [];
    bySeason.forEach((v, k) => rows.push([`${SEASONS[k as keyof typeof SEASONS][de ? 'deShort' : 'enShort']} · ${v.n} × ${money.format(v.sum / v.n)}`, money.format(v.sum)]));
    if (discount) rows.push([`${T.discount} ${Math.round(discRate * 100)} % (${long >= early ? (de ? 'ab 14 Nächten' : '14+ nights') : (de ? 'Frühbucher' : 'early booking')})`, `− ${money.format(discount)}`]);
    if (shortStay) rows.push([de ? 'Kurzaufenthalt (unter 3 Nächten)' : 'Short stay (under 3 nights)', money.format(shortStay)]);
    if (dogFee) rows.push([`${T.dogsLine} · ${dogs} × ${nights}`, money.format(dogFee)]);
    rows.push([`${T.tax} · ${adults} × ${nights} × ${money2.format(RULES.touristTax)}`, Number.isInteger(tax) ? money.format(tax) : money2.format(tax)]);

    out.lines.innerHTML = '';
    for (const [k, v] of rows) {
      const div = document.createElement('div');
      const dt = document.createElement('dt'); dt.textContent = k;
      const dd = document.createElement('dd'); dd.textContent = v;
      div.append(dt, dd); out.lines.append(div);
    }
    out.total.textContent = money.format(total);
    const perPerson = total / Math.max(1, adults + children) / nights;
    out.summary.textContent = `${nights} ${T.nights} · ${dateFmt.format(a)} – ${dateFmt.format(d)} · ≈ ${money.format(perPerson)} ${de ? 'pro Person und Nacht' : 'per person per night'}`;
    out.inline.textContent = `${T.estimate}: ${money.format(total)} · ${nights} ${T.nights}`;
    if (nights < minNights) { out.warn.hidden = false; out.warn.textContent = String(T.minStay).replace('{n}', String(minNights)); }
    last = { nights, base, discount, shortStay, dogFee, tax, total, a: arrival.value, d: departure.value };
  }

  form.addEventListener('input', compute);
  form.addEventListener('change', compute);
  compute();

  function mailText(data: Dict) {
    const L = de
      ? ['Anfrage Untermoos', 'Anreise', 'Abreise', 'Nächte', 'Gäste', 'Erwachsene/Jugendliche ab 15', 'Kinder unter 15', 'Hunde', 'Anlass', 'Wünsche', 'Richtpreis (unverbindlich)', 'Name', 'E-Mail', 'Telefon', 'Nachricht']
      : ['Enquiry Untermoos', 'Arrival', 'Departure', 'Nights', 'Guests', 'Adults/teens 15+', 'Children under 15', 'Dogs', 'Occasion', 'Requests', 'Indicative price (non-binding)', 'Name', 'Email', 'Phone', 'Message'];
    return [
      L[0], '',
      `${L[1]}: ${data.arrival ? dateFmt.format(parse(data.arrival)!) : '–'}`,
      `${L[2]}: ${data.departure ? dateFmt.format(parse(data.departure)!) : '–'}`,
      `${L[3]}: ${data.estimate?.nights ?? '–'}`,
      `${L[4]}: ${data.adults} ${L[5]}, ${data.children} ${L[6]} · ${L[7]}: ${data.dogs}`,
      `${L[8]}: ${data.occasion}`,
      `${L[9]}: ${data.extras.length ? data.extras.join(', ') : '–'}`,
      `${L[10]}: ${data.estimate ? money.format(data.estimate.total) : '–'}`, '',
      `${L[11]}: ${data.name}`, `${L[12]}: ${data.email}`, `${L[13]}: ${data.phone || '–'}`, '',
      `${L[14]}:`, data.message || '–',
    ].join('\n');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    out.error.hidden = true;
    const fd = new FormData(form);
    const data: Dict = Object.fromEntries(fd.entries());
    data.extras = fd.getAll('extras');
    data.estimate = last;
    data.lang = T.lang;
    data.page = location.href;
    const problems: string[] = [];
    if (!last) problems.push(T.pick);
    if (!String(data.name || '').trim()) problems.push(`${T.name}: ${T.required}`);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email || ''))) problems.push(`${T.email}: ${T.required}`);
    if (!fd.get('consent')) problems.push(T.consent);
    if (Number(data.adults) + Number(data.children) > 10) problems.push(T.guestsMax);
    if (problems.length) {
      out.error.hidden = false;
      out.error.textContent = problems.join(' · ');
      out.error.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }
    const done = $<HTMLElement>('[data-done]');
    const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    submit.disabled = true;
    submit.textContent = T.sending;
    let ok = false;
    if (!data.company) {
      try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 9000);
        const res = await fetch('/api/enquiry', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data), signal: ctrl.signal });
        clearTimeout(timer);
        ok = res.ok;
      } catch { ok = false; }
    } else {
      ok = true; // honeypot: quietly accept
    }
    form.hidden = true;
    $<HTMLElement>('[data-estimate]').hidden = true;
    done.hidden = false;
    if (!ok) {
      const text = mailText(data);
      $('[data-done-title]').textContent = T.fallbackTitle;
      $('[data-done-text]').textContent = T.fallbackText;
      $<HTMLElement>('[data-fallback]').hidden = false;
      $('[data-mail-text]').textContent = text;
      const subject = `${de ? 'Anfrage' : 'Enquiry'} Untermoos ${data.arrival || ''}–${data.departure || ''}`;
      $<HTMLAnchorElement>('[data-mailto]').href = `mailto:${T.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
      const copyBtn = $<HTMLButtonElement>('[data-copy]');
      copyBtn.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(text); copyBtn.textContent = T.copied; }
        catch {
          const range = document.createRange(); range.selectNodeContents($('[data-mail-text]'));
          const sel = getSelection(); sel?.removeAllRanges(); sel?.addRange(range);
        }
      });
    }
    done.focus();
    done.scrollIntoView({ block: 'start', behavior: 'smooth' });
  });
}
