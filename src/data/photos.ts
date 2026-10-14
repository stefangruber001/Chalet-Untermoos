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
  'schnaps': { de: 'Untermoosschnaps: selbstgebrannter Obstler zur Begrüßung', en: 'Untermoosschnaps: the hosts’ home-distilled Obstler, as a welcome' },
  'view': { de: 'Blick über Wiesen und Wald auf die Berge', en: 'View across meadows and forest to the mountains' },
  'view-2': { de: 'Bergblick aus dem Garten', en: 'Mountain view from the garden' },
  'moor': { de: 'Moorweiher mit Seerosen und Bergspiegelung in der Umgebung', en: 'A moorland pond with water lilies and mountain reflections nearby' },
  'moor-2': { de: 'Wolken spiegeln sich im Moorweiher', en: 'Clouds reflected in the moorland pond' },
  'meadow': { de: 'Wiesen und Wald rund um den Weiler', en: 'Meadows and forest around the hamlet' },
  'trail': { de: 'Wanderwegweiser im Wald', en: 'A hiking signpost in the forest' },
  'stube': { de: 'Stube mit gelbem Kachelofen, Ofenbank, großer Eckbank und Jogltisch', en: 'The Stube with its yellow tiled stove, stove bench, large corner bench and farmhouse table' },
  'stube-2': { de: 'Der gelbe Kachelofen mit Ofenbank, davor der Jogltisch', en: 'The yellow tiled stove and its bench beside the farmhouse table' },
  'stube-3': { de: 'Durch die alte Holztür in die Stube', en: 'Through the old wooden door into the Stube' },
  'stube-4': { de: 'Schaukelstuhl, Anrichte und Geweihe in der Stube', en: 'Rocking chair, sideboard and antlers in the Stube' },
  'kachelofen': { de: 'Die Ofenbank am Kachelofen mit Hirsch-Kissen', en: 'The bench around the tiled stove with stag cushions' },
  'kitchen': { de: 'Küche mit altem Holzherd und Esstisch', en: 'The kitchen with its old wood-fired range and dining table' },
  'kitchen-2': { de: 'Die Küche: Eckbank, Esstisch, Elektro- und Holzherd', en: 'The kitchen: corner bench, dining table, electric and wood-fired range' },
  'kitchen-3': { de: 'Kochen wie früher: der Holzherd neben dem Cerankochfeld', en: 'Cooking as it used to be: the wood-fired range beside the ceramic hob' },
  'tafel': { de: 'Der große Holztisch in der Küche: Platz für zehn an Eckbank und bemalten Stühlen', en: 'The big wooden kitchen table: room for ten on the corner bench and painted chairs' },
  'hausgang': { de: 'Hausgang mit bemalter Truhe, Pelletofen und Haustür mit Hirsch', en: 'The hallway with painted chest, pellet stove and the stag front door' },
  'entrance-hall': { de: 'Durch die rote Haustür in den Hausgang mit Treppe und Dartscheibe', en: 'Through the red front door into the hallway with staircase and dartboard' },
  'stove': { de: 'Pelletofen und bemalte Truhe im Hausgang', en: 'Pellet stove and painted chest in the hallway' },
  'kasten-1895': { de: 'Bemalter Bauernkasten von 1895 an der alten Blockwand', en: 'A painted farmhouse wardrobe from 1895 against the old log wall' },
  'eckbank': { de: 'Eckbank mit Tisch im oberen Hausgang, an der alten Blockwand', en: 'Corner bench and table in the upstairs hallway, against the old log wall' },
  'eckbank-2': { de: 'Oberer Hausgang: Eckbank, Bauernkasten und alte Holztüren', en: 'Upstairs hallway: corner bench, farmhouse wardrobe and old wooden doors' },
  'wardrobe': { de: 'Geschnitzter Bauernkasten mit Rosetten im Zweibettzimmer', en: 'Carved farmhouse wardrobe with rosettes in the twin room' },
  'bedroom-1': { de: 'Doppelzimmer mit Eisenbett und Kristallluster', en: 'Double room with iron bed and crystal chandelier' },
  'bedroom-1b': { de: 'Doppelzimmer mit Sitzecke und Holzdecke', en: 'Double room with seating corner and timber ceiling' },
  'bedroom-1c': { de: 'Korbsessel in der Sitzecke des Doppelzimmers', en: 'Wicker chairs in the seating corner of the double room' },
  'bedroom-1d': { de: 'Eisenbett mit Baldachin, Kristallluster und Holztruhe', en: 'Iron bed with canopy, crystal chandelier and wooden chest' },
  'bedroom-1e': { de: 'Korbsessel und blaue Glasvase in der Sitzecke', en: 'Wicker chair and blue glass vase in the seating corner' },
  'bedroom-2': { de: 'Familienzimmer mit geschnitztem Doppelbett und Bauernkästen', en: 'Family room with carved double bed and farmhouse wardrobes' },
  'bedroom-2b': { de: 'Familienzimmer: Einzelbetten unter den Fenstern', en: 'Family room: single beds beneath the windows' },
  'bedroom-2c': { de: 'Einzelbett mit Blumenvorhängen', en: 'Single bed with floral curtains' },
  'bedroom-2d': { de: 'Familienzimmer: Doppelbett, zwei Einzelbetten und Fenster auf zwei Seiten', en: 'Family room: a double bed, two single beds and windows on two sides' },
  'bedroom-3': { de: 'Zweibettzimmer mit Holzbetten und Wandobjekten', en: 'Twin room with wooden beds and wall sculptures' },
  'bedroom-3b': { de: 'Zweibettzimmer mit Leselicht zwischen den Betten', en: 'Twin room with a reading light between the beds' },
  'bedroom-3c': { de: 'Blick ins Zweibettzimmer', en: 'A look into the twin room' },
  'bedroom-3d': { de: 'Zweibettzimmer mit Sofa und Bauernkasten', en: 'Twin room with sofa and farmhouse wardrobe' },
  'bedroom-4': { de: 'Doppelzimmer mit alten Blockwänden und indirektem Licht', en: 'Double room with old log walls and soft indirect light' },
  'bedroom-4b': { de: 'Sitzecke im Doppelzimmer mit Blockwänden', en: 'Seating corner in the log-walled double room' },
  'bedroom-4c': { de: 'Das Doppelzimmer mit Blockwänden: Bett, Sitzecke und Fenster auf zwei Seiten', en: 'The log-walled double room: bed, seating corner and windows on two sides' },
  'bedroom-4d': { de: 'Alte Blockwand, warmes Licht und ein Ausstellungsplakat aus Kitzbühel (1997)', en: 'Old log wall, warm light and an exhibition poster from Kitzbühel (1997)' },
  'balcony': { de: 'Blick vom Balkon über den Garten zu den Bergen', en: 'View from the balcony over the garden to the mountains' },
  'bath': { de: 'Badezimmer mit Holz und Glaswaschbecken', en: 'Bathroom in timber with a glass washbasin' },
  'bath-3': { de: 'Glaswaschbecken auf Massivholz', en: 'Glass basin on solid timber' },
  'bath-4': { de: 'Dusche und Spiegel im Bad', en: 'Shower and mirror in the bathroom' },
  'bath-5': { de: 'Glasdusche mit Bergsee-Motiv', en: 'Glass shower with a mountain-lake mural' },
  'bath-2': { de: 'Bad mit Waschbecken aus versteinertem Holz und Handtuchheizkörper', en: 'Bathroom with a petrified-wood basin and heated towel rail' },
  'deckchairs': { de: 'Zwei Liegestühle, zwei Gläser, ein Sommerabend', en: 'Two deck chairs, two glasses, a summer evening' },
  'terrace': { de: 'Gedeckter Tisch auf der Terrasse unter dem Sonnenschirm', en: 'A table laid on the terrace under the parasol' },
  'sculpture-wall': { de: 'Blaue Skulptur an der Hauswand', en: 'A blue sculpture on the house wall' },
  'visitor': { de: 'Besuch auf der Terrasse', en: 'A visitor on the terrace' },
  'stone-bench': { de: 'Bank aus Holz und Findlingen am Weg', en: 'A bench of timber and boulders by the lane' },
  'winter-snow': { de: 'Untermoos im Schnee', en: 'Untermoos in the snow' },
  'hosts': { de: 'Die Gastgeber auf der Bank im Garten', en: 'Your hosts on the garden bench' },
  'sculpture': { de: 'Steinskulptur im Garten', en: 'A stone sculpture in the garden' },
  'facade-summer': { de: 'Die Hausfront im Sommer: Terrasse mit Holzbänken, Blumen am Balkon', en: 'The front of the house in summer: terrace with wooden benches, flowers on the balcony' },
  'wildflowers': { de: 'Wildblumen vor dem Staketenzaun, dahinter das Bauernhaus', en: 'Wildflowers by the picket fence, the farmhouse behind' },
  'sculpture-fence': { de: 'Steinskulptur am Staketenzaun', en: 'A stone sculpture by the picket fence' },
  'sunset': { de: 'Abendrot über dem Bauernhaus', en: 'Sunset glow over the farmhouse' },
  'cows': { de: 'Kühe auf der Weide, dahinter Wald und Berge', en: 'Cows in the pasture, forest and mountains behind' },
  'cows-2': { de: 'Grasende Kühe vor bewaldeten Bergen', en: 'Cows grazing below wooded mountains' },
  'hallway-og': { de: 'Oberer Hausgang: alte Bauernkästen, bemalter Kasten und die Eckbank am Fenster', en: 'Upstairs hallway: old farmhouse wardrobes, a painted cupboard and the corner bench by the window' },
  'welcome': { de: 'Willkommen an der roten Haustür: Blumen, Gläser und der Untermoosschnaps', en: 'Welcome at the red front door: flowers, glasses and the Untermoosschnaps' },
  'welcome-glasses': { de: 'Schnapsgläser mit Münzen und ein „Welcome“ zur Begrüßung', en: 'Schnapps glasses with coin medallions and a “Welcome”' },
  'moor-meadow': { de: 'Moorwiese mit Weiher und Wald', en: 'Moorland meadow with pond and forest' },
  'track': { de: 'Feldweg über die Wiese, dahinter verschneite Gipfel', en: 'A farm track across the meadow, snow-capped peaks beyond' },
  'bath-basin': { de: 'Waschbecken aus versteinertem Holz auf der Holzablage', en: 'Petrified-wood basin on the timber shelf' },
  'edelweiss': { de: 'Edelweiß auf dem alten Stuhl an der Hauswand', en: 'Edelweiss on the old chair by the house wall' },
  'old-tree': { de: 'Alter Baum am Wiesenrand, dahinter verschneite Gipfel', en: 'An old tree at the edge of the meadow, snow-capped peaks beyond' },
  'fence-flowers': { de: 'Blumenwiese am Gartenzaun, dahinter Balkon und rote Haustür', en: 'Wildflowers along the garden fence, the balcony and red front door behind' },
  'alm': { de: 'Almwiesen mit Hütten zwischen bewaldeten Hängen', en: 'Alpine pastures with huts between wooded slopes' },
  'forest-path': { de: 'Markierter Wanderweg durch den Wald', en: 'A waymarked trail through the forest' },
  'wc': { de: 'Separates WC zwischen alten Holzwänden', en: 'A separate WC between old timber walls' },
  'bus-stop': { de: 'Bushaltestelle „Untermoos“, rund 250 m vom Haus', en: 'The “Untermoos” bus stop, about 250 m from the house' },
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
