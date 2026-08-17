import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Clock3, MapPinned, Compass, Hotel, UtensilsCrossed, CarFront, Fuel, BadgeCheck, Trees, ParkingCircle, SunMedium } from 'lucide-react';
import { getDestinationBySlug, getDestinationRecommendedCars } from '@/lib/data/destinations';
import { CarCard } from '@/components/fleet/car-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PageProps {
  params: { slug: string };
}

export function generateMetadata({ params }: PageProps): Metadata {
  const destination = getDestinationBySlug(params.slug);
  if (!destination) return { title: 'Destination Not Found' };

  return {
    title: `${destination.name} - ${destination.state} | Rentora Mobility`,
    description: destination.shortDescription,
    alternates: { canonical: `/destinations/${destination.slug}` },
    openGraph: {
      title: `${destination.name} | Rentora Mobility`,
      description: destination.shortDescription,
      images: [{ url: destination.heroImage, width: 1200, height: 630, alt: destination.name }],
    },
  };
}

export default function DestinationDetailPage({ params }: PageProps) {
  const destination = getDestinationBySlug(params.slug);
  if (!destination) notFound();

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://rentoramobility.in/' },
      { '@type': 'ListItem', position: 2, name: 'Destinations', item: 'https://rentoramobility.in/destinations' },
      { '@type': 'ListItem', position: 3, name: destination.name, item: `https://rentoramobility.in/destinations/${destination.slug}` },
    ],
  };

  const recommendedCars = getDestinationRecommendedCars(destination);
  const gallery = destination.gallery.length > 1 ? destination.gallery : [destination.heroImage];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-background to-background" />
        <div className="relative container-lux px-4 sm:px-6 lg:px-8 pt-28 pb-12">
          <div>
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
                <li><Link href="/" className="hover:text-gold transition-colors">Home</Link></li>
                <li aria-hidden="true" className="text-gold/60">/</li>
                <li><Link href="/destinations" className="hover:text-gold transition-colors">Destinations</Link></li>
                <li aria-hidden="true" className="text-gold/60">/</li>
                <li aria-current="page" className="font-medium text-foreground">{destination.name}</li>
              </ol>
            </nav>
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-gold/90 text-[hsl(var(--gold-foreground))] border-0 text-[10px] font-semibold uppercase tracking-wider">
                {destination.state}
              </Badge>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">{destination.cityName}</h1>
            <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-gold">{destination.name} · {destination.state}</p>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">{destination.shortDescription}</p>
          </div>
        </div>
      </div>

      <div className="container-lux px-4 sm:px-6 lg:px-8 pb-20">
        {/* Hero Image */}
        <div className="relative aspect-[16/9] rounded-[2rem] overflow-hidden mb-12">
          <img src={destination.heroImage} alt={destination.cityName} className="h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          {/* Left Column - Main Content */}
          <div className="space-y-8">
            {/* Description */}
            <section className="luxury-card p-6 md:p-8">
              <div className="flex items-center gap-2 text-gold mb-4">
                <Compass className="h-5 w-5" />
                <h2 className="font-display text-2xl font-semibold">About This Route</h2>
              </div>
              <p className="text-sm leading-7 text-muted-foreground">{destination.description}</p>
            </section>

            {/* Best Time to Visit */}
            {destination.bestTimeToVisit && (
              <section className="luxury-card p-6 md:p-8">
                <div className="flex items-center gap-2 text-gold mb-4">
                  <Clock3 className="h-5 w-5" />
                  <h2 className="font-display text-2xl font-semibold">Best Time to Visit</h2>
                </div>
                <p className="text-sm leading-7 text-muted-foreground">{destination.bestTimeToVisit}</p>
              </section>
            )}

            {/* History */}
            {destination.history && (
              <section className="luxury-card p-6 md:p-8">
                <div className="flex items-center gap-2 text-gold mb-4">
                  <Trees className="h-5 w-5" />
                  <h2 className="font-display text-2xl font-semibold">History & Heritage</h2>
                </div>
                <p className="text-sm leading-7 text-muted-foreground">{destination.history}</p>
              </section>
            )}

            {/* Attractions */}
            <section className="luxury-card p-6 md:p-8">
              <div className="flex items-center gap-2 text-gold mb-4">
                <MapPinned className="h-5 w-5" />
                <h2 className="font-display text-2xl font-semibold">Travel Highlights</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold mb-3">Attractions</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {destination.attractions.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="text-gold mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Nearby Attractions</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {destination.nearbyAttractions.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="text-gold mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Restaurants, Hotels, Parking */}
            <section className="grid gap-4 md:grid-cols-3">
              <div className="luxury-card p-5">
                <div className="flex items-center gap-2 text-gold mb-3">
                  <UtensilsCrossed className="h-5 w-5" />
                  <h3 className="font-semibold">Restaurants</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {destination.restaurants.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-gold mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="luxury-card p-5">
                <div className="flex items-center gap-2 text-gold mb-3">
                  <Hotel className="h-5 w-5" />
                  <h3 className="font-semibold">Hotels</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {destination.hotels.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-gold mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="luxury-card p-5">
                <div className="flex items-center gap-2 text-gold mb-3">
                  <ParkingCircle className="h-5 w-5" />
                  <h3 className="font-semibold">Parking Info</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {destination.parking.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-gold mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Gallery */}
            {gallery.length > 1 && (
              <section className="luxury-card p-6 md:p-8">
                <h2 className="font-display text-2xl font-semibold mb-4">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {gallery.map((img, i) => (
                    <div key={i} className="aspect-[16/10] rounded-xl overflow-hidden">
                      <img src={img} alt={`${destination.name} gallery ${i + 1}`} className="h-full w-full object-cover" loading="lazy" />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Weather */}
            <section className="luxury-card p-6">
              <div className="flex items-center gap-2 text-gold mb-4">
                <SunMedium className="h-5 w-5" />
                <h2 className="font-display text-xl font-semibold">Weather Overview</h2>
              </div>
              <p className="text-sm leading-7 text-muted-foreground">{destination.weatherOverview}</p>
            </section>

            {/* Fuel Cost */}
            <section className="luxury-card p-6">
              <div className="flex items-center gap-2 text-gold mb-4">
                <Fuel className="h-5 w-5" />
                <h2 className="font-display text-xl font-semibold">Estimated Fuel Cost</h2>
              </div>
              <p className="text-sm leading-7 text-muted-foreground">{destination.estimatedFuelCost}</p>
            </section>

            {/* Travel Info */}
            <section className="luxury-card p-6">
              <div className="flex items-center gap-2 text-gold mb-4">
                <CarFront className="h-5 w-5" />
                <h2 className="font-display text-xl font-semibold">Travel Info</h2>
              </div>
              <div className="space-y-3">
                {destination.travelInfo.map((info) => (
                  <div key={info.city} className="rounded-xl border border-border/60 p-3 text-sm">
                    <div className="font-semibold">{info.city}</div>
                    <div className="mt-1 text-muted-foreground">{info.distanceKm} km · {info.driveTime}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{info.routeInfo}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recommended Cars */}
            {recommendedCars.length > 0 && (
              <section className="luxury-card p-6">
                <div className="flex items-center gap-2 text-gold mb-4">
                  <BadgeCheck className="h-5 w-5" />
                  <h2 className="font-display text-xl font-semibold">Recommended Cars</h2>
                </div>
                <div className="space-y-4">
                  {recommendedCars.map((car) => (
                    <CarCard key={car.slug} car={car} index={0} />
                  ))}
                </div>
                <Link href="/fleet">
                  <Button className="w-full mt-4 btn-gold rounded-full">
                    View Full Fleet <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  </>
  );
}
