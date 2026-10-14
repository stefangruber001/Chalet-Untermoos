import type { Lang } from './routes';

/** Interface strings shared by every page. Page copy lives next to each view. */
export const UI = {
  de: {
    skip: 'Zum Inhalt springen',
    nav: { house: 'Das Haus', gallery: 'Bilder', region: 'Region', occasions: 'Anlässe', rates: 'Preise & Anfrage' },
    enquire: 'Anfragen',
    enquireLong: 'Verfügbarkeit anfragen',
    menu: 'Menü',
    brandTag: 'Bauernhaus · Alpbachtal',
    close: 'Schließen',
    season: { label: 'Jahreszeit', summer: 'Sommer', winter: 'Winter' },
    langSwitch: { label: 'English', short: 'EN', href: 'en' },
    from: 'Ganzes Haus ab',
    perNight: 'pro Nacht',
    footer: {
      address: 'Adresse',
      contact: 'Kontakt',
      explore: 'Entdecken',
      legal: 'Rechtliches',
      reply: 'Antwort innerhalb von 24 Stunden',
      imprint: 'Impressum',
      privacy: 'Datenschutz',
      region: 'Alpbachtal · Tirol · Österreich',
    },
    photoPending: 'Foto folgt',
  },
  en: {
    skip: 'Skip to content',
    nav: { house: 'The house', gallery: 'Photos', region: 'Region', occasions: 'Occasions', rates: 'Rates & enquiry' },
    enquire: 'Enquire',
    enquireLong: 'Check availability',
    menu: 'Menu',
    brandTag: 'Farmhouse · Alpbachtal',
    close: 'Close',
    season: { label: 'Season', summer: 'Summer', winter: 'Winter' },
    langSwitch: { label: 'Deutsch', short: 'DE', href: 'de' },
    from: 'Whole house from',
    perNight: 'per night',
    footer: {
      address: 'Address',
      contact: 'Contact',
      explore: 'Explore',
      legal: 'Legal',
      reply: 'Reply within 24 hours',
      imprint: 'Imprint',
      privacy: 'Privacy',
      region: 'Alpbachtal · Tyrol · Austria',
    },
    photoPending: 'Photo to follow',
  },
} as const satisfies Record<Lang, unknown>;

export const fmtEUR = (n: number, lang: Lang) =>
  new Intl.NumberFormat(lang === 'de' ? 'de-AT' : 'en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
