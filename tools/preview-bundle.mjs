// Builds a flat, self-contained preview of ./dist for sharing as a claude.ai Artifact.
// Run after `npm run build`:  node tools/preview-bundle.mjs <outdir> [--standalone]
// - every page becomes a flat file (index.html, haus.html, en-house.html …) with relative links
// - one WebP per photo (largest ≤ 1440 px) instead of the full AVIF/WebP/JPEG set
// - JS modules inlined, prefetch dropped; the main page loses its document wrapper (the viewer adds one)
// --standalone: for a static host under any path (GitHub Pages preview): full documents, every page noindex
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const args = process.argv.slice(2);
const standalone = args.includes('--standalone');
const out = args.find((a) => !a.startsWith('--')) || join(root, 'preview');
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

// Routes from the single source of truth (src/i18n/routes.ts)
const routesSrc = readFileSync(join(root, 'src/i18n/routes.ts'), 'utf8');
const routes = [...routesSrc.matchAll(/(\w+): \{ de: '([^']+)', en: '([^']+)' \}/g)].flatMap((m) => [m[2], m[3]]);
const flat = (p) => (p === '/' ? 'index.html' : `${p.replace(/^\/|\/$/g, '').replace(/\//g, '-')}.html`);
const known = new Set(routes);

const assets = new Set();
const MAX_W = 1440;

function pickCandidate(srcset) {
  const c = srcset.split(',').map((s) => s.trim().split(/\s+/)).map(([u, w]) => ({ u, w: parseInt(w, 10) || 0 }));
  const fit = c.filter((x) => x.w <= MAX_W).sort((a, b) => b.w - a.w)[0];
  return (fit || c.sort((a, b) => a.w - b.w)[0]).u;
}

function transform(html, isMain) {
  // pictures → one WebP each
  html = html.replace(/<picture([^>]*)>([\s\S]*?)<\/picture>/g, (_, attrs, inner) => {
    const webp = inner.match(/<source srcset="([^"]+)" type="image\/webp"/);
    const img = inner.match(/<img [^>]*>/)[0];
    const chosen = webp ? pickCandidate(webp[1]) : img.match(/ src="([^"]+)"/)[1];
    const cleaned = img.replace(/ srcset="[^"]*"/, '').replace(/ sizes="[^"]*"/, '').replace(/ src="[^"]*"/, ` src="${chosen}"`);
    return `<picture${attrs}>${cleaned}</picture>`;
  });
  // gallery viewer links → the thumbnail's WebP (no extra full-size files in the preview)
  html = html.replace(/(<a class="gal-item[^"]*"[^>]*?)href="[^"]*"([^>]*>\s*<picture[^>]*><img src=")([^"]+)"/g, '$1href="$3"$2$3"');
  // scripts: drop prefetch, inline other modules
  html = html.replace(/<script type="module" src="\/_astro\/page\.[^"]+\.js"><\/script>/g, '');
  html = html.replace(/<script type="module" src="\/_astro\/([^"]+\.js)"><\/script>/g, (_, f) => {
    const js = readFileSync(join(dist, '_astro', f), 'utf8');
    if (js.includes('</script')) throw new Error(`cannot inline ${f}`);
    return `<script type="module">${js}</script>`;
  });
  // internal page links → flat files
  html = html.replace(/href="(\/[^"#]*)(#[^"]*)?"/g, (m, p, hash = '') => (known.has(p) ? `href="${flat(p)}${hash}"` : m));
  // asset paths → relative
  // (the viewer reserves names starting with "_", so /_astro/ becomes assets/)
  html = html.replace(/(["'(\s,])\/_astro\//g, '$1assets/').replace(/(["'(\s,])\/fonts\//g, '$1fonts/').replace(/(["'(\s,])\/plans\//g, '$1plans/').replace(/"\/favicon\.svg"/g, '"favicon.svg"');
  html = html.replace(/<link rel="apple-touch-icon"[^>]*>/, '');
  // (safe-area handling for the viewer's status bar lives in global.css: --safe-top)
  if (standalone) html = html.replace('<head>', '<head><meta name="robots" content="noindex, nofollow">');
  if (isMain && !standalone) {
    html = html
      .replace(/^<!DOCTYPE html><html[^>]*><head>/i, '')
      .replace(/<meta charset="utf-8">/, '')
      .replace(/<meta name="viewport"[^>]*>/, '')
      .replace(/<title>[^<]*<\/title>/, '<title>Untermoos Website</title><script>document.documentElement.lang="de"</script>')
      .replace('</head><body', '<div data-body')
      .replace(/<\/body><\/html>\s*$/i, '</div>');
  }
  for (const m of html.matchAll(/(?:src|href)="((?:assets|fonts|plans)\/[^"]+|favicon\.svg)"/g)) assets.add(m[1]);
  for (const m of html.matchAll(/url\(['"]?((?:assets|fonts)\/[^'")]+)['"]?\)/g)) assets.add(m[1]);
  return html;
}

for (const p of routes) {
  const html = readFileSync(join(dist, p, 'index.html'), 'utf8');
  writeFileSync(join(out, flat(p)), transform(html, p === '/'));
}
for (const a of assets) {
  mkdirSync(dirname(join(out, a)), { recursive: true });
  copyFileSync(join(dist, a.replace(/^assets\//, '_astro/')), join(out, a));
}
console.log(`${routes.length} pages, ${assets.size} assets → ${out}`);
