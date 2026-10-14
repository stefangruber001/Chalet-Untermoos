# Untermoos – website

Bilingual (DE/EN) website for **Untermoos**, a ~200-year-old Tyrolean farmhouse for up to 10 guests in Breitenbach am Inn (Alpbachtal). Static site built with [Astro](https://astro.build), hosted for free on Cloudflare Pages; the enquiry form sends an email via [Resend](https://resend.com).

| Page | German | English |
|---|---|---|
| Home | `/` | `/en/` |
| The house (floor plans, rooms) | `/haus/` | `/en/house/` |
| Photos (room by room, full-screen viewer) | `/bilder/` | `/en/photos/` |
| Region | `/region/` | `/en/region/` |
| Occasions | `/anlaesse/` | `/en/occasions/` |
| Rates & enquiry | `/preise/` | `/en/rates/` |
| Imprint / Privacy | `/impressum/`, `/datenschutz/` | `/en/imprint/`, `/en/privacy/` |

## Preview link (GitHub Pages)

https://stefangruber001.github.io/Chalet-Untermoos/ – a shareable preview, rebuilt on every push by `.github/workflows/pages.yml` (one-time setup: Settings → Pages → Source: *GitHub Actions*). Hidden from search engines (noindex); the enquiry form opens a prepared email because there is no mail backend; sample reviews are shown with their “Beispiel” tag. The real site goes live on Cloudflare Pages (below).

## Go live (one-time, about 30 minutes, € 0)

1. **Cloudflare Pages** (free): dash.cloudflare.com → Workers & Pages → Create → Pages → *Connect to Git* → this repository, branch `main`.
   Build command `npm run build`, output directory `dist`, environment variable `NODE_VERSION = 22`.
2. **Resend** (free tier: 3,000 emails/month): create an account, add the domain `ferienhaus-untermoos.at`, add the DNS records Resend shows (SPF/DKIM), create an API key.
3. **Cloudflare → your Pages project → Settings → Variables and secrets** (Production):
   - `RESEND_API_KEY` – the key from step 2 (type *Secret*)
   - `ENQUIRY_TO` – `sonja.ruprechter@icloud.com` (several addresses: comma-separated)
   - `ENQUIRY_FROM` – `Untermoos <anfrage@ferienhaus-untermoos.at>`
   Redeploy once after adding them.
4. **Domain**: Pages project → Custom domains → add `www.ferienhaus-untermoos.at` and `ferienhaus-untermoos.at`.
   Easiest is to move the domain's nameservers to Cloudflare (free); otherwise add a CNAME `www → <project>.pages.dev` at the current DNS provider. Switch DNS only after the preview URL has been checked – the old site stays online until then.
5. **After go-live**: test one enquiry end to end; add the site to Google Search Console and submit `https://www.ferienhaus-untermoos.at/sitemap.xml`; update the website link in the Google Business Profile and on alpbachtal.at.

Without the Resend variables the form still works: guests get a prepared email they can send themselves (fallback panel).

## Before go-live: facts to confirm with the hosts

Dog fee (€ 12) · spelling of the Alpwerk shop · prices and season dates (`src/data/rates.ts`) · cancellation terms (`src/views/Rates.astro`) · imprint details (UID number if VAT-registered) · consent of the people in the photos · first real guest reviews for `src/data/reviews.ts` (the sample reviews never go live).

Confirmed by the hosts on 14 Oct 2026 and now on the site: 2 bathrooms (ground floor + first floor, new since spring 2026), 4 WCs and a laundry room; check-in from 16:00, earlier by arrangement; playground; bedside crib or cot.

Confirmed by the hosts' own house description (Oct 2026) and now on the site: baby cot and high chair on request, welcome Obstler, Bildhauerei Ruprechter next door, 650 m altitude, wood heating in Stube and kitchen, distances in km.

## Editing content

| What | Where |
|---|---|
| Prices, seasons, discounts, dog fee, tourist tax | `src/data/rates.ts` |
| Facts, rooms, amenities, contact | `src/data/property.ts` |
| FAQ | `src/data/faq.ts` |
| Guest reviews (home page) | `src/data/reviews.ts` – the three entries marked `sample` are placeholders: they show a “Beispiel” tag in local previews and are never built on Cloudflare. Add real reviews (with the guest’s consent) and remove the samples. |
| Travel times | `src/data/places.ts` |
| Page copy (DE + EN side by side) | `src/views/*.astro` |
| Photos (slot → file) | `src/assets/photos/<slot>.jpg`, alt texts in `src/data/photos.ts` |

New photos: put the originals in a folder, map them in `tools/photo-map.json`, run `npm run photos -- <folder> [slot …]` (auto-rotates, max 2560 px). The gallery page order and sections live in `src/data/gallery.ts`. Missing slots show a neutral placeholder; kitchen and bedroom slots (`kitchen`, `bedroom-1` … `bedroom-4`) appear automatically on *Das Haus* once the files exist.

## Commands

| Command | Does |
|---|---|
| `npm install` | install (Node 22+) |
| `npm run dev` | local preview at http://localhost:4321 |
| `npm run build` | production build into `dist/` |
| `npm run qa` | desktop + iPhone screenshots of the main pages into `qa-shots/` (needs Chromium) |
| `npm run brand` | re-render social preview images and the touch icon |
| `npm run bundle:preview` | flat preview bundle (for sharing outside Cloudflare) |

## Technical notes

- No cookies, no tracking, no third-party requests; fonts (Fraunces, Albert Sans – SIL OFL) are self-hosted subsets.
- Images: AVIF/WebP in responsive sizes, generated at build time.
- SEO: canonical + hreflang on every page, sitemap with language alternates, JSON-LD (VacationRental, FAQPage, BreadcrumbList), `llms.txt` for AI assistants, redirects from the old URLs in `public/_redirects`.
- Security headers and caching: `public/_headers`. Enquiry endpoint: `functions/api/enquiry.js` (origin check, honeypot, validation; stores nothing).
