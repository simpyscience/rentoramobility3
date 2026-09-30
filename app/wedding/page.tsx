import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ArrowRight, Phone, MessageCircle, CheckCircle2, ChevronRight, Heart, Sparkles } from 'lucide-react';
import { MotionDiv } from '@/components/ui/motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionHeading } from '@/components/ui/section-heading';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CarCard } from '@/components/fleet/car-card';
import { WeddingSlideshow } from '@/components/wedding/wedding-slideshow';
import { CARS } from '@/lib/data/cars';
import { CONTACT, whatsappLink, telLink } from '@/lib/data/contact';
import { CITIES, SERVICES } from '@/lib/data/site';
import {
  WEDDING_SLIDESHOW_IMAGES,
  WEDDING_STORY_IMAGES,
  WEDDING_DIVIDERS,
  WEDDING_CAR_IMAGES,
} from '@/lib/data/wedding';

export const metadata: Metadata = {
  title: 'Wedding Cars — Luxury Wedding Transportation | Rentora Mobility',
  description:
    'Make your special day unforgettable with decorated luxury and classic cars for weddings in India. Chauffeur-driven BMW, Mercedes, Audi and more with custom floral decoration.',
  alternates: { canonical: '/wedding' },
  openGraph: {
    title: 'Wedding Cars — Luxury Wedding Transportation | Rentora Mobility',
    description:
      'Decorated luxury cars for weddings with chauffeurs in formal attire. BMW, Mercedes, Audi and baraat procession cars across India.',
  },
};

const weddingFeatures = [
  { icon: Sparkles, label: 'Custom Floral Decoration' },
  { icon: Heart, label: 'Luxury & Vintage Options' },
  { icon: CheckCircle2, label: 'Chauffeur in Formal Attire' },
  { icon: MapPin, label: 'Multi-Day Packages' },
];

const weddingFaqs = [
  {
    q: 'Do you provide car decoration for weddings?',
    a: 'Yes, we offer custom floral decoration for wedding cars. Choose from our decoration packages or request a custom theme that matches your wedding colours.',
  },
  {
    q: 'Can I book multiple cars for the wedding party?',
    a: 'Absolutely. We handle bulk bookings for weddings including baraati cars, bridal entry vehicles, and guest transport. Contact us for a custom quote.',
  },
  {
    q: 'Will the chauffeur be in formal attire?',
    a: 'Yes, our chauffeurs arrive in formal attire for wedding bookings to match the occasion and respect the significance of your day.',
  },
  {
    q: 'Which cars are available for weddings?',
    a: 'We offer decorated luxury and premium SUVs for weddings: BMW 5/7 Series, Mercedes E-Class, Audi A6, Mercedes GLS and Toyota Fortuner — all with chauffeurs in formal attire.',
  },
  {
    q: 'How far in advance should I book?',
    a: 'We recommend booking wedding cars at least 2–3 weeks in advance to secure your preferred vehicles and decoration theme. Last-minute requests are accommodated based on availability.',
  },
];

