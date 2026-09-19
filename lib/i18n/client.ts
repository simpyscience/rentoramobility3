'use client';

import * as React from 'react';
import { LOCALE_COOKIE, DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/i18n/dictionary';

export function useLocale(): Locale {
  const [locale, setLocale] = React.useState<Locale>(DEFAULT_LOCALE);

  React.useEffect(() => {
    const match = document.cookie.match(new RegExp('(^| )' + LOCALE_COOKIE + '=([^;]+)'));
    const val = match ? decodeURIComponent(match[2]) : '';
    setLocale(val && LOCALES.includes(val as Locale) ? (val as Locale) : DEFAULT_LOCALE);
  }, []);

  return locale;
}
