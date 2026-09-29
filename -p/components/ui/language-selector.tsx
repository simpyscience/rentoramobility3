'use client';

import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { LOCALES, LOCALE_LABELS, LOCALE_COOKIE, type Locale } from '@/lib/i18n/types';
import { t } from '@/lib/i18n/dictionary';
import { useLocale } from '@/lib/i18n/client';

export { useLocale };

export function LanguageSelector() {
  const locale = useLocale();

  function changeLocale(next: string) {
    const d = new Date();
    d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000);
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; expires=${d.toUTCString()}; SameSite=Lax`;
    window.location.reload();
  }

  const currentLabel = LOCALE_LABELS[(locale as Locale)] ?? LOCALE_LABELS.en;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm font-medium text-foreground/80 hover:border-gold hover:text-gold transition-colors"
          aria-label="Select language"
          title="Language"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLabel}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>{t('common.selectLanguage', { locale: locale as Locale })}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LOCALES.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onSelect={() => changeLocale(loc)}
            className="flex items-center justify-between"
          >
            <span>{LOCALE_LABELS[loc]}</span>
            {locale === loc && <span className="text-xs">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
