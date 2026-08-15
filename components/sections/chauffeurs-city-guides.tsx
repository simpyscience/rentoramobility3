'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { Button } from '@/components/ui/button';
import { CITIES } from '@/lib/data/site';
import { getAllChauffeurImages } from '@/lib/data/images';
import { cn } from '@/lib/utils';

export function ChauffeursCityGuides() {
  const images = getAllChauffeurImages().slice(0, 4);

  return (
    <section className="section-pad bg-card/30">
      <div className="container-lux">
        <SectionHeading
          eyebrow="Professional Service"
          title="Professional Chauffeurs & City Guides"
          subtitle="Travel with trained, background-verified chauffeurs and local city guides across our key service locations."
        />

        <div className="grid lg:grid-cols-2 gap-10 items-center mt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-muted-foreground leading-relaxed mb-6">
              Whether it is an airport transfer, a corporate commute or a multi-day outstation trip, our professional
              chauffeurs and local guides help you move with comfort and confidence. Chauffeur-driven rentals include
              fuel for within-city use and a dedicated vehicle for consistency.
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {CITIES.map((city) => (
                <span
                  key={city.slug}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  <MapPin className="h-3 w-3 text-gold" /> {city.name}
                </span>
              ))}
            </div>

            <Button asChild className="btn-gold rounded-full">
              <a href="/fleet">
                Book with Chauffeur <ArrowRight className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="grid grid-cols-2 gap-4">
              {images.map((src, i) => (
                <div
                  key={src}
                  className={cn(
                    'relative overflow-hidden rounded-2xl border border-border',
                    i === 0 ? 'row-span-2 aspect-[4/5]' : 'aspect-[4/5]'
                  )}
                >
                  <img
                    src={src}
                    alt="Professional chauffeur service"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
