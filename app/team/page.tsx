import type { Metadata } from 'next';
import Link from 'next/link';
import { MotionDiv } from '@/components/ui/motion';
import { ArrowRight, ShieldCheck, Headset, MapPin } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { Button } from '@/components/ui/button';
import { CONTACT, telLink, whatsappLink } from '@/lib/data/contact';
import { FOUNDER, LEADERSHIP, type LeaderProfile } from '@/lib/data/team';
import { PartnerSection } from '@/components/sections/partner-section';

export const metadata: Metadata = {
  title: 'Our Team — Rentora Mobility',
  description: 'Meet the leadership behind Rentora Mobility — the team responsible for company direction, operations, finance, technology and customer experience.',
  alternates: { canonical: '/team' },
};

function LeaderCard({ profile, reverse = false }: { profile: LeaderProfile; reverse?: boolean }) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2">
      <MotionDiv
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={reverse ? 'lg:order-2' : ''}
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border">
          <img
            src={profile.image}
            alt={`${profile.name}, ${profile.role} of Rentora Mobility`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      </MotionDiv>
      <MotionDiv
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={reverse ? 'lg:order-1' : ''}
      >
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold">{profile.role}</div>
        <h2 className="mb-4 font-display text-3xl font-semibold tracking-tight md:text-4xl">{profile.name}</h2>
        <div className="space-y-4 leading-relaxed text-muted-foreground">
          {profile.bio.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </MotionDiv>
    </div>
  );
}

export default function TeamPage() {
  return (
    <div className="pb-20">
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0">
          <img
            src="/images/team/about-hero.jpg"
            alt="Rentora Mobility leadership and premium fleet"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(222,47%,8%)]/90 via-[hsl(222,47%,8%)]/70 to-[hsl(222,47%,8%)]" />
        </div>
        <div className="relative container-lux px-4 sm:px-6 lg:px-8 pb-24 pt-40 text-center md:pb-32 md:pt-48">
          <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-gold mb-4">Our Team</div>
            <h1 className="font-display text-4xl font-semibold tracking-tight leading-[1.1] text-white md:text-6xl">
              The People Behind <span className="text-gradient-gold">Rentora Mobility</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
              A focused leadership team united by one commitment — premium, reliable and genuinely caring mobility for every
              traveller.
            </p>
          </MotionDiv>
        </div>
      </section>

      {/* Leadership Introduction */}
      <section className="section-pad">
        <div className="container-lux mx-auto max-w-4xl">
          <SectionHeading eyebrow="Leadership" title="Direction, Operations & Experience" center />
          <p className="mt-10 text-center text-lg leading-relaxed text-muted-foreground">
            Rentora Mobility is guided by leaders responsible for company direction, operations, finance, technology, information
            systems and the customer experience. Together, they bring hands-on mobility knowledge and operational discipline to
            every journey we enable.
          </p>
        </div>
      </section>

      {/* Founder — featured */}
      <section className="section-pad bg-card/30">
        <div className="container-lux">
          <LeaderCard profile={FOUNDER} />
        </div>
      </section>

      {/* Leadership profiles */}
      <section className="section-pad">
        <div className="container-lux space-y-20">
          {LEADERSHIP.map((leader, i) => (
            <LeaderCard key={leader.slug} profile={leader} reverse={i % 2 === 0} />
          ))}
        </div>
      </section>

      {/* Partner */}
      <PartnerSection />

      {/* CTA */}
      <section className="section-pad">
        <div className="container-lux">
          <SectionHeading eyebrow="Travel With Us" title="Experience the Rentora Difference" center />
          <p className="mb-10 text-center text-muted-foreground">
            Explore our premium fleet or speak with our team — we are available around the clock.
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
            <a href="/fleet" className="luxury-card p-6 text-center group">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-600">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Fleet</div>
              <div className="text-sm font-semibold">Browse Cars</div>
            </a>
          </div>
          <div className="mt-8 flex justify-center">
            <Button asChild className="btn-gold rounded-full">
              <Link href="/fleet">
                Explore Fleet <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
