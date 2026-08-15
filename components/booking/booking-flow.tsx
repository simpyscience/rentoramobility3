'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays, CheckCircle2, Clock3, MapPin, Phone, MessageCircle, ShieldCheck, Sparkles, Link as LinkIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Car } from '@/lib/data/cars';
import { CITIES } from '@/lib/data/site';
import { CONTACT, whatsappLink, telLink } from '@/lib/data/contact';

const TIMES = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

function formatDateInput(date: Date) {
  return date.toISOString().split('T')[0];
}

function formatDisplayDate(dateValue: string) {
  if (!dateValue) return '—';
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return dateValue;
  return parsed.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatDisplayTime(timeValue: string) {
  return timeValue || '—';
}

export function calculateBookingEstimate({
  car,
  pickupDate,
  returnDate,
  pickupTime,
  returnTime,
}: {
  car: Car;
  pickupDate: string;
  returnDate: string;
  pickupTime: string;
  returnTime: string;
}) {
  const start = new Date(`${pickupDate}T${pickupTime}:00`);
  const end = new Date(`${returnDate}T${returnTime}:00`);
  const diffMs = Math.max(end.getTime() - start.getTime(), 60 * 60 * 1000);
  const totalHours = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60)));
  const fullDays = Math.floor(totalHours / 24);
  const remainingHours = totalHours % 24;
  const pricePerHour = Math.max(Math.round(car.pricePerDay / 8), 800);
  const baseRental = fullDays * car.pricePerDay + (remainingHours > 0 ? remainingHours * pricePerHour : 0);
  const gst = Math.round(baseRental * 0.05);
  const total = baseRental + gst;
  const durationLabel = totalHours < 24
    ? `${totalHours} hour${totalHours > 1 ? 's' : ''}`
    : `${fullDays} day${fullDays > 1 ? 's' : ''}${remainingHours > 0 ? ` ${remainingHours} hour${remainingHours > 1 ? 's' : ''}` : ''}`;

  return {
    totalHours,
    durationLabel,
    baseRental,
    gst,
    total,
    pricePerHour,
  };
}

export function BookingFlow({ car }: { car: Car }) {
  const router = useRouter();
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const defaultPickupDate = formatDateInput(today);
  const defaultReturnDate = formatDateInput(tomorrow);

  const [pickupLocation, setPickupLocation] = React.useState(CITIES[0]?.name || 'Delhi');
  const [dropLocation, setDropLocation] = React.useState(CITIES[1]?.name || 'Mumbai');
  const [pickupDate, setPickupDate] = React.useState(defaultPickupDate);
  const [returnDate, setReturnDate] = React.useState(defaultReturnDate);
  const [pickupTime, setPickupTime] = React.useState('10:00');
  const [returnTime, setReturnTime] = React.useState('10:00');

  const estimate = React.useMemo(() => calculateBookingEstimate({ car, pickupDate, returnDate, pickupTime, returnTime }), [car, pickupDate, returnDate, pickupTime, returnTime]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams({
      pickupLocation,
      dropLocation,
      pickupDate,
      returnDate,
      pickupTime,
      returnTime,
    });
    router.push(`/booking/${car.slug}/confirmation?${params.toString()}`);
  };

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="container-lux px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <motion.form
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="luxury-card p-6 md:p-8"
          >
            <div className="flex items-center gap-2 text-gold mb-3">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em]">Reservation Request</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">Book {car.name}</h1>
            <p className="mt-3 text-muted-foreground max-w-2xl">
              Reserve your premium ride with flexible pickup and return timings. The estimate updates instantly as you choose your schedule.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field icon={MapPin} label="Pickup location" value={pickupLocation} onChange={setPickupLocation} type="select" options={CITIES.map((city) => city.name)} />
              <Field icon={MapPin} label="Drop location" value={dropLocation} onChange={setDropLocation} type="select" options={CITIES.map((city) => city.name)} />
              <Field icon={CalendarDays} label="Pickup date" value={pickupDate} onChange={setPickupDate} type="date" />
              <Field icon={CalendarDays} label="Return date" value={returnDate} onChange={setReturnDate} type="date" min={pickupDate} />
              <Field icon={Clock3} label="Pickup time" value={pickupTime} onChange={setPickupTime} type="select" options={TIMES} />
              <Field icon={Clock3} label="Return time" value={returnTime} onChange={setReturnTime} type="select" options={TIMES} />
            </div>

            <div className="mt-6 rounded-2xl border border-border/70 bg-muted/40 p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Estimated rental duration</span>
                <span className="font-semibold text-foreground">{estimate.durationLabel}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Estimated price</span>
                <span className="font-semibold text-gold">₹{estimate.total.toLocaleString('en-IN')}</span>
              </div>
              <div className="text-xs text-muted-foreground">Includes base rental, hourly charges where applicable, and 5% GST.</div>
            </div>

            <Button type="submit" className="btn-gold w-full rounded-full h-12 mt-6 group">
              Continue to confirmation
              <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </motion.form>

          <motion.aside
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="space-y-6"
          >
            <div className="luxury-card p-6">
              <img src={car.image} alt={`${car.name} booking selection`} className="h-48 w-full rounded-2xl object-cover" />
              <div className="mt-5 flex items-start justify-between gap-3">
                <div>
                  <Badge className="bg-gold/90 text-[hsl(var(--gold-foreground))] border-0">{car.category}</Badge>
                  <h2 className="font-display text-2xl font-bold mt-3">{car.name}</h2>
                  <p className="text-sm text-muted-foreground mt-2">{car.tagline}</p>
                </div>
                <div className="rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-sm font-semibold text-gold">
                  ★ {car.rating}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <InfoChip label="Seats" value={`${car.specs.passengers}`} />
                <InfoChip label="Fuel" value={car.specs.fuel} />
                <InfoChip label="Transmission" value={car.specs.transmission} />
                <InfoChip label="Mileage" value={car.specs.mileage} />
              </div>

              <div className="mt-6 rounded-2xl border border-border/70 p-4 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Base rate</span>
                  <span className="font-semibold">₹{car.pricePerDay.toLocaleString('en-IN')}/day</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Hourly rate</span>
                  <span className="font-semibold">₹{estimate.pricePerHour.toLocaleString('en-IN')}/hr</span>
                </div>
              </div>
            </div>

            <div className="luxury-card p-6">
              <div className="flex items-center gap-2 text-gold mb-3">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-sm font-semibold">Premium assurance</span>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Transparent pricing with no hidden fees</li>
                <li>• Verified vehicles and professional support</li>
                <li>• Flexible pickup and return windows</li>
                <li>• Quick confirmation on your selected schedule</li>
              </ul>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}

