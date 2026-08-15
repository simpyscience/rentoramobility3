'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Tag, CheckCircle2, Phone, MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CITIES } from '@/lib/data/site';
import { COUPONS } from '@/lib/data/site';
import { CONTACT, whatsappLink } from '@/lib/data/contact';
import type { Car } from '@/lib/data/cars';
import { cn } from '@/lib/utils';

const TIMES = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

export function BookingCalculator({ car }: { car: Car }) {
  const [pickupCity, setPickupCity] = React.useState('');
  const [dropCity, setDropCity] = React.useState('');
  const [pickupDate, setPickupDate] = React.useState('');
  const [dropDate, setDropDate] = React.useState('');
  const [pickupTime, setPickupTime] = React.useState('10:00');
  const [dropTime, setDropTime] = React.useState('10:00');
  const [chauffeur, setChauffeur] = React.useState(!car.selfDrive);
  const [couponCode, setCouponCode] = React.useState('');
  const [appliedCoupon, setAppliedCoupon] = React.useState<{ code: string; discount: number; maxDiscount: number; label: string } | null>(null);
  const [couponError, setCouponError] = React.useState('');
  const [confirmed, setConfirmed] = React.useState(false);

  const today = new Date().toISOString().split('T')[0];

  const days = React.useMemo(() => {
    if (!pickupDate || !dropDate) return 1;
    const d1 = new Date(pickupDate);
    const d2 = new Date(dropDate);
    const diff = Math.max(1, Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
    return diff;
  }, [pickupDate, dropDate]);

  const basePrice = car.pricePerDay * days;
  const chauffeurPrice = chauffeur ? 500 * days : 0;
  const subtotal = basePrice + chauffeurPrice;
  const discount = appliedCoupon ? Math.min((subtotal * appliedCoupon.discount) / 100, appliedCoupon.maxDiscount) : 0;
  const gst = (subtotal - discount) * 0.05;
  const total = subtotal - discount + gst;

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

  const handleBook = () => {
    setConfirmed(true);
  };

  const whatsappMessage = `Hello Rentora Mobility, I'd like to book:
Car: ${car.name}
Pickup: ${pickupCity} on ${pickupDate} at ${pickupTime}
Drop: ${dropCity} on ${dropDate} at ${dropTime}
Chauffeur: ${chauffeur ? 'Yes' : 'No'}
Days: ${days}
Total: ₹${total.toFixed(0)}`;

  if (confirmed) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="luxury-card p-6">
        <div className="text-center mb-6">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-green-500/10 text-green-600 mb-4">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="font-display text-2xl font-bold">Booking Confirmed!</h3>
          <p className="text-sm text-muted-foreground mt-2">Your booking request has been received. Our team will confirm shortly.</p>
        </div>

        <div className="rounded-xl bg-muted/50 p-4 space-y-2 text-sm mb-6">
          <Row label="Car" value={car.name} />
          <Row label="Pickup" value={`${pickupCity} · ${pickupDate} · ${pickupTime}`} />
          <Row label="Return" value={`${dropCity} · ${dropDate} · ${dropTime}`} />
          <Row label="Duration" value={`${days} day${days > 1 ? 's' : ''}`} />
          <Row label="Chauffeur" value={chauffeur ? 'Yes' : 'No (Self Drive)'} />
          {appliedCoupon && <Row label="Coupon" value={appliedCoupon.code} />}
          <div className="border-t border-border pt-2 mt-2">
            <Row label="Total" value={`₹${total.toFixed(0)}`} bold />
          </div>
        </div>

        <a href={whatsappLink(whatsappMessage)} target="_blank" rel="noopener noreferrer" aria-label="Confirm booking via WhatsApp">
          <Button className="w-full rounded-xl bg-[#25D366] hover:bg-[#25D366]/90 text-white mb-2">
            <MessageCircle className="h-4 w-4 mr-2" /> Confirm via WhatsApp
          </Button>
        </a>
        <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`} aria-label="Call to confirm booking">
          <Button variant="outline" className="w-full rounded-xl">
            <Phone className="h-4 w-4 mr-2" /> Call to Confirm
          </Button>
        </a>
        <a href="/fleet" aria-label="Browse more cars">
          <Button variant="outline" className="w-full rounded-xl mt-2">
            Browse Fleet
          </Button>
        </a>
      </motion.div>
    );
  }

  return (
    <div className="luxury-card p-6">
      <h3 className="font-display text-xl font-bold mb-1">Book This Car</h3>
      <p className="text-sm text-muted-foreground mb-5">Instant quote · No hidden charges</p>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field icon={MapPin} label="Pickup City" type="select" value={pickupCity} set={setPickupCity} options={CITIES.map((c) => c.name)} placeholder="Select" />
          <Field icon={MapPin} label="Drop City" type="select" value={dropCity} set={setDropCity} options={CITIES.map((c) => c.name)} placeholder="Select" />
          <Field icon={Calendar} label="Pickup Date" type="date" value={pickupDate} set={setPickupDate} min={today} />
          <Field icon={Calendar} label="Return Date" type="date" value={dropDate} set={setDropDate} min={pickupDate || today} />
          <Field icon={Clock} label="Pickup Time" type="select" value={pickupTime} set={setPickupTime} options={TIMES} />
          <Field icon={Clock} label="Return Time" type="select" value={dropTime} set={setDropTime} options={TIMES} />
        </div>

        {car.selfDrive && car.chauffeurAvailable && (
          <div className="flex items-center gap-3 rounded-xl border border-border p-3">
            <button
              onClick={() => setChauffeur(!chauffeur)}
              className={cn('flex-1 rounded-lg py-2 text-sm font-medium transition-colors', !chauffeur ? 'btn-gold' : 'text-muted-foreground hover:bg-muted')}
            >
              Self Drive
            </button>
            <button
              onClick={() => setChauffeur(!chauffeur)}
              className={cn('flex-1 rounded-lg py-2 text-sm font-medium transition-colors', chauffeur ? 'btn-gold' : 'text-muted-foreground hover:bg-muted')}
            >
              With Chauffeur
            </button>
          </div>
        )}

        {/* Price breakdown */}
        <div className="rounded-xl bg-muted/40 p-4 space-y-2 text-sm">
          <Row label={`₹${car.pricePerDay.toLocaleString('en-IN')} × ${days} day${days > 1 ? 's' : ''}`} value={`₹${basePrice.toLocaleString('en-IN')}`} />
          {chauffeur && <Row label="Chauffeur charges" value={`₹${chauffeurPrice.toLocaleString('en-IN')}`} />}
          {discount > 0 && <Row label="Discount" value={`-₹${discount.toFixed(0)}`} green />}
          <Row label="GST (5%)" value={`₹${gst.toFixed(0)}`} />
          <div className="border-t border-border pt-2 mt-2">
            <Row label="Total" value={`₹${total.toFixed(0)}`} bold />
          </div>
        </div>

        {/* Coupon */}
        <div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Coupon code"
                className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2.5 text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
              />
            </div>
            <Button onClick={applyCoupon} variant="outline" size="sm" className="rounded-lg">Apply</Button>
          </div>
          {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
          {appliedCoupon && <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> {appliedCoupon.label}</p>}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {COUPONS.slice(0, 3).map((c) => (
              <button key={c.code} onClick={() => { setCouponCode(c.code); setAppliedCoupon(c); setCouponError(''); }} className="text-[10px] rounded-full border border-dashed border-gold/40 px-2 py-0.5 text-gold hover:bg-gold/5 transition-colors">
                {c.code}
              </button>
            ))}
          </div>
        </div>

        <Button onClick={handleBook} disabled={!pickupCity || !dropCity || !pickupDate || !dropDate} className="btn-gold w-full rounded-xl h-12 group">
          Book Now · ₹{total.toFixed(0)}
          <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
        </Button>
        {!pickupCity && <p className="text-xs text-center text-muted-foreground">Select cities and dates to book</p>}
      </div>
    </div>
  );
}

function Row({ label, value, bold, green }: { label: string; value: string; bold?: boolean; green?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={cn(bold ? 'font-bold' : 'text-muted-foreground')}>{label}</span>
      <span className={cn(bold && 'font-bold text-lg text-gold', green && 'text-green-600 font-semibold')}>{value}</span>
    </div>
  );
}

function Field({ icon: Icon, label, value, set, type = 'select', options, placeholder, min }: { icon: any; label: string; value: string; set: (v: string) => void; type?: 'select' | 'date'; options?: string[]; placeholder?: string; min?: string }) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1 mb-1">
        <Icon className="h-3 w-3 text-gold" /> {label}
      </span>
      {type === 'date' ? (
        <input type="date" value={value} min={min} onChange={(e) => set(e.target.value)} className="w-full rounded-lg border border-border bg-background px-2.5 py-2 text-sm focus:border-gold outline-none transition-colors" />
      ) : (
        <select value={value} onChange={(e) => set(e.target.value)} className="w-full rounded-lg border border-border bg-background px-2.5 py-2 text-sm focus:border-gold outline-none transition-colors">
          <option value="">{placeholder}</option>
          {options?.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      )}
    </label>
  );
}
