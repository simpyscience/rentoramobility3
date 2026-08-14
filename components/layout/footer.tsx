'use client';

import * as React from 'react';
import Link from 'next/link';
import { Phone, Mail, MessageCircle, MapPin, ChevronRight } from 'lucide-react';
import { CONTACT, whatsappLink, telLink } from '@/lib/data/contact';
import { CITIES } from '@/lib/data/site';
import { Logo } from '@/components/layout/logo';

const FOOTER_LINKS = {
  Company: [
    { href: '/about', label: 'About Us' },
    { href: '/services', label: 'Services' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ],
  Services: [
    { href: '/services/airport-transfers', label: 'Airport Transfers' },
    { href: '/services/corporate-rentals', label: 'Corporate Rentals' },
    { href: '/services/luxury-rentals', label: 'Luxury Rentals' },
    { href: '/services/outstation-trips', label: 'Outstation Trips' },
    { href: '/services/wedding-cars', label: 'Wedding Cars' },
    { href: '/services/self-drive', label: 'Self Drive' },
  ],
  Legal: [
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/refund-policy', label: 'Refund Policy' },
    { href: '/cancellation-policy', label: 'Cancellation Policy' },
  ],
};

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-card/50">
      <div className="container-lux px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Logo />
            <p className="text-sm text-muted-foreground max-w-sm mb-6 mt-4">
              India&apos;s premium car rental & mobility platform. From economy to luxury, chauffeur-driven and self-drive — available across 120+ cities nationwide.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <a href={telLink()} className="flex items-center gap-2 hover:text-gold transition-colors">
                <Phone className="h-4 w-4 text-gold" /> {CONTACT.phoneDisplay} · {CONTACT.phone2Display}
              </a>
              <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 hover:text-gold transition-colors">
                <Mail className="h-4 w-4 text-gold" /> {CONTACT.email}
              </a>
              <a href={whatsappLink('Hello Rentora Mobility')} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-gold transition-colors">
                <MessageCircle className="h-4 w-4 text-gold" /> WhatsApp {CONTACT.whatsappDisplay} · {CONTACT.whatsapp2Display}
              </a>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-gold" /> Available Across India
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-gold transition-colors flex items-center gap-1 group">
                      <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* City Guides */}
        <div className="mt-12 pt-8 border-t border-border">
          <h4 className="text-xs font-semibold uppercase tracking-[0.25em] text-gold mb-3">City Guides</h4>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {CITIES.map((city) => (
              <Link key={city.slug} href={`/fleet?city=${city.slug}`} className="text-sm text-muted-foreground hover:text-gold transition-colors">
                {city.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} Rentora Mobility. All rights reserved. Premium Mobility. Trusted Journeys.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>GST Compliant</span>
            <span>&middot;</span>
            <span>24/7 Support</span>
            <span>&middot;</span>
            <span>Fully Insured</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
