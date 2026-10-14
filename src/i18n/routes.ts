export type Lang = 'de' | 'en';
export const LANGS: Lang[] = ['de', 'en'];

/** One entry per page: the URL in each language. Keeps the language switch exact. */
export const ROUTES = {
  home: { de: '/', en: '/en/' },
  house: { de: '/haus/', en: '/en/house/' },
  region: { de: '/region/', en: '/en/region/' },
  occasions: { de: '/anlaesse/', en: '/en/occasions/' },
  rates: { de: '/preise/', en: '/en/rates/' },
  imprint: { de: '/impressum/', en: '/en/imprint/' },
  privacy: { de: '/datenschutz/', en: '/en/privacy/' },
} as const;

export type RouteKey = keyof typeof ROUTES;

export const url = (key: RouteKey, lang: Lang, hash = '') => ROUTES[key][lang] + (hash ? `#${hash}` : '');

export const NAV: RouteKey[] = ['house', 'region', 'occasions', 'rates'];
