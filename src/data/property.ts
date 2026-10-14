/**
 * Property facts. Source of truth for copy, structured data and the enquiry form.
 * Every fact carries its source. `confirm: true` = must be confirmed by the host before go-live.
 * Research date: 13 Oct 2026 (owner website ferienhaus-untermoos.at, alpbachtal.at listing,
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
  elevationM: 640, // owner website: "auf ca. 640 m" (municipality 510 m)
  ageYears: 200, // owner/listing text: "200 Jahre altes Bauernhaus"
  areaM2: 300, // owner website
  maxGuests: 10, // owner website (plus 1 baby cot per chalet.nu – confirm)
  beds: 10,
  bedrooms: 4, // 1 double on the ground floor, 3 rooms upstairs (2 + 2 + 4 beds)
  bathrooms: 2, // owner homepage "2 Badezimmer, 4 WCs"; gallery: extra bathroom since spring 2026 → confirm 2 or 3
  wcs: 4,
  confirm: ['bathrooms', 'checkIn', 'petFee', 'babyCot', 'playground'],
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
    de: { title: 'Tiroler Bauernstube', text: 'Holzvertäfelt, mit Kachelofen und Ofenbank, der Eckbank und der langen Tafel für zehn Gäste. Sat-TV für den Abend.' },
    en: { title: 'Tyrolean Stube', text: 'Wood-panelled, with the tiled stove and its bench, a corner bench and the long table for ten guests. Satellite TV for the evening.' },
  },
  {
    key: 'kitchen', floor: 'eg', beds: 0,
    de: { title: 'Küche mit Holzherd', text: 'Voll ausgestattet: Elektroherd, Kühl-Gefrierkombination, Geschirrspüler, Kaffeemaschine, Wasserkocher, Mikrowelle – und der alte Holzherd zum Heizen, Kochen und Backen. Mit eigenem Esstisch.' },
    en: { title: 'Kitchen with wood range', text: 'Fully equipped: electric hob, fridge-freezer, dishwasher, coffee machine, kettle, microwave – plus the old wood-fired range for heating, cooking and baking. With its own dining table.' },
  },
  {
    key: 'bedroom-1', floor: 'eg', beds: 2,
    de: { title: 'Doppelzimmer im Erdgeschoss', text: 'Doppelbett und Sitzecke – ideal für Großeltern oder alle, die keine Treppe möchten.' },
    en: { title: 'Ground-floor double room', text: 'A double bed and a small seating corner – ideal for grandparents or anyone who prefers no stairs.' },
  },
  {
    key: 'bath', floor: 'eg', beds: 0,
    de: { title: 'Bad, WC & Abstellraum', text: 'Badezimmer mit Wanne, Dusche, Waschbecken und WC, dazu ein separates WC und ein Abstellraum.' },
    en: { title: 'Bathroom, WC & storage', text: 'A bathroom with tub, shower, washbasin and WC, plus a separate WC and a storage room.' },
  },
  {
    key: 'bedroom-2', floor: 'og', beds: 4,
    de: { title: 'Vierbettzimmer', text: 'Doppelbett und zwei Einzelbetten – Platz für die Kinder oder die Freundesrunde.' },
    en: { title: 'Four-bed room', text: 'A double bed and two single beds – room for the children or a group of friends.' },
  },
  {
    key: 'bedroom-3', floor: 'og', beds: 2,
    de: { title: 'Zweibettzimmer', text: 'Zwei Einzelbetten und ein Sofa.' },
    en: { title: 'Two-bed room', text: 'Two single beds and a sofa.' },
  },
  {
    key: 'bedroom-4', floor: 'og', beds: 2,
    de: { title: 'Doppelzimmer im Obergeschoss', text: 'Doppelbett, Sitzecke und Sofa zwischen alten Blockwänden.' },
    en: { title: 'First-floor double room', text: 'A double bed, a seating corner and a sofa between old log walls.' },
  },
  {
    key: 'balcony', floor: 'og', beds: 0,
    de: { title: 'Balkon, Hausgang & neues Bad', text: 'Der Holzbalkon läuft über die ganze Front. Im oberen Hausgang steht ein Schreibtisch; seit Frühjahr 2026 gibt es zusätzlich ein Bad mit Dusche und WC.' },
    en: { title: 'Balcony, hallway & new bathroom', text: 'The timber balcony runs the full width of the house. A desk stands in the upstairs hallway, and since spring 2026 there is an additional bathroom with shower and WC.' },
  },
] as const;

/** Equipment list – owner site + listing data. */
export const AMENITIES = {
  de: [
    'Kachelofen mit Ofenbank', 'Alter Holzherd', 'Pelletofen im Flur', 'Voll ausgestattete Küche', 'Geschirrspüler',
    'Kaffeemaschine', 'Waschküche mit Waschmaschine', 'WLAN (kostenlos)', 'Sat-TV', 'Bibliothek', 'Dartecke',
    'Holzbalkon über die ganze Front', 'Schreibtisch im oberen Hausgang', 'Sonnenterrasse mit Gartenmöbeln', 'Liegestühle', 'Garten mit Grill', 'Spielplatz', 'Eingezäunter Bereich für Hunde',
    'Parkplätze direkt am Haus', 'Skiraum', 'Bettwäsche & Handtücher', 'E-Auto laden möglich (nach Verbrauch)',
  ],
  en: [
    'Tiled stove with stove bench', 'Old wood-fired range', 'Pellet stove in the hallway', 'Fully equipped kitchen', 'Dishwasher',
    'Coffee machine', 'Laundry room with washing machine', 'Free Wi-Fi', 'Satellite TV', 'Library', 'Darts corner',
    'Timber balcony across the full front', 'Desk in the upstairs hallway', 'Sun terrace with garden furniture', 'Deck chairs', 'Garden with barbecue', 'Playground', 'Fenced area for dogs',
    'Parking right at the house', 'Ski room', 'Bed linen & towels', 'EV charging possible (billed by use)',
  ],
} as const;
