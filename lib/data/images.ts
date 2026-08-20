/**
 * Rentora Mobility — Centralized Image Asset System
 *
 * This module provides a single source of truth for all image assets.
 * It supports:
 *  - Real local car images (mapped by slug when confidently identified)
 *  - Real local destination images (mapped by slug when confidently identified)
 *  - Chauffeur images
 *  - SVG category fallbacks
 *  - Future image additions
 *
 * Priority order for car images:
 *   1. Real local car image (if mapped)
 *   2. Category SVG fallback
 *   3. Placeholder SVG
 *
 * Priority order for destination images:
 *   1. Real local destination image (if mapped)
 *   2. Destination SVG fallback
 */

export type ImageVariant = 'hero' | 'gallery' | 'thumb';

/* ------------------------------------------------------------------ */
/*  Local image directory listings                                     */
/* ------------------------------------------------------------------ */

/**
 * Real car images available in /public/images/cars/.
 *
 * This array is the SAFE DETERMINISTIC FALLBACK pool. It intentionally contains
 * only generic "fleet"/showroom photographs that do not clearly identify as a
 * specific unrelated model — so a random car never displays another model's
 * image. Specific, confidently-identified model photos live in CAR_IMAGE_MAP
 * below and are used exclusively for their matching car.
 */
export const LOCAL_CAR_IMAGES: string[] = [
  '/images/cars/fleet.jpg',
  '/images/cars/fleet (2).jpg',
  '/images/cars/fleet (3).jpg',
];

/**
 * Every real destination image discovered in /public/images/destinations/.
 *
 * This list is GENERATED at build time (see scripts/generate-destination-images.mjs
 * and the "build"/"predev" wiring) from the actual folder contents, so no valid
 * supplied image (.jpg, .jpeg, .png, .webp, .jfif) is ever silently ignored.
 * Files whose filename does not clearly identify a city (the bulk
 * "download (6)-images-*" photographs and the few ambiguous .jfif/.png files)
 * live here as the deterministic fallback pool; confidently identified city
 * photographs are resolved through DESTINATION_IMAGE_MAP and
 * DESTINATION_CITY_TOKENS so a destination never shows the wrong city.
 */
import { LOCAL_DESTINATION_IMAGES } from './destination-images.generated';

/**
 * Generic, unidentifiable supplied photographs (the original "download (6)-images-*"
 * batch). These are used as the deterministic fallback for routes that have NO
 * supplied photo clearly depicting their destination city (e.g. Pune, Goa). Using
 * only this generic pool guarantees a card never shows ANOTHER city's identifiable
 * photograph — the "never map a wrong city" rule — while still rendering a real
 * local supplied image rather than a missing/broken path.
 */
export const DESTINATION_GENERIC_POOL: string[] = LOCAL_DESTINATION_IMAGES.filter((p) =>
  /download \(6\)-images-/i.test(p.split('/').pop() || '')
);

/**
 * All chauffeur images available in /public/images/chauffers/
 */
export const CHAUFFEUR_IMAGES: string[] = [
  '/images/chauffers/download (6)-images-19.jpg',
  '/images/chauffers/download (6)-images-20.jpg',
  '/images/chauffers/download (6)-images-44.jpg',
  '/images/chauffers/download (6)-images-48.jpg',
  '/images/chauffers/download (6)-images-56.jpg',
  '/images/chauffers/image_15b575c9 (1).png',
  // New local chauffeur/comfort photographs (added this batch).
  '/images/chauffers/ChatGPT Image Aug 15, 2026, 01_00_29 PM.png',
  '/images/chauffers/ChatGPT Image Aug 15, 2026, 01_13_37 PM.png',
  '/images/chauffers/ChatGPT Image Aug 15, 2026, 01_16_20 PM.png',
  '/images/chauffers/ChatGPT Image Aug 15, 2026, 01_17_53 PM.png',
  '/images/chauffers/ChatGPT Image Aug 15, 2026, 12_46_17 PM.png',
  '/images/chauffers/ChatGPT Image Aug 15, 2026, 12_49_56 PM (1).png',
];

/**
 * Feature chauffeur images used in the premium split-section slider.
 * These are the "3 best-looking" chauffeur/customer-comfort images.
 * Update this array to change the slider contents.
 */
export const CHAUFFEUR_FEATURE_IMAGES: string[] = [
  '/images/chauffers/image_15b575c9 (1).png',
  '/images/chauffers/download (6)-images-19.jpg',
  '/images/chauffers/download (6)-images-20.jpg',
];

/* ------------------------------------------------------------------ */
/*  Identified image mappings                                          */
/* ------------------------------------------------------------------ */

/**
 * Maps car slugs to real local car images.
 * Only add entries here when the image has been confidently identified.
 * Currently empty — all local car JPGs have generic filenames and
 * cannot be confidently identified without visual inspection.
 */
/**
 * Maps car slugs (base model slug) to confident local car images.
 * Only entries whose image clearly shows the matching model are added.
 * Keys use the BASE slug (e.g. 'honda-city') so both legacy cars and the
 * generated city-variant cars resolve to the correct photograph.
 */
