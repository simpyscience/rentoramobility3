import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import type { NextRequest } from 'next/server';

const ALLOWED_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'] as const;
const ALLOWED_SERVICE_TYPES = ['chauffeur', 'self-drive'] as const;

function requireAuth(request: NextRequest): { ok: boolean; response?: NextResponse } {
  const cookie = request.cookies.get('admin_session');
  if (cookie?.value !== 'authenticated') {
    return { ok: false, response: NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 }) };
  }
  return { ok: true };
}

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response!;

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim() || '';
    const status = searchParams.get('status') || '';
    const serviceType = searchParams.get('serviceType') || '';

    let query = supabaseAdmin.from('bookings').select('*', { count: 'exact' });

    if (search) {
      const like = `%${search}%`;
      query = query.or(`customer_name.ilike.${like},phone.ilike.${like},email.ilike.${like},vehicle.ilike.${like},booking_reference.ilike.${like}`);
    }

    if (status && ALLOWED_STATUSES.includes(status as (typeof ALLOWED_STATUSES)[number])) {
      query = query.eq('status', status);
    }

    if (serviceType && ALLOWED_SERVICE_TYPES.includes(serviceType as (typeof ALLOWED_SERVICE_TYPES)[number])) {
      query = query.eq('service_type', serviceType);
    }

    const { data, error } = await query.order('created_at', { ascending: false }).limit(200);

    if (error) {
      console.error('Admin bookings fetch error:', error);
      return NextResponse.json({ success: false, error: 'Unable to fetch bookings.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, bookings: data, count: data?.length || 0 });
  } catch (error) {
    console.error('Admin bookings API error:', error);
    return NextResponse.json({ success: false, error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
