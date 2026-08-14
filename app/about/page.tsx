import type { Metadata } from 'next';
import { MotionDiv } from '@/components/ui/motion';
import { ShieldCheck, Clock, IndianRupee, MapPin, Car, Headset, Target, Eye, Heart, ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { WHY_CHOOSE_US } from '@/lib/data/site';
import { CONTACT, telLink, whatsappLink } from '@/lib/data/contact';
import { Button } from '@/components/ui/button';

const ICONS: Record<string, any> = { ShieldCheck, Clock, IndianRupee, MapPin, Car, Headset };

const VALUES = [
  { icon: Target, title: 'Mission', text: 'To make premium mobility accessible, reliable and effortless for every traveller.' },
  { icon: Eye, title: 'Vision', text: 'To become India\'s most trusted mobility platform, redefining how people travel.' },
  { icon: Heart, title: 'Values', text: 'Trust, transparency, safety and exceptional service guide everything we do.' },
];

export const metadata: Metadata = {
  title: 'About Us — Rentora Mobility',
  description: 'Rentora Mobility is a premium car rental and mobility platform offering self-drive, chauffeur-driven, airport transfer, corporate, outstation and wedding car rentals across India.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <div className="pt-28 pb-20">
      <section className="container-lux px-4 sm:px-6 lg:px-8 mb-20">
        <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
          <div className="text-xs font-semibold uppercase tracking-[0.25em] text-gold mb-4">About Rentora Mobility</div>
          <h1 className="font-display text-4xl md:text-6xl font-semibold tracking-tight leading-[1.1]">
            Premium Mobility.<br />
            <span className="text-gradient-gold">Trusted Journeys.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Rentora Mobility is a premium car rental and mobility platform offering self-drive, chauffeur-driven, airport transfer, corporate, outstation and wedding car rentals across India.
          </p>
        </MotionDiv>
      </section>

      <section className="section-pad">
        <div className="container-lux">
          <SectionHeading eyebrow="Our Purpose" title="Mission, Vision & Values" center />
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {VALUES.map((val, i) => (
              <MotionDiv key={val.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="luxury-card p-8 text-center">
                <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-gold/10 text-gold mb-5">
                  <val.icon className="h-8 w-8" />
                </div>
                <h3 className="font-sans text-xl font-semibold mb-3">{val.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{val.text}</p>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-card/30">
        <div className="container-lux">
          <SectionHeading eyebrow="Why Rentora" title="Built for the Way You Travel" center />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {WHY_CHOOSE_US.map((item, i) => {
              const Icon = ICONS[item.icon] || ShieldCheck;
              return (
                <MotionDiv key={item.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="luxury-card p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 text-gold mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-sans text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.text}</p>
                </MotionDiv>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-lux">
          <div className="luxury-card p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.25em] text-gold mb-3">What We Offer</div>
                <h2 className="font-sans text-3xl md:text-4xl font-semibold tracking-tight mb-4">
                  A Fleet for Every Occasion
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  From economical hatchbacks and sedans for city commutes and self-drive getaways, to premium luxury vehicles and spacious SUVs for chauffeur-driven travel — our fleet covers every need. Whether it is an airport transfer, corporate outing, family vacation, wedding, or an outstation road trip, Rentora Mobility provides the right car with transparent pricing and professional service.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a href="/fleet">
                    <Button className="btn-gold rounded-full">Explore Fleet</Button>
                  </a>
                  <a href={telLink()}>
                    <Button variant="outline" className="rounded-full">Call Us</Button>
                  </a>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: 'Self Drive', desc: 'Freedom to drive at your own pace' },
                  { title: 'Chauffeur-driven', desc: 'Professional drivers for a relaxed journey' },
                  { title: 'Airport Transfers', desc: 'On-time pickup and drop at all major airports' },
                  { title: 'Outstation', desc: 'One-way and round-trip across India' },
                  { title: 'Corporate', desc: 'Dedicated fleet for business travel' },
                  { title: 'Wedding Cars', desc: 'Luxury and decorated cars for special days' },
                ].map((svc) => (
                  <div key={svc.title} className="rounded-xl border border-border bg-muted/30 p-4">
                    <div className="text-sm font-semibold mb-1">{svc.title}</div>
                    <div className="text-xs text-muted-foreground leading-relaxed">{svc.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-lux">
          <SectionHeading eyebrow="Get in Touch" title="Contact Rentora Mobility" center />
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-10">
            Whether you have a question about our fleet, need help with a booking, or want a custom quote — we are available around the clock.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <a href={telLink()} className="luxury-card p-6 text-center group">
              <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-gold/10 text-gold mb-3">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Call</div>
              <div className="text-sm font-semibold">{CONTACT.phoneDisplay}</div>
            </a>
            <a href={whatsappLink('Hello Rentora Mobility')} target="_blank" rel="noopener noreferrer" className="luxury-card p-6 text-center group">
              <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366] mb-3">
                <Headset className="h-5 w-5" />
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">WhatsApp</div>
              <div className="text-sm font-semibold">{CONTACT.whatsappDisplay}</div>
            </a>
            <a href={`mailto:${CONTACT.email}`} className="luxury-card p-6 text-center group">
              <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-blue-500/10 text-blue-600 mb-3">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Email</div>
              <div className="text-sm font-semibold truncate">{CONTACT.email}</div>
            </a>
          </div>
          <div className="text-center mt-8">
            <a href="/contact">
              <Button variant="outline" className="rounded-full group">
                Full Contact Page <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
