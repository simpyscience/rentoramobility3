import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MapPin, Calendar } from 'lucide-react';
import { DESTINATIONS } from '@/lib/data/destinations';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Premium Destinations',
  description: 'Explore premium road trip destinations and travel guides curated by Rentora Mobility.',
  alternates: { canonical: '/destinations' },
};

export default function DestinationsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-background to-background" />
        <div className="relative container-lux px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-gold mb-3">Premium Destinations</div>
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">Travel in style across India</h1>
            <p className="mt-4 text-lg text-muted-foreground">Discover curated road-trip routes with premium travel guides, parking notes, fuel estimates and the right Rentora car for every journey.</p>
          </div>
        </div>
      </div>

      <div className="container-lux px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {DESTINATIONS.map((destination) => (
            <Link key={destination.slug} href={`/destinations/${destination.slug}`} className="group luxury-card overflow-hidden h-full flex flex-col">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={destination.heroImage} alt={destination.cityName} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-gold/90 text-[hsl(var(--gold-foreground))] border-0 text-[10px] font-semibold uppercase tracking-wider">
                    {destination.state}
                  </Badge>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <h2 className="font-display text-2xl font-semibold">{destination.cityName}</h2>
                  <p className="mt-1 text-xs text-white/70 line-clamp-2">{destination.shortDescription}</p>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  {destination.bestTimeToVisit && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-gold" />
                      <span>{destination.bestTimeToVisit.split(' ').slice(0, 3).join(' ')}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-gold" />
                    <span>{destination.cityName}</span>
                  </div>
                </div>
                <div className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-gold">
                  Explore route <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
