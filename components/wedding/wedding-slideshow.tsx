'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function WeddingSlideshow({
  images,
  alt = 'Wedding service',
}: {
  images: string[];
  alt?: string;
}) {
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images]);

  const next = () => setCurrent((prev) => (prev + 1) % images.length);
  const prev = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);

  if (!images.length) return null;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl">
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={images[current]}
          alt={alt}
          className="w-full h-auto object-cover"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7 }}
        />
      </AnimatePresence>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm hover:bg-black/50 transition-colors focus:outline-none focus:ring-2 focus:ring-gold"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm hover:bg-black/50 transition-colors focus:outline-none focus:ring-2 focus:ring-gold"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 w-4 rounded-full transition-all ${
                  i === current ? 'w-8 bg-gold' : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
