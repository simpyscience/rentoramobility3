import { cookies } from 'next/headers';
import { LOCALE_COOKIE, DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/i18n/dictionary';

export function getLocale(): Locale {
  try {
    const cookieStore = cookies();
    const value = cookieStore.get(LOCALE_COOKIE)?.value;
    if (value && LOCALES.includes(value as Locale)) {
      return value as Locale;
    }
  } catch {
    // In some rendering contexts cookies() may not be available; fall back to default.
  }
  return DEFAULT_LOCALE;
}
