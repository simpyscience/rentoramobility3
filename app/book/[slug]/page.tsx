import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BookingPage from '@/components/booking/booking-page';
import { getCarBySlug } from '@/lib/data/cars';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  const { CARS } = require('@/lib/data/cars');
  return CARS.map((car: { slug: string }) => ({ slug: car.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const car = getCarBySlug(params.slug);
  if (!car) return { title: 'Car Not Found' };

  return {
    title: `Book ${car.name} — Rentora Mobility`,
    description: `Book the ${car.name} rental in India. ${car.specs.passengers} seater, ${car.specs.fuel}, ${car.specs.transmission}. Starting from ₹${car.pricePerDay.toLocaleString('en-IN')}/day.`,
    alternates: { canonical: `/book/${car.slug}` },
    robots: { index: false, follow: true },
  };
}

export default function Page({ params }: PageProps) {
  const car = getCarBySlug(params.slug);
  if (!car) notFound();
  return <BookingPage params={params} />;
}
