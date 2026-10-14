/**
 * Property facts. Source of truth for copy, structured data and the enquiry form.
 * Every fact carries its source. `confirm: true` = must be confirmed by the host before go-live.
 * Research date: 13 Oct 2026 (owner website ferienhaus-untermoos.at, owner house description (Word, 14 Oct 2026), alpbachtal.at listing,
 * Belvilla/Booking.com listing data, Land Tirol). Full source list in the strategy documents (not in this repository).
 */
export const PROPERTY = {
  name: 'Untermoos',
  legacyNames: ['Ferienhaus Untermoos', 'Bauernhaus Untermoos'],
  address: {
    street: 'Glatzham 28',
    postalCode: '6252',
    locality: 'Breitenbach am Inn',
    region: 'Tirol',
    country: 'AT',
  },
  geo: { lat: 47.497839, lng: 12.005013 }, // Booking.com listing coordinates
  coordsLabel: '47°29′52″ N · 12°00′18″ E',
  elevationM: 650, // owner house description: "auf einer Anhöhe von 650 Metern" (older owner website: ca. 640 m)
  ageYears: 200, // owner/listing text: "200 Jahre altes Bauernhaus"
  areaM2: 300, // owner website
  maxGuests: 10, // owner website (plus 1 baby cot per chalet.nu – confirm)
  beds: 10,
  bedrooms: 4, // 1 double on the ground floor, 3 rooms upstairs (2 + 2 + 4 beds)
  bathrooms: 2, // owner homepage "2 Badezimmer, 4 WCs"; gallery: extra bathroom since spring 2026 → confirm 2 or 3
  wcs: 4,
  confirm: ['bathrooms', 'checkIn', 'petFee', 'playground'], // baby cot + high chair confirmed in the owner description
  checkIn: '15:00–20:00', // alpbachtal.at listing (former agency listing: 16:00) – confirm
  checkOut: 'bis 10:00',
  dogsMax: 2,
  touristTaxPerPersonNight: 3.5, // TVB Alpbachtal, since 1 Dec 2023; children exempt until end of the year they turn 15
  touristTaxNote: {
    de: 'Ortstaxe € 3,50 pro Person ab 15 Jahren und Nacht (TVB Alpbachtal)',
    en: 'Local tourist tax €3.50 per person aged 15+ per night (TVB Alpbachtal)',
  },
  host: {
    // From the current Impressum – confirm before go-live.
    name: 'Sonja Ruprechter',
    company: 'Ferienhaus Untermoos',
    email: 'sonja.ruprechter@icloud.com',
    phone: '+43 664 2386180',
    phoneDisplay: '+43 664 23 86 180',
    authority: 'Bezirkshauptmannschaft Kufstein',
  },
} as const;

