// Server-side-only. Never prints secrets.
import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';
const env = {};
for (const line of fs.readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
  if (m) env[m[1]] = m[2].trim().replace(/(^'|"$)/g, '');
}
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
const admin = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
function fullError(e){ return e ? { code: e.code, message: e.message, hint: e.hint, details: e.details } : null; }
const r = {};
for (const fn of ['rpc_exec_sql', 'exec_sql', 'sql', 'run_sql', 'supabase_sql', 'p_sql']) {
  const res = await admin.rpc(fn, { query: "SELECT 1" }).select().maybeSingle();
  r[fn] = { error: fullError(res.error), data: res.data };
}
// Also try listing functions via a probe select on pg_proc
const probe = await admin.rpc('create_booking', {}).maybeSingle ? { error: { message: 'rpc exists' } } : null;
r.probe = 'skipped';
console.log(JSON.stringify(r, null, 2));
