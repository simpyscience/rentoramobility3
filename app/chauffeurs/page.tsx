import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ArrowRight, ShieldCheck, Clock, User, Phone } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { Button } from '@/components/ui/button';
import { CITIES } from '@/lib/data/site';
import { whatsappLink } from '@/lib/data/contact';
import { getAllChauffeurImages2 } from '@/lib/data/images';
import { FadeIn, FadeInUp } from '@/components/ui/motion';

const CHAUFFEUR_VALUES = [
  { icon: ShieldCheck, title: 'Safety First', desc: 'All chauffeurs are background-verified and trained in defensive driving.' },
  { icon: Clock, title: 'Punctuality', desc: 'We understand time is premium. Our chauffeurs arrive early, every time.' },
  { icon: User, title: 'Professional Appearance', desc: 'Uniformed chauffeurs with polished presentation and courteous service.' },
];

export const metadata: Metadata = {
  title: 'Professional Chauffeurs — Rentora Mobility',
  description:
    'Travel with Rentora Mobility\'s trained, background-verified professional chauffeurs across India. Chauffeur-driven rentals for airport transfers, corporate commutes, and outstation trips with comfort and reliability.',
  alternates: { canonical: '/chauffeurs' },
  openGraph: {
    title: 'Professional Chauffeurs — Rentora Mobility',
    description: 'Trained, background-verified chauffeurs across 20+ cities. Comfort, safety, and reliability for every journey.',
  },
};

export default function ChauffeursPage() {
  const images = getAllChauffeurImages2();

  return (
    <>
      {/* SECTION 1 - HERO / INTRODUCTION */}
      <FadeInUp className="pt-24 pb-16 bg-gradient-to-b from-background via-background to-muted/20">
        <div className="container-lux px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Professional Service"
            title="Professional Chauffeurs"
            subtitle="Travel with trained, background-verified chauffeurs and local city guides across our key service locations."
            center={false}
          />

          <div className="mt-8 max-w-3xl">
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Whether it is an airport transfer, a corporate commute or a multi-day outstation trip, our professional
              chauffeurs and local guides help you move with comfort and confidence. Chauffeur-driven rentals include
              fuel for within-city use and a dedicated vehicle for consistency.
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {CITIES.map((city) => (
                <span
                  key={city.slug}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  <MapPin className="h-3 w-3 text-gold" /> {city.name}
                </span>
              ))}
            </div>

            <Button asChild className="btn-gold rounded-full">
              <Link href="/fleet">
                Book with Chauffeur <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </FadeInUp>

      {/* SECTION 2 - IMAGE 1 */}
      {images[0] && (
        <FadeIn className="relative">
          <img
            src={images[0]}
            alt="Professional chauffeur service"
            className="w-full h-auto object-cover"
          />
        </FadeIn>
      )}

      {/* SECTION 3 - CHAUFFEUR STORY / CONTENT */}
      <section className="section-pad">
        <div className="container-lux px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <SectionHeading
              eyebrow="Our Promise"
              title="The Rentora Chauffeur Experience"
              subtitle="Every journey is handled with attention to detail, from the moment your chauffeur arrives until you reach your destination."
            />

            <div className="mt-12 prose prose-lg text-muted-foreground max-w-none">
              <p>
                At Rentora Mobility, we believe that getting around should be effortless. Our professional chauffeurs
                are carefully selected, thoroughly vetted, and continuously trained to uphold the highest standards of
                service. Every chauffeur in our network brings years of experience, courteous etiquette, and an intimate
                knowledge of the cities we serve.
              </p>

              <p>
                Whether you need a quiet airport transfer at dawn, a smooth corporate commute during business hours,
                or a comfortable outstation journey, our chauffeurs ensure you travel safely and on time. Chauffeur-driven
                rentals include fuel for within-city use and a dedicated vehicle for consistency, so you can focus on
                what matters - your journey.
              </p>
            </div>

            <div className="mt-12 grid md:grid-cols-3 gap-8">
              {CHAUFFEUR_VALUES.map((value) => (
                <div key={value.title} className="border border-border rounded-2xl p-6 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold mx-auto mb-4">
                    {value.icon && (<value.icon className="h-6 w-6" />)}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="btn-gold rounded-full">
                <Link href="/fleet">
                  Book with Chauffeur <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <a href={whatsappLink('Hello, I would like to know more about your professional chauffeur service.')} target="_blank" rel="noopener noreferrer">
                  <Phone className="h-4 w-4 mr-2" /> Contact Us
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
