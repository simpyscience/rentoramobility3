import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BookingFlow, BookingConfirmation } from '@/components/booking/booking-flow';
import { getCarBySlug } from '@/lib/data/cars';

interface PageProps {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export function generateMetadata({ params }: PageProps): Metadata {
  const car = getCarBySlug(params.slug);
  if (!car) return { title: 'Booking Not Found' };

  return {
    title: `Book ${car.name} | Rentora Mobility`,
    description: `Reserve the ${car.name} with pickup and return details, pricing estimates and premium support.`,
  };
}

export default function BookingPage({ params, searchParams }: PageProps) {
  const car = getCarBySlug(params.slug);
  if (!car) notFound();

  const confirmationMode = searchParams?.pickupLocation || searchParams?.dropLocation || searchParams?.pickupDate || searchParams?.returnDate;

  if (confirmationMode) {
    return <BookingConfirmation car={car} />;
  }

  return <BookingFlow car={car} />;
}
