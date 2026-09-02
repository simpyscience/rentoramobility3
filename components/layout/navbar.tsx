'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { CONTACT, whatsappLink, telLink } from '@/lib/data/contact';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/layout/logo';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/fleet', label: 'Fleet' },
  { href: '/destinations', label: 'Destinations' },
  { href: '/blog', label: 'Blog' },
  { href: '/#chauffeurs', label: 'Chauffeurs' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact Us' },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    const base = href.split('#')[0] || '/';
    return base === '/' ? pathname === '/' : pathname.startsWith(base);
  };

  return (
    <>
      {/* Single, coherent Rentora Mobility header. This is the only navigation bar
          in the app — it renders once in the global layout over the homepage hero
          (and every other page). The supplied Innova homepage composition is the
          visual source of truth; this white header board sits above it so there is
          exactly one navbar, one logo and one set of navigation links. */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed inset-x-0 top-0 z-50 border-b border-border bg-white/95 backdrop-blur-xl shadow-sm"
      >
        <nav className="container-lux flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-3">
          <Logo />

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                   className={cn(
                   'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                   isActive(link.href)
                     ? 'text-red-600'
                     : 'text-foreground/75 hover:text-red-600'
                 )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <a
              href={telLink()}
              className="hidden xl:flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm font-medium text-foreground/80 hover:border-gold/50 hover:text-gold transition-colors"
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
                  <Link
                    key={link.href}
                    href={link.href}
                     className={cn(
                       'block rounded-lg px-4 py-3 text-base font-medium transition-colors',
                       isActive(link.href) ? 'bg-red-600/10 text-red-600' : 'hover:bg-muted hover:text-red-600'
                     )}
                  >
                    {link.label}
                  </Link>
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
