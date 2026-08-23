/**
 * Rentora Mobility — Destination folder image discovery
 *
 * Public API for the automatically-discovered real photographs that live in
 * `public/images/destinations/<folder>/`. The folder contents are enumerated at
 * BUILD TIME by `scripts/generate-destination-images.mjs` (which runs as part
 * of `dev`, `build` and `typecheck`) and written to
 * `lib/data/destination-images.generated.ts` as `DESTINATION_FOLDER_IMAGES`.
 *
 * Why build-time discovery matters:
 *  - No individual image filenames are hardcoded; newly added photos are picked
 *    up automatically on the next build/dev run.
 *  - A destination that has a real folder uses THAT folder's photographs as its
 *    hero + gallery (no generic / wrong-city fallbacks).
 *  - Pune (`mumbai-pune`) and Goa (`bangalore-goa`) have no folder, so they
 *    return an empty list. They NEVER fall back to another destination's image.
 *  - Unrelated folders (ajmer, chandigarh, rajasthan, etc.) are discovered but
 *    never consumed — no new destination records are fabricated from them.
 *
 * This module is pure data (it only reads the generated const), so it imports no
 * Node `fs`/`path` and is safe to use in server and client code alike.
 */

import { DESTINATION_FOLDER_IMAGES } from '@/lib/data/destination-images.generated';

/**
 * Exact destination-slug → folder-name mapping for destinations that have a
 * real supplied-photograph folder. Cities with no folder (Pune, Goa) are
 * intentionally absent (returns undefined → empty list), per client direction.
 *
 * The folder keys mirror the real subfolder names on disk (including spaces,
 * e.g. 'jammu and kashmir', 'arunachal pradesh').
 */
const DESTINATION_FOLDER_BY_SLUG: Record<string, string | undefined> = {
  delhi: 'delhi',
  'delhi-jaipur': 'jaipur',
  'delhi-agra': 'agra',
  'delhi-udaipur': 'udaipur',
  'jaipur-udaipur': 'udaipur',
  mumbai: 'mumbai',
  varanasi: 'varanashi',
  jodhpur: 'jodhpur',
  jaisalmer: 'jaisalmer',
  kedarnath: 'kedarnath',
  'jammu-kashmir': 'jammu and kashmir',
  gurugram: 'gurugram',
  manali: 'manali',
  'arunachal-pradesh': 'arunachal pradesh',
  // Pune & Goa have no folder → undefined (empty list, no cross-city fallback).
  'mumbai-pune': undefined,
  'bangalore-goa': undefined,
};

/**
 * Return the real destination folder name for a slug, or `undefined` when the
 * destination has no dedicated folder (e.g. Pune, Goa, or any unmapped slug).
 */
export function getDestinationFolderName(slug: string): string | undefined {
  return DESTINATION_FOLDER_BY_SLUG[slug];
}

/**
 * Returns the automatically-discovered, URL-safe public paths of every supported
 * photograph in a destination's folder. Returns an empty array when:
 *  - the destination has no matching folder (Pune, Goa, unmapped slugs), or
 *  - the folder contains no supported image files.
 *
 * It NEVER returns images belonging to another destination.
 */
export function getDestinationImages(slug: string): string[] {
  const folder = DESTINATION_FOLDER_BY_SLUG[slug];
  if (!folder) return [];
  return DESTINATION_FOLDER_IMAGES[folder] ?? [];
}

/**
 * Returns a single primary image path for a destination, or `undefined` when the
 * destination has no folder images. Callers should fall back gracefully.
 */
export function getDestinationPrimaryImage(slug: string): string | undefined {
  return getDestinationImages(slug)[0];
}

/**
 * Returns true when the destination has at least one discovered folder image.
 */
export function hasDestinationImages(slug: string): boolean {
  return getDestinationImages(slug).length > 0;
}
