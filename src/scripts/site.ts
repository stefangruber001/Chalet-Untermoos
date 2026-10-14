import { initRidge } from './ridge';

type Season = 'winter' | 'summer';
const root = document.documentElement;

function setSeason(season: Season, persist = true) {
  root.dataset.season = season;
  document.querySelectorAll<HTMLButtonElement>('[data-season-set]').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.seasonSet === season));
  });
  if (persist) {
    try { localStorage.setItem('untermoos-season', season); } catch { /* storage blocked – fine */ }
  }
  document.dispatchEvent(new CustomEvent('season-change', { detail: season }));
}

setSeason((root.dataset.season as Season) || 'winter', false);
document.querySelectorAll<HTMLButtonElement>('[data-season-set]').forEach((b) =>
  b.addEventListener('click', () => setSeason(b.dataset.seasonSet as Season)),
);

// Mobile menu sheet
const sheet = document.querySelector<HTMLElement>('[data-menu]');
const openBtn = document.querySelector<HTMLButtonElement>('[data-menu-open]');
const closeBtn = document.querySelector<HTMLButtonElement>('[data-menu-close]');
const toggleMenu = (open: boolean) => {
  if (!sheet || !openBtn) return;
  sheet.hidden = !open;
  openBtn.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
  (open ? closeBtn : openBtn)?.focus();
};
openBtn?.addEventListener('click', () => toggleMenu(true));
closeBtn?.addEventListener('click', () => toggleMenu(false));
sheet?.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('a')) toggleMenu(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && sheet && !sheet.hidden) toggleMenu(false); });

// Header over the opening photograph, hide-on-scroll-down, and the enquiry bar.
const header = document.querySelector<HTMLElement>('.site-header');
const hero = document.querySelector<HTMLElement>('[data-hero]');
const enquiry = document.getElementById('anfrage');
const ctaBand = document.querySelector('.cta-band');
const footer = document.querySelector('.site-footer');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
let lastY = window.scrollY;
let ticking = false;
const onScroll = () => {
  ticking = false;
  const y = window.scrollY;
  const h = header?.offsetHeight ?? 64;
  const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
  if (hero && heroBottom > h + 1) root.dataset.hdr = 'over';
  else delete root.dataset.hdr;
  const menuOpen = Boolean(sheet && !sheet.hidden);
  const pastHero = y > Math.max(220, (hero?.offsetHeight ?? 0) - h);
  if (!menuOpen && !reduce.matches && y > lastY + 6 && pastHero) root.setAttribute('data-hdr-hide', '');
  else if (y < lastY - 6 || !pastHero) root.removeAttribute('data-hdr-hide');
  // the bar steps aside where the page already offers the enquiry: the form, the closing band and the footer
  const inView = (el: Element | null) => { if (!el) return false; const r = el.getBoundingClientRect(); return r.top < window.innerHeight && r.bottom > 0; };
  const formInView = inView(enquiry) || inView(ctaBand) || inView(footer);
  if ((hero && heroBottom > window.innerHeight * 0.4) || formInView) root.setAttribute('data-bar-hide', '');
  else root.removeAttribute('data-bar-hide');
  lastY = y;
};
window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
window.addEventListener('resize', onScroll, { passive: true });
header?.addEventListener('focusin', () => root.removeAttribute('data-hdr-hide'));
onScroll();

initRidge();
