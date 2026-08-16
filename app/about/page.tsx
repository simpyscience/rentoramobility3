import type { Metadata } from 'next';
import Link from 'next/link';
import { MotionDiv } from '@/components/ui/motion';
import { ShieldCheck, Clock, IndianRupee, MapPin, Car, Headset, Target, Eye, Heart, ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { WHY_CHOOSE_US } from '@/lib/data/site';
import { CONTACT, telLink, whatsappLink } from '@/lib/data/contact';
import { Button } from '@/components/ui/button';
import { FOUNDER } from '@/lib/data/team';
import { PartnerSection } from '@/components/sections/partner-section';

const ICONS: Record<string, any> = { ShieldCheck, Clock, IndianRupee, MapPin, Car, Headset };

const VALUES = [
  { icon: Target, title: 'Mission', text: 'To make premium mobility accessible, reliable and effortless for every traveller.' },
  { icon: Eye, title: 'Vision', text: 'To build a trusted mobility platform that redefines how India travels.' },
  { icon: Heart, title: 'Values', text: 'Trust, transparency, safety and exceptional service guide everything we do.' },
];

export const metadata: Metadata = {
  title: 'About Us — Rentora Mobility',
  description: 'The story of Rentora Mobility — built on real mobility experience, operational discipline and a genuine commitment to the traveller. Meet our founder and leadership team.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <div className="pb-20">
      {/* Cinematic Hero */}
      <section className="relative">
        <div className="absolute inset-0">
          <img
            src="/images/team/about-hero.jpg"
            alt="Rentora Mobility premium vehicle on the road"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(222,47%,8%)]/90 via-[hsl(222,47%,8%)]/70 to-[hsl(222,47%,8%)]" />
        </div>
        <div className="relative container-lux px-4 sm:px-6 lg:px-8 pb-24 pt-40 text-center md:pb-32 md:pt-48">
          <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-gold mb-4">About Rentora Mobility</div>
            <h1 className="font-display text-4xl font-semibold tracking-tight leading-[1.1] text-white md:text-6xl">
              Premium Mobility.<br />
              <span className="text-gradient-gold">Trusted Journeys.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
              From the driver&apos;s seat to your doorstep — Rentora Mobility is built on real mobility experience, operational
              discipline and a genuine commitment to the traveller.
            </p>
          </MotionDiv>
        </div>
      </section>

      {/* Company Story */}
      <section className="section-pad">
        <div className="container-lux mx-auto max-w-4xl">
          <SectionHeading eyebrow="Our Story" title="Built From the Road Up" center />
          <div className="mt-10 space-y-5 text-lg leading-relaxed text-muted-foreground">
            <p>
              Rentora Mobility began with a simple observation made over thousands of kilometres on Indian roads: travellers
              do not just want a car, they want to feel looked after — from the first call to the final drop-off.
            </p>
            <p>
              That belief shaped every decision that followed. We built a mobility company around punctuality, well-maintained
              vehicles, transparent pricing and professional chauffeurs — the things that actually matter on a journey.
            </p>
            <p>
              Today, Rentora Mobility serves self-drive and chauffeur-driven travellers across the country, backed by the same
              operational discipline and customer-first thinking that started it all.
            </p>
          </div>
        </div>
      </section>

      {/* Founder Feature */}
      <section className="section-pad bg-card/30">
        <div className="container-lux">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <MotionDiv initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border">
                <img
                  src={FOUNDER.image}
                  alt={`${FOUNDER.name}, ${FOUNDER.role} of Rentora Mobility`}
                  className="h-full w-full object-cover"
                />
              </div>
            </MotionDiv>
            <MotionDiv initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
              <div className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold">Founder &amp; CEO</div>
              <h2 className="mb-4 font-display text-3xl font-semibold tracking-tight md:text-4xl">{FOUNDER.name}</h2>
              <div className="space-y-4 leading-relaxed text-muted-foreground">
                {FOUNDER.bio.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-7">
                <Button asChild className="btn-gold rounded-full">
                  <Link href="/team">
                    Meet the full team <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </MotionDiv>
          </div>
        </div>
      </section>

      {/* Mission, Vision & Values */}
      <section className="section-pad">
        <div className="container-lux">
          <SectionHeading eyebrow="Our Purpose" title="Mission, Vision & Values" center />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {VALUES.map((val, i) => (
              <MotionDiv
                key={val.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="luxury-card p-8 text-center"
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/10 text-gold">
                  <val.icon className="h-8 w-8" />
                </div>
                <h3 className="mb-3 font-sans text-xl font-semibold">{val.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{val.text}</p>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      {/* Why Rentora */}
      <section className="section-pad bg-card/30">
        <div className="container-lux">
          <SectionHeading eyebrow="Why Rentora" title="Built for the Way You Travel" center />
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {WHY_CHOOSE_US.map((item, i) => {
              const Icon = ICONS[item.icon] || ShieldCheck;
              return (
                <MotionDiv
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="luxury-card p-6"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 text-gold">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-sans text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </MotionDiv>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partner */}
      <PartnerSection />

      {/* Contact CTA */}
      <section className="section-pad">
        <div className="container-lux">
          <SectionHeading eyebrow="Get in Touch" title="Contact Rentora Mobility" center />
          <p className="mb-10 text-center text-muted-foreground">
            Whether you have a question about our fleet, need help with a booking, or want a custom quote — we are available
            around the clock.
          </p>
          <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-3">
            <a href={telLink()} className="luxury-card p-6 text-center group">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Call</div>
              <div className="text-sm font-semibold">{CONTACT.phoneDisplay}</div>
            </a>
            <a href={whatsappLink('Hello Rentora Mobility')} target="_blank" rel="noopener noreferrer" className="luxury-card p-6 text-center group">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366]">
                <Headset className="h-5 w-5" />
              </div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">WhatsApp</div>
              <div className="text-sm font-semibold">{CONTACT.whatsappDisplay}</div>
            </a>
            <a href={`mailto:${CONTACT.email}`} className="luxury-card p-6 text-center group">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-600">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Email</div>
              <div className="text-sm font-semibold truncate">{CONTACT.email}</div>
            </a>
          </div>
          <div className="mt-8 text-center">
            <a href="/contact">
              <Button variant="outline" className="rounded-full group">
                Full Contact Page <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
