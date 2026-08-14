'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { CarCard } from '@/components/fleet/car-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CARS, CATEGORIES, type Category } from '@/lib/data/cars';

export function FleetPage() {
  const params = useSearchParams();
  const initialCity = params.get('city') || '';

  const [activeCats, setActiveCats] = React.useState<Set<Category>>(new Set());
  const [search, setSearch] = React.useState('');
  const [sortBy, setSortBy] = React.useState<'popular' | 'price-low' | 'price-high' | 'rating'>('popular');
  const [maxPrice, setMaxPrice] = React.useState(50000);
  const [showFilters, setShowFilters] = React.useState(false);

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
    if (search) {
      const q = search.toLowerCase();
      cars = cars.filter((c) => c.name.toLowerCase().includes(q) || c.brand.toLowerCase().includes(q) || c.category.toLowerCase().includes(q));
    }
    switch (sortBy) {
      case 'price-low': cars = [...cars].sort((a, b) => a.pricePerDay - b.pricePerDay); break;
      case 'price-high': cars = [...cars].sort((a, b) => b.pricePerDay - a.pricePerDay); break;
      case 'rating': cars = [...cars].sort((a, b) => b.rating - a.rating); break;
      default: cars = [...cars].sort((a, b) => Number(b.popular) - Number(a.popular));
    }
    return cars;
  }, [activeCats, search, sortBy, maxPrice]);

  const clearAll = () => {
    setActiveCats(new Set());
    setSearch('');
    setMaxPrice(50000);
  };

  return (
    <div className="pt-28 pb-20 min-h-screen">
      {/* Header */}
      <div className="container-lux px-4 sm:px-6 lg:px-8 mb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-xs font-semibold uppercase tracking-[0.25em] text-gold mb-3">Our Fleet</div>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">Premium Cars for Rent in India</h1>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl">
            {filtered.length} vehicles available across economy, premium, SUV, luxury and executive vans.
            {initialCity && ` Showing cars available in ${initialCity}.`}
          </p>
        </motion.div>
      </div>

      <div className="container-lux px-4 sm:px-6 lg:px-8">
        {/* Search + sort bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by car name or brand..."
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

        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          {/* Sidebar Filters */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="sticky top-28 space-y-6">
              <div className="luxury-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Filters</h3>
                  {(activeCats.size > 0 || search || maxPrice < 50000) && (
                    <button onClick={clearAll} className="text-xs text-gold hover:underline">Clear all</button>
                  )}
                </div>

                <div className="mb-6">
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
                        <span className="text-xs text-muted-foreground ml-auto">
                          {CARS.filter((c) => c.category === cat.key).length}
                        </span>
                      </label>
                    ))}
                  </div>
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
          </aside>

          {/* Car grid */}
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
