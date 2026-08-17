'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, ShieldCheck, Car, Clock, ArrowRight } from 'lucide-react';
import { BookingWidget } from '@/components/booking/booking-widget';
import { CarCard } from '@/components/fleet/car-card';
import { SectionHeading } from '@/components/ui/section-heading';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CONTACT, telLink } from '@/lib/data/contact';
import { CARS, getPopularCars } from '@/lib/data/cars';
import { FAQS, WHY_CHOOSE_US } from '@/lib/data/site';
import { DESTINATIONS } from '@/lib/data/destinations';
import { getCarAssetPath } from '@/lib/data/images';
import dynamic from 'next/dynamic';
// Below-the-fold sections: code-split so they don't bloat the initial/critical
// bundle or block first paint / navigation responsiveness.
const ChauffeursCityGuides = dynamic(
  () => import('@/components/sections/chauffeurs-city-guides').then((m) => m.ChauffeursCityGuides),
  { ssr: true }
);
const PartnerSection = dynamic(
  () => import('@/components/sections/partner-section').then((m) => m.PartnerSection),
  { ssr: true }
);

const HERO_IMAGE = '/homepage/homepage png.png';

export default function HomePage() {
  const popularCars = getPopularCars();
  const featuredCars = React.useMemo(() => {
    const popular = popularCars.slice(0, 4);
    const others = CARS.filter((c) => !c.popular).slice(0, 2);
    return [...popular, ...others];
  }, [popularCars]);

  return (
    <>
      {/* HERO — single, coherent Rentora Mobility homepage built on the supplied
          car/road design. The supplied homepage asset is the visual source of truth;
          the global navbar (layout) and this single functional booking widget are the
          only foreground elements, so there is exactly one navbar, one logo, one hero
          and one booking form (no duplicated headline / navigation / booking layer). */}
      <section className="relative overflow-hidden min-h-[88vh] flex flex-col justify-end">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="Rentora Mobility — India's premium mobility partner"
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="relative container-lux px-4 sm:px-6 lg:px-8 pb-10 md:pb-16">
          <BookingWidget variant="hero" />
        </div>
      </section>

      {/* SERVICES STRIP */}
      <section className="section-pad bg-card/30">
        <div className="container-lux">
          <SectionHeading
            eyebrow="Our Services"
            title="Mobility for Every Occasion"
            subtitle="From airport pickups to luxury weddings, corporate travel to self-drive road trips — we've got you covered."
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-12">
            {[
              { slug: 'airport-transfers', label: 'Airport Transfers', icon: 'Plane' },
              { slug: 'corporate-rentals', label: 'Corporate Rentals', icon: 'Building2' },
              { slug: 'luxury-rentals', label: 'Luxury Rentals', icon: 'Crown' },
              { slug: 'outstation-trips', label: 'Outstation Trips', icon: 'Map' },
              { slug: 'wedding-cars', label: 'Wedding Cars', icon: 'Heart' },
              { slug: 'self-drive', label: 'Self Drive', icon: 'Car' },
            ].map((service, i) => (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link href={`/services/${service.slug}`}>
                  <div className="luxury-card group p-5 text-center h-full">
                    <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-gold/10 text-gold mb-3 group-hover:bg-gold group-hover:text-[hsl(var(--gold-foreground))] transition-colors">
                      <Car className="h-5 w-5" />
                    </div>
                    <div className="font-semibold text-sm">{service.label}</div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED FLEET */}
      <section className="section-pad">
        <div className="container-lux">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <SectionHeading
              eyebrow="Our Premium Fleet"
              title="Cars for Every Journey"
              subtitle="Handpicked, verified and maintained to the highest standards."
              center={false}
            />
            <Link href="/fleet">
              <Button variant="outline" className="rounded-full group">
                View All Fleet
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCars.slice(0, 6).map((car, i) => (
              <CarCard key={car.slug} car={car} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR DESTINATIONS */}
      <section className="section-pad bg-card/30">
        <div className="container-lux">
          <SectionHeading
            eyebrow="Popular Destinations"
            title="Outstation Destinations"
            subtitle="Discover India's most loved travel destinations with reliable cars and experienced drivers."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {DESTINATIONS.slice(0, 6).map((dest, i) => (
              <motion.div
                key={dest.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link href={`/destinations/${dest.slug}`} className="group luxury-card overflow-hidden h-full flex flex-col">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img src={dest.heroImage} alt={dest.cityName} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="inline-block rounded-full bg-gold/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[hsl(var(--gold-foreground))]">
                        {dest.state}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                      <div className="font-display text-2xl font-semibold leading-tight">{dest.cityName}</div>
                      <p className="mt-1 text-xs text-white/70 line-clamp-2">{dest.shortDescription}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/destinations">
              <Button variant="outline" className="rounded-full group">
                Explore All Destinations
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="section-pad">
        <div className="container-lux">
          <SectionHeading
            eyebrow="Why Rentora"
            title="Why Choose Rentora Mobility"
            subtitle="Trust, transparency and technology — redefining premium mobility in India."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {WHY_CHOOSE_US.map((item, i) => {
              const Icon = item.icon === 'ShieldCheck' ? ShieldCheck : item.icon === 'Clock' ? Clock : item.icon === 'IndianRupee' ? Clock : item.icon === 'MapPin' ? Car : item.icon === 'Car' ? Car : item.icon === 'Headset' ? MessageCircle : ShieldCheck;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="luxury-card p-6"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-sans text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-pad bg-card/30">
        <div className="container-lux max-w-3xl">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently Asked Questions"
            subtitle="Everything you need to know about renting with Rentora Mobility."
          />
          <div className="mt-10">
            <Accordion type="single" collapsible className="space-y-4">
              {FAQS.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="luxury-card px-6">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* PROFESSIONAL CHAUFFEURS & CITY GUIDES */}
      <ChauffeursCityGuides />

      {/* PARTNER */}
      <PartnerSection />

      {/* CTA */}
      <section className="section-pad">
        <div className="container-lux text-center">
          <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            Ready for Your <span className="text-gradient-gold">Premium Journey?</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Book your car in minutes. Available across India with transparent pricing and professional service.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/fleet">
              <Button className="btn-gold rounded-full text-base px-8 h-12">Explore Fleet <ArrowRight className="h-5 w-5 ml-2" /></Button>
            </Link>
            <a href={telLink()}>
              <Button variant="outline" className="rounded-full text-base px-8 h-12"><Phone className="h-5 w-5 mr-2" /> {CONTACT.phoneDisplay}</Button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
