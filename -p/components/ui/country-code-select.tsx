'use client';

import * as React from 'react';
import { getCountries, getCountryCallingCode } from 'libphonenumber-js';
import { ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

function countryFlag(code: string): string {
  return code
    .toUpperCase()
    .split('')
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join('');
}

function countryName(code: string): string {
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(code.toUpperCase()) || code;
  } catch {
    return code;
  }
}

function getCountryLabel(code: string): string {
  try {
    const callingCode = getCountryCallingCode(code as any);
    return `${countryFlag(code)} +${callingCode}`;
  } catch {
    return `${countryFlag(code)}`;
  }
}

export interface CountryOption {
  code: string;
  name: string;
  callingCode: string;
  flag: string;
}

const COUNTRIES_CACHE: CountryOption[] = [];

function getCountriesList(): CountryOption[] {
  if (COUNTRIES_CACHE.length > 0) return COUNTRIES_CACHE;
  const list: CountryOption[] = [];
  for (const code of getCountries()) {
    try {
      const callingCode = getCountryCallingCode(code as any);
      list.push({ code, name: countryName(code), callingCode, flag: countryFlag(code) });
    } catch {
      list.push({ code, name: countryName(code), callingCode: '', flag: countryFlag(code) });
    }
  }
  list.sort((a, b) => a.name.localeCompare(b.name));
  COUNTRIES_CACHE.push(...list);
  return COUNTRIES_CACHE;
}

const ALL_COUNTRIES = getCountriesList();
const DEFAULT_COUNTRY = 'IN';

export interface CountryCodeSelectProps {
  value: string;
  onChange: (countryCode: string, callingCode: string) => void;
  placeholder?: string;
  error?: boolean;
  className?: string;
}

export function CountryCodeSelect({
  value = DEFAULT_COUNTRY,
  onChange,
  placeholder = 'Select country',
  error,
  className,
}: CountryCodeSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const selected = ALL_COUNTRIES.find((c) => c.code === value) ?? ALL_COUNTRIES.find((c) => c.code === DEFAULT_COUNTRY)!;
  const selectedLabel = selected ? `${selected.flag} +${selected.callingCode}` : '';

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return ALL_COUNTRIES;
    return ALL_COUNTRIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.callingCode.includes(q)
    );
  }, [search]);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (country: CountryOption) => {
    onChange(country.code, country.callingCode);
    setOpen(false);
    setSearch('');
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center gap-1 rounded-xl border bg-background px-2 py-1.5 text-sm outline-none transition-colors',
          error ? 'border-red-500' : 'border-border focus-within:border-gold',
          className
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="text-lg leading-none">{selected?.flag ?? countryFlag(DEFAULT_COUNTRY)}</span>
        <span>+{selected?.callingCode ?? '91'}</span>
        <ChevronDown className="h-3 w-3 opacity-50" />
      </button>

      {open && (
        <div className="absolute top-full left-0 z-[200] mt-1 w-64 rounded-xl border border-border bg-popover shadow-xl">
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-6 py-1.5 text-xs outline-none focus:border-gold"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto py-1">
            {filtered.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => handleSelect(country)}
                className="w-full px-3 py-1.5 flex items-center gap-2 text-left hover:bg-accent focus:bg-accent focus:outline-none"
              >
                <span className="text-lg leading-none">{country.flag}</span>
                <span className="flex-1 text-sm">{country.name}</span>
                <span className="text-xs text-muted-foreground">+ {country.callingCode}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
