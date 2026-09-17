// Server-side-only. Never prints secrets.
import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';
const env = {};
for (const line of fs.readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
  if (m) env[m[1]] = m[2].trim().replace(/(^'|"$)/g, '');
}
process.env.SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
process.env.SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const admin = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
const anon = createClient(url, anonKey, { auth: { autoRefreshToken: false, persistSession: false } });

function fullError(e){ return e ? { code: e.code, message: e.message, hint: e.hint, details: e.details } : null; }

async function run(){
  const r = {};
  const cars = await admin.from('cars').select('id').limit(1);
  r.adminCars = { error: fullError(cars.error), count: cars.data?.length };
  const carsAnon = await anon.from('cars').select('id').limit(1);
  r.anonCars = { error: fullError(carsAnon.error), count: carsAnon.data?.length };
  const rv = await admin.from('reviews').select('id').limit(1);
  r.adminReviews = { error: fullError(rv.error) };
  const rvAnon = await anon.from('reviews').select('id, customer_name, email').limit(3);
  r.anonReviews = { error: fullError(rvAnon.error), data: rvAnon.data };
  // bookings table
  const bk = await admin.from('bookings').select('id', { count: 'exact', head: true }).maybeSingle();
  r.adminBookings = { error: fullError(bk.error) };
  console.log(JSON.stringify(r, null, 2));
}
run().catch(e=>{ console.error('ERR', e); process.exit(1); });
