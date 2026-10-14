/**
 * Travel times by car from Glatzham 28 (rounded up, "ca."). Sourced: Kufstein ≈ 21 min and
 * Innsbruck ≈ 44 min from Breitenbach village (Rome2Rio) + ~5 min for the hill road; all other
 * values are estimates to be checked once in Google Maps before go-live. Road distances from the owner's
 * house description: lakes 11 km, Kundler Klamm 7 km, SkiWelt 18 km, Ski Juwel 23 km, Kitzbühel 37 km,
 * Innsbruck 60 km, Munich 100 km, Salzburg 130 km.
 * Coordinates only position the dots by compass bearing on the schematic time map.
 */
export type PlaceKind = 'ski' | 'lake' | 'town' | 'travel' | 'nature';

export const PLACES: { key: string; min: number; lat: number; lng: number; kind: PlaceKind; de: string; en: string }[] = [
  { key: 'klamm', min: 10, lat: 47.452, lng: 12.016, kind: 'nature', de: 'Kundler Klamm', en: 'Kundl Gorge' },
  { key: 'berglstein', min: 15, lat: 47.466, lng: 11.94, kind: 'lake', de: 'Berglsteiner See', en: 'Lake Berglstein' },
  { key: 'woergl', min: 15, lat: 47.4895, lng: 12.06, kind: 'travel', de: 'Bahnhof Wörgl (ICE, Railjet)', en: 'Wörgl station (ICE, Railjet)' },
  { key: 'reintal', min: 15, lat: 47.465, lng: 11.904, kind: 'lake', de: 'Reintaler See', en: 'Lake Reintal' },
  { key: 'rattenberg', min: 20, lat: 47.4396, lng: 11.8949, kind: 'town', de: 'Rattenberg', en: 'Rattenberg' },
  { key: 'reith', min: 25, lat: 47.4202, lng: 11.8786, kind: 'ski', de: 'Ski Juwel – Reitherkogel', en: 'Ski Juwel – Reitherkogel' },
  { key: 'kufstein', min: 30, lat: 47.5833, lng: 12.1667, kind: 'town', de: 'Kufstein', en: 'Kufstein' },
  { key: 'alpbach', min: 30, lat: 47.398, lng: 11.944, kind: 'ski', de: 'Alpbach', en: 'Alpbach' },
  { key: 'soell', min: 25, lat: 47.5039, lng: 12.1919, kind: 'ski', de: 'SkiWelt Wilder Kaiser', en: 'SkiWelt Wilder Kaiser' },
  { key: 'zillertal', min: 40, lat: 47.35, lng: 11.85, kind: 'ski', de: 'Zillertal (Fügen)', en: 'Zillertal (Fügen)' },
  { key: 'innsbruck', min: 50, lat: 47.2692, lng: 11.4041, kind: 'town', de: 'Innsbruck', en: 'Innsbruck' },
  { key: 'kitzbuehel', min: 45, lat: 47.4467, lng: 12.3922, kind: 'ski', de: 'Kitzbühel', en: 'Kitzbühel' },
  { key: 'muenchen', min: 85, lat: 48.1351, lng: 11.582, kind: 'travel', de: 'München', en: 'Munich' },
  { key: 'muc', min: 105, lat: 48.3538, lng: 11.7861, kind: 'travel', de: 'Flughafen München', en: 'Munich Airport' },
];

export const KIND_LABEL: Record<PlaceKind, { de: string; en: string }> = {
  ski: { de: 'Ski', en: 'Ski' },
  lake: { de: 'See', en: 'Lake' },
  town: { de: 'Stadt', en: 'Town' },
  travel: { de: 'Anreise', en: 'Travel' },
  nature: { de: 'Natur', en: 'Nature' },
};
