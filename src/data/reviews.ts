/**
 * Guest reviews on the home page (DE/EN).
 *
 * `sample: true` marks placeholder texts for the design preview. They show a visible "Beispiel" / "Sample" tag
 * and are left out of every hosted build (Cloudflare Pages and other CI builds set CF_PAGES or CI), so they can
 * never go live by accident – fake reviews are unlawful in the EU. Replace them with real reviews (with the
 * guest's consent) and drop the flag; without real reviews the section is simply not shown.
 * Never add placeholder reviews or a star rating to the JSON-LD.
 */
export interface Review {
  stars: 1 | 2 | 3 | 4 | 5;
  sample?: boolean;
  de: { text: string; who: string };
  en: { text: string; who: string };
}

/** Samples only in local builds (the preview); SHOW_SAMPLE_REVIEWS=1 forces them on. */
export const SHOW_SAMPLES = process.env.SHOW_SAMPLE_REVIEWS === '1' || !(process.env.CI || process.env.CF_PAGES);

export const REVIEWS: Review[] = [
  {
    stars: 5, sample: true,
    de: { text: 'Drei Generationen unter einem Dach – und abends saßen alle zusammen in der Stube. Die Kinder wollten gar nicht mehr aus dem Garten.', who: 'Familie aus München · Sommer' },
    en: { text: 'Three generations under one roof – and in the evening we all sat together in the Stube. The children never wanted to leave the garden.', who: 'Family from Munich · Summer' },
  },
  {
    stars: 5, sample: true,
    de: { text: 'Tagsüber auf der Piste, abends am Kachelofen. Das Haus hat Seele, und die Gastgeber waren herzlich und immer erreichbar.', who: 'Freundesgruppe aus Utrecht · Skiwoche' },
    en: { text: 'Skiing all day, the tiled stove at night. The house has real soul, and the hosts were warm and always there for us.', who: 'Friends from Utrecht · Ski week' },
  },
  {
    stars: 5, sample: true,
    de: { text: 'Unser Team-Offsite im Herbst: der große Tisch zum Arbeiten, die Stube für die Abende. Alles war vorbereitet, wir mussten uns um nichts kümmern.', who: 'Team aus Innsbruck · Herbst' },
    en: { text: 'Our team offsite in autumn: the big table for work, the Stube for the evenings. Everything was ready – we didn’t have to worry about a thing.', who: 'Team from Innsbruck · Autumn' },
  },
];
