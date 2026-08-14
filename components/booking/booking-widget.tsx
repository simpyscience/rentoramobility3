'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CITIES } from '@/lib/data/site';

const TIMES = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

export function BookingWidget({ variant = 'hero' }: { variant?: 'hero' | 'compact' }) {
  const router = useRouter();
  const [pickupCity, setPickupCity] = React.useState('');
  const [dropCity, setDropCity] = React.useState('');
  const [pickupDate, setPickupDate] = React.useState('');
  const [dropDate, setDropDate] = React.useState('');
  const [pickupTime, setPickupTime] = React.useState('10:00');
  const [dropTime, setDropTime] = React.useState('10:00');

  const today = new Date().toISOString().split('T')[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (pickupCity) params.set('city', pickupCity);
    if (pickupDate) params.set('from', pickupDate);
    if (dropDate) params.set('to', dropDate);
    router.push(`/fleet?${params.toString()}`);
  };

  const fields: {
    icon: typeof MapPin;
    label: string;
    value: string;
    set: (v: string) => void;
    options?: string[];
    placeholder?: string;
    type?: 'select' | 'date';
    min?: string;
  }[] = [
    { icon: MapPin, label: 'Pickup City', value: pickupCity, set: setPickupCity, options: CITIES.map((c) => c.name), placeholder: 'Select city' },
    { icon: Calendar, label: 'Pickup Date', value: pickupDate, set: setPickupDate, type: 'date', min: today, placeholder: 'Select date' },
    { icon: Clock, label: 'Pickup Time', value: pickupTime, set: setPickupTime, options: TIMES, placeholder: 'Select time' },
    { icon: MapPin, label: 'Drop City', value: dropCity, set: setDropCity, options: CITIES.map((c) => c.name), placeholder: 'Select city' },
    { icon: Calendar, label: 'Return Date', value: dropDate, set: setDropDate, type: 'date', min: pickupDate || today, placeholder: 'Select date' },
    { icon: Clock, label: 'Return Time', value: dropTime, set: setDropTime, options: TIMES, placeholder: 'Select time' },
  ];

  if (variant === 'hero') {
    return (
      <form onSubmit={handleSearch} className="bg-white rounded-2xl md:rounded-3xl shadow-luxury p-4 md:p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {fields.slice(0, 4).map((f, i) => (
            <FieldInput key={i} {...f} hero />
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <Button type="submit" className="btn-gold rounded-full px-8 h-12 text-base group">
            <Search className="h-5 w-5 mr-2" /> Search Cars
            <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </form>
    );
  }

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSearch} className="glass rounded-2xl p-4 shadow-luxury">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {fields.map((f, i) => (
            <FieldInput key={i} {...f} compact />
          ))}
        </div>
        <Button type="submit" className="btn-gold w-full mt-3 rounded-xl">
          <Search className="h-4 w-4 mr-2" /> Search Cars
        </Button>
      </form>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      onSubmit={handleSearch}
      className="glass rounded-3xl p-6 md:p-8 shadow-luxury w-full max-w-5xl"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {fields.map((f, i) => (
          <FieldInput key={i} {...f} />
        ))}
      </div>
      <Button type="submit" className="btn-gold w-full mt-5 rounded-xl h-12 text-base group">
        <Search className="h-5 w-5 mr-2" /> Search Available Cars
        <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
      </Button>
    </motion.form>
  );
}

function FieldInput({
  icon: Icon,
  label,
  value,
  set,
  options,
  placeholder,
  type = 'select',
  min,
  compact,
  hero,
}: {
  icon: any;
  label: string;
  value: string;
  set: (v: string) => void;
  options?: string[];
  placeholder?: string;
  type?: 'select' | 'date';
  min?: string;
  compact?: boolean;
  hero?: boolean;
}) {
  return (
    <label className={`block ${hero ? '' : ''}`}>
      <span className={`text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-1.5 ${hero ? 'text-foreground/70 font-semibold normal-case tracking-normal' : ''}`}>
        <Icon className={`h-3.5 w-3.5 text-gold ${hero ? 'h-4 w-4' : ''}`} /> {label}
      </span>
      {type === 'date' ? (
        <input
          type="date"
          value={value}
          min={min}
          onChange={(e) => set(e.target.value)}
          className={`w-full rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors ${hero ? 'border-0 bg-muted/50 py-3' : ''}`}
        />
      ) : (
        <div className="relative">
          <select
            value={value}
            onChange={(e) => set(e.target.value)}
            className={`w-full rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors appearance-none ${hero ? 'border-0 bg-muted/50 py-3 pr-10' : ''}`}
          >
            <option value="">{placeholder}</option>
            {options?.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <div className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground ${hero ? 'top-[calc(50%-2px)]' : 'top-[calc(50%-8px)]'}`}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>
      )}
    </label>
  );
}
