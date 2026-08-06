import type { Metadata } from 'next';
import { MotionDiv } from '@/components/ui/motion';
import { ShieldCheck, Clock, IndianRupee, MapPin, Car, Headset, Target, Eye, Heart } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { STATS, WHY_CHOOSE_US } from '@/lib/data/site';
import { CONTACT } from '@/lib/data/contact';

export const metadata: Metadata = {
  title: 'About Us — Premium Mobility Platform in India | Rentora Mobility',
  description: 'Learn about Rentora Mobility — India\'s premium car rental & mobility platform. Available across 120+ cities with 500+ vehicles and 50,000+ happy customers.',
  alternates: { canonical: '/about' },
};

const ICONS: Record<string, any> = { ShieldCheck, Clock, IndianRupee, MapPin, Car, Headset };

const VALUES = [
  { icon: Target, title: 'Mission', text: 'To make premium mobility accessible, reliable and effortless for every traveller in India.' },
  { icon: Eye, title: 'Vision', text: 'To become India\'s most trusted mobility platform, redefining how people travel.' },
  { icon: Heart, title: 'Values', text: 'Trust, transparency, safety and exceptional service guide everything we do.' },
];

const MILESTONES = [
  { year: '2023', title: 'Founded', text: 'Rentora Mobility was born with a vision to transform premium car rentals in India.' },
  { year: '2024', title: '50 Cities', text: 'Expanded to 50+ cities with a growing fleet of economy to luxury vehicles.' },
  { year: '2024', title: '25,000 Customers', text: 'Crossed 25,000 happy customers with a 4.9/5 satisfaction rating.' },
  { year: '2025', title: '120+ Cities', text: 'Now available across 120+ cities in India with 500+ vehicles in our fleet.' },
];

export default function AboutPage() {
  return (
    <div className="pt-28 pb-20">
      {/* Hero */}
      <section className="container-lux px-4 sm:px-6 lg:px-8 mb-16">
        <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
          <div className="text-xs font-semibold uppercase tracking-[0.25em] text-gold mb-3">About Rentora Mobility</div>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight">
            Premium Mobility. <span className="text-gradient-gold">Trusted Journeys.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Rentora Mobility is India&apos;s premium car rental and mobility platform, serving travellers across 120+ cities. From economical hatchbacks to chauffeur-driven luxury sedans, we&apos;re redefining how India travels — with trust, transparency and technology.
          </p>
        </MotionDiv>
      </section>

      {/* Stats */}
      <section className="relative py-16 bg-gradient-to-br from-foreground to-foreground/80 text-background overflow-hidden mb-16">
        <div className="absolute inset-0 grid-pattern opacity-10" />
        <div className="container-lux relative px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {STATS.map((stat, i) => (
              <MotionDiv key={stat.label} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="font-display text-4xl md:text-5xl font-bold text-gradient-gold">{stat.value}</div>
                <div className="mt-2 text-sm text-background/70 uppercase tracking-wider">{stat.label}</div>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="section-pad">
        <div className="container-lux">
          <div className="grid md:grid-cols-3 gap-6">
            {VALUES.map((val, i) => (
              <MotionDiv key={val.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="luxury-card p-8 text-center">
                <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-gold/10 text-gold mb-4">
                  <val.icon className="h-8 w-8" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-3">{val.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{val.text}</p>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-pad bg-card/30">
        <div className="container-lux">
          <SectionHeading eyebrow="Our Journey" title="Milestones" subtitle="From a startup idea to India's trusted mobility platform." />
          <div className="mt-12 max-w-3xl mx-auto">
            {MILESTONES.map((m, i) => (
              <MotionDiv key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex gap-6 pb-8 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full btn-gold font-bold text-sm shrink-0">{m.year.slice(2)}</div>
                  {i < MILESTONES.length - 1 && <div className="w-0.5 flex-1 bg-border mt-2" />}
                </div>
                <div className="pt-1.5 pb-4">
                  <div className="text-sm font-semibold text-gold">{m.year}</div>
                  <h4 className="font-display text-xl font-bold mt-1">{m.title}</h4>
                  <p className="text-muted-foreground mt-1">{m.text}</p>
                </div>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="section-pad">
        <div className="container-lux">
          <SectionHeading eyebrow="Why Us" title="Why Choose Rentora Mobility" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {WHY_CHOOSE_US.map((item, i) => {
              const Icon = ICONS[item.icon] || ShieldCheck;
              return (
                <MotionDiv key={item.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="luxury-card p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 text-gold mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.text}</p>
                </MotionDiv>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
