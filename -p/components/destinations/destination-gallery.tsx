'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface DestinationGalleryProps {
  heroImage: string;
  gallery: string[];
  alt: string;
}

export function DestinationGallery({ heroImage, gallery, alt }: DestinationGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxIndex, setLightboxIndex] = React.useState(0);

  const allImages = React.useMemo(() => {
    const combined = [heroImage, ...gallery];
    return combined.filter((img, idx, arr) => arr.indexOf(img) === idx);
  }, [heroImage, gallery]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handlePrev = () => {
    setLightboxIndex((i) => (i - 1 + allImages.length) % allImages.length);
  };

  const handleNext = () => {
    setLightboxIndex((i) => (i + 1) % allImages.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'Escape') setLightboxOpen(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) setLightboxOpen(false);
  };

  return (
    <>
      {/* Hero Image */}
      <div className="relative aspect-[16/9] rounded-[2rem] overflow-hidden mb-12 group">
        <img
          src={heroImage}
          alt={alt}
          className="h-full w-full object-cover cursor-zoom-in transition-transform duration-300"
          loading="lazy"
          onClick={() => openLightbox(0)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <button
          onClick={() => openLightbox(0)}
          className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors"
          aria-label="View full image"
        >
          <Maximize2 className="h-5 w-5" />
        </button>
      </div>

      {/* Gallery Grid */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {allImages.slice(1).map((img, i) => (
            <button
              key={i}
              onClick={() => openLightbox(i + 1)}
              className="relative aspect-[16/10] rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <img src={img} alt={`${alt} gallery ${i + 1}`} className="h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <Maximize2 className="h-5 w-5 text-white" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
          >
            <motion.div
              className="relative max-w-6xl max-h-[90vh] mx-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onKeyDown={handleKeyDown}
              tabIndex={-1}
            >
              <motion.img
                key={allImages[lightboxIndex]}
                src={allImages[lightboxIndex]}
                alt={`${alt} - view ${lightboxIndex + 1}`}
                className="max-w-full max-h-[80vh] object-contain rounded-xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                loading="eager"
              />

              {allImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              <button
                onClick={() => setLightboxOpen(false)}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              {allImages.length > 1 && (
                <div className="mt-4 flex justify-center gap-2 text-sm text-white/60">
                  <span>{lightboxIndex + 1}</span>
                  <span>/</span>
                  <span>{allImages.length}</span>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
