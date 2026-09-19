export type Locale = 'en' | 'fr' | 'de' | 'es' | 'hi' | 'ar';

export const LOCALES: Locale[] = ['en', 'fr', 'de', 'es', 'hi', 'ar'];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  hi: 'हिन्दी',
  ar: 'العربية',
};

export const RTL_LOCALES: Locale[] = ['ar'];

export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_COOKIE = 'NEXT_LOCALE';

export const LOCALE_PATH_COOKIE = 'NEXT_URL_LOCALE';

export type Dictionary = Record<string, unknown>;
