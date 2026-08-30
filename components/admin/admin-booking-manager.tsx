'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Calendar, Clock, MapPin, Phone, MessageCircle, Mail,
  ChevronLeft, ChevronRight, User, Star, CheckCircle2, Clock3, X, RefreshCw,
  AlertCircle, Shield, Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface BookingRecord {
  id: string;
  booking_reference: string;
  customer_name: string;
  phone: string;
  email: string | null;
  vehicle: string;
  service_type: string;
  pickup_location: string;
  dropoff_location: string;
  pickup_datetime: string;
  return_datetime: string | null;
  special_requirements: string | null;
  total_price: string | null;
  status: string;
  created_at: string;
  updated_at: string | null;
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const SERVICE_OPTIONS = [
  { value: 'all', label: 'All Services' },
  { value: 'chauffeur', label: 'Chauffeur-driven' },
  { value: 'self-drive', label: 'Self-drive' },
];

const DATE_OPTIONS = [
  { value: 'all', label: 'All Dates' },
  { value: 'today', label: 'Today' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'past', label: 'Past' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'pickup_asc', label: 'Pickup Date (Earliest)' },
  { value: 'pickup_desc', label: 'Pickup Date (Latest)' },
  { value: 'price_desc', label: 'Price (High to Low)' },
  { value: 'price_asc', label: 'Price (Low to High)' },
];

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  confirmed: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  completed: 'bg-green-500/10 text-green-600 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-600 border-red-500/20',
};

const STATUS_ICON: Record<string, React.ElementType> = {
  pending: Clock3,
  confirmed: CheckCircle2,
  completed: CheckCircle2,
  cancelled: X,
};

const VEHICLE_INFO: Record<string, { brand: string; image: string }> = {
  'Toyota Innova Crysta': { brand: 'Toyota', image: '/images/cars/suv.svg' },
  'Toyota Innova Hycross': { brand: 'Toyota', image: '/images/cars/suv.svg' },
  'Toyota Fortuner': { brand: 'Toyota', image: '/images/cars/suv.svg' },
  'Honda City': { brand: 'Honda', image: '/images/cars/sedan.svg' },
  'Hyundai Creta': { brand: 'Hyundai', image: '/images/cars/suv.svg' },
  'Maruti Wagon R': { brand: 'Maruti', image: '/images/cars/economy.svg' },
  'Maruti Swift': { brand: 'Maruti', image: '/images/cars/hatchback.svg' },
  'Maruti Dzire': { brand: 'Maruti', image: '/images/cars/sedan.svg' },
  'BMW 5 Series': { brand: 'BMW', image: '/images/cars/luxury.svg' },
  'Mercedes E Class': { brand: 'Mercedes', image: '/images/cars/luxury.svg' },
  'Mahindra XUV700': { brand: 'Mahindra', image: '/images/cars/suv.svg' },
  'Kia Carens': { brand: 'Kia', image: '/images/cars/suv.svg' },
};

function getVehicleInfo(vehicle: string): { brand: string; image: string } {
  return VEHICLE_INFO[vehicle] || { brand: '', image: '/images/cars/placeholder.svg' };
}