/** Rooms – owner website (gallery) + owner floor plans (docs/plans). */
export const ROOMS = [
  {
    key: 'stube', floor: 'eg', beds: 0,
    de: { title: 'Tiroler Bauernstube', text: 'Holzvertäfelt, mit Kachelofen und Ofenbank, der großen Eckbank und dem Jogltisch – gemacht für lange Abende.' },
    en: { title: 'Tyrolean Stube', text: 'Wood-panelled, with the tiled stove and its bench, the large corner bench and a traditional farmhouse table – made for long evenings.' },
  },
  {
    key: 'kitchen', floor: 'eg', beds: 0,
    de: { title: 'Küche mit Holzherd', text: 'Voll ausgestattet: Elektroherd, Kühlschrank, Gefrierschrank, Geschirrspüler, Kaffeemaschine, Wasserkocher, Mikrowelle – und der alte Holzherd zum Heizen, Kochen und Backen. An der Eckbank mit dem großen Holztisch haben zehn Personen Platz, ein Hochstuhl steht auf Wunsch bereit.' },
    en: { title: 'Kitchen with wood range', text: 'Fully equipped: electric cooker, fridge, freezer, dishwasher, coffee machine, kettle, microwave – plus the old wood-fired range for heating, cooking and baking. The corner bench and the big wooden table seat ten, and a high chair is available on request.' },
  },
  {
    key: 'bedroom-1', floor: 'eg', beds: 2,
    de: { title: 'Doppelzimmer im Erdgeschoss', text: 'Doppelbett und Sitzecke – ideal für Großeltern oder alle, die keine Treppe möchten.' },
    en: { title: 'Ground-floor double room', text: 'A double bed and a small seating corner – ideal for grandparents or anyone who prefers no stairs.' },
  },
  {
    key: 'bath', floor: 'eg', beds: 0,
    de: { title: 'Bad, WC & Speisekammer', text: 'Badezimmer mit Badewanne, Dusche, Waschbecken und WC, dazu ein separates WC. Nebenan Waschmaschine und Wäschetrockner sowie eine Speisekammer mit Abstellraum.' },
    en: { title: 'Bathroom, WC & pantry', text: 'A bathroom with bathtub, shower, washbasin and WC, plus a separate WC. Next door: washing machine and tumble dryer, and a pantry with storage room.' },
  },
  {
    key: 'bedroom-2', floor: 'og', beds: 4,
    de: { title: 'Familienzimmer', text: 'Das größte Zimmer: Doppelbett und zwei Einzelbetten, genug Platz für zwei Erwachsene und zwei Kinder. Ein Babybett kann dazugestellt werden.' },
    en: { title: 'Family room', text: 'The largest room: a double bed and two single beds, with plenty of space for two adults and two children. A baby cot can be added.' },
  },
  {
    key: 'bedroom-3', floor: 'og', beds: 2,
    de: { title: 'Zweibettzimmer', text: 'Zwei Einzelbetten und ein Sofa.' },
    en: { title: 'Two-bed room', text: 'Two single beds and a sofa.' },
  },
  {
    key: 'bedroom-4', floor: 'og', beds: 2,
    de: { title: 'Doppelzimmer im Obergeschoss', text: 'Doppelbett und Sitzecke zwischen alten Blockwänden, darüber eine Altholzdecke – abends mit indirektem Licht.' },
    en: { title: 'First-floor double room', text: 'A double bed and a seating corner between old log walls beneath an old timber ceiling, with soft indirect light in the evening.' },
  },
  {
    key: 'balcony', floor: 'og', beds: 0,
    de: { title: 'Balkon, Hausgang & neues Bad', text: 'Der Holzbalkon läuft über die ganze Front. Im oberen Hausgang steht eine gemütliche Eckbank mit Tisch und zwei Stühlen; seit Frühjahr 2026 gibt es zusätzlich ein Bad mit Dusche und WC.' },
    en: { title: 'Balcony, hallway & new bathroom', text: 'The timber balcony runs the full width of the house. The upstairs hallway has a cosy corner bench with a table and two chairs, and since spring 2026 there is an additional bathroom with shower and WC.' },
  },
] as const;

/** Equipment list – owner site + listing data. */
export const AMENITIES = {
  de: [
    'Kachelofen mit Ofenbank', 'Alter Holzherd', 'Pelletofen im Hausgang', 'Heizpaneele in allen Schlafzimmern', 'Voll ausgestattete Küche', 'Geschirrspüler',
    'Kaffeemaschine', 'Speisekammer', 'Waschmaschine & Wäschetrockner', 'WLAN (kostenlos)', 'Sat-TV & Stereoanlage', 'Bücherkasten zum Schmökern', 'Dartecke',
    'Holzbalkon über die ganze Front', 'Eckbank im oberen Hausgang', 'Sonnenterrasse', 'Garten mit Holz-Sitzgarnitur und Sonnenschirm', 'Liegestühle', 'Weber-Grill', 'Spielplatz', 'Eingezäunter Bereich für Hunde',
    'Parkplätze direkt am Haus', 'Skiraum', 'Bettwäsche & Handtücher', 'Babybett & Hochstuhl auf Anfrage', 'Nichtraucherhaus', 'E-Auto laden möglich (nach Verbrauch)',
  ],
  en: [
    'Tiled stove with stove bench', 'Old wood-fired range', 'Pellet stove in the hallway', 'Heating panels in every bedroom', 'Fully equipped kitchen', 'Dishwasher',
    'Coffee machine', 'Pantry', 'Washing machine & tumble dryer', 'Free Wi-Fi', 'Satellite TV & stereo', 'Old bookcase full of books', 'Darts corner',
    'Timber balcony across the full front', 'Corner bench in the upstairs hallway', 'Sun terrace', 'Garden with wooden seating and parasol', 'Deck chairs', 'Weber barbecue', 'Playground', 'Fenced area for dogs',
    'Parking right at the house', 'Ski room', 'Bed linen & towels', 'Baby cot & high chair on request', 'Non-smoking house', 'EV charging possible (billed by use)',
  ],
} as const;
