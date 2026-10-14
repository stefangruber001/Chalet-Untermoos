/**
 * Generative hero art used until the photographs are placed: layered ridgelines above the
 * Inn valley, with the farmhouse and two lit windows on the near ridge. Deterministic (seeded),
 * so it renders identically on every visit. Redraws on resize and season change.
 */
type Season = 'winter' | 'summer';

const PALETTES: Record<Season, { sky: [string, string, string]; ridges: string[]; glow: string; house: string; window: string; stars: boolean }> = {
  winter: {
    sky: ['#121612', '#1c2420', '#2b3530'],
    ridges: ['#3a4642', '#313b37', '#28302c', '#1e2421', '#151916'],
    glow: 'rgba(190, 205, 214, 0.10)',
    house: '#101310',
    window: '#e7c27a',
    stars: true,
  },
  summer: {
    sky: ['#1b1f19', '#3a3b2c', '#8a7451'],
    ridges: ['#6b6a52', '#55573f', '#414631', '#2e3424', '#1b2016'],
    glow: 'rgba(231, 194, 122, 0.22)',
    house: '#141811',
    window: '#f0cf8a',
    stars: false,
  },
};

function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function valueNoise(rand: () => number, points: number) {
  const v = Array.from({ length: points + 1 }, rand);
  return (x: number) => {
    const i = Math.floor(x * points), f = x * points - i;
    const s = f * f * (3 - 2 * f);
    return v[i] * (1 - s) + v[Math.min(i + 1, points)] * s;
  };
}

function ridgeFn(seed: number) {
  const rand = mulberry32(seed);
  const octaves = [valueNoise(rand, 4), valueNoise(rand, 9), valueNoise(rand, 23), valueNoise(rand, 61)];
  const weights = [0.58, 0.26, 0.11, 0.05];
  return (x: number) => octaves.reduce((acc, n, i) => acc + n(x) * weights[i], 0);
}

export function drawRidge(canvas: HTMLCanvasElement, season: Season) {
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const w = rect.width, h = rect.height;
  const pal = PALETTES[season];

  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, pal.sky[0]);
  sky.addColorStop(0.55, pal.sky[1]);
  sky.addColorStop(1, pal.sky[2]);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  const glow = ctx.createRadialGradient(w * 0.72, h * 0.42, 0, w * 0.72, h * 0.42, Math.max(w, h) * 0.6);
  glow.addColorStop(0, pal.glow);
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  if (pal.stars) {
    const r = mulberry32(7);
    for (let i = 0; i < Math.round((w * h) / 5200); i++) {
      const x = r() * w, y = r() * h * 0.5, a = 0.12 + r() * 0.5, s = r() < 0.08 ? 1.3 : 0.7;
      ctx.fillStyle = `rgba(236,238,232,${a.toFixed(2)})`;
      ctx.fillRect(x, y, s, s);
    }
  }

  const layers = pal.ridges.length;
  let houseY = 0;
  for (let i = 0; i < layers; i++) {
    const f = ridgeFn(1820 + i * 97);
    const base = h * (0.42 + i * 0.105);
    const amp = h * (0.2 - i * 0.025);
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 2) {
      const y = base - f(x / w) * amp;
      ctx.lineTo(x, y);
      if (i === layers - 2 && Math.abs(x - w * 0.7) < 1) houseY = y;
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = pal.ridges[i];
    ctx.fill();

    if (i === layers - 2) {
      // The farmhouse: low gable, deep eaves, two lit windows.
      const s = Math.max(16, Math.min(w, h) * 0.05);
      const hx = w * 0.7, hy = houseY + 2;
      ctx.fillStyle = pal.house;
      ctx.beginPath();
      ctx.moveTo(hx - s * 1.25, hy - s * 0.92);
      ctx.lineTo(hx, hy - s * 1.42);
      ctx.lineTo(hx + s * 1.25, hy - s * 0.92);
      ctx.lineTo(hx + s * 1.05, hy - s * 0.92);
      ctx.lineTo(hx + s * 1.05, hy + s * 0.3);
      ctx.lineTo(hx - s * 1.05, hy + s * 0.3);
      ctx.lineTo(hx - s * 1.05, hy - s * 0.92);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = pal.window;
      ctx.shadowColor = pal.window;
      ctx.shadowBlur = s * 0.6;
      ctx.fillRect(hx - s * 0.62, hy - s * 0.45, s * 0.26, s * 0.26);
      ctx.fillRect(hx + s * 0.22, hy - s * 0.45, s * 0.26, s * 0.26);
      ctx.shadowBlur = 0;
    }
  }
}

export function initRidge() {
  const canvases = Array.from(document.querySelectorAll<HTMLCanvasElement>('canvas[data-ridge]'));
  if (!canvases.length) return;
  const season = () => (document.documentElement.dataset.season === 'summer' ? 'summer' : 'winter') as Season;
  const render = () => canvases.forEach((c) => drawRidge(c, season()));
  render();
  let raf = 0;
  const ro = new ResizeObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(render); });
  canvases.forEach((c) => ro.observe(c));
  document.addEventListener('season-change', render);
}
