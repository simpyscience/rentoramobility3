'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageLightboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: string[];
  startIndex?: number;
  alt?: string;
}

export function ImageLightbox({
  open,
  onOpenChange,
  images,
  startIndex = 0,
  alt,
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = React.useState(startIndex);

  React.useEffect(() => {
    if (open) setCurrentIndex(startIndex);
  }, [open, startIndex]);

  const handlePrev = () => {
    setCurrentIndex((i) => (i - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((i) => (i + 1) % images.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'Escape') onOpenChange(false);
  };

  const close = () => onOpenChange(false);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) close();
  };

  if (images.length === 0) return null;

  return (
    <AnimatePresence>
      {open && (
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
              key={images[currentIndex]}
              src={images[currentIndex]}
              alt={alt ? `${alt} - view ${currentIndex + 1}` : `Gallery image ${currentIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded-xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              loading="eager"
            />

            {images.length > 1 && (
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
              onClick={close}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {images.length > 1 && (
              <div className="mt-4 flex justify-center gap-2 text-sm text-white/60">
                <span>{currentIndex + 1}</span>
                <span>/</span>
                <span>{images.length}</span>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
