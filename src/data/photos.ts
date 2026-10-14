import type { ImageMetadata } from 'astro';
import type { Lang } from '../i18n/routes';

/**
 * Photo slots. Drop a photo into src/assets/photos/ named exactly like the slot
 * (e.g. "stube.jpg", "hero-winter.jpg") and it replaces the placeholder everywhere.
 * `npm run photos -- <folder>` copies + renames a delivered set using tools/photo-map.json.
 */
export const SLOTS = {
  'hero-winter': { de: 'Untermoos an einem Winterabend: das Bauernhaus mit beleuchtetem Balkon, Schnee am Wegrand', en: 'Untermoos on a winter evening: the farmhouse with its lit balcony and snow by the lane' },
  'hero-summer': { de: 'Die Fassade von Untermoos im Sommer: zwei Holzbalkone, weißes Mauerwerk, roter Eingang', en: 'The façade of Untermoos in summer: two timber balconies, whitewashed walls, a red front door' },
  'winter-detail': { de: 'Lichterketten am Balkon und warme Fenster im Winter', en: 'Fairy lights on the balcony and warm windows in winter' },
  'exterior': { de: 'Altes Holz, blaue Fensterläden, Wildblumen und eine Skulptur vor dem Haus', en: 'Old timber, blue window frames, wildflowers and a sculpture in front of the house' },
  'exterior-angle': { de: 'Das Bauernhaus mit Staketenzaun im Sommer', en: 'The farmhouse behind its wooden picket fence in summer' },
  'exterior-tree': { de: 'Untermoos unter dem großen Baum im Weiler', en: 'Untermoos beneath the great tree in the hamlet' },
  'entrance': { de: 'Der Eingang mit Holztisch und Bänken', en: 'The entrance with a wooden table and benches' },
  'garden': { de: 'Liegestühle im Garten vor dem Haus', en: 'Deck chairs in the garden in front of the house' },
  'garden-2': { de: 'Garten mit überdachtem Sitzplatz', en: 'The garden with its covered seating area' },
  'deckchair': { de: 'Liegestuhl mit Blick auf die Berge', en: 'A deck chair facing the mountains' },
  'table': { de: 'Gedeckter Tisch vor der roten Haustür', en: 'A table set by the red front door' },
  'table-detail': { de: 'Willkommensgruß auf dem Holztisch', en: 'A welcome on the wooden table' },
  'schnaps': { de: 'Der hauseigene Untermoos-Schnaps', en: 'The house’s own Untermoos schnapps' },
  'view': { de: 'Blick über Wiesen und Wald auf die Berge', en: 'View across meadows and forest to the mountains' },
  'view-2': { de: 'Bergblick aus dem Garten', en: 'Mountain view from the garden' },
  'moor': { de: 'Moorweiher mit Seerosen und Bergspiegelung in der Umgebung', en: 'A moorland pond with water lilies and mountain reflections nearby' },
  'moor-2': { de: 'Wolken spiegeln sich im Moorweiher', en: 'Clouds reflected in the moorland pond' },
  'meadow': { de: 'Wiesen und Wald rund um den Weiler', en: 'Meadows and forest around the hamlet' },
  'trail': { de: 'Wanderwegweiser im Wald', en: 'A hiking signpost in the forest' },
  'stube': { de: 'Blick durch den holzgetäfelten Hausgang in die Stube', en: 'Looking down the wood-panelled hallway into the Stube' },
  'kitchen': { de: 'Die Küche', en: 'The kitchen' },
  'bedroom-1': { de: 'Doppelzimmer im Erdgeschoss', en: 'Ground-floor double room' },
  'bedroom-2': { de: 'Vierbettzimmer', en: 'Four-bed room' },
  'bedroom-3': { de: 'Zweibettzimmer', en: 'Two-bed room' },
  'bedroom-4': { de: 'Doppelzimmer im Obergeschoss', en: 'First-floor double room' },
  'bath': { de: 'Badezimmer mit Holz und Glaswaschbecken', en: 'Bathroom in timber with a glass washbasin' },
  'hosts': { de: 'Die Gastgeber auf der Bank im Garten', en: 'Your hosts on the garden bench' },
  'sculpture': { de: 'Steinskulptur im Garten', en: 'A stone sculpture in the garden' },
  'region-winter': { de: 'Winter im Alpbachtal', en: 'Winter in the Alpbachtal' },
  'region-summer': { de: 'Sommer im Alpbachtal', en: 'Summer in the Alpbachtal' },
} as const;

export type Slot = keyof typeof SLOTS;

const files = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/photos/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG}',
  { eager: true },
);

const bySlot = new Map<string, ImageMetadata>();
for (const [path, mod] of Object.entries(files)) {
  const name = path.split('/').pop()!.replace(/\.[^.]+$/, '').toLowerCase();
  bySlot.set(name, mod.default);
}

export const getPhoto = (slot: Slot): ImageMetadata | undefined => bySlot.get(slot);
export const photoAlt = (slot: Slot, lang: Lang) => SLOTS[slot][lang];
export const hasPhotos = bySlot.size > 0;
