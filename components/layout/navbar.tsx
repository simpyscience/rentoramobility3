'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, MessageCircle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { CONTACT, whatsappLink, telLink } from '@/lib/data/contact';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/layout/logo';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/fleet', label: 'Fleet' },
  {
    href: '/services',
    label: 'Services',
    children: [
      { href: '/services/airport-transfers', label: 'Airport Transfers' },
      { href: '/services/corporate-rentals', label: 'Corporate Rentals' },
      { href: '/services/luxury-rentals', label: 'Luxury Rentals' },
      { href: '/services/outstation-trips', label: 'Outstation Trips' },
      { href: '/services/wedding-cars', label: 'Wedding Cars' },
      { href: '/services/self-drive', label: 'Self Drive' },
    ],
  },
  { href: '/destinations', label: 'Destinations' },
  { href: '/about', label: 'About' },
  { href: '/team', label: 'Team' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [servicesOpen, setServicesOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500',
          scrolled
            ? 'glass shadow-luxury py-2'
            : 'bg-transparent py-4'
        )}
      >
        <nav className="container-lux flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Logo />

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => link.children && setServicesOpen(true)}
                onMouseLeave={() => link.children && setServicesOpen(false)}
              >
                <Link
                  href={link.href}
                  className={cn(
                    'flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                    isActive(link.href)
                      ? 'text-gold'
                      : 'text-foreground/80 hover:text-gold'
                  )}
                >
                  {link.label}
                  {link.children && <ChevronDown className="h-3.5 w-3.5" />}
                </Link>
                {link.children && (
                  <AnimatePresence>
                    {servicesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 top-full pt-2 w-56"
                      >
                        <div className="glass rounded-xl p-2 shadow-luxury">
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-gold/10 hover:text-gold transition-colors"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <a
              href={telLink()}
              className="hidden xl:flex items-center gap-2 rounded-full border border-border/60 px-3 py-2 text-sm font-medium hover:border-gold/50 hover:text-gold transition-colors"
            >
              <Phone className="h-4 w-4" />
              {CONTACT.phoneDisplay}
            </a>
            <a
              href={whatsappLink('Hello Rentora Mobility, I would like to book a car.')}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 rounded-full bg-[#25D366] px-3 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden md:inline">WhatsApp</span>
            </a>
            <ThemeToggle />
            <Link href="/fleet" className="hidden sm:block">
              <Button className="btn-gold rounded-full text-sm">Book Now</Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] lg:hidden"
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-card shadow-luxury p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <Logo />
                <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <div key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        'block rounded-lg px-4 py-3 text-base font-medium transition-colors',
                        isActive(link.href) ? 'bg-gold/10 text-gold' : 'hover:bg-muted'
                      )}
                    >
                      {link.label}
                    </Link>
                    {link.children && (
                      <div className="ml-4 border-l border-border pl-2 my-1">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block rounded-lg px-4 py-2 text-sm text-muted-foreground hover:text-gold transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-col gap-3">
                <a href={telLink()} className="flex items-center justify-center gap-2 rounded-full border border-border px-4 py-3 text-sm font-medium">
                  <Phone className="h-4 w-4" /> {CONTACT.phoneDisplay}
                </a>
                <a
                  href={whatsappLink('Hello Rentora Mobility, I would like to book a car.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp Us
                </a>
                <Link href="/fleet">
                  <Button className="btn-gold w-full rounded-full">Book Now</Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
