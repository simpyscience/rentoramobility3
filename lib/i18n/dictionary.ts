import type { Locale, Dictionary } from './types';
import {
  LOCALE_COOKIE,
  DEFAULT_LOCALE,
  RTL_LOCALES,
  LOCALES,
  LOCALE_LABELS,
} from './types';
import { en } from './dictionaries/en';
import { fr } from './dictionaries/fr';
import { de } from './dictionaries/de';
import { es } from './dictionaries/es';
import { hi } from './dictionaries/hi';
import { ar } from './dictionaries/ar';

export type { Locale, Dictionary, LOCALE_LABELS };
export { LOCALES, DEFAULT_LOCALE, RTL_LOCALES, LOCALE_COOKIE };

const DICTIONARIES: Record<Locale, Dictionary> = { en, fr, de, es, hi, ar };

function deepMerge(base: Dictionary, override: Dictionary): Dictionary {
  const result: Dictionary = { ...base };
  for (const key of Object.keys(override)) {
    const b = (result as Record<string, unknown>)[key];
    const o = (override as Record<string, unknown>)[key];
    if (b && typeof b === 'object' && !Array.isArray(b) && o && typeof o === 'object' && !Array.isArray(o)) {
      (result as Record<string, unknown>)[key] = deepMerge(b as Dictionary, o as Dictionary);
    } else {
      (result as Record<string, unknown>)[key] = o;
    }
  }
  return result;
}

export function getDictionary(locale: Locale): Dictionary {
  const dict = DICTIONARIES[locale];
  if (!dict) return DICTIONARIES[DEFAULT_LOCALE];
  return deepMerge(DICTIONARIES[DEFAULT_LOCALE], dict);
}

export function isRtl(locale: Locale): boolean {
  return (RTL_LOCALES as Locale[]).includes(locale);
}

function resolvePath(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export interface TOptions {
  locale?: Locale;
  vars?: Record<string, string | number>;
}

export function t(key: string, options: TOptions = {}): string {
  const locale: Locale = options.locale ?? DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  let value = resolvePath(dict, key);

  if (value === undefined) {
    const enDict = getDictionary(DEFAULT_LOCALE);
    value = resolvePath(enDict, key);
  }

  let result = typeof value === 'string' ? value : key;

  if (options.vars) {
    for (const [k, v] of Object.entries(options.vars)) {
      result = result.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }
  return result;
}
