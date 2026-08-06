'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, Star, ShieldCheck, Clock, IndianRupee, MapPin, Car, Headset, ChevronRight, ArrowRight, Plane, Building2, Crown, Heart } from 'lucide-react';
import { BookingWidget } from '@/components/booking/booking-widget';
import { CarCard } from '@/components/fleet/car-card';
import { SectionHeading } from '@/components/ui/section-heading';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CONTACT, whatsappLink, telLink } from '@/lib/data/contact';
import { CARS, getPopularCars } from '@/lib/data/cars';
import { TESTIMONIALS, FAQS, TRUST_BADGES, WHY_CHOOSE_US, STATS, POPULAR_DESTINATIONS, SERVICES } from '@/lib/data/site';

const ICONS: Record<string, any> = { Plane, Building2, Crown, MapPin, Heart, Car, ShieldCheck, Clock, IndianRupee, Headset };

const SERVICE_ICONS: Record<string, any> = {
  'airport-transfers': Plane,
  'corporate-rentals': Building2,
  'luxury-rentals': Crown,
  'outstation-trips': MapPin,
  'wedding-cars': Heart,
  'self-drive': Car,
};

export default function HomePage() {
  const popularCars = getPopularCars();

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/5063634/pexels-photo-5063634.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Luxury car on highway at sunset - Rentora Mobility premium car rental India"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
          <div className="absolute inset-0 grid-pattern opacity-20" />
        </div>

        <div className="relative z-10 container-lux px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full glass-dark px-4 py-2 text-sm text-white mb-6"
            >
              <Star className="h-4 w-4 fill-gold text-gold" />
              <span>Rated {CONTACT.rating}/5 by {CONTACT.reviewCount} customers</span>
              <span className="text-white/40">|</span>
              <span>Available Across India</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight"
            >
              Premium Mobility.
              <br />
              <span className="text-gradient-gold">Trusted Journeys.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl mx-auto"
            >
              India&apos;s premium car rental platform. From economy to luxury, chauffeur-driven and self-drive — book your perfect ride in seconds.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-3"
            >
              <a href={telLink()} className="flex items-center gap-2 rounded-full bg-white text-black px-5 py-3 text-sm font-semibold hover:scale-105 transition-transform">
                <Phone className="h-4 w-4" /> {CONTACT.phoneDisplay}
              </a>
              <a
                href={whatsappLink('Hello Rentora Mobility, I would like to book a car.')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white hover:scale-105 transition-transform"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp Us
              </a>
            </motion.div>
          </div>

          {/* Booking Widget */}
          <div className="flex justify-center">
            <BookingWidget />
          </div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
          >
            {TRUST_BADGES.map((badge) => (
              <div key={badge} className="flex items-center gap-1.5 text-sm text-white/70">
                <ShieldCheck className="h-4 w-4 text-gold" />
                {badge}
              </div>
            ))}
          </motion.div>
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
            {SERVICES.map((service, i) => {
              const Icon = SERVICE_ICONS[service.slug] || Car;
              return (
                <motion.div
                  key={service.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link href={`/services/${service.slug}`}>
                    <div className="luxury-card group p-5 text-center h-full">
                      <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-gold/10 text-gold mb-3 group-hover:bg-gold group-hover:text-[hsl(var(--gold-foreground))] transition-colors">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="font-semibold text-sm">{service.shortTitle}</div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURED FLEET */}
      <section className="section-pad">
        <div className="container-lux">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <SectionHeading
              eyebrow="Featured Fleet"
              title={<span>Premium Cars for Every Journey</span>}
              subtitle="Handpicked, verified and maintained to the highest standards."
              center={false}
            />
            <Link href="/fleet">
              <Button variant="outline" className="rounded-full group">
                View All Cars
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularCars.slice(0, 4).map((car, i) => (
              <CarCard key={car.slug} car={car} index={i} />
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {CARS.filter((c) => !c.popular).slice(0, 4).map((car, i) => (
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
            title="Popular Outstation Destinations"
            subtitle="Discover India's most loved road trip routes with reliable cars and experienced drivers."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {POPULAR_DESTINATIONS.map((dest, i) => (
              <motion.div
                key={dest.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link href={`/fleet?from=${dest.from}&to=${dest.to}`}>
                  <div className="luxury-card group overflow-hidden h-full">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img src={dest.image} alt={`${dest.from} to ${dest.to} car rental`} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                        <div className="flex items-center gap-2 text-sm font-medium mb-1">
                          <span>{dest.from}</span>
                          <ArrowRight className="h-3.5 w-3.5 text-gold" />
                          <span>{dest.to}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-white/70">{dest.description}</span>
                          <Badge className="bg-gold/90 text-[hsl(var(--gold-foreground))] border-0">{dest.distance}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="section-pad relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="container-lux relative">
          <SectionHeading
            eyebrow="Why Rentora"
            title="Why Choose Rentora Mobility"
            subtitle="We're redefining premium mobility in India with trust, transparency and technology."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {WHY_CHOOSE_US.map((item, i) => {
              const Icon = ICONS[item.icon] || ShieldCheck;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="luxury-card p-6 group"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 text-gold mb-4 group-hover:bg-gold group-hover:text-[hsl(var(--gold-foreground))] transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="relative py-16 md:py-20 bg-gradient-to-br from-foreground to-foreground/80 text-background overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-10" />
        <div className="container-lux relative px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gradient-gold">{stat.value}</div>
                <div className="mt-2 text-sm md:text-base text-background/70 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-pad bg-card/30">
        <div className="container-lux">
          <SectionHeading
            eyebrow="Customer Love"
            title="What Our Customers Say"
            subtitle="50,000+ happy travellers trust Rentora Mobility for their journeys across India."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="luxury-card p-6"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className={`h-4 w-4 ${j < t.rating ? 'fill-gold text-gold' : 'text-muted'}`} />
                  ))}
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold-light to-gold-dark text-sm font-bold text-[hsl(var(--gold-foreground))]">
                    {t.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.location} · {t.car}</div>
                  </div>
                  <Badge variant="outline" className="text-[10px] border-green-500/30 text-green-600">Verified</Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-pad">
        <div className="container-lux max-w-3xl">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently Asked Questions"
            subtitle="Everything you need to know about renting with Rentora Mobility."
          />
          <div className="mt-12">
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

          <div className="mt-10 text-center">
            <p className="text-muted-foreground mb-4">Still have questions?</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a href={telLink()}>
                <Button variant="outline" className="rounded-full"><Phone className="h-4 w-4 mr-2" /> Call Us</Button>
              </a>
              <a href={whatsappLink('Hello, I have a question about renting a car.')} target="_blank" rel="noopener noreferrer">
                <Button className="btn-gold rounded-full"><MessageCircle className="h-4 w-4 mr-2" /> WhatsApp Us</Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-gradient-to-br from-foreground to-foreground/90 text-background relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-10" />
        <div className="container-lux relative text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-5xl font-bold mb-4"
          >
            Ready for Your <span className="text-gradient-gold">Premium Journey?</span>
          </motion.h2>
          <p className="text-background/70 max-w-xl mx-auto mb-8">
            Book your car in minutes. Available 24/7 across India with transparent pricing and professional service.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/fleet">
              <Button className="btn-gold rounded-full text-base px-8 h-12">Explore Fleet <ArrowRight className="h-5 w-5 ml-2" /></Button>
            </Link>
            <a href={telLink()}>
              <Button variant="outline" className="rounded-full text-base px-8 h-12 border-background/30 text-background hover:bg-background/10"><Phone className="h-5 w-5 mr-2" /> {CONTACT.phoneDisplay}</Button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
