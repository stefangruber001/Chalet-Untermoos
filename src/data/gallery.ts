import type { Slot } from './photos';

/**
 * Photo gallery (/bilder/, /en/photos/): one section per room or theme, in walking order.
 * Bedroom sections take their titles from ROOMS (property.ts), so a room swap changes both pages.
 * The first photo of each section is shown large.
 */
export type GallerySection = { id: string; room?: string; de?: string; en?: string; slots: Slot[] };

export const GALLERY: GallerySection[] = [
  { id: 'stube', room: 'stube', slots: ['stube', 'stube-2', 'kachelofen', 'stube-3', 'stube-4'] },
  { id: 'kueche', room: 'kitchen', slots: ['kitchen-2', 'kitchen', 'tafel', 'kitchen-3'] },
  { id: 'hausgang', de: 'Hausgang & Details', en: 'Hallways & details', slots: ['entrance-hall', 'hausgang', 'stove', 'kasten-1895', 'eckbank-2', 'eckbank'] },
  { id: 'doppelzimmer-eg', room: 'bedroom-1', slots: ['bedroom-1', 'bedroom-1b', 'bedroom-1d', 'bedroom-1c', 'bedroom-1e'] },
  { id: 'familienzimmer', room: 'bedroom-2', slots: ['bedroom-2d', 'bedroom-2', 'bedroom-2b', 'bedroom-2c'] },
  { id: 'zweibettzimmer', room: 'bedroom-3', slots: ['bedroom-3', 'bedroom-3d', 'bedroom-3b', 'bedroom-3c', 'wardrobe'] },
  { id: 'doppelzimmer-og', room: 'bedroom-4', slots: ['bedroom-4c', 'bedroom-4', 'bedroom-4b', 'bedroom-4d'] },
  { id: 'baeder', de: 'Bäder', en: 'Bathrooms', slots: ['bath', 'bath-3', 'bath-4', 'bath-2', 'bath-5'] },
  { id: 'draussen', de: 'Garten & Terrasse', en: 'Garden & terrace', slots: ['hero-summer', 'exterior', 'wildflowers', 'garden', 'deckchairs', 'terrace', 'facade-summer', 'entrance', 'table', 'sculpture-wall', 'sculpture-fence', 'visitor', 'balcony', 'deckchair', 'exterior-angle', 'sunset', 'garden-2', 'stone-bench', 'schnaps', 'table-detail', 'exterior-tree'] },
  { id: 'winter', de: 'Winter', en: 'Winter', slots: ['hero-winter', 'winter-snow'] },
  { id: 'umgebung', de: 'Umgebung', en: 'Surroundings', slots: ['view', 'view-2', 'cows', 'moor', 'moor-2', 'meadow', 'cows-2', 'trail'] },
];
