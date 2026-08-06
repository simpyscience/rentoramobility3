'use client';

import * as React from 'react';
import { Phone, MessageCircle, ArrowUp } from 'lucide-react';
import { whatsappLink, telLink } from '@/lib/data/contact';

export function FloatingActions() {
  const [showTop, setShowTop] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex h-10 w-10 items-center justify-center rounded-full glass shadow-luxury hover:scale-110 transition-transform"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
      <a
        href={telLink()}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background shadow-luxury hover:scale-110 transition-transform"
        aria-label="Call us"
      >
        <Phone className="h-5 w-5" />
      </a>
      <a
        href={whatsappLink('Hello Rentora Mobility, I would like to book a car.')}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-luxury hover:scale-110 transition-transform"
        aria-label="WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
}
