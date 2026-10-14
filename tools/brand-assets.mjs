// Renders the social preview images (1200×630, DE + EN) and the Apple touch icon (180×180)
// with the real brand fonts. Run: node tools/brand-assets.mjs
//   → public/og-untermoos.jpg (DE), public/og-untermoos-en.jpg (EN), public/apple-touch-icon.png
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const brand = readFileSync(new URL('../src/data/brand.ts', import.meta.url), 'utf8');
const STAG = brand.match(/STAG_PATH =\n  '([^']+)'/)[1];
const stag = (fill) => `<svg viewBox="0 0 85.66 100"><path fill="${fill}" d="${STAG}"/></svg>`;
const crest = (h) => `<svg viewBox="0 0 100 128" style="height:${h}px;width:auto;display:block"><rect width="100" height="128" fill="#8c1d2b"/><rect x="7" y="7" width="86" height="114" fill="none" stroke="#f8f0ea" stroke-width="1.6"/><svg x="18.3" y="27" width="63.4" height="74" viewBox="0 0 85.66 100"><path fill="#f8f0ea" d="${STAG}"/></svg></svg>`;
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
// Assets are inlined as data URLs: pages created with setContent may not load file:// resources.
const data = (p, type) => `data:${type};base64,${readFileSync(root + p).toString('base64')}`;
const fonts = `
  @font-face { font-family: N; src: url('${data('public/fonts/bodoni-moda-normal.woff2', 'font/woff2')}') format('woff2'); font-weight: 400 700; }
  @font-face { font-family: NI; src: url('${data('public/fonts/bodoni-moda-italic.woff2', 'font/woff2')}') format('woff2'); font-weight: 400 700; font-style: italic; }
  @font-face { font-family: A; src: url('${data('public/fonts/albert-sans.woff2', 'font/woff2')}') format('woff2'); font-weight: 380 700; }
  * { margin: 0; box-sizing: border-box; }`;
const photo = data('src/assets/photos/hero-summer.jpg', 'image/jpeg');

const og = (line, place) => `<!doctype html><html><head><style>${fonts}
  body { width: 1200px; height: 630px; position: relative; overflow: hidden; background: #4a1119; color: #f8f0ea; font-family: A; }
  .photo { position: absolute; inset: 0; background: url('${photo}') 50% 38% / cover; }
  .shade { position: absolute; inset: 0; background:
    linear-gradient(90deg, rgb(34 8 13 / .9) 0%, rgb(34 8 13 / .66) 42%, rgb(34 8 13 / .08) 74%),
    linear-gradient(180deg, rgb(34 8 13 / .2) 0%, rgb(34 8 13 / 0) 40%, rgb(34 8 13 / .72) 100%); }
  .logo { position: absolute; top: 54px; left: 72px; display: flex; align-items: center; gap: 18px; }
  .word { font-family: N; font-weight: 560; font-size: 30px; letter-spacing: .2em; text-transform: uppercase; }
  .txt { position: absolute; left: 72px; bottom: 66px; display: grid; gap: 16px; }
  .eyebrow { font-size: 17px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase; color: #d4b583; display: flex; align-items: center; gap: 14px; }
  .eyebrow::before { content: ''; width: 34px; height: 1px; background: #d4b583; }
  h1 { font-family: NI; font-style: italic; font-weight: 500; font-size: 128px; line-height: .9; letter-spacing: -.02em; margin-left: -4px; }
  p { font-size: 30px; color: rgb(248 240 234 / .94); }
</style></head><body>
  <div class="photo"></div><div class="shade"></div>
  <div class="logo">${crest(64)}<span class="word">Untermoos</span></div>
  <div class="txt"><span class="eyebrow">${place}</span><h1>Untermoos</h1><p>${line}</p></div>
</body></html>`;

const icon = `<!doctype html><html><head><style>* { margin: 0 } body { width: 180px; height: 180px; background: #8c1d2b; display: grid; place-items: center; }
  svg { width: 128px; height: auto; }</style></head><body>${stag('#f8f0ea')}</body></html>`;

const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const [file, line, place] of [
  ['og-untermoos.jpg', 'Tiroler Bauernhaus für bis zu zehn Gäste', 'Breitenbach am Inn · Alpbachtal · Tirol'],
  ['og-untermoos-en.jpg', 'A Tyrolean farmhouse for up to ten guests', 'Breitenbach am Inn · Alpbachtal · Tyrol'],
]) {
  await page.setContent(og(line, place), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
  await page.screenshot({ path: `${root}public/${file}`, type: 'jpeg', quality: 86 });
}
await page.setViewportSize({ width: 180, height: 180 });
await page.setContent(icon, { waitUntil: 'load' });
await page.screenshot({ path: `${root}public/apple-touch-icon.png` });
await browser.close();
console.log('public/og-untermoos.jpg, public/og-untermoos-en.jpg, public/apple-touch-icon.png');
