// @ts-check
import { defineConfig } from 'astro/config';

// Untermoos – static bilingual site (DE default at "/", EN at "/en/").
export default defineConfig({
  site: 'https://www.ferienhaus-untermoos.at',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // Small CSS → inline it: one request less, no render-blocking stylesheet.
    inlineStylesheets: 'always',
  },
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  // Sitemap with hreflang pairs is generated in src/pages/sitemap.xml.ts from the route map
  // (translated slugs like /haus/ ↔ /en/house/ are not paired correctly by @astrojs/sitemap).
  image: {
    responsiveStyles: true,
  },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
});
