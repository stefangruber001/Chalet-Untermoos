// Renders the social preview images (1200×630, DE + EN) and the Apple touch icon (180×180)
// with the real brand fonts. Run: node tools/brand-assets.mjs
//   → public/og-untermoos.jpg (DE), public/og-untermoos-en.jpg (EN), public/apple-touch-icon.png
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
// Assets are inlined as data URLs: pages created with setContent may not load file:// resources.
const data = (p, type) => `data:${type};base64,${readFileSync(root + p).toString('base64')}`;
const fonts = `
  @font-face { font-family: N; src: url('${data('public/fonts/newsreader-roman.woff2', 'font/woff2')}') format('woff2'); font-weight: 300 500; }
  @font-face { font-family: A; src: url('${data('public/fonts/albert-sans.woff2', 'font/woff2')}') format('woff2'); font-weight: 380 700; }
  * { margin: 0; box-sizing: border-box; }`;
const photo = data('src/assets/photos/hero-summer.jpg', 'image/jpeg');

const og = (line, place) => `<!doctype html><html><head><style>${fonts}
  body { width: 1200px; height: 630px; position: relative; overflow: hidden; background: #181b17; color: #eceee8; font-family: A; }
  .photo { position: absolute; inset: 0; background: url('${photo}') 50% 38% / cover; }
  .shade { position: absolute; inset: 0; background:
    linear-gradient(90deg, rgb(20 22 19 / .9) 0%, rgb(20 22 19 / .68) 40%, rgb(20 22 19 / .12) 72%),
    linear-gradient(180deg, rgb(20 22 19 / .1) 0%, rgb(20 22 19 / 0) 40%, rgb(20 22 19 / .7) 100%); }
  .txt { position: absolute; left: 72px; bottom: 70px; display: grid; gap: 18px; }
  .eyebrow { font-size: 17px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; color: #cdb58c; display: flex; align-items: center; gap: 12px; }
  .eyebrow::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: #b0302a; }
  h1 { font-family: N; font-weight: 300; font-size: 132px; line-height: .86; letter-spacing: -.035em; margin-left: -4px; }
  p { font-family: N; font-weight: 340; font-size: 30px; color: rgb(236 238 232 / .92); }
  svg { position: absolute; top: 56px; left: 72px; width: 46px; height: 46px; color: #eceee8; }
</style></head><body>
  <div class="photo"></div><div class="shade"></div>
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 13.2 16 5.5l13.5 7.7"/><path d="M8 11.2v10.3c0 3.6 2.6 6 8 6s8-2.4 8-6V11.2"/><path d="M13.2 17.6h5.6"/></svg>
  <div class="txt"><span class="eyebrow">${place}</span><h1>Untermoos</h1><p>${line}</p></div>
</body></html>`;

const icon = `<!doctype html><html><head><style>* { margin: 0 } body { width: 180px; height: 180px; background: #181b17; display: grid; place-items: center; }</style></head><body>
  <svg width="124" height="124" viewBox="0 0 32 32"><g fill="none" stroke="#eceee8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 13.6 16 7l11.5 6.6"/><path d="M9.2 12v8.6c0 3 2.2 5 6.8 5s6.8-2 6.8-5V12"/></g><circle cx="16" cy="17.6" r="1.4" fill="#b0302a"/></svg>
</body></html>`;

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
