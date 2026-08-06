'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Fuel, Gauge, Star, ArrowRight, CheckCircle2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Car } from '@/lib/data/cars';

const AVAILABILITY_STYLES: Record<string, string> = {
  Available: 'bg-green-500/10 text-green-600 border-green-500/20',
  Limited: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  'On Request': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
};

type CarWithLocations = {
  locations?: string[];
};

export function CarCard({ car, index = 0 }: { car: Car; index?: number }) {
  const displayLocations = ((car as CarWithLocations).locations || ['Delhi', 'Gurugram']).slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.4) }}
      className="luxury-card group overflow-hidden"
    >
      <Link href={`/fleet/${car.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={car.image}
            alt={`${car.name} rental in India - ${car.category}`}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className="bg-gold/90 text-[hsl(var(--gold-foreground))] border-0 font-semibold">
              {car.category}
            </Badge>
          </div>
          <div className="absolute top-3 right-3">
            <Badge variant="outline" className={`${AVAILABILITY_STYLES[car.availability]} backdrop-blur-md`}>
              {car.availability}
            </Badge>
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
            <div>
              <div className="text-xs font-medium opacity-90">{car.brand}</div>
              <div className="font-display text-xl font-bold leading-tight">{car.name}</div>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-md px-2.5 py-1">
              <Star className="h-3.5 w-3.5 fill-gold text-gold" />
              <span className="text-sm font-semibold">{car.rating}</span>
            </div>
          </div>
        </div>
      </Link>

      <div className="p-5">
        <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{car.tagline}</p>
        <div className="flex items-center gap-1.5 mb-4 text-[11px] text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-gold" />
          <span>{displayLocations.join(', ')}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <Spec icon={Users} label={`${car.specs.passengers} Seater`} />
          <Spec icon={Fuel} label={car.specs.fuel} />
          <Spec icon={Gauge} label={car.specs.transmission} />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <div className="text-xs text-muted-foreground">Starting from</div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-xl font-bold text-gold">
                ₹{car.pricePerDay.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-muted-foreground">/day</span>
            </div>
          </div>
          <Link href={`/booking/${car.slug}`}>
            <Button size="sm" className="btn-gold rounded-full group/btn">
              Book Now
              <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover/btn:translate-x-0.5" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function Spec({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="rounded-lg bg-muted/50 py-2 px-1">
      <Icon className="h-4 w-4 mx-auto mb-1 text-gold" />
      <div className="text-[11px] font-medium text-muted-foreground">{label}</div>
    </div>
  );
}

export function CarCardSkeleton() {
  return (
    <div className="luxury-card overflow-hidden animate-pulse">
      <div className="aspect-[16/10] bg-muted" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-2/3 bg-muted rounded" />
        <div className="h-20 bg-muted rounded" />
        <div className="h-8 w-1/2 bg-muted rounded" />
      </div>
    </div>
  );
}

export { CheckCircle2 };
