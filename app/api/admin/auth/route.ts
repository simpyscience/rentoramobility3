import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ADMIN_TOKEN = process.env.ADMIN_API_KEY || '';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { apiKey } = body || {};

    if (!apiKey || !ADMIN_TOKEN || apiKey !== ADMIN_TOKEN) {
      return NextResponse.json({ success: false, error: 'Invalid credentials.' }, { status: 401 });
    }

    const cookieStore = cookies();
    cookieStore.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return NextResponse.json({ success: true, message: 'Authentication successful.' });
  } catch {
    return NextResponse.json({ success: false, error: 'Authentication failed.' }, { status: 400 });
  }
}

export async function DELETE() {
  const cookieStore = cookies();
  cookieStore.delete('admin_session');
  return NextResponse.json({ success: true, message: 'Signed out.' });
}