export default function WeddingPage() {
  const weddingCars = CARS.filter((c) => c.category === 'Luxury' || c.category === 'SUV').slice(0, 6);
  const service = SERVICES.find((s) => s.slug === 'wedding-cars');

  return (
    <>
      {/* SECTION 1 - PREMIUM WEDDING HERO */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden pt-20">
        <img
          src={WEDDING_CAR_IMAGES[0]}
          alt="Decorated wedding car"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="container-lux relative px-4 sm:px-6 lg:px-8">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl text-white"
          >
            <div className="flex items-center gap-2 mb-4">
              <Link href="/" className="text-white/70 hover:text-gold transition-colors text-sm">Home</Link>
              <ChevronRight className="h-3 w-3 text-white/50" />
              <span className="text-gold font-medium">Wedding Cars</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Weddings & Special Occasions
            </h1>
            <p className="text-lg text-white/80 mb-8 max-w-2xl">
              Make your special day unforgettable with decorated luxury and classic cars for weddings and baraat.
              From intimate family ceremonies to grand celebrations, we provide chauffeur-driven BMW, Mercedes, Audi
              and premium SUVs with custom floral decoration across India.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              {weddingFeatures.map((feat, i) => (
                <div key={i} className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white">
                  {feat.icon && (<feat.icon className="h-4 w-4 text-gold" />)}
                  {feat.label}
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="btn-gold rounded-full text-base h-12">
                <Link href="/fleet">
                  Book Wedding Car <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-white/30 text-white hover:bg-white/10 h-12">
                <a href={whatsappLink('Hello, I need to book a wedding car. We need decorated luxury cars for our wedding.')} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4 mr-2" /> Chat on WhatsApp
                </a>
              </Button>
            </div>
          </MotionDiv>
        </div>
      </section>

      {/* SECTION 2 - FULL-FRAME SLIDESHOW */}
      <section className="py-4 bg-card/50">
        <div className="container-lux">
          <WeddingSlideshow images={WEDDING_SLIDESHOW_IMAGES} alt="Wedding car service" />
        </div>
      </section>

      {/* SECTION 3 - WEDDING TRANSPORTATION INTRODUCTION */}
      <section className="section-pad">
        <div className="container-lux">
          <div className="mx-auto max-w-4xl text-center">
            <SectionHeading
              eyebrow="Special Occasion"
              title="Wedding Transportation"
              subtitle="Your wedding day deserves nothing but perfection. We bring together pristine luxury cars,
              skilled chauffeurs and meticulous attention to detail so every moment on the road is as memorable as the
              moments at the venue."
            />

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
              {weddingFeatures.map((feat, i) => (
                <MotionDiv
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="luxury-card p-6 text-center"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold mx-auto mb-3">
                    {feat.icon && (<feat.icon className="h-5 w-5" />)}
                  </div>
                  <p className="text-sm font-medium">{feat.label}</p>
                </MotionDiv>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 - ALTERNATING WEDDING STORY SECTIONS */}
      {WEDDING_STORY_IMAGES.map((img, i) => {
        const isEven = i % 2 === 0;
        const storyTitles = ['Elegant Decoration', 'Professional Chauffeurs', 'Punctual Timing', 'Vehicle Selection', 'Theme Matching', 'Extended Celebrations'];
        const storyTexts = [
          'Every wedding car in our fleet is meticulously maintained and professionally decorated. From elegant floral arrangements to ambient lighting, we create the perfect atmosphere for your special day.',
          'Our chauffeurs are selected for their professionalism and courtesy. They arrive in formal attire, ready to ensure a smooth, respectful experience for you and your guests.',
          'From the bride\'s entrance to the groom\'s baraat, we cover every transition. Our drivers know the importance of punctuality and graceful timing on your wedding day.',
          'We offer a range of vehicles to suit every wedding style — from classic luxury sedans for intimate ceremonies to grand SUVs for traditional baraat processions.',
          'Our decoration team works with you to match your wedding theme. Silk flowers, fresh blooms, draped fabrics and golden accents come together to create a cohesive, stunning presentation.',
          'Beyond the wedding day, we provide multi-day packages for extended celebrations, ensuring consistent quality and familiar faces throughout your festivities.',
        ];

        return (
          <section
            key={img.key}
            className={`section-pad ${i % 3 === 0 ? 'bg-card/30' : 'bg-background'}`}
          >
            <div className="container-lux">
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <MotionDiv
                  initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={isEven ? '' : 'lg:order-2'}
                >
                  <div className={`text-xs font-semibold uppercase tracking-[0.25em] text-gold mb-3`}>
                    Chapter {i + 1}
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl font-semibold tracking-tight mb-4">
                    {storyTitles[i]}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{storyTexts[i]}</p>
                </MotionDiv>

                <MotionDiv
                  initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className={isEven ? '' : 'lg:order-1'}
                >
                  <div className="relative group">
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-auto object-cover rounded-2xl shadow-luxury"
                    />
                    <div className="absolute inset-0 rounded-2xl ring-2 ring-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </MotionDiv>

                {i < WEDDING_STORY_IMAGES.length - 1 && (
                  <div className="lg:col-span-2 flex justify-center">
                    <img
                      src={WEDDING_DIVIDERS[i % WEDDING_DIVIDERS.length]}
                      alt=""
                      className="w-24 h-4 object-contain opacity-40"
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      })}

      {/* SECTION 5 - WEDDING CAR SHOWCASE */}
      <section className="section-pad bg-gradient-to-b from-background via-background to-muted/20">
        <div className="container-lux">
          <SectionHeading
            eyebrow="Recommended Vehicles"
            title="Wedding Cars & SUVs"
            subtitle="Handpicked luxury and premium vehicles, professionally decorated and chauffeur-driven for your special day."
          />

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {weddingCars.map((car, i) => (
              <CarCard key={car.slug} car={car} index={i} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild className="btn-gold rounded-full">
              <Link href="/fleet">
                View Full Fleet <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* SECTION 6 - DECORATIVE VISUAL */}
      <section className="py-0">
        <div className="relative w-full overflow-hidden">
          <img
            src={WEDDING_CAR_IMAGES[2]}
            alt=""
            aria-hidden="true"
            className="w-full h-auto object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 pb-12 text-center">
            <div className="container-lux">
              <Badge variant="secondary" className="mb-4 border-gold/30 bg-gold/10 text-gold">
                <Sparkles className="h-3 w-3 mr-1" /> Custom Floral Decoration
              </Badge>
              <h3 className="font-display text-2xl md:text-3xl font-bold mb-2">
                Complimentary Decoration
              </h3>
              <p className="text-sm text-muted-foreground max-w-xl mx-auto">
                Every wedding car includes complimentary rose petals, floral dashboard arrangement and ambient
                lighting to match your wedding theme.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 - FAQ */}
      <section className="section-pad">
        <div className="container-lux">
          <div className="mx-auto max-w-3xl">
            <SectionHeading
              eyebrow="Wedding Questions"
              title="Frequently Asked Questions"
              subtitle="Everything you need to know about booking wedding cars with Rentora Mobility."
            />

            <div className="mt-8">
              <Accordion type="multiple" className="space-y-3">
                {weddingFaqs.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="luxury-card px-6"
                  >
                    <AccordionTrigger className="text-left font-semibold py-4">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground pb-4">{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-gradient-to-br from-foreground to-foreground/90 text-background relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-10" />
        <div className="container-lux relative text-center">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Your Wedding Day Deserves <span className="text-gradient-gold">Perfection</span>
          </h2>
          <p className="text-background/70 max-w-xl mx-auto mb-8">
            {service?.startingPrice && (
              <>Starting from ₹{service.startingPrice.toLocaleString('en-IN')}.</>
            )} Available across {CITIES.length}+ cities in India.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/fleet">
              <Button className="btn-gold rounded-full text-base px-8 h-12">Explore Wedding Cars</Button>
            </Link>
            <a
              href={whatsappLink('Hello, I need to book a wedding car for my special day.')}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="rounded-full text-base px-8 h-12 border-background/30 text-background hover:bg-background/10">
                <MessageCircle className="h-5 w-5 mr-2" /> WhatsApp
              </Button>
            </a>
            <a href={telLink()}>
              <Button variant="outline" className="rounded-full text-base px-8 h-12 border-background/30 text-background hover:bg-background/10">
                <Phone className="h-5 w-5 mr-2" /> {CONTACT.phoneDisplay}
              </Button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
