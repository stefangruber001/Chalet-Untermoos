import type { APIRoute } from 'astro';
import { ROUTES } from '../i18n/routes';

/** Sitemap with hreflang pairs (DE default, EN), built from the single ROUTES table. */
export const GET: APIRoute = ({ site }) => {
  const base = site!.toString().replace(/\/$/, '');
  const lastmod = new Date().toISOString().slice(0, 10);
  const priority: Record<string, string> = { home: '1.0', house: '0.9', rates: '0.9', region: '0.8', occasions: '0.8', imprint: '0.2', privacy: '0.2' };
  const urls = Object.entries(ROUTES).flatMap(([key, r]) =>
    (['de', 'en'] as const).map((lang) => `  <url>
    <loc>${base}${r[lang]}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>${priority[key] ?? '0.5'}</priority>
    <xhtml:link rel="alternate" hreflang="de" href="${base}${r.de}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${base}${r.en}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${base}${r.de}"/>
  </url>`),
  );
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
};
