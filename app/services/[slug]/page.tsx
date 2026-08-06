import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MotionDiv } from '@/components/ui/motion';
import { CheckCircle2, ArrowRight, Phone, MessageCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CarCard } from '@/components/fleet/car-card';
import { SectionHeading } from '@/components/ui/section-heading';
import { SERVICES } from '@/lib/data/site';
import { CARS } from '@/lib/data/cars';
import { CONTACT, whatsappLink, telLink } from '@/lib/data/contact';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const service = SERVICES.find((s) => s.slug === params.slug);
  if (!service) return { title: 'Service Not Found' };

  return {
    title: `${service.title} in India — Rentora Mobility`,
    description: service.description,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: `${service.title} — Rentora Mobility`,
      description: service.description,
      images: [{ url: service.image }],
    },
  };
}

const CATEGORY_MAP: Record<string, string[]> = {
  'airport-transfers': ['Economy', 'Premium', 'SUV'],
  'corporate-rentals': ['Premium', 'SUV', 'Luxury', 'Executive Vans'],
  'luxury-rentals': ['Luxury'],
  'outstation-trips': ['SUV', 'Premium', 'Economy'],
  'wedding-cars': ['Luxury', 'SUV'],
  'self-drive': ['Economy', 'Premium', 'SUV'],
};

