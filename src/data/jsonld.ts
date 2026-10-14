import { PROPERTY, AMENITIES } from './property';
import { FROM_PRICE } from './rates';
import { ROUTES, type Lang } from '../i18n/routes';

const SITE = 'https://www.ferienhaus-untermoos.at';

/** Schema.org VacationRental with one Accommodation (whole house). Facts only – no ratings. */
export function rentalJsonLd(lang: Lang, description: string) {
  const p = PROPERTY;
  return {
    '@context': 'https://schema.org',
    '@type': 'VacationRental',
    '@id': `${SITE}/#untermoos`,
    name: 'Untermoos',
    alternateName: [...p.legacyNames],
    description,
    url: SITE + ROUTES.home[lang],
    inLanguage: lang === 'de' ? 'de-AT' : 'en',
    identifier: 'untermoos-glatzham-28',
    address: {
      '@type': 'PostalAddress',
      streetAddress: p.address.street,
      postalCode: p.address.postalCode,
      addressLocality: p.address.locality,
      addressRegion: p.address.region,
      addressCountry: p.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: p.geo.lat, longitude: p.geo.lng, elevation: p.elevationM },
    telephone: p.host.phone,
    email: p.host.email,
    checkinTime: '16:00',
    checkoutTime: '10:00',
    petsAllowed: true,
    priceRange: lang === 'de' ? `ab € ${FROM_PRICE} pro Nacht (ganzes Haus)` : `from €${FROM_PRICE} per night (whole house)`,
    containsPlace: {
      '@type': 'Accommodation',
      additionalType: 'EntireHouse',
      name: lang === 'de' ? 'Ganzes Bauernhaus' : 'Entire farmhouse',
      numberOfBedrooms: p.bedrooms,
      numberOfBathroomsTotal: p.bathrooms,
      numberOfRooms: p.bedrooms,
      bed: { '@type': 'BedDetails', numberOfBeds: p.beds },
      occupancy: { '@type': 'QuantitativeValue', maxValue: p.maxGuests },
      floorSize: { '@type': 'QuantitativeValue', value: p.areaM2, unitCode: 'MTK' },
      amenityFeature: AMENITIES[lang].map((name) => ({ '@type': 'LocationFeatureSpecification', name, value: true })),
      petsAllowed: true,
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: SITE + it.path })),
  };
}

export function faqJsonLd(faq: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}
