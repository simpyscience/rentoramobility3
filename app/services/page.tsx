import type { Metadata } from 'next';
import Link from 'next/link';
import { MotionDiv } from '@/components/ui/motion';
import { ArrowRight, Plane, Building2, Crown, Map, Heart, Car, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/ui/section-heading';
import { SERVICES } from '@/lib/data/site';
import { CONTACT, whatsappLink, telLink } from '@/lib/data/contact';

export const metadata: Metadata = {
  title: 'Services — Premium Car Rental Services in India | Rentora Mobility',
  description: 'Airport transfers, corporate rentals, luxury cars, outstation trips, wedding cars and self drive. Premium mobility services across India.',
  alternates: { canonical: '/services' },
};

const ICONS: Record<string, any> = { Plane, Building2, Crown, Map, Heart, Car };

export default function ServicesPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="container-lux px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Services"
          title="Premium Mobility Services"
          subtitle="From airport pickups to luxury weddings — we provide reliable, premium transportation across India."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {SERVICES.map((service, i) => {
            const Icon = ICONS[service.icon] || Car;
            return (
              <MotionDiv
                key={service.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="luxury-card group overflow-hidden"
              >
                <Link href={`/services/${service.slug}`}>
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img src={service.image} alt={`${service.title} - Rentora Mobility`} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-4 left-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/90 text-[hsl(var(--gold-foreground))]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                      <h3 className="font-display text-2xl font-bold">{service.title}</h3>
                      <p className="text-sm text-white/80 mt-1 line-clamp-2">{service.description}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm">From <span className="font-bold text-gold">₹{service.startingPrice.toLocaleString('en-IN')}</span></span>
                        <span className="flex items-center gap-1 text-sm font-medium text-gold group-hover:gap-2 transition-all">
                          Learn more <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </MotionDiv>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href={telLink()}>
              <Button variant="outline" className="rounded-full"><Phone className="h-4 w-4 mr-2" /> {CONTACT.phoneDisplay}</Button>
            </a>
            <a href={whatsappLink('Hello Rentora Mobility, I would like to know more about your services.')} target="_blank" rel="noopener noreferrer">
              <Button className="btn-gold rounded-full"><MessageCircle className="h-4 w-4 mr-2" /> Chat on WhatsApp</Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
