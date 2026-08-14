'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Fuel, Gauge, Star, Snowflake, CheckCircle2, Calendar, Clock, MapPin, Tag, Phone, MessageCircle, ChevronLeft, ChevronRight, Luggage, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CarCard } from '@/components/fleet/car-card';
import { SectionHeading } from '@/components/ui/section-heading';
import { BookingCalculator } from '@/components/booking/booking-calculator';
import { CONTACT, whatsappLink, telLink } from '@/lib/data/contact';
import { getRelatedCars, type Car } from '@/lib/data/cars';
import { DESTINATIONS, type Destination, type DestinationTravelInfo } from '@/lib/data/destinations';
import { cn } from '@/lib/utils';

const AVAILABILITY_STYLES: Record<string, string> = {
  Available: 'bg-green-500/10 text-green-600 border-green-500/20',
  Limited: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  'On Request': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
};

function getRoutesForCar(car: Car) {
  const origins = [car.city, ...(car.locations || [])].filter(Boolean);
  const seen = new Set<string>();
  const routes: Array<{ destination: Destination; travel: DestinationTravelInfo; origin: string }> = [];

  for (const dest of DESTINATIONS) {
    for (const travel of dest.travelInfo) {
      if (origins.includes(travel.city) && travel.distanceKm > 0 && !seen.has(dest.slug)) {
        seen.add(dest.slug);
        routes.push({ destination: dest, travel, origin: travel.city });
        break;
      }
    }
  }

  return routes.slice(0, 6);
}