function formatDateTime(dt: string): string {
  if (!dt) return '—';
  const parsed = new Date(dt);
  if (Number.isNaN(parsed.getTime())) return dt;
  return parsed.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDate(dt: string): string {
  if (!dt) return '—';
  const parsed = new Date(dt);
  if (Number.isNaN(parsed.getTime())) return dt;
  return parsed.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatPrice(price: string | null): string {
  if (!price) return '—';
  const num = parseFloat(price);
  if (Number.isNaN(num)) return price;
  return `₹${num.toLocaleString('en-IN')}`;
}

export function AdminBookingManager({ initialBookings }: { initialBookings: BookingRecord[] }) {
  const [bookings, setBookings] = React.useState<BookingRecord[]>(initialBookings);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchInput, setSearchInput] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [serviceFilter, setServiceFilter] = React.useState('all');
  const [dateFilter, setDateFilter] = React.useState('all');
  const [sortOption, setSortOption] = React.useState('newest');
  const [selectedBooking, setSelectedBooking] = React.useState<BookingRecord | null>(null);
  const [loadingStatus, setLoadingStatus] = React.useState<string | null>(null);
  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    if (selectedBooking) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [selectedBooking]);

  const debouncedSearchRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = (query: string) => {
    setSearchInput(query);
    if (debouncedSearchRef.current) clearTimeout(debouncedSearchRef.current);
    debouncedSearchRef.current = setTimeout(() => {
      setSearchQuery(query);
    }, 300);
  };

  const fetchBookings = React.useCallback(async (params: URLSearchParams) => {
    const res = await fetch(`/api/admin/bookings?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      setBookings(data.bookings || []);
    }
  }, []);

  const applyFilters = React.useCallback(async () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (serviceFilter !== 'all') params.set('serviceType', serviceFilter);
    await fetchBookings(params);
  }, [searchQuery, statusFilter, serviceFilter, fetchBookings]);

  const refreshBookings = async () => {
    setRefreshing(true);
    await applyFilters();
    setRefreshing(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    setLoadingStatus(id);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b)));
        if (selectedBooking?.id === id) {
          setSelectedBooking({ ...selectedBooking, status: newStatus });
        }
      }
    } catch (error) {
      console.error('Status update failed:', error);
    } finally {
      setLoadingStatus(null);
    }
  };

  const handleContact = (booking: BookingRecord) => {
    const msg = `Hello, following up on booking ${booking.booking_reference} for ${booking.customer_name}.`;
    window.open(`https://wa.me/${booking.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleEmail = (booking: BookingRecord) => {
    if (booking.email) {
      window.location.href = `mailto:${booking.email}?subject=Booking ${booking.booking_reference} Confirmation`;
    }
  };

  const handleCall = (booking: BookingRecord) => {
    window.location.href = `tel:${booking.phone?.replace(/\s/g, '')}`;
  };

  React.useEffect(() => {
    const handler = setTimeout(() => {
      applyFilters();
    }, 100);
    return () => {
      clearTimeout(handler);
      if (debouncedSearchRef.current) clearTimeout(debouncedSearchRef.current);
    };
  }, [searchQuery, statusFilter, serviceFilter]);

  const resetFilters = () => {
    setSearchInput('');
    setSearchQuery('');
    setStatusFilter('all');
    setServiceFilter('all');
    setDateFilter('all');
    setSortOption('newest');
  };

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'all' || serviceFilter !== 'all' || dateFilter !== 'all';

  // Compute statistics from ALL loaded bookings
  const stats = React.useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const cancelled = bookings.filter(b => b.status === 'cancelled').length;
    const totalRevenue = bookings.reduce((sum, b) => sum + (parseFloat(b.total_price || '0') || 0), 0);
    const confirmedRevenue = bookings.filter(b => b.status === 'confirmed' || b.status === 'completed').reduce((sum, b) => sum + (parseFloat(b.total_price || '0') || 0), 0);
    return { total, pending, confirmed, completed, cancelled, totalRevenue, confirmedRevenue };
  }, [bookings]);

  // Upcoming bookings (confirmed/pending with future pickup)
  const upcomingBookings = React.useMemo(() => {
    const now = new Date();
    return bookings
      .filter(b => (b.status === 'confirmed' || b.status === 'pending') && b.pickup_datetime && new Date(b.pickup_datetime) >= now)
      .sort((a, b) => new Date(a.pickup_datetime).getTime() - new Date(b.pickup_datetime).getTime())
      .slice(0, 5);
  }, [bookings]);

  // Apply date filter
  const applyDateFilter = React.useCallback((bookingList: BookingRecord[]) => {
    if (dateFilter === 'all') return bookingList;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return bookingList.filter(b => {
      if (!b.pickup_datetime) return false;
      const pickup = new Date(b.pickup_datetime);
      if (dateFilter === 'today') {
        return pickup >= today && pickup < tomorrow;
      }
      if (dateFilter === 'upcoming') {
        return pickup >= today;
      }
      if (dateFilter === 'past') {
        return pickup < today;
      }
      return true;
    });
  }, [dateFilter]);

  // Apply sorting
  const applySorting = React.useCallback((bookingList: BookingRecord[]) => {
    const sorted = [...bookingList];
    switch (sortOption) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      case 'pickup_asc':
        return sorted.sort((a, b) => new Date(a.pickup_datetime).getTime() - new Date(b.pickup_datetime).getTime());
      case 'pickup_desc':
        return sorted.sort((a, b) => new Date(b.pickup_datetime).getTime() - new Date(a.pickup_datetime).getTime());
      case 'price_desc':
        return sorted.sort((a, b) => (parseFloat(b.total_price || '0') || 0) - (parseFloat(a.total_price || '0') || 0));
      case 'price_asc':
        return sorted.sort((a, b) => (parseFloat(a.total_price || '0') || 0) - (parseFloat(b.total_price || '0') || 0));
      default:
        return sorted;
    }
  }, [sortOption]);

  const filteredBookings = applySorting(applyDateFilter(bookings));

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container-lux px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-gold mb-2">
              <Shield className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em]">Admin Panel</span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">Booking Management</h1>
            <p className="mt-1 text-sm text-muted-foreground">{bookings.length} booking{bookings.length !== 1 ? 's' : ''} found</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="rounded-full" onClick={refreshBookings} disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />Refresh
            </Button>
          <Button variant="outline" size="sm" className="rounded-full" onClick={async () => {
              await fetch('/api/admin/auth', { method: 'DELETE' });
              window.location.href = '/admin/bookings';
            }}>Sign Out</Button>
          </div>
         </motion.div>

         {/* Dashboard Statistics */}
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
           <div className="luxury-card p-4">
             <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Bookings</div>
             <div className="text-2xl font-bold">{stats.total}</div>
           </div>
           <div className="luxury-card p-4">
             <div className="text-xs text-amber-600 uppercase tracking-wider mb-1">Pending</div>
             <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
           </div>
           <div className="luxury-card p-4">
             <div className="text-xs text-blue-600 uppercase tracking-wider mb-1">Confirmed</div>
             <div className="text-2xl font-bold text-blue-600">{stats.confirmed}</div>
           </div>
           <div className="luxury-card p-4">
             <div className="text-xs text-green-600 uppercase tracking-wider mb-1">Completed</div>
             <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
           </div>
           <div className="luxury-card p-4">
             <div className="text-xs text-red-600 uppercase tracking-wider mb-1">Cancelled</div>
             <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
           </div>
           <div className="luxury-card p-4">
             <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Revenue</div>
             <div className="text-2xl font-bold text-gold">{formatPrice(String(stats.confirmedRevenue))}</div>
           </div>
          </div>

          {/* Upcoming Bookings */}
          {upcomingBookings.length > 0 && (
            <div className="luxury-card p-4 md:p-6 mb-8">
              <h3 className="font-display text-lg font-semibold mb-4">Upcoming Bookings</h3>
              <div className="space-y-3">
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between gap-4 p-3 rounded-xl border border-border/70 hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => setSelectedBooking(booking)}>
                    <div className="flex items-center gap-3">
                      <img src={getVehicleInfo(booking.vehicle).image} alt={booking.vehicle} className="h-10 w-14 rounded-lg object-cover" />
                      <div>
                        <div className="font-medium">{booking.customer_name}</div>
                        <div className="text-xs text-muted-foreground">{booking.vehicle} • {booking.pickup_location}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{formatDate(booking.pickup_datetime)}</div>
                      <Badge className={cn('border text-xs mt-1', STATUS_COLORS[booking.status] || '')}>
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search & Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="luxury-card p-4 md:p-6 mb-8">
          <div className="grid gap-4 md:grid-cols-[2fr_1fr_1fr_auto] items-end gap-4">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-1.5 flex items-center gap-1">
                <Search className="h-3 w-3" /> Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Reference, name, phone, vehicle..."
                  value={searchInput}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                />
              </div>
            </div>

             <div>
               <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-1.5 flex items-center gap-1">
                 <Filter className="h-3 w-3" /> Status
               </label>
               <select
                 value={statusFilter}
                 onChange={(e) => setStatusFilter(e.target.value)}
                 className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold"
               >
                 {STATUS_OPTIONS.map((opt) => (
                   <option key={opt.value} value={opt.value}>{opt.label}</option>
                 ))}
               </select>
             </div>

             <div>
               <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-1.5 flex items-center gap-1">
                 <Tag className="h-3 w-3" /> Service
               </label>
               <select
                 value={serviceFilter}
                 onChange={(e) => setServiceFilter(e.target.value)}
                 className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold"
               >
                 {SERVICE_OPTIONS.map((opt) => (
                   <option key={opt.value} value={opt.value}>{opt.label}</option>
                 ))}
               </select>
             </div>

             <div>
               <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-1.5 flex items-center gap-1">
                 <Calendar className="h-3 w-3" /> Date
               </label>
               <select
                 value={dateFilter}
                 onChange={(e) => setDateFilter(e.target.value)}
                 className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold"
               >
                 {DATE_OPTIONS.map((opt) => (
                   <option key={opt.value} value={opt.value}>{opt.label}</option>
                 ))}
               </select>
             </div>

             <div>
               <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-1.5 flex items-center gap-1">
                 <Filter className="h-3 w-3" /> Sort
               </label>
               <select
                 value={sortOption}
                 onChange={(e) => setSortOption(e.target.value)}
                 className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold"
               >
                 {SORT_OPTIONS.map((opt) => (
                   <option key={opt.value} value={opt.value}>{opt.label}</option>
                 ))}
               </select>
             </div>

             {hasActiveFilters && (
               <button
                 onClick={resetFilters}
                 className="flex items-center justify-center gap-1.5 rounded-xl border border-border px-4 py-2.5 text-sm text-muted-foreground hover:border-gold/50 transition-colors"
               >
                 <X className="h-4 w-4" /> Clear
               </button>
             )}
          </div>
        </motion.div>

        {/* Bookings List / Cards */}
        <AnimatePresence>
          {filteredBookings.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="luxury-card p-12 text-center">
              <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-muted/30 mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">No bookings found</h3>
              <p className="text-sm text-muted-foreground mb-6">Try adjusting your search or filter criteria.</p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={resetFilters} className="rounded-full">Clear Filters</Button>
              )}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
              {/* Desktop Table */}
              <div className="hidden md:block luxury-card overflow-x-auto">
                <table className="w-full min-w-[1000px] text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider text-muted-foreground">Reference</th>
                      <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider text-muted-foreground">Customer</th>
                      <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider text-muted-foreground">Vehicle</th>
                      <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider text-muted-foreground">Service</th>
                      <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider text-muted-foreground">Pickup</th>
                      <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider text-muted-foreground">Return</th>
                      <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider text-muted-foreground">Total</th>
                      <th className="px-4 py-3 text-center font-semibold text-xs uppercase tracking-wider text-muted-foreground">Status</th>
                      <th className="px-4 py-3 text-center font-semibold text-xs uppercase tracking-wider text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <code className="text-xs font-mono text-gold">{booking.booking_reference}</code>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium">{booking.customer_name}</div>
                          <div className="text-xs text-muted-foreground">{booking.phone}</div>
                          {booking.email && <div className="text-xs text-muted-foreground">{booking.email}</div>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium">{booking.vehicle}</div>
                          <div className="text-xs text-muted-foreground">{getVehicleInfo(booking.vehicle).brand}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">{booking.service_type}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{formatDateTime(booking.pickup_datetime)}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{booking.return_datetime ? formatDateTime(booking.return_datetime) : '—'}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{formatPrice(booking.total_price)}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Badge className={cn('border text-xs', STATUS_COLORS[booking.status] || '')}>
                            {booking.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex justify-center gap-1">
                            <button
                              onClick={() => setSelectedBooking(booking)}
                              className="rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-muted hover:text-gold transition-colors"
                              aria-label={`View ${booking.customer_name}"s booking details`}
                            >
                              <Search className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleCall(booking)}
                              className="rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-muted hover:text-gold transition-colors"
                              aria-label={`Call ${booking.customer_name}`}
                            >
                              <Phone className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleContact(booking)}
                              className="rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-muted hover:text-gold transition-colors"
                              aria-label={`WhatsApp ${booking.customer_name}`}
                            >
                              <MessageCircle className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {filteredBookings.map((booking) => (
                  <div key={booking.id} className="luxury-card p-4">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <code className="text-xs font-mono text-gold">{booking.booking_reference}</code>
                      <Badge className={cn('border text-xs', STATUS_COLORS[booking.status] || '')}>
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <img src={getVehicleInfo(booking.vehicle).image} alt={booking.vehicle} className="h-12 w-16 rounded-lg object-cover" />
                      <div>
                        <div className="font-semibold">{booking.vehicle}</div>
                        <div className="text-xs text-muted-foreground">{getVehicleInfo(booking.vehicle).brand} • {booking.service_type}</div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="font-semibold">{booking.customer_name}</div>
                      <div className="text-sm text-muted-foreground">{booking.phone}</div>
                      {booking.email && <div className="text-sm text-muted-foreground">{booking.email}</div>}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div>
                        <span className="text-muted-foreground">Pickup: </span>
                        <span className="font-medium">{formatDate(booking.pickup_datetime)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Return: </span>
                        <span className="font-medium">{booking.return_datetime ? formatDate(booking.return_datetime) : '—'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total: </span>
                        <span className="font-semibold text-gold">{formatPrice(booking.total_price)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Created: </span>
                        <span className="font-medium">{formatDate(booking.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="flex-1 rounded-xl border border-border py-2 text-sm font-medium hover:border-gold/50 transition-colors"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handleCall(booking)}
                        className="flex-1 rounded-xl border border-gold/20 bg-gold/10 py-2 text-sm font-semibold text-gold hover:bg-gold/20 transition-colors"
                      >
                        Call
                      </button>
                      <button
                        onClick={() => handleContact(booking)}
                        className="flex-1 rounded-xl border border-[#25D366]/20 bg-[#25D366]/10 py-2 text-sm font-semibold text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
                      >
                        WhatsApp
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Booking Detail Modal */}
        <AnimatePresence>
          {selectedBooking && (
            <BookingDetailModal
              booking={selectedBooking}
              onClose={() => setSelectedBooking(null)}
              onUpdateStatus={updateStatus}
              loadingStatus={loadingStatus}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function BookingDetailModal({
  booking,
  onClose,
  onUpdateStatus,
  loadingStatus,
}: {
  booking: BookingRecord;
  onClose: () => void;
  onUpdateStatus: (id: string, status: string) => void;
  loadingStatus: string | null;
}) {
  const StatusIcon = STATUS_ICON[booking.status] || Clock3;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 20 }}
        className="luxury-card max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 text-gold mb-2">
                <StatusIcon className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-[0.25em]">
                  {booking.status === 'pending' ? 'Pending Confirmation' :
                   booking.status === 'confirmed' ? 'Confirmed Booking' :
                   booking.status === 'completed' ? 'Completed Booking' :
                   'Cancelled Booking'}
                </span>
              </div>
              <h2 className="font-display text-2xl font-bold">{booking.customer_name}</h2>
              <code className="text-sm text-muted-foreground">{booking.booking_reference}</code>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-8">
            {/* Booking Details */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-display text-lg font-semibold">Customer</h3>
                <div className="rounded-xl border border-border/70 bg-muted/30 p-4 space-y-2">
                  <div className="flex"><span className="text-muted-foreground w-32">Customer Name</span><span className="font-medium">{booking.customer_name}</span></div>
                  <div className="flex"><span className="text-muted-foreground w-32">Phone</span><span className="font-medium">{booking.phone}</span></div>
                  {booking.email && <div className="flex"><span className="text-muted-foreground w-32">Email</span><span className="font-medium">{booking.email}</span></div>}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-display text-lg font-semibold">Trip Details</h3>
                <div className="rounded-xl border border-border/70 bg-muted/30 p-4 space-y-2">
                  <div className="flex"><span className="text-muted-foreground w-32">Vehicle</span><span className="font-medium">{booking.vehicle}</span></div>
                  <div className="flex"><span className="text-muted-foreground w-32">Service Type</span><span className="font-medium capitalize">{booking.service_type}</span></div>
                  <div className="flex"><span className="text-muted-foreground w-32">Pickup Location</span><span className="font-medium">{booking.pickup_location}</span></div>
                  <div className="flex"><span className="text-muted-foreground w-32">Drop-off</span><span className="font-medium">{booking.dropoff_location}</span></div>
                  <div className="flex"><span className="text-muted-foreground w-32">Pickup Date/Time</span><span className="font-medium">{formatDateTime(booking.pickup_datetime)}</span></div>
                  <div className="flex"><span className="text-muted-foreground w-32">Return Date/Time</span><span className="font-medium">{booking.return_datetime ? formatDateTime(booking.return_datetime) : '—'}</span></div>
                </div>
              </div>

              {booking.special_requirements && (
                <div className="space-y-2">
                  <h3 className="font-display text-lg font-semibold">Special Requirements</h3>
                  <div className="rounded-xl border border-border/70 bg-muted/30 p-4">
                    <p className="text-sm">{booking.special_requirements}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => window.location.href = `tel:${booking.phone?.replace(/\s/g, '')}`}
                  className="flex items-center justify-center gap-2 rounded-xl border border-gold/20 bg-gold/10 px-4 py-2.5 text-sm font-semibold text-gold hover:bg-gold/20 transition-colors"
                >
                  <Phone className="h-4 w-4" /> Call Customer
                </button>
                <button
                  onClick={() => window.open(`https://wa.me/${booking.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello, following up on booking ${booking.booking_reference} for ${booking.customer_name}.`)}`, '_blank')}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#25D366]/20 bg-[#25D366]/10 px-4 py-2.5 text-sm font-semibold text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </button>
                {booking.email && (
                  <button
                    onClick={() => window.location.href = `mailto:${booking.email}?subject=Booking ${booking.booking_reference} Confirmation`}
                    className="flex items-center justify-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-500/20 transition-colors"
                  >
                    <Mail className="h-4 w-4" /> Email
                  </button>
                )}
              </div>
            </div>

            {/* Pricing & Status */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-display text-lg font-semibold">Pricing</h3>
                <div className="rounded-xl border border-gold/20 bg-gold/5 p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Price</span>
                    <span className="font-bold text-xl text-gold">{formatPrice(booking.total_price)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Paid amount reflects the value stored at booking time.
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-display text-lg font-semibold">Status Management</h3>
                <div className="rounded-xl border border-border/70 bg-muted/30 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Current Status</span>
                    <Badge className={cn('border', STATUS_COLORS[booking.status] || '')}>
                      {booking.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {['pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => onUpdateStatus(booking.id, status)}
                        disabled={loadingStatus === booking.id || booking.status === status}
                        className={cn(
                          'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                          booking.status === status
                            ? 'border-gold bg-gold/10 text-gold'
                            : 'border-border hover:border-gold/50 hover:bg-gold/5',
                          loadingStatus === booking.id && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        {loadingStatus === booking.id ? 'Updating...' : status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border/70 bg-muted/30 p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium">{formatDateTime(booking.created_at)}</span>
                </div>
                {booking.updated_at && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span className="font-medium">{formatDateTime(booking.updated_at)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
