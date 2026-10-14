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
  'stube': { de: 'Stube mit gelbem Kachelofen, Ofenbank, Eckbank und Tisch', en: 'The Stube with its yellow tiled stove, stove bench, corner bench and table' },
  'kachelofen': { de: 'Die Ofenbank am Kachelofen mit Hirsch-Kissen', en: 'The bench around the tiled stove with stag cushions' },
  'kitchen': { de: 'Küche mit altem Holzherd und Esstisch', en: 'The kitchen with its old wood-fired range and dining table' },
  'tafel': { de: 'Esstisch in der Küche mit Eckbank und bemalten Holzstühlen', en: 'The kitchen dining table with corner bench and painted wooden chairs' },
  'hausgang': { de: 'Hausgang mit bemalter Truhe, Pelletofen und Haustür mit Hirsch', en: 'The hallway with painted chest, pellet stove and the stag front door' },
  'entrance-hall': { de: 'Durch die rote Haustür in den Hausgang mit Treppe und Dartscheibe', en: 'Through the red front door into the hallway with staircase and dartboard' },
  'stove': { de: 'Pelletofen und bemalte Truhe im Hausgang', en: 'Pellet stove and painted chest in the hallway' },
  'kasten-1895': { de: 'Bemalter Bauernkasten von 1895 an der alten Blockwand', en: 'A painted farmhouse wardrobe from 1895 against the old log wall' },
  'eckbank': { de: 'Eckbank mit Tisch an der alten Blockwand', en: 'Corner bench and table against the old log wall' },
  'wardrobe': { de: 'Geschnitzter Holzkasten mit Rosetten', en: 'Carved wooden wardrobe with rosettes' },
  'bedroom-1': { de: 'Doppelzimmer mit Eisenbett und Kristallluster', en: 'Double room with iron bed and crystal chandelier' },
  'bedroom-1b': { de: 'Doppelzimmer mit Sitzecke und Holzdecke', en: 'Double room with seating corner and timber ceiling' },
  'bedroom-1c': { de: 'Korbsessel in der Sitzecke des Doppelzimmers', en: 'Wicker chairs in the seating corner of the double room' },
  'bedroom-2': { de: 'Vierbettzimmer mit geschnitztem Doppelbett und Bauernkästen', en: 'Four-bed room with carved double bed and farmhouse wardrobes' },
  'bedroom-2b': { de: 'Vierbettzimmer: Einzelbetten unter den Fenstern', en: 'Four-bed room: single beds beneath the windows' },
  'bedroom-2c': { de: 'Einzelbett mit Blumenvorhängen', en: 'Single bed with floral curtains' },
  'bedroom-3': { de: 'Zweibettzimmer mit Holzbetten und Wandobjekten', en: 'Twin room with wooden beds and wall sculptures' },
  'bedroom-3b': { de: 'Zweibettzimmer mit Leselicht zwischen den Betten', en: 'Twin room with a reading light between the beds' },
  'bedroom-3c': { de: 'Blick ins Zweibettzimmer', en: 'A look into the twin room' },
  'bedroom-4': { de: 'Doppelzimmer mit alten Blockwänden und indirektem Licht', en: 'Double room with old log walls and soft indirect light' },
  'bedroom-4b': { de: 'Sitzecke im Doppelzimmer mit Blockwänden', en: 'Seating corner in the log-walled double room' },
  'bedroom-4c': { de: 'Das Doppelzimmer mit Blockwänden: Bett, Sitzecke und Fenster auf zwei Seiten', en: 'The log-walled double room: bed, seating corner and windows on two sides' },
  'bedroom-4d': { de: 'Alte Blockwand, warmes Licht und ein Ausstellungsplakat aus Kitzbühel (1997)', en: 'Old log wall, warm light and an exhibition poster from Kitzbühel (1997)' },
  'balcony': { de: 'Blick vom Balkon über den Garten zu den Bergen', en: 'View from the balcony over the garden to the mountains' },
  'bath': { de: 'Badezimmer mit Holz und Glaswaschbecken', en: 'Bathroom in timber with a glass washbasin' },
  'bath-2': { de: 'Bad mit Natursteinbecken und Handtuchheizkörper', en: 'Bathroom with a natural-stone basin and heated towel rail' },
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
