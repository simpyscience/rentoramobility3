import * as React from 'react';
import type { Car } from '@/lib/data/cars';
import {
  CATEGORY_LABELS,
  CHAUFFEUR_SERVICE_KEYS,
  PLACEHOLDER,
  getTariff,
  isChauffeurServiceType,
  rowsForCategory,
  type ServiceTypeKey,
  type TariffRow,
} from '@/lib/data/tariffs';

interface VehicleTariffSheetProps {
  car: Car;
  activeCategory?: ServiceTypeKey;
  compact?: boolean;
}

function firstHeader(category: ServiceTypeKey): string {
  return category === 'airport' ? 'Service' : 'Package';
}

function isPackages(category: ServiceTypeKey): boolean {
  return category === 'packages';
}

function TariffRowItem({ row, category }: { row: TariffRow; category: ServiceTypeKey }) {
  const packages = isPackages(category);
  return (
    <tr className="align-top">
      <td className="py-2.5 pr-3 font-medium text-foreground align-top">{row.label}</td>
      {packages ? (
        <>
          <td className="py-2.5 pr-3 text-muted-foreground align-top">{row.note}</td>
          <td className="py-2.5 text-muted-foreground align-top">{row.value}</td>
        </>
      ) : (
        <>
          <td className="py-2.5 pr-3 text-muted-foreground align-top">{row.value}</td>
          <td className="py-2.5 text-muted-foreground align-top">{row.note}</td>
        </>
      )}
    </tr>
  );
}

export function VehicleTariffSheet({ car, activeCategory, compact = false }: VehicleTariffSheetProps) {
  const tariff = React.useMemo(() => getTariff(car.slug), [car.slug]);

  // Compact (booking card) mode: show only the active chauffeur category as a
  // 2-column label/value list used inside the Estimated Total card.
  if (compact) {
    if (!activeCategory || !isChauffeurServiceType(activeCategory)) {
      return null;
    }
    const rows = rowsForCategory(tariff, activeCategory);
    return (
      <div className="space-y-2 text-sm" aria-label={`Applicable tariff: ${CATEGORY_LABELS[activeCategory]}`}>
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">{r.label}</span>
            <span className="font-medium text-foreground">{r.value === PLACEHOLDER ? '—' : r.value}</span>
          </div>
        ))}
        <div className="flex items-center justify-between gap-4 pt-2 mt-2 border-t border-border">
          <span className="text-muted-foreground">Additional</span>
          <span className="font-medium text-foreground">As applicable</span>
        </div>
      </div>
    );
  }

  // Full mode (car detail page): render all five chauffeur categories as a
  // premium, aligned tariff sheet.
  return (
    <section aria-label="Pricing and tariff" className="mb-8">
      <div className="mb-6">
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground">Pricing &amp; Tariff</h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
          Chauffeur-driven rates for the {car.name}. Select your service type in the booking form for an instant reserve.
        </p>
      </div>

      {CHAUFFEUR_SERVICE_KEYS.map((category) => {
        const rows = rowsForCategory(tariff, category);
        const packages = isPackages(category);
        return (
          <table
            key={category}
            className="w-full border-separate border-spacing-y-1 text-sm last:mb-0 mb-8"
          >
            <caption className="text-left text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-2">
              {CATEGORY_LABELS[category]}
            </caption>
            <thead>
              <tr>
                <th className="text-left font-medium text-muted-foreground pb-2 pr-3">{firstHeader(category)}</th>
                {packages ? (
                  <>
                    <th className="text-left font-medium text-muted-foreground pb-2 pr-3">Details</th>
                    <th className="text-left font-medium text-muted-foreground pb-2">Rate</th>
                  </>
                ) : (
                  <>
                    <th className="text-left font-medium text-muted-foreground pb-2 pr-3">Rate</th>
                    <th className="text-left font-medium text-muted-foreground pb-2">Additional</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <TariffRowItem key={`${category}-${row.label}`} row={row} category={category} />
              ))}
            </tbody>
          </table>
        );
      })}
    </section>
  );
}
