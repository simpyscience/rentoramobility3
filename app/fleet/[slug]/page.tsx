import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CarDetailPage } from '@/components/fleet/car-detail-page';
import { CARS, getCarBySlug } from '@/lib/data/cars';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return CARS.map((car) => ({ slug: car.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const car = getCarBySlug(params.slug);
  if (!car) return { title: 'Car Not Found' };

  return {
    title: `${car.name} Rental in India — ₹${car.pricePerDay.toLocaleString('en-IN')}/day | Rentora Mobility`,
    description: `Rent the ${car.name} in India. ${car.specs.passengers} seater, ${car.specs.fuel}, ${car.specs.transmission}. ${car.description.slice(0, 120)}`,
    alternates: { canonical: `/fleet/${car.slug}` },
    openGraph: {
      title: `${car.name} — Rent in India | Rentora Mobility`,
      description: `${car.name} rental from ₹${car.pricePerDay.toLocaleString('en-IN')}/day. ${car.tagline}`,
      images: [{ url: car.image, width: 1200, height: 630, alt: `${car.name} rental` }],
    },
  };
}

export default function Page({ params }: PageProps) {
  const car = getCarBySlug(params.slug);
  if (!car) notFound();
  return <CarDetailPage car={car} />;
}