export const CAR_IMAGE_MAP: Record<string, string> = {
  'maruti-dzire': '/images/cars/suzuki swift dzire.jpg',
  'honda-city': '/images/cars/hondai city.jpg',
  'toyota-innova-crysta': '/images/cars/toyota innova crysta.jpg',
  'toyota-innova-hycross': '/images/cars/toyota innova hycross.jpg',
  'toyota-fortuner': '/images/cars/toyota fortuner (2).jpg',
};

/**
 * Maps destination slugs to real local destination images.
 * Only add entries here when the image has been confidently identified.
 * Currently empty — all local destination JPGs have generic filenames
 * and cannot be confidently identified without visual inspection.
 */
/**
 * Confidently identified real local destination photographs. Each image's
 * filename clearly names the city it depicts, so it is mapped ONLY to the
 * matching destination/route — a city never shows another city's image.
 */
export const DESTINATION_IMAGE_MAP: Record<string, string> = {
  'delhi-jaipur': '/images/destinations/jaipur-rajasthan.jpg',
  'delhi-agra': '/images/destinations/agra.jpg',
  'delhi-udaipur': '/images/destinations/udaipur-city-of-lakes.jpg',
  'jaipur-udaipur': '/images/destinations/udaipur-city-of-lakes.jpg',
};

/**
 * City-name tokens used to discover a correctly-matching supplied image for a
 * route/destination by scanning LOCAL_DESTINATION_IMAGES. This keeps mapping
 * robust to the exact supplied filename (e.g. jaipur.jpg, jaipur.jfif and
 * jaipur-rajasthan.jpg all resolve to the Jaipur routes; agra.jpg / aagra.jpg
 * both resolve to the Agra route).
 */
const DESTINATION_CITY_TOKENS: Record<string, string[]> = {
  'delhi-jaipur': ['jaipur'],
  'delhi-agra': ['agra'],
  'mumbai-pune': ['pune'],
  'bangalore-goa': ['goa'],
  'delhi-udaipur': ['udaipur'],
  'jaipur-udaipur': ['udaipur'],
};

/* ------------------------------------------------------------------ */
/*  Promotional creative assets                                        */
/* ------------------------------------------------------------------ */

/**
 * Promotional creatives.
 *
 * ⚠️ CURRENTLY EMPTY — the 3 promotional images have NOT been provided
 * in the project. Place them at exactly these paths, then add the paths
 * to this array (or the matching UI section will have nothing to show):
 *
 *   public/images/promotions/promo-1.jpg
 *   public/images/promotions/promo-2.jpg
 *   public/images/promotions/promo-3.jpg
 *
 * Do NOT substitute other images in their place.
 */
export const PROMOTIONAL_IMAGES: string[] = [];

/**
 * Get the promotional creative images (empty until provided by the client).
 */
export function getPromotionalImages(): string[] {
  return PROMOTIONAL_IMAGES;
}

/* ------------------------------------------------------------------ */
/*  SVG fallback assets                                                */
/* ------------------------------------------------------------------ */

const CATEGORY_SVG_MAP: Record<string, string> = {
  economy: '/images/cars/economy.svg',
  sedan: '/images/cars/sedan.svg',
  hatchback: '/images/cars/economy.svg',
  suv: '/images/cars/suv.svg',
  premium: '/images/cars/premium.svg',
  luxury: '/images/cars/luxury.svg',
  electric: '/images/cars/electric.svg',
  'executive vans': '/images/cars/van.svg',
  vans: '/images/cars/van.svg',
};

const PLACEHOLDER_SVG = '/images/cars/placeholder.svg';

const DESTINATION_SVG_MAP: Record<string, string> = {
  'delhi-jaipur': '/images/destinations/delhi-jaipur.svg',
  'delhi-agra': '/images/destinations/delhi-agra.svg',
  'bangalore-goa': '/images/destinations/bangalore-goa.svg',
  'delhi-udaipur': '/images/destinations/delhi-udaipur.svg',
  'jaipur-udaipur': '/images/destinations/jaipur-udaipur.svg',
};

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

/**
 * Deterministic string hash — keeps the same car/destination on the same
 * real photo across renders and across rebuilds.
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash || 1);
}

/**
 * Get the best available image for a car.
 * Priority: explicit mapping → real local photo (display) → category SVG → placeholder.
 *
 * Per client direction (Option C): real local photographs are used as display
 * images even when the exact model cannot be verified from the generic filename.
 * Vehicle identity/data is never changed — the image asset is independent.
 */
export function getCarAssetPath(
  car: { slug: string; category?: string },
  variant: ImageVariant = 'hero'
): string {
  // 1. Explicitly mapped real local image (confidently identified)
  const mappedImage = CAR_IMAGE_MAP[car.slug];
  if (mappedImage) return mappedImage;

  // 2. Deterministic real local photograph (display image)
  if (car.slug && LOCAL_CAR_IMAGES.length > 0) {
    const index = hashString(car.slug) % LOCAL_CAR_IMAGES.length;
    return LOCAL_CAR_IMAGES[index];
  }

  // 3. Category SVG fallback (only when no real photo is available)
  const categoryKey = (car.category || 'Premium').toLowerCase();
  const categorySvg = CATEGORY_SVG_MAP[categoryKey];
  if (categorySvg) return categorySvg;

  // 4. Placeholder SVG
  return PLACEHOLDER_SVG;
}