export default function ServiceDetailPage({ params }: PageProps) {
  const service = SERVICES.find((s) => s.slug === params.slug);
  if (!service) notFound();

  const relevantCars = CARS.filter((c) => CATEGORY_MAP[service.slug]?.includes(c.category)).slice(0, 4);

  const faqs: Record<string, { q: string; a: string }[]> = {
    'airport-transfers': [
      { q: 'Which airports do you cover?', a: 'We cover all major Indian airports including Delhi (DEL), Mumbai (BOM), Bangalore (BLR), Hyderabad (HYD), Chennai (MAA), Pune (PNQ), Jaipur (JAI) and more.' },
      { q: 'Will the driver track my flight?', a: 'Yes, our chauffeurs track your flight in real-time and adjust pickup timing for delays or early arrivals.' },
      { q: 'Is there a waiting charge?', a: 'The first 60 minutes of waiting are complimentary. After that, a nominal waiting charge applies.' },
    ],
    'corporate-rentals': [
      { q: 'Do you offer monthly billing?', a: 'Yes, corporate clients receive monthly invoicing with GST invoices and a dedicated account manager.' },
      { q: 'Can we get a dedicated vehicle?', a: 'Absolutely. We offer dedicated vehicles with the same chauffeur for consistency and comfort.' },
      { q: 'What about bulk bookings for events?', a: 'We handle bulk bookings for conferences, offsites and events with special pricing. Contact us for a custom quote.' },
    ],
    'luxury-rentals': [
      { q: 'Are luxury cars chauffeur-driven only?', a: 'Yes, our luxury fleet (BMW, Mercedes, Audi) is available with professional chauffeurs only, ensuring a premium experience.' },
      { q: 'Can I book a luxury car for airport pickup?', a: 'Yes, luxury cars are available for airport transfers, events, weddings and full-day bookings.' },
      { q: 'How far in advance should I book?', a: 'We recommend booking luxury cars at least 48 hours in advance to ensure availability.' },
    ],
    'outstation-trips': [
      { q: 'Do you charge per km or per day?', a: 'Outstation trips are priced per km for one-way trips and per day for round trips. All pricing is transparent with no hidden charges.' },
      { q: 'Are interstate taxes included?', a: 'Interstate taxes are charged at actuals and are not included in the base price. Your driver will inform you of applicable taxes.' },
      { q: 'Can I plan a multi-city itinerary?', a: 'Yes, we support custom multi-city itineraries. Contact us with your plan for a tailored quote.' },
    ],
    'wedding-cars': [
      { q: 'Do you provide car decoration?', a: 'Yes, we offer custom floral decoration for wedding cars. Choose from our decoration packages or request a custom theme.' },
      { q: 'Can I book multiple cars for the wedding party?', a: 'Absolutely. We handle bulk bookings for weddings including baraati cars and guest transport.' },
      { q: 'Will the chauffeur be in formal attire?', a: 'Yes, our chauffeurs arrive in formal attire for wedding bookings to match the occasion.' },
    ],
    'self-drive': [
      { q: 'What documents are required?', a: 'A valid driving licence, Aadhaar card or passport, and a credit/debit card for the security deposit.' },
      { q: 'Is there a km limit?', a: 'We offer both limited and unlimited km packages. Unlimited km packages are available for weekly bookings.' },
      { q: 'Do you deliver the car to my location?', a: 'Yes, doorstep delivery is available within city limits for a nominal fee.' },
    ],
  };

  const serviceFaqs = faqs[service.slug] || [];

  return (
    <div className="pt-24 pb-20">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-end overflow-hidden">
        <img src={service.image} alt={`${service.title} - Rentora Mobility`} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />
        <div className="container-lux relative px-4 sm:px-6 lg:px-8 pb-12">
          <MotionDiv initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 text-sm text-white/70 mb-3">
              <Link href="/" className="hover:text-gold">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/services" className="hover:text-gold">Services</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white">{service.shortTitle}</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white tracking-tight">{service.title}</h1>
            <p className="mt-4 text-lg text-white/80 max-w-2xl">{service.description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link href="/fleet"><Button className="btn-gold rounded-full">Book Now <ArrowRight className="h-4 w-4 ml-2" /></Button></Link>
              <a href={telLink()}><Button variant="outline" className="rounded-full border-white/30 text-white hover:bg-white/10"><Phone className="h-4 w-4 mr-2" /> {CONTACT.phoneDisplay}</Button></a>
            </div>
          </MotionDiv>
        </div>
      </section>

      {/* Features */}
      <section className="section-pad">
        <div className="container-lux">
          <SectionHeading eyebrow="What's Included" title="Premium Service, Every Time" center={false} className="mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {service.features.map((feature, i) => (
              <MotionDiv key={feature} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3 rounded-xl border border-border p-4">
                <CheckCircle2 className="h-5 w-5 text-gold shrink-0" />
                <span className="text-sm font-medium">{feature}</span>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      {/* Relevant cars */}
      {relevantCars.length > 0 && (
        <section className="section-pad bg-card/30">
          <div className="container-lux">
            <SectionHeading eyebrow="Recommended" title={`Cars for ${service.title}`} subtitle="Handpicked vehicles perfect for this service." className="mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relevantCars.map((car, i) => (
                <CarCard key={car.slug} car={car} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {serviceFaqs.length > 0 && (
        <section className="section-pad">
          <div className="container-lux max-w-3xl">
            <SectionHeading eyebrow="FAQ" title={`${service.title} Questions`} />
            <div className="mt-8 space-y-4">
              {serviceFaqs.map((faq, i) => (
                <div key={i} className="luxury-card p-5">
                  <h4 className="font-semibold mb-2">{faq.q}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-pad bg-gradient-to-br from-foreground to-foreground/90 text-background relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-10" />
        <div className="container-lux relative text-center">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Book Your <span className="text-gradient-gold">{service.title}</span></h2>
          <p className="text-background/70 max-w-xl mx-auto mb-8">Starting from ₹{service.startingPrice.toLocaleString('en-IN')}. Available 24/7 across India.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/fleet"><Button className="btn-gold rounded-full text-base px-8 h-12">Explore Fleet</Button></Link>
            <a href={whatsappLink(`Hello, I'm interested in your ${service.title} service.`)} target="_blank" rel="noopener noreferrer"><Button variant="outline" className="rounded-full text-base px-8 h-12 border-background/30 text-background hover:bg-background/10"><MessageCircle className="h-5 w-5 mr-2" /> WhatsApp</Button></a>
          </div>
        </div>
      </section>
    </div>
  );
}
