// Screenshot helper: node tools/shot.mjs <outdir> <path> [<path> ...]
// Serves ./dist on a free port and captures desktop + iPhone full-page screenshots.
import { chromium } from 'playwright';
import http from 'node:http';
import { readFile, stat, mkdir } from 'node:fs/promises';
import { join, extname } from 'node:path';

const [outDir, ...paths] = process.argv.slice(2);
const ROOT = new URL('../dist/', import.meta.url).pathname;
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.avif': 'image/avif', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.xml': 'application/xml', '.txt': 'text/plain' };
const server = http.createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let f = join(ROOT, p);
  try { if ((await stat(f)).isDirectory()) f = join(f, 'index.html'); } catch {}
  try { const b = await readFile(f); res.writeHead(200, { 'content-type': TYPES[extname(f)] || 'application/octet-stream' }); res.end(b); }
  catch { res.writeHead(404); res.end('not found'); }
});
await new Promise((r) => server.listen(0, r));
const port = server.address().port;
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined });
const shots = [
  { name: 'desktop', viewport: { width: 1440, height: 900 }, dpr: 1 },
  { name: 'iphone', viewport: { width: 393, height: 852 }, dpr: 2, mobile: true },
];
for (const path of paths) {
  for (const s of shots) {
    const ctx = await browser.newContext({ viewport: s.viewport, deviceScaleFactor: s.dpr, isMobile: !!s.mobile, hasTouch: !!s.mobile });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto(`http://localhost:${port}${path}`, { waitUntil: 'networkidle' });
    // scroll through the page so lazy images load, then return to top
    await page.evaluate(async () => {
      document.documentElement.style.scrollBehavior = 'auto';
      for (let y = 0; y < document.body.scrollHeight; y += Math.round(innerHeight * 0.8)) { scrollTo({ top: y, behavior: 'instant' }); await new Promise((r) => setTimeout(r, 120)); }
      scrollTo({ top: 0, behavior: 'instant' });
    });
    // wait until every image that started loading has finished (lazy images included)
    await page.evaluate(() => Promise.race([
      Promise.all([...document.images].filter((i) => i.currentSrc || i.loading !== 'lazy').map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; })))),
      new Promise((r) => setTimeout(r, 8000)),
    ]));
    await page.waitForTimeout(400);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    const file = join(outDir, `${path.replace(/\//g, '_') || 'root'}-${s.name}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(file, 'overflowX=', overflow, errors.length ? 'ERRORS: ' + errors.join(' | ') : '');
    await ctx.close();
  }
}
await browser.close();
server.close();