/**
 * Get the best available image for a destination.
 * Priority: explicit mapping → real local photo (display) → destination SVG.
 *
 * Per client direction (Option C): real local photographs are used as display
 * images even when the exact city cannot be verified from the generic filename.
 * Destination identity/data is never changed — the image asset is independent.
 */
export function getDestinationAssetPath(slug: string): string {
  // 1. Filename-token discovery across the supplied image pool. This is the
  //    primary mechanism and is robust to the EXACT supplied filename: e.g.
  //    jaipur.jpg / jaipur.jfif / jaipur-rajasthan.jpg all resolve to the
  //    Jaipur routes, and agra.jpg / agra (2).jpg / agra taj-e-mehal.jpg all
  //    resolve to the Agra route. Because LOCAL_DESTINATION_IMAGES is generated
  //    from the live folder at build time, the match is always an existing file.
  //    A city never resolves to another city's image because the tokens are the
  //    destination city names themselves.
  const tokens = DESTINATION_CITY_TOKENS[slug];
  if (tokens && LOCAL_DESTINATION_IMAGES.length > 0) {
    const match = LOCAL_DESTINATION_IMAGES.find((p) => {
      const base = p.toLowerCase().split('/').pop()!.replace(/\.[^.]+$/, '');
      return tokens.some((t) => base.includes(t));
    });
    if (match) return match;
  }

  // 2. Explicit confidently-identified mapping (filename clearly names the city).
  const mappedImage = DESTINATION_IMAGE_MAP[slug];
  if (mappedImage) return mappedImage;

  // 3. Generic, unidentifiable supplied photograph. Used for routes that have no
  //    supplied photo clearly depicting their destination city (e.g. Pune, Goa).
  //    Restricted to the generic pool so a card never shows ANOTHER city's
  //    identifiable image ("never map a wrong city"), while still rendering a
  //    real local supplied image rather than a missing/broken path.
  if (DESTINATION_GENERIC_POOL.length > 0) {
    const index = hashString(slug) % DESTINATION_GENERIC_POOL.length;
    return DESTINATION_GENERIC_POOL[index];
  }

  // 4. Destination SVG fallback (only when no real photo is available).
  const svg = DESTINATION_SVG_MAP[slug];
  if (svg) return svg;

  // 5. Generic destination SVG.
  return '/images/destinations/delhi-jaipur.svg';
}

/**
 * Get multiple distinct real local car photos for a car gallery.
 * Uses deterministic rotation so the same car always gets the same set.
 */
export function getCarGalleryImages(car: { slug: string; category?: string }, count = 3): string[] {
  if (LOCAL_CAR_IMAGES.length === 0) {
    const fallback = getCarAssetPath(car);
    return [fallback];
  }
  const base = hashString(car.slug);
  const images: string[] = [];
  for (let i = 0; i < Math.min(count, LOCAL_CAR_IMAGES.length); i++) {
    const index = (base + i * 7) % LOCAL_CAR_IMAGES.length;
    const img = LOCAL_CAR_IMAGES[index];
    if (!images.includes(img)) images.push(img);
  }
  return images;
}

/**
 * Get a chauffeur image by index (cycled).
 */
export function getChauffeurAssetPath(index: number): string {
  if (CHAUFFEUR_IMAGES.length === 0) return '/images/cars/placeholder.svg';
  return CHAUFFEUR_IMAGES[index % CHAUFFEUR_IMAGES.length];
}

/**
 * Get all chauffeur images.
 */
export function getAllChauffeurImages(): string[] {
  return CHAUFFEUR_IMAGES;
}

/**
 * Get the feature chauffeur images for the premium split-section slider.
 */
export function getChauffeurFeatureImages(): string[] {
  return CHAUFFEUR_FEATURE_IMAGES;
}

/**
 * List of local car images that could not be confidently identified.
 * These need visual inspection before being mapped in CAR_IMAGE_MAP.
 */
export const UNIDENTIFIED_CAR_IMAGES: string[] = [...LOCAL_CAR_IMAGES];

/**
 * List of local destination images that could not be confidently mapped to a
 * specific destination/city. These are real supplied photographs whose filename
 * does not clearly identify a city (the generic "download (6)-images-*" pool and
 * a few ambiguous .jfif/.png files) and are therefore only used as generic
 * display fallbacks — never as a specific city's hero image.
 */
export const UNIDENTIFIED_DESTINATION_IMAGES: string[] = LOCAL_DESTINATION_IMAGES.filter(
  (p) =>
    !/(\bjaipur\b|\bagra\b|\budaipur\b|\bmumbai\b|\bgateway-of-india\b|\bdelhi\b)/i.test(
      p.toLowerCase().split('/').pop()!.replace(/\.[^.]+$/, '')
    )
);