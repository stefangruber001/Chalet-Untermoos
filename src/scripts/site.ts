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

initRidge();
