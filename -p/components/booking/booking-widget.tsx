'use client';

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, MapPin, Calendar, Clock, ArrowRight, User, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountryCodeSelect } from "@/components/ui/country-code-select";
import { CITIES } from "@/lib/data/site";
import { t } from "@/lib/i18n/dictionary";
import { useLocale } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

const SERVICE_TYPES = [
  { key: 'local', label: 'Local', description: 'Hourly & city packages' },
  { key: 'outstation', label: 'Outstation', description: 'Long-distance travel' },
  { key: 'airport', label: 'Airport & Transfers', description: 'Pickup & drop' },
  { key: 'wedding', label: 'Wedding', description: 'Weddings & events' },
  { key: 'packages', label: 'Packages', description: 'Custom packages' },
  { key: 'self-drive', label: 'Self-drive', description: 'Drive yourself' },
] as const;

const TIMES = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

export function BookingWidget({ variant = 'hero' }: { variant?: 'hero' | 'compact' | 'default' }) {
  const router = useRouter();
  const locale = useLocale();
  const [fullName, setFullName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [pickupCity, setPickupCity] = React.useState('');
  const [dropCity, setDropCity] = React.useState('');
  const [pickupDate, setPickupDate] = React.useState('');
  const [dropDate, setDropDate] = React.useState('');
  const [pickupTime, setPickupTime] = React.useState('10:00');
  const [dropTime, setDropTime] = React.useState('10:00');
  const [serviceType, setServiceType] = React.useState('');
  const [specialRequirements, setSpecialRequirements] = React.useState('');
  const [selectedCountry, setSelectedCountry] = React.useState('IN');
  const [selectedCallingCode, setSelectedCallingCode] = React.useState('91');

  const today = new Date().toISOString().split('T')[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (fullName) params.set('name', fullName);
    if (phone) params.set('phone', phone);
    if (email) params.set('email', email);
    if (pickupCity) params.set('city', pickupCity);
    if (pickupDate) params.set('from', pickupDate);
    if (dropDate) params.set('to', dropDate);
    if (serviceType) params.set('service', serviceType);
    router.push(`/fleet?${params.toString()}`);
  };

  const fields: {
    icon: typeof MapPin;
    label: string;
    value: string;
    set: (v: string) => void;
    options?: string[];
    placeholder?: string;
    type?: 'select' | 'date' | 'text' | 'tel' | 'email';
    min?: string;
  }[] = [
    { icon: MapPin, label: 'Pickup Location', value: pickupCity, set: setPickupCity, options: CITIES.map((c) => c.name), placeholder: 'Select city' },
    { icon: MapPin, label: 'Drop-off Location', value: dropCity, set: setDropCity, options: CITIES.map((c) => c.name), placeholder: 'Select city' },
    { icon: Calendar, label: 'Pickup Date', value: pickupDate, set: setPickupDate, type: 'date', min: today, placeholder: 'Select date' },
    { icon: Clock, label: 'Pickup Time', value: pickupTime, set: setPickupTime, options: TIMES, placeholder: 'Select time' },
    { icon: Calendar, label: 'Return Date', value: dropDate, set: setDropDate, type: 'date', min: pickupDate || today, placeholder: 'Select date' },
    { icon: Clock, label: 'Return Time', value: dropTime, set: setDropTime, options: TIMES, placeholder: 'Select time' },
  ];

  // Full booking form variant (homepage)
  if (variant === 'default') {
    return (
      <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-luxury p-5 sm:p-6 md:p-8">
        {/* Client Details */}
        <div className="mb-6">
          <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            {t('booking.clientDetails', { locale })}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FieldInput icon={User} label={t('booking.fullName', { locale })} value={fullName} set={setFullName} placeholder={t('booking.fullNamePlaceholder', { locale })} type="text" default />
            <FieldInput icon={Mail} label={t('booking.email', { locale })} value={email} set={setEmail} placeholder={t('booking.emailPlaceholder', { locale })} type="email" default />
            <div className="flex items-end gap-2">
              <CountryCodeSelect
                value={selectedCountry}
                onChange={(code, callingCode) => { setSelectedCountry(code); setSelectedCallingCode(callingCode); }}
              />
              <div className="flex-1">
                <FieldInput icon={Phone} label={t('booking.phone', { locale })} value={phone} set={setPhone} placeholder={t('booking.phonePlaceholder', { locale })} type="tel" default />
              </div>
            </div>
          </div>
        </div>

        {/* Trip Information */}
        <div className="mb-6">
          <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            {t('booking.tripInfo', { locale })}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldInput icon={MapPin} label={t('booking.pickupLocation', { locale })} value={pickupCity} set={setPickupCity} options={CITIES.map((c) => c.name)} placeholder={t('booking.selectCity', { locale })} default />
            <FieldInput icon={MapPin} label={t('booking.dropoffLocation', { locale })} value={dropCity} set={setDropCity} options={CITIES.map((c) => c.name)} placeholder={t('booking.selectCity', { locale })} default />
            <FieldInput icon={Calendar} label={t('booking.bookingDate', { locale })} value={pickupDate} set={setPickupDate} type="date" min={today} placeholder={t('booking.selectDate', { locale })} default />
            <div>
              <label htmlFor="serviceType" className="block text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-1.5">
                <MapPin className="h-4 w-4 text-gold" /> {t('booking.serviceType', { locale })}
              </label>
              <select id="serviceType" value={serviceType} onChange={(e) => setServiceType(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors">
                <option value="">{t('booking.selectService', { locale })}</option>
                {SERVICE_TYPES.map((svc) => (
                  <option key={svc.key} value={svc.key}>{svc.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <Button type="submit" className="btn-gold w-full rounded-xl h-12 text-base group">
          {t('common.bookNow', { locale })}
          <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
        </Button>
      </form>
    );
  }

  if (variant === 'hero') {
    return (
      <form onSubmit={handleSearch} className="bg-white rounded-2xl md:rounded-3xl shadow-luxury p-5 md:p-7 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <FieldInput icon={Search} label="Full Name" value={fullName} set={setFullName} placeholder="Enter your full name" type="text" hero />
          <FieldInput icon={Search} label="Mobile Number" value={phone} set={setPhone} placeholder="+91 98765 43210" type="tel" hero />
          <FieldInput icon={Search} label="Email Address" value={email} set={setEmail} placeholder="you@example.com" type="email" hero />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {fields.map((f, i) => (
            <FieldInput key={i} {...f} hero />
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <div className="col-span-2 md:col-span-1">
            <label className="block">
              <span className="text-xs font-medium text-foreground/70 font-semibold normal-case tracking-normal flex items-center gap-1.5 mb-1.5">
                <Search className="h-4 w-4 text-gold" /> Service Type
              </span>
              <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} className="w-full rounded-xl border-0 bg-muted/50 px-3 py-3 text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors appearance-none">
                <option value="">Select</option>
                <option value="self-drive">Self Drive</option>
                <option value="chauffeur">With Chauffeur</option>
              </select>
            </label>
          </div>
          <div className="col-span-2 md:col-span-2">
            <FieldInput icon={Search} label="Special Requirements (optional)" value={specialRequirements} set={setSpecialRequirements} placeholder="Any special requests?" type="text" hero />
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <Button type="submit" className="btn-gold rounded-full px-8 h-12 text-base group w-full sm:w-auto">
            <ArrowRight className="h-5 w-5 mr-2" /> Book Now
            <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </form>
    );
  }

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSearch} className="glass rounded-2xl p-4 shadow-luxury">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <FieldInput icon={Search} label="Full Name" value={fullName} set={setFullName} placeholder="Full name" type="text" compact />
          <FieldInput icon={Search} label="Mobile Number" value={phone} set={setPhone} placeholder="+91 98765 43210" type="tel" compact />
          <FieldInput icon={Search} label="Email Address" value={email} set={setEmail} placeholder="you@example.com" type="email" compact />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {fields.map((f, i) => (
            <FieldInput key={i} {...f} compact />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          <div>
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <Search className="h-3.5 w-3.5 text-gold" /> Service Type
              </span>
              <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} className="w-full rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors appearance-none">
                <option value="">Select</option>
                <option value="self-drive">Self Drive</option>
                <option value="chauffeur">With Chauffeur</option>
              </select>
            </label>
          </div>
          <FieldInput icon={Search} label="Special Requirements (optional)" value={specialRequirements} set={setSpecialRequirements} placeholder="Special requests?" type="text" compact />
        </div>
        <Button type="submit" className="btn-gold w-full mt-3 rounded-xl">
          <Search className="h-4 w-4 mr-2" /> Book Now
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <FieldInput icon={Search} label="Full Name" value={fullName} set={setFullName} placeholder="Enter your full name" type="text" />
        <FieldInput icon={Search} label="Mobile Number" value={phone} set={setPhone} placeholder="+91 98765 43210" type="tel" />
        <FieldInput icon={Search} label="Email Address" value={email} set={setEmail} placeholder="you@example.com" type="email" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {fields.map((f, i) => (
          <FieldInput key={i} {...f} />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <Search className="h-3.5 w-3.5 text-gold" /> Service Type
            </span>
            <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} className="w-full rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors appearance-none">
              <option value="">Select</option>
              <option value="self-drive">Self Drive</option>
              <option value="chauffeur">With Chauffeur</option>
            </select>
          </label>
        </div>
        <FieldInput icon={Search} label="Special Requirements (optional)" value={specialRequirements} set={setSpecialRequirements} placeholder="Any special requests?" type="text" />
      </div>
      <Button type="submit" className="btn-gold w-full mt-5 rounded-xl h-12 text-base group">
        <Search className="h-5 w-5 mr-2" /> Book Now
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
  default: isDefault,
}: {
  icon: any;
  label: string;
  value: string;
  set: (v: string) => void;
  options?: string[];
  placeholder?: string;
  type?: 'select' | 'date' | 'text' | 'tel' | 'email';
  min?: string;
  compact?: boolean;
  hero?: boolean;
  default?: boolean;
}) {
  return (
    <label className={`block ${hero ? '' : isDefault ? 'text-base' : ''}`}>
      <span className={`text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-1.5 ${hero ? 'text-foreground/70 font-semibold normal-case tracking-normal' : isDefault ? 'text-foreground/80 font-medium normal-case' : ''}`}>
        <Icon className={`h-3.5 w-3.5 text-gold ${hero ? 'h-4 w-4' : isDefault ? 'h-4 w-4' : ''}`} /> {label}
      </span>
      {type === 'date' ? (
        <input
          type="date"
          value={value}
          min={min}
          onChange={(e) => set(e.target.value)}
          className={`w-full rounded-xl border border-border focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors text-sm ${
            isDefault
              ? 'bg-background px-4 py-3 h-12'
              : hero
                ? 'border-0 bg-muted/50 py-3'
                : compact
                  ? 'bg-background/60 px-3 py-2.5'
                  : 'bg-background/60 px-3 py-2.5'
          }`}
        />
      ) : type === 'text' || type === 'tel' || type === 'email' ? (
        <input
          type={type}
          value={value}
          onChange={(e) => set(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-xl border border-border focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors text-sm ${
            isDefault
              ? 'bg-background px-4 py-3 h-12'
              : hero
                ? 'border-0 bg-muted/50 py-3'
                : compact
                  ? 'bg-background/60 px-3 py-2.5'
                  : 'bg-background/60 px-3 py-2.5'
          }`}
        />
      ) : (
        <div className="relative">
          <select
            value={value}
            onChange={(e) => set(e.target.value)}
            className={`w-full rounded-xl border border-border focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors text-sm appearance-none ${
            isDefault
              ? 'bg-background px-4 py-3 h-12 pr-10'
              : hero
                ? 'border-0 bg-muted/50 py-3 pr-10'
                : compact
                  ? 'bg-background/60 px-3 py-2.5'
                  : 'bg-background/60 px-3 py-2.5'
          }`}
          >
            <option value="">{placeholder}</option>
            {options?.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <div className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground ${hero ? 'top-[calc(50%-2px)]' : isDefault ? 'top-[calc(50%-2px)]' : 'top-[calc(50%-8px)]'}`}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>
      )}
    </label>
  );
}
