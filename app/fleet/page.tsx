import type { Metadata } from 'next';
import { FleetPage } from '@/components/fleet/fleet-page';

export const metadata: Metadata = {
  title: 'Fleet — Rent Premium Cars Across India | Rentora Mobility',
  description:
    'Browse our premium fleet of cars for rent across India. Economy, SUV, luxury, and executive vans — Innova Crysta, Fortuner, BMW, Mercedes and more. Self drive and chauffeur-driven options available.',
  alternates: { canonical: '/fleet' },
  openGraph: {
    title: 'Premium Car Fleet — Rentora Mobility',
    description: 'Browse our premium fleet across India. From economy to luxury, self drive and chauffeur-driven.',
  },
};

export default function Page() {
  return <FleetPage />;
}
