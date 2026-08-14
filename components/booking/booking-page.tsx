'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Calendar, Clock, ArrowRight, CheckCircle2, Phone, MessageCircle, Tag, User, Mail, ChevronRight, AlertCircle, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CarCard } from '@/components/fleet/car-card';
import { CITIES, COUPONS } from '@/lib/data/site';
import { CONTACT, whatsappLink } from '@/lib/data/contact';
import { getCarBySlug, getRelatedCars, type Car } from '@/lib/data/cars';
import { cn } from '@/lib/utils';

const TIMES = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

const SERVICE_TYPES = [
  { key: 'chauffeur', label: 'Chauffeur-driven', description: 'Professional driver included' },
  { key: 'self-drive', label: 'Self-drive', description: 'Drive yourself' },
] as const;

type ServiceType = (typeof SERVICE_TYPES)[number]['key'];

function formatDateInput(date: Date): string {
  return date.toISOString().split('T')[0];
}

function formatDisplayDate(dateValue: string): string {
  if (!dateValue) return '—';
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return dateValue;
  return parsed.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatDisplayTime(timeValue: string): string {
  return timeValue || '—';
}

export default function BookingPage({ params }: { params: { slug: string } }) {
  const searchParams = useSearchParams();
  const car = getCarBySlug(params.slug);
  const related = car ? getRelatedCars(car) : [];

  const [pickupCity, setPickupCity] = React.useState(searchParams.get('city') || '');
  const [dropCity, setDropCity] = React.useState(searchParams.get('city') || '');
  const [pickupDate, setPickupDate] = React.useState(searchParams.get('from') || '');
  const [dropDate, setDropDate] = React.useState(searchParams.get('to') || '');
  const [pickupTime, setPickupTime] = React.useState('10:00');
  const [dropTime, setDropTime] = React.useState('10:00');
  const [serviceType, setServiceType] = React.useState<ServiceType | ''>('');
  const [customerName, setCustomerName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [specialRequirements, setSpecialRequirements] = React.useState('');
  const [couponCode, setCouponCode] = React.useState('');
  const [appliedCoupon, setAppliedCoupon] = React.useState<{ code: string; discount: number; maxDiscount: number; label: string } | null>(null);
  const [couponError, setCouponError] = React.useState('');

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [availability, setAvailability] = React.useState<{ available: boolean; message: string } | null>(null);
  const [checkingAvailability, setCheckingAvailability] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [bookingRef, setBookingRef] = React.useState('');
  const [submitError, setSubmitError] = React.useState('');

  const today = new Date().toISOString().split('T')[0];

  const days = React.useMemo(() => {
    if (!pickupDate || !dropDate) return 0;
    const d1 = new Date(pickupDate);
    const d2 = new Date(dropDate);
    const diff = Math.max(1, Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
    return diff;
  }, [pickupDate, dropDate]);

  if (!car) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold mb-2">Car Not Found</h1>
          <p className="text-muted-foreground mb-4">The vehicle you are trying to book does not exist.</p>
          <a href="/fleet"><Button className="btn-gold rounded-full">Back to Fleet</Button></a>
        </div>
      </div>
    );
  }

  const basePrice = car.pricePerDay * days;
  const chauffeurPrice = serviceType === 'chauffeur' ? 500 * days : 0;
  const subtotal = basePrice + chauffeurPrice;
  const discount = appliedCoupon ? Math.min((subtotal * appliedCoupon.discount) / 100, appliedCoupon.maxDiscount) : 0;
  const gst = (subtotal - discount) * 0.05;
  const total = subtotal - discount + gst;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!customerName.trim()) errs.customerName = 'Full name is required';
    if (!phone.trim()) errs.phone = 'Phone number is required';
    else if (!/^[\d\s+-]{10,15}$/.test(phone.trim())) errs.phone = 'Enter a valid phone number';
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = 'Enter a valid email address';
    if (!pickupCity) errs.pickupCity = 'Pickup location is required';
    if (!dropCity) errs.dropCity = 'Drop-off location is required';
    if (!pickupDate) errs.pickupDate = 'Pickup date is required';
    if (!dropDate) errs.dropDate = 'Return date is required';
    if (pickupDate && dropDate) {
      const d1 = new Date(pickupDate);
      const d2 = new Date(dropDate);
      const todayStart = new Date(today);
      todayStart.setHours(0, 0, 0, 0);
      if (d1 < todayStart) errs.pickupDate = 'Pickup date cannot be in the past';
      if (d2 < d1) errs.dropDate = 'Return date cannot be before pickup date';
      if (d1.getTime() === d2.getTime() && dropTime <= pickupTime) errs.dropTime = 'Return time must be later than pickup time';
    }
    if (!serviceType) errs.serviceType = 'Please select a service type';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const checkAvailability = async () => {
    if (!car || !pickupDate || !dropDate) return;
    setCheckingAvailability(true);
    setAvailability(null);
    try {
      const pickupDateTime = `${pickupDate}T${pickupTime}:00`;
      const returnDateTime = `${dropDate}T${dropTime}:00`;
      const res = await fetch('/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicle: car.name,
          pickup_datetime: pickupDateTime,
          return_datetime: returnDateTime,
          city: pickupCity,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAvailability({ available: data.available, message: data.message });
      } else {
        setAvailability({ available: false, message: data.error || 'Unable to check availability.' });
      }
    } catch {
      setAvailability({ available: false, message: 'Network error. Please try again.' });
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;
    await checkAvailability();
    if (!availability?.available) return;

    setSubmitting(true);
    try {
      const pickupDateTime = `${pickupDate}T${pickupTime}:00`;
      const returnDateTime = `${dropDate}T${dropTime}:00`;
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName,
          phone,
          email,
          vehicle: car.name,
          service_type: serviceType,
          pickup_location: pickupCity,
          dropoff_location: dropCity,
          pickup_datetime: pickupDateTime,
          return_datetime: returnDateTime,
          special_requirements: specialRequirements || null,
          total_price: total.toFixed(0),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBookingRef(data.booking.booking_reference);
        setSubmitted(true);
      } else {
        setSubmitError(data.error || 'Booking failed. Please try again.');
      }
    } catch {
      setSubmitError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const applyCoupon = () => {
    const coupon = COUPONS.find((c) => c.code === couponCode.toUpperCase());
    if (coupon) {
      setAppliedCoupon(coupon);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code');
      setAppliedCoupon(null);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-20">
        <div className="container-lux px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="luxury-card p-6 md:p-12 max-w-2xl mx-auto text-center">
            <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-green-500/10 text-green-600 mb-6">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">Booking Confirmed!</h1>
            <p className="text-muted-foreground mb-8">Your booking request has been received. Our team will confirm shortly.</p>

            <div className="rounded-2xl border border-border bg-muted/30 p-6 space-y-3 text-sm text-left mb-8">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Booking Reference</span>
                <span className="font-semibold text-gold">{bookingRef}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Vehicle</span>
                <span className="font-semibold">{car.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Service</span>
                <span className="font-semibold">{serviceType === 'chauffeur' ? 'Chauffeur-driven' : 'Self-drive'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Pickup</span>
                <span className="font-semibold">{pickupCity} · {formatDisplayDate(pickupDate)} · {formatDisplayTime(pickupTime)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Return</span>
                <span className="font-semibold">{dropCity} · {formatDisplayDate(dropDate)} · {formatDisplayTime(dropTime)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-semibold">{days} day{days > 1 ? 's' : ''}</span>
              </div>
              <div className="border-t border-border pt-3 mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Estimated Total</span>
                  <span className="font-bold text-lg text-gold">₹{total.toFixed(0)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a href={whatsappLink(`Hello, I have booked ${car.name}. Booking ref: ${bookingRef}. Pickup: ${pickupCity} on ${pickupDate} at ${pickupTime}.`)} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white rounded-full">
                  <MessageCircle className="h-4 w-4 mr-2" /> Confirm via WhatsApp
                </Button>
              </a>
              <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`} className="flex-1">
                <Button variant="outline" className="w-full rounded-full">
                  <Phone className="h-4 w-4 mr-2" /> Call to Confirm
                </Button>
              </a>
            </div>
            <div className="mt-6">
              <a href="/fleet"><Button variant="ghost" className="text-muted-foreground">Browse more cars</Button></a>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container-lux px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <a href="/" className="hover:text-gold transition-colors">Home</a>
          <ChevronRight className="h-3 w-3" />
          <a href="/fleet" className="hover:text-gold transition-colors">Fleet</a>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">Book {car.name}</span>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <form onSubmit={handleSubmit} className="luxury-card p-6 md:p-8 mb-6">
              <div className="flex items-center gap-2 text-gold mb-3">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-[0.25em]">Reservation Request</span>
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-1">Book {car.name}</h1>
              <p className="text-sm text-muted-foreground mb-8">Complete the form below and our team will confirm your booking.</p>

              {/* Customer Information */}
              <fieldset className="space-y-5 mb-8">
                <legend className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Customer Information</legend>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="customerName" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-2">
                      <User className="h-3.5 w-3.5 text-gold" /> Full Name
                    </label>
                    <input id="customerName" type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className={cn('w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors', errors.customerName ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-gold')} placeholder="Enter your full name" />
                    {errors.customerName && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.customerName}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-2">
                      <Phone className="h-3.5 w-3.5 text-gold" /> Phone Number
                    </label>
                    <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={cn('w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors', errors.phone ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-gold')} placeholder="+91 98765 43210" />
                    {errors.phone && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.phone}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="email" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-2">
                      <Mail className="h-3.5 w-3.5 text-gold" /> Email Address
                    </label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={cn('w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors', errors.email ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-gold')} placeholder="you@example.com" />
                    {errors.email && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.email}</p>}
                  </div>
                </div>
              </fieldset>

              {/* Trip Information */}
              <fieldset className="space-y-5 mb-8">
                <legend className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Trip Information</legend>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="pickupCity" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-2">
                      <MapPin className="h-3.5 w-3.5 text-gold" /> Pickup Location
                    </label>
                    <select id="pickupCity" value={pickupCity} onChange={(e) => { setPickupCity(e.target.value); setAvailability(null); }} className={cn('w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors', errors.pickupCity ? 'border-red-500' : 'border-border focus:border-gold')}>
                      <option value="">Select city</option>
                      {CITIES.map((c) => <option key={c.slug} value={c.name}>{c.name}</option>)}
                    </select>
                    {errors.pickupCity && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.pickupCity}</p>}
                  </div>
                  <div>
                    <label htmlFor="dropCity" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-2">
                      <MapPin className="h-3.5 w-3.5 text-gold" /> Drop-off Location
                    </label>
                    <select id="dropCity" value={dropCity} onChange={(e) => { setDropCity(e.target.value); setAvailability(null); }} className={cn('w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors', errors.dropCity ? 'border-red-500' : 'border-border focus:border-gold')}>
                      <option value="">Select city</option>
                      {CITIES.map((c) => <option key={c.slug} value={c.name}>{c.name}</option>)}
                    </select>
                    {errors.dropCity && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.dropCity}</p>}
                  </div>
                  <div>
                    <label htmlFor="pickupDate" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-2">
                      <Calendar className="h-3.5 w-3.5 text-gold" /> Pickup Date
                    </label>
                    <input id="pickupDate" type="date" min={today} value={pickupDate} onChange={(e) => { setPickupDate(e.target.value); setAvailability(null); }} className={cn('w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors', errors.pickupDate ? 'border-red-500' : 'border-border focus:border-gold')} />
                    {errors.pickupDate && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.pickupDate}</p>}
                  </div>
                  <div>
                    <label htmlFor="dropDate" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-2">
                      <Calendar className="h-3.5 w-3.5 text-gold" /> Return Date
                    </label>
                    <input id="dropDate" type="date" min={pickupDate || today} value={dropDate} onChange={(e) => { setDropDate(e.target.value); setAvailability(null); }} className={cn('w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors', errors.dropDate ? 'border-red-500' : 'border-border focus:border-gold')} />
                    {errors.dropDate && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.dropDate}</p>}
                  </div>
                  <div>
                    <label htmlFor="pickupTime" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-2">
                      <Clock className="h-3.5 w-3.5 text-gold" /> Pickup Time
                    </label>
                    <select id="pickupTime" value={pickupTime} onChange={(e) => { setPickupTime(e.target.value); setAvailability(null); }} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold transition-colors">
                      {TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="dropTime" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-2">
                      <Clock className="h-3.5 w-3.5 text-gold" /> Return Time
                    </label>
                    <select id="dropTime" value={dropTime} onChange={(e) => { setDropTime(e.target.value); setAvailability(null); }} className={cn('w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors', errors.dropTime ? 'border-red-500' : 'border-border focus:border-gold')}>
                      {TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {errors.dropTime && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.dropTime}</p>}
                  </div>
                </div>
              </fieldset>

              {/* Service Type */}
              <fieldset className="space-y-4 mb-8">
                <legend className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Service Type</legend>
                {errors.serviceType && <p className="text-xs text-red-500 mb-2 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.serviceType}</p>}
                <div className="grid grid-cols-2 gap-3">
                  {SERVICE_TYPES.map((svc) => {
                    const available = svc.key === 'chauffeur' ? car.chauffeurAvailable : car.selfDrive;
                    return (
                      <button key={svc.key} type="button" disabled={!available} onClick={() => setServiceType(svc.key)} className={cn('flex flex-col items-center gap-2 rounded-xl border py-4 text-sm font-medium transition-all', serviceType === svc.key ? 'border-gold bg-gold/10 text-gold shadow-gold' : 'border-border hover:border-gold/50', !available && 'opacity-40 cursor-not-allowed')}>
                        <span>{svc.label}</span>
                        <span className="text-[10px] text-muted-foreground normal-case">{svc.description}</span>
                        {!available && <span className="text-[10px] text-muted-foreground">(Unavailable)</span>}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {/* Special Requirements */}
              <div className="mb-8">
                <label htmlFor="specialRequirements" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-2">
                  <Tag className="h-3.5 w-3.5 text-gold" /> Special Requirements <span className="text-muted-foreground">(optional)</span>
                </label>
                <textarea id="specialRequirements" value={specialRequirements} onChange={(e) => setSpecialRequirements(e.target.value)} rows={3} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold transition-colors resize-none" placeholder="Any special requests..." />
              </div>

              {/* Coupon */}
              <div className="mb-8">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Coupon code" className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2.5 text-sm focus:border-gold outline-none transition-colors" />
                  </div>
                  <Button type="button" onClick={applyCoupon} variant="outline" size="sm" className="rounded-lg">Apply</Button>
                </div>
                {couponError && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{couponError}</p>}
                {appliedCoupon && <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> {appliedCoupon.label}</p>}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {COUPONS.slice(0, 3).map((c) => (
                    <button key={c.code} type="button" onClick={() => { setCouponCode(c.code); setAppliedCoupon(c); setCouponError(''); }} className="text-[10px] rounded-full border border-dashed border-gold/40 px-2 py-0.5 text-gold hover:bg-gold/5 transition-colors">
                      {c.code}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Error */}
              {submitError && (
                <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold mb-1">Booking failed</p>
                    <p>{submitError}</p>
                  </div>
                </div>
              )}

              {/* Availability Status */}
              {availability && !checkingAvailability && (
                <div className={cn('mb-6 rounded-xl border p-4 text-sm flex items-start gap-3', availability.available ? 'border-green-500/30 bg-green-500/10 text-green-700' : 'border-red-500/30 bg-red-500/10 text-red-700')}>
                  {availability.available ? <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" /> : <X className="h-5 w-5 shrink-0 mt-0.5" />}
                  <div>
                    <p className="font-semibold mb-0.5">{availability.available ? 'Available' : 'Unavailable'}</p>
                    <p className="text-xs opacity-90">{availability.message}</p>
                  </div>
                </div>
              )}

              {checkingAvailability && (
                <div className="mb-6 rounded-xl border border-border bg-muted/30 p-4 text-sm flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-gold" />
                  <span>Checking availability...</span>
                </div>
              )}

              {/* Submit Button */}
              <Button type="submit" disabled={submitting || checkingAvailability} className="btn-gold w-full rounded-full h-12 text-base group">
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    Book Now · ₹{total.toFixed(0)}
                    <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
              {!pickupCity && !dropCity && !pickupDate && !dropDate && (
                <p className="text-xs text-center text-muted-foreground mt-2">Select cities and dates to enable booking</p>
              )}
            </form>
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="lg:sticky lg:top-28 space-y-6">
              {/* Car Summary */}
              <div className="luxury-card p-6">
                <h3 className="font-display text-lg font-bold mb-4">Booking Summary</h3>
                <div className="flex gap-4 mb-5">
                  <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                    <img src={car.image} alt={car.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">{car.brand}</div>
                    <div className="font-semibold leading-tight">{car.name}</div>
                    <Badge className="bg-gold/90 text-[hsl(var(--gold-foreground))] border-0 text-[10px] mt-1">{car.category}</Badge>
                  </div>
                </div>
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Rate</span>
                    <span className="font-semibold">₹{car.pricePerDay.toLocaleString('en-IN')}/day</span>
                  </div>
                  {car.pricePerHour && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Hourly Rate</span>
                      <span className="font-semibold">₹{car.pricePerHour.toLocaleString('en-IN')}/hr</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-semibold">{days > 0 ? `${days} day${days > 1 ? 's' : ''}` : 'Select dates'}</span>
                  </div>
                </div>
              </div>

              {/* Price Estimate */}
              <div className="luxury-card p-6">
                <h3 className="font-display text-lg font-bold mb-4">Price Estimate</h3>
                <div className="space-y-2.5 text-sm">
                  {days > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">₹{car.pricePerDay.toLocaleString('en-IN')} × {days} day{days > 1 ? 's' : ''}</span>
                      <span className="font-semibold">₹{basePrice.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {serviceType === 'chauffeur' && days > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Chauffeur charges</span>
                      <span className="font-semibold">₹{chauffeurPrice.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {discount > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Discount</span>
                      <span className="font-semibold text-green-600">-₹{discount.toFixed(0)}</span>
                    </div>
                  )}
                  <div className="border-t border-border pt-3 mt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Estimated Total</span>
                      <span className="font-bold text-lg text-gold">₹{total.toFixed(0)}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">Includes base rental and 5% GST</p>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="luxury-card p-6">
                <h3 className="font-semibold mb-4">Need Help?</h3>
                <div className="space-y-3">
                  <a href={whatsappLink(`Hello, I need help booking the ${car.name}.`)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border border-border p-3.5 hover:border-gold/50 transition-colors">
                    <MessageCircle className="h-5 w-5 text-[#25D366]" />
                    <div>
                      <div className="text-xs text-muted-foreground">WhatsApp</div>
                      <div className="text-sm font-semibold">{CONTACT.whatsappDisplay}</div>
                    </div>
                  </a>
                  <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 rounded-xl border border-border p-3.5 hover:border-gold/50 transition-colors">
                    <Phone className="h-5 w-5 text-gold" />
                    <div>
                      <div className="text-xs text-muted-foreground">Call us</div>
                      <div className="text-sm font-semibold">{CONTACT.phoneDisplay}</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Cars */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((c, i) => <CarCard key={c.slug} car={c} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
