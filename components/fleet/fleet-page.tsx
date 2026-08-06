'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Sparkles, Fuel, Gauge, Users, FilterX, MapPin } from 'lucide-react';
import { CarCard } from '@/components/fleet/car-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CARS, CATEGORIES, type Category } from '@/lib/data/cars';

type CarWithLocations = {
  locations?: string[];
};

export function FleetPage() {
  const params = useSearchParams();
  const initialCity = params.get('city') || '';

  const [activeCats, setActiveCats] = React.useState<Set<Category>>(new Set());
  const [search, setSearch] = React.useState('');
  const [sortBy, setSortBy] = React.useState<'popular' | 'price-low' | 'price-high' | 'rating'>('popular');
  const [maxPrice, setMaxPrice] = React.useState(50000);
  const [showFilters, setShowFilters] = React.useState(false);
  const [fuelFilter, setFuelFilter] = React.useState('All');
  const [transmissionFilter, setTransmissionFilter] = React.useState('All');
  const [availabilityFilter, setAvailabilityFilter] = React.useState('All');
  const [minSeats, setMinSeats] = React.useState(0);
  const [locationFilter, setLocationFilter] = React.useState(initialCity || 'All');

  React.useEffect(() => {
    setLocationFilter(initialCity || 'All');
  }, [initialCity]);

  const fuelOptions = React.useMemo(() => Array.from(new Set(CARS.map((car) => car.specs.fuel))).sort(), []);
  const transmissionOptions = React.useMemo(() => Array.from(new Set(CARS.map((car) => car.specs.transmission))).sort(), []);
  const availabilityOptions = React.useMemo(() => Array.from(new Set(CARS.map((car) => car.availability))).sort(), []);
  const locationOptions = React.useMemo(() => Array.from(new Set(CARS.flatMap((car) => (car as CarWithLocations).locations || []))).sort(), []);

  const toggleCat = (cat: Category) => {
    setActiveCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const filtered = React.useMemo(() => {
    let cars = CARS.filter((c) => c.pricePerDay <= maxPrice);
    if (activeCats.size > 0) cars = cars.filter((c) => activeCats.has(c.category));
    if (fuelFilter !== 'All') cars = cars.filter((c) => c.specs.fuel === fuelFilter);
    if (transmissionFilter !== 'All') cars = cars.filter((c) => c.specs.transmission === transmissionFilter);
    if (availabilityFilter !== 'All') cars = cars.filter((c) => c.availability === availabilityFilter);
    if (minSeats > 0) cars = cars.filter((c) => c.specs.passengers >= minSeats);
    if (locationFilter !== 'All') cars = cars.filter((c) => (c as CarWithLocations).locations?.includes(locationFilter));
    if (search) {
      const q = search.toLowerCase();
      cars = cars.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        c.brand.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (c as CarWithLocations).locations?.some((loc) => loc.toLowerCase().includes(q))
      );
    }
    switch (sortBy) {
      case 'price-low': cars = [...cars].sort((a, b) => a.pricePerDay - b.pricePerDay); break;
      case 'price-high': cars = [...cars].sort((a, b) => b.pricePerDay - a.pricePerDay); break;
      case 'rating': cars = [...cars].sort((a, b) => b.rating - a.rating); break;
      default: cars = [...cars].sort((a, b) => Number(b.popular) - Number(a.popular));
    }
    return cars;
  }, [activeCats, search, sortBy, maxPrice, fuelFilter, transmissionFilter, availabilityFilter, minSeats, locationFilter]);

  const clearAll = () => {
    setActiveCats(new Set());
    setSearch('');
    setMaxPrice(50000);
    setFuelFilter('All');
    setTransmissionFilter('All');
    setAvailabilityFilter('All');
    setMinSeats(0);
    setLocationFilter(initialCity || 'All');
  };

  const hasActiveFilters = activeCats.size > 0 || search || maxPrice < 50000 || fuelFilter !== 'All' || transmissionFilter !== 'All' || availabilityFilter !== 'All' || minSeats > 0 || locationFilter !== 'All';

  return (
    <div className="pt-28 pb-20 min-h-screen">
      <div className="container-lux px-4 sm:px-6 lg:px-8 mb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-border/60 bg-gradient-to-br from-card via-card to-gold/5 p-6 md:p-8 shadow-luxury">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.25em] text-gold mb-3">Our Fleet</div>
              <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight">Premium Cars for Rent in India</h1>
              <p className="mt-4 text-muted-foreground text-lg max-w-2xl">
                {filtered.length} vehicles available across economy, premium, SUV, luxury, EVs and executive vans.
                {initialCity && ` Showing cars available in ${initialCity}.`}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-gold/90 text-[hsl(var(--gold-foreground))] border-0">100+ Inventory</Badge>
              <Badge variant="outline" className="border-gold/30 text-gold">Hourly & Daily Rates</Badge>
              <Badge variant="outline" className="border-border">Live Availability Ready</Badge>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="container-lux px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by model, brand, city or feature..."
              className="w-full rounded-full border border-border bg-card pl-12 pr-4 py-3 text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-full border border-border bg-card px-4 py-3 text-sm focus:border-gold outline-none cursor-pointer"
          >
            <option value="popular">Most Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
          <Button variant="outline" className="rounded-full md:hidden" onClick={() => setShowFilters(!showFilters)}>
            <SlidersHorizontal className="h-4 w-4 mr-2" /> Filters
          </Button>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="sticky top-28 space-y-6">
              <div className="luxury-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4 text-gold" /> Filters</h3>
                  {hasActiveFilters && (
                    <button onClick={clearAll} className="text-xs text-gold hover:underline flex items-center gap-1"><FilterX className="h-3.5 w-3.5" /> Clear</button>
                  )}
                </div>

                <div className="mb-5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Category</div>
                  <div className="space-y-2">
                    {CATEGORIES.map((cat) => (
                      <label key={cat.key} className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={activeCats.has(cat.key)}
                          onChange={() => toggleCat(cat.key)}
                          className="h-4 w-4 rounded border-border accent-gold"
                        />
                        <span className="text-sm group-hover:text-gold transition-colors">{cat.label}</span>
                        <span className="text-xs text-muted-foreground ml-auto">{CARS.filter((c) => c.category === cat.key).length}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2"><Fuel className="h-3.5 w-3.5 text-gold" /> Fuel Type</label>
                    <select value={fuelFilter} onChange={(e) => setFuelFilter(e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:border-gold outline-none">
                      <option value="All">All fuel types</option>
                      {fuelOptions.map((fuel) => <option key={fuel} value={fuel}>{fuel}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2"><Gauge className="h-3.5 w-3.5 text-gold" /> Transmission</label>
                    <select value={transmissionFilter} onChange={(e) => setTransmissionFilter(e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:border-gold outline-none">
                      <option value="All">All transmissions</option>
                      {transmissionOptions.map((transmission) => <option key={transmission} value={transmission}>{transmission}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2"><Users className="h-3.5 w-3.5 text-gold" /> Minimum Seats</label>
                    <select value={minSeats} onChange={(e) => setMinSeats(Number(e.target.value))} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:border-gold outline-none">
                      <option value={0}>Any size</option>
                      <option value={4}>4+ seats</option>
                      <option value={5}>5+ seats</option>
                      <option value={7}>7+ seats</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-gold" /> Location</label>
                    <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:border-gold outline-none">
                      <option value="All">All locations</option>
                      {locationOptions.map((location) => <option key={location} value={location}>{location}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Availability</label>
                    <select value={availabilityFilter} onChange={(e) => setAvailabilityFilter(e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:border-gold outline-none">
                      <option value="All">Any availability</option>
                      {availabilityOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </div>

                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Max Price: ₹{maxPrice.toLocaleString('en-IN')}/day
                    </div>
                    <input
                      type="range"
                      min={2000}
                      max={50000}
                      step={1000}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-gold"
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div>
            {filtered.length === 0 ? (
              <div className="luxury-card p-16 text-center">
                <p className="text-muted-foreground mb-4">No cars match your filters.</p>
                <Button onClick={clearAll} variant="outline" className="rounded-full">Clear Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((car, i) => (
                  <CarCard key={car.slug} car={car} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