export function BookingConfirmation({ car }: { car: Car }) {
  const searchParams = useSearchParams();
  const pickupLocation = searchParams.get('pickupLocation') || 'Delhi';
  const dropLocation = searchParams.get('dropLocation') || 'Delhi';
  const pickupDate = searchParams.get('pickupDate') || '';
  const returnDate = searchParams.get('returnDate') || '';
  const pickupTime = searchParams.get('pickupTime') || '10:00';
  const returnTime = searchParams.get('returnTime') || '10:00';

  const estimate = React.useMemo(() => calculateBookingEstimate({ car, pickupDate, returnDate, pickupTime, returnTime }), [car, pickupDate, returnDate, pickupTime, returnTime]);

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="container-lux px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="luxury-card p-6 md:p-8">
          <div className="flex items-center gap-2 text-gold mb-3">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em]">Booking Summary</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">Your reservation is ready</h1>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            We have assembled your selected schedule and the estimated pricing for {car.name}. Our team will confirm your reservation shortly.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-border/70 bg-muted/40 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Vehicle</span>
                <span className="font-semibold text-foreground">{car.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Pickup</span>
                <span className="font-semibold text-foreground">{pickupLocation} · {formatDisplayDate(pickupDate)} · {formatDisplayTime(pickupTime)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Return</span>
                <span className="font-semibold text-foreground">{dropLocation} · {formatDisplayDate(returnDate)} · {formatDisplayTime(returnTime)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Rental duration</span>
                <span className="font-semibold text-foreground">{estimate.durationLabel}</span>
              </div>
              <div className="rounded-2xl border border-gold/20 bg-gold/10 p-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Estimated total</span>
                  <span className="font-semibold text-gold">₹{estimate.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="luxury-card p-5">
                <h2 className="font-display text-xl font-bold">Selected vehicle</h2>
                <div className="mt-4 flex items-center gap-3">
                  <img src={car.image} alt={car.name} className="h-20 w-20 rounded-xl object-cover" />
                  <div>
                    <div className="text-sm text-muted-foreground">{car.brand}</div>
                    <div className="font-semibold">{car.name}</div>
                    <div className="text-sm text-muted-foreground">{car.category}</div>
                  </div>
                </div>
              </div>
              <div className="luxury-card p-5">
                <h3 className="font-semibold">What happens next?</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>• Our team will review the request and confirm availability.</li>
                  <li>• A pricing confirmation will be shared on your selected schedule.</li>
                  <li>• You can reach us directly for any urgent changes.</li>
                </ul>
              </div>

              <div className="flex flex-col gap-3">
                <a
                  href={whatsappLink(
                    `Hello Rentora Mobility, I just submitted a booking request.\nVehicle: ${car.name}\nPickup: ${pickupLocation} on ${formatDisplayDate(pickupDate)} at ${formatDisplayTime(pickupTime)}\nReturn: ${dropLocation} on ${formatDisplayDate(returnDate)} at ${formatDisplayTime(returnTime)}\nEstimated total: ₹${estimate.total.toLocaleString('en-IN')}`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Confirm this booking via WhatsApp"
                >
                  <Button className="w-full rounded-full bg-[#25D366] hover:bg-[#25D366]/90 text-white h-11">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Confirm via WhatsApp
                  </Button>
                </a>

                <a href={telLink()} aria-label="Call Rentora Mobility to confirm">
                  <Button variant="outline" className="w-full rounded-full h-11">
                    <Phone className="h-5 w-5 mr-2" />
                    Call Rentora
                  </Button>
                </a>

                <a
                  href={whatsappLink(`Hello Rentora Mobility, I have a question about my booking for ${car.name}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat with Rentora on WhatsApp"
                >
                  <Button variant="outline" className="w-full rounded-full h-11">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Chat on WhatsApp
                  </Button>
                </a>

                <a href="/fleet" aria-label="Browse more cars in our fleet">
                  <Button variant="outline" className="w-full rounded-full h-11">
                    <LinkIcon className="h-5 w-5 mr-2" />
                    Browse Fleet
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  value,
  onChange,
  type = 'select',
  options,
  min,
}: {
  icon: any;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'select' | 'date';
  options?: string[];
  min?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-gold" />
        {label}
      </span>
      {type === 'date' ? (
        <input
          type="date"
          value={value}
          min={min}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-2xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold"
        />
      ) : (
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-2xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold"
        >
          <option value="">Select</option>
          {options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
    </label>
  );
}

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/70 px-3 py-2 text-center text-sm">
      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
      <div className="mt-1 font-semibold">{value}</div>
    </div>
  );
}
