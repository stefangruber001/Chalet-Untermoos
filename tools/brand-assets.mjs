// Renders the social preview images (1200×630, DE + EN) and the Apple touch icon (180×180)
// with the real brand fonts. Run: node tools/brand-assets.mjs
//   → public/og-untermoos.jpg (DE), public/og-untermoos-en.jpg (EN), public/apple-touch-icon.png
// The preview is built for WhatsApp first: a bubble shows it about 270 pt wide, so only large type
// survives (claim ≥ 80 px, price ≥ 36 px); title and description come from the page meta below it.
import { chromium } from 'playwright';
import { readFileSync, statSync } from 'node:fs';

const brand = readFileSync(new URL('../src/data/brand.ts', import.meta.url), 'utf8');
const STAG = brand.match(/STAG_PATH =\n  '([^']+)'/)[1];
const stag = (fill) => `<svg viewBox="0 0 85.66 100"><path fill="${fill}" d="${STAG}"/></svg>`;
const crest = (h) => `<svg viewBox="0 0 100 128" style="height:${h}px;width:auto;display:block"><rect width="100" height="128" fill="#8c1d2b"/><rect x="7" y="7" width="86" height="114" fill="none" stroke="#f8f0ea" stroke-width="1.6"/><svg x="18.3" y="27" width="63.4" height="74" viewBox="0 0 85.66 100"><path fill="#f8f0ea" d="${STAG}"/></svg></svg>`;
// "from" price = the lowest season rate in src/data/rates.ts, so the image never shows a stale price
const rates = readFileSync(new URL('../src/data/rates.ts', import.meta.url), 'utf8');
const FROM = Math.min(...[...rates.matchAll(/\brate: (\d+)/g)].map((m) => +m[1]));
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
// Assets are inlined as data URLs: pages created with setContent may not load file:// resources.
const data = (p, type) => `data:${type};base64,${readFileSync(root + p).toString('base64')}`;
const fonts = `
  @font-face { font-family: N; src: url('${data('public/fonts/fraunces.woff2', 'font/woff2')}') format('woff2'); font-weight: 360 600; }
  @font-face { font-family: A; src: url('${data('public/fonts/albert-sans.woff2', 'font/woff2')}') format('woff2'); font-weight: 380 700; }
  @font-face { font-family: A; src: url('${data('public/fonts/albert-sans-ext.woff2', 'font/woff2')}') format('woff2'); font-weight: 380 700; unicode-range: U+0100-017F, U+20AC; }
  * { margin: 0; box-sizing: border-box; }`;
const photo = data('src/assets/photos/exterior-angle.jpg', 'image/jpeg');

const og = (claim, tag, place) => `<!doctype html><html><head><style>${fonts}
  body { width: 1200px; height: 630px; position: relative; overflow: hidden; background: #20181a; color: #fdf7f4; font-family: A; }
  .photo { position: absolute; inset: 0; background: url('${photo}') 50% 13% / cover no-repeat; }
  .shade { position: absolute; inset: 0; background:
    linear-gradient(90deg, rgb(22 15 17 / .68) 0%, rgb(22 15 17 / .46) 33%, rgb(22 15 17 / .08) 58%, rgb(22 15 17 / 0) 70%),
    linear-gradient(0deg, rgb(22 15 17 / .48) 0%, rgb(22 15 17 / 0) 44%); }
  .logo { position: absolute; top: 46px; left: 60px; display: flex; align-items: center; gap: 20px; }
  .word { font-family: N; font-weight: 560; font-size: 40px; line-height: 1; letter-spacing: .17em; text-transform: uppercase; }
  .place { margin-top: 10px; font-size: 19px; font-weight: 600; letter-spacing: .22em; text-transform: uppercase; color: rgb(253 247 244 / .92); }
  .txt { position: absolute; left: 60px; bottom: 54px; display: grid; gap: 26px; justify-items: start; }
  h1 { font-family: N; font-weight: 440; font-size: 88px; line-height: .98; letter-spacing: -.02em; text-shadow: 0 2px 18px rgb(0 0 0 / .28); }
  .tag { background: #8c1d2b; color: #fdf7f4; font-size: 37px; font-weight: 600; letter-spacing: .005em; padding: 12px 24px 14px; line-height: 1.1; box-shadow: 0 6px 22px rgb(0 0 0 / .22); }
</style></head><body>
  <div class="photo"></div><div class="shade"></div>
  <div class="logo">${crest(92)}<div><div class="word">Untermoos</div><div class="place">${place}</div></div></div>
  <div class="txt"><h1>${claim}</h1><span class="tag">${tag}</span></div>
</body></html>`;

const icon = `<!doctype html><html><head><style>* { margin: 0 } body { width: 180px; height: 180px; background: #8c1d2b; display: grid; place-items: center; }
  svg { width: 128px; height: auto; }</style></head><body>${stag('#f8f0ea')}</body></html>`;

const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const [file, claim, tag, place] of [
  ['og-untermoos.jpg', 'Ein Haus für<br>Ihre Leute.', `Ganzes Haus ab € ${FROM} / Nacht`, 'Bauernhaus · Alpbachtal · Tirol'],
  ['og-untermoos-en.jpg', 'A house for<br>your people.', `Whole house from €${FROM} / night`, 'Farmhouse · Alpbachtal · Tyrol'],
]) {
  await page.setContent(og(claim, tag, place), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
  // WhatsApp drops preview images above ~300 KB: keep a safe margin
  await page.screenshot({ path: `${root}public/${file}`, type: 'jpeg', quality: 84 });
  const kb = Math.round(statSync(`${root}public/${file}`).size / 1024);
  console.log(`public/${file}: ${kb} KB`);
  if (kb > 250) throw new Error(`${file} is ${kb} KB – lower the JPEG quality`);
}
await page.setViewportSize({ width: 180, height: 180 });
await page.setContent(icon, { waitUntil: 'load' });
await page.screenshot({ path: `${root}public/apple-touch-icon.png` });
await browser.close();
console.log('public/apple-touch-icon.png');
