'use client';

import * as React from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, Calendar, Clock, MapPin, Filter, ArrowUpDown } from 'lucide-react';
import { CarCard } from '@/components/fleet/car-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CARS, CATEGORIES, type Category } from '@/lib/data/cars';

const SERVICE_TYPES = [
  { key: 'chauffeur', label: 'Chauffeur-driven' },
  { key: 'self-drive', label: 'Self-drive' },
] as const;

type ServiceType = (typeof SERVICE_TYPES)[number]['key'] | '';

const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name', label: 'Name' },
] as const;

type SortValue = (typeof SORT_OPTIONS[number])['value'];

const AVAILABLE_CITIES = Array.from(new Set(CARS.map(c => c.city).filter(Boolean))) as string[];
const SEATING_OPTIONS = Array.from(new Set(CARS.map(c => c.specs.passengers).filter(Boolean))).sort((a, b) => a - b);

const PRICE_MIN = 2000;
const PRICE_MAX = 50000;
const PRICE_STEP = 1000;

function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

function isValidDateRange(pickupDate: string, returnDate: string): boolean {
  if (!pickupDate || !returnDate) return true;
  return new Date(returnDate) >= new Date(pickupDate);
}

export function FleetPageEnhanced() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialCity = searchParams.get('city') || '';
  const initialFrom = searchParams.get('from') || '';
  const initialTo = searchParams.get('to') || '';

  const [pickupLocation, setPickupLocation] = React.useState(initialCity);
  const [pickupDate, setPickupDate] = React.useState(initialFrom);
  const [pickupTime, setPickupTime] = React.useState('10:00');
  const [returnDate, setReturnDate] = React.useState(initialTo);
  const [returnTime, setReturnTime] = React.useState('10:00');
  const [serviceType, setServiceType] = React.useState<ServiceType>('');
  const [dateError, setDateError] = React.useState<string>('');

  const [activeCats, setActiveCats] = React.useState<Set<Category>>(new Set());
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortBy, setSortBy] = React.useState<SortValue>('recommended');
  const [maxPrice, setMaxPrice] = React.useState(PRICE_MAX);
  const [filterCity, setFilterCity] = React.useState('');
  const [filterServiceType, setFilterServiceType] = React.useState<ServiceType>('');
  const [filterSeating, setFilterSeating] = React.useState<number | ''>('');
  const [showMobileFilters, setShowMobileFilters] = React.useState(false);

  React.useEffect(() => {
    if (initialCity) {
      setPickupLocation(initialCity);
      setFilterCity(initialCity);
    }
  }, [initialCity]);

  const toggleCat = (cat: Category) => {
    setActiveCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const updateURL = React.useCallback(() => {
    const params = new URLSearchParams();
    if (pickupLocation) params.set('city', pickupLocation);
    if (pickupDate) params.set('from', pickupDate);
    if (returnDate) params.set('to', returnDate);
    if (filterCity && filterCity !== pickupLocation) params.set('filterCity', filterCity);
    if (filterServiceType) params.set('service', filterServiceType);
    if (activeCats.size > 0) params.set('categories', Array.from(activeCats).join(','));
    if (searchQuery) params.set('q', searchQuery);
    if (sortBy !== 'recommended') params.set('sort', sortBy);
    if (maxPrice < PRICE_MAX) params.set('maxPrice', String(maxPrice));
    if (filterSeating) params.set('seats', String(filterSeating));
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [pathname, router, pickupLocation, pickupDate, returnDate, filterCity, filterServiceType, activeCats, searchQuery, sortBy, maxPrice, filterSeating]);

  const debouncedUpdateURL = React.useCallback(() => {
    const handler = setTimeout(() => updateURL(), 300);
    return () => clearTimeout(handler);
  }, [updateURL]);

  React.useEffect(() => {
    debouncedUpdateURL();
  }, [debouncedUpdateURL]);

  const timeOptions = React.useMemo(() => {
    const times: string[] = [];
    for (let h = 0; h < 24; h++) {
      times.push(`${String(h).padStart(2, '0')}:00`);
      times.push(`${String(h).padStart(2, '0')}:30`);
    }
    return times;
  }, []);

  const handlePickupDateChange = (date: string) => {
    setPickupDate(date);
    if (returnDate && !isValidDateRange(date, returnDate)) {
      setDateError('Return date cannot be before pickup date');
      setReturnDate('');
    } else {
      setDateError('');
    }
  };

  const handleReturnDateChange = (date: string) => {
    if (!isValidDateRange(pickupDate, date)) {
      setDateError('Return date cannot be before pickup date');
      setReturnDate('');
    } else {
      setDateError('');
      setReturnDate(date);
    }
  };

  const clearAll = () => {
    setActiveCats(new Set());
    setFilterCity('');
    setFilterServiceType('');
    setMaxPrice(PRICE_MAX);
    setFilterSeating('');
    setSearchQuery('');
    setSortBy('recommended');
    setPickupLocation('');
    setPickupDate('');
    setReturnDate('');
    setServiceType('');
    setDateError('');
    setShowMobileFilters(false);
  };

  const handleSearchClick = React.useCallback(() => {
    const results = document.getElementById('fleet-results');
    if (results) {
      results.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  React.useEffect(() => {
    if (!showMobileFilters) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowMobileFilters(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showMobileFilters]);

  const activeFilterLabels = React.useMemo(() => {
    const labels: string[] = [];
    activeCats.forEach((cat) => {
      const found = CATEGORIES.find((c) => c.key === cat);
      if (found) labels.push(found.label);
    });
    if (filterCity) labels.push(`City: ${filterCity}`);
    if (filterServiceType) {
      const found = SERVICE_TYPES.find((s) => s.key === filterServiceType);
      if (found) labels.push(found.label);
    }
    if (filterSeating) labels.push(`${filterSeating} Seater`);
    if (maxPrice < PRICE_MAX) labels.push(`Under ₹${maxPrice.toLocaleString('en-IN')}`);
    if (searchQuery) labels.push(`Search: "${searchQuery}"`);
    return labels;
  }, [activeCats, filterCity, filterServiceType, filterSeating, maxPrice, searchQuery]);

  const hasActiveFilters = activeFilterLabels.length > 0;

  const activeFilterCount = React.useMemo(() => {
    let count = activeCats.size;
    if (filterCity) count++;
    if (filterServiceType) count++;
    if (filterSeating) count++;
    if (maxPrice < PRICE_MAX) count++;
    return count;
  }, [activeCats, filterCity, filterServiceType, filterSeating, maxPrice]);

  const filtered = React.useMemo(() => {
    let result = CARS.filter((car) => {
      if (activeCats.size > 0 && !activeCats.has(car.category)) return false;
      if (filterCity && car.city !== filterCity) return false;
      if (filterServiceType === 'chauffeur' && !car.chauffeurAvailable) return false;
      if (filterServiceType === 'self-drive' && !car.selfDrive) return false;
      if (filterSeating && car.specs.passengers !== filterSeating) return false;
      if (car.pricePerDay > maxPrice) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!car.name.toLowerCase().includes(q) && !car.brand.toLowerCase().includes(q)) return false;
      }
      return true;
    });

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.pricePerDay - b.pricePerDay);
        break;
      case 'price-high':
        result.sort((a, b) => b.pricePerDay - a.pricePerDay);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    return result;
  }, [activeCats, filterCity, filterServiceType, filterSeating, maxPrice, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-background to-background" />
        <div className="relative container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 tracking-tight">Explore Our Premium Fleet</h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              From economy sedans to luxury SUVs, find the perfect car for your journey. Filter by category, city, service type, and price.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        {/* Search & Filter Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="luxury-card p-6 md:p-8 mb-10"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gold/10">
              <Filter className="h-5 w-5 text-gold" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">Search & Filter</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Find the perfect car for your journey</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {/* Pickup Location */}
            <div>
              <label htmlFor="pickup-location" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                <MapPin className="h-3.5 w-3.5 text-gold" /> Pickup Location
              </label>
              <select
                id="pickup-location"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                aria-label="Select pickup location"
              >
                <option value="">All Locations</option>
                {AVAILABLE_CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Pickup Date */}
            <div>
              <label htmlFor="pickup-date" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                <Calendar className="h-3.5 w-3.5 text-gold" /> Pickup Date
              </label>
              <input
                id="pickup-date"
                type="date"
                min={getTodayString()}
                value={pickupDate}
                onChange={(e) => handlePickupDateChange(e.target.value)}
                className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
              />
            </div>

            {/* Pickup Time */}
            <div>
              <label htmlFor="pickup-time" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                <Clock className="h-3.5 w-3.5 text-gold" /> Pickup Time
              </label>
              <select
                id="pickup-time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                aria-label="Select pickup time"
              >
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            {/* Return Date */}
            <div>
              <label htmlFor="return-date" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                <Calendar className="h-3.5 w-3.5 text-gold" /> Return Date
              </label>
              <input
                id="return-date"
                type="date"
                min={pickupDate || getTodayString()}
                value={returnDate}
                onChange={(e) => handleReturnDateChange(e.target.value)}
                className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
              />
              {dateError && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1" role="alert">
                  <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
                  {dateError}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
            {/* Return Time */}
            <div>
              <label htmlFor="return-time" className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                <Clock className="h-3.5 w-3.5 text-gold" /> Return Time
              </label>
              <select
                id="return-time"
                value={returnTime}
                onChange={(e) => setReturnTime(e.target.value)}
                className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                aria-label="Select return time"
              >
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            {/* Service Type */}
            <div>
              <label htmlFor="service-type" className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                <SlidersHorizontal className="h-3.5 w-3.5 text-gold" /> Service Type
              </label>
              <select
                id="service-type"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value as ServiceType)}
                className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
              >
                <option value="">All Service Types</option>
                {SERVICE_TYPES.map((svc) => (
                  <option key={svc.key} value={svc.key}>
                    {svc.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <Button onClick={clearAll} variant="outline" className="rounded-full px-6">
              Clear All
            </Button>
            <Button onClick={handleSearchClick} className="btn-gold rounded-full px-8">
              Search Cars
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters (Desktop) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="luxury-card p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-lg font-bold">Filters</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearAll}
                    className="text-xs text-gold hover:text-gold/80 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gold/20 rounded px-2 py-1"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {activeFilterLabels.length > 0 && (
                <div className="mb-5 flex flex-wrap gap-1.5">
                  {activeFilterLabels.map((label, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px] bg-gold/10 text-gold border-gold/20">
                      {label}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Category */}
              <div className="mb-6">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Category</div>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <label key={cat.key} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={activeCats.has(cat.key)}
                        onChange={() => toggleCat(cat.key)}
                        className="h-4 w-4 rounded border-border accent-gold cursor-pointer"
                      />
                      <span className="text-sm group-hover:text-foreground transition-colors">{cat.label}</span>
                      <span className="text-xs text-muted-foreground ml-auto tabular-nums">
                        {CARS.filter((c) => c.category === cat.key).length}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <hr className="border-border/60 my-5" />

              {/* City */}
              <div className="mb-5">
                <label htmlFor="filter-city" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                  City
                </label>
                <select
                  id="filter-city"
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                >
                  <option value="">All Cities</option>
                  {AVAILABLE_CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Service Type */}
              <div className="mb-5">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Service Type</div>
                <div className="space-y-2">
                  {SERVICE_TYPES.map((svc) => (
                    <label key={svc.key} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="service-type"
                        checked={filterServiceType === svc.key}
                        onChange={() => setFilterServiceType(filterServiceType === svc.key ? '' : svc.key)}
                        className="h-4 w-4 border-border accent-gold cursor-pointer"
                      />
                      <span className="text-sm group-hover:text-foreground transition-colors">{svc.label}</span>
                    </label>
                  ))}
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="service-type"
                      checked={filterServiceType === ''}
                      onChange={() => setFilterServiceType('')}
                      className="h-4 w-4 border-border accent-gold cursor-pointer"
                    />
                    <span className="text-sm group-hover:text-foreground transition-colors">All</span>
                  </label>
                </div>
              </div>

              <hr className="border-border/60 my-5" />

              {/* Seating */}
              <div className="mb-5">
                <label htmlFor="filter-seating" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                  Seating Capacity
                </label>
                <select
                  id="filter-seating"
                  value={filterSeating}
                  onChange={(e) => setFilterSeating(e.target.value ? Number(e.target.value) : '')}
                  className="w-full rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                >
                  <option value="">Any</option>
                  {SEATING_OPTIONS.map((seats) => (
                    <option key={seats} value={seats}>
                      {seats} Seater
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div className="mb-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Max Price: ₹{maxPrice.toLocaleString('en-IN')}/day
                </div>
                <input
                  type="range"
                  min={PRICE_MIN}
                  max={PRICE_MAX}
                  step={PRICE_STEP}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-gold h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-2 tabular-nums">
                  <span>₹{PRICE_MIN.toLocaleString('en-IN')}</span>
                  <span>₹{PRICE_MAX.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div id="fleet-results" className="lg:col-span-3">
            {/* Results toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
              <div className="relative flex-1 w-full sm:max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by car name or brand..."
                  className="w-full rounded-full border border-border bg-card pl-12 pr-4 py-3 text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                  aria-label="Search cars"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Sort dropdown */}
                <div className="relative flex-1 sm:flex-none">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortValue)}
                    className="w-full rounded-full border border-border bg-card pl-4 pr-10 py-3 text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all appearance-none cursor-pointer"
                    aria-label="Sort results"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>

                {/* Mobile filter toggle */}
                <Button
                  variant="outline"
                  className="rounded-full lg:hidden relative"
                  onClick={() => setShowMobileFilters(true)}
                  aria-label="Open filters"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" /> Filters
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gold text-gold-foreground text-[10px] font-bold flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </div>
            </div>

            {/* Result summary */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing{' '}
                <span className="font-semibold text-foreground tabular-nums">{filtered.length}</span> car{filtered.length !== 1 ? 's' : ''}
                {hasActiveFilters && (
                  <span className="ml-1">
                    <button
                      onClick={clearAll}
                      className="text-gold hover:text-gold/80 text-xs ml-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gold/20 rounded px-1"
                    >
                      Clear all filters
                    </button>
                  </span>
                )}
              </p>
            </div>

            {/* Car grid or empty state */}
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="luxury-card p-12 md:p-16 text-center"
              >
                <div className="mb-4">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground/40" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">No cars found</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  We couldn&apos;t find any cars matching your current filters. Try adjusting your search criteria or clearing some filters.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button onClick={clearAll} variant="outline" className="rounded-full">
                    Clear All Filters
                  </Button>
                  <Button onClick={() => setMaxPrice(PRICE_MAX)} variant="outline" className="rounded-full">
                    Reset Price Range
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((car, i) => (
                  <CarCard key={car.slug} car={car} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        <AnimatePresence>
          {showMobileFilters && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setShowMobileFilters(false)}
                aria-hidden="true"
              />

              {/* Drawer */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="fixed inset-y-0 right-0 w-full max-w-sm bg-background z-50 lg:hidden overflow-y-auto shadow-2xl"
                role="dialog"
                aria-modal="true"
                aria-label="Filter options"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display text-xl font-bold">Filters</h2>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="p-2 rounded-full hover:bg-muted transition-colors"
                      aria-label="Close filters"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {hasActiveFilters && (
                    <Button onClick={clearAll} variant="outline" className="w-full mb-6 rounded-full">
                      Clear All Filters
                    </Button>
                  )}

                  {activeFilterLabels.length > 0 && (
                    <div className="mb-6 flex flex-wrap gap-1.5">
                      {activeFilterLabels.map((label, i) => (
                        <Badge key={i} variant="secondary" className="text-[10px] bg-gold/10 text-gold border-gold/20">
                          {label}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Search */}
                  <div className="mb-6">
                    <label htmlFor="mobile-filter-search" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                      Search
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        id="mobile-filter-search"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Car name or brand..."
                        className="w-full rounded-xl border border-border bg-background/60 pl-9 pr-3 py-2.5 text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="mb-6">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Category</div>
                    <div className="space-y-2">
                      {CATEGORIES.map((cat) => (
                        <label key={cat.key} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={activeCats.has(cat.key)}
                            onChange={() => toggleCat(cat.key)}
                            className="h-4 w-4 rounded border-border accent-gold cursor-pointer"
                          />
                          <span className="text-sm group-hover:text-foreground transition-colors">{cat.label}</span>
                          <span className="text-xs text-muted-foreground ml-auto tabular-nums">
                            {CARS.filter((c) => c.category === cat.key).length}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* City */}
                  <div className="mb-6">
                    <label htmlFor="mobile-filter-city" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                      City
                    </label>
                    <select
                      id="mobile-filter-city"
                      value={filterCity}
                      onChange={(e) => setFilterCity(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                    >
                      <option value="">All Cities</option>
                      {AVAILABLE_CITIES.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Service Type */}
                  <div className="mb-6">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Service Type</div>
                    <div className="space-y-2">
                      {SERVICE_TYPES.map((svc) => (
                        <label key={svc.key} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="radio"
                            name="mobile-service-type"
                            checked={filterServiceType === svc.key}
                            onChange={() => setFilterServiceType(filterServiceType === svc.key ? '' : svc.key)}
                            className="h-4 w-4 border-border accent-gold cursor-pointer"
                          />
                          <span className="text-sm group-hover:text-foreground transition-colors">{svc.label}</span>
                        </label>
                      ))}
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="mobile-service-type"
                          checked={filterServiceType === ''}
                          onChange={() => setFilterServiceType('')}
                          className="h-4 w-4 border-border accent-gold cursor-pointer"
                        />
                        <span className="text-sm group-hover:text-foreground transition-colors">All</span>
                      </label>
                    </div>
                  </div>

                  {/* Seating */}
                  <div className="mb-6">
                    <label htmlFor="mobile-filter-seating" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                      Seating Capacity
                    </label>
                    <select
                      id="mobile-filter-seating"
                      value={filterSeating}
                      onChange={(e) => setFilterSeating(e.target.value ? Number(e.target.value) : '')}
                      className="w-full rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                    >
                      <option value="">Any</option>
                      {SEATING_OPTIONS.map((seats) => (
                        <option key={seats} value={seats}>
                          {seats} Seater
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Max Price: ₹{maxPrice.toLocaleString('en-IN')}/day
                    </div>
                    <input
                      type="range"
                      min={PRICE_MIN}
                      max={PRICE_MAX}
                      step={PRICE_STEP}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-gold h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-2 tabular-nums">
                      <span>₹{PRICE_MIN.toLocaleString('en-IN')}</span>
                      <span>₹{PRICE_MAX.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Apply button */}
                  <Button onClick={() => setShowMobileFilters(false)} className="btn-gold w-full rounded-full h-12 mt-4">
                    Apply Filters
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
