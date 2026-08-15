'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle, ArrowUp } from 'lucide-react';
import { whatsappLink, telLink } from '@/lib/data/contact';
import { cn } from '@/lib/utils';

export function FloatingActions() {
  const [showTop, setShowTop] = React.useState(false);
  const [showContact, setShowContact] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 600);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {showContact && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 10 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col gap-2 w-52"
          >
            <motion.a
              href={telLink()}
              aria-label="Call Rentora Mobility"
              className="flex items-center justify-start gap-2.5 rounded-full border border-border bg-card/80 px-3.5 py-2 text-sm font-medium shadow-luxury backdrop-blur hover:border-gold/50 hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold"
              onClick={() => setShowContact(false)}
            >
              <Phone className="h-4 w-4 text-gold" />
              Call Us
            </motion.a>
            <motion.a
              href={whatsappLink('Hello Rentora Mobility, I would like to book a car.')}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Rentora Mobility"
              className="flex items-center justify-start gap-2.5 rounded-full bg-[#25D366] px-3.5 py-2 text-sm font-semibold text-white shadow-luxury hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-gold"
              onClick={() => setShowContact(false)}
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setShowContact((v) => !v)}
        aria-label={showContact ? 'Close contact options' : 'Open contact options'}
        aria-pressed={showContact}
        className={cn(
          'flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-luxury transition-all duration-200',
          showContact
            ? 'scale-110 rotate-180'
            : 'hover:scale-110 hover:shadow-xl',
          'focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2'
        )}
      >
        {showContact ? (
          <motion.span
            key="x"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            ✕
          </motion.span>
        ) : (
          <motion.span
            key="circle"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <MessageCircle className="h-6 w-6" />
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {showTop && !showContact && (
          <motion.button
            key="scrollTop"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Scroll to top"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/50 text-muted-foreground shadow-luxury hover:border-gold hover:text-gold hover:bg-gold/10 transition-colors focus:outline-none focus:ring-2 focus:ring-gold"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
