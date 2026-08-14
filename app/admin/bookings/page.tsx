import { cookies } from 'next/headers';
import { AdminLogin } from '@/components/admin/admin-login';
import { AdminBookingManager, type BookingRecord } from '@/components/admin/admin-booking-manager';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const metadata = {
  title: 'Booking Management — Rentora Admin',
  description: 'Manage customer bookings for Rentora Mobility.',
};

async function fetchBookings(): Promise<BookingRecord[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) {
      console.error('Failed to fetch bookings:', error);
      return [];
    }

    return (data || []) as BookingRecord[];
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    return [];
  }
}

export default async function AdminBookingsPage() {
  const cookieStore = cookies();
  const session = cookieStore.get('admin_session');

  if (!session || session.value !== 'authenticated') {
    return <AdminLogin />;
  }

  const bookings = await fetchBookings();
  return <AdminBookingManager initialBookings={bookings} />;
}
