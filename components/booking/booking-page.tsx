'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ArrowRight, CheckCircle2, Phone, MessageCircle, User, Mail, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CarCard } from '@/components/fleet/car-card';
import { CITIES } from '@/lib/data/site';
import { CONTACT, whatsappLink } from '@/lib/data/contact';
import { getCarBySlug, getRelatedCars, type Car } from '@/lib/data/cars';
import { CountryCodeSelect } from '@/components/ui/country-code-select';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { t } from '@/lib/i18n/dictionary';
import { useLocale } from '@/lib/i18n/client';
import { cn } from '@/lib/utils';

const SERVICE_TYPES = [
  { key: 'local', label: 'Local', description: 'Hourly & city packages' },
  { key: 'outstation', label: 'Outstation', description: 'Long-distance travel' },
  { key: 'airport', label: 'Airport & Transfers', description: 'Pickup & drop' },
  { key: 'wedding', label: 'Wedding', description: 'Weddings & events' },
  { key: 'packages', label: 'Packages', description: 'Custom packages' },
  { key: 'self-drive', label: 'Self-drive', description: 'Drive yourself' },
] as const;

type ServiceType = (typeof SERVICE_TYPES)[number]['key'];

const SERVICE_TYPE_LABELS: Record<string, string> = Object.fromEntries(
  SERVICE_TYPES.map((s) => [s.key, s.label])
);

