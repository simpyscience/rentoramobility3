import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import type { NextRequest } from 'next/server';

function requireAuth(request: NextRequest): { ok: boolean; response?: NextResponse } {
  const cookie = request.cookies.get('admin_session');
  if (cookie?.value !== 'authenticated') {
    return { ok: false, response: NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 }) };
  }
  return { ok: true };
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAuth(request);
  if (!auth.ok) return auth.response!;

  try {
    const body = await request.json();
    const { status } = body;

    const allowedStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!status || !allowedStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status.' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('bookings')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Booking status update error:', error);
      return NextResponse.json({ success: false, error: 'Unable to update booking status.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, booking: data, message: 'Status updated.' });
  } catch {
    return NextResponse.json({ success: false, error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