export function CarDetailPage({ car }: { car: Car }) {
  const related = getRelatedCars(car);
  const [activeImg, setActiveImg] = React.useState(0);
  const gallery = car.gallery.length > 1 ? car.gallery : [car.image, ...car.gallery.filter((g) => g !== car.image)];

  const specs = [
    { icon: Users, label: 'Passengers', value: `${car.specs.passengers} Seater` },
    { icon: Fuel, label: 'Fuel Type', value: car.specs.fuel },
    { icon: Gauge, label: 'Transmission', value: car.specs.transmission },
    { icon: Snowflake, label: 'Air Conditioning', value: car.specs.ac ? 'Yes' : 'No' },
    ...(car.specs.luggageCapacity ? [{ icon: Luggage, label: 'Luggage', value: car.specs.luggageCapacity }] : []),
  ];

  const routes = getRoutesForCar(car);
  const primaryLocation = car.city || car.locations?.[0] || '';
  const routeTitle = primaryLocation ? `Popular Routes from ${primaryLocation}` : 'Popular Routes';

  return (
    <div className="pt-24 pb-20">
      {/* Breadcrumb */}
      <div className="container-lux px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/fleet" className="hover:text-gold transition-colors">Fleet</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{car.name}</span>
        </div>
      </div>

      <div className="container-lux px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge className="bg-gold/90 text-[hsl(var(--gold-foreground))] border-0 font-semibold">{car.category}</Badge>
                <Badge variant="outline" className={AVAILABILITY_STYLES[car.availability]}>{car.availability}</Badge>
              </div>
              <div className="text-sm text-muted-foreground mb-2">{car.brand}</div>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.1] mb-3">{car.name}</h1>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={cn('h-4 w-4', i < Math.round(car.rating) ? 'fill-gold text-gold' : 'text-muted')} />
                  ))}
                  <span className="ml-1.5 text-sm font-semibold">{car.rating}</span>
                  <span className="text-sm text-muted-foreground">({car.reviewCount} reviews)</span>
                </div>
              </div>
              {car.tagline && (
                <p className="text-muted-foreground leading-relaxed max-w-2xl">{car.tagline}</p>
              )}
              {(car.city || (car.locations && car.locations.length > 0)) && (
                <div className="flex items-center gap-1.5 mt-4 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-gold" />
                  <span>{[car.city, ...(car.locations || [])].filter(Boolean).slice(0, 3).join(', ')}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col items-start lg:items-end gap-4 lg:text-right">
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Starting from</div>
                <div className="flex items-baseline gap-2 lg:flex-row-reverse">
                  <span className="font-display text-4xl md:text-5xl font-bold text-gold">₹{car.pricePerDay.toLocaleString('en-IN')}</span>
                  <span className="text-muted-foreground text-sm">/day</span>
                </div>
                {car.pricePerHour && (
                  <div className="text-sm text-muted-foreground mt-1">
                    or ₹{car.pricePerHour.toLocaleString('en-IN')}/hr
                  </div>
                )}
              </div>
              <a href={`/book/${car.slug}`} className="lg:hidden">
                <Button className="btn-gold rounded-full px-8 h-12 text-base">Book Now</Button>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Gallery + Booking */}
        <div className="grid lg:grid-cols-[1.6fr_1fr] gap-8 lg:gap-12 mb-16">
          {/* Gallery */}
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden luxury-card">
              <img src={gallery[activeImg]} alt={`${car.name} - view ${activeImg + 1}`} className="h-full w-full object-cover" />
              {gallery.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImg((p) => (p - 1 + gallery.length) % gallery.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full glass hover:bg-gold hover:text-[hsl(var(--gold-foreground))] transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setActiveImg((p) => (p + 1) % gallery.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full glass hover:bg-gold hover:text-[hsl(var(--gold-foreground))] transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
            {gallery.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={cn('relative h-20 w-32 shrink-0 rounded-xl overflow-hidden border-2 transition-all', i === activeImg ? 'border-gold shadow-gold' : 'border-transparent opacity-60 hover:opacity-100')}
                  >
                    <img src={img} alt={`${car.name} thumbnail ${i + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="luxury-card p-6 md:p-8 mt-8">
              <h2 className="font-display text-2xl font-semibold mb-4">About the {car.name}</h2>
              <p className="text-muted-foreground leading-relaxed text-base">{car.description}</p>
            </div>
          </motion.div>

          {/* Booking */}
          <div id="booking-section" className="lg:sticky lg:top-28 h-fit space-y-6">
            <BookingCalculator car={car} />

            <div className="luxury-card p-6">
              <h3 className="font-semibold text-lg mb-4">Quick Contact</h3>
              <div className="space-y-3">
                <a href={telLink()} className="flex items-center gap-3 rounded-xl border border-border p-3.5 hover:border-gold/50 transition-colors">
                  <Phone className="h-5 w-5 text-gold" />
                  <div>
                    <div className="text-xs text-muted-foreground">Call us</div>
                    <div className="text-sm font-semibold">{CONTACT.phoneDisplay}</div>
                  </div>
                </a>
                <a href={whatsappLink(`Hello, I'd like to book the ${car.name} (₹${car.pricePerDay}/day).`)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl bg-[#25D366]/10 p-3.5 hover:bg-[#25D366]/20 transition-colors">
                  <MessageCircle className="h-5 w-5 text-[#25D366]" />
                  <div>
                    <div className="text-xs text-muted-foreground">WhatsApp</div>
                    <div className="text-sm font-semibold">{CONTACT.whatsappDisplay}</div>
                  </div>
                </a>
              </div>
            </div>

            <a href={`/book/${car.slug}`} className="hidden lg:block">
              <Button className="btn-gold w-full rounded-full h-12 text-base">Book Now</Button>
            </a>
          </div>
        </div>

        {/* Specs grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {specs.map((spec, i) => (
            <motion.div key={spec.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="luxury-card p-5 text-center">
              <spec.icon className="h-7 w-7 mx-auto text-gold mb-3" />
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{spec.label}</div>
              <div className="font-semibold text-sm">{spec.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Features + Mileage */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <div className="luxury-card p-6 md:p-8">
            <h3 className="font-display text-xl font-semibold mb-5">Features & Amenities</h3>
            <div className="grid grid-cols-2 gap-3">
              {car.features.map((f) => (
                <div key={f} className="flex items-center gap-2.5 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-gold shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="luxury-card p-6 md:p-8">
            <h3 className="font-display text-xl font-semibold mb-5">Rental Options</h3>
            <div className="space-y-3 text-sm">
              {car.selfDrive && (
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-gold shrink-0" /> Self Drive: <span className="font-semibold">Available</span>
                </div>
              )}
              {car.chauffeurAvailable && (
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-gold shrink-0" /> Chauffeur Driven: <span className="font-semibold">Available</span>
                </div>
              )}
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-gold shrink-0" /> Mileage: <span className="font-semibold">{car.specs.mileage}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-gold shrink-0" /> Fuel: <span className="font-semibold">{car.specs.fuel}</span>
              </div>
              {car.specs.luggageCapacity && (
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-gold shrink-0" /> Luggage: <span className="font-semibold">{car.specs.luggageCapacity}</span>
                </div>
              )}
            </div>
            {(car.city || (car.locations && car.locations.length > 0)) && (
              <div className="mt-5 pt-5 border-t border-border">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Available in</div>
                <div className="flex items-center gap-1.5 text-sm">
                  <MapPin className="h-4 w-4 text-gold" />
                  <span>{[car.city, ...(car.locations || [])].filter(Boolean).slice(0, 5).join(', ')}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Popular Routes */}
        {routes.length > 0 && (
          <div className="mb-16">
            <SectionHeading eyebrow="Route Discovery" title={routeTitle} center={false} className="mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {routes.map((route) => (
                <Link key={route.destination.slug} href={`/destinations/${route.destination.slug}`} className="luxury-card p-6 group block h-full flex flex-col">
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-1">From</div>
                      <div className="font-display text-lg font-semibold">{route.origin}</div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gold shrink-0 mt-5" />
                    <div className="text-right">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-1">To</div>
                      <div className="font-display text-lg font-semibold">{route.destination.cityName}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-1">Distance</div>
                      <div className="font-semibold text-sm">{route.travel.distanceKm} km</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-1">Approx. drive time</div>
                      <div className="font-semibold text-sm">{route.travel.driveTime}</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1">{route.destination.shortDescription}</p>
                  <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold mt-5 group-hover:gap-2.5 transition-all">
                    Explore Destination <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="luxury-card p-6 md:p-8 mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h3 className="font-display text-2xl font-semibold">Customer Reviews</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-gold text-gold" />
                <span className="font-bold text-lg">{car.rating}</span>
              </div>
              <span className="text-muted-foreground text-sm">({car.reviewCount} reviews)</span>
            </div>
          </div>

          {car.reviews.length > 0 ? (
            <div className="space-y-6">
              {car.reviews.map((review) => (
                <div key={review.id} className="border-b border-border pb-6 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold-light to-gold-dark text-sm font-bold text-[hsl(var(--gold-foreground))]">
                      {review.author.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{review.author}</span>
                        {review.verified && <Badge variant="outline" className="text-[10px] border-green-500/30 text-green-600">Verified</Badge>}
                      </div>
                      <div className="text-xs text-muted-foreground">{review.date}</div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={cn('h-3.5 w-3.5', i < review.rating ? 'fill-gold text-gold' : 'text-muted')} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">{review.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Be the first to review the {car.name}.</p>
          )}
        </div>

        {/* Related cars */}
        {related.length > 0 && (
          <div>
            <SectionHeading eyebrow="You May Also Like" title="Related Cars" center={false} className="mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((c, i) => (
                <CarCard key={c.slug} car={c} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