function formatDisplayDate(dateValue: string): string {
  if (!dateValue) return '—';
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return dateValue;
  return parsed.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function BookingPage({ params }: { params: { slug: string } }) {
  const searchParams = useSearchParams();
  const locale = useLocale();
  const car = getCarBySlug(params.slug);
  const related = car ? getRelatedCars(car) : [];

  const [customerName, setCustomerName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [selectedCountry, setSelectedCountry] = React.useState('IN');
  const [selectedCallingCode, setSelectedCallingCode] = React.useState('91');
  const [pickupCity, setPickupCity] = React.useState(searchParams.get('city') || '');
  const [dropCity, setDropCity] = React.useState(searchParams.get('city') || '');
  const [bookingDate, setBookingDate] = React.useState('');
  const [serviceType, setServiceType] = React.useState<ServiceType | ''>('');
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [bookingRef, setBookingRef] = React.useState('');
  const [submitError, setSubmitError] = React.useState('');

  const today = new Date().toISOString().split('T')[0];

  if (!car) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
         <h1 className="font-display text-2xl font-bold mb-2">{t('booking.noCar', { locale })}</h1>
         <p className="text-muted-foreground mb-4">{t('booking.noCarText', { locale })}</p>
         <a href="/fleet"><Button className="btn-gold rounded-full">{t('booking.backToFleet', { locale })}</Button></a>
        </div>
      </div>
    );
  }

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!customerName.trim()) errs.customerName = t('booking.nameError', { locale });
    if (!email.trim()) errs.email = t('booking.emailRequired', { locale });
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = t('booking.emailError', { locale });
    if (!phone.trim()) errs.phone = t('booking.phoneRequired', { locale });
    else {
      const fullNumber = `+${selectedCallingCode}${phone.trim()}`;
      if (!isValidPhoneNumber(fullNumber)) errs.phone = t('booking.phoneError', { locale });
    }
    if (!pickupCity) errs.pickupCity = t('booking.pickupRequired', { locale });
    if (!dropCity) errs.dropCity = t('booking.dropoffRequired', { locale });
    if (!bookingDate) errs.bookingDate = t('booking.pickupDateRequired', { locale });
    else {
      const d = new Date(bookingDate);
      const todayStart = new Date(today);
      todayStart.setHours(0, 0, 0, 0);
      if (d < todayStart) errs.bookingDate = t('booking.pickupPast', { locale });
    }
    if (!serviceType) errs.serviceType = t('booking.serviceTypeRequired', { locale });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (submitting) return;
    if (!validate()) return;

    setSubmitting(true);
    try {
      const pickupDateObj = new Date(bookingDate);
      const returnDateObj = new Date(pickupDateObj);
      returnDateObj.setDate(returnDateObj.getDate() + 1);
      const pickupDateTime = `${bookingDate}T10:00:00`;
      const returnDateTime = `${returnDateObj.toISOString().split('T')[0]}T10:00:00`;
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName,
          phone: `+${selectedCallingCode}${phone.trim()}`,
          email,
          vehicle: car.name,
          service_type: serviceType === 'self-drive' ? 'self-drive' : 'chauffeur',
          pickup_location: pickupCity,
          dropoff_location: dropCity,
          pickup_datetime: pickupDateTime,
          return_datetime: returnDateTime,
          total_price: car.pricePerDay.toString(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBookingRef(data.booking?.booking_reference || data.booking_reference || '');
        setSubmitted(true);
      } else {
        setSubmitError(data.error || 'Booking request failed. Please try again.');
      }
    } catch {
      setSubmitError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-20">
        <div className="container-lux px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="luxury-card p-6 md:p-12 max-w-2xl mx-auto text-center">
            <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-gold/10 text-gold mb-6">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">{t('booking.confirmedTitle', { locale })}</h1>
            <p className="text-muted-foreground mb-8">{t('booking.confirmedBody', { locale })}</p>

            <div className="rounded-2xl border border-border bg-muted/30 p-6 space-y-3 text-sm text-left mb-8">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('booking.bookingReference', { locale })}</span>
                <span className="font-semibold text-gold">{bookingRef}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('booking.vehicle', { locale })}</span>
                <span className="font-semibold">{car.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('booking.service', { locale })}</span>
                <span className="font-semibold">{SERVICE_TYPE_LABELS[serviceType] ?? 'Self-drive'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('booking.pickup', { locale })}</span>
                <span className="font-semibold">{pickupCity} · {formatDisplayDate(bookingDate)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('booking.dropoff', { locale })}</span>
                <span className="font-semibold">{dropCity}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a href={whatsappLink(`Hello, I have booked ${car.name}. Booking ref: ${bookingRef}. Pickup: ${pickupCity} on ${formatDisplayDate(bookingDate)}. Return: ${dropCity}.`)} target="_blank" rel="noopener noreferrer" aria-label="Confirm booking via WhatsApp" className="flex-1">
                <Button className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white rounded-full">
                  <MessageCircle className="h-4 w-4 mr-2" /> {t('ai.confirmWhatsApp', { locale })}
                </Button>
              </a>
              <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`} aria-label="Call Rentora Mobility to confirm" className="flex-1">
                <Button variant="outline" className="w-full rounded-full">
                  <Phone className="h-4 w-4 mr-2" /> {t('booking.callRentora', { locale })}
                </Button>
              </a>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a href="/fleet" aria-label="Browse more cars in our fleet" className="flex-1">
                <Button variant="ghost" className="w-full rounded-full">{t('booking.browseFleet', { locale })}</Button>
              </a>
              <a href="/contact" aria-label="Contact Rentora Mobility" className="flex-1">
                <Button variant="outline" className="w-full rounded-full">{t('nav.contact', { locale })}</Button>
              </a>
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
          <a href="/" className="hover:text-gold transition-colors">{t('nav.home', { locale })}</a>
          <ChevronRight className="h-3 w-3" />
          <a href="/fleet" className="hover:text-gold transition-colors">{t('nav.fleet', { locale })}</a>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{t('booking.bookCar', { locale, vars: { car: car.name } })}</span>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <form onSubmit={handleSubmit} className="luxury-card p-6 md:p-8">
              <div className="flex items-center gap-2 text-gold mb-3">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-[0.25em]">{t('booking.reservationRequest', { locale })}</span>
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-1">{t('booking.bookCar', { locale, vars: { car: car.name } })}</h1>
              <p className="text-sm text-muted-foreground mb-8">{t('booking.completeForm', { locale })}</p>

              <fieldset className="space-y-5 mb-6">
                <legend className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">{t('booking.clientDetails', { locale })}</legend>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="customerName" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-2">
                      <User className="h-3.5 w-3.5 text-gold" /> {t('booking.fullName', { locale })}
                    </label>
                    <input id="customerName" type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className={cn('w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors', errors.customerName ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-gold')} placeholder={t('booking.fullNamePlaceholder', { locale })} />
                    {errors.customerName && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.customerName}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-2">
                      <Mail className="h-3.5 w-3.5 text-gold" /> {t('booking.email', { locale })}
                    </label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={cn('w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors', errors.email ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-gold')} placeholder={t('booking.emailPlaceholder', { locale })} />
                    {errors.email && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.email}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="phone" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-2">
                      <Phone className="h-3.5 w-3.5 text-gold" /> {t('booking.phone', { locale })}
                    </label>
                    <div className="flex items-stretch gap-2">
                      <CountryCodeSelect
                        value={selectedCountry}
                        onChange={(code, callingCode) => { setSelectedCountry(code); setSelectedCallingCode(callingCode); }}
                        error={!!errors.phone}
                      />
                      <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={cn('flex-1 rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors', errors.phone ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-gold')} placeholder={t('booking.phonePlaceholder', { locale })} />
                    </div>
                    {errors.phone && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.phone}</p>}
                  </div>
                </div>
              </fieldset>

              <fieldset className="space-y-5 mb-6">
                <legend className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">{t('booking.tripInfo', { locale })}</legend>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="pickupCity" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-2">
                      <MapPin className="h-3.5 w-3.5 text-gold" /> {t('booking.pickupLocation', { locale })}
                    </label>
                    <select id="pickupCity" value={pickupCity} onChange={(e) => setPickupCity(e.target.value)} className={cn('w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors', errors.pickupCity ? 'border-red-500' : 'border-border focus:border-gold')}>
                      <option value="">{t('booking.selectCity', { locale })}</option>
                      {CITIES.map((c) => <option key={c.slug} value={c.name}>{c.name}</option>)}
                    </select>
                    {errors.pickupCity && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.pickupCity}</p>}
                  </div>
                  <div>
                    <label htmlFor="dropCity" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-2">
                      <MapPin className="h-3.5 w-3.5 text-gold" /> {t('booking.dropoffLocation', { locale })}
                    </label>
                    <select id="dropCity" value={dropCity} onChange={(e) => setDropCity(e.target.value)} className={cn('w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors', errors.dropCity ? 'border-red-500' : 'border-border focus:border-gold')}>
                      <option value="">{t('booking.selectCity', { locale })}</option>
                      {CITIES.map((c) => <option key={c.slug} value={c.name}>{c.name}</option>)}
                    </select>
                    {errors.dropCity && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.dropCity}</p>}
                  </div>
                  <div>
                    <label htmlFor="bookingDate" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-2">
                      <Calendar className="h-3.5 w-3.5 text-gold" /> {t('booking.bookingDate', { locale })}
                    </label>
                    <input id="bookingDate" type="date" min={today} value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} className={cn('w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors', errors.bookingDate ? 'border-red-500' : 'border-border focus:border-gold')} />
                    {errors.bookingDate && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.bookingDate}</p>}
                  </div>
                  <div className="flex flex-col justify-end">
                    <label htmlFor="serviceType" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-2">
                      <MapPin className="h-3.5 w-3.5 text-gold" /> {t('booking.serviceType', { locale })}
                    </label>
                    <select id="serviceType" value={serviceType} onChange={(e) => setServiceType(e.target.value as ServiceType)} className={cn('w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors', errors.serviceType ? 'border-red-500' : 'border-border focus:border-gold')}>
                      <option value="">{t('booking.selectService', { locale })}</option>
                      {SERVICE_TYPES.map((svc) => (
                        <option key={svc.key} value={svc.key}>{svc.label}</option>
                      ))}
                    </select>
                    {errors.serviceType && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.serviceType}</p>}
                  </div>
                </div>
              </fieldset>

              {submitError && (
                <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold mb-1">{t('booking.bookingFailed', { locale })}</p>
                    <p>{submitError}</p>
                  </div>
                </div>
              )}

              <Button type="submit" disabled={submitting} className="btn-gold w-full rounded-full h-12 text-base group">
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" /> {t('booking.submitting', { locale })}
                  </>
                ) : (
                  <>
                    {t('booking.submitRequest', { locale })}
                    <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="lg:sticky lg:top-28 space-y-6">
              {/* Car Summary */}
              <div className="luxury-card p-6">
                <h3 className="font-display text-lg font-bold mb-4">{t('booking.summary.bookingSummary', { locale })}</h3>
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
                {serviceType && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">{t('booking.serviceType', { locale })}:</span>{' '}
                    <span className="font-semibold">{SERVICE_TYPE_LABELS[serviceType]}</span>
                  </div>
                )}
              </div>

              {/* Contact */}
              <div className="luxury-card p-6">
                <h3 className="font-semibold mb-4">{t('booking.summary.needHelp', { locale })}</h3>
                <div className="space-y-3">
                  <a href={whatsappLink(`Hello, I need help with a booking inquiry. Car: ${car.name}.`)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Rentora Mobility for help" className="flex items-center gap-3 rounded-xl border border-border p-3.5 hover:border-gold/50 transition-colors focus-within:ring-2 focus-within:ring-gold">
                    <MessageCircle className="h-5 w-5 text-[#25D366]" />
                    <div>
                      <div className="text-xs text-muted-foreground">{t('common.whatsApp', { locale })}</div>
                      <div className="text-sm font-semibold">{CONTACT.whatsappDisplay}</div>
                    </div>
                  </a>
                  <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`} aria-label="Call Rentora Mobility" className="flex items-center gap-3 rounded-xl border border-border p-3.5 hover:border-gold/50 transition-colors focus-within:ring-2 focus-within:ring-gold">
                    <Phone className="h-5 w-5 text-gold" />
                    <div>
                      <div className="text-xs text-muted-foreground">{t('booking.callUs', { locale })}</div>
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
            <h2 className="font-display text-2xl font-bold mb-6">{t('booking.relatedHeading', { locale })}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((c, i) => <CarCard key={c.slug} car={c} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
