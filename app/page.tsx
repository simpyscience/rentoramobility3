'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, ShieldCheck, Users, Car, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { BookingWidget } from '@/components/booking/booking-widget';
import { CarCard } from '@/components/fleet/car-card';
import { SectionHeading } from '@/components/ui/section-heading';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CONTACT, whatsappLink, telLink } from '@/lib/data/contact';
import { CARS, getPopularCars } from '@/lib/data/cars';
import { FAQS, WHY_CHOOSE_US, POPULAR_DESTINATIONS } from '@/lib/data/site';
import { getCarAssetPath } from '@/lib/data/images';

const HERO_IMAGE = '/images/cars/fleet.jpg';

const VALUE_POINTS = [
  { icon: ShieldCheck, text: 'Safe & Reliable' },
  { icon: Users, text: 'Professional Chauffeurs' },
  { icon: Car, text: 'Premium Fleet' },
];

export default function HomePage() {
  const popularCars = getPopularCars();
  const featuredCars = React.useMemo(() => {
    const popular = popularCars.slice(0, 4);
    const others = CARS.filter((c) => !c.popular).slice(0, 2);
    return [...popular, ...others];
  }, [popularCars]);

  return (
    <>
      {/* HERO */}
      <section className="relative bg-[hsl(222,47%,8%)] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(222,47%,8%)] via-[hsl(222,47%,12%)] to-[hsl(222,47%,8%)] opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(43_74%_50%/_0.08),transparent_50%)]" />
        <div className="container-lux relative px-4 sm:px-6 lg:px-8 pt-10 md:pt-16 pb-32 md:pb-40">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-8 items-center">
            {/* LEFT — Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-xl relative z-10"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.25em] text-gold mb-5">
                Premium Travel. Professional Service.
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-[3.5rem] font-semibold tracking-tight leading-[1.1] mb-5 text-white">
                India&apos;s Most Trusted <span className="text-gradient-gold">Mobility Partner</span>
              </h1>
              <p className="text-white/70 text-base md:text-lg leading-relaxed mb-10 max-w-lg">
                Experience comfort, safety, and reliability with Rentora Mobility. Your journey, our responsibility.
              </p>

              <div className="flex flex-wrap gap-6 md:gap-8 mb-10">
                {VALUE_POINTS.map((point) => (
                  <div key={point.text} className="flex items-center gap-3 text-sm font-medium text-white/90">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5">
                      <point.icon className="h-4 w-4 text-gold" />
                    </div>
                    <div className="leading-tight">
                      <div className="font-semibold text-white">{point.text.split(' ').slice(0, -1).join(' ')}</div>
                      <div className="text-white/60 text-xs">{point.text.split(' ').slice(-1)[0]}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a href={telLink()} className="flex items-center gap-2 rounded-full bg-white text-[hsl(222,47%,8%)] px-5 py-2.5 text-sm font-semibold hover:bg-white/90 transition-colors">
                  <Phone className="h-4 w-4" /> {CONTACT.phoneDisplay}
                </a>
                <a
                  href={whatsappLink('Hello Rentora Mobility, I would like to book a car.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp Us
                </a>
              </div>
            </motion.div>

            {/* RIGHT — Hero Image */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-gold/20 to-transparent rounded-full blur-3xl opacity-30" />
                <img
                  src={HERO_IMAGE}
                  alt="Premium Rentora Mobility fleet car"
                  className="relative h-full w-full object-cover object-center rounded-2xl max-h-[520px] drop-shadow-2xl"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Booking Widget — white card at bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="container-lux px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <BookingWidget variant="hero" />
            </motion.div>
          </div>
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
            eyebrow="Popular Routes"
            title="Outstation Destinations"
            subtitle="Discover India's most loved road trip routes with reliable cars and experienced drivers."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {POPULAR_DESTINATIONS.map((dest, i) => (
              <motion.div
                key={dest.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link href={`/destinations/${dest.slug}`} className="group luxury-card overflow-hidden h-full flex flex-col">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img src={dest.image} alt={`${dest.from} to ${dest.to}`} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                      <div className="flex items-center gap-2 text-sm font-medium mb-1">
                        <span>{dest.from}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-gold" />
                        <span>{dest.to}</span>
                      </div>
                      <p className="text-xs text-white/70 line-clamp-2">{dest.description}</p>
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
