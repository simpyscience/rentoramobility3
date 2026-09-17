import { CARS } from './cars';
import type { Car } from './cars';

export type ServiceTypeKey = 'local' | 'outstation' | 'airport' | 'wedding' | 'packages';

export const CHAUFFEUR_SERVICE_KEYS: readonly ServiceTypeKey[] = [
  'local',
  'outstation',
  'airport',
  'wedding',
  'packages',
];

export function isChauffeurServiceType(key: string | undefined): key is ServiceTypeKey {
  return typeof key === 'string' && (CHAUFFEUR_SERVICE_KEYS as readonly string[]).includes(key);
}

export const PLACEHOLDER = '—';

function fmt(value: string): string {
  if (value === PLACEHOLDER) return PLACEHOLDER;
  const num = Number(value);
  return Number.isNaN(num) ? value : `₹${num.toLocaleString('en-IN')}`;
}
function fmtUnit(value: string, unit: string): string {
  if (value === PLACEHOLDER) return PLACEHOLDER;
  const num = Number(value);
  return Number.isNaN(num) ? value : `₹${num.toLocaleString('en-IN')}/${unit}`;
}

export interface TariffValues {
  local: { pkg80: string; extraKm: string; extraHour: string };
  outstation: { perKm: string; minimumKm: string; minimum: string; driverAllowance: string; nightHalt: string };
  airport: { pickup: string; drop: string };
  wedding: { pkg8: string; pkg12: string; pkg24: string; pkg48: string; extraKm: string; extraHour: string };
  packages: { p1: string; p2: string; p3: string; p4: string };
}

export interface VehicleTariff extends TariffValues {
  slug: string;
  vehicle: string;
}

export interface TariffRow {
  label: string;
  value: string;
  note: string;
}

export const CATEGORY_LABELS: Record<ServiceTypeKey, string> = {
  local: 'LOCAL',
  outstation: 'OUTSTATION',
  airport: 'AIRPORT & TRANSFERS',
  wedding: 'WEDDING',
  packages: 'PACKAGES',
};

export function rowsForCategory(tariff: VehicleTariff, category: ServiceTypeKey): TariffRow[] {
  switch (category) {
    case 'local':
      return [
        { label: 'Local — 8 Hours / 80 KM', value: fmt(tariff.local.pkg80), note: PLACEHOLDER },
        { label: 'Extra KM', value: fmtUnit(tariff.local.extraKm, 'KM'), note: PLACEHOLDER },
        { label: 'Extra Hour', value: fmtUnit(tariff.local.extraHour, 'Hour'), note: PLACEHOLDER },
      ];
    case 'outstation':
      return [
        { label: 'Per KM', value: fmtUnit(tariff.outstation.perKm, 'KM'), note: PLACEHOLDER },
        {
          label:
            tariff.outstation.minimumKm === PLACEHOLDER
              ? 'Minimum (per day)'
              : `Minimum — ${tariff.outstation.minimumKm} KM / Day`,
          value: fmt(tariff.outstation.minimum),
          note: PLACEHOLDER,
        },
        { label: 'Driver Allowance', value: fmtUnit(tariff.outstation.driverAllowance, 'Day'), note: PLACEHOLDER },
        { label: 'Night Halt', value: fmt(tariff.outstation.nightHalt), note: PLACEHOLDER },
      ];
    case 'airport':
      return [
        { label: 'Airport Pickup', value: fmt(tariff.airport.pickup), note: PLACEHOLDER },
        { label: 'Airport Drop', value: fmt(tariff.airport.drop), note: PLACEHOLDER },
      ];
    case 'wedding':
      return [
        { label: 'Wedding Package — 8 Hours / 80 KM', value: fmt(tariff.wedding.pkg8), note: PLACEHOLDER },
        { label: 'Wedding Package — 12 Hours / 120 KM', value: fmt(tariff.wedding.pkg12), note: PLACEHOLDER },
        { label: 'Wedding Package — 24 Hours / 240 KM', value: fmt(tariff.wedding.pkg24), note: PLACEHOLDER },
        { label: 'Wedding Package — 48 Hours / 480 KM', value: fmt(tariff.wedding.pkg48), note: PLACEHOLDER },
        { label: 'Extra KM', value: fmtUnit(tariff.wedding.extraKm, 'KM'), note: PLACEHOLDER },
        { label: 'Extra Hour', value: fmtUnit(tariff.wedding.extraHour, 'Hour'), note: PLACEHOLDER },
      ];
    case 'packages':
      return [
        { label: 'Package 1', value: PLACEHOLDER, note: PLACEHOLDER },
        { label: 'Package 2', value: PLACEHOLDER, note: PLACEHOLDER },
        { label: 'Package 3', value: PLACEHOLDER, note: PLACEHOLDER },
        { label: 'Package 4', value: PLACEHOLDER, note: PLACEHOLDER },
      ];
  }
}

function placeholderTariff(slug: string, vehicle: string): VehicleTariff {
  const p = PLACEHOLDER;
  return {
    slug,
    vehicle,
    local: { pkg80: p, extraKm: p, extraHour: p },
    outstation: { perKm: p, minimumKm: p, minimum: p, driverAllowance: p, nightHalt: p },
    airport: { pickup: p, drop: p },
    wedding: { pkg8: p, pkg12: p, pkg24: p, pkg48: p, extraKm: p, extraHour: p },
    packages: { p1: p, p2: p, p3: p, p4: p },
  };
}

// Each vehicle gets its own tariff object so rates can be configured independently.
// Values are intentionally blank placeholders — operators fill them per vehicle.
const TARIFFS: Record<string, VehicleTariff> = Object.fromEntries(
  CARS.map((c) => [c.slug, placeholderTariff(c.slug, c.name)])
);

const FALLBACK = placeholderTariff('', 'Vehicle');

export function getTariff(slug: string): VehicleTariff {
  return TARIFFS[slug] ?? FALLBACK;
}

export function vehicleHasTariff(slug: string): boolean {
  return slug in TARIFFS;
}

export type { Car };
