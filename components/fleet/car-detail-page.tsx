'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Fuel, Gauge, Star, Snowflake, CheckCircle2, ArrowLeft, ArrowRight, Calendar, Clock, MapPin, Tag, Phone, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CarCard } from '@/components/fleet/car-card';
import { SectionHeading } from '@/components/ui/section-heading';
import { BookingCalculator } from '@/components/booking/booking-calculator';
import { CONTACT, whatsappLink, telLink } from '@/lib/data/contact';
import { getRelatedCars, type Car } from '@/lib/data/cars';
import { cn } from '@/lib/utils';

const AVAILABILITY_STYLES: Record<string, string> = {
  Available: 'bg-green-500/10 text-green-600 border-green-500/20',
  Limited: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  'On Request': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
};

export function CarDetailPage({ car }: { car: Car }) {
  const related = getRelatedCars(car);
  const [activeImg, setActiveImg] = React.useState(0);
  const gallery = car.gallery.length > 1 ? car.gallery : [car.image, ...car.gallery.filter((g) => g !== car.image)];

  const specs = [
    { icon: Users, label: 'Passengers', value: `${car.specs.passengers} Seater` },
    { icon: Fuel, label: 'Fuel Type', value: car.specs.fuel },
    { icon: Gauge, label: 'Transmission', value: car.specs.transmission },
    { icon: Snowflake, label: 'Air Conditioning', value: car.specs.ac ? 'Yes' : 'No' },
  ];

  return (
    <div className="pt-24 pb-20">
      {/* Breadcrumb */}
      <div className="container-lux px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-gold">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/fleet" className="hover:text-gold">Fleet</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{car.name}</span>
        </div>
      </div>

      <div className="container-lux px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-gold/90 text-[hsl(var(--gold-foreground))] border-0">{car.category}</Badge>
                <Badge variant="outline" className={AVAILABILITY_STYLES[car.availability]}>{car.availability}</Badge>
              </div>
              <div className="text-sm text-muted-foreground">{car.brand}</div>
              <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight">{car.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={cn('h-4 w-4', i < Math.round(car.rating) ? 'fill-gold text-gold' : 'text-muted')} />
                  ))}
                  <span className="ml-1 text-sm font-semibold">{car.rating}</span>
                  <span className="text-sm text-muted-foreground">({car.reviewCount} reviews)</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Starting from</div>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold text-gold">₹{car.pricePerDay.toLocaleString('en-IN')}</span>
                <span className="text-muted-foreground">/day</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Gallery + Booking */}
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8 mb-12">
          {/* Gallery */}
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden luxury-card">
              <img src={gallery[activeImg]} alt={`${car.name} - view ${activeImg + 1}`} className="h-full w-full object-cover" />
              {gallery.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImg((p) => (p - 1 + gallery.length) % gallery.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full glass hover:bg-gold hover:text-[hsl(var(--gold-foreground))] transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setActiveImg((p) => (p + 1) % gallery.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full glass hover:bg-gold hover:text-[hsl(var(--gold-foreground))] transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
            {gallery.length > 1 && (
              <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={cn('relative h-20 w-32 shrink-0 rounded-xl overflow-hidden border-2 transition-colors', i === activeImg ? 'border-gold' : 'border-transparent opacity-60 hover:opacity-100')}
                  >
                    <img src={img} alt={`${car.name} thumbnail ${i + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="luxury-card p-6 mt-6">
              <h2 className="font-display text-2xl font-bold mb-3">About the {car.name}</h2>
              <p className="text-muted-foreground leading-relaxed">{car.description}</p>
            </div>
          </motion.div>

          {/* Booking */}
          <div className="lg:sticky lg:top-28 h-fit space-y-6">
            <BookingCalculator car={car} />

            <div className="luxury-card p-6">
              <h3 className="font-semibold mb-4">Quick Contact</h3>
              <div className="space-y-3">
                <a href={telLink()} className="flex items-center gap-3 rounded-xl border border-border p-3 hover:border-gold/50 transition-colors">
                  <Phone className="h-5 w-5 text-gold" />
                  <div>
                    <div className="text-xs text-muted-foreground">Call us</div>
                    <div className="text-sm font-semibold">{CONTACT.phoneDisplay}</div>
                  </div>
                </a>
                <a href={whatsappLink(`Hello, I'd like to book the ${car.name} (₹${car.pricePerDay}/day).`)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl bg-[#25D366]/10 p-3 hover:bg-[#25D366]/20 transition-colors">
                  <MessageCircle className="h-5 w-5 text-[#25D366]" />
                  <div>
                    <div className="text-xs text-muted-foreground">WhatsApp</div>
                    <div className="text-sm font-semibold">{CONTACT.whatsappDisplay}</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Specs grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {specs.map((spec, i) => (
            <motion.div key={spec.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="luxury-card p-5 text-center">
              <spec.icon className="h-7 w-7 mx-auto text-gold mb-2" />
              <div className="text-xs text-muted-foreground uppercase tracking-wider">{spec.label}</div>
              <div className="font-semibold mt-1">{spec.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Features + Mileage */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="luxury-card p-6">
            <h3 className="font-display text-xl font-bold mb-4">Features & Amenities</h3>
            <div className="grid grid-cols-2 gap-3">
              {car.features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-gold shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>
          <div className="luxury-card p-6">
            <h3 className="font-display text-xl font-bold mb-4">Rental Options</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-gold" /> Self Drive: <span className="font-semibold">{car.selfDrive ? 'Available' : 'Not Available'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-gold" /> Chauffeur Driven: <span className="font-semibold">{car.chauffeurAvailable ? 'Available' : 'Not Available'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-gold" /> Mileage: <span className="font-semibold">{car.specs.mileage}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-gold" /> Fuel: <span className="font-semibold">{car.specs.fuel}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="luxury-card p-6 md:p-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-2xl font-bold">Customer Reviews</h3>
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
